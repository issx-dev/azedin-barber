import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('page renders critical sections without javascript', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('heading', { name: 'Precios' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Archivo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'El equipo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dónde' })).toBeVisible();
  await expect(page.locator('#servicios .ledger-row').first()).toBeVisible();
  await expect(page.locator('#archivo .reel-card').first()).toBeVisible();
});
