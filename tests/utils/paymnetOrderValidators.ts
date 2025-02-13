import { test, expect } from '@playwright/test';

export async function expectSuccess (response:Record<string, any>, requestBody:Record<string, any>) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/;
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('status', 'PENDING');
  expect(response.body).toHaveProperty('message', 'Success');
  expect(response.body.order_id).not.toBeNull();
  expect(response.body.txn_id).not.toBeNull();
  expect(response.body.created_at).toMatch(dateRegex);
  expect(response.body.currency).toBe('THB');
  expect(Number(response.body.amount)).toBe(Number(requestBody.amount));
  expect(Number(response.body.amount_net)).toBe(Number(requestBody.amount) + Number(response.body.amount_cust_fee));
  expect(response.body.authorize_url).not.toBeNull();
  expect(response.headers.switchingflag).toBe('Y');
  expect(response.headers.switchingcontext).toBe('paymobilebanking');
};

export async function invalidType (response:Record<string,any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'invalid arguments');
}

 
export async function MISSING_SECURITY_CONTEXT(response:Record<string, any>) {
  expect(response.status).toBe(401);
  expect(response.body.error_code).toBe('MISSING_SECURITY_CONTEXT');
  expect(response.body.error).toBe('Missing security headers [X-sdpg-nonce, X-sdpg-merchant-id, X-sdpg-signature]');
  expect(response.body.cause).toBe(null);
  const timestampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/;
  expect(response.body.timestamp).toMatch(timestampRegex);
  expect(response.body.context_path).toBe('[POST] /service-txn-gateway/v1/ib/payment_order');
  expect(response.body.service).toBe('paymobilebanking:1.7.569');;
  expect(response.body.trace_id).not.toBeNull();
};


export async function expectOrderId_invalid_null (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'order_id is invalid');
  expect(response.headers.switchingflag).toBe('Y');
  expect(response.headers.switchingcontext).toBe('paymobilebanking');
};

export async function expectOrderId_invalid_duplicate (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'ORDER_ID_DUPLICATE');
  expect(response.body).toHaveProperty('error', 'Order ID is already used');
  expect(response.headers.switchingflag).toBe('Y');
  expect(response.headers.switchingcontext).toBe('paymobilebanking');
};
  
export async function expectOrderId_invalid_length (response:Record<string, any>) {
  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty('error_code', 'CREATE_TXN_ERROR');
  expect(response.body).toHaveProperty('error', 'OrderId is invalid');
  expect(response.headers.switchingflag).toBe('Y');
  expect(response.headers.switchingcontext).toBe('paymobilebanking');
};

export const expectMissingProduct_name = (response:Record<string, any>) => {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'product_name is invalid');
};
  
  
export async function expectProductname_invalid_null (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'product_name is invalid');
};

export async function expectServiceId_null (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'service_id is invalid');
  expect(response.headers.switchingflag).toBe('Y');
  expect(response.headers.switchingcontext).toBe('paymobilebanking');
};
  
export async function expectchannel_type (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'channel_type is invalid');
};

export async function expectCurrency (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'currency is invalid');
};
  
export async function expectCurrency_invalid (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'currency is invalid');
};

export async function expectRedirect_urls (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'channel_type is invalid');
};
  
export async function expectX_sdpg_merchant_id (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'channel_type is invalid');
};

export async function expectX_sdpg_merchant_id_invalid_null (response:Record<string, any>) {
  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty('error_code', 'MERCHANT_NOT_ACTIVE');
  expect(response.body).toHaveProperty('error', 'Merchant not active');
  expect(response.body.cause).toBe(null);
  const timestampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/;
  expect(response.body.timestamp).toMatch(timestampRegex);
  expect(response.body.context_path).toBe('[POST] /service-txn-gateway/v1/ib/payment_order');
  expect(response.body.service).toBe('paymobilebanking:1.7.569');;
  expect(response.body.trace_id).not.toBeNull();
};

export async function expect_order_id_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'order_id is invalid');
};
  
export async function expect_product_name_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'product_name is invalid');
};
  
export async function expect_bank_code_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty('error_code', 'CREATE_TXN_ERROR');
  expect(response.body).toHaveProperty('error', 'bank_code is invalid');
};

export async function expect_service_id_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty('error_code', 'SERVICE_NOT_EXISTS_ON_MERCHANT');
  expect(response.body).toHaveProperty('error', 'Service not exist on merchant');
};

export async function expect_channel_type_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'channel_type is invalid');
};
  
export async function expect_cust_id_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'cust_id is invalid');
};

export async function expect_amount_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'amount is invalid');
};
  
export async function expect_currency_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'currency is invalid');
};

export async function expect_ref_1_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'ref1 is invalid');
};

export async function expect_ref_2_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'ref2 is invalid');
};
  
export async function expect_ref_3_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'ref3 is invalid');
};

export async function expect_ref_4_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'ref4 is invalid');
};
  
export async function expect_ref_5_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'ref5 is invalid');
};
  
export async function expect_metadata_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'metadata is invalid');
};


export async function expect_url_success_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'url_success is invalid');
};

export async function expect_url_fail_invalid_request (response:Record<string, any>) {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('error_code', 'INVALID_REQUEST');
  expect(response.body).toHaveProperty('error', 'url_fail is invalid');
};
  
export async function signature_fail (response:Record<string, any>) {
  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('error_code', 'VALIDATE_REQUEST_SIGNATURE_FAILED');
  expect(response.body).toHaveProperty('error', 'Gateway exception');
};

export async function expectWebhook ( page:any,
  requestBodyPaymentOrder:Record<string,any>, 
  requestHeaderPaymentOrder:Record<string,any>, 
  responsePaymentOrder:Record<string,any>, 
  webhookResponse:Record<string, any>,
  status: 'SUCCESS' | 'FAIL', status_code:string, status_message:string, settlement_status:string

) { 
  expect(webhookResponse.order_id).toBe(requestBodyPaymentOrder.order_id);
  expect(webhookResponse.merchant_id).toBe(requestHeaderPaymentOrder["X-sdpg-merchant-id"]);
  expect(webhookResponse.txn_id).toBe(responsePaymentOrder.body.txn_id);
  expect(webhookResponse.txn_type).toBe('PAYMENT');
  expect(webhookResponse.sof_type).toBe('SOF_INTERNET_BANKING');
  expect(webhookResponse.status).toBe(status);
  expect(webhookResponse.status_code).toBe(status_code);
  expect(webhookResponse.status_message).toBe(status_message);
  expect(Number(webhookResponse.amount)).toBe(Number(requestBodyPaymentOrder.amount));
  expect(Number(webhookResponse.amount_net)).toBe(Number(responsePaymentOrder.body.amount_net));
  expect(Number(webhookResponse.amount_cust_fee)).toBe(Number(responsePaymentOrder.body.amount_cust_fee));
  expect(webhookResponse.currency).toBe('THB');
  expect(webhookResponse.service_id).toBe(requestBodyPaymentOrder.service_id);
  expect(webhookResponse.channel_type).toBe(requestBodyPaymentOrder.channel_type);
  expect(webhookResponse.cust_id).toBe(requestBodyPaymentOrder.cust_id);
  expect(webhookResponse.ref_1).toBe(requestBodyPaymentOrder.ref_1);
  expect(webhookResponse.ref_2).toBe(requestBodyPaymentOrder.ref_2);
  expect(webhookResponse.ref_3).toBe(requestBodyPaymentOrder.ref_3);
  expect(webhookResponse.ref_4).toBe(requestBodyPaymentOrder.ref_4);
  expect(webhookResponse.ref_5).toBe(requestBodyPaymentOrder.ref_5);
  expect(webhookResponse.capture).toBe(null);
  expect(webhookResponse.card).toBe(null);
  expect(webhookResponse.sof_txn_id).not.toBeNull();

  expect(webhookResponse.created_at).not.toBeNull();
  expect(webhookResponse.success_at).not.toBeNull();
  expect(webhookResponse.fail_at).toBe(null);
  expect(webhookResponse.rmb_flag).toBe(null);
  expect(webhookResponse.bank).toEqual({"account_last_digits": null, "account_name": null, "bank_code": "006"});
  expect(webhookResponse.productList).toBe(null);
  expect(webhookResponse.settlement.is_auto_settlement).toBe(requestBodyPaymentOrder.settlement.is_auto_settlement);
  expect(webhookResponse.settlement.settlement_status).toBe(settlement_status);
  expect(webhookResponse.settlement.confirmed_at).toBe(null);
  expect(webhookResponse.settlement.auto_settlement_at).toBe(null);
  expect(webhookResponse.settlement.pending_at).toBe(null);
  expect(webhookResponse.metadata.key1).toBe(requestBodyPaymentOrder.metadata.key1);
  expect(webhookResponse.metadata.key2).toBe(requestBodyPaymentOrder.metadata.key2);

  const merchantID = await page.locator('.ng-binding:has-text("x-sdpg-merchant-id") + .long').innerText();
  const nonceID = await page.locator('.ng-binding:has-text("x-sdpg-nonce") + .long').innerText();
  const signature = await page.locator('.ng-binding:has-text("x-sdpg-signature") + .long').innerText();
  expect(merchantID).toBe(requestHeaderPaymentOrder["X-sdpg-merchant-id"]);
  expect(signature).not.toBeNull();
  expect(nonceID).not.toBeNull();
};

export async function settlementTriggerFlag_fail (response:Record<string, any>) {
  expect(response.status).toBe(400)
  expect(response.body.error_code).toBe('INVALID_REQUEST');
  expect(response.body.error).toBe('This service_id manual settlement is not allowed');
};


export async function autoSettlementAtBefore_fail (response:Record<string, any>) {
  expect(response.status).toBe(400)
  expect(response.body.error_code).toBe('INVALID_REQUEST');
  expect(response.body.error).toBe('auto_settlement_at is invalid');
};

export async function autoSettlementAtOverLimit (response:Record<string, any>) {
  expect(response.status).toBe(400)
  expect(response.body.error_code).toBe('INVALID_REQUEST');
  expect(response.body.error).toBe('auto_settlement_at is over limit');
};
