import { test, expect } from '@playwright/test';

test('homepage renders the walkthrough, prices, and rating', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('#hero')).toBeVisible();
  await expect(page.locator('#hero img').first()).toBeAttached();
  await expect(page.locator('#servicios')).toBeVisible();
  await expect(page.locator('#servicios .ledger-row').first()).toBeVisible();
  await expect(page.getByText('5,0').first()).toBeVisible();
});

test('sections follow the booking order', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const servicios = page.locator('#servicios');
  const archivo = page.locator('#archivo');
  const resenas = page.locator('#resenas');
  const local = page.locator('#local');
  const donde = page.locator('#donde');

  await expect(servicios).toBeVisible();
  await expect(archivo).toBeVisible();
  await expect(resenas).toBeVisible();
  await expect(local).toBeVisible();
  await expect(donde).toBeVisible();

  const y = async (locator) => (await locator.boundingBox()).y;
  expect(await y(servicios)).toBeLessThan(await y(archivo));
  expect(await y(archivo)).toBeLessThan(await y(resenas));
  expect(await y(resenas)).toBeLessThan(await y(local));
  expect(await y(local)).toBeLessThan(await y(donde));
});
