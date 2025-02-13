import { aisReport, common, configMerchant, data, expectDb, mockMobilebanking, paymentOrderValidators, sql } from '../fixtures/import';
import { test, expect, Page, request } from '@playwright/test';

export async function paymentOrderAPI(request: any, params: any, expectCode:any = '', channelSecret: string = data.channelSecret, nonce:string | null = (common.timestamp()).toString(), medthod = 'post') {
    const url = `${data.baseURL_1}${data.payment_order_path}`;
    const orderIDNumber =  String(common.generateOrder());

    const requestBody = {
        "order_id": (params.order_id !== undefined) ? params.order_id : orderIDNumber,
        "product_name": (params.product_name !== undefined) ? params.product_name : data.productName_data,
        "bank_code": (params.bank_code !== undefined) ? params.bank_code : data.bankCode_data,
        "service_id": (params.service_id  !== undefined) ? params.service_id : data.serviceID_data,
        "channel_type": (params.channel_type !== undefined) ? params.channel_type : data.channelType_data,
        "cust_id": (params.cust_id !== undefined) ? params.cust_id : data.custId_data,
        "amount": (params.amount !== undefined) ? params.amount : data.amount_data_payment_order,
        "currency": (params.currency !== undefined) ? params.currency : data.currency_data,
        "ref_1": (params.ref_1 !== undefined) ? params.ref_1 : data.ref1_data,
        "ref_2": (params.ref_2 !== undefined) ? params.ref_2 : data.ref2_data,
        "ref_3": (params.ref_3 !== undefined) ? params.ref_3 : data.ref3_data,
        "ref_4": (params.ref_4 !== undefined) ? params.ref_4 : data.ref4_data,
        "ref_5": (params.ref_5 !== undefined) ? params.ref_5 : data.ref5_data,
        "metadata": params.metadata !== undefined ? params.metadata :
        {
            "key1": (params.key1 !== undefined) ? params.key1 : data.key1_data,
            "key2": (params.key2 !== undefined) ? params.key2 : data.key2_data,
        },
        "redirect_urls": {
            "url_success": (params.url_success !== undefined) ? params.url_success : data.urlSuccess_data,
            "url_fail": (params.url_fail !== undefined) ? params.url_fail : data.urlFail_data
        },
        "deeplink_flag": (params.deeplink_flag !== undefined) ? params.deeplink_flag : data.deeplinkFlag_data,
        "settlement": {
            "is_auto_settlement" : (params.is_auto_settlement !== undefined) ? params.is_auto_settlement : data.is_auto_settlement_data,
            "auto_settlement_at" : (params.auto_settlement_at !== undefined) ? params.auto_settlement_at : data.auto_settlement_at_data,
        }
    }

    if (params && typeof params === 'object') {
        Object.keys(params).forEach((key) => {
            if (params[key] === 'DELETE_FIELD') {
                delete requestBody[key];
            }
        });
    }

    if (params.key1 === 'DELETE_FIELD') {
        delete requestBody.metadata.key1;
    }
    if (params.key2 === 'DELETE_FIELD') {
        delete requestBody.metadata.key2;
    }

    if (params.url_success === 'DELETE_FIELD') {
        delete requestBody.redirect_urls.url_success;
    }
    if (params.url_fail === 'DELETE_FIELD') {
        delete requestBody.redirect_urls.url_fail;
    }

    if (params.is_auto_settlement === 'DELETE_FIELD') {
        delete requestBody.settlement.is_auto_settlement;
    }

    if (
        params.auto_settlement_at === 'DELETE_FIELD' || 
        requestBody.settlement?.auto_settlement_at === 'DELETE_FIELD'
    ) {
        delete requestBody.settlement?.auto_settlement_at;
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
    await aisReport.addTestStep('POST Payment Order API', testStep, expectCode);
    return {
        url,
        response,
        requestHeaders,
        requestBody
    };
}

export async function completePayment_SUCCESS(page: any, request: any, params: Record<string,any> = {}) {
    const { 
        response: paymentOrderApiResponse,
        requestHeaders,
        requestBody
    } = await paymentOrderAPI(request, params, paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(paymentOrderApiResponse, requestBody);
    await expectDb.expectDb_beforeOpenLink_phase(requestHeaders, requestBody, paymentOrderApiResponse);
    await page.goto(paymentOrderApiResponse.body.authorize_url);
    await page.waitForSelector(
        data.waitTextForLink, 
        { timeout: 30000 }
    );
    await expectDb.expectDb_afterOpenLink_phase(requestHeaders, requestBody, paymentOrderApiResponse);
    await mockMobilebanking.openMockPage(page,{ 
        txid: paymentOrderApiResponse.body.txn_id, 
        mid: paymentOrderApiResponse.headers["x-sdpg-merchant-id"], 
        amt: paymentOrderApiResponse.body.amount_net
    },
        data.successButton,
        `${data.expect_success_url}${paymentOrderApiResponse.body.txn_id}`
    );
    await page.waitForURL(data.expect_success_url+paymentOrderApiResponse.body.txn_id);
    await expectDb.expectDb_completePayment_phase(
        requestHeaders, requestBody, paymentOrderApiResponse, 'SUCCESS', 'notnull', null,
        'SR0000', 'Success', 'notnull', null, 'notnull', 'CONFIRMED', 'notnull', 'System',
        'SUCCESS', '0000', 'SUCCESS'
    );
    return {paymentOrderApiResponse, requestHeaders, requestBody} 
}


export async function completePayment_FAIL(
    page: any, request: any, button:string,
    transaction_status_code: "SR0000" | "SR20001" | "SR10004", transaction_status_message:string, bank_resp_status:string,bank_resp_code:string, bank_resp_msg:string) {
    
    const { 
        response: paymentOrderApiResponse,
        requestHeaders,
        requestBody
    } = await paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(paymentOrderApiResponse, requestBody);
    await expectDb.expectDb_beforeOpenLink_phase(requestHeaders, requestBody, paymentOrderApiResponse);
    await page.goto(paymentOrderApiResponse.body.authorize_url);
    await page.waitForSelector(
        data.waitTextForLink, 
        { timeout: 30000 }
    );
    await expectDb.expectDb_afterOpenLink_phase(requestHeaders, requestBody, paymentOrderApiResponse);
    await mockMobilebanking.openMockPage(page,{ 
        txid: paymentOrderApiResponse.body.txn_id, 
        mid: paymentOrderApiResponse.headers["x-sdpg-merchant-id"], 
        amt: paymentOrderApiResponse.body.amount_net
    },
        button,
        `${data.expect_fail_url}${paymentOrderApiResponse.body.txn_id}`
    );
    await expectDb.expectDb_completePayment_phase(
        requestHeaders, requestBody, paymentOrderApiResponse, 'FAIL', null, 'notnull', transaction_status_code,
        transaction_status_message, 'notnull', null, null,'PENDING', null, null, bank_resp_status, bank_resp_code, bank_resp_msg
    );

    return {paymentOrderApiResponse, requestHeaders, requestBody} 
}


export async function redirectEncodeTest(page:Page, character:string) {    
    let url!:string;
    let txn_id:string
    txn_id = '92503814015073704091';
    const testStepUpdate = async () => {
        const sanitizedCharacter = common.sanitizedCharacter(character);
        const updateRedirectLink = `
            UPDATE sofmobilebanking.transaction_payment_mob
            SET redirect_url_success = '${data.urlSuccess_data}${sanitizedCharacter}AAAAAAAAAA'
            WHERE payment_id = '${txn_id}';`;

        await aisReport.addContext('SQL commad', updateRedirectLink);
    
        await sql.cat2_PostgreSQL(updateRedirectLink);
        const queryExpectURL = `SELECT * FROM sofmobilebanking.transaction_payment_mob where payment_id = '${txn_id}'`
        const resultAfterUpdate = await sql.cat2_PostgreSQL(queryExpectURL);
        const newRedirect_url_success = await resultAfterUpdate[0].redirect_url_success;
        const bank_redirect_url = await resultAfterUpdate[0].bank_redirect_url;
        const cleaned_url = await bank_redirect_url.replace('ktbnextuat://next.co.th/partner-payments?partnerDeeplinkUrl=', '');
        url = decodeURIComponent(cleaned_url);
        await aisReport.addContext('SQL command for verify after update command', queryExpectURL)
        await aisReport.addContext('SQL result after update', newRedirect_url_success);
    }
    await aisReport.addTestStep('UPDATE redirect_url_success with SQL command', testStepUpdate);
    const testStepOpen = async () => {
        await aisReport.addContext('Open CDC Link', url)
        await page.goto(url);
    }
    
    await aisReport.addTestStep('Open link', testStepOpen);
    let encode = character

    if (
        character !== '&' && 
        character !== '?' && 
        character !== '%' && 
        character !== '/' &&
        character !== '#'
    ) {
        encode = await common.encodeUrl(character);
    }
    const testStepExpect = async () => {
        await page.waitForURL(/https:\/\/postman-echo\.com\/get\?case=success/, {timeout:10000});
        const currentUrl = page.url();
        await aisReport.addContext('URL Redirect', currentUrl);
        await common.screenshot(page, 'Success Page');
        if(character === '#') {
            expect(currentUrl).toBe(`${data.urlSuccess_data}&transactionId=${txn_id}${encode}AAAAAAAAAA`);
        } else {
            expect(currentUrl).toBe(`${data.urlSuccess_data}${encode}AAAAAAAAAA&transactionId=${txn_id}`);
        }
        
    };
    const expectCode = `${common.encodeUrl}\n${testStepExpect}`
    await aisReport.addTestStep('URL Redirect', testStepExpect, expectCode);
}

export async function paymentorder_pending(request: any, params: Record<string,any> = {}) {
    const { 
        response: paymentOrderApiResponse,
        requestHeaders,
        requestBody
    } = await paymentOrderAPI(request, params, paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(paymentOrderApiResponse, requestBody);
    return { 
        paymentOrderApiResponse,
        requestHeaders,
        requestBody
    }
}

export async function completePayment_SUCCESS_NoDatabase(request: any, page:any, params: Record<string,any> = {}) {
    const { 
        paymentOrderApiResponse,
        requestHeaders,
        requestBody
    } = await paymentorder_pending(request, params);
    await page.goto(paymentOrderApiResponse.body.authorize_url);
    await page.waitForSelector(
        data.waitTextForLink, 
        { timeout: 30000 }
    );
    await mockMobilebanking.openMockPage(page,{ 
        txid: paymentOrderApiResponse.body.txn_id, 
        mid: paymentOrderApiResponse.headers["x-sdpg-merchant-id"], 
        amt: paymentOrderApiResponse.body.amount_net
    },
        data.successButton,
        `${data.expect_success_url}${paymentOrderApiResponse.body.txn_id}`
    );
    return { 
        paymentOrderApiResponse,
        requestHeaders,
        requestBody
    }
}


export async function webhookSUCCESS_TEST(request: any, page:any, params:Record<string,any>, settlement_status: 'CONFIRMED' | 'PENDING') {
    // let currencyURL:string;
    // const prepareWebhook = async () => {
    //     await page.goto(data.webhook_baseURL);
    //     await page.waitForURL(data.webhook_baseURL_Regex, { timeout: 10000 });
    //     currencyURL = page.url();
    //     const hash = currencyURL.replace(data.webhook_view, '');
    //     const webhookURL =  `https://webhook.site/${hash}`
    //     const sqlCommand = `
    //         UPDATE commonservice.payment_sof SET url_webhook = '${webhookURL}'
    //         WHERE sof_id = '29991302111728010' 
    //         AND merchant_id = '5916510';
    //     `
    //     await sql.cat2_PostgreSQL(sqlCommand);

    //     const expectData = `
    //         SELECT url_webhook FROM commonservice.payment_sof 
    //         WHERE sof_id = '29991302111728010' 
    //         AND merchant_id = '5916510';
    //     `
    //     const resultQuery = await sql.cat2_PostgreSQL(expectData);
    //     await aisReport.addContext('SQL Command', sqlCommand);
    //     await aisReport.addContext('SQL Command', expectData);
    //     await aisReport.addContext('Verify database after UPDATE', resultQuery);
    //     await configMerchant.reloadCacheUpdateAPIPaymentSof(request,{});
    //     expect(resultQuery[0].url_webhook).toBe(webhookURL);
    //     await page.waitForTimeout(3000);
    // };
    // await aisReport.addTestStep('Prepare data of webhook', prepareWebhook, 'expect(resultQuery[0].url_webhook).toBe(webhookURL);');
    

    const { 
        paymentOrderApiResponse,
        requestHeaders,
        requestBody
    } = await completePayment_SUCCESS_NoDatabase(request, page, params);
    
    const testStepWebhook = async () => {
        await page.goto('https://webhook.site/#!/view/96cb4c61-8d89-4604-b5b6-53769e336a02');
        await aisReport.addContext('Webhook URL', 'https://webhook.site/#!/view/96cb4c61-8d89-4604-b5b6-53769e336a02');
        await page.waitForSelector(data.requestBodyWebhook, {timeout:15000});
        await common.screenshot(page, 'Webhook Page');
        const text = await page.locator(data.requestBodyWebhook).innerText();
        const texnObject = JSON.parse(text);
        await aisReport.addContext('Request Body of webhook', JSON.stringify(texnObject, null, 2));
        await paymentOrderValidators.expectWebhook(page,
            requestBody, requestHeaders, paymentOrderApiResponse,
            texnObject, 'SUCCESS', 'SR0000', 'Success', settlement_status
        )
    }
    await aisReport.addTestStep('Verify the webhook', testStepWebhook, paymentOrderValidators.expectWebhook);
}