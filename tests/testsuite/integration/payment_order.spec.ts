import { test, expect } from '@playwright/test';
import { aisReport, data, common, paymentOrder, sql, expectDb, webhookKtb, paymentOrderValidators, settlement} from '../../fixtures/import';


let i = 1;
const Id = () => `TC_PO_${String(i++).padStart(3, '0')}`;

test.describe('[Integration Tests] Payment Order', () => {
  test(`${Id()} ตรวจสอบทำรายการ HTTP Method ด้วย POST`, async ({ page, request }) => {
    const method = 'post'
    const {response, requestBody} = await paymentOrder.paymentOrderAPI(request,{}, 'expect(404).toBe(response.status);',data.channelSecret, data.nonce_data, method);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบทำรายการ HTTP Method ด้วย GET`, async ({page, request}) => {
    const method = 'get'
    const {response} = await paymentOrder.paymentOrderAPI(request,{}, 'expect(404).toBe(response.status);',data.channelSecret, data.nonce_data, method);
    expect(404).toBe(response.status);
  });

  test(`${Id()} ตรวจสอบทำรายการ HTTP Method ด้วย PUT`, async ({page, request}) => {
    const method = 'put'
    const {response} = await paymentOrder.paymentOrderAPI(request,{}, 'expect(404).toBe(response.status);',data.channelSecret, data.nonce_data, method);
    expect(404).toBe(response.status);
  });

  test(`${Id()} ตรวจสอบทำรายการ HTTP Method ด้วย PATCH`, async ({page, request}) => {
    const method = 'patch'
    const {response} = await paymentOrder.paymentOrderAPI(request,{}, 'expect(404).toBe(response.status);',data.channelSecret, data.nonce_data, method);
    expect(404).toBe(response.status);
  });

  test(`${Id()} ตรวจสอบทำรายการ HTTP Method ด้วย DELETE`, async ({page, request}) => {
    const method = 'delete'
    const {response} = await paymentOrder.paymentOrderAPI(request,{}, 'expect(404).toBe(response.status);',data.channelSecret, data.nonce_data, method);
    expect(404).toBe(response.status);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ด้วยตัวเลข`,async ({page, request}) => {
    const order_id = Number(common.timestamp());
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{order_id : order_id}, paymentOrderValidators.expectSuccess);    
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ด้วย array`,async ({page, request}) => {
    const orderId = [common.timestamp()];
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{order_id : orderId}, paymentOrderValidators.expect_order_id_invalid_request);    
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ด้วยตัวหนังสือ`,async ({page, request}) => {
    const order_id = `${common.timestamp()}รายการ`;
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{order_id : order_id}, paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const order_id = `${Date.now()}{!%|[]}`;
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{order_id : order_id}, paymentOrderValidators.expectSuccess); 
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{order_id : null}, paymentOrderValidators.expect_order_id_invalid_request);
    await paymentOrderValidators.expect_order_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{order_id : ''}, paymentOrderValidators.expect_order_id_invalid_request);
    await paymentOrderValidators.expect_order_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ซ้ำ โดยทำรายการด้วย Marchant ต่างกัน`,async ({page, request}) => {
    const orderId = common.timestamp();
    const {response: responseFirst, requestBody: requestFirst}  = await paymentOrder.paymentOrderAPI(request,{order_id : orderId, ["X-sdpg-merchant-id"]: data.merchantID_data, service_id: data.serviceID_data}, paymentOrderValidators.expectSuccess);    
    await paymentOrderValidators.expectSuccess(responseFirst, requestFirst);

    const {response: responseSecond, requestBody: requestSecond}  = await paymentOrder.paymentOrderAPI(request,{order_id : orderId, ["X-sdpg-merchant-id"]: data.merchantId_2, service_id: data.serviceID_2}, paymentOrderValidators.expectSuccess);    
    await paymentOrderValidators.expectSuccess(responseSecond, requestSecond);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ซ้ำ โดยทำรายการด้วย Marchant เดียวกัน`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{order_id : 1234}, paymentOrderValidators.expectOrderId_invalid_duplicate);    
    await paymentOrderValidators.expectOrderId_invalid_duplicate(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ว่าสามารถมีความยาว 20 อักขระ`,async ({page, request}) => {
    const order_id = Number(common.timestamp()) + Number(common.createNumber(7));
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{order_id : order_id}, paymentOrderValidators.expect_order_id_invalid_request);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล order_id ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const order_id = String(common.timestamp()) + String(common.createNumber(8));
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{order_id : order_id}, paymentOrderValidators.expect_order_id_invalid_request);
    await paymentOrderValidators.expect_order_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล product_name ด้วยตัวเลข`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{product_name : 1234567890},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล product_name ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{product_name : data.arrayWord},paymentOrderValidators.expect_product_name_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล product_name ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{product_name : 'testinputdata'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล product_name ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{product_name : '{!@#$%^&*()_+'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล product_name ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{product_name : null},paymentOrderValidators.expect_product_name_invalid_request);
    await paymentOrderValidators.expect_product_name_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล product_name ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{product_name : ''},paymentOrderValidators.expect_product_name_invalid_request);
    await paymentOrderValidators.expect_product_name_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล product_name ว่าสามารถมีความยาว 255 อักขระ`,async ({page, request}) => {
    const prodcntName = common.createString(255);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{product_name : prodcntName},paymentOrderValidators.expectSuccess);  
    await paymentOrderValidators.expectSuccess(response, requestBody); 
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล product_name ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const prodcntName = common.createString(256);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{product_name : prodcntName},paymentOrderValidators.expect_product_name_invalid_request);  
    await paymentOrderValidators.expect_product_name_invalid_request(response); 
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล bank_code ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{bank_code : '006A'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expect_bank_code_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล bank_code ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{bank_code : '{!@'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expect_bank_code_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล bank_code ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{bank_code : null},paymentOrderValidators.expect_product_name_invalid_request);
    await paymentOrderValidators.expect_bank_code_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล bank_code ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{bank_code : ''},paymentOrderValidators.expect_product_name_invalid_request);
    await paymentOrderValidators.expect_bank_code_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล bank_code ว่าสามารถมีความยาว 3 อักขระ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{bank_code : '010'},paymentOrderValidators.expect_product_name_invalid_request);  
    await paymentOrderValidators.expect_bank_code_invalid_request(response); 
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล bank_code ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const bankCode = common.createNumber(5);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{bank_code : bankCode},paymentOrderValidators.expect_product_name_invalid_request);  
    await paymentOrderValidators.expect_bank_code_invalid_request(response); 
  });


  test(`${Id()} ตรวจสอบการระบุข้อมูล service_id ที่ไม่มีในระบบ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{service_id : '9232316340991'},paymentOrderValidators.expect_service_id_invalid_request);
    await paymentOrderValidators.expect_service_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล service_id ด้วยตัวเลข`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{service_id : Number(data.serviceID_data)},paymentOrderValidators.expect_service_id_invalid_request);
    await paymentOrderValidators.expect_service_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล service_id ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{service_id : [data.serviceID_data]},paymentOrderValidators.expect_service_id_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล service_id ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{service_id : 'TESTservice_id'},paymentOrderValidators.expect_service_id_invalid_request);
    await paymentOrderValidators.expect_service_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล service_id ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{service_id : '{!@#$%^&*()_+'},paymentOrderValidators.expect_service_id_invalid_request);
    await paymentOrderValidators.expect_service_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล service_id ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{service_id : null},paymentOrderValidators.expect_service_id_invalid_request);
    await paymentOrderValidators.expectServiceId_null(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล service_id ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{service_id : ''},paymentOrderValidators.expect_service_id_invalid_request);
    await paymentOrderValidators.expectServiceId_null(response)
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล service_id ว่าสามารถมีความยาว 36 อักขระ`,async ({page, request}) => {
    const serviceID = common.createString(36);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{service_id : serviceID},paymentOrderValidators.expect_service_id_invalid_request);
    await paymentOrderValidators.expect_service_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล service_id ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const serviceID = common.createString(37);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{service_id : serviceID},paymentOrderValidators.expect_service_id_invalid_request);
    await paymentOrderValidators.expect_service_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วย WEBSITE`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : 'WEBSITE'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วย APPLICATION`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : 'APPLICATION'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วย KIOSK`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : 'KIOSK'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วย website (ตัวพิมพ์เล็ก)`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : 'website'},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วย application (ตัวพิมพ์เล็ก)`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : 'application'},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วย kiosk (ตัวพิมพ์เล็ก)`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : 'kiosk'},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ที่ไม่มีในระบบ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : 'channel_type'},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วยตัวเลข`,async ({page, request}) => {
    const channelType = common.createNumber(4);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : channelType},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : ["APPLICATION"]},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วยตัวอักขระพิเศษ`, async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : '#!@$%^&'},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : null},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : ''},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ว่าสามารถมีความยาว 36 อักขระ`,async ({page, request}) => {
    const channel_type = common.createString(36);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : channel_type},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล channel_type ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const channel_type = common.createString(37);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{channel_type : channel_type},paymentOrderValidators.expect_channel_type_invalid_request);
    await paymentOrderValidators.expect_channel_type_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล cust_id ด้วยตัวเลข`,async ({page, request}) => {
    const custId = common.createNumber(10);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{cust_id : custId},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล cust_id ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{cust_id : [data.custId_data]},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล cust_id ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{cust_id : 'Test cust id'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });
  
  test(`${Id()} ตรวจสอบการระบุข้อมูล cust_id ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {cust_id : '{!@#$%^&*()_+|[]}'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล cust_id ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {cust_id : null},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล cust_id ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {cust_id : ''},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล cust_id ว่าสามารถมีความยาว 100 อักขระ`,async ({page, request}) => {
    const custId = common.createString(100);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{cust_id : custId},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล cust_id ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const custId = common.createString(101);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request,{cust_id : custId},paymentOrderValidators.expect_cust_id_invalid_request);
    await paymentOrderValidators.expect_cust_id_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ว่าสามารถมีความยาว 8 ตัวเลข และทศนิยม 2 ตัว ได้`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : '1000.99'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ว่าสามารถมีความยาว 8 ตัวเลข และทศนิยม 0 ตัว ได้`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : '1000'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ด้วยตัวเลขแบบ array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : ['1000.00']},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ด้วยตัวเลขแบบ string`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : '1000.00'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบ ระบุข้อมูล amount ด้วยเลขทศนิยมมากกว่าที่กำหนด`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : 1000.12345},paymentOrderValidators.expect_amount_invalid_request);
    await paymentOrderValidators.expect_amount_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : 'หนึ่งพันบาท'},paymentOrderValidators.expect_amount_invalid_request);
    await paymentOrderValidators.expect_amount_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : '!@#$'},paymentOrderValidators.expect_amount_invalid_request);
    await paymentOrderValidators.expect_amount_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ด้วยตัวเลข 0`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : 0},paymentOrderValidators.expect_amount_invalid_request);
    await paymentOrderValidators.expect_amount_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ด้วยตัวเลขที่มีค่าติดลบ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : -1000},paymentOrderValidators.expect_amount_invalid_request);
    await paymentOrderValidators.expect_amount_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : null},paymentOrderValidators.expect_amount_invalid_request);
    await paymentOrderValidators.expect_amount_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : ''},paymentOrderValidators.expect_amount_invalid_request);
    await paymentOrderValidators.expect_amount_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล amount ด้วยตัวเลขที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const amount = common.createNumber(15);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {amount : amount},paymentOrderValidators.expect_amount_invalid_request);
    await paymentOrderValidators.expect_amount_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล currency ที่ไม่อนุญาติ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {currency : 'USD'},paymentOrderValidators.expect_currency_invalid_request);
    await paymentOrderValidators.expect_currency_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล currency ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {currency : ['THB']},paymentOrderValidators.expect_currency_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล currency ที่ไม่ถูกต้อง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {currency : 123},paymentOrderValidators.expect_currency_invalid_request);
    await paymentOrderValidators.expect_currency_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล currency ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {currency : null}, paymentOrderValidators.expect_currency_invalid_request);
    await paymentOrderValidators.expect_currency_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล currency ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {currency : ''}, paymentOrderValidators.expect_currency_invalid_request);
    await paymentOrderValidators.expect_currency_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_1 ด้วยตัวเลข`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_1 : 1234567890},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_1 ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_1 : ["1234567890"]},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_1 ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_1 : 'Test cust id'},paymentOrderValidators.expectSuccess);  
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_1 ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_1 : `{!@#$%^&*()_+|['1']}`},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_1 ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_1 : null},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_1 ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_1 : ''},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_1 ว่าสามารถมีความยาว 255 อักขระ`,async ({page, request}) => {
    const ref = common.createString(255);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_1 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_1 ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const ref = common.createString(256);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_1 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expect_ref_1_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_2 ด้วยตัวเลข`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_2 : 1234567890},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_2 ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_2 : ["1234567890"]},paymentOrderValidators.expect_ref_2_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_2 ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_2 : 'Test cust id'},paymentOrderValidators.expectSuccess);  
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_2 ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_2 : `{!@#$%^&*()_+|['1']}`},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_2 ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_2 : null},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_2 ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_2 : ''},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_2 ว่าสามารถมีความยาว 255 อักขระ`,async ({page, request}) => {
    const ref = common.createString(255);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_2 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_2 ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const ref = common.createString(256);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_2 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expect_ref_2_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_3 ด้วยตัวเลข`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_3 : 1234567890},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_3 ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_3 : ["1234567890"]},paymentOrderValidators.expect_ref_3_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_3 ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_3 : 'Test cust id'},paymentOrderValidators.expectSuccess);  
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_3 ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_3 : `{!@#$%^&*()_+|['1']}`},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_3 ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_3 : null},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_3 ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_3 : ''},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_3 ว่าสามารถมีความยาว 255 อักขระ`,async ({page, request}) => {
    const ref = common.createString(255);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_3 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_3 ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const ref = common.createString(256);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_3 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expect_ref_3_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_4 ด้วยตัวเลข`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_4 : 1234567890},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_4 ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_4 : ["1234567890"]},paymentOrderValidators.expect_ref_4_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_4 ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_4 : 'Test cust id'},paymentOrderValidators.expectSuccess);  
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_4 ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_4 : `{!@#$%^&*()_+|['1']}`},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_4 ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_4 : null},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_4 ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_4 : ''},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_4 ว่าสามารถมีความยาว 255 อักขระ`,async ({page, request}) => {
    const ref = common.createString(255);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_4 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_4 ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const ref = common.createString(256);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_4 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expect_ref_4_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_5 ด้วยตัวเลข`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_5 : 1234567890},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_5 ด้วย array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_5 : ["1234567890"]},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_5 ด้วยตัวหนังสือ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_5 : 'Test cust id'},paymentOrderValidators.expectSuccess);  
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_5 ด้วยตัวอักขระพิเศษ`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_5 : `{!@#$%^&*()_+|['1']}`},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_5 ด้วยค่า null`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_5 : null},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_5 ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_5 : ''},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_5 ว่าสามารถมีความยาว 255 อักขระ`,async ({page, request}) => {
    const ref = common.createString(255);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_5 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล ref_5 ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const ref = common.createString(256);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {ref_5 : ref},paymentOrderValidators.expect_ref_1_invalid_request);
    await paymentOrderValidators.expect_ref_5_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล metadata เป็น String `,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {metadata : 'AAA'},paymentOrderValidators.expect_metadata_invalid_request);
    await paymentOrderValidators.expect_metadata_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล metadata เป็น Number `,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {metadata : 123},paymentOrderValidators.expect_metadata_invalid_request);
    await paymentOrderValidators.expect_metadata_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล metadata เป็น Array`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {metadata : data.arrayWord},paymentOrderValidators.expect_metadata_invalid_request);
    await paymentOrderValidators.expect_metadata_invalid_request(response);
  });
  test(`${Id()} ตรวจสอบการระบุข้อมูล metadata ด้วยค่า Null `,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {metadata : null},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });
  
  test(`${Id()} ตรวจสอบการระบุข้อมูล metadata ด้วยค่า string ว่าง `,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {metadata : ''},paymentOrderValidators.expect_metadata_invalid_request);
    await paymentOrderValidators.expect_metadata_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบว่าการระบุ url_success โดยใช้ protocol อื่นๆ (ktb)`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {url_success : 'ktb://payment/callback?status=success'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบว่าการระบุ url_success โดยไม่ใส่ protocal`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {url_success : data.urlnotProtpcal},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล url_success ด้วยค่า null`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {url_success : null},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expect_url_success_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล url_success ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {url_success : ''},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expect_url_success_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล url_success ด้วย array`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {url_success : [`${data.urlSuccess_data}`]},paymentOrderValidators.expect_url_success_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบว่าการระบุ url_fail โดยใช้ protocol อื่นๆ (ktb)`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {url_fail : 'ktb://payment/callback?status=fail'},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบว่าการระบุ url_fail โดยไม่ใส่ protocal`,async ({page, request}) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {url_fail : data.urlnotProtpcal},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล url_fail ด้วยค่า null`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {url_fail : null},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expect_url_fail_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล url_fail ด้วยค่า string ว่าง`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {url_fail : ''},paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expect_url_fail_invalid_request(response);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล url_fail ด้วย array`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {url_fail : [`${data.urlFail_data}`]},paymentOrderValidators.expect_url_fail_invalid_request);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ทดสอบการตั้งค่า auto settlement เมื่อ settlementTriggerFlag เป็น null`, async ({ request }) => {
    await settlement.updateSettlementTriggerFlag(null);
    const { response, requestBody } = await paymentOrder.paymentOrderAPI(
      request, 
      { is_auto_settlement: false, auto_settlement_at: 'DELETE_FIELD' }, 
      'erroe : MANUAL_SETTLEMENT_NOT_ALLOWED'
    );
    
    await settlement.updateSettlementTriggerFlag('True');
    await paymentOrderValidators.settlementTriggerFlag_fail(response)
  });

  test(`${Id()} ทดสอบการตั้งค่า auto settlement เมื่อ settlementTriggerFlag เป็น false`, async ({ page, request }) => {
    await settlement.updateSettlementTriggerFlag(false);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(
      request,
      {
        is_auto_settlement : false, 
        auto_settlement_at : 'DELETE_FIELD'
      },
      'erroe : MANUAL_SETTLEMENT_NOT_ALLOWED'
    );
    const erorCode = (response.body.error);
    await settlement.updateSettlementTriggerFlag('True');
    await paymentOrderValidators.settlementTriggerFlag_fail(response)
  });
  
  test(`${Id()} ทดสอบการตั้งค่า auto_settlement_at ก่อนวันที่ปัจจุบัน`, async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : false, auto_settlement_at : settlement.formatDate(-1)}, 'erroe : MANUAL_SETTLEMENT_NOT_ALLOWED');
    await paymentOrderValidators.autoSettlementAtBefore_fail(response)
  });
  
  test(`${Id()} ทดสอบการตั้งค่า auto_settlement_at เกินกำหนด`, async ({ page, request }) => {
    const periodTime = await settlement.queryPeriodTime();
    const maxperiodTime =  Number(periodTime) + 1;
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : false, auto_settlement_at : settlement.formatDate(maxperiodTime)}, 'erroe : auto_settlement_at is over limit.');
    await paymentOrderValidators.autoSettlementAtOverLimit(response)
  });

  test(`${Id()} ทดสอบการตั้งค่า auto_settlement_at ในระยะเวลาที่กำหนด`, async ({ page, request }) => {
    const periodTime = await settlement.queryPeriodTime();
    const limitPeriodTime =  Number(periodTime);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : false, auto_settlement_at : settlement.formatDate(limitPeriodTime)}, 'erroe : Success');
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });
  
  test(`${Id()} ทดสอบการตั้งค่า is_auto_settlement = false และ settlementTriggerFlag = true`, async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : false, auto_settlement_at : null}, paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });
  
  test(`${Id()} ทดสอบการตั้งค่า is_auto_settlement = null และ settlementTriggerFlag = true`, async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : null, auto_settlement_at : null}, paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ทดสอบการตั้งค่า is_auto_settlement = ค่าว่าง และ settlementTriggerFlag ค่าว่าง `, async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : '', auto_settlement_at : ''}, paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });
  
  test(`${Id()} ทดสอบการตั้งค่า is_auto_settlement = %^$#`, async ({ page, request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {is_auto_settlement : '%^$#', auto_settlement_at : null}, paymentOrderValidators.invalidType);
    await paymentOrderValidators.invalidType(response);
  });

  test(`${Id()} ตรวจสอบการทำงานของ webhook เมื่อไม่ระบุ settlement parameter`, async ({ request }) => {
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {settlement : 'DELETE_FIELD'}, paymentOrderValidators.expectSuccess);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุ X-sdpg-nonce ว่าสามารถมีความยาว 36 อักขระ`,async ({page, request}) => {
    const nonce = common.createString(36);
    const {response, requestBody}  = await paymentOrder.paymentOrderAPI(request, {},paymentOrderValidators.MISSING_SECURITY_CONTEXT, data.channelSecret, nonce);
    await paymentOrderValidators.expectSuccess(response, requestBody);
  });

  test(`${Id()} ตรวจสอบการระบุข้อมูล  X-sdpg-nonce ที่ยาวเกินกว่าจำนวนที่กำหนด`,async ({page, request}) => {
    const nonce = common.createString(37);
    const {response}  = await paymentOrder.paymentOrderAPI(request, {},paymentOrderValidators.MISSING_SECURITY_CONTEXT, data.channelSecret, nonce);
    throw new Error('Waiting to improve the validate of headers');
  });

  test(`${Id()} ตรวจสอบการไม่ระบุ X-sdpg-nonce`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {["X-sdpg-nonce"]:'DELETE_FIELD'},paymentOrderValidators.MISSING_SECURITY_CONTEXT);
    await paymentOrderValidators.MISSING_SECURITY_CONTEXT(response);
  });

  test(`${Id()} ตรวจสอบการระบุ X-sdpg-merchant-id ที่ไม่มีอยู่ในระบบ`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {["X-sdpg-merchant-id"]:'0901'},paymentOrderValidators.expectX_sdpg_merchant_id_invalid_null);
    await paymentOrderValidators.expectX_sdpg_merchant_id_invalid_null(response);
  });

  test(`${Id()} ตรวจสอบการไม่ระบุ X-sdpg-merchant-id`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {["X-sdpg-merchant-id"]:'DELETE_FIELD'},paymentOrderValidators.MISSING_SECURITY_CONTEXT);
    await paymentOrderValidators.MISSING_SECURITY_CONTEXT(response);
  });

  test(`${Id()} ตรวจสอบการไม่ระบุ X-sdpg-signature`,async ({page, request}) => {
    const {response}  = await paymentOrder.paymentOrderAPI(request, {["X-sdpg-signature"]:'DELETE_FIELD'},paymentOrderValidators.MISSING_SECURITY_CONTEXT);
    await paymentOrderValidators.MISSING_SECURITY_CONTEXT(response);
  });

  test(`${Id()} ตรวจสอบการเข้ารหัสด้วย SecretKey ที่ผิด`,async ({page, request}) => {
    const signature = common.timestamp();
    const {response}  = await paymentOrder.paymentOrderAPI(request, {["X-sdpg-signature"]:String(signature)},paymentOrderValidators.MISSING_SECURITY_CONTEXT);
    await paymentOrderValidators.signature_fail(response);
  });
});
