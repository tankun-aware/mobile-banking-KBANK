import { test, expect } from '@playwright/test';
import { aisReport, common, settlement, sql} from '../fixtures/import';

export async function expect_transaction_payment_mob(
    requestHeaders: Record<string, any>,
    requestBody: Record<string, any>,
    response:Record<string, any>,
    transactionPaymentMob: Record<string, any>,
    payment_status: string | null,
    payment_modified_by: string | null,
    payment_status_success_datetime: 'notnull' | null,
    payment_status_fail_datetime: 'notnull' | null,
    deeplink_flag: string | null,
    payment_cust_fee_id: string | null,
    payment_cust_vat_fee_amt: string | null,
    payment_cust_fee_rate: string | null,
    payment_cust_fee_rate_type: string | null,
    payment_cust_fee_net_amt: string | null,
    payment_mer_sof_id: string | null,
    payment_mer_fee_id: string | null,
    bank_ref_1: string | null,
    bank_ref_2: string | null,
    issuer_bank_name: string | null,
    transaction_sof_rate_type: string | null,
    transaction_gw_status: string | null,
    transaction_gw_desc: string | null,
    bank_profile_metadata: string | null,
    bank_resp_status: string | null,
    bank_resp_code: string | null,
    bank_resp_msg: string | null,
    bank_ref_no: 'notnull' | null,
    bank_txn_datetime: 'notnull' | null,
    token_expire_datetime: 'notnull' | null,
    bank_redirect_url: 'notnull' | null,
    bank_url_expired_datetime: 'notnull' | null,
    callback_type: string | null,
    bank_order_id: 'notnull' | null,
    mobile_platform: string | null,
    bank_ref_datetime: 'notnull' | null,
    bank_profile_id: string | null,
    txn_bank_ref_id: string | null,
) { 

    expect(transactionPaymentMob.ais_original_system).toBe('MERCHANT');
    expect(transactionPaymentMob.correlator_id).not.toBeNull();
    expect(transactionPaymentMob.payment_id).toBe(response.body.txn_id);
    expect(Number(transactionPaymentMob.payment_amt)).toBe(Number(requestBody.amount));
    expect(Number(transactionPaymentMob.payment_net_amt)).toBe(Number(response.body.amount_net));
    expect(transactionPaymentMob.payment_status).toBe(payment_status);
    expect(transactionPaymentMob.payment_created_datetime).not.toBeNull();
    expect(transactionPaymentMob.payment_modified_datetime).not.toBeNull();
    expect(transactionPaymentMob.payment_created_by).toBe(requestHeaders["X-sdpg-merchant-id"]);
    expect(transactionPaymentMob.payment_modified_by).toBe(payment_modified_by);
    expect(transactionPaymentMob.payment_status_pending_datetime).not.toBeNull();

    if (payment_status_success_datetime === 'notnull') { 
        expect(transactionPaymentMob.payment_status_success_datetime).not.toBeNull();
    } else if (payment_status_success_datetime === null) {
        expect(transactionPaymentMob.payment_status_success_datetime).toBe(null);;
    }

    if (payment_status_fail_datetime === 'notnull') { 
        expect(transactionPaymentMob.payment_status_fail_datetime).not.toBeNull();
    } else if (payment_status_fail_datetime === null) {
        expect(transactionPaymentMob.payment_status_fail_datetime).toBe(null);;
    }
    expect(Number(transactionPaymentMob.payment_currency_amt)).toBe(Number(requestBody.amount));
    expect(transactionPaymentMob.payment_currency).toBe('THB');
    expect(Number(transactionPaymentMob.payment_currency_conversion_rate)).toBe(Number(1));
    expect(transactionPaymentMob.payment_cust_fee_id).toBe(payment_cust_fee_id);
    const payment_cust_fee_amt = Number((response.body.amount_cust_fee / 1.07).toFixed(2))
    expect(Number(transactionPaymentMob.payment_cust_fee_amt)).toBe(payment_cust_fee_amt);
    expect(Number(transactionPaymentMob.payment_cust_vat_fee_amt)).toBe(Number((response.body.amount_cust_fee - payment_cust_fee_amt).toFixed(2)));
    expect(Number(transactionPaymentMob.payment_cust_fee_rate)).toBe(Number(payment_cust_fee_rate));
    expect(transactionPaymentMob.payment_cust_fee_rate_type).toBe(payment_cust_fee_rate_type);
    expect(Number(transactionPaymentMob.payment_cust_fee_net_amt)).toBe(Number(payment_cust_fee_net_amt));
    expect(transactionPaymentMob.merchant_id).toBe(requestHeaders["X-sdpg-merchant-id"]);
    expect(transactionPaymentMob.service_id).toBe(requestBody.service_id);
    expect(transactionPaymentMob.payment_mer_sof_id).toBe(payment_mer_sof_id);
    expect(transactionPaymentMob.payment_mer_fee_id).toBe(payment_mer_fee_id);
    expect(transactionPaymentMob.order_id).toBe(requestBody.order_id);
    expect(transactionPaymentMob.cust_id).toBe(requestBody.cust_id);
    expect(transactionPaymentMob.deeplink_flag).toBe(deeplink_flag);
    expect(transactionPaymentMob.ref_no_1).toBe(requestBody.ref_1);
    expect(transactionPaymentMob.ref_no_2).toBe(requestBody.ref_2);
    expect(transactionPaymentMob.ref_no_3).toBe(requestBody.ref_3);
    expect(transactionPaymentMob.ref_no_4).toBe(requestBody.ref_4);
    expect(transactionPaymentMob.ref_no_5).toBe(requestBody.ref_5);
    expect(transactionPaymentMob.bank_ref_1).toBe(bank_ref_1);
    expect(transactionPaymentMob.bank_ref_2).toBe(bank_ref_2);
    expect(transactionPaymentMob.issuer_bank_name).toBe(issuer_bank_name);
    expect(transactionPaymentMob.transaction_sof_rate_type).toBe(transaction_sof_rate_type);
    expect(transactionPaymentMob.transaction_gw_status).toBe(transaction_gw_status);
    expect(transactionPaymentMob.transaction_gw_desc).toBe(transaction_gw_desc);
    expect(transactionPaymentMob.bank_code).toBe('006');
    expect(transactionPaymentMob.bank_profile_metadata).toBe(bank_profile_metadata);
    expect(transactionPaymentMob.redirect_url_success).toBe(requestBody.redirect_urls.url_success);
    expect(transactionPaymentMob.redirect_url_fail).toBe(requestBody.redirect_urls.url_fail);
    expect(transactionPaymentMob.bank_resp_status).toBe(bank_resp_status);
    expect(transactionPaymentMob.bank_resp_code).toBe(bank_resp_code);
    expect(transactionPaymentMob.bank_resp_msg).toBe(bank_resp_msg);

    if (bank_ref_no === 'notnull') { 
        expect(transactionPaymentMob.bank_ref_no).not.toBeNull();
    } else if (bank_ref_no === null) {
        expect(transactionPaymentMob.bank_ref_no).toBe(null);;
    }

    if (bank_txn_datetime === 'notnull') { 
        expect(transactionPaymentMob.bank_txn_datetime).not.toBeNull();
    } else if (bank_txn_datetime === null) {
        expect(transactionPaymentMob.bank_txn_datetime).toBe(null);;
    }
  
    expect(transactionPaymentMob.token).not.toBeNull();

    if (token_expire_datetime === 'notnull') { 
        expect(transactionPaymentMob.token_expire_datetime).not.toBeNull();
    } else if (token_expire_datetime === null) {
        expect(transactionPaymentMob.token_expire_datetime).toBe(null);;
    }

    if (bank_redirect_url === 'notnull') { 
        expect(transactionPaymentMob.bank_redirect_url).toMatch(/^ktbnextuat:\/\/next\.co\.th\/partner-payments\?/);
    } else if (bank_redirect_url === null) {
        expect(transactionPaymentMob.bank_redirect_url).toBe(null);;
    }
    if (bank_url_expired_datetime === 'notnull') { 
        expect(transactionPaymentMob.bank_url_expired_datetime).not.toBeNull();
    } else if (bank_url_expired_datetime === null) {
        expect(transactionPaymentMob.bank_url_expired_datetime).toBe(null);;
    }
    
    expect(transactionPaymentMob.callback_type).toBe(callback_type);

    if (bank_order_id === 'notnull') { 
        expect(transactionPaymentMob.bank_order_id).not.toBeNull();
    } else if (bank_order_id === null) {
        expect(transactionPaymentMob.bank_order_id).toBe(null);;
    }

    expect(transactionPaymentMob.mobile_platform).toBe(mobile_platform);
    
    if (bank_ref_datetime === 'notnull') { 
        expect(transactionPaymentMob.bank_ref_datetime).not.toBeNull();
    } else if (bank_ref_datetime === null) {
        expect(transactionPaymentMob.bank_ref_datetime).toBe(null);;
    }
 
    expect(transactionPaymentMob.bank_profile_id).toBe(bank_profile_id);
    expect(transactionPaymentMob.txn_bank_ref_id).toBe(txn_bank_ref_id);
}

export async function expect_transaction_payment_base(
    requestHeaders: Record<string, any>,
    requestBody: Record<string, any>,
    response: Record<string, any>,
    transactionPaymentBase: Record<string, any>,
    instruction_type: string | null,
    interface_type: string | null,
    transaction_sof_type: string | null,
    transaction_sof_brand_type: string | null,
    transaction_ref_id: string | null,
    transaction_status: string | null,
    transaction_status_code: string | null,
    transaction_status_message: string | null,
    transaction_modified_datetime: 'notnull' | null,
    transaction_modified_by: string | null,
    transaction_status_success_datetime: 'notnull' | null,
    transaction_status_fail_datetime: 'notnull' | null,
    transaction_status_settle_datetime: 'notnull' | null,
    transaction_currency_amt: string | null,
    transaction_currency_conversion_rate: string | null,
    transaction_cust_fee_id: string | null,
    transaction_cust_fee_vat_amt: string | null,
    transaction_cust_fee_rate_type: string | null,
    transaction_promo_id: string | null,
    service_name: string | null,
    transaction_mer_sof_id: string | null,
    transaction_mer_fee_id: string | null,
    reason_code, reason_detail: string | null,
    refund_fee_flag: string | null,
    settlement_status: string | null,
    settlement_pending_datetime: 'notnull' | null,
    settlement_confirmed_datetime: 'notnull' | null,
    settlement_confirmed_by: string | null,
    transaction_sof_rate_type: string | null,
    settlement_aggregator_flag: string | null,
    transaction_gw_status: string | null,
    transaction_gw_desc: string | null,
    transaction_notify_webhook_status: string | null,
    transaction_notify_webhook_success_datetime: 'notnull' | null,
    transaction_notify_webhook_fail_datetime: 'notnull' | null,
) {
    expect(transactionPaymentBase.ais_original_system).toBe('MERCHANT');
    expect(transactionPaymentBase.instruction_type).toBe(instruction_type);
    expect(transactionPaymentBase.interface_type).toBe(interface_type);
    expect(transactionPaymentBase.correlator_id).not.toBeNull();
    expect(transactionPaymentBase.payment_id).toBe(response.body.txn_id);
    expect(Number(transactionPaymentBase.transaction_amt)).toBe(Number(requestBody.amount));
    expect(Number(transactionPaymentBase.transaction_net_amt)).toBe(Number(response.body.amount_net));
    expect(transactionPaymentBase.transaction_type).toBe('PAYMENT');
    expect(transactionPaymentBase.transaction_sof_type).toBe(transaction_sof_type);
    expect(transactionPaymentBase.transaction_sof_brand_type).toBe(transaction_sof_brand_type);
    expect(transactionPaymentBase.transaction_ref_id).toBe(transaction_ref_id);
    expect(transactionPaymentBase.transaction_status).toBe(transaction_status);
    expect(transactionPaymentBase.transaction_status_code).toBe(transaction_status_code);
    expect(transactionPaymentBase.transaction_status_message).toBe(transaction_status_message);
    expect(transactionPaymentBase.transaction_created_datetime).not.toBeNull();


    if (transaction_modified_datetime === 'notnull') { 
        expect(transactionPaymentBase.transaction_modified_datetime).not.toBeNull();
    } else if (transaction_modified_datetime === null) {
        expect(transactionPaymentBase.transaction_modified_datetime).toBe(null);;
    }
    
    expect(transactionPaymentBase.transaction_created_by).toBe(requestHeaders["X-sdpg-merchant-id"]);
    expect(transactionPaymentBase.transaction_modified_by).toBe(transaction_modified_by);
    expect(transactionPaymentBase.transaction_status_pending_datetime).not.toBeNull();


    if (transaction_status_success_datetime === 'notnull') { 
        expect(transactionPaymentBase.transaction_status_success_datetime).not.toBeNull();
    } else if (transaction_status_success_datetime === null) {
        expect(transactionPaymentBase.transaction_status_success_datetime).toBe(null);;
    }

    if (transaction_status_fail_datetime === 'notnull') { 
        expect(transactionPaymentBase.transaction_status_fail_datetime).not.toBeNull();
    } else if (transaction_status_fail_datetime === null) {
        expect(transactionPaymentBase.transaction_status_fail_datetime).toBe(null);;
    }

    if (transaction_status_settle_datetime === 'notnull') { 
        expect(transactionPaymentBase.transaction_status_settle_datetime).not.toBeNull();
    } else if (transaction_status_settle_datetime === null) {
        expect(transactionPaymentBase.transaction_status_settle_datetime).toBe(null);;
    }
    
    expect(Number(transactionPaymentBase.transaction_currency_amt)).toBe(Number(requestBody.amount));
    expect(transactionPaymentBase.transaction_currency).toBe('THB');
    expect(Number(transactionPaymentBase.transaction_currency_conversion_rate)).toBe(Number(1));
    expect(transactionPaymentBase.transaction_cust_fee_id).toBe(transaction_cust_fee_id);
    const payment_cust_fee_amt = Number((response.body.amount_cust_fee / 1.07).toFixed(2))
    expect(Number(transactionPaymentBase.transaction_cust_fee_amt)).toBe(payment_cust_fee_amt);
    expect(Number(transactionPaymentBase.transaction_cust_fee_vat_amt)).toBe(Number((response.body.amount_cust_fee - payment_cust_fee_amt).toFixed(2)));
    expect(transactionPaymentBase.transaction_cust_fee_rate_type).toBe(transaction_cust_fee_rate_type);
    expect(Number(transactionPaymentBase.transaction_cust_fee_net_amt)).toBe(Number(response.body.amount_cust_fee));
    expect(transactionPaymentBase.transaction_promo_id).toBe(transaction_promo_id);
    expect(transactionPaymentBase.merchant_id).toBe(requestHeaders["X-sdpg-merchant-id"]);
    expect(transactionPaymentBase.service_id).toBe(requestBody.service_id);
    expect(transactionPaymentBase.service_name).toBe(service_name);
    expect(transactionPaymentBase.transaction_mer_sof_id).toBe(transaction_mer_sof_id);
    expect(transactionPaymentBase.transaction_mer_fee_id).toBe(transaction_mer_fee_id);
    expect(transactionPaymentBase.channel_type).toBe(requestBody.channel_type);
    expect(transactionPaymentBase.order_id).toBe(requestBody.order_id);
    expect(transactionPaymentBase.cust_id).toBe(requestBody.cust_id);
    expect(transactionPaymentBase.product_name).toBe(requestBody.product_name);
    expect(transactionPaymentBase.reason_code).toBe(reason_code);
    expect(transactionPaymentBase.reason_detail).toBe(reason_detail);
    expect(transactionPaymentBase.refund_fee_flag).toBe(refund_fee_flag);
    expect(transactionPaymentBase.ref_no_1).toBe(requestBody.ref_1);
    expect(transactionPaymentBase.ref_no_2).toBe(requestBody.ref_2);
    expect(transactionPaymentBase.ref_no_3).toBe(requestBody.ref_3);
    expect(transactionPaymentBase.ref_no_4).toBe(requestBody.ref_4);
    expect(transactionPaymentBase.ref_no_5).toBe(requestBody.ref_5);
    expect(transactionPaymentBase.transaction_metadata).toBe(JSON.stringify(requestBody.metadata));

    expect(transactionPaymentBase.settlement_status).toBe(settlement_status);
    const settlement_auto_flag = common.convertBooleanToTF(requestBody.settlement.is_auto_settlement);
    expect(transactionPaymentBase.settlement_auto_flag).toBe(settlement_auto_flag);
    if (settlement_pending_datetime === 'notnull') { 
        expect(transactionPaymentBase.settlement_pending_datetime).not.toBeNull();
    } else if (settlement_pending_datetime === null) {
        expect(transactionPaymentBase.settlement_pending_datetime).toBe(null);;
    }

    if (settlement_confirmed_datetime === 'notnull') { 
        expect(transactionPaymentBase.settlement_confirmed_datetime).not.toBeNull();
    } else if (settlement_confirmed_datetime === null) {
        expect(transactionPaymentBase.settlement_confirmed_datetime).toBe(null);;
    }


    expect(transactionPaymentBase.settlement_confirmed_by).toBe(settlement_confirmed_by);

    if (settlement_auto_flag === 't') {
        expect(transactionPaymentBase.settlement_confirm_auto_datetime).toBe(null);
    } else if (settlement_auto_flag === 'f') {
        const transactionDate = transactionPaymentBase.settlement_confirm_auto_datetime.split(" ")[0];
        expect(transactionDate).toBe(requestBody.settlement.auto_settlement_at);
    }
    

    expect(transactionPaymentBase.transaction_sof_rate_type).toBe(transaction_sof_rate_type);
    expect(transactionPaymentBase.settlement_aggregator_flag).toBe(settlement_aggregator_flag);
    expect(transactionPaymentBase.transaction_gw_status).toBe(transaction_gw_status);
    expect(transactionPaymentBase.transaction_gw_desc).toBe(transaction_gw_desc);
    expect(transactionPaymentBase.bank_code).toBe('006');
    expect(transactionPaymentBase.transaction_notify_webhook_status).toBe(transaction_notify_webhook_status);

    if (transaction_notify_webhook_success_datetime === 'notnull') { 
        expect(transactionPaymentBase.transaction_notify_webhook_success_datetime).not.toBeNull();
    } else if (transaction_notify_webhook_success_datetime === null) {
        expect(transactionPaymentBase.transaction_notify_webhook_success_datetime).toBe(null);;
    }

    if (transaction_notify_webhook_fail_datetime === 'notnull') { 
        expect(transactionPaymentBase.transaction_notify_webhook_fail_datetime).not.toBeNull();
    } else if (transaction_notify_webhook_fail_datetime === null) {
        expect(transactionPaymentBase.transaction_notify_webhook_fail_datetime).toBe(null);;
    }
}


export async function expectDb_beforeOpenLink_phase(requestHeaders:Record<string, any>, requestBody:Record<string, any>, apiResponse:Record<string, any>) {
    const testStep = async () => {
        const sqlCommand_transaction_payment_mob = `SELECT * FROM sofmobilebanking.transaction_payment_mob WHERE payment_id = '${apiResponse.body.txn_id}';`
        const result_transaction_payment_mob = await sql.cat2_PostgreSQL(sqlCommand_transaction_payment_mob);
        await aisReport.addContext(
            `${sqlCommand_transaction_payment_mob}`,
            `${JSON.stringify(result_transaction_payment_mob[0], null, 2)}`
        );
        
        const sqlCommand_transaction_payment_base = `SELECT * FROM paymobilebanking.transaction_payment_base where payment_id = '${apiResponse.body.txn_id}';`
        const result_transaction_payment_base = await sql.cat2_PostgreSQL(sqlCommand_transaction_payment_base);
        await aisReport.addContext(
            `${sqlCommand_transaction_payment_base}`,
            `${JSON.stringify(result_transaction_payment_base[0], null, 2)}`
        );
    
        
        await expect_transaction_payment_mob(
            requestHeaders, requestBody, apiResponse, result_transaction_payment_mob[0],
            'PENDING', null, null, null, null, 'CF20259992019998001_02_1', '0.65', '10', 'AMOUNT', '10',
            'sof002', 'CF20259992019998001_01_2', null, null, 'KTB', 'AMOUNT', null, null, null, null, null, null, null, null,
            null, null, null, 'WEB', null, null, null, '1', null,
        );

        await expect_transaction_payment_base(
            requestHeaders, requestBody, apiResponse, result_transaction_payment_base[0],
            null, null, 'SOF_INTERNET_BANKING', 'BRAND_DD', null, 'PENDING', null, null, null,
            null, null, null, null, null, null, 'CF20259992019998001_02_1', '0.65', 'AMOUNT', null, 'Service_Mobile_Banking', 
            'sof002', 'CF20259992019998001_01_2', null, null, null, 'PENDING', null, null, null, 'AMOUNT', null, '1000', 
            'Success', null, null, null
        );
    };

    const expectedResult = `${expect_transaction_payment_mob}\n\n\n${expect_transaction_payment_base}`
    await aisReport.addTestStep('Verfify the database before opening link', testStep, expectedResult);
}


export async function expectDb_afterOpenLink_phase(requestHeaders:Record<string, any>, requestBody:Record<string, any>, apiResponse:Record<string, any>) {
    const testStep = async () => {
        const sqlCommand_transaction_payment_mob = `SELECT * FROM sofmobilebanking.transaction_payment_mob WHERE payment_id = '${apiResponse.body.txn_id}';`
        const result_transaction_payment_mob = await sql.cat2_PostgreSQL(sqlCommand_transaction_payment_mob); 
        await aisReport.addContext(
            `${sqlCommand_transaction_payment_mob}`,
            `${JSON.stringify(result_transaction_payment_mob[0], null, 2)}`
        );
        await expect_transaction_payment_mob(
            requestHeaders, requestBody, apiResponse, result_transaction_payment_mob[0],
            'PENDING', null, null, null, null, 'CF20259992019998001_02_1', '0.65', '10', 'AMOUNT', '10', 'sof002',
            'CF20259992019998001_01_2', null, null, 'KTB', 'AMOUNT', null, null, null, null, null, null, null, null, null,
            'notnull', 'notnull', 'APP', 'notnull', null, null, '1', null
        );

        
        const sqlCommand_transaction_payment_base = `SELECT * FROM paymobilebanking.transaction_payment_base where payment_id = '${apiResponse.body.txn_id}';`
        const result_transaction_payment_base = await sql.cat2_PostgreSQL(sqlCommand_transaction_payment_base); 
        await aisReport.addContext(
            `${sqlCommand_transaction_payment_base}`,
            `${JSON.stringify(result_transaction_payment_base[0], null, 2)}`
        );

        await expect_transaction_payment_base(
            requestHeaders, requestBody, apiResponse, result_transaction_payment_base[0],
            null, null, 'SOF_INTERNET_BANKING', 'BRAND_DD', null, 'PENDING', null, null, null,
            null, null, null, null, null, null, 'CF20259992019998001_02_1', '0.65', 'AMOUNT', null, 'Service_Mobile_Banking', 'sof002', 
            'CF20259992019998001_01_2', null, null, null, 'PENDING', null, null, null, 'AMOUNT', null, '1000', 
            'Success', null, null, null
        );
    };

    const expectedResult = `${expect_transaction_payment_mob}\n\n\n${expect_transaction_payment_base}`
    await aisReport.addTestStep('Verfify the database after opening link', testStep, expectedResult);
}


export async function expectDb_completePayment_phase(
    requestHeaders:Record<string, any>, requestBody:Record<string, any>, apiResponse:Record<string, any>,
    payment_status:string, payment_status_success_datetime: "notnull" | null, payment_status_fail_datetime: "notnull" | null,
    transaction_status_code: 'SR0000' | 'SR20001' | 'SR10004', transaction_status_message:string,
    transaction_notify_webhook_success_datetime: "notnull" | null, transaction_notify_webhook_fail_datetime: "notnull" | null,
    settlement_pending_datetime: null | 'notnull', settlement_status:string, settlement_confirmed_datetime: null | 'notnull',
    settlement_confirmed_by: 'System' | null,
    bank_resp_status:string, bank_resp_code:string, bank_resp_msg:string

) {
    await new Promise(resolve => setTimeout(resolve, 5000));

    const testStep = async () => {
        const sqlCommand_transaction_payment_mob = `SELECT * FROM sofmobilebanking.transaction_payment_mob WHERE payment_id = '${apiResponse.body.txn_id}';`
        const result_transaction_payment_mob = await sql.cat2_PostgreSQL(sqlCommand_transaction_payment_mob);
        await aisReport.addContext(
            `${sqlCommand_transaction_payment_mob}`,
            `${JSON.stringify(result_transaction_payment_mob[0], null, 2)}`
        );
        
        await expect_transaction_payment_mob(
            requestHeaders, requestBody, apiResponse, result_transaction_payment_mob[0],
            payment_status, 'WEBHOOK', payment_status_success_datetime, payment_status_fail_datetime,
            null, 'CF20259992019998001_02_1', '0.65', '10', 'AMOUNT', '10',
            'sof002', 'CF20259992019998001_01_2', null, null, 'KTB', 'AMOUNT', null, null, null, bank_resp_status, bank_resp_code, bank_resp_msg, 'notnull', 'notnull',
            null, 'notnull', 'notnull', 'APP', 'notnull', null, null, '1', null
        );

        const sqlCommand_transaction_payment_base = `SELECT * FROM paymobilebanking.transaction_payment_base where payment_id = '${apiResponse.body.txn_id}';`
        const result_transaction_payment_base = await sql.cat2_PostgreSQL(sqlCommand_transaction_payment_base) 
        await aisReport.addContext(
            `${sqlCommand_transaction_payment_base}`,
            `${JSON.stringify(result_transaction_payment_base[0], null, 2)}`
        );
        
        await expect_transaction_payment_base(
            requestHeaders, requestBody, apiResponse, result_transaction_payment_base[0],
            null, null, 'SOF_INTERNET_BANKING', 'BRAND_DD', null, payment_status, transaction_status_code,
            transaction_status_message, 'notnull', 'WEBHOOK', payment_status_success_datetime, payment_status_fail_datetime,
            null, null, null, 'CF20259992019998001_02_1', '0.65', 'AMOUNT', null, 'Service_Mobile_Banking',
            'sof002', 'CF20259992019998001_01_2', null, null,null, settlement_status, settlement_pending_datetime, settlement_confirmed_datetime, settlement_confirmed_by, 'AMOUNT', null, '1000', 
            'Success', 'SUCCESS', transaction_notify_webhook_success_datetime, transaction_notify_webhook_fail_datetime
        );

    };

    const expectedResult = `${expect_transaction_payment_mob}\n\n\n${expect_transaction_payment_base}`
    await aisReport.addTestStep('Verify the database after the payment is completed.', testStep, expectedResult);
}

export async function patchPaymentStatus(txn_id:string, status: 'PENDING' | 'SUCCESS' | 'FAIL') {
    const testStep =  async () => {

        const sqlCommand_transaction_payment_base = `
        UPDATE paymobilebanking.transaction_payment_base
        SET transaction_status = '${status}'
        WHERE payment_id = '${txn_id}';`

        const sqlCommand_transaction_payment_mob = `
        UPDATE sofmobilebanking.transaction_payment_mob
        SET payment_status = '${status}'
        WHERE payment_id = '${txn_id}';`
 
        await sql.cat2_PostgreSQL(sqlCommand_transaction_payment_base);
        await sql.cat2_PostgreSQL(sqlCommand_transaction_payment_mob);

        const query_transaction_payment = `SELECT transaction_status FROM paymobilebanking.transaction_payment_base WHERE payment_id = '${txn_id}';`;
        const query_transaction_payment_mob = `SELECT payment_status FROM sofmobilebanking.transaction_payment_mob WHERE payment_id = '${txn_id}';`;
        const expect_transaction_payment_base = await sql.cat2_PostgreSQL(query_transaction_payment);
        const expect_transaction_payment_mob = await sql.cat2_PostgreSQL(query_transaction_payment_mob);

        await aisReport.addContext('Patch transaction_status of transaction_payment_base', sqlCommand_transaction_payment_base)
        await aisReport.addContext('Query data after update payment base',`${JSON.stringify(expect_transaction_payment_base, null, 2)}`);
        await aisReport.addContext('Result payment_status of transaction_payment_mob', sqlCommand_transaction_payment_mob);
        await aisReport.addContext('Query data after update payment mob',`${JSON.stringify(expect_transaction_payment_mob, null, 2)}`);
        expect(expect_transaction_payment_mob[0].payment_status).toBe(status);
        expect(expect_transaction_payment_base[0].transaction_status).toBe(status);
;
    }
    await aisReport.addTestStep('Patch Transaction_Status of transaction_payment_base', testStep ,'expect(expect_transaction_payment[0].payment_status).toBe(status);')
}