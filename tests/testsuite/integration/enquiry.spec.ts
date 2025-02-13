import { test, expect } from '@playwright/test';
import { aisReport, data, common, paymentOrder, sql, expectDb, webhookKtb, enquiry, enquiryValidators, paymentOrderValidators} from '../../fixtures/import';

let i = 1;
const Id = () => `TC_EQ_${String(i++).padStart(3, '0')}`;

test.describe('[Integration Tests] Enquiry', () => {
    test(`${Id()} ตรวจสอบการดึงข้อมูลโดยใช้ order_id เดียวกันกับค่า X-sdpg-merchant-id ที่แตกต่างกัน`, async ({request, page}) => {
        const orderId = common.timestamp();
        const { 
            response: paymentOrderApiResponse_1,
            requestHeaders: requestHeaders_1,
            requestBody: requestBody_1
        } = await paymentOrder.paymentOrderAPI(request, {order_id: orderId, ["X-sdpg-merchant-id"]: data.merchantID_data, service_id : data.serviceID_data}, paymentOrderValidators.expectSuccess);
        await paymentOrderValidators.expectSuccess(paymentOrderApiResponse_1, requestBody_1);
        const { response: enquiryApiResponse_1 } = await enquiry.enquiryAPI(
            request, 
            {
                txn_id: 'DELETE_FIELD',
                order_id: paymentOrderApiResponse_1.body.order_id,
                ["X-sdpg-merchant-id"]: data.merchantID_data
            },
            enquiryValidators.expect_enquiry
        );
        await enquiryValidators.expect_enquiry(
            requestBody_1, requestHeaders_1, paymentOrderApiResponse_1,enquiryApiResponse_1,
            paymentOrderApiResponse_1.body.txn_id, 'PAYMENT', 'PENDING', 'SR0000', 'SUCCESS', 'notnull', true, 'PENDING'
        );


        const { 
            response: paymentOrderApiResponse_2,
            requestHeaders: requestHeaders_2,
            requestBody: requestBody_2
        } = await paymentOrder.paymentOrderAPI(request, {order_id: orderId, ["X-sdpg-merchant-id"]: data.merchantId_2, service_id : data.serviceID_2}, paymentOrderValidators.expectSuccess);
        await paymentOrderValidators.expectSuccess(paymentOrderApiResponse_2, requestBody_2);
        const { response: enquiryApiResponse_2 } = await enquiry.enquiryAPI(
            request, 
            {
                txn_id: 'DELETE_FIELD',
                order_id: paymentOrderApiResponse_2.body.order_id,
                ["X-sdpg-merchant-id"]: data.merchantId_2
            },
            enquiryValidators.expect_enquiry
        );
        await enquiryValidators.expect_enquiry(
            requestBody_2, requestHeaders_2, paymentOrderApiResponse_2,enquiryApiResponse_2,
            paymentOrderApiResponse_2.body.txn_id, 'PAYMENT', 'PENDING', 'SR0000', 'SUCCESS', 'notnull', true, 'PENDING'
        );
    });

    test(`${Id()} ตรวจสอบว่า order_id และ txn_id จาก payment_order เดียวกันสามารถดึงข้อมูลเดียวกันได้`, async ({request, page}) => {
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentorder_pending(request);
        const txnId = paymentOrderApiResponse.body.txn_id;
        const order_id = paymentOrderApiResponse.body.order_id;
        const {response:enquiryApiResponse} = await enquiry.enquiryAPI(request,{txn_id : txnId, order_id:order_id}, enquiryValidators.expect_enquiry);
        await enquiryValidators.expect_enquiry(
            requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
            paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'PENDING', 'SR0000', 'SUCCESS', 'notnull', true, 'PENDING'
        );
    });

    test(`${Id()} ตรวจสอบกรณีที่ใช้ order_id ที่ถูกต้อง แต่ txn_id ไม่ถูกต้อง`, async ({request, page}) => {
        const { 
            paymentOrderApiResponse,
        } = await paymentOrder.paymentorder_pending(request);

        const wrong_txid = paymentOrderApiResponse.body.txn_id + '23';
        const order_id = paymentOrderApiResponse.body.order_id;
        const {response} = await enquiry.enquiryAPI(request,{txn_id : wrong_txid, order_id:order_id}, enquiryValidators.expect_txn_id_TXN_NOT_FOUND);
        await enquiryValidators.expect_txn_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบกรณีที่ใช้ txn_id ที่ถูกต้อง แต่ order_id ไม่ถูกต้อง`, async ({request, page}) => {
        const { 
            paymentOrderApiResponse,
        } = await paymentOrder.paymentorder_pending(request);

        const txnid = paymentOrderApiResponse.body.txn_id;
        const wrong_orderId = paymentOrderApiResponse.body.order_id +'23';
        const {response} = await enquiry.enquiryAPI(request,{txn_id : txnid, order_id:wrong_orderId}, enquiryValidators.expect_txn_id_TXN_NOT_FOUND);
        await enquiryValidators.expect_txn_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบว่า order_id เพียงอย่างเดียวสามารถใช้ดึงข้อมูลได้`, async ({request, page}) => {
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentorder_pending(request);
        const order_id = paymentOrderApiResponse.body.order_id;
        const {response:enquiryApiResponse} = await enquiry.enquiryAPI(request,{txn_id : 'DELETE_FIELD', order_id:order_id}, enquiryValidators.expect_enquiry);
        await enquiryValidators.expect_enquiry(
            requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
            paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'PENDING', 'SR0000', 'SUCCESS', 'notnull', true, 'PENDING'
        );
    });

    test(`${Id()} ตรวจสอบว่า txn_id เพียงอย่างเดียวสามารถใช้ดึงข้อมูลได้`, async ({request, page}) => {
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentorder_pending(request);
        const txn_id = paymentOrderApiResponse.body.txn_id;
        const {response:enquiryApiResponse} = await enquiry.enquiryAPI(request,{txn_id : txn_id, order_id:'DELETE_FIELD'}, enquiryValidators.expect_enquiry);
        await enquiryValidators.expect_enquiry(
            requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
            paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'PENDING', 'SR0000', 'SUCCESS', 'notnull', true, 'PENDING'
        );
    });

    test(`${Id()} ตรวจสอบกรณีที่ไม่ได้ให้ทั้ง order_id และ txn_id`, async ({request, page}) => {
        const {response} = await enquiry.enquiryAPI(request, {order_id:'DELETE_FIELD', txn_id:'DELETE_FIELD'}, enquiryValidators.expect_INVALID_REQUEST);
        await enquiryValidators.expect_txn_id_or_order_id_Required(response);
    });

    test(`${Id()} ตรวจสอบการรับค่าของอักขระพิเศษของ order_id`, async ({request, page}) => {
        const {response} = await enquiry.enquiryAPI(request, {order_id : data.special_charactors, txn_id:'DELETE_FIELD'}, enquiryValidators.expect_INVALID_REQUEST);
        await enquiryValidators.expect_order_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบการรับค่าของอักขระพิเศษของ txn_id`, async ({request, page}) => {
        const {response} = await enquiry.enquiryAPI(request, {txn_id : data.special_charactors, order_id:'DELETE_FIELD'}, enquiryValidators.expect_INVALID_REQUEST);    
        await enquiryValidators.expect_order_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบว่า order_id สามารถเป็นตัวเลขจำนวนเต็มได้`, async ({request, page}) => {
        const orderid = common.createNumber(10);
        const {response} = await enquiry.enquiryAPI(request, {order_id : orderid,txn_id : 'DELETE_FIELD'}, enquiryValidators.expect_INVALID_REQUEST);
        await enquiryValidators.expect_txn_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบว่า txn_id สามารถเป็นตัวเลขจำนวนเต็มได้`, async ({request, page}) => {
        const txn_id = common.createNumber(10);
        const {response} = await enquiry.enquiryAPI(request, {txn_id : txn_id, order_id : 'DELETE_FIELD'}, enquiryValidators.expect_INVALID_REQUEST);   
        await enquiryValidators.expect_txn_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบการระบุข้อมูลของ txn_id โดยใช้ array`, async ({request, page}) => {
        const {response} = await enquiry.enquiryAPI(request, {txn_id : [data.txnId_enquiry_data], order_id : 'DELETE_FIELD'}, enquiryValidators.expect_INVALID_REQUEST);    
        await enquiryValidators.expect_INVALID_REQUEST(response);
    });

    test(`${Id()} ตรวจสอบการระบุข้อมูลของ order_id โดยใช้ array`, async ({request, page}) => {
        const {response} = await enquiry.enquiryAPI(request, {order_id : [data.orderId_data], txn_id : 'DELETE_FIELD'}, enquiryValidators.expect_INVALID_REQUEST); 
        await enquiryValidators.expect_INVALID_REQUEST(response);
    });

    test(`${Id()} ตรวจสอบว่า order_id ที่ไม่ถูกต้องจะถูกปฏิเสธ`, async ({request, page}) => {
        const {response} = await enquiry.enquiryAPI(request, {order_id : '98765437', txn_id : 'DELETE_FIELD'}, enquiryValidators.expect_order_id_TXN_NOT_FOUND);
        await enquiryValidators.expect_order_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบว่า txn_id ที่ไม่ถูกต้องจะถูกปฏิเสธ`, async ({request, page}) => {
        const {response} = await enquiry.enquiryAPI(request, {txn_id : '98765432', order_id : 'DELETE_FIELD'}, enquiryValidators.expect_txn_id_TXN_NOT_FOUND); 
        await enquiryValidators.expect_txn_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบว่า order_id สามารถมีความยาว 20 อักขระ`, async ({request, page}) => {
        const orderId = common.createString(20);
        const {response} = await enquiry.enquiryAPI(request, {order_id : orderId, txn_id : 'DELETE_FIELD'}, enquiryValidators.expect_order_id_TXN_NOT_FOUND);   
        await enquiryValidators.expect_order_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ที่ยาวเกินกว่าจำนวนที่กำหนด`, async ({request, page}) => {
        const orderId = common.createString(21);
        const {response} = await enquiry.enquiryAPI(request, {order_id : orderId, txn_id : 'DELETE_FIELD'}, enquiryValidators.expect_INVALID_REQUEST); 
        await enquiryValidators.expect_order_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบว่า txn_id สามารถมีความยาว 21 อักขระ`, async ({request, page}) => {
        const txnId = common.createString(21);
        const {response} = await enquiry.enquiryAPI(request, {txn_id : txnId, order_id : 'DELETE_FIELD'}, enquiryValidators.expect_order_id_TXN_NOT_FOUND);
        await enquiryValidators.expect_order_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบการระบุข้อมูล txn_id ที่ยาวเกินกว่าจำนวนที่กำหนด`, async ({request, page}) => {
        const txnId = common.createString(22);
        const {response} = await enquiry.enquiryAPI(request, {txn_id : txnId, order_id : 'DELETE_FIELD'}, enquiryValidators.expect_INVALID_REQUEST);
        await enquiryValidators.expect_order_id_TXN_NOT_FOUND(response);    
    });

    test(`${Id()} ตรวจสอบว่าไม่สามารถดึงข้อมูลของ txn_id โดยใช้ order_id ได้`, async ({request, page}) => {
        const {response} = await enquiry.enquiryAPI(request, {txn_id : data.orderId_enquiry_data, order_id : 'DELETE_FIELD'}, enquiryValidators.expect_txn_id_TXN_NOT_FOUND);    
        await enquiryValidators.expect_txn_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบว่าไม่สามารถดึงข้อมูลของ order_id โดยใช้ txn_id ได้`, async ({request, page}) => {
        const {response} = await enquiry.enquiryAPI(request, {order_id : data.txnId_enquiry_data, txn_id : 'DELETE_FIELD'}, enquiryValidators.expect_txn_id_TXN_NOT_FOUND); 
        await enquiryValidators.expect_order_id_TXN_NOT_FOUND(response);
    });

    test(`${Id()} ตรวจสอบการระบุ X-sdpg-nonce ว่าสามารถมีความยาว 36 อักขระ`,async ({page, request}) => {
        const nonce = common.createString(36);
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentorder_pending(request);
        const txnId = paymentOrderApiResponse.body.txn_id;
        const order_id = paymentOrderApiResponse.body.order_id;
        const {response:enquiryApiResponse} = await enquiry.enquiryAPI(request,{txn_id : txnId, order_id:order_id}, enquiryValidators.expect_enquiry, data.channelSecret, nonce);
        await enquiryValidators.expect_enquiry(
            requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
            paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'PENDING', 'SR0000', 'SUCCESS', 'notnull', true, 'PENDING'
        );
    });

    test(`${Id()} ตรวจสอบการระบุข้อมูล  X-sdpg-nonce ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
        const nonce = common.createString(37);
        const { 
            paymentOrderApiResponse,
            requestHeaders,
            requestBody
        } = await paymentOrder.paymentorder_pending(request);
        const txnId = paymentOrderApiResponse.body.txn_id;
        const order_id = paymentOrderApiResponse.body.order_id;
        const {response:enquiryApiResponse} = await enquiry.enquiryAPI(request,{txn_id : txnId, order_id:order_id}, enquiryValidators.expect_enquiry, data.channelSecret, nonce);
        await enquiryValidators.expect_enquiry(
            requestBody, requestHeaders, paymentOrderApiResponse,enquiryApiResponse,
            paymentOrderApiResponse.body.txn_id, 'PAYMENT', 'PENDING', 'SR0000', 'SUCCESS', 'notnull', true, 'PENDING'
        );
    });

    test(`${Id()} ตรวจสอบการไม่ระบุ X-sdpg-nonce`,async ({page, request}) => {
        const {response}  = await enquiry.enquiryAPI(request, {["X-sdpg-nonce"]:'DELETE_FIELD'}, enquiryValidators.MissingHeader);
        await enquiryValidators.MissingHeader(response);
    });

    test(`${Id()} ตรวจสอบการระบุ X-sdpg-merchant-id ที่ไม่มีอยู่ในระบบ`,async ({page, request}) => {
        const {response}  = await enquiry.enquiryAPI(request, {["X-sdpg-merchant-id"]:'0901'}, enquiryValidators.merchantNotFound);
        await enquiryValidators.merchantNotFound(response, '0901');
    });

    test(`${Id()} ตรวจสอบการไม่ระบุ X-sdpg-merchant-id`,async ({page, request}) => {
        const {response}  = await enquiry.enquiryAPI(request, {["X-sdpg-merchant-id"]:'DELETE_FIELD'},enquiryValidators.MissingHeader);
        await enquiryValidators.MissingHeader(response);
    });

    test(`${Id()} ตรวจสอบการไม่ระบุ X-sdpg-signature`,async ({page, request}) => {
        const {response}  = await enquiry.enquiryAPI(request, {["X-sdpg-signature"]:'DELETE_FIELD'},enquiryValidators.MissingHeader);
        await enquiryValidators.MissingHeader(response);
    });

    test(`${Id()} ตรวจสอบการเข้ารหัสด้วย SecretKey ที่ผิด`,async ({page, request}) => {
        const signature = common.timestamp();
        const {response}  = await enquiry.enquiryAPI(request, {["X-sdpg-signature"]:String(signature)}, enquiryValidators.signature_fail);
        await enquiryValidators.signature_fail(response);
    });
});