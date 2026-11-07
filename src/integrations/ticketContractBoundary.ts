/**
 * Boundary between the two *prototype* ticket representations.
 * This file is NOT an API contract for the PAR2357 backend.
 * Do not use it to imply a live GLPI connection.
 */

export type PrototypeSource = 'web-1.1' | 'mobile-1.0';

export type KnownSharedStatus = 'novo' | 'em_atendimento' | 'pendente';
export type KnownSharedPriority = 'baixa' | 'media' | 'alta';

export interface PrototypeTicketInput {
  id: string | number;
  status: string;
  priority: string;
}

export interface FieldResolution<T extends string> {
  raw: string;
  shared: T | null;
  state: 'identical' | 'unmapped';
}

export interface TicketBoundaryResult {
  source: PrototypeSource;
  identifier: {
    raw: string | number;
    display: string;
    /** Never assume a string ID and numeric ID identify the same backend row. */
    backendIdentityVerified: false;
  };
  status: FieldResolution<KnownSharedStatus>;
  priority: FieldResolution<KnownSharedPriority>;
  /** Contract remains unverified until compared to PAR2357 DTOs. */
  backendContractVerified: false;
}

const SHARED_STATUS: ReadonlySet<string> =
  new Set(['novo', 'em_atendimento', 'pendente']);

const SHARED_PRIORITY: ReadonlySet<string> =
  new Set(['baixa', 'media', 'alta']);

function resolve<T extends string>(raw: string, values: ReadonlySet<string>): FieldResolution<T> {
  if (values.has(raw)) {
    return { raw, shared: raw as T, state: 'identical' };
  }
  return { raw, shared: null, state: 'unmapped' };
}

function validateIdentifier(id: string | number): void {
  if (typeof id === 'number') {
    if (!Number.isSafeInteger(id) || id < 0) {
      throw new Error('Invalid numeric prototype ticket identifier');
    }
    return;
  }
  if (!id.trim()) throw new Error('Empty prototype ticket identifier');
}

/**
 * Maps only *identical literal values* shared by both prototypes.
 * No semantic guessing: 'resolvido' != 'solucionado',
 * 'critica' != 'muito_alta', and 'aguardando_atualizacao'
 * has no assumed web equivalent.
 */
export function inspectPrototypeTicket(
  source: PrototypeSource,
  input: PrototypeTicketInput,
): TicketBoundaryResult {
  validateIdentifier(input.id);

  return {
    source,
    identifier: {
      raw: input.id,
      display: String(input.id),
      backendIdentityVerified: false,
    },
    status: resolve<KnownSharedStatus>(input.status, SHARED_STATUS),
    priority: resolve<KnownSharedPriority>(input.priority, SHARED_PRIORITY),
    backendContractVerified: false,
  };
}

/** Adapters for existing view models; no calls to backend or side effects. */
export function inspectWebTicket(input: {
  id: number;
  status: string;
  priorityGLPI: string;
}): TicketBoundaryResult {
  return inspectPrototypeTicket('web-1.1', {
    id: input.id,
    status: input.status,
    priority: input.priorityGLPI,
  });
}

export function inspectMobileTicket(input: {
  id: string;
  status: string;
  priority: string;
}): TicketBoundaryResult {
  return inspectPrototypeTicket('mobile-1.0', input);
}
