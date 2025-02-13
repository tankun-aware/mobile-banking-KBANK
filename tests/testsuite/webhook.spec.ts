import { test, expect } from '@playwright/test';
import { aisReport, data, common, paymentOrder, sql, expectDb, webhookKtb, enquiry, enquiryValidators,paymentOrderValidators} from '../fixtures/import';

test.describe('[Integration Test] Webhook', () => {
    test('ตรวจสอบการระบุ transactionRefId ✅ Valid: "92500615142244924076" (ค่าปกติที่ถูกต้อง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionRefId ❌ Invalid: "" (ว่าง)', async ({ page, request }) => { // 
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: "",
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionRefId ❌ Invalid: "9250061514224492407" (สั้นกว่าที่กำหนด)', async ({ page,request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: "9250061514224492407",
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionRefId ❌ Invalid: "925006151422449240761" (ยาวกว่าที่กำหนด)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: "925006151422449240761",
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionRefId ❌ Invalid: "abcd1234efgh5678ijkl" (ไม่ใช่ตัวเลข)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: "abcd1234efgh5678ijkl",
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionRefId ❌ Invalid: null (ไม่มีค่า)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: null,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ transactionType ✅ Valid: "PAYMENT" (ค่าที่ถูกต้อง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionType ❌ Invalid: "" (ว่าง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                transactionType: "",
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionType ❌ Invalid: "TRANSFER" (ค่าที่ไม่ได้ระบุในเอกสาร)', async ({ page, request}) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                transactionType: "TRANSFER",
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionType ❌ Invalid: 12345 (ไม่ใช่ String)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                transactionType: 12345,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionType ❌ Invalid: null (ไม่มีค่า)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                transactionType: null,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ status ✅ Valid: "SUCCESS" (ค่าที่ถูกต้อง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ status ❌ Invalid: "FAILED" (ค่าที่ไม่ได้ระบุในตัวอย่าง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                status: "FAILED"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test.only('ตรวจสอบการระบุ status ❌ Invalid: "PENDING" (ค่าที่ไม่ได้ระบุในตัวอย่าง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                status: "PENDING"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
        console.log(paymentOrderApiResponse.body.txn_id);
    })

    test('ตรวจสอบการระบุ status ❌ Invalid: "" (ว่าง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                status: ""
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ status ❌ Invalid: null (ไม่มีค่า)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                status: null
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ transactionCreatedTimestamp ✅ Valid: "2024-12-17T13:21:12+07:00" (ค่าที่ถูกต้อง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionCreatedTimestamp ❌ Invalid: "2024-12-17 13:21:12" (รูปแบบผิด)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                transactionCreatedTimestamp: "2024-12-17 13:21:12"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionCreatedTimestamp ❌ Invalid: "2024/12/17T13:21:12+07:00" (รูปแบบผิด)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                transactionCreatedTimestamp: "2024/12/17T13:21:12+07:00"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionCreatedTimestamp ❌ Invalid: "2024-13-17T13:21:12+07:00" (เดือนเกิน 12)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                transactionCreatedTimestamp: "2024/12/17T13:21:12+07:00"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionCreatedTimestamp ❌ Invalid: "2024-12-32T13:21:12+07:00" (วันเกิน 31)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                transactionCreatedTimestamp: "2024-12-32T13:21:12+07:00"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionCreatedTimestamp ❌ Invalid: "" (ว่าง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                transactionCreatedTimestamp: ""
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionCreatedTimestamp ❌ Invalid: null (ไม่มีค่า)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                transactionCreatedTimestamp: null
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ transactionUpdatedTimestamp ✅ Valid: "2024-12-17T13:21:45+07:00"', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionUpdatedTimestamp ❌ Invalid: "2024-12-17 13:21:45"', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                transactionUpdatedTimestamp: "2024-12-17 13:21:45"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ transactionValidUntilTimestamp ✅ Valid: "2024-12-17T13:21:43+07:00"', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ transactionValidUntilTimestamp ❌ Invalid: "2024-12-17 13:21:43"', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                transactionValidUntilTimestamp: "2024-12-17 13:21:43"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ paymentInfo.reference1 ✅ Valid: "92500615142244924076" (ค่าที่ถูกต้อง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ paymentInfo.reference1 ❌ Invalid: "" (ว่าง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: "",
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ paymentInfo.reference1 ❌ Invalid: "abcd1234" (รูปแบบไม่ถูกต้อง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: "abcd1234",
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ paymentInfo.amount ✅ Valid: 115.5 (ค่าปกติ)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ paymentInfo.amount ✅ Valid: 0.01 (ค่าน้อยที่สุด)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ paymentInfo.amount ❌ Invalid: -1 (ค่าติดลบ)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: -1,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ paymentInfo.amount ❌ Invalid: "115.5" (ไม่ใช่ Number)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ paymentInfo.amount ❌ Invalid: null (ไม่มีค่า)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: null,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ paymentInfo.fee ✅ Valid: 15.00 (ค่าปกติ)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('SKIP ตรวจสอบการระบุ paymentInfo.fee ✅ Valid: 0.00 (ไม่มีค่าธรรมเนียม)', async ({ page, request }) => { // ข้อนี้อาจจะทดสอบไม่ได้เนื่องจากไม่สามารถกำหนดค่า FEE
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('SKIP ตรวจสอบการระบุ paymentInfo.fee ❌ Invalid: -1.00 (ค่าติดลบ)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: -1.00
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('SKIP ตรวจสอบการระบุ paymentInfo.fee ❌ Invalid: "15.00" (ไม่ใช่ Number)', async ({ page, request }) => { 
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ partnerInfo.deeplinkUrl ✅ Valid: "ais://ais.co.th/xxx" (ค่าที่ถูกต้อง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                deeplinkUrl: "ais://ais.co.th/xxx"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ partnerInfo.deeplinkUrl ❌ Invalid: "" (ว่าง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                deeplinkUrl: "ais://ais.co.th/xxx"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ partnerInfo.deeplinkUrl ❌ Invalid: "htp://ais.co.th" (รูปแบบ URL ผิด)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                deeplinkUrl: "htp://ais.co.th"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ partnerInfo.deeplinkUrl ❌ Invalid: "ais://" (ไม่มีโดเมน)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                deeplinkUrl: "ais://"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })

    test('ตรวจสอบการระบุ partnerInfo.name ✅ Valid: "myAIS" (ค่าปกติ)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                name: "myAIS"
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ partnerInfo.name ❌ Invalid: "" (ว่าง)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                name: ""
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
    test('ตรวจสอบการระบุ partnerInfo.name ❌ Invalid: null (ไม่มีค่า)', async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse, 
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await page.goto(paymentOrderApiResponse.body.authorize_url);
        await page.waitForSelector(
            data.waitTextForLink, 
            { timeout: 30000 }
        );
        const { response: webhookResponse } = await webhookKtb.webhookKtbAPI(
            request, 
            {
                transactionRefId: paymentOrderApiResponse.body.txn_id,
                reference1: paymentOrderApiResponse.body.txn_id,
                amount: paymentOrderApiResponse.body.amount_net,
                fee: paymentOrderApiResponse.body.amount_cust_fee,
                name: null
            }, 
            common.expectStatus
        );
        await common.expectStatus(webhookResponse);
    })
});