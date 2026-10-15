import { test, expect, Locator } from '@playwright/test';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

const ZURICH_URL = 'https://www.gtholidays.in/package/zurich-tour-package/';
const MAHABALESHWAR_URL = 'https://www.gtholidays.in/packages/india/west-india/mahabaleshwar-tour-packages/';
const WEST_INDIA_URL = 'https://www.gtholidays.in/packages/india/west-india/';
const KERALA_URL = 'https://www.gtholidays.in/packages/india/south-india/kerala-tour-packages/';

/**
 * Solves the math captcha found in the given scope (modal or inline form)
 */
async function solveMathCaptcha(scope: Locator): Promise<string> {
    const captchaText = await scope.locator('.wpforms-captcha-math').innerText();
    const parts = captchaText.replace('=', '').trim().split(' ');
    const num1 = parseInt(parts[0]);
    const operator = parts[1];
    const num2 = parseInt(parts[2]);

    let answer = 0;
    if (operator === '+') answer = num1 + num2;
    else if (operator === '-') answer = num1 - num2;
    else if (operator === '×' || operator === '*') answer = num1 * num2;

    return answer.toString();
}

async function naturalType(page: any, locator: any, text: string) {
    await locator.click();
    for (const char of text) {
        await page.keyboard.type(char, { delay: 30 + Math.random() * 50 });
    }
}

async function runSimulationFast(page: any) {
    for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(500);
    }
    await page.mouse.move(500, 500, { steps: 10 });
    await page.waitForTimeout(1000);
}

async function waitForTokenFast(page: any) {
    try {
        await page.waitForFunction(() => {
            const fields = document.querySelectorAll('input[name*="g-recaptcha-response"], textarea[name*="g-recaptcha-response"]');
            for (const f of fields) {
                if ((f as HTMLInputElement).value.length > 20) return true;
            }
            return false;
        }, { timeout: 20000 });
    } catch (e) {
        // Token wait completed or fallback
    }
}

// ─────────────────────────────────────────
// 1. Zurich Tour Package (@zurich_package)
// ─────────────────────────────────────────
test('Zurich Package - Enquiry form fills correctly @zurich_package', async () => {
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

    await page.goto(ZURICH_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.locator('#enquire, button#enquire.gt_enquire_btn, a[href*="enquire"]').first().click();
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();

    await naturalType(page, modal.locator('#wpforms-28929-field_1'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_2'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_3'), 'test@wizi.digital');
    await naturalType(page, modal.locator('#wpforms-28929-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_16-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_6'), 'Test');

    await modal.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '25/09/2026';
    });

    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });

    const answer = await solveMathCaptcha(modal);
    await modal.locator('#wpforms-28929-field_20').fill(answer);

    await expect(modal.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(modal.locator('#wpforms-28929-field_4-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-28929-field_7')).toHaveValue('25/09/2026');
    await expect(modal.locator('#wpforms-28929-field_20')).toHaveValue(answer);

    await runSimulationFast(page);
    await waitForTokenFast(page);

    await modal.locator('#wpforms-submit-28929').click({ force: true });
    await expect(page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full').first()).toBeVisible({ timeout: 40000 });

    console.log('Zurich Package form submitted & verified!');
    await browser.close();
});

// ─────────────────────────────────────────
// 2. Mahabaleshwar Tour Package (@mahabaleshwar_package)
// ─────────────────────────────────────────
test('Mahabaleshwar Package - Enquiry form fills correctly @mahabaleshwar_package', async () => {
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

    await page.goto(MAHABALESHWAR_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.locator('#enquire, button#enquire.gt_enquire_btn, a[href*="enquire"]').first().click();
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();

    await naturalType(page, modal.locator('#wpforms-28929-field_1'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_2'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_3'), 'test@wizi.digital');
    await naturalType(page, modal.locator('#wpforms-28929-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_16-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_6'), 'Test');

    await modal.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '25/09/2026';
    });

    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });

    const answer = await solveMathCaptcha(modal);
    await modal.locator('#wpforms-28929-field_20').fill(answer);

    await expect(modal.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(modal.locator('#wpforms-28929-field_4-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-28929-field_7')).toHaveValue('25/09/2026');
    await expect(modal.locator('#wpforms-28929-field_20')).toHaveValue(answer);

    await runSimulationFast(page);
    await waitForTokenFast(page);

    await modal.locator('#wpforms-submit-28929').click({ force: true });
    await expect(page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full').first()).toBeVisible({ timeout: 40000 });

    console.log('Mahabaleshwar Package form submitted & verified!');
    await browser.close();
});

// ─────────────────────────────────────────
// 3. West India Packages (@west_india_package)
// ─────────────────────────────────────────
test('West India Package - Enquiry form fills correctly @west_india_package', async () => {
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

    await page.goto(WEST_INDIA_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.locator('#enquire, button#enquire.gt_enquire_btn, a[href*="enquire"]').first().click();
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();

    await naturalType(page, modal.locator('#wpforms-28929-field_1'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_2'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_3'), 'test@wizi.digital');
    await naturalType(page, modal.locator('#wpforms-28929-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_16-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_6'), 'Test');

    await modal.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '25/09/2026';
    });

    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });

    const answer = await solveMathCaptcha(modal);
    await modal.locator('#wpforms-28929-field_20').fill(answer);

    await expect(modal.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(modal.locator('#wpforms-28929-field_4-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-28929-field_7')).toHaveValue('25/09/2026');
    await expect(modal.locator('#wpforms-28929-field_20')).toHaveValue(answer);

    await runSimulationFast(page);
    await waitForTokenFast(page);

    await modal.locator('#wpforms-submit-28929').click({ force: true });
    await expect(page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full').first()).toBeVisible({ timeout: 40000 });

    console.log('West India Package form submitted & verified!');
    await browser.close();
});

// ─────────────────────────────────────────
// 4. Kerala Tour Package (@kerala_package)
// ─────────────────────────────────────────
test('Kerala Package - Enquiry form fills correctly @kerala_package', async () => {
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

    await page.goto(KERALA_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.locator('#enquire, button#enquire.gt_enquire_btn, a[href*="enquire"]').first().click();
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();

    await naturalType(page, modal.locator('#wpforms-28929-field_1'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_2'), 'Test');
    await naturalType(page, modal.locator('#wpforms-28929-field_3'), 'test@wizi.digital');
    await naturalType(page, modal.locator('#wpforms-28929-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_16-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-28929-field_6'), 'Test');

    await modal.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '25/09/2026';
    });

    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });

    const answer = await solveMathCaptcha(modal);
    await modal.locator('#wpforms-28929-field_20').fill(answer);

    await expect(modal.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(modal.locator('#wpforms-28929-field_4-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-28929-field_7')).toHaveValue('25/09/2026');
    await expect(modal.locator('#wpforms-28929-field_20')).toHaveValue(answer);

    await runSimulationFast(page);
    await waitForTokenFast(page);

    await modal.locator('#wpforms-submit-28929').click({ force: true });
    await expect(page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full').first()).toBeVisible({ timeout: 40000 });

    console.log('Kerala Package form submitted & verified!');
    await browser.close();
});
