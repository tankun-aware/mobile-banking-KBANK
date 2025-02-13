import { test } from '@playwright/test';


export async function addContext(title: any, value: any) {
    const sanitizedValue = typeof value === "string" 
        ? value.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;")
        : JSON.stringify(value, null, 2)

    test.info().annotations.push({
        type: title,
        description: `\n${sanitizedValue}`
    });
}

async function openTag(tagName: string) {
    test.info().annotations.push({
        type: 'opentagClass',
        description: `${tagName}`
    });
}

async function closeTag() {
    test.info().annotations.push({
        type: 'closetagClass',
    });
}


export async function addTestStep(name:string, testStep: () => Promise<void>, expectedResult:any = '') {

    try {
        await openTag(name);
        await testStep();
    } catch (error) {
        console.error('Error during test step:', error);
        throw error;
    } finally {
        test.info().annotations.push({
            type: '0!@#$%^Expected Result^%$#@!0',
            description: `${(expectedResult).toString().replace(/\(0, _test.expect\)/g, 'expect')}`
        });
        await closeTag();
    }
}

export async function moveImageToTestStep(testStepName:string) {
    await addContext('0!@#$%^ScreenshotMoveToTestStep^%$#@!0', testStepName);
}