import { test, expect } from '@playwright/test';

const GROUP_URL = 'https://group.gtholidays.in';

// ─────────────────────────────────────────
// FORM 3 — Group Tours Popup form
// ─────────────────────────────────────────
test('Group Tours - Popup Enquiry form fills correctly', async ({ page }) => {

    // Fix 1: domcontentloaded — faster than networkidle
    await page.goto(GROUP_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 120000
    });
    await page.waitForTimeout(3000);

    // Click Enquire Now
    await page.locator('#enquire').click();

    // Popup open check
    await expect(
        page.locator('#Modalpopup').getByText('Enquire Now')
    ).toBeVisible({ timeout: 10000 });

    const modal = page.locator('#Modalpopup');

    // Fill all fields
    await modal.locator('#wpforms-687-field_1').fill('Test');
    await modal.locator('#wpforms-687-field_2').fill('Test');
    await modal.locator('#wpforms-687-field_12').fill('test@wizi.digital');
    await modal.locator('#wpforms-687-field_4-container input[type="tel"]').fill('9876543210');

    // Fix 2: WhatsApp — force: true (hidden field)
    await modal.locator('#wpforms-687-field_9-container input[type="tel"]').fill('9876543210', { force: true });

    await modal.locator('#wpforms-687-field_5').fill('Test');

    // Date — readonly fix
    await modal.locator('#wpforms-687-field_6').evaluate(
        (el: HTMLInputElement) => {
            el.removeAttribute('readonly');
            el.value = '25/09/2026';
        }
    );

    await modal.locator('#wpforms-687-field_7').fill('2');
    await modal.locator('#wpforms-687-field_8').selectOption({ index: 4 });

    // Fix 3: Verify all fields — was missing!
    await expect(modal.locator('#wpforms-687-field_1')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-687-field_2')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-687-field_12')).toHaveValue('test@wizi.digital');
    await expect(
        modal.locator('#wpforms-687-field_4-container input[type="tel"]')
    ).toHaveValue(/98765\s?43210/);
    await expect(modal.locator('#wpforms-687-field_5')).toHaveValue('Test');
    await expect(modal.locator('#wpforms-687-field_6')).toHaveValue('25/09/2026');
    await expect(modal.locator('#wpforms-687-field_7')).toHaveValue('2');

    // Google reCAPTCHA — skip
    console.log(' Google reCAPTCHA — skipping.');

    // Submit visible — CLICK PANNATHA!
    await expect(modal.locator('.wpforms-submit')).toBeVisible();

    console.log(' Form 3 — Group Popup done. Submit NOT clicked!');

    await page.waitForTimeout(30000);
});

// ─────────────────────────────────────────
// FORM 4 — Group Tours Inline form
// ─────────────────────────────────────────
test('Group Tours - Inline Enquiry form fills correctly', async ({ page }) => {

    await page.goto(GROUP_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 120000
    });
    await page.waitForTimeout(3000);

    // Scroll to inline form
    await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(3000);

    // #post-20 scope — only inline form
    const inlineForm = page.locator('#post-20 form#wpforms-form-687');
    await expect(inlineForm).toBeVisible({ timeout: 15000 });

    // Fill all fields
    await inlineForm.locator('#wpforms-687-field_1').fill('Test');
    await inlineForm.locator('#wpforms-687-field_2').fill('Test');
    await inlineForm.locator('#wpforms-687-field_12').fill('test@wizi.digital');
    await inlineForm.locator('#wpforms-687-field_4-container input[type="tel"]').fill('9876543210');

    await inlineForm.locator('#wpforms-687-field_5').fill('Test');

    // Date — readonly fix
    await inlineForm.locator('#wpforms-687-field_6').evaluate(
        (el: HTMLInputElement) => {
            el.removeAttribute('readonly');
            el.value = '25/09/2026';
        }
    );

    await inlineForm.locator('#wpforms-687-field_7').fill('2');
    await inlineForm.locator('#wpforms-687-field_8').selectOption({ index: 2 });

    // Google reCAPTCHA — skip
    console.log(' Google reCAPTCHA — skipping.');

    // Verify all fields
    await expect(inlineForm.locator('#wpforms-687-field_1')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-687-field_2')).toHaveValue('Test');
    await expect(inlineForm.locator('#wpforms-687-field_12')).toHaveValue('test@wizi.digital');
    await expect(
        inlineForm.locator('#wpforms-687-field_4-container input[type="tel"]')
    ).toHaveValue(/98765\s?43210/);
    await expect(inlineForm.locator('#wpforms-687-field_5')).toHaveValue('Test');

    await expect(inlineForm.locator('#wpforms-687-field_6')).toHaveValue('25/09/2026');

    await expect(inlineForm.locator('#wpforms-687-field_7')).toHaveValue('2');

    await expect(inlineForm.locator('.wpforms-submit')).toBeVisible();

    console.log(' Form 4 — Group Inline done. Submit NOT clicked!');

    await page.waitForTimeout(30000);
});