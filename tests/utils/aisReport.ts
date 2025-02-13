import { test } from '@playwright/test';


export async function addContext(title: any, value: any) {
    test.info().annotations.push({
        type: title,
        description: `${value}`
    });
}

export async function openTag(tagName: string) {
    test.info().annotations.push({
        type: 'opentagClass',
        description: `${tagName}`
    });
}

export async function closeTag() {
    test.info().annotations.push({
        type: 'closetagClass',
    });
}



export async function screenshot(page:any, name: string) {
    const screenshotBuffer = await page.screenshot();
    test.info().attachments.push({
        name: `${name}`,
        body: screenshotBuffer,
        contentType: 'image/png',
    });
}


export async function addTag(name:string, testStep: () => Promise<void>) {
    try {
        await openTag(name);
        await testStep();
    } catch (error) {
        throw error;
    } finally {
        await closeTag();
    }
}