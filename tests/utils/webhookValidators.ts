import { test, expect } from '@playwright/test';

export async function expectSuccess (response:Record<string, any>) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/;
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'PENDING');
    expect(response.body).toHaveProperty('message', 'Success');
    expect(response.body.order_id).not.toBeNull();
    expect(response.body.txn_id).not.toBeNull();
    expect(response.body.created_at).toMatch(dateRegex);
};

// {
//     "responseStatus": {
//         "respSts": "SUCCESS",
//         "respSysCd": "1000",
//         "respSysDesc": null
//     },
//     "data": null
// }

export async function name(response:Record<string, any>) {
    
}