import { aisReport, common, configMerchant, data, expectDb, mockMobilebanking, paymentOrderValidators, sql } from '../fixtures/import';
import { test, expect, Page, request } from '@playwright/test';

export async function setMerchantStatus(flag : 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT') {
  const testStep = async () => {
    const sqlCommandUpdateData = `
      UPDATE commonservice.merchant_profile
      SET status = '${flag}'
      WHERE merchant_id = '${data.merchantID_data}'
    `;
    await sql.cat2_PostgreSQL(sqlCommandUpdateData);
    const sqlCommandRecheckData = `
      SELECT merchant_id,merchant_name,effective_date,status 
      FROM commonservice.merchant_profile 
      WHERE merchant_id = '${data.merchantID_data}'
    `;
    const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
    const upDateItem = result[0];
    const expected = expect(upDateItem.status).toBe(flag)
    aisReport.addContext('Update Data',sqlCommandUpdateData);
    aisReport.addContext('Select Data',sqlCommandRecheckData);
    aisReport.addContext('Query',upDateItem);
  };
  await aisReport.addTestStep(`Update Status: ${flag}`,testStep,`Update Status: ${flag}`);
}

export async function setMerchanteffective_date_error(time : any) {
  const testStep = async () => {
  const sqlCommandUpdateData = `
    UPDATE commonservice.merchant_profile
    SET effective_date = '${time}'
    WHERE merchant_id = '${data.merchantID_data}'
  `;
  await sql.cat2_PostgreSQL(sqlCommandUpdateData);
  const sqlCommandRecheckData = `
    SELECT * 
    FROM commonservice.merchant_profile 
    WHERE merchant_id = '${data.merchantID_data}'
  `;
  const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
  const upDateItem = result[0];
  const expect_sqlCommandRecheckData = `${time}`;
  aisReport.addContext('Update Data',sqlCommandUpdateData);
  aisReport.addContext('Select Data',sqlCommandRecheckData);
  aisReport.addContext('Query',upDateItem);
};
await aisReport.addTestStep(`Update effective_date: ${time}`,testStep,`effective_date: ${time}`);
};

export function formatDate(days: number = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const formattedDate = date.toISOString().split('T')[0];
  return formattedDate;
}

export async function setServiceStatus(flag : 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT') {
  const testStep = async () => {
  const sqlCommandUpdateData = `
    UPDATE paymobilebanking.service
    SET status = '${flag}'
    WHERE merchant_id = '${data.merchantID_data}' and service_id = '${data.serviceID_data}'
  `;
  await sql.cat2_PostgreSQL(sqlCommandUpdateData);
  const sqlCommandRecheckData = `
    SELECT * 
    FROM paymobilebanking.service 
    WHERE merchant_id = '${data.merchantID_data}' and service_id = '${data.serviceID_data}'
  `;
  const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
  const upDateItem = result[0];
  const expect_sqlCommandRecheckData = `status = '${flag}'`;
  aisReport.addContext('Update Data',sqlCommandUpdateData);
  aisReport.addContext('Select Data',sqlCommandRecheckData);
  aisReport.addContext('Query',upDateItem);
  }
  await aisReport.addTestStep(`Update effective_date: ${flag}`,testStep,`effective_date: ${flag}`);
}

export async function setServiceeffectiveDate(time : any) {
  const testStep = async () => {
  const sqlCommandUpdateData = `
    UPDATE paymobilebanking.service
    SET effective_date = '${time}'
    WHERE merchant_id = '${data.merchantID_data}'
  `;
  await sql.cat2_PostgreSQL(sqlCommandUpdateData);
  const sqlCommandRecheckData = `
    SELECT * 
    FROM paymobilebanking.service 
    WHERE merchant_id = '${data.merchantID_data}'
  `;
  const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
  const upDateItem = result[0];
  const expect_sqlCommandRecheckData = `${time}`;
  aisReport.addContext('Update Data',sqlCommandUpdateData);
  aisReport.addContext('Select Data',sqlCommandRecheckData);
  aisReport.addContext('Query',upDateItem);
  }
  await aisReport.addTestStep(`Update effective_date: ${time}`,testStep,`effective_date: ${time}`);
}

export async function reloadCacheAPI(request: any, params: any, expectCode= '', medthod = 'post') {
    const url = 'https://dev-payment-api.cdc.ais.th/dev/v1/commonservice/inquiry';
    const requestBody = { 
      "config": ["payMerchantProfile"]
    }
    const requestHeaders = {
      "Content-Type": (params["Content-Type"] !== undefined) ? params.content_type : data.Content_Type_data, 
  };
    const response = await common.api(request, url, requestHeaders, requestBody, medthod);
    const testStep = async () => {
      await common.TwoHundredStatus(response.status);
      await common.commonReport(url, requestHeaders, requestBody, response.headers, response.body); 
    }
    await aisReport.addTestStep('POST API Reload Cache', testStep, expectCode);
    return {
        url,
        response,
        requestBody
    };
}

export async function reloadCacheApiInquiryPaymentSof(request: any, params: any, expectCode= '', medthod = 'post') {
    const url = 'https://dev-payment-api.cdc.ais.th/dev/v1/commonservice/inquiry';
    const requestBody = { 
      "config": ["payment_sof"]
    }
    const requestHeaders = {
      "Content-Type": (params["Content-Type"] !== undefined) ? params.content_type : data.Content_Type_data, 
  };
    const response = await common.api(request, url, requestHeaders, requestBody, medthod);
    const testStep = async () => {
      await common.TwoHundredStatus(response.status);
      await common.commonReport(url, requestHeaders, requestBody, response.headers, response.body); 
    }
    await aisReport.addTestStep('POST API Reload Cache', testStep, expectCode);
    return {
        url,
        response,
        requestBody
    };
}

export async function reloadCacheUpdateAPI(request: any, params: any, expectCode= '', medthod = 'post') {
  // API inquiry
    const url = 'https://dev-payment-api.cdc.ais.th/dev/v1/commonservice/reloadCache';
    const requestBody = { 
      "tableUpdate" : ["merchant_profile"]
    }
    const requestHeaders = {
      "Content-Type": (params["Content-Type"] !== undefined) ? params.content_type : data.Content_Type_data, 
  };
    const responsereloadCacheUpdateAPI = await common.api(request, url, requestHeaders, requestBody, medthod);
    const testStep = async () => {
      await common.TwoHundredStatus(responsereloadCacheUpdateAPI.status);
      await common.commonReport(url, requestHeaders, requestBody, responsereloadCacheUpdateAPI.headers, responsereloadCacheUpdateAPI.body); 
    }
    await aisReport.addTestStep('POST API reload Cache Update ', testStep, expectCode);
    return {
        url,
        responsereloadCacheUpdateAPI,
        requestBody
    };
}

export async function reloadCacheUpdateAPIPaymentSof(request: any, params: any, expectCode= '', medthod = 'post') {
    const url = 'https://dev-payment-api.cdc.ais.th/dev/v1/commonservice/reloadCache';
    const requestBody = { 
      "tableUpdate" : ["payment_sof"]
    }
    const requestHeaders = {
      "Content-Type": (params["Content-Type"] !== undefined) ? params.content_type : data.Content_Type_data, 
  };
    const responsereloadCacheUpdateAPI = await common.api(request, url, requestHeaders, requestBody, medthod);
    const testStep = async () => {
      await common.TwoHundredStatus(responsereloadCacheUpdateAPI.status);
      await common.commonReport(url, requestHeaders, requestBody, responsereloadCacheUpdateAPI.headers, responsereloadCacheUpdateAPI.body); 
    }
    await aisReport.addTestStep('POST API reload Cache Update ', testStep, responsereloadCacheUpdateAPI.status);
    return {
        url,
        responsereloadCacheUpdateAPI,
        requestBody
    };
}

export async function setPaymentSofStatus(flag : 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT') {
  const testStep = async () => {
  const sqlCommandUpdateData = `
    UPDATE commonservice.payment_sof
    SET status = '${flag}'
    WHERE merchant_id = '${data.merchantID_data}' and service_id = '${data.serviceID_data}'
  `;
  await sql.cat2_PostgreSQL(sqlCommandUpdateData);
  const sqlCommandRecheckData = `
    SELECT * 
    FROM commonservice.payment_sof
    WHERE merchant_id = '${data.merchantID_data}' and service_id = '${data.serviceID_data}'
  `;
  const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
  const upDateItem = result[0];
  const expect_sqlCommandRecheckData = `status = '${flag}'`;
    aisReport.addContext('Update Data',sqlCommandUpdateData);
    aisReport.addContext('Select Data',sqlCommandRecheckData);
    aisReport.addContext('Query',upDateItem);  
  };
  await aisReport.addTestStep(`Update effective_date: ${flag}`,testStep,`effective_date: ${flag}`);
}

export async function setPaymentSofeffectiveDate(time : any) {
  const testStep = async () => {
  const sqlCommandUpdateData = `
    UPDATE commonservice.payment_sof
    SET effective_date = '${time}'
    WHERE merchant_id = '${data.merchantID_data}'
  `;
  await sql.cat2_PostgreSQL(sqlCommandUpdateData);
  const sqlCommandRecheckData = `
    SELECT * 
    FROM commonservice.payment_sof 
    WHERE merchant_id = '${data.merchantID_data}'
  `;
  const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
  const upDateItem = result[0];
  const expect_sqlCommandRecheckData = `${time}`;
  aisReport.addContext('Update Data',sqlCommandUpdateData);
    aisReport.addContext('Select Data',sqlCommandRecheckData);
    aisReport.addContext('Query',upDateItem);  
  };
  await aisReport.addTestStep(`Update effective_date: ${time}`,testStep,`effective_date: ${time}`);
}

export async function setPaymentSofChannelStatus(flag : 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT') {
  const testStep = async () => {
  const sqlCommandUpdateData = `
    UPDATE feeservice.payment_sof_channel
    SET status = '${flag}'
    WHERE merchant_id = '${data.merchantID_data}' and service_id = '${data.serviceID_data}'
  `;
  await sql.cat2_PostgreSQL(sqlCommandUpdateData);
  const sqlCommandRecheckData = `
    SELECT * 
    FROM feeservice.payment_sof_channel
    WHERE merchant_id = '${data.merchantID_data}' and service_id = '${data.serviceID_data}' and channel_type = 'APPLICATION'
  `;
  const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
  const upDateItem = result[0];
  const expect_sqlCommandRecheckData = `status = '${flag}'`;
    aisReport.addContext('Update Data',sqlCommandUpdateData);
    aisReport.addContext('Select Data',sqlCommandRecheckData);
    aisReport.addContext('Query',upDateItem);  
  };
  await aisReport.addTestStep(`Update effective_date: ${flag}`,testStep,`effective_date: ${flag}`);
}

export async function setPaymentSofChanneleffectiveDate(time : any) {
  const testStep =async () => {
    const sqlCommandUpdateData = `
      UPDATE feeservice.payment_sof_channel
      SET effective_date = '${time}'
      WHERE merchant_id = '${data.merchantID_data}' and service_id = '${data.serviceID_data}' and channel_type = 'APPLICATION'
    `;
    await sql.cat2_PostgreSQL(sqlCommandUpdateData);
    const sqlCommandRecheckData = `
      SELECT * 
      FROM feeservice.payment_sof_channel 
      WHERE merchant_id = '${data.merchantID_data}'
    `;
    const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
    const upDateItem = result[0];
    const expect_sqlCommandRecheckData = `${time}`;
    aisReport.addContext('Update Data',sqlCommandUpdateData);
    aisReport.addContext('Select Data',sqlCommandRecheckData);
    aisReport.addContext('Query',upDateItem);  
  };
  await aisReport.addTestStep(`Update effective_date: ${time}`,testStep,`effective_date: ${time}`);
}

export async function setConfigurationfeeStatus(flag : 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT') {
  const testStep =async () => {
    const sqlCommandUpdateData = `
      UPDATE feeservice.configuration_fee
      SET status = '${flag}'
      WHERE merchant_id = '${data.merchantID_data}' and service_id = '${data.serviceID_data}'
    `;

    await sql.cat2_PostgreSQL(sqlCommandUpdateData);

    const sqlCommandRecheckData = `
      SELECT status 
      FROM feeservice.configuration_fee
      WHERE merchant_id = '${data.merchantID_data}' and service_id = '${data.serviceID_data}'
    `;
    const result = await sql.cat2_PostgreSQL(sqlCommandRecheckData);
    console.log(sqlCommandRecheckData);
    const upDateItem = result[0];
    console.log(upDateItem);
    const expect_sqlCommandRecheckData = `status = '${flag}'`;
    aisReport.addContext('Update Data',sqlCommandUpdateData);
    aisReport.addContext('Select Data',sqlCommandRecheckData);
    aisReport.addContext('Query',upDateItem);  
  };
  await aisReport.addTestStep(`Update effective_date: ${flag}`,testStep,`effective_date: ${flag}`);
}

export async function expectMerchantNotActive(response: any) {
  expect(response.status).toBe(403);
  expect(response.body.error_code).toBe('MERCHANT_NOT_ACTIVE');
  expect(response.body.error).toBe('Merchant not active');
}

export async function expectServiceNotActive(response: any) {
  expect(response.status).toBe(403);
  expect(response.body.error_code).toBe('SERVICE_NOT_EXISTS_ON_MERCHANT');
  expect(response.body.error).toBe('Service not exist on merchant');
}

export async function expectPaymentSof(response: any) {
  expect(response.status).toBe(403);
  expect(response.body.error_code).toBe('SOF_NOT_FOUND');
  expect(response.body.error).toBe('Source of fund not found');
}

export async function expectPaymentSofChannel(response: any) {
  expect(response.status).toBe(403);
  expect(response.body.error_code).toBe('MERCHANT_NOT_ACTIVE');
  expect(response.body.error).toBe('Merchant not active');
}

export async function expectConfigurationFee(response: any) {
  expect(response.status).toBe(403);
  expect(response.body.error_code).toBe('MERCHANT_NOT_ACTIVE');
  expect(response.body.error).toBe('Merchant not active');
}

export async function reloadCache(request: any, page : Page, status : string) {
  const {responsereloadCacheUpdateAPI} = await configMerchant.reloadCacheUpdateAPI(request,{}, 'expect(response.status).toBe(200)');
  expect(responsereloadCacheUpdateAPI.status).toBe(200);
  const {response} = await configMerchant.reloadCacheAPI(request,{}, 'expect(response.status).toBe(200)');
  expect(response.status).toBe(200)
  const payMerchantProfileShortName = response.body.data.payMerchantProfileStatus[0];
  await page.waitForTimeout(10000);
}

export async function reloadCacheAPIPaymentSof(request: any, page : Page, status : string) {
  const {responsereloadCacheUpdateAPI} = await configMerchant.reloadCacheUpdateAPIPaymentSof(request,{}, 'expect(response.status).toBe(200)');
  expect(responsereloadCacheUpdateAPI.status).toBe(200);
  const {response} = await configMerchant.reloadCacheApiInquiryPaymentSof(request,{}, 'expect(response.status).toBe(200)');
  expect(response.status).toBe(200)
  await page.waitForTimeout(10000);
}

export async function setMerchantStatusReloadCache(request:any, page:any, status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT') {
  await configMerchant.setMerchantStatus(status);
  await configMerchant.reloadCache(request, page, status);
}

export async function setServiceStatusReloadCache(request:any, page:any, status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT') {
  await configMerchant.setServiceStatus(status);
  await configMerchant.reloadCache(request, page, status);
}

export async function setPaymentSofStatusReloadCache(request:any, page:any, status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT') {
  await configMerchant.setPaymentSofStatus(status);
  await configMerchant.reloadCacheAPIPaymentSof(request, page, status);
}

export async function setPaymentSofSofeffectiveDateReloadCache(request:any, page:any, status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT', time: any) {
  await configMerchant.setPaymentSofeffectiveDate(time);
  await configMerchant.reloadCacheAPIPaymentSof(request, page, status);
}
