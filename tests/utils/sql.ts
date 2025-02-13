import SSH from 'simple-ssh';
import dotenv from 'dotenv';

dotenv.config();

export async function cat2_PostgreSQL(sqlCommand: string): Promise<Record<string, any>[]> {
  const sshConfig = {
    host: String(process.env.CAT2_POSTGRESQL_SSH_HOST),
    port: Number(process.env.CAT2_POSTGRESQL_SSH_PORT),
    user: String(process.env.CAT2_POSTGRESQL_SSH_USER),
    pass: String(process.env.CAT2_POSTGRESQL_SSH_PASS),
  };

  const dbConfig = {
    host: String(process.env.CAT2_POSTGRESQL_DB_HOST),
    user: String(process.env.CAT2_POSTGRESQL_DB_USER),
    database: String(process.env.CAT2_POSTGRESQL_DB_NAME_SIT),
    password: String(process.env.CAT2_POSTGRESQL_DB_PASSWORD),
  };

  const command = `PGPASSWORD=${dbConfig.password} psql -h ${dbConfig.host} -U ${dbConfig.user} -d ${dbConfig.database} -c \"${sqlCommand}\" --no-align --field-separator '\t'`;

  async function executeSSHCommand(): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
      const ssh = new SSH(sshConfig);

      const timeout = setTimeout(() => {
        ssh.end();
        reject(new Error('SSH command timed out'));
      }, 10000);

      ssh.exec(command, {
        out: (stdout) => {
          clearTimeout(timeout);
          if (stdout.includes("UPDATE")) {
            resolve([{ message: "Update successful", result: stdout.trim() }]);
          } else {
            const rows = stdout.trim().split('\n').filter(row => row.trim() !== '');
            const filteredRows = rows.slice(0, -1);

            if (filteredRows.length === 0) {
              resolve([]);
              return;
            }

            const headers = filteredRows[0].split('\t').map(header => header.trim());
            const dataRows = filteredRows.slice(1);

            const formattedResult = dataRows.map(row => {
              const values = row.split('\t').map(value => value.trim());
              return headers.reduce((obj, header, index) => {
                let parsedValue = values[index] || null;

                if (parsedValue && (header === 'request_json' || header === 'response_json')) {
                  try {
                    parsedValue = JSON.parse(parsedValue);
                  } catch (error) {
                    console.error(`Failed to parse JSON for field ${header}:`, error);
                  }
                }

                obj[header] = parsedValue;
                return obj;
              }, {} as Record<string, any>);
            });

            resolve(formattedResult);
          }
        },
        err: (stderr) => {
          clearTimeout(timeout);
          reject(new Error(`SSH error: ${stderr}`));
        },
      }).start();
    });
  }

  try {
    return await executeSSHCommand();
  } catch (error) {
    console.warn('First attempt failed. Retrying...', error);
    return await executeSSHCommand();
  }
}
