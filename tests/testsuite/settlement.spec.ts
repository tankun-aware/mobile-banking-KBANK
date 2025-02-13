import { test, expect } from '@playwright/test';
import { aisReport, data, common, paymentOrder, sql, expectDb, webhookKtb, paymentOrderValidators, settlement } from '../fixtures/import';
import { addTestStep } from '../../ais-report/aisReport';
import { json } from 'stream/consumers';
import exp from 'constants';

test.describe('Settlement', () => {
  test('ทดสอบการตั้งค่า auto settlement เมื่อ settlementTriggerFlag เป็น null', async ({ request }) => {
    await settlement.updateSettlementTriggerFlag(null);
    const { response, requestBody } = await paymentOrder.paymentOrderAPI(
      request, 
      { is_auto_settlement: false, auto_settlement_at: 'DELETE_FIELD' }, 
      'erroe : MANUAL_SETTLEMENT_NOT_ALLOWED'
    );
    const erorCode = (response.body.error)
    await settlement.updateSettlementTriggerFlag('True');
    await expect(response.status).toBe(403)
    await expect(erorCode).toBe('MANUAL_SETTLEMENT_NOT_ALLOWED');
    await expect(response.body.error).toBe('This serviceId manual settlement is not allowed.');
  });

  test('ทดสอบการตั้งค่า auto settlement เมื่อ settlementTriggerFlag เป็น false', async ({ page, request }) => {
    await settlement.updateSettlementTriggerFlag(false);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(
      request,
       {is_auto_settlement : false, auto_settlement_at : 'DELETE_FIELD'},
        'erroe : MANUAL_SETTLEMENT_NOT_ALLOWED');
    const erorCode = (response.body.error);
    await settlement.updateSettlementTriggerFlag('True');
    await expect(response.status).toBe(403)
    await expect(erorCode).toBe('MANUAL_SETTLEMENT_NOT_ALLOWED');
    await expect(response.body.error).toBe('This serviceId manual settlement is not allowed.');
  });
  
  test('ทดสอบการตั้งค่า auto_settlement_at ก่อนวันที่ปัจจุบัน', async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : false, auto_settlement_at : settlement.formatDate(-1)}, 'erroe : MANUAL_SETTLEMENT_NOT_ALLOWED');
    await expect(response.status).toBe(403)
    await expect(response.body.error_code).toBe('AUTO_SETTLEMENT_AT_IS_INVALID');
    await expect(response.body.error).toBe('auto_settlement_at is invalid.');
  });
  
  test('ทดสอบการตั้งค่า auto_settlement_at เกินกำหนด', async ({ page, request }) => {
    const periodTime = await settlement.queryPeriodTime();
    const maxperiodTime =  Number(periodTime) + 1
    console.log(maxperiodTime)
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : false, auto_settlement_at : settlement.formatDate(maxperiodTime)}, 'erroe : auto_settlement_at is over limit.');
    await expect(response.status).toBe(403)
    await expect(response.body.error_code).toBe('AUTO_SETTLEMENT_AT_OVER_LIMIT');
    await expect(response.body.error).toBe('auto_settlement_at is over limit.');
  });

  test('ทดสอบการตั้งค่า auto_settlement_at ในระยะเวลาที่กำหนด', async ({ page, request }) => {
    const periodTime = await settlement.queryPeriodTime();
    const limitPeriodTime =  Number(periodTime)
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : false, auto_settlement_at : settlement.formatDate(limitPeriodTime)}, 'erroe : Success');
    await expect(response.status).toBe(200)
  });
  
  test('ทดสอบการตั้งค่า is_auto_settlement = false และ settlementTriggerFlag = true', async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : false, auto_settlement_at : null}, 'Success');
    await expect(response.status).toBe(200)
  });
  
  test('ทดสอบการตั้งค่า is_auto_settlement = null และ settlementTriggerFlag = true', async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : null, auto_settlement_at : null}, 'Success');
    await expect(response.status).toBe(200)
  });

  test('ทดสอบการตั้งค่า is_auto_settlement = ค่าว่าง และ settlementTriggerFlag ค่าว่าง ', async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : '', auto_settlement_at : ''}, 'Success');
    await expect(response.status).toBe(200)
  });
  
  test('ทดสอบการตั้งค่า is_auto_settlement = %^$#', async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : '%^$#', auto_settlement_at : null}, 'Success');
    await expect(response.status).toBe(400)
    expect(response.body.error_code).toBe('INVALID_REQUEST');
    expect(response.body.error).toBe('Invalid arguments');
  });

  // Settlement : Webhook

  test('ตรวจสอบการทำงานของ webhook เมื่อไม่ระบุ settlement parameter', async ({ request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {settlement : 'DELETE_FIELD',is_auto_settlement : 'DELETE_FIELD', auto_settlement_at : 'DELETE_FIELD'}, );
    await expect(response.status).toBe(200)
  });

  test('ตรวจสอบการทำงานของ webhook เมื่อ settlement.is_auto_settlement เป็น false', async ({ request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : false, auto_settlement_at : 'DELETE_FIELD'}, );
    await expect(response.status).toBe(200)
  });

  test('ตรวจสอบการทำงานของ webhook เมื่อ settlement.is_auto_settlement เป็น True', async ({ request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : 'True', auto_settlement_at : 'DELETE_FIELD'}, );
    await expect(response.status).toBe(200)
  });
});
