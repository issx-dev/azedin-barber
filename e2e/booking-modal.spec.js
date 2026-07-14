import { test, expect } from '@playwright/test';

test('booking modal opens and closes via React state', async ({ page }) => {
  await page.goto('/');

  // Click a data-book-trigger button in the header area
  // The header Reservar button is inside hidden md:flex, use the one that's visible
  const reservarBtn = page.locator('[data-book-trigger]', { hasText: 'Reservar' }).first();
  await expect(reservarBtn).toBeVisible({ timeout: 5000 });
  await reservarBtn.click();

  // Modal should be visible
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible({ timeout: 5000 });

  // Modal should contain the title
  await expect(page.locator('h3', { hasText: 'Reserva tu cita' })).toBeVisible();

  // Close the modal by clicking the close button
  await page.locator('[aria-label="Close"]').click();

  // Modal should be hidden
  await expect(modal).not.toBeVisible({ timeout: 5000 });
});

test('booking modal opens with specific barber from hero', async ({ page }) => {
  await page.goto('/');

  // Click on Samir's chooser area in the hero
  const samirChooser = page.locator('[data-book-barber="Samir"]').first();
  await expect(samirChooser).toBeVisible({ timeout: 5000 });
  await samirChooser.click();

  // Modal should open
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible({ timeout: 5000 });

  // Samir tab should be active (has gold border class)
  const samirTab = page.locator('[role="dialog"] button', { hasText: 'Samir' });
  await expect(samirTab).toHaveClass(/border-gold/);
});

test('booking modal links to Booksy', async ({ page }) => {
  await page.goto('/');

  // Open modal via the Reservar button
  const reservarBtn = page.locator('[data-book-trigger]', { hasText: 'Reservar' }).first();
  await expect(reservarBtn).toBeVisible({ timeout: 5000 });
  await reservarBtn.click();

  // Modal should open
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible({ timeout: 5000 });

  // The Booksy link should be present and contain booksy.com
  const booksyLink = modal.locator('a[href*="booksy.com"]');
  await expect(booksyLink).toBeVisible();
  await expect(booksyLink).toHaveAttribute('href', /booksy\.com/);
});
