/**
 * PAR2357 read-only HTTP transport boundary.
 *
 * Deliberately disabled by default: this module DOES NOT replace mock data,
 * claim DTO compatibility, or enable any hospital connection.
 * Runtime payloads remain unknown until a backend DTO contract is validated.
 */
export type PortalReadEndpoint =
  | '/health'
  | '/v1/auth/me'
  | '/v1/indicators/overview'
  | '/v1/tickets'
  | '/v1/operations/daily'
  | '/v1/operations/panels/history';

export interface PortalApiOptions {
  /** Explicit opt-in; false is the safe default. */
  enabled?: boolean;
  /** Empty means same-origin, e.g. '/v1/tickets'. No automatic discovery. */
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export interface TicketPageQuery {
  page?: number;
  page_size?: number;
  status?: string;
  technician_id?: number;
  group_id?: number;
  categoria_id?: number;
}

export interface OverviewQuery {
  mode?: 'SNAPSHOT_04H' | 'REALTIME';
}

export class PortalApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string,
    message: string,
  ) {
    super(message);
    this.name = 'PortalApiError';
  }
}

function positiveInt(value: number, field: string, maximum?: number): number {
  if (!Number.isSafeInteger(value) || value < 1 || (maximum !== undefined && value > maximum)) {
    throw new TypeError(`Invalid ${field}`);
  }
  return value;
}

function ticketId(value: number | string): string {
  const normalized = String(value);
  if (!/^[1-9][0-9]*$/.test(normalized)) {
    throw new TypeError('Invalid ticket ID');
  }
  return normalized;
}

function endpointUrl(baseUrl: string, path: string, query?: URLSearchParams): string {
  // The base may be an absolute API origin or a local reverse-proxy prefix.
  const base = baseUrl.replace(/\/$/, '');
  const url = `${base}${path}`;
  return query && query.size > 0 ? `${url}?${query.toString()}` : url;
}

export function createPortalApiClient(options: PortalApiOptions = {}) {
  const enabled = options.enabled === true;
  const baseUrl = options.baseUrl ?? '';
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;

  async function get(path: string, query?: URLSearchParams): Promise<unknown> {
    if (!enabled) {
      throw new PortalApiError(0, path, 'PAR2357 API connection is disabled');
    }
    if (!fetchImpl) {
      throw new PortalApiError(0, path, 'Fetch is unavailable');
    }

    const response = await fetchImpl(endpointUrl(baseUrl, path, query), {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      redirect: 'error',
    });

    if (!response.ok) {
      // Do not include response bodies or cookies in errors/logs.
      throw new PortalApiError(response.status, path, `Portal API returned HTTP ${response.status}`);
    }
    const type = response.headers.get('content-type') ?? '';
    if (!type.toLowerCase().includes('application/json')) {
      throw new PortalApiError(response.status, path, 'Portal API returned a non-JSON response');
    }
    try {
      return await response.json() as unknown;
    } catch {
      throw new PortalApiError(response.status, path, 'Portal API returned invalid JSON');
    }
  }

  return {
    getHealth: () => get('/health'),
    getCurrentUser: () => get('/v1/auth/me'),
    getOverview: (query: OverviewQuery = {}) => {
      const p = new URLSearchParams();
      if (query.mode) p.set('mode', query.mode);
      return get('/v1/indicators/overview', p);
    },
    listTickets: (query: TicketPageQuery = {}) => {
      const p = new URLSearchParams();
      if (query.page !== undefined) p.set('page', String(positiveInt(query.page, 'page')));
      if (query.page_size !== undefined) p.set('page_size', String(positiveInt(query.page_size, 'page_size', 100)));
      if (query.status) p.set('status', query.status);
      if (query.technician_id !== undefined) p.set('technician_id', String(positiveInt(query.technician_id, 'technician_id')));
      if (query.group_id !== undefined) p.set('group_id', String(positiveInt(query.group_id, 'group_id')));
      if (query.categoria_id !== undefined) p.set('categoria_id', String(positiveInt(query.categoria_id, 'categoria_id')));
      return get('/v1/tickets', p);
    },
    getTicket: (id: number | string) => get(`/v1/tickets/${ticketId(id)}`),
    getTicketTimeline: (id: number | string) => get(`/v1/tickets/${ticketId(id)}/timeline`),
    getTicketUpdates: (id: number | string) => get(`/v1/tickets/${ticketId(id)}/updates`),
    getDailyOperations: () => get('/v1/operations/daily'),
    getPanelsHistory: () => get('/v1/operations/panels/history'),
  };
}

export type PortalApiClient = ReturnType<typeof createPortalApiClient>;
