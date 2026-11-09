import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { inspectWebTicket, inspectMobileTicket } from '../src/integrations/ticketContractBoundary';

describe('prototype contract boundary (no backend assumptions)', () => {
  it('preserves web numeric ID and does not claim backend identity', () => {
    const ticket = inspectWebTicket({ id: 48219, status: 'novo', priorityGLPI: 'alta' });
    assert.equal(ticket.identifier.raw, 48219);
    assert.equal(ticket.identifier.display, '48219');
    assert.equal(ticket.identifier.backendIdentityVerified, false);
    assert.equal(ticket.status.shared, 'novo');
    assert.equal(ticket.priority.shared, 'alta');
    assert.equal(ticket.backendContractVerified, false);
  });

  it('preserves mobile string ID including leading zeroes', () => {
    const ticket = inspectMobileTicket({ id: '0048219', status: 'pendente', priority: 'media' });
    assert.equal(ticket.identifier.raw, '0048219');
    assert.equal(ticket.identifier.display, '0048219');
    assert.equal(ticket.identifier.backendIdentityVerified, false);
  });

  it('does not equate resolvido with solucionado', () => {
    const mobile = inspectMobileTicket({ id: '1', status: 'resolvido', priority: 'baixa' });
    const web = inspectWebTicket({ id: 1, status: 'solucionado', priorityGLPI: 'baixa' });
    assert.equal(mobile.status.state, 'unmapped');
    assert.equal(web.status.state, 'unmapped');
  });

  it('does not invent a mapping for critical priority or unknown statuses', () => {
    const ticket = inspectMobileTicket({ id: '1', status: 'aguardando_atualizacao', priority: 'critica' });
    assert.equal(ticket.status.shared, null);
    assert.equal(ticket.priority.shared, null);
    assert.equal(ticket.status.raw, 'aguardando_atualizacao');
    assert.equal(ticket.priority.raw, 'critica');
  });

  it('rejects invalid numeric identifiers', () => {
    assert.throws(() => inspectWebTicket({ id: Number.NaN, status: 'novo', priorityGLPI: 'alta' }));
  });
});
