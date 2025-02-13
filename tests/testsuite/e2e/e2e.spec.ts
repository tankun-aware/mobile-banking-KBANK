import { test, expect } from '@playwright/test';
import { aisReport, data, common, paymentOrder, sql, expectDb, settlement, enquiry, enquiryValidators,paymentOrderValidators, mockMobilebanking} from '../../fixtures/import';
import ais_report from '../../../ais-report/reportHTML';
import { screenshot } from '../../utils/common';

let i = 1;
const Id = () => `TC_E2E_${String(i++).padStart(3, '0')}`;

test.describe('[E2E] MockBanking', () => {
    test(`${Id()} ทดสอบการขาดการเชื่อมต่อหน้า dev-paymentweb.cdc.ais.th ระหว่างชำระเงิน`, async ({ page, context }) => {
        const testStepOpenLink = async () => {
            await page.goto('https://dev-paymentweb.cdc.ais.th/index.html?mode=backcase&x=129d570994a161c3627ca63d8eb95c54d0a5b01b69f534a9d0e8b1606be473a44ab995c185445a83831e68e11f42dbb824761c0812ae391b45015948831e89163a40294b68e33c7062bba37943b3377ea612cd3d5e6e88011d96e0b5af684d58bec63d965160d364e9184e8a61c69687334dc670e19cead015d97945ccd0ae0f').catch(() => null);
            await context.setOffline(true);
            await page.waitForTimeout(1000);
            await context.setOffline(false);
            await page.waitForSelector('text="OOPS! INTERNAL SERVER ERROR"');
            await common.screenshot(page, 'Disconnect Page');
        }
        await aisReport.addTestStep('Open CDC Link', testStepOpenLink, `await page.waitForSelector('text="OOPS! INTERNAL SERVER ERROR"');`);
        
    });

    test(`${Id()} ตรวจสอบการ switching ไป mpay เดิมหากไม่พบ trans_id`, async ({ page, request }) => {
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.completePayment_SUCCESS(page, request);

        const testStep = async () => {
            const timestamp = common.timestamp()+'B';
            const sqlCommand = `UPDATE switching.transaction_routing SET trans_id = '${timestamp}' WHERE order_id = '${requestBody.order_id}' AND merchant_id = '${requestHeaders["X-sdpg-merchant-id"]}';`;
            await sql.cat2_PostgreSQL(sqlCommand);
            const queryExpect = `SELECT * FROM switching.transaction_routing WHERE order_id = '${requestBody.order_id}' AND merchant_id = '${requestHeaders["X-sdpg-merchant-id"]}';`;
            const result = await sql.cat2_PostgreSQL(queryExpect);
            await aisReport.addContext(
                'SQL Command for trans_id',
                `${sqlCommand}`
            );
            await aisReport.addContext(
                'SQL Command for verify after edit trans_id',
                queryExpect
            );
            await aisReport.addContext(
                'Result after update trans_id',
                JSON.stringify(result)
            );
            expect(result[0].trans_id).toBe(timestamp);
        };
        const expectedResult = `expect(result[0].trans_id).toBe(timestamp)`
        await aisReport.addTestStep('Update trans_id of transaction_routing', testStep, expectedResult);


        const { response: enquiryApiResponse } = await enquiry.enquiryAPI(
            request, 
            {
                txn_id: paymentOrderApiResponse.body.txn_id,
                order_id: paymentOrderApiResponse.body.order_id
            },
            `expect(enquiryApiResponse.headers.switchingFlag).toBe('N')`
        );
        expect(enquiryApiResponse.headers.switchingflag).toBe('N');
        // await enquiryValidators.expect_txn_id_TXN_NOT_FOUND(enquiryApiResponse);
    });

    test(`${Id()} ตรวจสอบการพยายามชำระเงินโดยการ นำ link ที่เปิดไปแล้วมาเปิดซ้ำอีกครั้งเพื่อชำระเงิน`, async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await paymentOrderValidators.expectSuccess(paymentOrderApiResponse, requestBody);
        await expectDb.expectDb_beforeOpenLink_phase(requestHeaders, requestBody, paymentOrderApiResponse);
        const expectCode = `await page.waitForSelector(
                data.waitTextForLink, 
                { timeout: 30000 }
            );
        `
        const testStepOpenLink_1 = async () => {
            await page.goto(paymentOrderApiResponse.body.authorize_url);
            await page.waitForSelector(
                data.waitTextForLink, 
                { timeout: 30000 }
            );
            await common.screenshot(page, 'Open link');
        };
        const testStepOpenLink_2 = async () => {
            await page.goto(paymentOrderApiResponse.body.authorize_url);
            await page.waitForSelector(
                data.waitTextForLink, 
                { timeout: 30000 }
            );
            await common.screenshot(page, 'Open link');
        };
        await aisReport.addTestStep('Opening the link for the first time', testStepOpenLink_1, expectCode);

        await aisReport.addTestStep('Opening the link for the second time', testStepOpenLink_2, expectCode);
    
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
        const { response: enquiryApiResponse } = await enquiry.enquiryAPI(
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
    });

    test(`${Id()} ตรวจสอบการ Enquiry รายการที่ชำระเงินสำเร็จ (settlement : true)`, async ({ page, request }) => {
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.completePayment_SUCCESS(page, request);
        const { response: enquiryApiResponse } = await enquiry.enquiryAPI(
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
    });

    test(`${Id()} ตรวจสอบการ Enquiry รายการที่ชำระเงินสำเร็จ (settlement : false)`, async ({ page, request }) => {
        const formatDate = settlement.formatDate();
        const { 
            response: paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement:false, auto_settlement_at: formatDate}, paymentOrderValidators.expectSuccess);
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
            'SR0000', 'Success', 'notnull', null, 'notnull', 'PENDING', null, 'System',
            'SUCCESS', '0000', 'SUCCESS'
        );

        const { response: enquiryApiResponse } = await enquiry.enquiryAPI(
            request, 
            {
                txn_id: paymentOrderApiResponse.body.txn_id,
                order_id: paymentOrderApiResponse.body.order_id
            },
            enquiryValidators.expect_enquiry
        );
        await enquiryValidators.expect_enquiry(
            requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
            paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'SUCCESS', 'SR0000', 'Success', 'notnull', false, 'PENDING'
        );
        await expectDb.expectDb_completePayment_phase(
            requestHeaders, requestBody, paymentOrderApiResponse, 'SUCCESS', 'notnull', null,
            'SR0000', 'Success', 'notnull', null, 'notnull', 'PENDING', null, 'System',
            'SUCCESS', '0000', 'SUCCESS'
        );
    });

    test(`${Id()} ตรวจสอบการ Enquiry รายการที่ชำระเงินไม่สำเร็จ (Amount Mismatch)`, async ({ page, request }) => {
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.completePayment_FAIL(page, request, data.failButton, 'SR20001', 'Amount Mismatch', 'SUCCESS', '0000','SUCCESS');
        const { response: enquiryApiResponse } = await enquiry.enquiryAPI(
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
            'Amount Mismatch', 'notnull', null, null,'PENDING', null, null, 'SUCCESS', '0000', 'SUCCESS'
        );
    });

    test(`${Id()} ตรวจสอบการ Enquiry รายการที่ชำระเงินไม่สำเร็จ (Bank Failed)`, async ({ page, request }) => {
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.completePayment_FAIL(page, request, data.bankFailButton, 'SR10004', 'Bank Failed', 'FAIL', '0003','FAIL');
        const { response: enquiryApiResponse } = await enquiry.enquiryAPI(
            request, 
            {
                txn_id: paymentOrderApiResponse.body.txn_id,
                order_id: paymentOrderApiResponse.body.order_id
            }, 
            enquiryValidators.expect_enquiry
        );
        await enquiryValidators.expect_enquiry(
            requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
            paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'FAIL', 'SR10004', 'Bank Failed', null, true, 'PENDING'
        );
        await expectDb.expectDb_completePayment_phase(
            requestHeaders, requestBody, paymentOrderApiResponse, 'FAIL', null, 'notnull', 'SR10004',
            'Bank Failed', 'notnull', null, null,'PENDING', null, null, 'FAIL', '0003', 'FAIL'
        );
    });

    test(`${Id()} ตรวจสอบการ Enquiry รายการที่ยังไม่ชำระเงิน`, async ({ page, request }) => {
        const { 
            response: paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentOrderAPI(request, {}, paymentOrderValidators.expectSuccess);
        await paymentOrderValidators.expectSuccess(paymentOrderApiResponse, requestBody);
        const { response: enquiryApiResponse } = await enquiry.enquiryAPI(
            request, 
            {
                txn_id: paymentOrderApiResponse.body.txn_id,
                order_id: paymentOrderApiResponse.body.order_id
            }, 
            enquiryValidators.expect_enquiry
        );
        await enquiryValidators.expect_enquiry(
            requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
            paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'PENDING', 'SR0000', 'SUCCESS', null, true, 'PENDING'
        );
        await expectDb.expectDb_beforeOpenLink_phase(requestHeaders, requestBody, paymentOrderApiResponse);
    });

    test(`${Id()} ทดสอบความถูกต้องของ Webhook เมื่อชำระเงินสำเร็จ (settlement : true)`, async ({request, page}) => {
        await paymentOrder.webhookSUCCESS_TEST(request, page,
            {
                ["X-sdpg-merchant-id"]: data.merchantId_2, 
                service_id : data.serviceID_2
            },
            'CONFIRMED'
        ); 
    });

    test(`${Id()} ทดสอบความถูกต้องของ Webhook เมื่อชำระเงินสำเร็จ (settlement : false)`, async ({request, page}) => {
        const formatDate = settlement.formatDate();
        await paymentOrder.webhookSUCCESS_TEST(request, page,
            {
                ["X-sdpg-merchant-id"]: data.merchantId_2, 
                service_id : data.serviceID_2,
                is_auto_settlement:false, 
                auto_settlement_at: formatDate
            },
            'PENDING'
        );         
    });

    test(`${Id()} ตรวจสอบการชำระเงินรายการที่ชำระเงินสำเร็จ (settlement : true) แต่นำ Link มาเปิดอีกครั้ง`, async ({ page, request }) => {
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.completePayment_SUCCESS_NoDatabase(request, page);
        const openAgain = async () => {
            await page.goto(paymentOrderApiResponse.body.authorize_url);
            await page.waitForSelector(`text='Payment could not be completed.'`, {timeout:15000});
            await common.screenshot(page, 'Opening link again');
        };
        await aisReport.addTestStep('Opening the link again after complete payment',openAgain,`await page.waitForSelector("text='Payment could not be completed.'", {timeout:15000});`)
    });
});