import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4193',
    locale: 'en-US',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4193',
    url: 'http://127.0.0.1:4193',
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /touch\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      testIgnore: /touch\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /touch\.spec\.ts/,
    },
    {
      // Touch and virtual-keyboard behaviour; only the touch suite runs here.
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: /touch\.spec\.ts/,
    },
  ],
});
