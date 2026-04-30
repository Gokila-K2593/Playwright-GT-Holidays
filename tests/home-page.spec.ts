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