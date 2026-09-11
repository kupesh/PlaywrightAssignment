import { defineConfig, devices } from '@playwright/test';
import os from 'node:os';
import path from 'node:path';

const isListCommand = process.argv.includes('--list');
const reportFolder = process.env.PLAYWRIGHT_REPORT_DIR ?? 'playwright-report';

export default defineConfig({
  testDir: './tests',
  outputDir: path.join(os.tmpdir(), 'toolshop-playwright-results'),
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: isListCommand
    ? [['list']]
    : [
        ['html', { outputFolder: reportFolder, open: 'never' }],
        ['json', { outputFile: path.join(reportFolder, 'results.json') }],
        ['list'],
      ],
  use: {
    baseURL: 'https://practicesoftwaretesting.com',
    headless: true,
    testIdAttribute: 'data-test',
    ignoreHTTPSErrors: true,
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 1000 },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        browserName: 'webkit',
      },
    },
    {
      name: 'mobile-chromium',
      grep: /@mobile/,
      use: {
        ...devices['Pixel 5'],
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
