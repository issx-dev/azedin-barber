import { test, expect } from '@playwright/test';

test.describe('Regression — current page', () => {
  test('ledger rows stay visible after scrolling the page', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.locator('#servicios').scrollIntoViewIfNeeded();

    const rows = page.locator('#servicios .ledger-row');
    expect(await rows.count()).toBeGreaterThanOrEqual(4);
    await expect(rows.first()).toBeVisible();
  });

  test('location lists the week', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#donde').scrollIntoViewIfNeeded();

    const days = page.locator('#donde dt');
    expect(await days.count()).toBe(7);
    await expect(days.first()).toBeVisible();
  });

  test('the hero is a still, not a video element', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('video#hero-video')).toHaveCount(0);
    await expect(page.locator('#hero img').first()).toBeAttached();
    await expect(page.locator('[data-tour]')).toBeVisible();
  });

  test('header logo fits the bar and is not blend-screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const header = page.locator('[data-header]');
    const logo = page.locator('header a[aria-label]');
    const headerBox = await header.boundingBox();
    const logoBox = await logo.boundingBox();
    expect(logoBox.height).toBeGreaterThan(0);
    expect(logoBox.height).toBeLessThanOrEqual(headerBox.height + 1);
    const blend = await logo.evaluate((el) => getComputedStyle(el).mixBlendMode);
    expect(blend).not.toBe('screen');
  });

  test('review dots are a 44px target', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#resenas').scrollIntoViewIfNeeded();

    const dot = page.locator('.rev-dot').first();
    await expect(dot).toBeVisible();
    const box = await dot.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test('booking links open Booksy in a new tab', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const link = page.locator('a[href*="azedinbarber.booksy.com"][target="_blank"]').first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /azedinbarber\.booksy\.com/);
  });

  test('mobile booking link points at the Booksy profile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const link = page.locator('#hero a[href*="azedinbarber.booksy.com"]').first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('href', /azedinbarber\.booksy\.com\/a/);
  });
});
