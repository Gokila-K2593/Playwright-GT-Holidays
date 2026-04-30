import { test, expect } from '@playwright/test';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

const GROUP_URL = 'https://group.gtholidays.in';

// ─────────────────────────────────────────
// FORM 3 — Group Tours Popup form
// ─────────────────────────────────────────
test('Group Tours - Popup Enquiry form fills correctly @form3', async () => {

    // Stealth browser launch
    const browser = await chromium.launch({ headless: process.env.CI ? true : false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(GROUP_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 120000
    });
    await page.waitForTimeout(3000);

    await page.locator('#enquire').click();

    await expect(
        page.locator('#Modalpopup').getByText('Enquire Now')
    ).toBeVisible({ timeout: 10000 });

    const modal = page.locator('#Modalpopup');

    await modal.locator('#wpforms-687-field_1').fill('Test');
    await modal.locator('#wpforms-687-field_2').fill('Test');
    await modal.locator('#wpforms-687-field_12').fill('test@wizi.digital');
    await modal.locator('#wpforms-687-field_4-container input[type="tel"]').fill('9876543210');
    await modal.locator('#wpforms-687-field_9-container input[type="tel"]').fill('9876543210', { force: true });
    await modal.locator('#wpforms-687-field_5').fill('Test');

    await modal.locator('#wpforms-687-field_6').evaluate(
        (el: HTMLInputElement) => {
            el.removeAttribute('readonly');
            el.value = '25/09/2026';
        }
    );

    await modal.locator('#wpforms-687-field_7').fill('2');
    await modal.locator('#wpforms-687-field_8').selectOption({ index: 4 });

    // Verify all fields
    await expect(modal.locator('#wpforms-687-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-687-field_2')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-687-field_12')).toHaveValue('test@wizi.digital');
    await expect(
        modal.locator('#wpforms-687-field_4-container input[type="tel"]')
    ).toHaveValue(/98765\s*43210/);
    await expect(modal.locator('#wpforms-687-field_5')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-687-field_6')).toHaveValue('25/09/2026');
    await expect(modal.locator('#wpforms-687-field_7')).toHaveValue('2');

    // Solve Math Captcha
    const captchaInput = modal.locator('#wpforms-687-field_13');
    if (await captchaInput.isVisible()) {
        const n1 = parseInt(await captchaInput.getAttribute('data-n1') || '0');
        const n2 = parseInt(await captchaInput.getAttribute('data-n2') || '0');
        await captchaInput.fill((n1 + n2).toString());
        console.log(`Solved Captcha: ${n1} + ${n2} = ${n1 + n2}`);
    }

    await expect(modal.locator('.wpforms-submit')).toBeVisible();

    console.log(' Form 3 — Group Popup done. Submit NOT clicked!');
    await page.waitForTimeout(30000);

    await browser.close();
});

// ─────────────────────────────────────────
// FORM 4 — Group Tours Inline form
// ─────────────────────────────────────────
test('Group Tours - Inline Enquiry form fills correctly @form4', async () => {

    const browser = await chromium.launch({ headless: process.env.CI ? true : false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(GROUP_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 120000
    });
    await page.waitForTimeout(3000);

    await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(3000);

    const inlineForm = page.locator('#post-20 form#wpforms-form-687');
    await expect(inlineForm).toBeVisible({ timeout: 15000 });

    await inlineForm.locator('#wpforms-687-field_1').fill('Test');
    await inlineForm.locator('#wpforms-687-field_2').fill('Test');
    await inlineForm.locator('#wpforms-687-field_12').fill('test@wizi.digital');
    await inlineForm.locator('#wpforms-687-field_4-container input[type="tel"]').fill('9876543210');
    await inlineForm.locator('#wpforms-687-field_5').fill('Test');

    await inlineForm.locator('#wpforms-687-field_6').evaluate(
        (el: HTMLInputElement) => {
            el.removeAttribute('readonly');
            el.value = '25/09/2026';
        }
    );

    await inlineForm.locator('#wpforms-687-field_7').fill('2');
    await inlineForm.locator('#wpforms-687-field_8').selectOption({ index: 2 });

    // Verify all fields
    await expect(inlineForm.locator('#wpforms-687-field_1')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-687-field_2')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-687-field_12')).toHaveValue('test@wizi.digital');
    await expect(
        inlineForm.locator('#wpforms-687-field_4-container input[type="tel"]')
    ).toHaveValue(/98765\s*43210/);
    await expect(inlineForm.locator('#wpforms-687-field_5')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-687-field_6')).toHaveValue('25/09/2026');
    await expect(inlineForm.locator('#wpforms-687-field_7')).toHaveValue('2');

    // Solve Math Captcha
    const captchaInputInline = inlineForm.locator('#wpforms-687-field_13');
    if (await captchaInputInline.isVisible()) {
        const n1 = parseInt(await captchaInputInline.getAttribute('data-n1') || '0');
        const n2 = parseInt(await captchaInputInline.getAttribute('data-n2') || '0');
        await captchaInputInline.fill((n1 + n2).toString());
        console.log(`Solved Inline Captcha: ${n1} + ${n2} = ${n1 + n2}`);
    }

    await expect(inlineForm.locator('.wpforms-submit')).toBeVisible();

    console.log(' Form 4 — Group Inline done. Submit NOT clicked!');
    await page.waitForTimeout(30000);
    await browser.close();
});