import { aisReport, common, data } from '../fixtures/import';
import { test, expect } from '@playwright/test';

export async function webhookKtbAPI(request: any, params: any, expectCode:any = '',channelSecret = data.channelSecret, nonce = (common.timestamp()).toString()) {
    const url = `${data.baseURL_1}${data.webhook_path}`;
    const requestBody = {
        "transactionRefId": (params.transactionRefId !== undefined) ? params.transactionRefId : params.transactionRefId,
        "transactionType": (params.transactionType !== undefined) ? params.transactionType : data.transactionType_webhook_data,
        "status": (params.status !== undefined) ? params.status : data.status_webhook_data,
        "transactionCreatedTimestamp": (params.transactionCreatedTimestamp !== undefined) ? params.transactionCreatedTimestamp : data.transactionCreatedTimestamp_webhook_data,
        "transactionUpdatedTimestamp": (params.transactionUpdatedTimestamp !== undefined) ? params.transactionUpdatedTimestamp : data.transactionUpdatedTimestamp_webhook_data,
        "transactionValidUntilTimestamp": (params.transactionValidUntilTimestamp !== undefined) ? params.transactionValidUntilTimestamp : data.transactionValidUntilTimestamp_webhook_data,
        "paymentInfo": {
            "reference1": (params.reference1 !== undefined) ? params.reference1 : data.reference1_webhook_data,
            "amount": (params.amount !== undefined) ? params.amount : data.amount_data_webhook,
            "fee": (params.fee !== undefined) ? params.fee : data.fee_webhook_data,
        },
        "partnerInfo": {
            "deeplinkUrl": (params.deeplinkUrl !== undefined) ? params.deeplinkUrl : data.deeplinkUrl_webhook_data,
            "name": (params.name !== undefined) ? params.name : data.name_webhook_data,
        }
    }

    const trueSignature = common.signature(requestBody, nonce, channelSecret);

    const requestHeaders = {
        //"Content-Type": "application/json; charset=UTF-8",
        //"X-sdpg-nonce": (params["X-sdpg-nonce"] !== undefined) ? params["X-sdpg-nonce"] : nonce,
        "X-sdpg-merchant-id": (params["X-sdpg-merchant-id"] !== undefined) ? params["X-sdpg-merchant-id"] : data.X_sdpg_merchant_id_data,
        // "X-sdpg-signature": params["X-sdpg-signature"] !== undefined ? params["X-sdpg-signature"] : trueSignature,
    };

    Object.keys(params).forEach((key) => {
        if (params[key] === 'DELETE_FIELD') {
            delete requestHeaders[key];
        }
    });

    if (params && typeof params === 'object') {
        Object.keys(params).forEach((key) => {
            if (params[key] === 'DELETE_FIELD') {
                delete requestBody[key];
            }
        });
    }


    const response = await common.api(request, url, requestHeaders, requestBody);
    const testStep = async () => {
            await common.TwoHundredStatus(response.status);
            await common.commonReport(url, requestHeaders, requestBody, response.headers, response.body); 
        }
        await aisReport.addTestStep('POST Webhook KTB API', testStep, expectCode);
    return {
        url,
        response,
        requestHeaders,
        requestBody
    };
}