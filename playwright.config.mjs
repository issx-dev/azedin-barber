import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:4321',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_TEST_BASE_URL ? 'pnpm preview --port 4399' : 'pnpm preview',
    port: process.env.PLAYWRIGHT_TEST_BASE_URL ? 4399 : 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
