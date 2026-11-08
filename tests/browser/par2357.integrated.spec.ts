/**
 * TRUE browser -> Vite same-origin proxy -> PAR2357 FastAPI integrated tests.
 *
 * There are deliberately NO page.route() mocks in this file.
 * Only run against a process with isolated SQLite and SYNTHETIC_DEMO enabled.
 */
import { test, expect } from '@playwright/test';

function guard(): { username: string; password: string } {
  if (process.env.PAR2357_E2E_SYNTHETIC !== '1' ||
      process.env.PAR2357_E2E_DB_ISOLATED !== '1') {
    throw new Error('Integrated E2E disabled: both synthetic and disposable DB attestations required');
  }
  const username = process.env.PAR2357_E2E_USERNAME || 'gestor';
  const password = process.env.PAR2357_E2E_PASSWORD;
  if (!password || password.length < 16) {
    throw new Error('Missing synthetic-only PAR2357_E2E_PASSWORD (at least 16 characters)');
  }
  return { username, password };
}

test('real FastAPI: unauthenticated browsing fails closed', async ({ page }) => {
  guard();
  const unauth = await page.request.get('/v1/auth/me');
  expect(unauth.status()).toBe(401);
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('sessão não está autenticada');
  await expect(page.getByText('Chamados na fonte sintética')).toHaveCount(0);
});

test('real FastAPI: login, verified cookie, tickets, drill-down and logout CSRF', async ({ page }) => {
  const { username, password } = guard();
  const health = await page.request.get('/health');
  expect(health.status()).toBe(200);

  // Shares the browser context's cookie jar; no cookie/token is logged.
  const login = await page.request.post('/v1/auth/login', {
    data: { username, password },
    headers: { Origin: 'http://127.0.0.1:4174' },
  });
  expect(login.status()).toBe(200);
  const me = await page.request.get('/v1/auth/me');
  expect(me.status()).toBe(200);
  const identity = await me.json() as Record<string, unknown>;
  expect(identity.status).toBe('authenticated');
  expect(identity.auth_transport).toBe('cookie');
  expect(identity.must_change_password).toBe(false);
  expect(Array.isArray(identity.permissions)).toBe(true);

  const tickets = await page.request.get('/v1/tickets?page=1&page_size=6');
  expect(tickets.status()).toBe(200);
  const payload = await tickets.json() as {
    source: string;
    items: Array<{ id: number; origem_dados: string; titulo: string }>;
  };
  expect(payload.source).toBe('SYNTHETIC_DEMO');
  expect(payload.items.length).toBeGreaterThan(0);
  expect(payload.items.every(item => item.origem_dados === 'SYNTHETIC_DEMO')).toBe(true);

  await page.goto('/');
  await expect(page.getByText('Visão Geral — PAR2357')).toBeVisible();
  await expect(page.getByText('Chamados na fonte sintética')).toBeVisible();
  await page.locator('nav[aria-label="Navegação Principal"] button[title^="Chamados GLPI"]').click();
  await expect(page.getByText('Chamados — Consulta PAR2357')).toBeVisible();
  await page.locator('nav[aria-label="Navegação Principal"] button[title^="Indicadores"]').click();
  await expect(page.getByText('Indicadores — Prévia sintética PAR2357')).toBeVisible();

  const csrfCookie = (await page.context().cookies()).find(cookie => cookie.name === 'heal_csrf_token');
  const csrf = csrfCookie?.value || (typeof identity.csrf_token === 'string' ? identity.csrf_token : '');
  expect(csrf.length).toBeGreaterThan(0);

  const logout = await page.request.post('/v1/auth/logout', {
    headers: {
      Origin: 'http://127.0.0.1:4174',
      'X-CSRF-Token': csrf,
    },
  });
  expect(logout.status()).toBe(200);
  const afterLogout = await page.request.get('/v1/auth/me');
  expect(afterLogout.status()).toBe(401);
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('sessão não está autenticada');
});
