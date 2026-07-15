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

  // Bento tiles should render (12 items with data-bento attribute)
  const bentoTiles = page.locator('[data-bento]');
  await expect(bentoTiles).toHaveCount(12, { timeout: 10000 });

  // First tile should have a data-bento attribute
  await expect(bentoTiles.first()).toHaveAttribute('data-bento');

  // No filter buttons should be present
  const filterButtons = page.locator('button', { hasText: 'Todos' });
  await expect(filterButtons).toHaveCount(0);
});
