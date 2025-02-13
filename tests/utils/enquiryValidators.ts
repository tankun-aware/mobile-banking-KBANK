import { test, expect } from '@playwright/test';

export async function expect_enquiry(
    requestPaymentOrder: Record<string,any>, 
    rquestHeadersPaymentOrder: Record<string,any>, 
    responsePaymentOrder: Record<string,any>,
    responseEnquiry: Record<string,any>, 
    txn_id:string,
    txn_type:string, 
    status: 'SUCCESS' | 'FAIL' | 'PENDING',
    status_code: string,
    status_message:string | null,
    success_at: null | 'notnull',
    is_auto_settlement: true | false,
    settlement_status: string
) {
    expect(responseEnquiry.status).toBe(200);
    expect(String(responseEnquiry.body.order_id)).toBe(String(requestPaymentOrder.order_id));
    expect(responseEnquiry.body.merchant_id).toBe(rquestHeadersPaymentOrder["X-sdpg-merchant-id"]);
    expect(responseEnquiry.body.txn_id).toBe(txn_id);
    expect(responseEnquiry.body.txn_type).toBe(txn_type);
    expect(responseEnquiry.body.sof_type).toBe('SOF_INTERNET_BANKING');
    expect(responseEnquiry.body.status).toBe(status);
    expect(responseEnquiry.body.status_code).toBe(status_code);
    expect(responseEnquiry.body.status_message).toBe(status_message);
    expect(Number(responseEnquiry.body.amount)).toBe(Number(requestPaymentOrder.amount));
    expect(Number(responseEnquiry.body.amount_net)).toBe(Number(requestPaymentOrder.amount) + Number(responsePaymentOrder.body.amount_cust_fee));
    expect(Number(responseEnquiry.body.amount_cust_fee)).toBe(Number(responsePaymentOrder.body.amount_cust_fee));
    expect(responseEnquiry.body.currency).toBe(requestPaymentOrder.currency);
    expect(responseEnquiry.body.service_id).toBe(requestPaymentOrder.service_id);
    expect(responseEnquiry.body.channel_type).toBe(requestPaymentOrder.channel_type);
    expect(responseEnquiry.body.cust_id).toBe(requestPaymentOrder.cust_id);
    expect(responseEnquiry.body.metadata.key1).toBe(requestPaymentOrder.metadata.key1);
    expect(responseEnquiry.body.metadata.key2).toBe(requestPaymentOrder.metadata.key2);
    expect(responseEnquiry.body.bank.bank_code).toBe(requestPaymentOrder.bank_code);
    expect(responseEnquiry.body.created_at).not.toBeNull();

    if (success_at === 'notnull') { 
        expect(responseEnquiry.body.success_at).not.toBeNull();
    } else if (success_at === null) {
        expect(responseEnquiry.body).not.toHaveProperty('success_at');
    }
    expect(responseEnquiry.body.settlement.is_auto_settlement).toBe(is_auto_settlement);
    expect(responseEnquiry.body.settlement.settlement_status).toBe(settlement_status);
    expect(responseEnquiry.body.ref_1).toBe(requestPaymentOrder.ref_1);
    expect(responseEnquiry.body.ref_2).toBe(requestPaymentOrder.ref_2);
    expect(responseEnquiry.body.ref_3).toBe(requestPaymentOrder.ref_3);
    expect(responseEnquiry.body.ref_4).toBe(requestPaymentOrder.ref_4);
    expect(responseEnquiry.body.ref_5).toBe(requestPaymentOrder.ref_5);
}

export async function expect_nonce_INVALID_REQUEST(response: Record<string,any>) {
    expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
    expect(response.body).toHaveProperty('error', 'error invalid hash signature');
}

export async function expect_merchant_id_INVALID_REQUEST(response: Record<string,any>) {
    expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
    expect(response.body).toHaveProperty('error', 'error secret-key not found for merchant');
}

export async function expect_X_sdpg_signature_INVALID_REQUEST(response: Record<string,any>) {
    expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
    expect(response.body).toHaveProperty('error', 'error invalid hash signature');
}


export async function expect_txn_id_or_order_id_Required(response: Record<string,any>) {
    expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
    expect(response.body).toHaveProperty('error', 'txn_id or order_id is required');    
}

export async function expect_INVALID_REQUEST(response: Record<string,any>) {
    expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
    expect(response.body).toHaveProperty('error', 'invalid arguments');    
}


export async function expect_txn_id_TXN_NOT_FOUND(response: Record<string,any>) {
    expect(response.body).toHaveProperty('error_code', 'TXN_NOT_FOUND');
    expect(response.body).toHaveProperty('error', 'Transaction not found');
}


export async function expect_order_id_TXN_NOT_FOUND(response: Record<string,any>) {
    expect(response.body).toHaveProperty('error_code', 'TXN_NOT_FOUND');
    expect(response.body).toHaveProperty('error', 'Transaction not found');
}

export async function signature_fail(response: Record<string,any>) {
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Gateway exception');
    expect(response.body.error_code).toBe('VALIDATE_REQUEST_SIGNATURE_FAILED');
}

export async function MissingHeader(response: Record<string,any>) {
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Gateway exception');
    expect(response.body.error_code).toBe('MISSING_SECURITY_CONTEXT');
}

export async function merchantNotFound(response: Record<string,any>, merchantId:string) {
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(`error secret-key not found for merchant ${merchantId}`);
    expect(response.body.error_code).toBe('VALIDATE_REQUEST_SIGNATURE_FAILED');
}


