import { test, expect } from '@playwright/test';

test('archivo has no expander; the reel is the catalog', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const archivo = page.locator('#archivo');
  await archivo.scrollIntoViewIfNeeded();
  await expect(archivo).toBeVisible();
  await expect(page.locator('#lookbook-toggle-btn')).toHaveCount(0);
  await expect(page.locator('.lookbook-extra')).toHaveCount(0);
  await expect(page.locator('#archivo .reel-card').first()).toBeVisible();
});
