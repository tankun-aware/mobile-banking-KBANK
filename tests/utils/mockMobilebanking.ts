import { data, aisReport, common } from "../fixtures/import";
import path from 'path';
import { encodeLink } from "./common";
import { expect } from "@playwright/test";

export async function openMockPage(page:any, { txid, mid, amt },button:string, redirectExpect:string) {
    const testStep = async () => {
        const encodelink = await common.encodeLink(txid);
        const addData = `${data.mock_mobile}?TXID=${txid}&MID=${mid}&AMT=${amt}`;
        const url = path.join(__dirname, addData);
        
        await page.goto(url);
        await page.waitForSelector('text="Mobile Banking Simulator"', { state: 'visible', timeout: 5000 });
        await aisReport.addContext('URL - Mock Mobile Banking', url);
        await common.screenshot(page, 'Mock Mobile Banking')
        await page.click(button);
        await page.waitForSelector('text="Enter Details"', { state: 'visible', timeout: 5000 });
        await page.fill("#redirectUrl", encodelink);
        await page.waitForTimeout(200);
        await common.screenshot(page, 'Webhook Body');
        await page.click("#submitButton");
        await page.waitForURL(/https:\/\/postman-echo\.com/, {timeout:10000});
        const currentUrl = page.url();
        await aisReport.addContext('URL Redirect', currentUrl);
        await common.screenshot(page, 'Redirect Page');
        expect(currentUrl).toBe(redirectExpect);
    };
    await aisReport.addTestStep('Open link Mock Mobile Banking', testStep);
}