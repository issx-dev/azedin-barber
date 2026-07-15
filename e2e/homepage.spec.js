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

test('sections appear in correct editorial order', async ({ page }) => {
  await page.goto('/');

  // Verify section order: Hero → Trust → Lookbook → Reviews → Services → Location
  const hero = page.locator('section').first();
  const trust = page.locator('div', { hasText: 'valoración media' }).first();
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
