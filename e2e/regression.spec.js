import { test, expect } from '@playwright/test';

test.describe('Regression — Visibility & Animations', () => {

  test('all data-stagger containers become visible after scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    const containers = page.locator('[data-stagger]');
    const count = await containers.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const opacity = await containers.nth(i).evaluate(el => getComputedStyle(el).opacity);
      expect(Number(opacity), `data-stagger #${i} invisible`).toBeGreaterThan(0);
    }
  });

  test('Services section rows are rendered and visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#servicios').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const rows = page.locator('#servicios .service-row');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(4);

    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toBeVisible();
    }
  });

  test('Location hours list is rendered and visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#ubicacion').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const hoursContainer = page.locator('#ubicacion [data-stagger]');
    await expect(hoursContainer).toBeVisible();
    const opacity = await hoursContainer.evaluate(el => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0);
  });
});

test.describe('Regression — Video', () => {

  test('mobile video element exists and is loaded', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const video = page.locator('video#hero-video-mobile');
    await expect(video).toBeAttached();
    const src = await video.evaluate(el => el.currentSrc);
    expect(src).toContain('instalaciones-mobile');
  });

  test('desktop video element exists and loads desktop source', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const video = page.locator('video#hero-video-desktop');
    await expect(video).toBeAttached();
    const src = await video.evaluate(el => el.currentSrc);
    expect(src).toContain('instalaciones-desktop');
  });
});

test.describe('Regression — Header Logo & Layout', () => {

  test('logo does not overflow header container height', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const logo = page.locator('.nav-logo-img');
    const headerRow = page.locator('#site-header .flex').first();

    const logoBox = await logo.boundingBox();
    const headerBox = await headerRow.boundingBox();

    expect(logoBox).not.toBeNull();
    expect(headerBox).not.toBeNull();
    expect(logoBox.height).toBeLessThanOrEqual(headerBox.height);
  });

  test('logo has no mix-blend-mode screen artifact', async ({ page }) => {
    await page.goto('/');
    const blend = await page.locator('.nav-logo-img').evaluate(
      el => getComputedStyle(el).mixBlendMode
    );
    expect(blend).not.toBe('screen');
  });
});

test.describe('Regression — Review Dots', () => {

  test('active dot does not deform with scaleX transform', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.evaluate(() => {
      const btn = document.querySelector('[data-reviews-dot]');
      if (btn) btn.setAttribute('data-active', 'true');
    });

    const dot = page.locator('.reviews-dot').first();
    const transform = await dot.evaluate(el => getComputedStyle(el).transform);
    expect(transform).not.toContain('matrix(4');
  });
});

test.describe('Regression — Lookbook Toggle', () => {

  test('mobile: clicking "Ver más" reveals extra items', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('#lookbook').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const btn = page.locator('#lookbook-toggle-btn');
    await expect(btn).toBeVisible();
    await btn.click();

    const extras = page.locator('.lookbook-extra');
    const count = await extras.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(extras.nth(i)).toBeVisible();
    }
  });
});
