import { test, expect } from '@playwright/test';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

const PRODUCT_URL = 'https://group.gtholidays.in/product/europe-summer-group-departure-chennai/';

// ─────────────────────────────────────────
// Form 7 — Group Individual Inline form
// ─────────────────────────────────────────
test('Group Individual - Inline Enquiry form fills correctly @individual_inline', async () => {

    // Stealth browser launch (Follows group.spec.ts pattern)
    const browser = await chromium.launch({ headless: process.env.CI ? true : false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(PRODUCT_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 120000
    });

    const inlineForm = page.locator('form#wpforms-form-687').first();
    await inlineForm.scrollIntoViewIfNeeded();

    // Fill fields
    await inlineForm.locator('#wpforms-687-field_1').fill('Test');
    await inlineForm.locator('#wpforms-687-field_2').fill('Test');
    await inlineForm.locator('#wpforms-687-field_12').fill('test@wizi.digital');
    await inlineForm.locator('#wpforms-687-field_4-container input[type="tel"]').fill('9876543210');
    await inlineForm.locator('#wpforms-687-field_5').fill('Test');

    // Date — readonly fix via evaluate
    await inlineForm.locator('#wpforms-687-field_6').evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '25/09/2026';
    });

    await inlineForm.locator('#wpforms-687-field_7').fill('2');
    await inlineForm.locator('#wpforms-687-field_8').selectOption({ index: 2 });

    // Verify all filled fields
    await expect(inlineForm.locator('#wpforms-687-field_1')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-687-field_2')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-687-field_12')).toHaveValue('test@wizi.digital');
    await expect(inlineForm.locator('#wpforms-687-field_4-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(inlineForm.locator('#wpforms-687-field_6')).toHaveValue('25/09/2026');
    await expect(inlineForm.locator('#wpforms-687-field_7')).toHaveValue('2');

    // Solve Math Captcha (data-n1 / data-n2 style)
    const captchaInput = inlineForm.locator('#wpforms-687-field_13');
    if (await captchaInput.isVisible()) {
        const n1 = parseInt(await captchaInput.getAttribute('data-n1') || '0');
        const n2 = parseInt(await captchaInput.getAttribute('data-n2') || '0');
        await captchaInput.fill((n1 + n2).toString());
        console.log(`Solved Inline Captcha: ${n1} + ${n2} = ${n1 + n2}`);
    }

    await expect(inlineForm.locator('.wpforms-submit')).toBeVisible();

    console.log(' Form 12a — Group Individual Inline done. Submit NOT clicked!');
    await page.waitForTimeout(30000);
    await browser.close();
});

// ─────────────────────────────────────────
// FORM 12b — Group Individual Popup form
// ─────────────────────────────────────────
test('Group Individual - Popup Enquiry form fills correctly @individual_popup', async () => {

    const browser = await chromium.launch({ headless: process.env.CI ? true : false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(PRODUCT_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 120000
    });

    // Trigger Popup
    await page.click('button#enquire.gt_group_enquire_btn');
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();

    // Fill fields
    await modal.locator('#wpforms-687-field_1').fill('Test');
    await modal.locator('#wpforms-687-field_2').fill('Test');
    await modal.locator('#wpforms-687-field_12').fill('test@wizi.digital');
    await modal.locator('#wpforms-687-field_4-container input[type="tel"]').fill('9876543210');
    await modal.locator('#wpforms-687-field_9-container input[type="tel"]').fill('9876543210'); // WhatsApp field
    await modal.locator('#wpforms-687-field_5').fill('Test');

    // Date — readonly fix
    await modal.locator('#wpforms-687-field_6').evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '25/09/2026';
    });

    await modal.locator('#wpforms-687-field_7').fill('2');
    await modal.locator('#wpforms-687-field_8').selectOption({ index: 2 });

    // Verify
    await expect(modal.locator('#wpforms-687-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-687-field_12')).toHaveValue('test@wizi.digital');
    await expect(modal.locator('#wpforms-687-field_4-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-687-field_9-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-687-field_6')).toHaveValue('25/09/2026');

    // Solve Math Captcha (data-n1 / data-n2 style)
    const captchaInput = modal.locator('#wpforms-687-field_13');
    if (await captchaInput.isVisible()) {
        const n1 = parseInt(await captchaInput.getAttribute('data-n1') || '0');
        const n2 = parseInt(await captchaInput.getAttribute('data-n2') || '0');
        await captchaInput.fill((n1 + n2).toString());
        console.log(`Solved Popup Captcha: ${n1} + ${n2} = ${n1 + n2}`);
    }

    await expect(modal.locator('.wpforms-submit')).toBeVisible();

    console.log(' Form 12b — Group Individual Popup done. Submit NOT clicked!');
    await page.waitForTimeout(30000);
    await browser.close();
});
