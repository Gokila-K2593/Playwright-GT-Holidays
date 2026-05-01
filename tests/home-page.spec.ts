import { test, expect } from '@playwright/test';

const HOME_URL = 'https://gtholidays.in';

// Helper function — Math captcha solve
async function solveMathCaptcha(modal: any) {
    const captchaText = await modal.locator(
        '.wpforms-captcha-math'
    ).innerText();

    console.log('Captcha question:', captchaText);

    const numbers = captchaText.match(/\d+/g);
    const num1 = parseInt(numbers![0]);
    const num2 = parseInt(numbers![1]);

    let answer = 0;
    if (captchaText.includes('+')) answer = num1 + num2;
    else if (captchaText.includes('-')) answer = num1 - num2;
    else if (captchaText.includes('×') || captchaText.includes('*')) answer = num1 * num2;

    console.log('Answer:', answer);
    return answer.toString();
}

// ─────────────────────────────────────────
// FORM 1 — Home page Popup form
// ─────────────────────────────────────────
test('Home Page - Popup Enquiry form fills correctly @home_popup', async ({ page }) => {
    await page.goto(HOME_URL);
    await page.waitForLoadState('networkidle');

    // Click Enquire Now button
    await page.locator('#enquire').click();

    // Popup modal open aachaanu check
    await expect(
        page.locator('#Modalpopup').getByText('Enquire Now')
    ).toBeVisible({ timeout: 10000 });

    const modal = page.locator('#Modalpopup');

    // Fill all fields
    await modal.locator('#wpforms-28929-field_1').fill('Test');
    await modal.locator('#wpforms-28929-field_2').fill('Test');
    await modal.locator('#wpforms-28929-field_3').fill('test@wizi.digital');
    await modal.locator('#wpforms-28929-field_4-container input[type="tel"]').fill('9876543210');
    await modal.locator('#wpforms-28929-field_16-container input[type="tel"]').fill('9876543210');
    await modal.locator('#wpforms-28929-field_6').fill('Test');

    // Date — readonly fix
    await modal.locator('#wpforms-28929-field_7').evaluate(
        (el: HTMLInputElement) => {
            el.removeAttribute('readonly');
            el.value = '25/09/2026';
        }
    );

    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });

    // Math captcha solve
    const answer = await solveMathCaptcha(modal);
    await modal.locator('#wpforms-28929-field_20').fill(answer);

    // Verify fields
    await expect(modal.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(modal.locator('#wpforms-28929-field_20')).toHaveValue(answer);

    // Submit visible — CLICK PANNATHA!
    await expect(modal.locator('.wpforms-submit')).toBeVisible();

    console.log(' Form 1 — Home Popup done. Submit NOT clicked!');

    await page.waitForTimeout(30000);
});

// ─────────────────────────────────────────
// FORM 2 — Home page Inline form (scroll down)
// ─────────────────────────────────────────
test('Home Page - Inline Enquiry form fills correctly @home_inline', async ({ page }) => {
    await page.goto(HOME_URL);
    await page.waitForLoadState('networkidle');

    // Scroll to bottom where inline form is
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // Use #homebooking as scope — inline form specific container
    const inlineForm = page.locator('#homebooking');

    // Fill all fields
    await inlineForm.locator('#wpforms-28929-field_1').fill('Test');
    await inlineForm.locator('#wpforms-28929-field_2').fill('Test');
    await inlineForm.locator('#wpforms-28929-field_3').fill('test@wizi.digital');
    await inlineForm.locator('#wpforms-28929-field_4-container input[type="tel"]').fill('9876543210');
    await inlineForm.locator('#wpforms-28929-field_16-container input[type="tel"]').fill('9876543210');
    await inlineForm.locator('#wpforms-28929-field_6').fill('Test');

    // Date — readonly fix
    await inlineForm.locator('#wpforms-28929-field_7').evaluate(
        (el: HTMLInputElement) => {
            el.removeAttribute('readonly');
            el.value = '25/09/2026';
        }
    );

    await inlineForm.locator('#wpforms-28929-field_8').fill('2');
    await inlineForm.locator('#wpforms-28929-field_9').selectOption({ index: 2 });

    // Math captcha solve
    const captchaText = await inlineForm.locator('.wpforms-captcha-math').innerText();
    const numbers = captchaText.match(/\d+/g);
    const num1 = parseInt(numbers![0]);
    const num2 = parseInt(numbers![1]);
    let answer = 0;
    if (captchaText.includes('+')) answer = num1 + num2;
    else if (captchaText.includes('-')) answer = num1 - num2;
    else if (captchaText.includes('×') || captchaText.includes('*')) answer = num1 * num2;

    await inlineForm.locator('#wpforms-28929-field_20').fill(answer.toString());

    // Verify
    await expect(inlineForm.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(inlineForm.locator('#wpforms-28929-field_20')).toHaveValue(answer.toString());

    // Submit visible — CLICK PANNATHA!
    await expect(inlineForm.locator('.wpforms-submit')).toBeVisible();

    console.log(' Form 2 — Home Inline done. Submit NOT clicked!');

    await page.waitForTimeout(30000);
});

// ─────────────────────────────────────────
// FORM 9 — Packages Page Popup form
// ─────────────────────────────────────────
test('Packages Page - Popup Enquiry form fills correctly @packages_popup', async ({ page }) => {
    await page.goto('https://www.gtholidays.in/packages/');
    await page.waitForLoadState('networkidle');

    // Trigger Popup
    await page.locator('button#enquire.gt_enquire_btn').click();

    // Wait for #Modalpopup to be visible
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // Fill fields - Scope: #Modalpopup, Form ID: wpforms-28929
    await modal.locator('#wpforms-28929-field_1').fill('Test');
    await modal.locator('#wpforms-28929-field_2').fill('Test');
    await modal.locator('#wpforms-28929-field_3').fill('test@wizi.digital');
    await modal.locator('#wpforms-28929-field_4-container input[type="tel"]').fill('9876543210');
    await modal.locator('#wpforms-28929-field_16-container input[type="tel"]').fill('9876543210');
    await modal.locator('#wpforms-28929-field_6').fill('Test');

    // Date — readonly fix
    await modal.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '25/09/2026';
    });

    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });

    // Math captcha solve
    const answer = await solveMathCaptcha(modal);
    await modal.locator('#wpforms-28929-field_20').fill(answer);

    // Verify all filled fields
    await expect(modal.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_2')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(modal.locator('#wpforms-28929-field_4-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-28929-field_16-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-28929-field_6')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_7')).toHaveValue('25/09/2026');
    await expect(modal.locator('#wpforms-28929-field_20')).toHaveValue(answer);

    // DO NOT click submit
    await expect(modal.locator('.wpforms-submit')).toBeVisible();

    console.log('Packages Popup done. Submit NOT clicked!');
    await page.waitForTimeout(30000);
});

// ─────────────────────────────────────────
// FORM 10 — North India Inline form
// ─────────────────────────────────────────
test('North India - Inline Enquiry form fills correctly @north_india_inline', async ({ page }) => {
    await page.goto('https://www.gtholidays.in/packages/india/north-india/');
    await page.waitForLoadState('networkidle');

    // Find the inline form (NOT inside #Modalpopup)
    const inlineForm = page.locator('form#wpforms-form-28929').filter({ hasNot: page.locator('#Modalpopup') }).first();
    await inlineForm.scrollIntoViewIfNeeded();

    // Fill fields
    await inlineForm.locator('#wpforms-28929-field_1').fill('Test');
    await inlineForm.locator('#wpforms-28929-field_2').fill('Test');
    await inlineForm.locator('#wpforms-28929-field_3').fill('test@wizi.digital');
    await inlineForm.locator('#wpforms-28929-field_4-container input[type="tel"]').fill('9876543210');
    await inlineForm.locator('#wpforms-28929-field_16-container input[type="tel"]').fill('9876543210');
    await inlineForm.locator('#wpforms-28929-field_6').fill('Test');

    // Date — readonly fix
    await inlineForm.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '25/09/2026';
    });

    await inlineForm.locator('#wpforms-28929-field_8').fill('2');
    await inlineForm.locator('#wpforms-28929-field_9').selectOption({ index: 2 });

    // Solve Math captcha
    const captchaText = await inlineForm.locator('.wpforms-captcha-math').innerText();
    const numbers = captchaText.match(/\d+/g);
    const num1 = parseInt(numbers![0]);
    const num2 = parseInt(numbers![1]);
    let answer = 0;
    if (captchaText.includes('+')) answer = num1 + num2;
    else if (captchaText.includes('-')) answer = num1 - num2;
    else if (captchaText.includes('×') || captchaText.includes('*')) answer = num1 * num2;

    await inlineForm.locator('#wpforms-28929-field_20').fill(answer.toString());

    // Verify all filled fields
    await expect(inlineForm.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-28929-field_2')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(inlineForm.locator('#wpforms-28929-field_4-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(inlineForm.locator('#wpforms-28929-field_16-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(inlineForm.locator('#wpforms-28929-field_6')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-28929-field_7')).toHaveValue('25/09/2026');
    await expect(inlineForm.locator('#wpforms-28929-field_20')).toHaveValue(answer.toString());

    // Submit visible check
    await expect(inlineForm.locator('.wpforms-submit')).toBeVisible();

    console.log('North India Inline done. Submit NOT clicked!');
    await page.waitForTimeout(30000);
});

// ─────────────────────────────────────────
// FORM 11 — East India Popup form
// ─────────────────────────────────────────
test('East India - Popup Enquiry form fills correctly @east_india_popup', async ({ page }) => {
    await page.goto('https://www.gtholidays.in/packages/india/east-india/');
    await page.waitForLoadState('networkidle');

    // Trigger Popup
    await page.locator('button#enquire.gt_enquire_btn').click();
    
    // Wait for #Modalpopup to be visible
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // Fill fields - Scope: #Modalpopup, Form ID: wpforms-28929
    await modal.locator('#wpforms-28929-field_1').fill('Test');
    await modal.locator('#wpforms-28929-field_2').fill('Test');
    await modal.locator('#wpforms-28929-field_3').fill('test@wizi.digital');
    await modal.locator('#wpforms-28929-field_4-container input[type="tel"]').fill('9876543210');
    await modal.locator('#wpforms-28929-field_16-container input[type="tel"]').fill('9876543210');
    await modal.locator('#wpforms-28929-field_6').fill('Test');

    // Date — readonly fix
    await modal.locator('#wpforms-28929-field_7').evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '25/09/2026';
    });

    await modal.locator('#wpforms-28929-field_8').fill('2');
    await modal.locator('#wpforms-28929-field_9').selectOption({ index: 2 });

    // Math captcha solve
    const answer = await solveMathCaptcha(modal);
    await modal.locator('#wpforms-28929-field_20').fill(answer);

    // Verify all filled fields
    await expect(modal.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_2')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(modal.locator('#wpforms-28929-field_4-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-28929-field_16-container input[type="tel"]')).toHaveValue(/.*9.*8.*7.*6.*5.*4.*3.*2.*1.*0.*/);
    await expect(modal.locator('#wpforms-28929-field_6')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_7')).toHaveValue('25/09/2026');
    await expect(modal.locator('#wpforms-28929-field_20')).toHaveValue(answer);

    // DO NOT click submit
    await expect(modal.locator('.wpforms-submit')).toBeVisible();

    console.log('East India Popup done. Submit NOT clicked!');
    await page.waitForTimeout(30000);
});
