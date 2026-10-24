import { test, expect } from '@playwright/test';

const anchors = ['#servicios', '#archivo', '#resenas', '#local', '#donde'];

test.describe('Mobile navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('menu opens the disclosure', async ({ page }) => {
    const toggle = page.locator('[data-nav-toggle]');
    const panel = page.locator('#mobile-nav');
    await expect(toggle).toBeVisible();
    await expect(panel).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(toggle).toHaveText('Cerrar');
  });

  test('panel lists the section anchors', async ({ page }) => {
    await page.locator('[data-nav-toggle]').click();
    for (const href of anchors) {
      await expect(page.locator(`#mobile-nav a[href="${href}"]`)).toBeVisible();
    }
  });

  test('anchor click closes the panel', async ({ page }) => {
    const toggle = page.locator('[data-nav-toggle]');
    await toggle.click();
    await page.locator('#mobile-nav a[href="#servicios"]').click();
    await expect(page.locator('#mobile-nav')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape closes the panel', async ({ page }) => {
    const toggle = page.locator('[data-nav-toggle]');
    await toggle.click();
    await expect(page.locator('#mobile-nav')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-nav')).toBeHidden();
    await expect(toggle).toHaveText('Menú');
  });

  test('Cerrar closes the panel', async ({ page }) => {
    const toggle = page.locator('[data-nav-toggle]');
    await toggle.click();
    await expect(toggle).toHaveText('Cerrar');
    await toggle.click();
    await expect(page.locator('#mobile-nav')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
