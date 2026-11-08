/**
 * PAR2357 integrated E2E browser runner. This is NOT the mocked synthetic suite.
 *
 * The operator must start the genuine PAR2357 FastAPI on loopback :8788 with
 * a fresh disposable SQLite database and PORTAL_DEMO_SYNTHETIC=1.
 * The proxy is deliberately pinned to loopback; no arbitrary URL or DNS.
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.integrated.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --config vite.integrated.config.ts --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174/',
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
