import { test, expect, type Page } from '@playwright/test';

const stamp = '2026-11-08T10:00:00-03:00';
const tickets = [
  { id: 970101, titulo: '[SINTÉTICO] Wi-Fi indisponível', descricao: 'Simulação de incidente',
    status: 2, status_label: 'Em atendimento', prioridade: 4, prioridade_label: 'Alta',
    data_abertura: stamp, origem_dados: 'SYNTHETIC_DEMO', categoria_nome: 'Redes' },
  { id: 970102, titulo: '[SINTÉTICO] Troca de estação', descricao: 'Simulação de solicitação',
    status: 1, status_label: 'Novo', prioridade: 3, prioridade_label: 'Média',
    data_abertura: stamp, origem_dados: 'SYNTHETIC_DEMO', categoria_nome: 'Suporte' },
];
const overview = {
  source: 'SYNTHETIC_DEMO',
  availability_status: 'AVAILABLE',
  reference_date: stamp,
  reference_timezone: 'America/Sao_Paulo',
  total_concluidos_hoje: 2,
  total_concluidos_periodo_30d: 17,
  limitations: [],
};

async function syntheticApi(page: Page, options: { unauthorized?: boolean; source?: string } = {}) {
  await page.route('**/v1/**', async route => {
    const url = new URL(route.request().url());
    const source = options.source ?? 'SYNTHETIC_DEMO';
    let status = 200;
    let body: unknown;
    if (url.pathname === '/v1/auth/me') {
      if (options.unauthorized) {
        status = 401;
        body = { detail: 'Unauthorized' };
      } else {
        body = {
          status: 'authenticated', user_id: 'synthetic-browser-operator',
          username: 'synthetic-test', full_name: 'Operador Sintético',
          roles: ['MANAGER_OPERATIONS'], permissions: ['READ_OPERATIONAL'],
          csrf_token: null, must_change_password: false, auth_transport: 'cookie',
        };
      }
    } else if (url.pathname === '/v1/tickets') {
      const pageIndex = Number(url.searchParams.get('page') || 1);
      const pageSize = Number(url.searchParams.get('page_size') || 6);
      const start = (pageIndex - 1) * pageSize;
      body = {
        items: tickets.slice(start, start + pageSize).map(t => ({ ...t, origem_dados: source })),
        total: tickets.length,
        page: pageIndex,
        page_size: pageSize,
        has_next: start + pageSize < tickets.length,
        source,
        generated_at: stamp,
        limitations: [],
      };
    } else if (url.pathname === '/v1/indicators/overview') {
      body = { ...overview, source };
    } else {
      status = 404;
      body = { detail: 'Synthetic route not registered' };
    }
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
}

test('executive overview shows validated synthetic totals and drill-down', async ({ page }) => {
  await syntheticApi(page);
  await page.goto('/');
  await expect(page.getByText('Visão Geral — PAR2357')).toBeVisible();
  await expect(page.getByText('Chamados na fonte sintética')).toBeVisible();
  await expect(page.getByText('[SINTÉTICO] Wi-Fi indisponível')).toBeVisible();
  await page.getByRole('button', { name: /970101.*Wi-Fi indisponível/s }).click();
  await expect(page.getByRole('dialog', { name: 'Chamado 970101' })).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('tickets preview uses validated API data and opens analytical details', async ({ page }) => {
  await syntheticApi(page);
  await page.goto('/');
  await page.locator('nav[aria-label="Navegação Principal"] button[title^="Chamados GLPI"]').click();
  await expect(page.getByText('Chamados — Consulta PAR2357')).toBeVisible();
  await expect(page.getByText('[SINTÉTICO] Troca de estação')).toBeVisible();
  await page.getByRole('button', { name: /970102.*Troca de estação/s }).click();
  await expect(page.getByRole('dialog', { name: 'Detalhes do chamado 970102' })).toBeVisible();
});

test('indicators preview shows only synthetic metrics', async ({ page }) => {
  await syntheticApi(page);
  await page.goto('/');
  await page.locator('nav[aria-label="Navegação Principal"] button[title^="Indicadores"]').click();
  await expect(page.getByText('Indicadores — Prévia sintética PAR2357')).toBeVisible();
  await expect(page.getByText('Concluídos hoje')).toBeVisible();
  await expect(page.getByText('Concluídos no período (30d)')).toBeVisible();
  await expect(page.getByText('17', { exact: true })).toBeVisible();
});

test('401 never falls back to mock data on overview', async ({ page }) => {
  await syntheticApi(page, { unauthorized: true });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('sessão não está autenticada');
  await expect(page.getByText('Chamados na fonte sintética')).toHaveCount(0);
});

test('non-synthetic API records are refused by the preview', async ({ page }) => {
  await syntheticApi(page, { source: 'GLPI_PRD_3307' });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Não foi possível validar');
  await expect(page.getByText('[SINTÉTICO] Wi-Fi indisponível')).toHaveCount(0);
});

test('malformed auth/me success never unlocks previews', async ({ page }) => {
  await page.route('**/v1/auth/me', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ username: 'synthetic-test', permissions: ['READ_OPERATIONAL'] }),
  }));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Não foi possível validar');
  await expect(page.getByText('Chamados na fonte sintética')).toHaveCount(0);
});
