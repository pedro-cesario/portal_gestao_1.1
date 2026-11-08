/**
 * PAR2357 opt-in tickets preview.
 * Uses the existing executive cards styling but never fills unsupported
 * managerial, clinical-impact or human-action fields with invented values.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { createPortalApiClient, PortalApiError } from '../../integrations/portalApiClient';
import {
  type Par2357Ticket,
  type Par2357TicketPage,
  toVerifiedTicketIdentity,
} from '../../integrations/par2357Dtos';

const PAGE_SIZE = 6;

interface Props {
  baseUrl?: string;
  initialTicketId?: number | null;
  onClearInitialTicketId?: () => void;
}

function humanError(error: unknown): string {
  if (error instanceof PortalApiError) {
    if (error.status === 401 || error.status === 403) return 'Sessão não autenticada ou sem permissão para consultar chamados.';
    if (error.status === 503) return 'Fonte de chamados indisponível. Nenhum número foi estimado.';
  }
  return 'Não foi possível validar os chamados retornados pela API.';
}

function titleSource(source: string): string {
  return source === 'SYNTHETIC_DEMO' ? 'DEMONSTRAÇÃO SINTÉTICA' : source;
}

function categoryName(item: Par2357Ticket): string {
  return typeof item.categoria_nome === 'string' && item.categoria_nome.trim()
    ? item.categoria_nome
    : 'Categoria não informada';
}

export function Par2357TicketsPreviewView({
  baseUrl = '',
  initialTicketId,
  onClearInitialTicketId,
}: Props) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Par2357TicketPage | null>(null);
  const [selected, setSelected] = useState<Par2357Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);

  const load = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const api = createPortalApiClient({ enabled: true, baseUrl });
      // Always verify the actual server session. MOCK_USERS are NOT authentication.
      await api.getCurrentUser();
      if (signal.aborted) return;
      const result = await api.getValidatedTicketPage({ page, page_size: PAGE_SIZE });
      if (signal.aborted) return;
      // This preview is an exclusively synthetic homologation surface.
      // It must not render live hospital tickets without a separate release gate.
      if (result.source !== 'SYNTHETIC_DEMO' || result.items.some(item => item.origem_dados !== 'SYNTHETIC_DEMO')) {
        throw new Error('Non-synthetic source is not authorized in the preview');
      }
      setData(result);
    } catch (cause) {
      if (!signal.aborted) setError(humanError(cause));
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [baseUrl, page]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, revision]);

  useEffect(() => {
    if (initialTicketId) {
      // Existing dashboard uses mock IDs. Never silently equate them to GLPI IDs.
      onClearInitialTicketId?.();
    }
  }, [initialTicketId, onClearInitialTicketId]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-4 overflow-hidden gap-3">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Chamados — Consulta PAR2357</h2>
            <p className="text-xs text-slate-500">Prévia exclusivamente sintética; os demais módulos permanecem em demonstração.</p>
          </div>
          <button
            type="button"
            onClick={() => setRevision(value => value + 1)}
            className="px-3 py-1.5 border rounded-lg text-xs font-semibold border-slate-200 dark:border-slate-700"
          >
            Atualizar
          </button>
        </div>
        {data && (
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 font-semibold">{titleSource(data.source)}</span>
            <span className="text-slate-500">Referência: {data.generated_at}</span>
            {data.limitations.length > 0 && <span className="text-amber-700">Limitações: {data.limitations.join('; ')}</span>}
          </div>
        )}
      </div>

      {loading ? (
        <div role="status" className="p-4 text-sm text-slate-500">Validando sessão e carregando chamados…</div>
      ) : error ? (
        <div role="alert" className="p-4 border rounded-lg bg-white dark:bg-slate-900 text-sm text-rose-700">
          {error}
          <p className="text-xs mt-1">A consulta não foi substituída por dados fictícios.</p>
        </div>
      ) : data?.items.length === 0 ? (
        <div className="p-4 text-sm text-slate-500">Nenhum chamado encontrado nesta página.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 flex-1 min-h-0 overflow-auto">
          {data?.items.map(ticket => {
            const identity = toVerifiedTicketIdentity(ticket);
            return (
              <button
                type="button"
                key={ticket.id}
                onClick={() => setSelected(ticket)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-left shadow-xs hover:border-blue-400 transition-colors flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-400">#{ticket.id}</span>
                  <span className="text-xs rounded bg-slate-100 dark:bg-slate-800 px-2 py-1">{ticket.status_label || identity.status}</span>
                </div>
                <strong className="text-sm line-clamp-2">{identity.title}</strong>
                <span className="text-xs text-slate-500">{categoryName(ticket)}</span>
                <div className="mt-auto flex items-center justify-between gap-2 text-xs">
                  <span>Prioridade: {ticket.prioridade_label || `GLPI ${ticket.prioridade}`}</span>
                  <span className="text-blue-700 dark:text-blue-400 font-semibold">Ver detalhes</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {data && !error && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center justify-between text-xs shrink-0">
          <span>Mostrando {data.items.length} de {data.total} chamados · Página {data.page} de {totalPages}</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={loading || page <= 1} onClick={() => { setSelected(null); setPage(v => Math.max(1, v - 1)); }}
              className="border rounded px-2 py-1 disabled:opacity-40">Anterior</button>
            <button type="button" disabled={loading || !data.has_next} onClick={() => { setSelected(null); setPage(v => v + 1); }}
              className="border rounded px-2 py-1 disabled:opacity-40">Próxima</button>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" role="presentation" onClick={() => setSelected(null)}>
          <section role="dialog" aria-modal="true" aria-label={`Detalhes do chamado ${selected.id}`}
            onClick={event => event.stopPropagation()}
            className="bg-white dark:bg-slate-900 w-full max-w-lg h-full p-5 overflow-auto shadow-xl">
            <div className="flex justify-between items-center gap-3 mb-4">
              <h2 className="font-bold">Chamado #{selected.id}</h2>
              <button type="button" onClick={() => setSelected(null)} className="border rounded px-2 py-1 text-sm">Fechar</button>
            </div>
            <h3 className="font-semibold mb-3">{selected.titulo}</h3>
            <dl className="text-sm space-y-3">
              <div><dt className="text-slate-500">Status GLPI</dt><dd>{selected.status_label || selected.status}</dd></div>
              <div><dt className="text-slate-500">Prioridade GLPI</dt><dd>{selected.prioridade_label || selected.prioridade}</dd></div>
              <div><dt className="text-slate-500">Categoria</dt><dd>{categoryName(selected)}</dd></div>
              <div><dt className="text-slate-500">Abertura</dt><dd>{selected.data_abertura}</dd></div>
              <div><dt className="text-slate-500">Origem</dt><dd>{selected.origem_dados}</dd></div>
              {selected.descricao && <div><dt className="text-slate-500">Descrição</dt><dd className="whitespace-pre-wrap">{selected.descricao}</dd></div>}
            </dl>
            <p className="text-xs text-slate-500 mt-6">
              Ação humana, impacto clínico, prioridade gerencial e evidências exigem contratos próprios; não foram inferidos.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
