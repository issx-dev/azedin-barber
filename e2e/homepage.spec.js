import { test, expect } from '@playwright/test';

test('homepage renders hero and services sections', async ({ page }) => {
  await page.goto('/');

  // Hero section with barber names should be visible (h2 elements)
  await expect(page.locator('h2', { hasText: 'Azedin' }).first()).toBeVisible();
  await expect(page.locator('h2', { hasText: 'Samir' }).first()).toBeVisible();

  // Services section should be visible
  await expect(page.locator('#servicios')).toBeVisible();

  // Trust strip should show rating
  await expect(page.locator('strong', { hasText: '5.0' })).toBeVisible();
});
