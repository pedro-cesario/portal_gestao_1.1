/**
 * PAR2357 isolated executive overview. Explicit opt-in only.
 *
 * No data is inferred from mock tickets, and no aggregate is computed from a
 * single page. No access to real GLPI is permitted by this preview.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { createPortalApiClient, PortalApiError } from '../../integrations/portalApiClient';
import type { Par2357TicketPage, Par2357Overview } from '../../integrations/par2357Dtos';

type Summary = {
  tickets: Par2357TicketPage;
  indicators: Par2357Overview | null;
  indicatorsNotice: string | null;
};

function formatCount(value: unknown): string {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
    ? value.toLocaleString('pt-BR')
    : 'Indisponível';
}

function apiError(error: unknown): string {
  if (error instanceof PortalApiError && [401, 403].includes(error.status)) return 'A sessão não está autenticada ou não tem permissão.';
  if (error instanceof PortalApiError && error.status === 503) return 'Serviço indisponível; os dados não serão substituídos por números de demonstração.';
  return 'Não foi possível validar os dados do backend sintético.';
}

export function Par2357OverviewPreviewView({ baseUrl = '' }: { baseUrl?: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const load = useCallback(async (signal: AbortSignal) => {
    setSummary(null);
    setError(null);
    setLoading(true);
    try {
      const api = createPortalApiClient({ enabled: true, baseUrl });
      // The account shown in the prototype sidebar is not an API session.
      await api.getCurrentUser();
      if (signal.aborted) return;
      const tickets = await api.getValidatedTicketPage({ page: 1, page_size: 6 });
      if (tickets.source !== 'SYNTHETIC_DEMO' ||
          tickets.items.some(t => t.origem_dados !== 'SYNTHETIC_DEMO')) {
        throw new Error('Non-synthetic ticket source');
      }
      if (signal.aborted) return;
      let indicators: Par2357Overview | null = null;
      let indicatorsNotice: string | null = null;
      try {
        const response = await api.getValidatedOverview({ mode: 'SNAPSHOT_04H' });
        if (response.source !== 'SYNTHETIC_DEMO') {
          indicatorsNotice = 'Indicadores sem fonte sintética confirmada; valores não exibidos.';
        } else if (response.availability_status !== 'AVAILABLE') {
          indicatorsNotice = response.limitations.join('; ') || 'Indicadores indisponíveis.';
        } else {
          indicators = response;
        }
      } catch {
        indicatorsNotice = 'Indicadores não puderam ser validados; chamados preservados.';
      }
      if (!signal.aborted) setSummary({ tickets, indicators, indicatorsNotice });
    } catch (cause) {
      if (!signal.aborted) setError(apiError(cause));
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, revision]);

  const focus = summary?.tickets.items.find(t => t.id === selected);

  return (
    <div className="w-full h-full flex flex-col gap-3 p-3 sm:p-4 overflow-hidden">
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3 shrink-0 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold">Visão Geral — PAR2357</h2>
          <p className="text-xs text-slate-500">Prévia executiva sintética · detalhe somente ao clicar</p>
        </div>
        <button type="button" className="rounded border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold"
          onClick={() => setRevision(v => v + 1)}>Atualizar</button>
      </div>

      {loading ? <div role="status" className="p-4 text-sm text-slate-500">Validando sessão e carregando dados sintéticos…</div>
      : error ? <div role="alert" className="p-4 rounded border text-rose-700 bg-white dark:bg-slate-900 text-sm">{error}</div>
      : summary && <>
        <section aria-label="Síntese executiva" className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xs text-slate-500">Chamados na fonte sintética</div>
            <strong className="block text-2xl font-mono mt-1">{formatCount(summary.tickets.total)}</strong>
            <div className="text-xs text-slate-500">Total reportado pelo endpoint, sem estimativa</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xs text-slate-500">Concluídos hoje</div>
            <strong className="block text-2xl font-mono mt-1">{formatCount(summary.indicators?.total_concluidos_hoje)}</strong>
            <div className="text-xs text-slate-500">Somente com fonte e disponibilidade confirmadas</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="text-xs text-slate-500">Concluídos em 30 dias</div>
            <strong className="block text-2xl font-mono mt-1">{formatCount(summary.indicators?.total_concluidos_periodo_30d)}</strong>
            <div className="text-xs text-slate-500">Não representa SLA nem tempo médio</div>
          </div>
        </section>
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex-1 min-h-0 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 items-center justify-between text-xs">
            <strong>Chamados — amostra da página 1</strong>
            <span className="rounded px-2 py-1 bg-slate-100 dark:bg-slate-800">SYNTHETIC_DEMO</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 overflow-auto flex-1 min-h-0">
            {summary.tickets.items.map(ticket => (
              <button key={ticket.id} type="button" onClick={() => setSelected(ticket.id)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-left hover:border-blue-400">
                <div className="font-mono font-bold text-blue-700 dark:text-blue-400 text-xs">#{ticket.id}</div>
                <div className="text-sm font-semibold line-clamp-2 mt-1">{ticket.titulo}</div>
                <div className="text-xs text-slate-500 mt-2">Status GLPI: {ticket.status_label || ticket.status}</div>
                <div className="text-xs text-blue-700 dark:text-blue-400 mt-2">Ver detalhes</div>
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500">
            Referência: {summary.tickets.generated_at} · {summary.tickets.items.length} itens exibidos
          </div>
          {summary.indicatorsNotice && <div className="text-xs text-amber-700" role="status">{summary.indicatorsNotice}</div>}
          {summary.tickets.limitations.length > 0 &&
            <div className="text-xs text-amber-700">{summary.tickets.limitations.join('; ')}</div>}
        </section>
      </>}
      {focus && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end" onClick={() => setSelected(null)} role="presentation">
          <section aria-modal="true" role="dialog" aria-label={`Chamado ${focus.id}`}
            onClick={event => event.stopPropagation()}
            className="h-full w-full max-w-lg bg-white dark:bg-slate-900 p-5 overflow-auto">
            <div className="flex justify-between items-center gap-3 mb-4">
              <strong>Chamado #{focus.id}</strong>
              <button type="button" className="border rounded px-2 py-1" onClick={() => setSelected(null)}>Fechar</button>
            </div>
            <h3 className="font-semibold mb-3">{focus.titulo}</h3>
            <dl className="text-sm space-y-3">
              <div><dt className="text-slate-500">Status</dt><dd>{focus.status_label || focus.status}</dd></div>
              <div><dt className="text-slate-500">Prioridade</dt><dd>{focus.prioridade_label || focus.prioridade}</dd></div>
              <div><dt className="text-slate-500">Abertura</dt><dd>{focus.data_abertura}</dd></div>
              <div><dt className="text-slate-500">Origem</dt><dd>{focus.origem_dados}</dd></div>
              {focus.descricao && <div><dt className="text-slate-500">Descrição</dt><dd className="whitespace-pre-wrap">{focus.descricao}</dd></div>}
            </dl>
            <p className="mt-6 text-xs text-slate-500">Ações humanas, regras POP, impacto assistencial e prioridade gerencial não são inferidos.</p>
          </section>
        </div>
      )}
    </div>
  );
}
