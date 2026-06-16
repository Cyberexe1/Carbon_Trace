// =============================================================================
// SECTION: E2E Tests — Landing Page + Auth flow
// Tests the public-facing landing page and login page navigation.
// Does NOT require a real backend — tests only what renders without auth.
// =============================================================================

import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('loads and shows main headline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/carbontrace/i);
    await expect(page.getByRole('heading', { name: /see your carbon footprint/i })).toBeVisible();
  });

  test('CTA button navigates to login', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /start your profile/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders sign in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
  });

  test('register tab switches form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('tab', { name: /create account/i }).click();
    await expect(page.getByRole('heading', { name: /start your journey/i })).toBeVisible();
  });

  test('login form shows validation error on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('alert')).toContainText(/please fill in all fields/i);
  });

  test('features section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /powerful tools for change/i })).toBeVisible();
  });

  test('how it works section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /shrinking your footprint is simple/i })).toBeVisible();
  });

  test('catch-all redirects to home', async ({ page }) => {
    await page.goto('/nonexistent-route-xyz');
    await expect(page).toHaveURL('/');
  });
});
