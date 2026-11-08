/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Gaveta Analítica de Acompanhamento de Planos de Evolução Individual
 * Acompanhamento longitudinal entre reuniões de Alinhamento Semanal (TPL-02) e Feedback (TPL-03).
 * Workflow de validação formal, ciência do colaborador, histórico auditável de governança.
 */

import React, { useState } from 'react';
import { 
  X, 
  HeartHandshake, 
  Target, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Edit3, 
  Send, 
  RotateCcw, 
  Check, 
  History, 
  MessageSquare, 
  FileText,
  Search,
  SlidersHorizontal,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { 
  DevelopmentCommitment, 
  DevelopmentCommitmentStatus, 
  CurrentUser,
  DevelopmentAction 
} from '../../types';

interface DevelopmentPlansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  commitments: DevelopmentCommitment[];
  onUpdateCommitmentStatus: (
    commitmentId: string, 
    newStatus: DevelopmentCommitmentStatus, 
    actionNote?: string,
    validationFeedback?: string
  ) => void;
  onToggleActionCompleted: (commitmentId: string, actionId: string) => void;
  onAddEvolutionNote: (commitmentId: string, note: string) => void;
  onOpenRegisterModal: () => void;
  currentUser?: CurrentUser | null;
  onOpenTicketById?: (ticketId: number) => void;
}

export const DevelopmentPlansDrawer: React.FC<DevelopmentPlansDrawerProps> = ({
  isOpen,
  onClose,
  commitments = [],
  onUpdateCommitmentStatus,
  onToggleActionCompleted,
  onAddEvolutionNote,
  onOpenRegisterModal,
  currentUser,
  onOpenTicketById
}) => {
  if (!isOpen) return null;

  const [filterCollaborator, setFilterCollaborator] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCommitmentId, setSelectedCommitmentId] = useState<string | null>(commitments[0]?.id || null);

  // Modais de ação rápida dentro do drawer
  const [actionModalType, setActionModalType] = useState<'VALIDATE' | 'REPLAN' | 'EVOLUTION' | 'SCIENCE' | null>(null);
  const [activeCommitmentForAction, setActiveCommitmentForAction] = useState<DevelopmentCommitment | null>(null);
  const [actionInputText, setActionInputText] = useState<string>('');
  const [validationResultStatus, setValidationResultStatus] = useState<DevelopmentCommitmentStatus>('CUMPRIDO');

  // Colaboradores únicos presentes nos planos
  const uniqueCollaborators = Array.from(new Set(commitments.map(c => c.collaboratorName)));

  // Filtros
  const filteredCommitments = commitments.filter(c => {
    if (filterCollaborator !== 'all' && c.collaboratorName !== filterCollaborator) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.collaboratorName.toLowerCase().includes(q);
      const matchArea = c.developmentArea.toLowerCase().includes(q);
      const matchGoal = c.agreedGoal.toLowerCase().includes(q);
      if (!matchName && !matchArea && !matchGoal) return false;
    }
    return true;
  });

  const selectedCommitment = commitments.find(c => c.id === selectedCommitmentId) || filteredCommitments[0] || null;

  // Status badge config
  const getStatusBadge = (status: DevelopmentCommitmentStatus) => {
    switch (status) {
      case 'PROPOSTO':
        return { label: 'PROPOSTO', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20' };
      case 'AGUARDANDO_CIENCIA':
        return { label: 'AGUARDANDO CIÊNCIA', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' };
      case 'EM_ANDAMENTO':
        return { label: 'EM ANDAMENTO', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
      case 'AGUARDANDO_VALIDACAO':
        return { label: 'AGUARDANDO VALIDAÇÃO', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30' };
      case 'CUMPRIDO':
        return { label: '✓ CUMPRIDO', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
      case 'PARCIALMENTE_CUMPRIDO':
        return { label: 'PARCIALMENTE CUMPRIDO', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' };
      case 'NAO_CUMPRIDO':
        return { label: 'NÃO CUMPRIDO', color: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30' };
      case 'REPLANEJADO':
        return { label: 'REPLANEJADO', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30' };
      case 'CANCELADO':
        return { label: 'CANCELADO', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
      default:
        return { label: status, color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
    }
  };

  const handleOpenActionModal = (type: 'VALIDATE' | 'REPLAN' | 'EVOLUTION' | 'SCIENCE', commitment: DevelopmentCommitment) => {
    setActiveCommitmentForAction(commitment);
    setActionModalType(type);
    setActionInputText('');
    if (type === 'VALIDATE') {
      setValidationResultStatus('CUMPRIDO');
    }
  };

  const handleConfirmActionModal = () => {
    if (!activeCommitmentForAction || !actionModalType) return;

    if (actionModalType === 'SCIENCE') {
      onUpdateCommitmentStatus(
        activeCommitmentForAction.id,
        'EM_ANDAMENTO',
        'Ciência formal confirmada pelo colaborador.',
        undefined
      );
    } else if (actionModalType === 'VALIDATE') {
      onUpdateCommitmentStatus(
        activeCommitmentForAction.id,
        validationResultStatus,
        'Validação de resultado homologada pelo gestor.',
        actionInputText.trim() || 'Resultado validado em conformidade com os critérios objetivos acordados.'
      );
    } else if (actionModalType === 'REPLAN') {
      onUpdateCommitmentStatus(
        activeCommitmentForAction.id,
        'REPLANEJADO',
        `Replanejamento de prazo/ações pactuado: ${actionInputText.trim()}`,
        undefined
      );
    } else if (actionModalType === 'EVOLUTION') {
      if (actionInputText.trim()) {
        onAddEvolutionNote(activeCommitmentForAction.id, actionInputText.trim());
      }
    }

    setActionModalType(null);
    setActiveCommitmentForAction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 1. HEADER DO DRAWER */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Planos de Evolução Individual & Acompanhamento
                </h3>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                  {commitments.length} Registros
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pactuações de melhoria do Alinhamento Semanal (TPL-02) rastreadas longitudinalmente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenRegisterModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrar compromisso</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. BARRA DE FILTROS E BUSCA */}
        <div className="px-5 py-2.5 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por colaborador, área ou meta..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCollaborator}
              onChange={e => setFilterCollaborator(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">Todos os Colaboradores</option>
              {uniqueCollaborators.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">Todos os Estados</option>
              <option value="AGUARDANDO_CIENCIA">Aguardando Ciência</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="AGUARDANDO_VALIDACAO">Aguardando Validação</option>
              <option value="CUMPRIDO">Cumpridos</option>
              <option value="REPLANEJADO">Replanejados</option>
            </select>
          </div>
        </div>

        {/* 3. CORPO DIVIDIDO EM 2 COLUNAS: LISTA À ESQUERDA (38%) E DETALHE À DIREITA (62%) */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Coluna da Esquerda: Lista de Planos e Compromissos */}
          <div className="w-[38%] border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-50/30 dark:bg-slate-950/20">
            {filteredCommitments.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Nenhum compromisso de melhoria encontrado com os filtros atuais.
              </div>
            ) : (
              filteredCommitments.map(item => {
                const statusBadge = getStatusBadge(item.status);
                const isSelected = selectedCommitment?.id === item.id;
                const completedActions = item.practicalActions.filter(a => a.completed).length;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCommitmentId(item.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.collaboratorName}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 truncate mb-1">
                      {item.developmentArea}
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-2">
                      "{item.agreedGoal}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="font-mono">
                        {completedActions}/{item.practicalActions.length} ações concluídas
                      </span>
                      <span className="font-mono">
                        {item.isPreviousAlignment ? 'Alinhamento Anterior' : 'Semana Atual'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Coluna da Direita: Dossiê e Evolução do Compromisso Selecionado */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {selectedCommitment ? (
              <>
                {/* Header do Dossiê */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {selectedCommitment.id}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 font-mono">
                          Ref: <strong>{selectedCommitment.meetingReferenceDate}</strong>
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadge(selectedCommitment.status).color}`}>
                          {getStatusBadge(selectedCommitment.status).label}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                        {selectedCommitment.collaboratorName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedCommitment.collaboratorRole} · Acompanhado por: <strong>{selectedCommitment.mentorOrManagerName}</strong>
                      </p>
                    </div>

                    {/* Ações Gerenciais Diretas no Topo */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedCommitment.status === 'AGUARDANDO_CIENCIA' && (
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal('SCIENCE', selectedCommitment)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                        >
                          ✓ Coletar Ciência
                        </button>
                      )}

                      {selectedCommitment.status === 'EM_ANDAMENTO' && (
                        <button
                          type="button"
                          onClick={() => onUpdateCommitmentStatus(selectedCommitment.id, 'AGUARDANDO_VALIDACAO', 'Colaborador submeteu ações concluídas para validação do gestor.')}
                          className="px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 rounded-lg transition-colors cursor-pointer"
                        >
                          Solicitar Validação
                        </button>
                      )}

                      {selectedCommitment.status === 'AGUARDANDO_VALIDACAO' && (
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal('VALIDATE', selectedCommitment)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Validar Resultado</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenActionModal('EVOLUTION', selectedCommitment)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-lg transition-colors cursor-pointer"
                      >
                        + Evolução
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenActionModal('REPLAN', selectedCommitment)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors cursor-pointer"
                      >
                        Replanejar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Banner de Ciência do Colaborador */}
                <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  selectedCommitment.collaboratorSignedScience
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${selectedCommitment.collaboratorSignedScience ? 'text-emerald-600' : 'text-amber-600'}`} />
                    <span>
                      {selectedCommitment.collaboratorSignedScience
                        ? `Ciência formal do colaborador confirmada em ${selectedCommitment.collaboratorSignedScienceAt || '28/10/2026'}.`
                        : 'Aguardando confirmação de ciência e aceite do colaborador no Portal.'}
                    </span>
                  </div>
                  {!selectedCommitment.collaboratorSignedScience && (
                    <button
                      type="button"
                      onClick={() => handleOpenActionModal('SCIENCE', selectedCommitment)}
                      className="text-xs font-bold underline cursor-pointer"
                    >
                      Assinar Ciência Agora
                    </button>
                  )}
                </div>

                {/* 1. Diagnóstico Factual & Evidências Observadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Situação Observada (Factual & Respeitosa)
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {selectedCommitment.observedSituation}
                    </p>
                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500">
                      <strong>Impacto:</strong> {selectedCommitment.operationalImpact}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Evidências Observadas ({selectedCommitment.evidencesObserved.length})
                    </span>
                    <ul className="space-y-1">
                      {selectedCommitment.evidencesObserved.map((ev, i) => (
                        <li key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. Meta Pactuada e Compromisso do Colaborador */}
                <div className="p-3.5 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 block mb-0.5">
                      Objetivo Pactuado
                    </span>
                    <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm">
                      {selectedCommitment.agreedGoal}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 block mb-0.5">
                      Compromisso Proposto pelo Colaborador
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{selectedCommitment.collaboratorProposedCommitment}"
                    </p>
                  </div>
                </div>

                {/* 3. Ações Práticas e Checklist Interativo */}
                <div className="p-4 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Plano de Ações Práticas ({selectedCommitment.practicalActions.length})
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Critério: <strong>{selectedCommitment.successCriteria}</strong>
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedCommitment.practicalActions.map(action => (
                      <div 
                        key={action.id}
                        className={`p-2.5 rounded-lg border transition-colors flex items-start justify-between gap-3 ${
                          action.completed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => onToggleActionCompleted(selectedCommitment.id, action.id)}
                            className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                              action.completed
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-400 hover:border-indigo-500'
                            }`}
                          >
                            {action.completed && <Check className="w-3 h-3" />}
                          </button>
                          <div className="min-w-0">
                            <p className={`font-medium ${action.completed ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                              {action.description}
                            </p>
                            {action.evidenceRef && (
                              <span className="inline-block mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                                Evidência: {action.evidenceRef}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{action.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Parecer e Validação do Gestor (Se aplicável) */}
                {selectedCommitment.validationFeedback && (
                  <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Parecer de Validação Homologada</span>
                      {selectedCommitment.validatedAt && (
                        <span className="text-[10px] font-mono text-emerald-600 font-normal">
                          · Homologado em {selectedCommitment.validatedAt} por {selectedCommitment.validatedBy}
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed">
                      {selectedCommitment.validationFeedback}
                    </p>
                  </div>
                )}

                {/* 5. Histórico Auditável de Transições */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>Trilha de Auditoria & Governança ({selectedCommitment.history.length})</span>
                  </div>

                  <div className="space-y-2">
                    {selectedCommitment.history.map(h => (
                      <div key={h.id} className="p-2 rounded bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px]">
                        <div className="flex items-center justify-between text-slate-400 mb-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{h.author}</span>
                          <span className="font-mono text-[10px]">{h.timestamp}</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">
                          {h.action}
                        </p>
                        {h.justification && (
                          <p className="text-slate-500 italic mt-0.5 text-[10px]">
                            Justificativa: "{h.justification}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                Selecione um compromisso para visualizar o dossiê analítico.
              </div>
            )}
          </div>
        </div>

        {/* MODAL INTERNO DE AÇÃO RÁPIDA (Validação / Replanejamento / Evolução) */}
        {actionModalType && activeCommitmentForAction && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-lg shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {actionModalType === 'VALIDATE' && 'Validar Resultado do Compromisso'}
                  {actionModalType === 'REPLAN' && 'Replanejar Prazos / Ações'}
                  {actionModalType === 'EVOLUTION' && 'Registrar Nota de Evolução'}
                  {actionModalType === 'SCIENCE' && 'Confirmar Ciência do Colaborador'}
                </h4>
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {actionModalType === 'VALIDATE' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parecer da Validação *
                    </label>
                    <select
                      value={validationResultStatus}
                      onChange={e => setValidationResultStatus(e.target.value as DevelopmentCommitmentStatus)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                    >
                      <option value="CUMPRIDO">✓ Cumprido com Sucesso (Homologado)</option>
                      <option value="PARCIALMENTE_CUMPRIDO">Parcialmente Cumprido (Necessita Acompanhamento)</option>
                      <option value="NAO_CUMPRIDO">Não Cumprido (Requer Revisão no Alinhamento)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Parecer e Reconhecimento do Gestor
                    </label>
                    <textarea
                      value={actionInputText}
                      onChange={e => setActionInputText(e.target.value)}
                      rows={3}
                      placeholder="Descreva o parecer qualitativo baseado nas evidências apresentadas..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </>
              )}

              {actionModalType === 'REPLAN' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Justificativa do Replanejamento e Novo Prazo *
                  </label>
                  <textarea
                    value={actionInputText}
                    onChange={e => setActionInputText(e.target.value)}
                    rows={3}
                    placeholder="Informe o motivo da extensão de prazo ou ajuste das ações combinadas..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              )}

              {actionModalType === 'EVOLUTION' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nota de Evolução Intermediária *
                  </label>
                  <textarea
                    value={actionInputText}
                    onChange={e => setActionInputText(e.target.value)}
                    rows={3}
                    placeholder="Registrar evidência intermediária, progresso observado ou feedback pontual..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              )}

              {actionModalType === 'SCIENCE' && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs">
                  Confirmar que o colaborador <strong>{activeCommitmentForAction.collaboratorName}</strong> tomou ciência formal das ações e critérios acordados neste plano de evolução.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmActionModal}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
