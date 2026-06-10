import { test, expect } from '@playwright/test';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

const HOME_URL = 'https://gtholidays.in';

// Helper function — Math captcha solve
async function solveMathCaptcha(modal: any) {
    const captchaText = await modal.locator('.wpforms-captcha-math').innerText();
    const numbers = captchaText.match(/\d+/g);
    if (!numbers) return '0';
    const num1 = parseInt(numbers[0]);
    const num2 = parseInt(numbers[1]);
    let answer = 0;
    if (captchaText.includes('+')) answer = num1 + num2;
    else if (captchaText.includes('-')) answer = num1 - num2;
    else if (captchaText.includes('×') || captchaText.includes('*')) answer = num1 * num2;
    return answer.toString();
}



async function naturalType(page: any, locator: any, text: string) {
    await locator.click();
    for (const char of text) {
        await page.keyboard.type(char, { delay: 30 + Math.random() * 50 });
    }
}

async function runSimulationFast(page: any) {
    // Faster simulation for Home Page
    for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(500);
    }
    await page.mouse.move(500, 500, { steps: 10 });
    await page.waitForTimeout(1000);
}

async function waitForTokenFast(page: any) {
    console.log('Checking for token (fast mode)...');
    try {
        await page.waitForFunction(() => {
            const fields = document.querySelectorAll('input[name*="g-recaptcha-response"], textarea[name*="g-recaptcha-response"]');
            for (const f of fields) {
                if ((f as HTMLInputElement).value.length > 20) return true;
            }
            return false;
        }, { timeout: 20000 });
    } catch (e) {
        console.log('Skipping token wait for Home Page');
    }
}

// ─────────────────────────────────────────
// FORM 1 — Home Popup
// ─────────────────────────────────────────
test('Home Page - Popup Enquiry form fills correctly @home_popup', async () => {
    test.setTimeout(180000);
    const browser = await chromium.launch({ 
      headless: process.env.CI ? true : false 
    });
    const context = await browser.newContext({ 
        viewport: { width: 1280, height: 720 }, 
        locale: 'en-IN', 
        timezoneId: 'Asia/Kolkata' 
    });
    const page = await context.newPage();

    await page.goto(HOME_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.locator('#enquire').click();
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();
    await naturalType(page, modal.locator('#wpforms-28929-field_1'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_2'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_3'), 'test@wizi.digital');
    await naturalType(page, modal.locator('#wpforms-28929-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_16-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_6'), 'Test');
    await modal.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => { el.removeAttribute('readonly'); el.value = '25/09/2026'; });
    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });
    await modal.locator('#wpforms-28929-field_20').fill(await solveMathCaptcha(modal));
    await runSimulationFast(page);
    await waitForTokenFast(page);
    await modal.locator('#wpforms-submit-28929').click({ force: true });
    await expect(page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full').first()).toBeVisible({ timeout: 40000 });
    await browser.close();
});

// ─────────────────────────────────────────
// FORM 2 — Home Inline
// ─────────────────────────────────────────
test('Home Page - Inline Enquiry form fills correctly @home_inline', async () => {
    test.setTimeout(180000);
    const browser = await chromium.launch({ 
      headless: process.env.CI ? true : false 
    });
    const context = await browser.newContext({ 
        viewport: { width: 1280, height: 720 }, 
        locale: 'en-IN', 
        timezoneId: 'Asia/Kolkata' 
    });
    const page = await context.newPage();

    await page.goto(HOME_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.addStyleTag({ content: '#Modalpopup { display: none !important; } .gt-popup-overlay { display: none !important; }' });
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    const form = page.locator('#homebooking');
    await naturalType(page, form.locator('#wpforms-28929-field_1'), 'Test');
    await naturalType(page, form.locator('#wpforms-28929-field_2'), 'Test');
    await naturalType(page, form.locator('#wpforms-28929-field_3'), 'test@wizi.digital');
    await naturalType(page, form.locator('#wpforms-28929-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, form.locator('#wpforms-28929-field_16-container input[type="tel"]'), '9876543210');
    await naturalType(page, form.locator('#wpforms-28929-field_6'), 'Test');
    await form.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => { el.removeAttribute('readonly'); el.value = '25/09/2026'; });
    await form.locator('#wpforms-28929-field_8').fill('2');
    await form.locator('#wpforms-28929-field_9').selectOption({ index: 2 });
    await form.locator('#wpforms-28929-field_20').fill(await solveMathCaptcha(form));
    await runSimulationFast(page);
    await waitForTokenFast(page);
    await form.locator('#wpforms-submit-28929').click({ force: true });
    await expect(page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full').first()).toBeVisible({ timeout: 40000 });
    await browser.close();
});

// ─────────────────────────────────────────
// FORM 9 — Packages Popup
// ─────────────────────────────────────────
test('Packages Page - Popup Enquiry form fills correctly @packages_popup', async () => {
    test.setTimeout(180000);
    const browser = await chromium.launch({ 
      headless: process.env.CI ? true : false 
    });
    const context = await browser.newContext({ 
        viewport: { width: 1280, height: 720 }, 
        locale: 'en-IN', 
        timezoneId: 'Asia/Kolkata' 
    });
    const page = await context.newPage();

    await page.goto(HOME_URL + '/packages/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.locator('#enquire').first().click();
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();

    // Fill ALL mandatory fields
    await naturalType(page, modal.locator('#wpforms-28929-field_1'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_2'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_3'), 'test@wizi.digital');
    await naturalType(page, modal.locator('#wpforms-28929-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_16-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_6'), 'Test');
    await modal.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => { el.removeAttribute('readonly'); el.value = '25/09/2026'; });
    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });
    await modal.locator('#wpforms-28929-field_20').fill(await solveMathCaptcha(modal));

    await runSimulationFast(page);
    await modal.locator('#wpforms-submit-28929').click({ force: true });
    await expect(page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full').first()).toBeVisible({ timeout: 40000 });
    await browser.close();
});

// ─────────────────────────────────────────
// FORM 10 — North India Inline
// ─────────────────────────────────────────
test('North India - Inline Enquiry form fills correctly @north_india_inline', async () => {
    test.setTimeout(120000);
    const browser = await chromium.launch({ 
      headless: process.env.CI ? true : false 
    });
    const context = await browser.newContext({ 
        viewport: { width: 1280, height: 720 }, 
        locale: 'en-IN', 
        timezoneId: 'Asia/Kolkata' 
    });
    const page = await context.newPage();


    // NEW URL
    await page.goto('https://www.gtholidays.in/packages/india/north-india/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.addStyleTag({ content: '#Modalpopup { display: none !important; }' });

    const form = page.locator('#homebooking');
    await form.scrollIntoViewIfNeeded();

    // Fill ALL mandatory fields
    await naturalType(page, form.locator('#wpforms-28929-field_1'), 'Test');
    await naturalType(page, form.locator('#wpforms-28929-field_2'), 'Test');
    await naturalType(page, form.locator('#wpforms-28929-field_3'), 'test@wizi.digital');
    await naturalType(page, form.locator('#wpforms-28929-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, form.locator('#wpforms-28929-field_16-container input[type="tel"]'), '9876543210');
    await naturalType(page, form.locator('#wpforms-28929-field_6'), 'Test');
    await form.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => { el.removeAttribute('readonly'); el.value = '25/09/2026'; });
    await form.locator('#wpforms-28929-field_8').fill('2');
    await form.locator('#wpforms-28929-field_9').selectOption({ index: 2 });
    await form.locator('#wpforms-28929-field_20').fill(await solveMathCaptcha(form));

    await runSimulationFast(page);
    await form.locator('#wpforms-submit-28929').click({ force: true });
    await expect(page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full').first()).toBeVisible({ timeout: 40000 });
    await browser.close();
});

// ─────────────────────────────────────────
// FORM 11 — East India Popup
// ─────────────────────────────────────────
test('East India - Popup Enquiry form fills correctly @east_india_popup', async () => {
    test.setTimeout(120000);
    const browser = await chromium.launch({ 
      headless: process.env.CI ? true : false 
    });
    const context = await browser.newContext({ 
        viewport: { width: 1280, height: 720 }, 
        locale: 'en-IN', 
        timezoneId: 'Asia/Kolkata' 
    });
    const page = await context.newPage();

    await page.goto(HOME_URL + '/packages/india/east-india/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.locator('#enquire').first().click();
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();

    // Fill ALL mandatory fields
    await naturalType(page, modal.locator('#wpforms-28929-field_1'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_2'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_3'), 'test@wizi.digital');
    await naturalType(page, modal.locator('#wpforms-28929-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_16-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_6'), 'Test');
    await modal.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => { el.removeAttribute('readonly'); el.value = '25/09/2026'; });
    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });
    await modal.locator('#wpforms-28929-field_20').fill(await solveMathCaptcha(modal));

    await runSimulationFast(page);
    await modal.locator('#wpforms-submit-28929').click({ force: true });
    await expect(page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full').first()).toBeVisible({ timeout: 40000 });
    await browser.close();
});
