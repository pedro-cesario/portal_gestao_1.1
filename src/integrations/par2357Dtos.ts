/**
 * PAR2357 response DTO boundary. Verified against backend/contracts/models.py.
 * Not a Ticket view model: clinical impact, latest human activity, evidence and
 * managerial priorities require separate, validated sources before rendering.
 */
import type { GLPIPriority, TicketStatus } from '../types';

export interface Par2357Ticket {
  id: number;
  titulo: string;
  descricao?: string | null;
  status: 1 | 2 | 3 | 4 | 5 | 6;
  status_label?: string;
  prioridade: 1 | 2 | 3 | 4 | 5 | 6;
  prioridade_label?: string;
  categoria_id?: number | null;
  categoria_nome?: string | null;
  data_abertura: string;
  data_modificacao?: string | null;
  grupo_responsavel?: unknown;
  grupos_atribuidos?: unknown[];
  tecnicos_atribuidos?: unknown[];
  requerentes?: unknown[];
  origem_dados: string;
  [field: string]: unknown;
}

export interface Par2357TicketPage {
  items: Par2357Ticket[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  source: string;
  generated_at: string;
  limitations: string[];
}

export interface TicketDisplayIdentity {
  id: number;
  title: string;
  status: TicketStatus;
  /** null means no safe equivalent in the current web design. */
  priorityGLPI: GLPIPriority | null;
  source: string;
  /** Raw source fields intentionally preserved for traceability. */
  rawStatus: number;
  rawPriority: number;
}

export class InvalidPar2357Payload extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPar2357Payload';
  }
}

function record(v: unknown, field: string): Record<string, unknown> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    throw new InvalidPar2357Payload(`Invalid ${field}`);
  }
  return v as Record<string, unknown>;
}

function integer(v: unknown, field: string, min: number, max = Number.MAX_SAFE_INTEGER): number {
  if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < min || v > max) {
    throw new InvalidPar2357Payload(`Invalid ${field}`);
  }
  return v;
}

function nonempty(v: unknown, field: string): string {
  if (typeof v !== 'string' || !v.trim()) throw new InvalidPar2357Payload(`Invalid ${field}`);
  return v;
}

function timestamp(v: unknown, field: string): string {
  const s = nonempty(v, field);
  // Preserve source timezone and don't invent timezone for a naive timestamp.
  if (!Number.isFinite(Date.parse(s))) throw new InvalidPar2357Payload(`Invalid ${field}`);
  return s;
}

export function parsePar2357TicketPage(payload: unknown): Par2357TicketPage {
  const data = record(payload, 'ticket page');
  const items = data.items;
  if (!Array.isArray(items)) throw new InvalidPar2357Payload('Invalid items');
  const total = integer(data.total, 'total', 0);
  const page = integer(data.page, 'page', 1);
  const pageSize = integer(data.page_size, 'page_size', 1, 100);
  if (items.length > pageSize || total < items.length || (page - 1) * pageSize > total) {
    throw new InvalidPar2357Payload('Inconsistent pagination');
  }
  if (typeof data.has_next !== 'boolean') throw new InvalidPar2357Payload('Invalid has_next');
  const source = nonempty(data.source, 'source');
  const generatedAt = timestamp(data.generated_at, 'generated_at');
  if (!Array.isArray(data.limitations) || !data.limitations.every(x => typeof x === 'string')) {
    throw new InvalidPar2357Payload('Invalid limitations');
  }
  const parsedItems = items.map((item, index) => {
    const t = record(item, `items[${index}]`);
    integer(t.id, 'ticket.id', 1);
    nonempty(t.titulo, 'ticket.titulo');
    integer(t.status, 'ticket.status', 1, 6);
    integer(t.prioridade, 'ticket.prioridade', 1, 6);
    timestamp(t.data_abertura, 'ticket.data_abertura');
    nonempty(t.origem_dados, 'ticket.origem_dados');
    return t as unknown as Par2357Ticket;
  });
  return {
    items: parsedItems,
    total, page, page_size: pageSize,
    has_next: data.has_next, source, generated_at: generatedAt,
    limitations: data.limitations as string[],
  };
}

const statusMap: Record<Par2357Ticket['status'], TicketStatus> = {
  1: 'novo',
  2: 'em_atendimento',
  3: 'planejado',
  4: 'pendente',
  5: 'solucionado',
  6: 'fechado',
};

const priorityMap: Record<Par2357Ticket['prioridade'], GLPIPriority | null> = {
  1: 'muito_baixa',
  2: 'baixa',
  3: 'media',
  4: 'alta',
  5: 'muito_alta',
  // Backend 'MAJOR' (6) lacks a matching UI GLPIPriority type.
  6: null,
};

export function toVerifiedTicketIdentity(ticket: Par2357Ticket): TicketDisplayIdentity {
  return {
    id: ticket.id,
    title: ticket.titulo,
    status: statusMap[ticket.status],
    priorityGLPI: priorityMap[ticket.prioridade],
    source: ticket.origem_dados,
    rawStatus: ticket.status,
    rawPriority: ticket.prioridade,
  };
}

export interface Par2357Overview {
  source: string;
  availability_status: 'AVAILABLE' | 'UNAVAILABLE' | string;
  reference_date: string;
  reference_timezone: string;
  limitations: string[];
  indicadores_gerais?: unknown;
  indicadores_acompanhamento?: unknown;
  [field: string]: unknown;
}

export function parsePar2357Overview(payload: unknown): Par2357Overview {
  const data = record(payload, 'overview');
  nonempty(data.source, 'source');
  const availability = nonempty(data.availability_status, 'availability_status');
  timestamp(data.reference_date, 'reference_date');
  nonempty(data.reference_timezone, 'reference_timezone');
  if (!Array.isArray(data.limitations) || !data.limitations.every(x => typeof x === 'string')) {
    throw new InvalidPar2357Payload('Invalid limitations');
  }
  if (availability !== 'AVAILABLE' && (data.indicadores_gerais != null || data.indicadores_acompanhamento != null)) {
    throw new InvalidPar2357Payload('Unreliable metrics on unavailable overview');
  }
  return data as unknown as Par2357Overview;
}

/** Wire response of GET /v1/auth/me (backend/api/main.py). */
export interface Par2357Session {
  status: 'authenticated';
  user_id: string;
  username: string;
  full_name: string;
  roles: string[];
  permissions: string[];
  csrf_token: string | null;
  must_change_password: false;
  auth_transport: 'cookie';
}

/**
 * Preview pages only accept an authenticated server cookie session with
 * READ_OPERATIONAL (or ADMIN), never the client's MOCK_USERS identity.
 */
export function parsePar2357Session(payload: unknown): Par2357Session {
  const data = record(payload, 'auth/me');
  if (data.status !== 'authenticated') throw new InvalidPar2357Payload('Session not authenticated');
  nonempty(data.user_id, 'auth.user_id');
  nonempty(data.username, 'auth.username');
  nonempty(data.full_name, 'auth.full_name');
  if (!Array.isArray(data.roles) || !data.roles.every(v => typeof v === 'string')) {
    throw new InvalidPar2357Payload('Invalid auth.roles');
  }
  if (!Array.isArray(data.permissions) || !data.permissions.every(v => typeof v === 'string')) {
    throw new InvalidPar2357Payload('Invalid auth.permissions');
  }
  if (!data.permissions.includes('READ_OPERATIONAL') && !data.permissions.includes('ADMIN')) {
    throw new InvalidPar2357Payload('Session lacks operational read permission');
  }
  if (data.must_change_password !== false) {
    throw new InvalidPar2357Payload('Password change required');
  }
  // This is explicitly a browser cookie-auth preview, not bearer auth or
  // unsigned development-preview identity.
  if (data.auth_transport !== 'cookie') {
    throw new InvalidPar2357Payload('Cookie session required for browser preview');
  }
  if (data.csrf_token !== null && typeof data.csrf_token !== 'string') {
    throw new InvalidPar2357Payload('Invalid auth.csrf_token');
  }
  return data as unknown as Par2357Session;
}
