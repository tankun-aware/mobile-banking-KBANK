import { aisReport, common, data,enquiryValidators, expectDb, paymentOrder, paymentOrderValidators, sql } from '../fixtures/import';
import { test, expect, request } from '@playwright/test';

export async function enquiryAPI(request: any, params: any, expectCode:any = '', channelSecret: string = data.channelSecret, nonce:string | null = (common.timestamp()).toString(), medthod = 'post') {
    const url = `${data.baseURL_1}${data.enquiry_path}`;

    const requestBody = {
        "txn_id": (params.txn_id !== undefined) ? params.txn_id : data.txnId_enquiry_data,
        "order_id": (params.order_id !== undefined) ? params.order_id : data.orderId_enquiry_data,
    }


    if (params && typeof params === 'object') {
        Object.keys(params).forEach((key) => {
            if (params[key] === 'DELETE_FIELD') {
                delete requestBody[key];
            }
        });
    }
    
    const trueSignature = common.signature(requestBody, nonce, channelSecret);
    const requestHeaders = {
            "X-sdpg-nonce": (params["X-sdpg-nonce"] !== undefined) ? params["X-sdpg-nonce"] : nonce,
            "X-sdpg-merchant-id": (params["X-sdpg-merchant-id"] !== undefined) ? params["X-sdpg-merchant-id"] : data.X_sdpg_merchant_id_data,
            "X-sdpg-signature": params["X-sdpg-signature"] !== undefined ? params["X-sdpg-signature"] : trueSignature,
    };
    Object.keys(params).forEach((key) => {
        if (params[key] === 'DELETE_FIELD') {
            delete requestHeaders[key];
        }
    });
    
    const response = await common.api(request, url, requestHeaders, requestBody, medthod);
    const testStep = async () => {
        await common.TwoHundredStatus(response.status);
        await common.commonReport(url, requestHeaders, requestBody, response.headers, response.body); 
    }
    await aisReport.addTestStep('POST Enquiry API', testStep, expectCode);
    return {
        url,
        response,
        requestHeaders,
        requestBody
    };
}

export async function enquiryPatchData_SUCCESS_TEST(page:any, request:any, status: 'SUCCESS' | 'FAIL' | 'PENDING') {
    const { 
        paymentOrderApiResponse,
        requestHeaders,
        requestBody
    } = await paymentOrder.completePayment_SUCCESS(page, request);

    await expectDb.patchPaymentStatus(paymentOrderApiResponse.body.txn_id, status);
    const { response: enquiryApiResponse } = await enquiryAPI(
        request, 
        {
            txn_id: paymentOrderApiResponse.body.txn_id,
            order_id: paymentOrderApiResponse.body.order_id
        },
        enquiryValidators.expect_enquiry
    );
    await enquiryValidators.expect_enquiry(
        requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
        paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'SUCCESS', 'SR0000', 'Success', 'notnull', true, 'CONFIRMED'
    );
    await expectDb.expectDb_completePayment_phase(
        requestHeaders, requestBody, paymentOrderApiResponse, 'SUCCESS', 'notnull', null,
        'SR0000', 'Success', 'notnull', null, 'notnull', 'CONFIRMED', 'notnull', 'System',
        'SUCCESS', '0000', 'SUCCESS'
    );
}

export async function enquiryPatchData_FAIL_TEST(page:any, request:any, status: 'SUCCESS' | 'FAIL' | 'PENDING') {
    const { 
        paymentOrderApiResponse,
        requestHeaders,
        requestBody
    } = await paymentOrder.completePayment_SUCCESS(page, request);

    await expectDb.patchPaymentStatus(paymentOrderApiResponse.body.txn_id, status);
    const { response: enquiryApiResponse } = await enquiryAPI(
        request, 
        {
            txn_id: paymentOrderApiResponse.body.txn_id,
            order_id: paymentOrderApiResponse.body.order_id
        },
        enquiryValidators.expect_enquiry
    );
    await enquiryValidators.expect_enquiry(
        requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
        paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'FAIL', 'SR20001', 'Amount Mismatch', null, true, 'PENDING'
    );
    await expectDb.expectDb_completePayment_phase(
        requestHeaders, requestBody, paymentOrderApiResponse, 'FAIL', null, 'notnull', 'SR20001',
        'Amount Mismatch', 'notnull', null, null,'PENDING', null, null, 'FAIL', '0003', 'FAIL'
    );
}


export async function enquiryPatchData_PENDING_TEST(page:any, request:any, status: 'SUCCESS' | 'FAIL' | 'PENDING') {
    const { 
        response: paymentOrderApiResponse,
        requestHeaders,
        requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(paymentOrderApiResponse, requestBody);

    await expectDb.patchPaymentStatus(paymentOrderApiResponse.body.txn_id, status);
    const { response: enquiryApiResponse } = await enquiryAPI(
        request, 
        {
            txn_id: paymentOrderApiResponse.body.txn_id,
            order_id: paymentOrderApiResponse.body.order_id
        }, 
        enquiryValidators.expect_enquiry
    );
    await enquiryValidators.expect_enquiry(
        requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
        paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'PENDING', 'SR0000', 'Transaction not found', null, true, 'PENDING'
    );
    await expectDb.expectDb_beforeOpenLink_phase(requestHeaders, requestBody, paymentOrderApiResponse);
    
}

export async function changeTxn(merchant_id:string, order_id:string, newTxn:string) {
    const testStep = async () => {
        const updateBase = `
            UPDATE paymobilebanking.transaction_payment_base
            SET payment_id = '${newTxn}'
            WHERE merchant_id = '${merchant_id}' AND order_id = '${order_id}';
        `
        const updateMob = `
            UPDATE sofmobilebanking.transaction_payment_mob
            SET payment_id = '${newTxn}'
            WHERE merchant_id = '${merchant_id}' AND order_id = '${order_id}';
        `
        
        await aisReport.addContext('SQL Command', updateBase);
        await aisReport.addContext('SQL Command', updateMob);
    
        await sql.cat2_PostgreSQL(updateBase);
        await sql.cat2_PostgreSQL(updateMob);

        const queryBase = `SELECT * FROM paymobilebanking.transaction_payment_base WHERE payment_id = '${newTxn}'`;
        const queryMob = `SELECT * FROM sofmobilebanking.transaction_payment_mob WHERE payment_id = '${newTxn}'`;
        const resultBase = await sql.cat2_PostgreSQL(queryBase);
        const resultMob = await sql.cat2_PostgreSQL(queryMob);
        expect(resultBase[0].payment_id).toBe(newTxn);
        expect(resultMob[0].payment_id).toBe(newTxn);
    }
    await aisReport.addTestStep('UPDATE NEW TXN', testStep, 'expect(resultBase[0].payment_id).toBe(newTxn);\nexpect(resultMob[0].payment_id).toBe(newTxn);');

} 