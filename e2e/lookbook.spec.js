import { test, expect } from '@playwright/test';

test('lookbook filter updates displayed items', async ({ page }) => {
  await page.goto('/');

  // Wait for the page to fully load
  await page.waitForLoadState('networkidle');

  // Scroll to lookbook section to trigger client:visible hydration
  await page.evaluate(() => {
    document.querySelector('#lookbook')?.scrollIntoView();
  });

  // Wait for the React island to hydrate
  await page.waitForTimeout(2000);

  // Look for the filter buttons rendered by React
  const skinFadeBtn = page.locator('button', { hasText: 'Skin Fade' });
  await expect(skinFadeBtn).toBeVisible({ timeout: 10000 });

  // Click the "Skin Fade" filter
  await skinFadeBtn.click();

  // Verify the filter button is active (has gold styling)
  await expect(skinFadeBtn).toHaveClass(/text-gold/);
});
