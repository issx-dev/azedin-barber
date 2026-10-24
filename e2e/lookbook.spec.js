import { test, expect } from '@playwright/test';

test('lookbook renders editorial catalog items without filters', async ({ page }) => {
  await page.goto('/');

  // Wait for DOM content to load
  await page.waitForLoadState('domcontentloaded');

  // Scroll to lookbook section
  await page.evaluate(() => {
    document.querySelector('#lookbook')?.scrollIntoView();
  });

  // Lookbook section should be visible
  const lookbook = page.locator('#lookbook');
  await expect(lookbook).toBeVisible({ timeout: 10000 });

  // Editorial catalog items should render all gallery items with .lookbook-item class
  const catalogItems = page.locator('.lookbook-item');
  await expect(catalogItems).toHaveCount(11, { timeout: 10000 });

  // No filter buttons should be present
  const filterButtons = page.locator('button', { hasText: 'Todos' });
  await expect(filterButtons).toHaveCount(0);
});
