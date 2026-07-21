import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('page renders critical sections without javascript', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h2', { hasText: 'Quién te espera' })).toBeVisible();
  await expect(page.locator('h2', { hasText: 'Lookbook' })).toBeVisible();
  await expect(page.locator('h2', { hasText: 'Servicios' })).toBeVisible();
  await expect(page.locator('h2', { hasText: 'Reseñas' })).toBeVisible();
});
