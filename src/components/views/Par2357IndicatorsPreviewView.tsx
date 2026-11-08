/**
 * Isolated, synthetic-only PAR2357 indicators preview.
 * Displays only confirmed backend envelope fields. Never inherits demo KPIs
 * as real observations or manufactures POP/SLA metrics.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { createPortalApiClient, PortalApiError, type OverviewQuery } from '../../integrations/portalApiClient';
import { type Par2357Overview } from '../../integrations/par2357Dtos';

type Mode = NonNullable<OverviewQuery['mode']>;

function problem(error: unknown): string {
  if (error instanceof PortalApiError && (error.status === 401 || error.status === 403)) {
    return 'A sessão não possui autorização para indicadores.';
  }
  if (error instanceof PortalApiError && error.status === 503) {
    return 'O backend informou indisponibilidade. Não há métricas substitutas.';
  }
  return 'Não foi possível validar a resposta dos indicadores.';
}

function metric(value: unknown): string {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && Number.isSafeInteger(value)
    ? value.toLocaleString('pt-BR')
    : 'Não disponível';
}

export function Par2357IndicatorsPreviewView({ baseUrl = '' }: { baseUrl?: string }) {
  const [mode, setMode] = useState<Mode>('SNAPSHOT_04H');
  const [data, setData] = useState<Par2357Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const [details, setDetails] = useState(false);

  const load = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setData(null);
    setError(null);
    try {
      const api = createPortalApiClient({ enabled: true, baseUrl });
      await api.getCurrentUser();
      if (signal.aborted) return;
      const overview = await api.getValidatedOverview({ mode });
      if (signal.aborted) return;
      if (overview.source !== 'SYNTHETIC_DEMO') {
        throw new Error('Non-synthetic indicators source is forbidden in preview');
      }
      setData(overview);
    } catch (cause) {
      if (!signal.aborted) setError(problem(cause));
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [baseUrl, mode]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, revision]);

  const available = data?.availability_status === 'AVAILABLE';
  const cards = [
    { label: 'Concluídos hoje', value: available ? metric(data?.total_concluidos_hoje) : 'Não disponível' },
    { label: 'Concluídos no período (30d)', value: available ? metric(data?.total_concluidos_periodo_30d) : 'Não disponível' },
    { label: 'Situação da fonte', value: data?.availability_status || 'Não disponível' },
  ];

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-4 gap-3 overflow-hidden">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="font-bold text-sm sm:text-base">Indicadores — Prévia sintética PAR2357</h2>
          <p className="text-xs text-slate-500">Dados verificados do backend; sem métricas inventadas ou SLA.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="par2357-indicator-mode" className="font-semibold">Fonte</label>
          <select id="par2357-indicator-mode" value={mode}
            onChange={event => setMode(event.target.value as Mode)}
            className="border rounded-md p-1.5 bg-white dark:bg-slate-900 dark:border-slate-700">
            <option value="SNAPSHOT_04H">Snapshot 04h</option>
            <option value="REALTIME">Tempo real</option>
          </select>
          <button onClick={() => setRevision(x => x + 1)} type="button" className="border rounded-md px-3 py-1.5">Atualizar</button>
        </div>
      </div>
      {loading ? (
        <div role="status" className="p-4 text-sm text-slate-500">Verificando sessão e indicadores…</div>
      ) : error ? (
        <div role="alert" className="border bg-white dark:bg-slate-900 rounded-lg p-4 text-sm text-rose-700">
          {error} Nenhum indicador fictício foi utilizado como substituto.
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
            {cards.map(card => (
              <div key={card.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500">{card.label}</div>
                <div className="mt-2 text-xl font-bold font-mono">{card.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div><strong>Origem:</strong> {data.source}</div>
            <div><strong>Data de referência:</strong> {data.reference_date}</div>
            <div><strong>Fuso informado:</strong> {data.reference_timezone}</div>
            {Array.isArray(data.limitations) && data.limitations.length > 0 && (
              <div className="text-amber-700"><strong>Limitações:</strong> {data.limitations.join('; ')}</div>
            )}
            <button type="button" onClick={() => setDetails(x => !x)}
              className="text-blue-700 dark:text-blue-400 font-semibold underline underline-offset-2">
              {details ? 'Ocultar detalhamento' : 'Ver disponibilidade analítica'}
            </button>
            {details && (
              <div className="border-t pt-3 mt-3 space-y-1 dark:border-slate-700">
                <div>Indicadores gerais: {available && data.indicadores_gerais != null ? 'Resposta presente; contrato analítico ainda não validado para visualização' : 'Não disponível'}</div>
                <div>Indicadores de acompanhamento: {available && data.indicadores_acompanhamento != null ? 'Resposta presente; contrato analítico ainda não validado para visualização' : 'Não disponível'}</div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
