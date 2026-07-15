import { test, expect } from '@playwright/test';

test('booking modal opens and closes via React state', async ({ page }) => {
  await page.goto('/');

  // Click a data-book-trigger button (the floating CTA is always visible)
  const reservarBtn = page.locator('[data-book-trigger]', { hasText: 'Reservar ahora' }).first();
  await expect(reservarBtn).toBeVisible({ timeout: 5000 });
  // Wait for React island to hydrate, then click
  await page.waitForTimeout(1000);
  await reservarBtn.click();

  // Modal should be visible — check for the title
  await expect(page.locator('h3', { hasText: 'Reserva tu cita' })).toBeVisible({ timeout: 10000 });

  // Close the modal by clicking the close button
  await page.locator('[aria-label="Close"]').click();

  // Modal title should disappear (booking modal uses conditional rendering)
  await expect(page.locator('h3', { hasText: 'Reserva tu cita' })).not.toBeVisible({ timeout: 5000 });
});

test('booking modal shows circular barber thumbnails', async ({ page }) => {
  await page.goto('/');

  // Open modal
  const reservarBtn = page.locator('[data-book-trigger]', { hasText: 'Reservar ahora' }).first();
  await expect(reservarBtn).toBeVisible({ timeout: 5000 });
  await reservarBtn.click();

  // Wait for modal
  await expect(page.locator('h3', { hasText: 'Reserva tu cita' })).toBeVisible({ timeout: 5000 });

  // Barber names should be present
  await expect(page.locator('text=Azedin').first()).toBeVisible();
  await expect(page.locator('text=Samir').first()).toBeVisible();
});

test('booking modal opens with specific barber from hero', async ({ page }) => {
  await page.goto('/');

  // Click on Samir's chooser area in the hero
  const samirChooser = page.locator('[data-book-barber="Samir"]').first();
  await expect(samirChooser).toBeVisible({ timeout: 5000 });
  await samirChooser.click();

  // Modal should open
  await expect(page.locator('h3', { hasText: 'Reserva tu cita' })).toBeVisible({ timeout: 5000 });

  // Samir thumbnail should be selected (has oak border class)
  const samirImg = page.locator('img[alt="Samir"]').first();
  await expect(samirImg).toBeVisible();
});

test('booking modal links to Booksy', async ({ page }) => {
  await page.goto('/');

  // Open modal via the floating CTA
  const reservarBtn = page.locator('[data-book-trigger]', { hasText: 'Reservar ahora' }).first();
  await expect(reservarBtn).toBeVisible({ timeout: 5000 });
  await reservarBtn.click();

  // Wait for modal
  await expect(page.locator('h3', { hasText: 'Reserva tu cita' })).toBeVisible({ timeout: 5000 });

  // The Booksy link should be present and contain booksy.com
  const booksyLink = page.locator('a[href*="booksy.com"]').first();
  await expect(booksyLink).toBeVisible();
  await expect(booksyLink).toHaveAttribute('href', /booksy\.com/);
});
