import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.synthetic.spec.ts',
  fullyParallel: false,
  retries: 0,
  timeout: 20_000,
  expect: { timeout: 7_000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      VITE_PAR2357_OVERVIEW_PREVIEW: 'true',
      VITE_PAR2357_TICKETS_PREVIEW: 'true',
      VITE_PAR2357_INDICATORS_PREVIEW: 'true',
      VITE_PAR2357_API_BASE_URL: '',
    },
  },
});
