/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Auditorias & Snapshots 04h
 * Utilização dinâmica de tela sem espaços ociosos, tipografia padronizada e zero scroll
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Play, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Info,
  RefreshCw,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';
import { AuditSnapshot } from '../../types';
import { DetailDrawer } from '../common/DetailDrawer';

interface AuditsViewProps {
  audits: AuditSnapshot[];
  onTriggerManualAudit: () => void;
  isAuditing: boolean;
}

export const AuditsView: React.FC<AuditsViewProps> = ({
  audits,
  onTriggerManualAudit,
  isAuditing
}) => {
  const [selectedAudit, setSelectedAudit] = useState<AuditSnapshot | null>(null);
  const latest = audits[0];
  const previous = audits[1];

  const [auditPage, setAuditPage] = useState<1 | 2>(1);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const historyPageSize = 4;
  const totalHistoryPages = Math.ceil(audits.length / historyPageSize) || 1;
  const paginatedAudits = audits.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize);

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-4 overflow-hidden gap-3">
      {/* BARRA SUPERIOR COM CONTROLE DE PÁGINAS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Auditorias & Snapshots Diários (04h00)
              </h2>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Total de Registros: {audits.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Garantia de integridade documental e conferência contínua das regras POP-TIN-017
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Seletor de Página */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setAuditPage(1)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                auditPage === 1
                  ? 'bg-white dark:bg-slate-900 text-[#134F9F] dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pág. 1: Snapshot Oficial 04h
            </button>
            <button
              type="button"
              onClick={() => setAuditPage(2)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                auditPage === 2
                  ? 'bg-white dark:bg-slate-900 text-[#134F9F] dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pág. 2: Histórico de Auditorias
            </button>
          </div>

          <button
            type="button"
            onClick={onTriggerManualAudit}
            disabled={isAuditing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAuditing ? 'Auditando...' : 'Auditoria Manual'}</span>
            <span className="sm:hidden">Auditar</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PÁGINA 1: SNAPSHOT CANÔNICO DAS 04H & ANÁLISE COMPARATIVA */}
      {/* ========================================================= */}
      {auditPage === 1 ? (
        <div className="flex-1 min-h-0 flex flex-col justify-between gap-3 overflow-hidden">
          {/* NÍVEL 1 SINTÉTICO: CARTÃO EXECUTIVO DO SNAPSHOT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 sm:p-4 space-y-3 shadow-xs shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                  Snapshot Canônico Oficial
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {latest.timestamp}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Agendamento Diário às 04h00</span>
            </div>

            {/* 4 Métricas do Snapshot com Tipografia Padronizada */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 block font-semibold">Chamados Avaliados</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-slate-50 mt-1 block leading-none">
                  {latest.totalTicketsEvaluated}
                </span>
                <span className="text-xs text-slate-500 font-mono mt-1.5 block">
                  {previous ? `vs ${previous.totalTicketsEvaluated} no snapshot anterior` : 'Conformidade ativa'}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 block font-semibold">Novas Pendências</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-500 mt-1 block leading-none">
                  +{latest.newPendingsCount}
                </span>
                <span className="text-xs text-amber-600/90 dark:text-amber-400 font-medium mt-1.5 block">Requerem triagem operacional</span>
              </div>

              <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 block font-semibold">Persistentes (&gt;24h)</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-500 mt-1 block leading-none">
                  {latest.persistentPendingsCount}
                </span>
                <span className="text-xs text-rose-600/90 dark:text-rose-400 font-medium mt-1.5 block">Sem evolução humana observável</span>
              </div>

              <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 block font-semibold">Resolvidas c/ Evidência</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-500 mt-1 block leading-none">
                  {latest.resolvedWithEvidenceCount}
                </span>
                <span className="text-xs text-emerald-600/90 dark:text-emerald-400 font-medium mt-1.5 block">Aderentes ao POP-TIN-017</span>
              </div>
            </div>

            {/* Limitações Técnicas & Rastreabilidade */}
            <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 dark:text-slate-100">Rastreabilidade e Limitações:</strong> {latest.limitations}
              </div>
            </div>
          </div>

          {/* COMPARAÇÃO DOS ÚLTIMOS SNAPSHOTS COM DISTRIBUIÇÃO DINÂMICA DO ESPAÇO */}
          <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 sm:p-4 flex flex-col justify-between shadow-xs">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-500" />
                  Evolução Recente de Snapshots & Rastreabilidade
                </span>
                <span className="text-xs text-slate-400 font-mono">Últimas 48 horas consolidadas</span>
              </div>

              {/* Lista Dinâmica de Snapshots ocupando a área vertical confortavelmente */}
              <div className="flex-1 flex flex-col justify-between gap-2.5 overflow-hidden">
                {audits.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAudit(item)}
                    className="p-3 sm:p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-2xs hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {item.type === 'SNAPSHOT_04H' ? '04h' : 'MAN'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm block truncate">
                            {item.timestamp}
                          </span>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {item.auditor} · Avaliados: <strong className="text-slate-700 dark:text-slate-200 font-mono">{item.totalTicketsEvaluated} chamados</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-3 text-xs sm:text-sm font-mono font-semibold">
                        <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">+{item.newPendingsCount} novas</span>
                        <span className="text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">{item.persistentPendingsCount} persistentes</span>
                        <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{item.resolvedWithEvidenceCount} ok</span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#134F9F] dark:text-blue-400 group-hover:underline flex items-center gap-1">
                        <span>Ver</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Regras POP-TIN-017 homologadas e validadas automaticamente</span>
              <button
                type="button"
                onClick={() => setAuditPage(2)}
                className="font-semibold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Ver Histórico Completo de Auditorias (Página 2)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* PÁGINA 2: HISTÓRICO COMPLETO COM PAGINAÇÃO SEM SCROLL     */
        /* ========================================================= */
        <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 sm:p-4 flex flex-col justify-between shadow-xs overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#134F9F] dark:text-blue-400" />
                  Histórico de Auditorias & Trilhas de Evidências
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Clique em qualquer registro para auditar hashes e detalhes técnicos
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-slate-400 font-semibold">
                  Página {historyPage} de {totalHistoryPages}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={historyPage <= 1}
                    onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={historyPage >= totalHistoryPages}
                    onClick={() => setHistoryPage(p => Math.min(totalHistoryPages, p + 1))}
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Lista Paginada de Auditorias com Distribuição Dinâmica */}
            <div className="flex-1 flex flex-col justify-between gap-2.5 overflow-hidden">
              {paginatedAudits.map((audit) => (
                <div
                  key={audit.id}
                  onClick={() => setSelectedAudit(audit)}
                  className="p-3.5 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      audit.type === 'SNAPSHOT_04H' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {audit.type === 'SNAPSHOT_04H' ? '04h' : 'MAN'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block truncate">
                          {audit.timestamp}
                        </span>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {audit.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                        Executor: <strong className="text-slate-700 dark:text-slate-300">{audit.auditor}</strong> · Chamados auditados: <strong className="text-slate-800 dark:text-slate-200 font-mono">{audit.totalTicketsEvaluated}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:flex items-center gap-3 text-xs sm:text-sm font-mono font-semibold">
                      <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">+{audit.newPendingsCount} novas</span>
                      <span className="text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">{audit.persistentPendingsCount} persistentes</span>
                      <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{audit.resolvedWithEvidenceCount} ok</span>
                    </div>

                    <span className="text-xs sm:text-sm text-[#134F9F] dark:text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
                      <span>Abrir Trilha</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400">Total de {audits.length} auditorias arquivadas na base</span>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalHistoryPages }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setHistoryPage(idx + 1)}
                  className={`w-7 h-7 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    historyPage === idx + 1
                      ? 'bg-[#134F9F] text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RODAPÉ DE NAVEGAÇÃO DE PÁGINAS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 sm:p-3 flex items-center justify-between text-xs sm:text-sm shrink-0 shadow-2xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Auditoria oficial contida sem rolagem vertical
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAuditPage(1)}
            disabled={auditPage === 1}
            className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            ← Página 1: Snapshot Oficial
          </button>

          <span className="font-mono text-xs sm:text-sm font-bold text-[#134F9F] dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">
            Pág. {auditPage} de 2
          </span>

          <button
            type="button"
            onClick={() => setAuditPage(2)}
            disabled={auditPage === 2}
            className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Página 2: Histórico Completo →
          </button>
        </div>
      </div>

      {/* DRAWER DE TRILHA ANALÍTICA DA AUDITORIA */}
      {selectedAudit && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedAudit(null)}
          title={`Auditoria ${selectedAudit.timestamp}`}
          subtitle={`Tipo: ${selectedAudit.type} · Executor: ${selectedAudit.auditor}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Regras Institucionais Validadas
              </span>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 font-mono text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                {selectedAudit.rulesEvaluated.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-slate-400 text-xs block font-medium">Novas Pendências</span>
                <span className="text-2xl font-bold font-mono text-amber-500 mt-1 block">+{selectedAudit.newPendingsCount}</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-slate-400 text-xs block font-medium">Resolvidas com Evidência</span>
                <span className="text-2xl font-bold font-mono text-emerald-500 mt-1 block">{selectedAudit.resolvedWithEvidenceCount}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                Limitações Técnicas Declaradas
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                {selectedAudit.limitations}
              </p>
            </div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
};
