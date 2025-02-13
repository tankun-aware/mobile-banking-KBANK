export const data ={
    // baseURL_1: 'http://10.138.45.191:20001',
    // baseURL_2: 'http://10.138.45.191:20002',

    baseURL_1: 'https://dev-payment-api.cdc.ais.th',

    payment_order_path: '/dev/service-txn-gateway/v1/ib/payment_order',
    enquiry_path: '/dev/service-txn-gateway/v1/enquiry',
    generate_token_path: '/v1/sofmobilebanking/paymentGenerateToken',
    validate_token_path: '/v1/sofmobilebanking/validateToken',
    enquirySOF_path: '/v1/sofmobilebanking/enquiry',
    //payment_path:'/v1/paymobilebanking/payment',
    payment_path:'/v1/transaction/payment',
    paymentUpdate_path: '/v1/paymobilebanking/transaction/payment_update',
    generateToken_path: '/v1/sofmobilebanking/paymentGenerateToken',
    paymentSof_path: '/v1/sofmobilebanking/ktb/payment',
    webhook_path: '/v1/mb/webhook/ktb',

    nonce_data: '1733111925',
    merchantID_data: '5916505',

    productName_data: 'product_name_00001',
    channelType_data: 'APPLICATION',
    custId_data: 'x0817222',
    cuscustId_data_exceed: '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',

    matadataColor_data: 'ref',
    channelSecret: '30e11f70829a6875',
    // amount_data: '120',
    amount_data_payment_order: 200,
    amount_data_webhook: '215',
    amount_numberType_data: 120,
    currency_data: 'THB',
    redirect_urls_data: { 
        "url_success": "https://open.spotify.com/",
        "url_fail": "https://www.google.co.th"
    },


    correlatorId_data: '1234',
    paymentId_data: '924304141086603331921',
    serviceID_data: '20259992019998001',
    serviceID_2: '20259992019998010',
    paymentMethod_id_data: '2531',
    paymentMethod_referredType_data: 'Bank',
    payer_id_data: '756232',
    channel_id_data: '11425',
    channel_name_data: 'KIOSK',
    orderId_data: '1234',
    ref1_data: 'reference1',
    ref2_data: 'reference2',
    ref3_data: 'reference3',
    ref4_data: 'reference4',
    ref5_data: 'reference5',
    amount_unit_data: 'THB',
    amount_value_data: 150,
    urlSuccess_data: 'https://postman-echo.com/get?case=success',
    urlnotProtpcal: 'www.postman-echo.com/get?case=success',
    
    
    urlFail_data: 'https://postman-echo.com/get?case=fail',
    bankCode_data: '006',
    callbackType_data: 'WEB',
    deeplinkFlag_data: 'Y',
    mobilePlatform_data: '1234',
    aisOriginalSystem_data: 'MERCHANT',
    X_sdpg_merchant_id_data: '5916505',
    merchantId_2 : '5916510',

    is_auto_settlement_data: true,
    auto_settlement_at_data: 'DELETE_FIELD',
    

    injection: `$_+`,
    falseInjection: `'OR'1'='0`,
    duplicateCorrelatorId: '123456',
    intWord : 123,
    arrayWord: ["1", "2", "3"],
    objectWord: {"Key":"Value"},
    stringWord: 'AAA',
    variousInvalidId: 'AAAAAAAAAAA',
    duplicateOrderId: '123456',
    nineDigits: 999999999,
    fourDecimalPlaces: 350.9999,
    negativeValue: -300,
    oneValue: 1,
    zeroValue: 0,
    intBankCode: 6,
    invalidBankCode: '004',
    doesNotActuallyExist: '099',
    callbackType_APP: 'APP',
    callbackType_WEB: 'WEB',
    aisOriginalSystem_KIOS :'KIOS',
    aisOriginalSystem_MERCHANT : 'MERCHANT',
    chanelName_COUNTER_STATION: 'COUNTER_STATION',
    chanelName_KIOSK: 'KIOSK',
    chanelName_APPLICATION: 'APPLICATION',
    chanelName_WEBSITE: 'WEBSITE',
    chanelName_QR: 'QR',


    expireOrderId: 'expireOrderId',
    firstMerchant: '5016503',
    secondMerchant: '2121993',
    invalidService: '99999999999999999',
    inActiveService: 'inActiveService',
    invalidChannel: '99999999999999999',
    invalidCurrency: 'ABC',
    currency_USD: 'USD',
    currency_THB: 'THB',

    status_PENDING: 'PENDING',

    //requirefield_orderid_message: 'invalid arguments : Please provide a order_id',
    requirefield_orderid_message: 'INVALID_REQUEST',
    inValidLength_orderid_message: 'INVALID_REQUEST',
    inValidDuplicate_orderid_message: 'ORDER_ID_DUPLICATE',
    //invalidType_message: 'invalid format',
    invalidType_message: 'Invalid request parameter',

    requirefield_productname_message: 'invalid arguments : Please provide a product_name',
    inValidArguments_productname_message: 'Invalid arguments : product_name',
    inValidLength_productname_message: 'invalid arguments : Please provide a product_name size must be between 1 and 255',

    requirefield_bankcode_message: 'invalid arguments : Please provide a bankcode',
    inValidBankCode_bankcode_message: 'invalid arguments : bank_code',
    nullBankCode_bankcode_message: 'SFM-3005',
    inValidLength_bankcode_message: 'invalid arguments : Please provide a bank_code size must be between 1 and 3',

    requirefield_service_message: 'invalid arguments : Please provide a service_id',
    invalidService_service_message: 'Service not exist an merchant',
    lengthService_service_message: "invalid arguments : Please provide a bank_code size must be between 1 and 36",

    requirefield_channel_message: 'invalid arguments : Please provide a channel_type',
    invalidChannelType_service_message: 'Invalid arguments : channel_type',
    lengthService_channel_message: "invalid arguments : Please provide a channel_type size must be between 1 and 36",

    lengthCustID_CustID_message: "invalid arguments : Please provide a cust_id size must be between 1 and 100",


    requirefield_currency_message: 'invalid arguments : Please provide a currency',
    invalid_currency_message: 'Invalid arguments : currency',
    requirefield_amount_message: 'invalid arguments : Please provide a amount',
    nullAmount_amount_message: "Can't create transaction",
    range_amount_message: 'invalid arguments : Minimum amount must be 1',
    invalid_amount_message: 'Invalid arguments : amount',
    length_amount_message: "invalid arguments : Please provide a amount size must be between 1 and 10",

    refLength_ref1_message: "invalid arguments : Please provide a ref_1 size must be between 1 and 255",
    refLength_ref2_message: "invalid arguments : Please provide a ref_2 size must be between 1 and 255",
    refLength_ref3_message: "invalid arguments : Please provide a ref_3 size must be between 1 and 255",
    refLength_ref4_message: "invalid arguments : Please provide a ref_4 size must be between 1 and 255",
    refLength_ref5_message: "invalid arguments : Please provide a ref_5 size must be between 1 and 255",

    headerMissing_header_message_data: 'missing security headers (X-sdpg-nonce, X-sdpg-merchant-id, X-sdpg-signature)',
    headerLength_header_message_data: "Can't create transaction",
    invalid_header_message: "error invalid hash signature",
    lengthNonce_header_message:'invalid arguments :Please provide a X-sdpg-nonce size must be between 1 and 36',
    lengthMerchant_header_message:'invalid arguments :Please provide a X-sdpg-merchant-id size must be between 1 and 128',
    lengthSignature_header_message:'invalid arguments :Please provide a X-sdpg-signature size must be between 1 and 20',


    requrefield_urlSuccess_message: 'invalid arguments : Please provide a url_success',
    inValidLength_urlSuccess_message: 'invalid arguments : Please provide a url_success size must be between 1 and 255',
    inValidLength_urlFail_message: 'invalid arguments : Please provide a url_fail size must be between 1 and 255',
    requrefield_urlFail_message: 'invalid arguments : Please provide a url_fail',

    length_auto_settlement_at_message: 'invalid arguments : Please provide a auto_settlement_at size must be between 1 and 255',


    // expectedKeys_success : [
    //     'order_id', 
    //     'txn_id', 
    //     'status', 
    //     'status_code',
    //     'status_message',
    //     'created_at',
    //     'currency',
    //     'amount',
    //     'amount_net',
    //     'amount_cust_fee',
    //     'authorize_url'
    // ],

    expectedKeys_success : [
        'order_id', 
        'txn_id', 
        'status', 
        'message',
        'created_at',
        'currency',
        'amount',
        'amount_net',
        'amount_cust_fee',
        'authorize_url'
    ],

    expectedKeys_fail : [
        'error_code', 
        'error', 
        'cause', 
        'timestamp',
        'context_path',
        'service',
        'trace_id'
    ],

    //validate Token
    validateToken_data: '46d96UNYjM9Zc3I10oqZP3VPTOi1DwJ9-shaSf58n78n8PM9UfejpsOZlWC9Bla4SMGyxRSLNoM86jaUxOzZHQ==',
    
    expectedValidateToken_success : ['responseStatus', 'txn_id', 'bank_code'],
    expectedValidateToken_success_sub: ['respSts', 'respSysCd', 'respSysDesc'],

    expectedValidateToken_fail : ['responseStatus'],
    expectedValidateToken_fail_sub: ['respSts', 'respSysCd', 'respSysDesc'],

    response_validateToken_respSts_success: 'SUCCESS',
    response_validateToken_respSysCd_success: 'sofmobilebanking-1000',
    response_validateToken_respSysDesc_success: 'Success',

    response_validateToken_respSts_fail: 'FAIL',
    response_validateToken_respSysCd_fail: 'sofmobilebanking-SFM-1009',
    response_validateToken_respSysDesc_fail: 'Token invalid',

    response_validateToken_respSts_require: 'FAIL',
    response_validateToken_respSysCd_require: 'SFM-2005',
    response_validateToken_respSysDesc_require: 'Missing required request parameter',

    response_validateToken_respSts_failType: 'FAIL',
    response_validateToken_respSysCd_failType: 'sofmobilebanking-2007',
    response_validateToken_respSysDesc_failType: 'Invalid request parameter',

    response_validateToken_respSts_headerRequire: 'FAIL',
    response_validateToken_respSysCd_headerRequire: 'SFM-2003',
    response_validateToken_respSysDesc_headerRequire: 'Missing required header',

    response_validateToken_respSts_headerInvalid: 'FAIL',
    response_validateToken_respSysCd_headerInvalid: 'SFM-2002',
    response_validateToken_respSysDesc_headerInlvalid: 'Invalid header',

    expect_txnId: '924291105546163014945',
    expect_bankCode: '006',



    fail_respSts_message: 'FAIL',
    success_respSts_message: 'SUCCESS',

    success_respSysCd_message: 'SFM-1000',
    requireHeader_respSysCd_message: 'SFM-2003',
    invalidHeader_respSysCd_message: 'SFC-2002',
    requrie_respSysCd_message: 'SFC-2005',
    invalidparameter_respSysCd_message: 'SFC-2007',
    invalidId_respSysCd_message: 'SFM-1009',

    requireHeader_respSysDesc_message: 'Missing required header',
    invalidHeader_respSysDesc_message: 'Invalid header',
    requrieBody_respSysDesc_message: 'Missing required request parameter',
    invalidBody_respSysDesc_message: 'Invalid request parameter',
    invalidId_respSysDesc_message: '',

    respSysDesc_message: 'Invalid token : ',

    //enquiry
    txnId_enquiry_data : '92436016552925534190',
    orderId_enquiry_data: '1735120530',
    merchantID_enquiry_data: '5016503',
    special_charactors : '#@*-)',
    responseKeys_enquiry_success : [
        'order_id', 
        'merchant_id', 
        'txn_id', 
        'txn_type',
        'sof_type',
        'status',
        'status_code',
        'status_message',
        'amount',
        'amount_net',
        'amount_cust_fee',
        'currency',
        'service_id',
        'channel_type',
        'cust_id',
        'ref_1',
        'ref_2',
        'ref_3',
        'ref_4',
        'ref_5',
        'metadata',
        'created_at',
        'success_at',
        'refunds',
        'settlement',
    ],
    responseKeys_enquiry_fail : [
        'error_code', 
        'error', 
    ],
    enquiry_transaction: 'Transaction not found',
    enquiry_notfound: 'TXN_NOT_FOUND',

    enquiry_error_require: 'Invalid header or parameter',
    enquiry_errorCode_require: 'INVALID_REQUEST',

    //enquirySOF
    responseKeys_enquirySOF_success : [
        'responseStatus', 
        'data', 
    ],
    responseKeys_enquirySOF_success_responseStatus : [
        'respSts', 
        'respSysCd', 
        'respSysDesc'
    ],
    responseKeys_enquirySOF_success_data : [
        'paymentItem', 
        'amount', 
        'TORO_feeAmount',
        'totalAmount',
        'payer',
        'TORO_status',
        'TORO_createDate',
        'TORO_updateDate',
        'TORO_paymentStatus',
    ],
    responseKeys_enquirySOF_success_data_paymentItem : [
        'id', 
        'item'
    ],
    responseKeys_enquirySOF_success_data_paymentItem_item : [
        'id', 
        'TORO_serviceId',
        'TORO_ref1',
        'TORO_ref2',
        'TORO_ref3',
        'TORO_ref4',
        'TORO_ref5',
    ],
    responseKeys_enquirySOF_success_data_amount : [
        'unit', 
        'value'
    ],
    responseKeys_enquirySOF_success_data_TOROFeeAmount : [
        'unit', 
        'value'
    ],
    responseKeys_enquirySOF_success_data_totalAmount : [
        'unit', 
        'value'
    ],
    responseKeys_enquirySOF_success_data_payer : [
        'id', 
    ],
    txnId_enquirySOF_data : '924299131084602621570',
    responseKeys_enquirySOF_fail : [
        'responseStatus',
        'data',
    ],
    responseKeys_enquirySOF_fail_responseStatus : [
        'respSts',
        'respSysCd',
        'respSysDesc'
    ],
    responseStatus_respSts_enquirySOF_success: 'SUCCESS',
    responseStatus_respSts_enquirySOF_fail: 'FAIL',
    responseStatus_respSysCd_enquirySOF_fail: 'sofmobilebanking-SFM-4003',
    responseStatus_respSysDesc_enquirySOF_fail: 'Transaction not found',

    responseStatus_respSts_enquirySOF_failType: 'FAIL',
    responseStatus_respSysCd_enquirySOF_failType: 'sofmobilebanking-2007',
    responseStatus_respSysDesc_enquirySOF_failType: 'Invalid request parameter',

    //payment
    payment_id: 'zBjS1PL-U75HRfwmJTsFfaD3STZmwILe8yOnwbiSwaFaxkDW8KmeDkXm2i333Yx3R4ne1jADoK1a9WztMqGkAA==',
    paymentSof_id: '924317091125003513931',
    responseStatus_respSts_enquirySOF_requireHeader: 'FAIL',
    responseStatus_respSysCd_enquirySOF_requireHeader: 'sofmobilebanking-SFM-2003',
    responseStatus_respSysDesc_enquirySOF_requireHeader: 'Missing required header',
    transaction_not_found : 'D2_zEyccUBN15HKUsuDsa8n0NtNL4aTLtBUo_FhnELNuYe2JS789J_qfCa3E--_HhjJxmubwHaCHvzfdX3fwWg==',

    //Generate Token
    responseKeys_genarateToken_responseStatus_success : [
        'respSts', 
        'respSysCd', 
        'respSysDesc'
    ],
    responseKeys_genarateToken_data_success : [
        'correlatorId', 
        'paymentId', 
        'authorizeUrl',
        'status',
        'sofRateType',
        'createdAt',
        'totalAmount',
        'TORO_feeAmount',
        'TORO_feeVatAmount',
    ],
    responseKeys_genarateToken_valueUnit : [
        'unit',
        'value'
    ],

    //generate Token
    response_generateToken_respSts_success: 'SUCCESS',
    response_generateToken_respSysCd_success: '1000',
    response_generateToken_respSysDesc_success: null,

    response_generateToken_respSts_invalid: 'FAIL',
    response_generateToken_respSysCd_invalid: 'SFM-2007',
    response_generateToken_respSysDesc_invalid: 'Invalid request parameter',

    response_generateToken_respSts_require: 'FAIL',
    response_generateToken_respSysCd_require: 'SFM-2005',
    response_generateToken_respSysDesc_require: 'Missing required request parameter',

    response_generateToken_respSts_duplicate: 'FAIL',
    response_generateToken_respSysCd_duplicate: 'SFM-4001',
    response_generateToken_respSysDesc_duplicate: 'Duplicate request',

    response_generateToken_respSts_currency: 'FAIL',
    response_generateToken_respSysCd_currency: 'sofmobilebanking-SFM-XXXX',
    response_generateToken_respSysDesc_currency: 'Currency is invalid',

    response_generateToken_respSts_bankcode: 'FAIL',
    response_generateToken_respSysCd_bankcode: 'SFM-3005',
    response_generateToken_respSysDesc_bankcode: 'Bank code is not available',

    response_generateToken_respSts_invalidHeader: 'FAIL',
    response_generateToken_respSysCd_invalidHeader: 'SFM-2002',
    response_generateToken_respSysDesc_invalidHeader: 'Invalid header',

    response_generateToken_respSts_requireHeader: 'FAIL',
    response_generateToken_respSysCd_requireHeader: 'SFM-2003',
    response_generateToken_respSysDesc_requireHeader: 'Missing required header',

    X_sdpg_signature_data: 'f89ed07d659084a0bad9fc6d5dd1fe936e2de683af3d68dd0295bacbf7665649',
    Content_Type_data: 'application/json; charset=UTF-8',
    key1_data: 'value1',
    key2_data: 'value2',
    productname_exceedAmount: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456',

    // Mpayone
    X_sdpg_nonce_data_mpayone: '1734336289',
    X_sdpg_merchant_id_data_mpayone: '2121992',
    X_sdpg_signature_data_mpayone: '058cfe938db07b1aeababf0ca73a7bb7bcb0e8104e234daca02a890f57ee734f',
    Content_Type_data_mpayone: 'application/json',
    
    X_sdpg_skip_validation_data_mpayone: 'bKkVZw1fOklHfxMXxxRhog==',
    
    order_id_data_mpayone: "order_id_new28s5",
    product_name_data_mpayone: "product_test_00001",
    service_id_data_mpayone: "21219922213900864",
    channel_type_data_mpayone: "APPLICATION",
    productName_data_mpayone: 'product_test_00001',
    // correlatorId_data_mpayone: '1234',
    // paymentId_data_mpayone: '924304141086603331921',
    serviceID_data_mpayone: '21219922213900864',
    channelType_data_mpayone: 'APPLICATION',
    cust_id_data_mpayone: 'cust_id_00001',
    bank_code_data_mpayone: "006",
    ref_1_data_mpayone: "ref_1",
    ref_2_data_mpayone: "ref_2",
    ref_3_data_mpayone: "ref_3",
    ref_4_data_mpayone: "ref_4",
    ref_5_data_mpayone: "ref_5",
    currency_data_mpayone: "THB",
    amount_data_mpayone: 100,
    // metadata_data_mpayone:
    color_data_mpayone: "ref",
    // "redirect_urls": {
    url_success_data_mpayone: "https://open.spotify.com/",
    url_fail_data_mpayone: "https://www.google.co.th",

    // fail data
    channel_type_data_exceed : "APPLICATIONAPPLICATIONAPPLICATIONAPP",
    ref_data_exceed : "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456",

    // WEBHOOK DATA
    transactionRefId_webhook_data: "92435510172334919320",
    transactionType_webhook_data: "PAYMENT",
    status_webhook_data: "SUCCESS",
    transactionCreatedTimestamp_webhook_data: "2024-12-17T13:21:12+07:00",
    transactionUpdatedTimestamp_webhook_data: "2024-12-17T13:21:45+07:00",
    transactionValidUntilTimestamp_webhook_data: "2024-12-17T13:21:43+07:00",
    reference1_webhook_data: "92435415114714832648",
    amount_webhook_data: 215.00,
    fee_webhook_data: 15.00,
    deeplinkUrl_webhook_data: "ais://ais.co.th/xxx",
    name_webhook_data: "myAIS",

    transaction_data_fail: "92500615142244924076", // Order_id = "1736151266"
    mock_mobile: "../../mockfile/mock-mobile-banking.html", // full path ?TXID=92435411064108245193&MID=5016503&AMT=215.50
    successButton: '#openModalButton',
    failButton: '#fail-openModalButton',
    bankFailButton: '#fail-openModalButton-2',

    expect_success_url: 'https://postman-echo.com/get?case=success&transactionId=',
    expect_fail_url: 'https://postman-echo.com/get?case=fail&transactionId=',

    waitTextForLink: `text="Bank application not installed,Please install application."`,
    requestBodyWebhook: `.req-content.ng-binding.ng-scope.wordwrapDisable`,
    webhook_baseURL: 'https://webhook.site/',
    webhook_baseURL_Regex: /https:\/\/webhook\.site\/#!\/view\//,
    webhook_view: 'https://webhook.site/#!/view/',
}
