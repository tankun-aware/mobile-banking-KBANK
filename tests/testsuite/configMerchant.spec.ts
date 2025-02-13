import { test, expect } from '@playwright/test';
import { aisReport, data, common, paymentOrder, sql, expectDb, webhookKtb, paymentOrderValidators, settlement, configMerchant, enquiry, enquiryValidators } from '../fixtures/import';
import { addTestStep } from '../../ais-report/aisReport';
import { json } from 'stream/consumers';

let i = 1;
const Id = () => `TC_CM_${String(i++).padStart(3, '0')}`;
test.describe('Master Data', () => {
  test(`${Id()} ตรวจสอบ Merchant ที่มีสถานะเป็น ACTIVE`, async ({ page, request }) => {
    await configMerchant.setMerchantStatusReloadCache(request, page, 'ACTIVE');
    await configMerchant.setServiceStatusReloadCache(request, page, 'ACTIVE');
    const { 
      paymentOrderApiResponse,
      requestHeaders,
      requestBody
  } = await paymentOrder.paymentorder_pending(request);
  });

  test(`${Id()} ตรวจสอบ Merchant ที่มีสถานะเป็น INACTIVE`, async ({ page, request }) => {
    await configMerchant.setMerchantStatusReloadCache(request, page, 'INACTIVE');
    const {
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setMerchantStatusReloadCache(request, page, 'ACTIVE');
    await configMerchant.expectMerchantNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Merchant ที่มีสถานะเป็น DELETED`, async ({ page, request }) => {
    await configMerchant.setMerchantStatusReloadCache(request, page, 'DELETED');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setMerchantStatus('ACTIVE');
    await configMerchant.reloadCache(request, page ,'ACTIVE');
    await configMerchant.expectMerchantNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Merchant ที่มีสถานะเป็น DRAFT`, async ({ page, request }) => {
    await configMerchant.setMerchantStatus('DRAFT');
    await configMerchant.reloadCache(request, page, 'DRAFT');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setMerchantStatus('ACTIVE');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await configMerchant.expectMerchantNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config โดย Merchant มี effective date เกินปัจจุบัน`, async ({ page, request }) => {
   await configMerchant.setMerchanteffective_date_error('2030-05-28');
   await configMerchant.reloadCache(request, page, 'ACTIVE');
   const { 
    response: paymentOrderApiResponse,
    requestHeaders,
    requestBody
  } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
  await configMerchant.setMerchanteffective_date_error('2024-05-28');
  await configMerchant.reloadCache(request, page, 'ACTIVE');
  await configMerchant.expectMerchantNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config โดย Merchant มี effective date ยังไม่ถึงวันที่ปัจจุบัน`, async ({ page, request }) => {
   await configMerchant.setServiceStatus('ACTIVE');
   await configMerchant.setMerchanteffective_date_error('2022-05-28');
   await configMerchant.reloadCache(request, page, 'ACTIVE');
   await paymentOrder.paymentorder_pending(request);
   await configMerchant.setMerchanteffective_date_error('2024-05-28');
   await configMerchant.reloadCache(request, page,'ACTIVE');
  });

  test(`${Id()} ตรวจสอบ Config โดย Service มี Status เป็น ACTIVE`, async ({page, request }) => {
    await configMerchant.setServiceStatus('ACTIVE');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    const { 
      paymentOrderApiResponse,
      requestHeaders,
      requestBody
  } = await paymentOrder.paymentorder_pending(request);
  });

  test(`${Id()} ตรวจสอบ Config โดย Service มี Status เป็น INACTIVE`, async ({ page, request }) => {
    await configMerchant.setServiceStatus('INACTIVE');
    await configMerchant.reloadCache(request, page, 'INACTIVE');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.expectServiceNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config โดย Service มี Status เป็น DELETED`, async ({ page, request }) => {
    await configMerchant.setServiceStatus('DELETED');
    await configMerchant.reloadCache(request, page, 'DELETED');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setServiceStatus('ACTIVE');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await configMerchant.expectServiceNotActive(paymentOrderApiResponse);
  });
  
  test(`${Id()} ตรวจสอบ Config โดย Service มี effective_date เกินวันที่ปัจจุบัน`, async ({ page, request }) => {
    await configMerchant.setServiceStatus('ACTIVE');
    await configMerchant.setServiceeffectiveDate('2029-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setServiceeffectiveDate('2024-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await configMerchant.expectServiceNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config โดย Service มี effective_date ยังไม่ถึงวันที่ปัจจุบัน`, async ({ page, request }) => {
    await configMerchant.setServiceStatus('ACTIVE');
    await configMerchant.setServiceeffectiveDate('2022-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await paymentOrder.paymentorder_pending(request);
    await configMerchant.setServiceeffectiveDate('2024-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
  });

  test(`${Id()} ตรวจสอบ Config commonservice.payment_sof โดย Status เป็น INACTIVE`, async ({ page, request }) => {
    await configMerchant.setPaymentSofStatusReloadCache(request, page, 'INACTIVE');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setPaymentSofStatusReloadCache(request, page, 'ACTIVE');
    await configMerchant.expectPaymentSof(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config commonservice.payment_sof โดย Status เป็น DELETED`, async ({ page, request }) => {
    await configMerchant.setPaymentSofStatusReloadCache(request, page, 'DELETED');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setPaymentSofStatusReloadCache(request, page, 'ACTIVE');
    await configMerchant.expectPaymentSof(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config commonservice.payment_sof โดย Status เป็น DRAFT`, async ({ page, request }) => {
    await configMerchant.setPaymentSofStatus('DRAFT');
    await configMerchant.reloadCache(request, page, 'DRAFT');
    await configMerchant.setPaymentSofStatusReloadCache(request, page, 'DRAFT');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setPaymentSofStatusReloadCache(request, page, 'ACTIVE');
    await configMerchant.expectPaymentSof(paymentOrderApiResponse);
  });

  test(`${Id()} กรณีตรวจสอบ Config commonservice.payment_sof โดย effective_date เกินปัจจุบัน`, async ({ page, request }) => {
    await configMerchant.setPaymentSofeffectiveDate('2029-05-28');
    await configMerchant.reloadCacheAPIPaymentSof(request, page, 'ACTIVE');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setPaymentSofeffectiveDate('2024-05-28');
    await configMerchant.reloadCacheAPIPaymentSof(request, page, 'ACTIVE');
    await configMerchant.expectPaymentSof(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config commonservice.payment_sof โดย effective_date ยังไม่ถึงปัจจุบัน`, async ({ page, request }) => {
    await configMerchant.setPaymentSofeffectiveDate('2022-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await paymentOrder.paymentorder_pending(request);
    await configMerchant.setPaymentSofeffectiveDate('2024-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
  });

  test(`${Id()} ตรวจสอบ Config commonservice.payment_sof_channel โดย Status เป็น INACTIVE`, async ({ page, request }) => {
    await configMerchant.setPaymentSofChannelStatus('INACTIVE');
    await configMerchant.reloadCache(request, page, 'INACTIVE');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setPaymentSofChannelStatus('ACTIVE');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await configMerchant.expectServiceNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config commonservice.payment_sof_channel โดย Status เป็น DELETED`, async ({ page, request }) => {
    await configMerchant.setPaymentSofChannelStatus('DELETED');
    await configMerchant.reloadCache(request, page, 'DELETED');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setPaymentSofChannelStatus('ACTIVE');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await configMerchant.expectServiceNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config commonservice.payment_sof_channel โดย Status เป็น DRAFT`, async ({ page, request }) => {
    await configMerchant.setPaymentSofChannelStatus('DRAFT');
    await configMerchant.reloadCache(request, page, 'DRAFT');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setPaymentSofChannelStatus('ACTIVE');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await configMerchant.expectServiceNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} กรณีตรวจสอบ Config commonservice.payment_sof_channel โดย effective_date ก่อนปัจจุบัน`, async ({ page, request }) => {
    await configMerchant.setPaymentSofChanneleffectiveDate('2022-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await paymentOrder.paymentorder_pending(request);
    await configMerchant.setPaymentSofChanneleffectiveDate('2024-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
  });

  test(`${Id()} ตรวจสอบ Config commonservice.payment_sof_channel โดย effective_date เกินปัจจุบัน`, async ({ page, request }) => {
    await configMerchant.setPaymentSofChanneleffectiveDate('2029-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectMerchantNotActive);
    await configMerchant.setPaymentSofChanneleffectiveDate('2024-05-28');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await configMerchant.expectServiceNotActive(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config commonservice.configuration_fee โดย Status เป็น INACTIVE`, async ({ page, request }) => {
    await configMerchant.setConfigurationfeeStatus('ACTIVE');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectConfigurationFee);
    await configMerchant.setConfigurationfeeStatus('ACTIVE');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await configMerchant.expectConfigurationFee(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ Config feeservice.configuration_fee โดย Status เป็น DELETED`, async ({ page, request }) => {
    await configMerchant.setConfigurationfeeStatus('DELETED');
    await configMerchant.reloadCache(request, page, 'DELETED');
    const { 
      response: paymentOrderApiResponse,
      requestHeaders,
      requestBody
    } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectConfigurationFee);
    await configMerchant.setConfigurationfeeStatus('ACTIVE');
    await configMerchant.reloadCache(request, page, 'ACTIVE');
    await configMerchant.expectConfigurationFee(paymentOrderApiResponse);
  });

  test(`${Id()} ตรวจสอบ feeservice.configuration_fee โดย Status เป็น DRAFT`, async ({ page, request }) => {
    try {
      await configMerchant.setConfigurationfeeStatus('DRAFT');
      await configMerchant.reloadCache(request, page, 'DRAFT');
      const { 
        response: paymentOrderApiResponse,
        requestHeaders,
        requestBody
      } = await paymentOrder.paymentOrderAPI(request, {}, configMerchant.expectConfigurationFee);
      await configMerchant.expectConfigurationFee(paymentOrderApiResponse);
    } catch (error) {
      if (error) {
        throw new Error(error);
      }  
    } finally {
      await configMerchant.setConfigurationfeeStatus('ACTIVE');
      await configMerchant.reloadCache(request, page, 'ACTIVE');
    }
  });
});