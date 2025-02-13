import test, { expect, Page } from '@playwright/test';
import { data, common, sql, aisReport } from '../fixtures/import';
import * as crypto from 'crypto';import sharp from 'sharp';
;


export async function api(request:any,url: string, requestHeaders: Record<any, any> | null, requestBody: Record<string, any> | null, medthod:string = 'post') {
    const allResponse = await request[medthod](url, {
        headers: requestHeaders,
        data: requestBody,
        timeout: 12000,
    });
    
    const response = {
        headers: allResponse.headers(),
        body: JSON.parse(await allResponse.text()),
        status: allResponse.status()
    };
    return response;
    
}


export async function TwoHundredStatus(status: string) {
    aisReport.addContext(
        'Status',
        `${JSON.stringify(status, null, 2)}`
    );
}


export async function commonReport(
    url: String, 
    requestHeader: Record<string, any>, 
    requestBody: Record<string, any>, 
    responseHeaders: Record<string, any>, 
    responseBody: Record<string, any>) {
    await aisReport.addContext(
        'URL',
        `${JSON.stringify(url, null, 2)}`
    );
    await aisReport.addContext(
        'Request Headers',
        `${JSON.stringify(requestHeader, null, 2)}`
    );
    await aisReport.addContext(
        'Request Body',
        `${JSON.stringify(requestBody, null, 2)}`
    );
    await aisReport.addContext(
        'Response Headers',
        `${JSON.stringify(responseHeaders, null, 2)}`
    );
    await aisReport.addContext(
        'Response Body',
        `${JSON.stringify(responseBody, null, 2)}`
    );
}


export function signature(requestBody:Record<string, any>, nonce:string | null, channelSecret:string) {
    const requestBodyString = JSON.stringify(requestBody);
    const dataToSign = requestBodyString + nonce;
    const hmac = crypto.createHmac('sha256', channelSecret);
    hmac.update(dataToSign);
    const signature = hmac.digest('hex');
    return signature; 
}

export function timestamp() {
    const timestamp = Date.now();
    return timestamp;
}

export function generateOrder() {
    const now = Date.now().toString();
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    return `${now.slice(-6)}${random}`;
}

export function createString(length:number) {
    return 'A'.repeat(length);
}

export function createNumber(length:number) {
    return Number('1'.repeat(length));
}

export async function screenshot(page: any, imageName: string) {
    const screenshotBuffer = await page.screenshot();
    const compressedImageBuffer = await sharp(screenshotBuffer)
        .jpeg({ quality: 50 })
        .toBuffer();

    test.info().attachments.push({
        name: `${imageName}`,
        body: compressedImageBuffer,
        contentType: 'image/jpeg',
    });

    await aisReport.moveImageToTestStep(imageName);
}

export async function expectStatus(response:Record<string, any>) {
    expect(200).toBe(response.status);
}

export async function delay(ms: number): Promise<void> {
    new Promise(resolve => setTimeout(resolve, ms));
}

export async function encodeLink(payment_id:string) {
    const resultSQL = await sql.cat2_PostgreSQL(`SELECT * FROM sofmobilebanking.transaction_payment_mob WHERE payment_id = '${payment_id}'`)
    const encodedUrl = resultSQL[0].bank_redirect_url;
    const urlParams = new URLSearchParams(encodedUrl.split('?')[1]);
    const partnerDeeplinkUrl = urlParams.get('partnerDeeplinkUrl')!; 
    const decodedUrl = decodeURIComponent((partnerDeeplinkUrl));
    return decodedUrl;
}

export async function encodeUrl(input: string) {
    return encodeURIComponent(input);
}

export function sanitizedCharacter(character:string) {
    return character
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "''")
        .replace(/"/g, '\\"')
        .replace(/\$/g, '\\$')
        .replace(/`/g, '\\`');
}

export function convertBooleanToTF(value: true | false) {
    return value === true ? "t" : value === false ? "f" : null;
}