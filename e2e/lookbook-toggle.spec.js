import { test, expect } from '@playwright/test';

test('lookbook toggle works on mobile', async ({ page }) => {
  // Use a mobile viewport so the toggle button is visible
  await page.setViewportSize({ width: 375, height: 812 });
  
  await page.goto('/');

  // Scroll to lookbook section
  await page.evaluate(() => {
    document.querySelector('#lookbook')?.scrollIntoView();
  });

  const toggleBtn = page.locator('#lookbook-toggle-btn');
  await expect(toggleBtn).toBeVisible({ timeout: 5000 });
  await toggleBtn.click();

  // Assert extra items are visible
  const extraItems = page.locator('.lookbook-extra').first();
  await expect(extraItems).toBeVisible();

  // Assert toggle button aria-expanded is true
  expect(await toggleBtn.getAttribute('aria-expanded')).toBe('true');
});
