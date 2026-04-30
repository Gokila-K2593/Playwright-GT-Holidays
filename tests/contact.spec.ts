import { test, expect, Locator } from '@playwright/test';

const CHENNAI_URL = 'https://www.gtholidays.in/chennai/';

/**
 * Solves the math captcha found in the given scope (modal or inline form)
 * Based on gtholidays-home.spec.ts pattern
 */
async function solveMathCaptcha(scope: Locator): Promise<string> {
    const captchaText = await scope.locator('.wpforms-captcha-math').innerText();
    // Example: "12 + 5 ="
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

// ─────────────────────────────────────────
// Chennai Without Popup (Inline form)
// ─────────────────────────────────────────
test('Chennai - Inline Enquiry form fills correctly @chennai_inline', async ({ page }) => {
    
    await page.goto(CHENNAI_URL);
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
    const answer = await solveMathCaptcha(inlineForm);
    await inlineForm.locator('#wpforms-28929-field_20').fill(answer);

    // Verify all filled fields
    await expect(inlineForm.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(inlineForm.locator('#wpforms-28929-field_4-container input[type="tel"]')).toHaveValue(/98765\s*43210/);
    await expect(inlineForm.locator('#wpforms-28929-field_7')).toHaveValue('25/09/2026');
    await expect(inlineForm.locator('#wpforms-28929-field_20')).toHaveValue(answer);

    // Submit visible check
    await expect(inlineForm.locator('.wpforms-submit')).toBeVisible();

    console.log('Chennai Inline done. Submit NOT clicked!');
    await page.waitForTimeout(30000);
});

// ─────────────────────────────────────────
// Chennai With Popup
// ─────────────────────────────────────────
test('Chennai - Popup Enquiry form fills correctly @chennai_popup', async ({ page }) => {
    
    await page.goto(CHENNAI_URL);
    await page.waitForLoadState('networkidle');

    // Trigger Popup
    await page.click('button#enquire.gt_enquire_btn');
    const modal = page.locator('#Modalpopup');
    await expect(modal).toBeVisible();

    // Fill fields inside #Modalpopup
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

    // Solve Math captcha
    const answer = await solveMathCaptcha(modal);
    await modal.locator('#wpforms-28929-field_20').fill(answer);

    // Verify all filled fields
    await expect(modal.locator('#wpforms-28929-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-28929-field_3')).toHaveValue('test@wizi.digital');
    await expect(modal.locator('#wpforms-28929-field_4-container input[type="tel"]')).toHaveValue(/98765\s*43210/);
    await expect(modal.locator('#wpforms-28929-field_7')).toHaveValue('25/09/2026');
    await expect(modal.locator('#wpforms-28929-field_20')).toHaveValue(answer);

    // Submit visible check
    await expect(modal.locator('.wpforms-submit')).toBeVisible();

    console.log('Chennai Popup done. Submit NOT clicked!');
    await page.waitForTimeout(30000);
});
