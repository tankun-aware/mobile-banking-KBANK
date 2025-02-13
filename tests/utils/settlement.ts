import { aisReport, common, data, expectDb, mockMobilebanking, paymentOrderValidators, sql } from '../fixtures/import';
import { test, expect, Page, request } from '@playwright/test';

export async function updateSettlementTriggerFlag(flag: any) {
    const sqlCommandUpdateData = `
      UPDATE paymobilebanking.service
      SET settlement_trigger_flag = ${flag}
      WHERE service_id = '${data.serviceID_data}' 
        AND merchant_id = '${data.merchantID_data}';
    `;
    await sql.cat2_PostgreSQL(sqlCommandUpdateData);
    const sqlCommandRecheckData = `
      SELECT * 
      FROM paymobilebanking.service 
      WHERE service_id = '${data.serviceID_data}' 
        AND merchant_id = '${data.merchantID_data}';
    `;
    const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
    const upDateItem = result[0];
    const expect_sqlCommandRecheckData = `settlement_trigger_flag = ${flag}`;
    const testStep = async () => {
      await aisReport.addContext(
        `UPDATE paymobilebanking.service SET settlement_trigger_flag = ${flag}`,
        {
          service_id: upDateItem.service_id,
          merchant_id: upDateItem.merchant_id,
          settlement_trigger_flag: upDateItem.settlement_trigger_flag,
        }
      );
    };
    await aisReport.addTestStep(
      `UPDATE settlement_trigger_flag = ${flag}`,
      testStep,
      JSON.stringify(expect_sqlCommandRecheckData)
    );
  }

export async function queryPeriodTime() {
    const sqlCommandRecheckData = `
      SELECT * 
      FROM paymobilebanking.service 
      WHERE service_id = '${data.serviceID_data}' and merchant_id = '${data.merchantID_data}'
    `;
    const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
    const upDateItem = result[0];
    const period_time_auto_trigger = (upDateItem.period_time_auto_trigger)
    const testStep = async () => {
      await aisReport.addContext(
        `Query period_time_auto_trigger: `,
        {
          period_time_auto_trigger: upDateItem.period_time_auto_trigger,
        }
      );
    };
    await aisReport.addTestStep(
      `Query period_time_auto_trigger`,
      testStep,
      JSON.stringify(upDateItem.period_time_auto_trigger)
    );
    return period_time_auto_trigger
}

export function formatDate(days: number = 0) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}