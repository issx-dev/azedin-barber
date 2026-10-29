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
    // Safari's engine: every browser on iOS runs it, and it renders and
    // schedules differently enough to need its own run.
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
  webServer: {
    command: process.env.PLAYWRIGHT_TEST_BASE_URL ? 'pnpm preview --port 4399' : 'pnpm preview',
    port: process.env.PLAYWRIGHT_TEST_BASE_URL ? 4399 : 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
