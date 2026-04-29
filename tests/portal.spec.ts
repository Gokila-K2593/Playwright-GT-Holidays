import { test, expect } from '@playwright/test';

const BASE_URL = 'https://your-deployed-url.com';
// OR if running locally:
// const BASE_URL = 'http://localhost:3000';

test('Login page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('Wrong password shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="email"]').fill('wrong@email.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
});

test('Correct login goes to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator('input[type="email"]').fill('admin@gmail.com');
    await page.locator('input[type="password"]').fill('yourpassword');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/admin/dashboard`);
});