/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Pendências & Backlog Canônico (POP-TIN-017)
 * REPENSAÇÃO COMPLETA: ZERO CLIPPING, UTILIZAÇÃO DINÂMICA DO ESPAÇO
 * 1. Modo Painel de Triage (Master-Detail): Fila à esquerda + Dossier completo de auditoria à direita
 * 2. Modo Grade 2x2 Balanceada: Cards amplos sem orfãos, sem truncamento e sem scroll vertical
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  History, 
  ExternalLink,
  Maximize2,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  Columns,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { PendingItem, CanonicalPendingStatus } from '../../types';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { DetailDrawer } from '../common/DetailDrawer';
import { Modal } from '../common/Modal';

interface PendingsViewProps {
  pendings: PendingItem[];
  onOpenTicket: (ticketId: number) => void;
  popVersion?: string;
}

export const PendingsView: React.FC<PendingsViewProps> = ({
  pendings,
  onOpenTicket,
  popVersion = 'v2.4'
}) => {
  // Modo de visualização: 'split' (Master-Detail) ou 'grid' (Grade 2x2 balanceada)
  const [viewMode, setViewMode] = useState<'split' | 'grid'>('split');

  // Item selecionado para o painel de auditoria à direita
  const [selectedPendingId, setSelectedPendingId] = useState<string>(pendings[0]?.id || '');

  // Filtros rápidos
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modais de detalhamento adicional
  const [drawerPending, setDrawerPending] = useState<PendingItem | null>(null);
  const [modalPending, setModalPending] = useState<PendingItem | null>(null);

  // Contadores canônicos
  const counts = useMemo(() => ({
    all: pendings.length,
    NEW: pendings.filter(p => p.status === 'NEW').length,
    PERSISTENT: pendings.filter(p => p.status === 'PERSISTENT').length,
    RESOLVED_WITH_EVIDENCE: pendings.filter(p => p.status === 'RESOLVED_WITH_EVIDENCE').length,
  }), [pendings]);

  // Lista filtrada
  const filtered = useMemo(() => {
    if (statusFilter === 'all') return pendings;
    return pendings.filter(p => p.status === statusFilter);
  }, [pendings, statusFilter]);

  // Item ativo no modo split
  const activePending = useMemo(() => {
    return filtered.find(p => p.id === selectedPendingId) || filtered[0] || pendings[0];
  }, [filtered, selectedPendingId, pendings]);

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-4 overflow-hidden gap-2.5">
      {/* HEADER EXECUTIVO COMPACTO COM FILTROS INTEGRADOS (SUBSTITUI OS 6 CARDS GIGANTES) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs shrink-0">
        {/* Identificação do Backlog */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Backlog Canônico de Não-Conformidades
              </h2>
              <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                POP-TIN-017 {popVersion}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Auditoria contínua de apontamentos técnicos e conformidade GLPI
            </p>
          </div>
        </div>

        {/* Controles de Direita: Segmented Filters + View Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Todas ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('NEW')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'NEW'
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Novas ({counts.NEW})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PERSISTENT')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'PERSISTENT'
                  ? 'bg-amber-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Persistentes &gt;24h ({counts.PERSISTENT})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('RESOLVED_WITH_EVIDENCE')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'RESOLVED_WITH_EVIDENCE'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Resolvidas ({counts.RESOLVED_WITH_EVIDENCE})
            </button>
          </div>

          {/* Toggle de Modo de Exibição */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 font-bold ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-[#134F9F] dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Visão Painel de Triage (Fila + Dossier)"
            >
              <Columns className="w-4 h-4" />
              <span className="hidden sm:inline">Painel Dividido</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 font-bold ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-[#134F9F] dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Visão Grade 2x2 Balanceada"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grade 2×2</span>
            </button>
          </div>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL (100% DINÂMICA E SEM SCROLL VERTICAL) */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Nenhuma não-conformidade neste filtro
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Todos os chamados auditados para esta condição estão em plena conformidade com as regras do POP-TIN-017.
            </p>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className="mt-4 px-4 py-2 bg-[#134F9F] text-white rounded-lg text-xs font-bold hover:bg-blue-800 cursor-pointer"
            >
              Exibir Todos os Registros
            </button>
          </div>
        ) : viewMode === 'split' ? (
          /* ================================================================================== */
          /* MODO 1: PAINEL DE TRIAGE (MASTER-DETAIL) — FILA À ESQUERDA + DOSSIER À DIREITA    */
          /* ================================================================================== */
          <div className="w-full h-full flex flex-col lg:flex-row gap-3 overflow-hidden">
            {/* COLUNA ESQUERDA: FILA DE PENDÊNCIAS COM CARDS SELECIONÁVEIS */}
            <div className="w-full lg:w-[42%] flex flex-col gap-2 min-h-0 overflow-y-auto pr-1">
              {filtered.map(item => {
                const isSelected = item.id === activePending?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPendingId(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#134F9F] dark:border-blue-500 ring-1 ring-blue-500/40'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
                    }`}
                  >
                    {/* Top row: Fingerprint + Status badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 truncate">
                          {item.stableFingerprint}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                          item.status === 'RESOLVED_WITH_EVIDENCE'
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : item.status === 'PERSISTENT'
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                              : 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-[#134F9F] dark:text-blue-400 translate-x-0.5' : 'text-slate-400'}`} />
                    </div>

                    {/* Identificação do Chamado */}
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                        <span className="font-mono text-[#134F9F] dark:text-blue-400 font-bold">#{item.ticketId}</span>
                        <span>·</span>
                        <span className="truncate">{item.groupName}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug">
                        {item.ticketTitle}
                      </h4>
                    </div>

                    {/* Bottom: Evidence Badge + Técnico */}
                    <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                      <EvidenceBadge level={item.evidenceLevel} size="sm" />
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                        Resp: <strong className="text-slate-800 dark:text-slate-200">{item.assignedTechnicianName || 'Sem técnico'}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* COLUNA DIREITA: DOSSIER COMPLETO DE AUDITORIA DO ITEM ATIVO (SEM TRUNCAMENTO E SEM SCROLL) */}
            {activePending && (
              <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                {/* 1. Header do Dossier */}
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                          {activePending.stableFingerprint}
                        </span>
                        <EvidenceBadge level={activePending.evidenceLevel} size="sm" />
                        <span className="text-xs text-slate-500 font-medium">Auditado em {activePending.lastAuditDate}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                        {activePending.ticketTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                        <span className="font-mono font-bold text-[#134F9F] dark:text-blue-400">Chamado #{activePending.ticketId}</span>
                        <span>·</span>
                        <span>Setor: <strong>{activePending.groupName}</strong></span>
                        <span>·</span>
                        <span>Responsável: <strong>{activePending.assignedTechnicianName || 'Não atribuído'}</strong></span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenTicket(activePending.ticketId)}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-[#134F9F] hover:bg-blue-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                      title="Abrir o chamado completo no GLPI"
                    >
                      <span>Abrir no GLPI</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 2. Regra Canônica Violada (Sem Truncamento) */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <FileText className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                        <span>Regra Aplicada do POP-TIN-017:</span>
                      </div>
                      <p className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {activePending.popRule}
                      </p>
                    </div>

                    {/* 3. Descrição e Fundamentação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 bg-white dark:bg-slate-900">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Situação Observada
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {activePending.description}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 bg-white dark:bg-slate-900">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Evidências e Fundamentação Técnica
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {activePending.evidenceNotes}
                        </p>
                      </div>
                    </div>

                    {/* 4. Trilha Canônica de Transições */}
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <History className="w-3.5 h-3.5 text-blue-500" />
                        <span>Trilha de Auditoria Canônica (Snapshots 04h00):</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        {activePending.transitionHistory.map((tr, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 shrink-0">
                              {tr.from} &rarr; {tr.to}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500 shrink-0">{tr.timestamp}:</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{tr.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Ações Rápidas de Resolução no Rodapé do Dossier */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Status Canônico: <strong className="text-slate-900 dark:text-slate-100 font-mono">{activePending.status}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalPending(activePending)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer"
                    >
                      Ampliar Dossier
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenTicket(activePending.ticketId)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#134F9F] hover:bg-blue-800 text-white font-bold cursor-pointer flex items-center gap-1"
                    >
                      <span>Tratar no GLPI</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================================================================================== */
          /* MODO 2: GRADE 2×2 BALANCEADA — CARDS LARGOS, SEM ORFÃOS E SEM SCROLL VERTICAL      */
          /* ================================================================================== */
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-2.5 overflow-hidden">
            {filtered.slice(0, 4).map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedPendingId(item.id);
                  setViewMode('split');
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-[#134F9F] dark:hover:border-blue-500 cursor-pointer transition-all group"
              >
                <div>
                  {/* Header do Card com Fingerprint e Ação */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 truncate">
                        {item.stableFingerprint}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        item.status === 'RESOLVED_WITH_EVIDENCE'
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : item.status === 'PERSISTENT'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                            : 'bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalPending(item);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      title="Visualização ampliada da pendência"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Informações do Chamado */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-bold text-[#134F9F] dark:text-blue-400">#{item.ticketId}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.groupName}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {item.ticketTitle}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Caixa da Regra POP-TIN-017 & Camada de Evidência */}
                  <div className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Classificação de Evidência:
                      </span>
                      <EvidenceBadge level={item.evidenceLevel} size="sm" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.popRule}</span>
                    </div>
                  </div>
                </div>

                {/* Rodapé do Card */}
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] truncate max-w-[200px]">
                    Resp: <strong className="text-slate-800 dark:text-slate-200">{item.assignedTechnicianName || 'Sem técnico'}</strong>
                  </span>

                  <span className="font-bold text-[#134F9F] dark:text-blue-400 group-hover:underline flex items-center gap-1">
                    <span>Ver Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE VISUALIZAÇÃO AMPLIADA DO ITEM */}
      {modalPending && (
        <Modal
          isOpen={true}
          onClose={() => setModalPending(null)}
          title={`Dossier Ampliado — ${modalPending.stableFingerprint}`}
          subtitle={`Auditoria da Regra POP-TIN-017 vinculada ao Chamado #${modalPending.ticketId}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <EvidenceBadge level={modalPending.evidenceLevel} />
                <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                  {modalPending.popRule}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {modalPending.ticketTitle}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {modalPending.description}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                Fundamentação de Auditoria e Evidências Técnicas:
              </h4>
              <p className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {modalPending.evidenceNotes}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalPending(null)}
                className="px-3.5 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md font-semibold cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = modalPending.ticketId;
                  setModalPending(null);
                  onOpenTicket(id);
                }}
                className="px-4 py-1.5 text-white bg-[#134F9F] hover:bg-blue-800 font-bold rounded-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Tratar no GLPI</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
