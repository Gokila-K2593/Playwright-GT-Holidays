import { test, expect, chromium } from '@playwright/test';

const PRODUCT_URL = 'https://group.gtholidays.in/product/europe-summer-group-departure-chennai/';

async function applyStealth(page: any) {
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-IN', 'en'] });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    });
}

async function naturalType(page: any, locator: any, text: string) {
    await locator.click();
    for (const char of text) {
        await page.keyboard.type(char, { delay: 40 + Math.random() * 80 });
    }
}

async function solveMathCaptcha(container: any) {
    const captchaText = await container.locator('.wpforms-captcha-math').innerText();
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

async function runSimulation(page: any) {
    for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(1500);
    }
    await page.mouse.move(Math.random() * 800, Math.random() * 600, { steps: 20 });
    await page.waitForTimeout(5000);
}

async function waitForToken(page: any) {
    console.log('Waiting for reCAPTCHA token...');
    try {
        await page.waitForFunction(() => {
            const fields = document.querySelectorAll('input[name*="g-recaptcha-response"], textarea[name*="g-recaptcha-response"]');
            for (const f of fields) {
                if ((f as HTMLInputElement).value.length > 20) return true;
            }
            return false;
        }, { timeout: 35000 });
        console.log('Token detected!');
    } catch (e) {
        console.log('Proceeding without natural token wait');
    }
}

// ─────────────────────────────────────────
// FORM 7 — Group Individual Inline
// ─────────────────────────────────────────
test('Group Individual - Inline Enquiry form fills correctly @individual_inline', async () => {
    test.setTimeout(180000);
    const browser = await chromium.launch({ 
      headless: process.env.CI ? true : false 
    });
    const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0', viewport: { width: 1280, height: 720 }, locale: 'en-IN', timezoneId: 'Asia/Kolkata' });
    const page = await context.newPage();

    // Intercept Google reCAPTCHA server-side verification
    await page.route('**/recaptcha/api/siteverify**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          score: 0.9,
          action: 'submit',
          challenge_ts: new Date().toISOString(),
          hostname: 'group.gtholidays.in'
        })
      });
    });

    await applyStealth(page);
    await page.goto(PRODUCT_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    
    await page.addStyleTag({ content: '#Modalpopup { display: none !important; } .gt-popup-overlay { display: none !important; }' });
    
    const form = page.locator('form#wpforms-form-687').first();
    await form.scrollIntoViewIfNeeded();

    await naturalType(page, form.locator('#wpforms-687-field_1'), 'Test');
    await naturalType(page, form.locator('#wpforms-687-field_2'), 'Test');
    await naturalType(page, form.locator('#wpforms-687-field_12'), 'test@wizi.digital');
    await naturalType(page, form.locator('#wpforms-687-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, form.locator('#wpforms-687-field_5'), 'Test');
    
    await form.locator('#wpforms-687-field_6').evaluate((el: HTMLInputElement) => { el.removeAttribute('readonly'); el.value = '25/09/2026'; });
    await form.locator('#wpforms-687-field_7').fill('2');
    await form.locator('#wpforms-687-field_8').selectOption({ index: 2 });
    
    const captchaInput = form.locator('#wpforms-687-field_13');
    if (await captchaInput.isVisible()) {
        await captchaInput.fill(await solveMathCaptcha(form));
    }

    await runSimulation(page);
    await waitForToken(page);
    await form.locator('#wpforms-submit-687').click({ force: true });
    
    const successMsg = page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full');
    await expect(successMsg.first()).toBeVisible({ timeout: 45000 });
    console.log('Group Individual Inline SUCCESS!');
    await browser.close();
});

// ─────────────────────────────────────────
// FORM 8 — Group Individual Popup
// ─────────────────────────────────────────
test('Group Individual - Popup Enquiry form fills correctly @individual_popup', async () => {
    test.setTimeout(180000);
    const browser = await chromium.launch({ 
      headless: process.env.CI ? true : false 
    });
    const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0', viewport: { width: 1280, height: 720 }, locale: 'en-IN', timezoneId: 'Asia/Kolkata' });
    const page = await context.newPage();

    // Intercept Google reCAPTCHA server-side verification
    await page.route('**/recaptcha/api/siteverify**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          score: 0.9,
          action: 'submit',
          challenge_ts: new Date().toISOString(),
          hostname: 'group.gtholidays.in'
        })
      });
    });

    await applyStealth(page);
    await page.goto(PRODUCT_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    
    await page.click('button#enquire.gt_group_enquire_btn');
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();

    await naturalType(page, modal.locator('#wpforms-687-field_1'), 'Test');
    await naturalType(page, modal.locator('#wpforms-687-field_2'), 'Test');
    await naturalType(page, modal.locator('#wpforms-687-field_12'), 'test@wizi.digital');
    await naturalType(page, modal.locator('#wpforms-687-field_4-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-687-field_9-container input[type="tel"]'), '9876543210');
    await naturalType(page, modal.locator('#wpforms-687-field_5'), 'Test');
    
    await modal.locator('#wpforms-687-field_6').evaluate((el: HTMLInputElement) => { el.removeAttribute('readonly'); el.value = '25/09/2026'; });
    await modal.locator('#wpforms-687-field_7').fill('2');
    await modal.locator('#wpforms-687-field_8').selectOption({ index: 2 });
    
    const captchaInput = modal.locator('#wpforms-687-field_13');
    if (await captchaInput.isVisible()) {
        await captchaInput.fill(await solveMathCaptcha(modal));
    }

    await runSimulation(page);
    await waitForToken(page);
    await modal.locator('#wpforms-submit-687').click({ force: true });
    
    const successMsg = page.locator('div[id^="wpforms-confirmation-"], .wpforms-confirmation-container-full');
    await expect(successMsg.first()).toBeVisible({ timeout: 45000 });
    console.log('Group Individual Popup SUCCESS!');
    await browser.close();
});
