import { test, expect } from '@playwright/test';

test('lookbook renders bento tiles without filters', async ({ page }) => {
  await page.goto('/');

  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');

  // Scroll to lookbook section to trigger client:visible hydration
  await page.evaluate(() => {
    document.querySelector('#lookbook')?.scrollIntoView();
  });

  // Wait for the React island to hydrate
  await page.waitForTimeout(2000);

  // Lookbook section should be visible
  const lookbook = page.locator('#lookbook');
  await expect(lookbook).toBeVisible({ timeout: 10000 });

  // Bento tiles should render (9 items with .lookbook-tile class)
  const bentoTiles = page.locator('.lookbook-tile');
  await expect(bentoTiles).toHaveCount(9, { timeout: 10000 });

  // No filter buttons should be present
  const filterButtons = page.locator('button', { hasText: 'Todos' });
  await expect(filterButtons).toHaveCount(0);
});
