import test from 'node:test';
import assert from 'node:assert/strict';
import { createPortalApiClient, PortalApiError } from '../src/integrations/portalApiClient.ts';

test('connection remains disabled unless explicitly enabled', async () => {
  let calls = 0;
  const api = createPortalApiClient({ fetchImpl: (async () => {
    calls++;
    return new Response('{}', { headers: { 'content-type': 'application/json' } });
  }) as typeof fetch });
  await assert.rejects(api.listTickets(), (err: unknown) =>
    err instanceof PortalApiError && err.status === 0);
  assert.equal(calls, 0);
});

test('GET tickets uses explicit query params and credentials without adding auth tokens', async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const api = createPortalApiClient({
    enabled: true,
    baseUrl: '/api',
    fetchImpl: (async (url: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(url), init });
      return new Response('{"items":[]}', { status: 200, headers: { 'content-type': 'application/json' } });
    }) as typeof fetch,
  });
  assert.deepEqual(await api.listTickets({ page: 2, page_size: 6, status: 'novo' }), { items: [] });
  assert.equal(calls[0].url, '/api/v1/tickets?page=2&page_size=6&status=novo');
  assert.equal(calls[0].init?.method, 'GET');
  assert.equal(calls[0].init?.credentials, 'include');
  assert.equal((calls[0].init?.headers as Record<string, string>)?.Authorization, undefined);
});

test('invalid page size and ticket IDs are rejected before any call', async () => {
  let calls = 0;
  const api = createPortalApiClient({
    enabled: true,
    fetchImpl: (async () => {
      calls++;
      throw new Error('unexpected fetch');
    }) as typeof fetch,
  });
  await assert.rejects(api.listTickets({ page_size: 101 }), TypeError);
  await assert.rejects(api.getTicket('../secrets'), TypeError);
  await assert.rejects(api.getTicket(0), TypeError);
  assert.equal(calls, 0);
});

test('auth failure is reported without exposing response contents', async () => {
  const api = createPortalApiClient({
    enabled: true,
    fetchImpl: (async () => new Response('private token', { status: 401 })) as typeof fetch,
  });
  await assert.rejects(api.getCurrentUser(), (err: unknown) =>
    err instanceof PortalApiError &&
    err.status === 401 &&
    !err.message.includes('private token'));
});

test('non-JSON responses cannot silently become Portal DTOs', async () => {
  const api = createPortalApiClient({
    enabled: true,
    fetchImpl: (async () => new Response('<html>login</html>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    })) as typeof fetch,
  });
  await assert.rejects(api.getOverview(), PortalApiError);
});
