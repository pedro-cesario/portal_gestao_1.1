import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parsePar2357TicketPage,
  parsePar2357Overview,
  toVerifiedTicketIdentity,
  InvalidPar2357Payload,
} from '../src/integrations/par2357Dtos.ts';

const fixture = () => ({
  items: [{
    id: 970001,
    titulo: '[SINTÉTICO] Estação sem acesso',
    descricao: 'Dados fictícios',
    status: 2,
    status_label: 'Em atendimento (atribuído)',
    prioridade: 4,
    prioridade_label: 'Alta',
    data_abertura: '2026-11-08T10:00:00-03:00',
    origem_dados: 'SYNTHETIC_DEMO',
    campo_futuro: 'preservado',
  }],
  total: 1,
  page: 1,
  page_size: 6,
  has_next: false,
  source: 'SYNTHETIC_DEMO',
  generated_at: '2026-11-08T13:00:00Z',
  limitations: [],
});

test('valid synthetic ticket page preserves provenance and future fields', () => {
  const p = parsePar2357TicketPage(fixture());
  assert.equal(p.items[0].origem_dados, 'SYNTHETIC_DEMO');
  assert.equal(p.items[0].campo_futuro, 'preservado');
  assert.deepEqual(toVerifiedTicketIdentity(p.items[0]), {
    id: 970001, title: '[SINTÉTICO] Estação sem acesso',
    status: 'em_atendimento', priorityGLPI: 'alta',
    source: 'SYNTHETIC_DEMO', rawStatus: 2, rawPriority: 4,
  });
});

test('the six backend GLPI statuses map to their distinct current UI status', () => {
  const expected = ['novo','em_atendimento','planejado','pendente','solucionado','fechado'];
  for (let n = 1; n <= 6; n++) {
    const v = fixture();
    v.items[0].status = n;
    assert.equal(toVerifiedTicketIdentity(parsePar2357TicketPage(v).items[0]).status, expected[n - 1]);
  }
});

test('major priority must not be silently translated to UI very high', () => {
  const v = fixture();
  v.items[0].prioridade = 6;
  const mapped = toVerifiedTicketIdentity(parsePar2357TicketPage(v).items[0]);
  assert.equal(mapped.priorityGLPI, null);
  assert.equal(mapped.rawPriority, 6);
});

test('unknown priority/status fail closed', () => {
  const v = fixture();
  v.items[0].status = 9;
  assert.throws(() => parsePar2357TicketPage(v), InvalidPar2357Payload);
  v.items[0].status = 2;
  v.items[0].prioridade = 9;
  assert.throws(() => parsePar2357TicketPage(v), InvalidPar2357Payload);
});

test('missing provenance and malformed pagination fail closed', () => {
  const v = fixture();
  v.source = '';
  assert.throws(() => parsePar2357TicketPage(v), InvalidPar2357Payload);
  v.source = 'SYNTHETIC_DEMO';
  v.page_size = 0;
  assert.throws(() => parsePar2357TicketPage(v), InvalidPar2357Payload);
  v.page_size = 6;
  v.total = 0;
  assert.throws(() => parsePar2357TicketPage(v), InvalidPar2357Payload);
});

test('overview unavailable must not advertise indicators as reliable', () => {
  const unavailable = {
    source: 'UNAVAILABLE',
    availability_status: 'UNAVAILABLE',
    reference_date: '2026-11-08T10:00:00-03:00',
    reference_timezone: 'America/Sao_Paulo',
    limitations: ['Consulta realtime indisponível'],
  };
  assert.equal(parsePar2357Overview(unavailable).availability_status, 'UNAVAILABLE');
  assert.throws(
    () => parsePar2357Overview({ ...unavailable, indicadores_gerais: { abertos: 8 } }),
    InvalidPar2357Payload,
  );
});
