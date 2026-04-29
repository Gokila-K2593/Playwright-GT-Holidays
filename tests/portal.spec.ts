import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dynamic-item-portal.onrender.com';

test('Login page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});

test('Wrong credentials shows error message', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.locator('input[type="email"]').fill('wrong@email.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.locator('text=Invalid email or password')).toBeVisible();
});

test('Empty fields shows validation error', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.getByRole('button', { name: /login/i }).click();

    await expect(
        page.locator('text=required').or(
            page.locator('text=Please')).or(
                page.locator('text=cannot be empty'))
    ).toBeVisible({ timeout: 5000 });
});

test('Correct login redirects to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.locator('input[type="email"]').fill('admin@example.com');
    await page.locator('input[type="password"]').fill('Admin@123');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page).toHaveURL(
        `${BASE_URL}/admin/dashboard`, { timeout: 15000 }
    );
});

test('Dashboard has Create New Item button', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.locator('input[type="email"]').fill('admin@example.com');
    await page.locator('input[type="password"]').fill('Admin@123');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page).toHaveURL(
        `${BASE_URL}/admin/dashboard`, { timeout: 15000 }
    );

    await expect(
        page.getByRole('button', { name: /create new item/i })
    ).toBeVisible({ timeout: 10000 });
});