import { test, expect } from '@playwright/test';

test.describe('Visual regression — mármol', () => {
  test('desktop 1440×900 — no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#hero img').first()).toBeAttached();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });

  test('mobile 390×844 — no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });

  test('ledger rows stay inside the viewport at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('#servicios').scrollIntoViewIfNeeded();

    const rows = page.locator('#servicios .ledger-row');
    expect(await rows.count()).toBeGreaterThan(0);
    const width = page.viewportSize().width;
    for (let i = 0; i < (await rows.count()); i++) {
      const box = await rows.nth(i).boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }
  });

  test('header logo stays inside the header', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const header = page.locator('[data-header]');
    const logo = page.locator('header a[aria-label]');
    const headerBox = await header.boundingBox();
    const logoBox = await logo.boundingBox();
    expect(logoBox.y).toBeGreaterThanOrEqual(headerBox.y - 1);
    expect(logoBox.y + logoBox.height).toBeLessThanOrEqual(headerBox.y + headerBox.height + 1);
  });
});
