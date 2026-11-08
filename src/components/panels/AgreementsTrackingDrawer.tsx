/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Drawer Analítico de Acompanhamento de Acordos e Encaminhamentos
 * REGRA: Sintético primeiro, analítico sob demanda.
 * Exibe lista completa, histórico de auditoria, filtros de status (atrasados, pendentes, concluídos)
 * e acordos da reunião anterior.
 */

import React, { useState } from 'react';
import { 
  X, 
  Handshake, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  ExternalLink, 
  ShieldCheck, 
  Plus, 
  Filter, 
  Calendar, 
  ArrowRight,
  RotateCcw,
  Tag,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MeetingAgreement, AgreementStatus, SourceMeetingType, CurrentUser } from '../../types';

interface AgreementsTrackingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agreements: MeetingAgreement[];
  sourceMeetingType: SourceMeetingType;
  meetingReferenceDate?: string;
  onOpenRegisterModal: () => void;
  onUpdateAgreementStatus: (agreementId: string, newStatus: AgreementStatus, note?: string) => void;
  onOpenTicketById?: (ticketId: number) => void;
  currentUser?: CurrentUser | null;
}

export const AgreementsTrackingDrawer: React.FC<AgreementsTrackingDrawerProps> = ({
  isOpen,
  onClose,
  agreements,
  sourceMeetingType,
  meetingReferenceDate = 'Hoje (06/11/2026)',
  onOpenRegisterModal,
  onUpdateAgreementStatus,
  onOpenTicketById,
  currentUser
}) => {
  if (!isOpen) return null;

  const [filterTab, setFilterTab] = useState<'all' | 'current' | 'previous' | 'overdue' | 'pending' | 'completed'>('all');
  const [expandedAgreementId, setExpandedAgreementId] = useState<string | null>(null);

  // Filtragem dos acordos por escopo da reunião (Daily vs Alinhamento)
  const scopedAgreements = agreements.filter(a => a.sourceMeetingType === sourceMeetingType);

  const totalCount = scopedAgreements.length;
  const completedCount = scopedAgreements.filter(a => a.status === 'CONCLUIDO').length;
  const overdueCount = scopedAgreements.filter(a => a.notes?.toLowerCase().includes('atrasad') || (a.status === 'EM_ANDAMENTO' && a.isPreviousMeeting)).length;
  const pendingCount = scopedAgreements.filter(a => a.status === 'CONFIRMADO' || a.status === 'EM_ANDAMENTO' || a.status === 'AGUARDANDO_CONFIRMACAO').length;

  const filteredList = scopedAgreements.filter(a => {
    if (filterTab === 'current') return !a.isPreviousMeeting;
    if (filterTab === 'previous') return a.isPreviousMeeting;
    if (filterTab === 'completed') return a.status === 'CONCLUIDO';
    if (filterTab === 'overdue') return a.notes?.toLowerCase().includes('atrasad') || (a.status === 'EM_ANDAMENTO' && a.isPreviousMeeting);
    if (filterTab === 'pending') return a.status === 'CONFIRMADO' || a.status === 'EM_ANDAMENTO' || a.status === 'AGUARDANDO_CONFIRMACAO';
    return true;
  });

  const getStatusBadge = (status: AgreementStatus) => {
    switch (status) {
      case 'CONCLUIDO':
        return { label: 'Concluído', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
      case 'EM_ANDAMENTO':
        return { label: 'Em Andamento', color: 'bg-blue-500/15 text-[#134F9F] dark:text-blue-400 border-blue-500/30' };
      case 'CONFIRMADO':
        return { label: 'Confirmado', color: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30' };
      case 'AGUARDANDO_CONFIRMACAO':
        return { label: 'Aguardando Gestor', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' };
      case 'CANCELADO':
        return { label: 'Cancelado', color: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30' };
      default:
        return { label: 'Rascunho', color: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30' };
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'decisao':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'tarefa':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'encaminhamento':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'compromisso':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      <div className="w-full max-w-2xl sm:max-w-3xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-250">
        {/* 1. HEADER DO DRAWER */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#134F9F]/10 text-[#134F9F] dark:text-blue-400 border border-[#134F9F]/20">
                {sourceMeetingType === 'DAILY' ? 'Daily Operacional' : 'Alinhamento Semanal'}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {meetingReferenceDate}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              Acompanhamento de Acordos e Encaminhamentos
            </h2>
            <p className="text-xs text-slate-500 truncate">
              Compromissos firmados pela gestão · Rastreabilidade independente do GLPI
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenRegisterModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrar Acordo</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. KPIS SINTÉTICOS DOS ACORDOS NO TOPO */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-4 gap-2 text-center text-xs shrink-0">
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total</span>
            <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100">{totalCount}</span>
          </div>
          <div className="p-2 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold uppercase">Concluídos</span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">{completedCount}</span>
          </div>
          <div className="p-2 rounded bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/60">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 block font-semibold uppercase">Pendentes</span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#134F9F] dark:text-blue-300">{pendingCount}</span>
          </div>
          <div className="p-2 rounded bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-semibold uppercase">Atrasados</span>
            <span className="text-base sm:text-lg font-bold font-mono text-amber-700 dark:text-amber-400">{overdueCount}</span>
          </div>
        </div>

        {/* 3. TABS DE FILTRO */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
              filterTab === 'all'
                ? 'bg-[#134F9F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('current')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
              filterTab === 'current'
                ? 'bg-[#134F9F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Reunião Atual ({scopedAgreements.filter(a => !a.isPreviousMeeting).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('previous')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
              filterTab === 'previous'
                ? 'bg-[#134F9F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Reunião Anterior ({scopedAgreements.filter(a => a.isPreviousMeeting).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('pending')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
              filterTab === 'pending'
                ? 'bg-[#134F9F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Pendentes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('overdue')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
              filterTab === 'overdue'
                ? 'bg-[#134F9F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Atrasados ({overdueCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('completed')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
              filterTab === 'completed'
                ? 'bg-[#134F9F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Concluídos ({completedCount})
          </button>
        </div>

        {/* 4. LISTA DETALHADA DE ACORDOS */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhum acordo encontrado para o filtro selecionado.
            </div>
          ) : (
            filteredList.map(agreement => {
              const statusBadge = getStatusBadge(agreement.status);
              const isOverdue = agreement.notes?.toLowerCase().includes('atrasad') || (agreement.status === 'EM_ANDAMENTO' && agreement.isPreviousMeeting);
              const isExpanded = expandedAgreementId === agreement.agreementId;

              return (
                <div
                  key={agreement.agreementId}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isOverdue
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                  }`}
                >
                  {/* Topline: Identificador, Tipo, Reunião e Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {agreement.agreementId}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border capitalize ${getTypeBadge(agreement.type)}`}>
                        {agreement.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {agreement.isPreviousMeeting ? `Origem: Reunião Anterior (${agreement.meetingReferenceDate})` : `Origem: Reunião Atual (${agreement.meetingReferenceDate})`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        agreement.destination === 'GLPI'
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
                          : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {agreement.destination === 'GLPI' ? 'Destino: GLPI' : 'Destino: Gestão HEAL'}
                      </span>
                    </div>
                  </div>

                  {/* Descrição do Acordo */}
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {agreement.description}
                  </h4>

                  {/* Metadados: Responsável, Prazo, Prioridade e Chamado */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-500">Resp:</span>
                      <strong className="truncate">{agreement.responsibleName}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-500">Prazo:</span>
                      <strong className={isOverdue ? 'text-amber-600 dark:text-amber-400 font-mono' : 'font-mono'}>
                        {agreement.deadline}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      {agreement.relatedTicketId && onOpenTicketById ? (
                        <button
                          type="button"
                          onClick={() => onOpenTicketById(agreement.relatedTicketId!)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          <span>GLPI #{agreement.relatedTicketId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Decisão Interna</span>
                      )}
                    </div>
                  </div>

                  {/* Observações / Alerta de Atraso */}
                  {agreement.notes && (
                    <div className="mt-2 p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isOverdue && <AlertTriangle className="w-3 h-3 text-amber-500 inline mr-1 -mt-0.5" />}
                      {agreement.notes}
                    </div>
                  )}

                  {/* Evidências Relacionadas */}
                  {agreement.evidenceRefs && agreement.evidenceRefs.length > 0 && (
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Evidências:</span>
                      {agreement.evidenceRefs.map((ev, i) => (
                        <span key={i} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded font-mono text-[10px]">
                          ✓ {ev}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Ações Gerenciais Imediatas no Acordo */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setExpandedAgreementId(isExpanded ? null : agreement.agreementId)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      <span>Histórico & Auditoria ({agreement.history.length})</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {agreement.status !== 'CONCLUIDO' && (
                        <button
                          type="button"
                          onClick={() => onUpdateAgreementStatus(agreement.agreementId, 'CONCLUIDO', `Concluído e homologado por ${currentUser?.name || 'Gestor'}`)}
                          className="px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded cursor-pointer"
                        >
                          ✓ Marcar Concluído
                        </button>
                      )}

                      {agreement.status === 'AGUARDANDO_CONFIRMACAO' && (
                        <button
                          type="button"
                          onClick={() => onUpdateAgreementStatus(agreement.agreementId, 'CONFIRMADO', `Confirmado por ${currentUser?.name || 'Gestor'}`)}
                          className="px-2 py-0.5 text-[11px] font-semibold text-[#134F9F] dark:text-blue-300 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 rounded cursor-pointer"
                        >
                          Confirmar Acordo
                        </button>
                      )}

                      {agreement.status === 'EM_ANDAMENTO' && isOverdue && (
                        <button
                          type="button"
                          onClick={() => onUpdateAgreementStatus(agreement.agreementId, 'EM_ANDAMENTO', `Prazo renegociado em reunião por ${currentUser?.name || 'Gestor'}`)}
                          className="px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded cursor-pointer"
                        >
                          Renegociar Prazo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Histórico Expandido */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1.5 bg-slate-50 dark:bg-slate-950 p-2.5 rounded">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Trilha de Auditoria do Acordo:
                      </span>
                      {agreement.history.map(h => (
                        <div key={h.id} className="flex items-start gap-2 border-l-2 border-blue-500 pl-2">
                          <span className="font-mono text-[10px] text-slate-400 shrink-0">{h.timestamp}</span>
                          <div>
                            <strong className="text-slate-700 dark:text-slate-300">{h.author}:</strong> {h.action}
                            {h.notes && <p className="text-slate-500 italic mt-0.5">{h.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 5. FOOTER */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Rastreabilidade de compromissos assegurada · HEAL Ops 1.1</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-md cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
