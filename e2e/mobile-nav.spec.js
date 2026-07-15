import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hamburger triggers fullscreen overlay', async ({ page }) => {
    await page.goto('/');

    // Hamburger button should be visible on mobile
    const hamburger = page.locator('[data-nav-trigger]');
    await expect(hamburger).toBeVisible({ timeout: 5000 });

    // Click hamburger
    await hamburger.click();

    // MobileNav overlay should appear (panel slides in via transform)
    const overlay = page.locator('[role="dialog"][aria-label="Navegación"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Panel should not be translated off-screen when open
    // Wait for the CSS transition to settle
    await page.waitForFunction(() => {
      const el = document.querySelector('[role="dialog"][aria-label="Navegación"]');
      if (!el) return false;
      const t = getComputedStyle(el).transform;
      return t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
    }, { timeout: 3000 });
  });

  test('overlay contains all section anchors', async ({ page }) => {
    await page.goto('/');

    // Open mobile nav
    const hamburger = page.locator('[data-nav-trigger]');
    await expect(hamburger).toBeVisible({ timeout: 5000 });
    await hamburger.click();

    const overlay = page.locator('[role="dialog"][aria-label="Navegación"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // All 4 anchors should be present
    await expect(overlay.locator('a[href="#lookbook"]')).toBeVisible();
    await expect(overlay.locator('a[href="#servicios"]')).toBeVisible();
    await expect(overlay.locator('a[href="#reseñas"]')).toBeVisible();
    await expect(overlay.locator('a[href="#ubicacion"]')).toBeVisible();
  });

  test('anchor click closes overlay', async ({ page }) => {
    await page.goto('/');

    // Open mobile nav
    const hamburger = page.locator('[data-nav-trigger]');
    await expect(hamburger).toBeVisible({ timeout: 5000 });
    await hamburger.click();

    const overlay = page.locator('[role="dialog"][aria-label="Navegación"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Click an anchor
    await overlay.locator('a[href="#lookbook"]').click();

    // Panel should slide out (translateX(100%))
    await expect(async () => {
      const transform = await overlay.evaluate((el) => getComputedStyle(el).transform);
      expect(transform).not.toBe('none');
    }).toPass({ timeout: 5000 });
  });

  test('Escape key closes overlay', async ({ page }) => {
    await page.goto('/');

    // Open mobile nav
    const hamburger = page.locator('[data-nav-trigger]');
    await expect(hamburger).toBeVisible({ timeout: 5000 });
    await hamburger.click();

    const overlay = page.locator('[role="dialog"][aria-label="Navegación"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Press Escape
    await page.keyboard.press('Escape');

    // Panel should slide out
    await expect(async () => {
      const transform = await overlay.evaluate((el) => getComputedStyle(el).transform);
      expect(transform).not.toBe('none');
    }).toPass({ timeout: 5000 });
  });

  test('close button closes overlay', async ({ page }) => {
    await page.goto('/');

    // Open mobile nav
    const hamburger = page.locator('[data-nav-trigger]');
    await expect(hamburger).toBeVisible({ timeout: 5000 });
    await hamburger.click();

    const overlay = page.locator('[role="dialog"][aria-label="Navegación"]');
    await expect(overlay).toBeVisible({ timeout: 5000 });

    // Click close button
    await page.locator('[aria-label="Cerrar menú"]').click();

    // Panel should slide out
    await expect(async () => {
      const transform = await overlay.evaluate((el) => getComputedStyle(el).transform);
      expect(transform).not.toBe('none');
    }).toPass({ timeout: 5000 });
  });
});
