// =============================================================================
// SECTION: Playwright Configuration
// E2E tests run against the dev server (http://localhost:5173).
// Tests are in e2e/ directory.
// =============================================================================

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir:      './e2e',
  timeout:      30_000,
  retries:      1,
  reporter:     'list',
  use: {
    baseURL:          'http://localhost:5173',
    trace:            'on-first-retry',
    screenshot:       'only-on-failure',
    headless:         true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Start dev server before tests
  webServer: {
    command:           'npm run dev',
    url:               'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout:           30_000,
  },
});
