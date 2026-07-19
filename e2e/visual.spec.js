import { test, expect } from '@playwright/test';

test.describe('Visual regression — studio-grotesque-redesign', () => {

  test('desktop 1440×900 — full page snapshot + overflow guard', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for hero image to load (desktop shows static photo)
    await expect(page.locator('.hero-bg-desktop img')).toBeVisible({ timeout: 10000 });

    // Assert no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);

    // Full-page screenshot
    await page.screenshot({ path: 'e2e/screenshots/desktop-1440x900.png', fullPage: true });
  });

  test('mobile 390×844 — full page snapshot + overflow guard', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Assert no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);

    // Full-page screenshot
    await page.screenshot({ path: 'e2e/screenshots/mobile-390x844.png', fullPage: true });
  });

  test('services dot-leader renders without overflow at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Services section should be visible
    await expect(page.locator('#servicios')).toBeVisible();

    // Each service row should not overflow
    const rows = page.locator('#servicios .service-row');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = await rows.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box.x + box.width).toBeLessThanOrEqual(390 + 1); // 1px tolerance
    }
  });

  test('footer wordmark uses Bricolage Grotesque font', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const wordmark = page.locator('.footer-wordmark');
    await expect(wordmark).toBeVisible();

    // Verify computed font includes Bricolage Grotesque
    const fontFamily = await wordmark.evaluate(el =>
      window.getComputedStyle(el).fontFamily
    );
    expect(fontFamily.toLowerCase()).toContain('bricolage');

    // Verify font-weight is 700 or higher
    const fontWeight = await wordmark.evaluate(el =>
      window.getComputedStyle(el).fontWeight
    );
    expect(Number(fontWeight)).toBeGreaterThanOrEqual(700);
  });
});
