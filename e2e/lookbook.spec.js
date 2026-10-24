import { test, expect } from '@playwright/test';

test('archivo renders the catalog without filters', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const archivo = page.locator('#archivo');
  await expect(archivo).toBeVisible({ timeout: 10000 });
  await expect(archivo.getByRole('heading', { name: 'Archivo' })).toBeVisible();

  await expect(page.locator('#archivo .reel-card')).toHaveCount(6);
  await expect(page.locator('#archivo video')).toHaveCount(0);

  await expect(page.getByRole('button', { name: 'Todos' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Ver más' })).toHaveCount(0);
});
