import { test, expect } from '@playwright/test';

test('homepage renders hero and services sections', async ({ page }) => {
  await page.goto('/');

  // Hero section / Barbers section with barber names should be visible (h3 elements)
  await expect(page.locator('h3', { hasText: 'Azedin' }).first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator('h3', { hasText: 'Samir' }).first()).toBeVisible({ timeout: 10000 });

  // Services section should be visible
  await expect(page.locator('#servicios')).toBeVisible();

  // Trust strip should show rating (span element)
  await expect(page.locator('span', { hasText: '5.0' }).first()).toBeVisible();
});

test('sections appear in correct editorial order', async ({ page }) => {
  await page.goto('/');

  // Verify section order: Hero → Trust → Lookbook → Reviews → Services → Location
  const hero = page.locator('section').first();
  const lookbook = page.locator('#lookbook');
  const reviews = page.locator('#reseñas');
  const services = page.locator('#servicios');
  const location = page.locator('#ubicacion');

  // All sections should be present
  await expect(lookbook).toBeVisible();
  await expect(services).toBeVisible();
  await expect(location).toBeVisible();

  // Verify Services appears BEFORE Reviews (editorial order)
  const servicesBox = await services.boundingBox();
  const reviewsBox = await reviews.boundingBox();
  expect(servicesBox.y).toBeLessThan(reviewsBox.y);
});
