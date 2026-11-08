/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Gaveta Analítica de Gestão Completa de Projetos (TPL-04)
 * Ambiente gerencial estruturado: Projeto → Fases → Marcos → Entregas → Tarefas → Subtarefas.
 * 4 Abas Internas: Roadmap & Checklist, Cronograma Gantt Executivo, Tarefas & Responsáveis, Riscos & Decisões.
 */

import React, { useState } from 'react';
import { 
  X, 
  FolderKanban, 
  Layers, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Milestone, 
  Users, 
  FileText, 
  ShieldAlert, 
  GitPullRequest, 
  Check, 
  Plus, 
  ArrowRight, 
  SlidersHorizontal, 
  Activity, 
  TrendingUp, 
  Award, 
  Lock, 
  Unlock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { 
  ManagedProject, 
  ProjectPhase, 
  ProjectTask, 
  ProjectTaskStatus, 
  ProjectMilestone, 
  ProjectDeliverable,
  ProjectRisk,
  CurrentUser 
} from '../../types';

interface ProjectManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ManagedProject;
  currentUser?: CurrentUser | null;
  onUpdateTaskStatus?: (taskId: string, newStatus: ProjectTaskStatus, note?: string) => void;
  onUpdateTaskProgress?: (taskId: string, progress: number) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onReportBlock?: (taskId: string, reason: string, action: string) => void;
  onOpenTicketById?: (ticketId: number) => void;
}

export const ProjectManagementDrawer: React.FC<ProjectManagementDrawerProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
  onUpdateTaskStatus,
  onUpdateTaskProgress,
  onToggleSubtask,
  onReportBlock,
  onOpenTicketById
}) => {
  if (!isOpen) return null;

  type ProjectTab = 'roadmap' | 'cronograma' | 'tarefas' | 'riscos';
  const [activeTab, setActiveTab] = useState<ProjectTab>('roadmap');

  // Filtros de tarefas
  const [taskAssigneeFilter, setTaskAssigneeFilter] = useState<string>('all');
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('all');
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'ph-01': false,
    'ph-02': false,
    'ph-03': true,
    'ph-04': true,
    'ph-05': false
  });

  // Modal de bloqueio de tarefa
  const [blockModalTaskId, setBlockModalTaskId] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState<string>('');
  const [unblockPlan, setUnblockPlan] = useState<string>('');

  // Modal de evidência / validação
  const [evidenceModalTask, setEvidenceModalTask] = useState<ProjectTask | null>(null);
  const [evidenceNoteInput, setEvidenceNoteInput] = useState<string>('');

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const getTaskStatusBadge = (status: ProjectTaskStatus) => {
    switch (status) {
      case 'NAO_INICIADO':
        return { label: 'NÃO INICIADO', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' };
      case 'PLANEJADO':
        return { label: 'PLANEJADO', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20' };
      case 'EM_ANDAMENTO':
        return { label: 'EM ANDAMENTO', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' };
      case 'BLOQUEADO':
        return { label: 'BLOQUEADO', color: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30' };
      case 'AGUARDANDO_VALIDACAO':
        return { label: 'AGUARDANDO VALIDAÇÃO', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30' };
      case 'AJUSTES_SOLICITADOS':
        return { label: 'AJUSTES SOLICITADOS', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' };
      case 'CONCLUIDO':
        return { label: '✓ CONCLUÍDO', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' };
      case 'CANCELADO':
        return { label: 'CANCELADO', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
      default:
        return { label: status, color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
    }
  };

  const filteredTasks = project.tasks.filter(t => {
    if (taskAssigneeFilter !== 'all' && t.responsibleName !== taskAssigneeFilter) return false;
    if (taskStatusFilter !== 'all' && t.status !== taskStatusFilter) return false;
    return true;
  });

  const uniqueAssignees = Array.from(new Set(project.tasks.map(t => t.responsibleName)));

  const handleConfirmBlock = () => {
    if (!blockModalTaskId || !blockReason.trim()) return;
    if (onReportBlock) {
      onReportBlock(blockModalTaskId, blockReason.trim(), unblockPlan.trim() || 'Ação de alinhamento gerencial');
    }
    setBlockModalTaskId(null);
    setBlockReason('');
    setUnblockPlan('');
  };

  const handleConfirmEvidenceSubmit = () => {
    if (!evidenceModalTask) return;
    if (onUpdateTaskStatus) {
      onUpdateTaskStatus(
        evidenceModalTask.id, 
        'AGUARDANDO_VALIDACAO', 
        evidenceNoteInput.trim() || 'Evidência anexada e submetida para homologação.'
      );
    }
    setEvidenceModalTask(null);
    setEvidenceNoteInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 1. HEADER DO PROJETO */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {project.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                  {project.name}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Sponsor: {project.sponsor} · Gerente: <strong>{project.manager}</strong> · Entrega Prevista: <strong>{project.targetDate}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">Progresso Validado:</span>
              <span className="text-sm font-bold font-mono text-purple-600 dark:text-purple-400">
                {project.generalValidatedProgress}%
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. BARRA DE 6 KPIs SINTÉTICOS DO PROJETO */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-3 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 shrink-0 text-xs">
          <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Progresso Validado</div>
            <div className="text-base font-bold font-mono text-purple-600 dark:text-purple-400 mt-0.5">
              {project.generalValidatedProgress}%
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Marcos Concluídos</div>
            <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {project.completedMilestonesCount} <span className="text-xs text-slate-400 font-normal">/ {project.totalMilestonesCount}</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Entregas Pendentes</div>
            <div className="text-base font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
              {project.pendingDeliverablesCount}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Tarefas Atrasadas</div>
            <div className={`text-base font-bold font-mono mt-0.5 ${project.overdueTasksCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {project.overdueTasksCount}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Bloqueios Críticos</div>
            <div className={`text-base font-bold font-mono mt-0.5 ${project.criticalBlocksCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {project.criticalBlocksCount}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Próximo Marco</div>
            <div className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 truncate mt-0.5" title={project.nextMilestone.title}>
              {project.nextMilestone.title}
            </div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">
              em {project.nextMilestone.daysRemaining} dias ({project.nextMilestone.date})
            </div>
          </div>
        </div>

        {/* 3. NAVEGAÇÃO DE 4 ABAS INTERNAS */}
        <div className="px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Roadmap por Fases & Checklist</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cronograma')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cronograma'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. Cronograma Visual Gantt</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tarefas')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tarefas'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. Responsabilidades & Tarefas ({project.tasks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('riscos')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'riscos'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>4. Riscos, Decisões & Mudanças ({project.risks.length + project.decisions.length})</span>
          </button>
        </div>

        {/* 4. CONTEÚDO DAS ABAS */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* ======================================================== */}
          {/* ABA 1: ROADMAP POR FASES & CHECKLIST                    */}
          {/* ======================================================== */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Estrutura hierárquica por fases sequenciais. As entregas possuem checklist auditável e critérios de homologação antes da liberação da fase seguinte.
                </span>
              </div>

              <div className="space-y-3">
                {project.phases.map((phase) => {
                  const isExpanded = expandedPhases[phase.id] ?? false;

                  return (
                    <div 
                      key={phase.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden shadow-2xs"
                    >
                      {/* Cabeçalho da Fase */}
                      <div 
                        onClick={() => togglePhase(phase.id)}
                        className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            phase.status === 'CONCLUIDA'
                              ? 'bg-emerald-600 text-white'
                              : phase.status === 'EM_ANDAMENTO'
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {phase.status === 'CONCLUIDA' ? '✓' : phase.order}
                          </span>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                                {phase.title}
                              </h4>
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                phase.status === 'CONCLUIDA'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : phase.status === 'EM_ANDAMENTO'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              }`}>
                                {phase.status === 'CONCLUIDA' ? 'CONCLUÍDA' : phase.status === 'EM_ANDAMENTO' ? 'EM ANDAMENTO' : 'NÃO INICIADA'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {phase.objective}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="hidden sm:block text-right">
                            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                              {phase.progressPercentage}%
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {phase.startDate} a {phase.endDate}
                            </div>
                          </div>
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      {/* Conteúdo Expandido da Fase */}
                      {isExpanded && (
                        <div className="px-5 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs space-y-3">
                          {/* Entregas da Fase */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                              Entregas da Fase ({phase.deliverables.length})
                            </span>
                            <div className="space-y-2">
                              {phase.deliverables.map(deliv => (
                                <div 
                                  key={deliv.id}
                                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 flex items-start justify-between gap-3"
                                >
                                  <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-[10px]">
                                        {deliv.code}
                                      </span>
                                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {deliv.title}
                                      </span>
                                    </div>
                                    <p className="text-slate-500 text-[11px] leading-snug">
                                      {deliv.description}
                                    </p>
                                    {deliv.evidenceRefs && deliv.evidenceRefs.length > 0 && (
                                      <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                                        Evidência: {deliv.evidenceRefs.join(', ')}
                                      </div>
                                    )}
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                      deliv.status === 'HOMOLOGADA'
                                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                        : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                    }`}>
                                      {deliv.status}
                                    </span>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                      Meta: {deliv.targetDate}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Marcos Vinculados */}
                          {phase.milestones.length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                Marcos Críticos Vinculados ({phase.milestones.length})
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {phase.milestones.map(m => (
                                  <div 
                                    key={m.id}
                                    className="p-2.5 rounded-lg bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex items-start gap-2"
                                  >
                                    <Milestone className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                                    <div className="min-w-0">
                                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                        {m.title}
                                      </div>
                                      <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                        {m.description}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                                        <span>Data: {m.targetDate}</span>
                                        {m.isCriticalPath && (
                                          <span className="text-rose-600 dark:text-rose-400 font-bold">★ CAMINHO CRÍTICO</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 2: CRONOGRAMA VISUAL GANTT EXECUTIVO                 */}
          {/* ======================================================== */}
          {activeTab === 'cronograma' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Cronograma Físico-Financeiro Executivo
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Janela Q4/2026 (Setembro a Novembro). Linha vertical vermelha representa o corte atual do dia 06/11/2026.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Concluído</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-600 inline-block"></span> Em Execução</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-300 dark:bg-slate-700 inline-block"></span> Planejado</span>
                </div>
              </div>

              {/* Timeline Gantt em barras proporcionais */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-4 text-xs">
                {/* Cabeçalho dos Meses */}
                <div className="grid grid-cols-12 gap-1 text-[10px] font-mono text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="col-span-3 font-semibold">FASE / ENTREGA</div>
                  <div className="col-span-3 text-center border-l border-slate-100 dark:border-slate-800">SETEMBRO 2026</div>
                  <div className="col-span-3 text-center border-l border-slate-100 dark:border-slate-800">OUTUBRO 2026</div>
                  <div className="col-span-3 text-center border-l border-slate-100 dark:border-slate-800 text-purple-600 dark:text-purple-400 font-bold">
                    NOVEMBRO 2026 (ATUAL)
                  </div>
                </div>

                {/* Barras de cada fase */}
                {project.phases.map((ph, idx) => {
                  return (
                    <div key={ph.id} className="grid grid-cols-12 gap-1 items-center py-1">
                      <div className="col-span-3 truncate pr-2 font-medium text-slate-800 dark:text-slate-200 text-[11px]">
                        {ph.code}: {ph.title.split(':')[1] || ph.title}
                      </div>
                      
                      <div className="col-span-9 relative bg-slate-100 dark:bg-slate-800 rounded-full h-6 flex items-center overflow-hidden">
                        {/* Indicador do dia atual (linha vertical tracejada) */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10" 
                          style={{ left: '78%' }} 
                          title="Hoje: 06/11/2026"
                        />

                        {/* Barra de Progresso Real */}
                        <div 
                          className={`h-full rounded-full flex items-center px-2 text-[10px] font-mono font-bold text-white transition-all ${
                            ph.status === 'CONCLUIDA'
                              ? 'bg-emerald-600'
                              : ph.status === 'EM_ANDAMENTO'
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                              : 'bg-slate-400'
                          }`}
                          style={{ width: `${Math.max(ph.progressPercentage, 8)}%` }}
                        >
                          {ph.progressPercentage}%
                        </div>

                        <span className="absolute right-2 text-[10px] font-mono text-slate-400">
                          {ph.endDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Destaque de Marcos Críticos */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-850 p-4 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Linha do Tempo dos Marcos Críticos (Milestones)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {project.phases.flatMap(p => p.milestones).map(m => (
                    <div 
                      key={m.id}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>{m.targetDate}</span>
                          <span className={`px-1 rounded ${
                            m.status === 'CONCLUIDO' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-purple-500/10 text-purple-600'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-1">
                          {m.title}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {m.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 3: RESPONSABILIDADES & TAREFAS POR PESSOA            */}
          {/* ======================================================== */}
          {activeTab === 'tarefas' && (
            <div className="space-y-4">
              {/* Barra de Filtros por Técnico e Estado */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Responsável:</span>
                  <select
                    value={taskAssigneeFilter}
                    onChange={e => setTaskAssigneeFilter(e.target.value)}
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="all">Toda a Equipe ({project.tasks.length} tarefas)</option>
                    {uniqueAssignees.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Estado:</span>
                  <select
                    value={taskStatusFilter}
                    onChange={e => setTaskStatusFilter(e.target.value)}
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="all">Todos os Estados</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="BLOQUEADO">Bloqueadas</option>
                    <option value="AGUARDANDO_VALIDACAO">Aguardando Validação</option>
                    <option value="CONCLUIDO">Concluídas</option>
                  </select>
                </div>
              </div>

              {/* Lista de Tarefas com Workflow de Execução */}
              <div className="space-y-3">
                {filteredTasks.map(task => {
                  const statusBadge = getTaskStatusBadge(task.status);
                  const isBlocked = task.status === 'BLOQUEADO';

                  return (
                    <div 
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isBlocked
                          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60'
                          : task.status === 'CONCLUIDO'
                          ? 'bg-white dark:bg-slate-900 border-emerald-500/30'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                              {task.code}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {task.title}
                            </h4>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${statusBadge.color}`}>
                              {statusBadge.label}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {task.description}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                            <span>Responsável: <strong className="text-slate-800 dark:text-slate-200">{task.responsibleName}</strong> ({task.role})</span>
                            <span>·</span>
                            <span className="font-mono">Prazo: {task.dueDate}</span>
                            <span>·</span>
                            <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{task.progressPercentage}% concluído</span>
                          </div>
                        </div>

                        {/* Botões do Fluxo de Execução da Tarefa */}
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          {task.status !== 'CONCLUIDO' && (
                            <>
                              {task.status !== 'EM_ANDAMENTO' && task.status !== 'BLOQUEADO' && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateTaskStatus && onUpdateTaskStatus(task.id, 'EM_ANDAMENTO')}
                                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-md transition-colors cursor-pointer"
                                >
                                  Iniciar
                                </button>
                              )}

                              {task.status === 'EM_ANDAMENTO' && (
                                <button
                                  type="button"
                                  onClick={() => setEvidenceModalTask(task)}
                                  className="px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 rounded-md transition-colors cursor-pointer"
                                >
                                  Solicitar Validação
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setBlockModalTaskId(task.id)}
                                className="px-2 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-md transition-colors cursor-pointer"
                                title="Reportar bloqueio na tarefa"
                              >
                                Bloqueio
                              </button>
                            </>
                          )}

                          {task.status === 'AGUARDANDO_VALIDACAO' && (
                            <button
                              type="button"
                              onClick={() => onUpdateTaskStatus && onUpdateTaskStatus(task.id, 'CONCLUIDO', 'Entrega homologada pelo gestor.')}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Aprovar Entrega</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Motivo de Bloqueio em Destaque */}
                      {isBlocked && (
                        <div className="mt-2.5 p-2.5 rounded-lg bg-rose-100/70 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Bloqueio Ativo: {task.blockReason}</span>
                          </div>
                          {task.unblockAction && (
                            <p className="text-[11px] text-rose-800 dark:text-rose-300">
                              <strong>Ação para Desbloqueio:</strong> {task.unblockAction}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Checklist de Subtarefas */}
                      {task.subtasks.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Subtarefas ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                          </span>
                          <div className="space-y-1">
                            {task.subtasks.map(sub => (
                              <div 
                                key={sub.id}
                                className="flex items-center gap-2 text-xs"
                              >
                                <button
                                  type="button"
                                  onClick={() => onToggleSubtask && onToggleSubtask(task.id, sub.id)}
                                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                    sub.completed
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-slate-400 hover:border-purple-600'
                                  }`}
                                >
                                  {sub.completed && <Check className="w-2.5 h-2.5" />}
                                </button>
                                <span className={sub.completed ? 'text-slate-400 line-through text-[11px]' : 'text-slate-700 dark:text-slate-300 text-[11px]'}>
                                  {sub.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ABA 4: RISCOS, DECISÕES & ALTERAÇÕES (CHANGE LOG)        */}
          {/* ======================================================== */}
          {activeTab === 'riscos' && (
            <div className="space-y-4 text-xs">
              {/* Matriz de Riscos */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    <span>Matriz de Riscos Operacionais & Mitigações ({project.risks.length})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Classificação Probabilidade x Impacto</span>
                </div>

                <div className="space-y-2">
                  {project.risks.map(risk => (
                    <div 
                      key={risk.id}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                            risk.impact === 'CRITICO' ? 'bg-rose-500/15 text-rose-600' : 'bg-amber-500/15 text-amber-600'
                          }`}>
                            Impacto {risk.impact} · Prob. {risk.probability}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {risk.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          <strong>Mitigação:</strong> {risk.mitigationAction}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          risk.status === 'MITIGADO' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                        }`}>
                          {risk.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">Resp: {risk.owner}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registro Formal de Decisões */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Registro de Decisões do Comitê ({project.decisions.length})</span>
                </div>

                <div className="space-y-2">
                  {project.decisions.map(dec => (
                    <div key={dec.id} className="p-3 rounded-lg bg-purple-50/30 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{dec.title}</span>
                        <span className="font-mono text-slate-400">{dec.date} · {dec.committee}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        "{dec.decision}"
                      </p>
                      <p className="text-slate-500 text-[10px] italic">
                        Racional: {dec.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Histórico de Alterações de Escopo e Prazo (Change Log) */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <GitPullRequest className="w-4 h-4 text-indigo-600" />
                  <span>Registro Formal de Mudanças de Escopo e Cronograma (Change Log)</span>
                </div>

                <div className="space-y-2">
                  {project.changeLogs.map(chg => (
                    <div key={chg.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">[{chg.type}] {chg.description}</span>
                        <span className="font-mono text-slate-400">{chg.date} por {chg.author}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        De: <span className="text-slate-400 line-through">{chg.baselineBefore}</span> → Para: <strong className="text-slate-700 dark:text-slate-300">{chg.baselineAfter}</strong>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                        <strong>Justificativa:</strong> {chg.justification} (Aprovado por {chg.approvedBy})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL DE RELATO DE BLOQUEIO */}
        {blockModalTaskId && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-md shadow-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Reportar Bloqueio na Tarefa</span>
                </h4>
                <button type="button" onClick={() => setBlockModalTaskId(null)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Motivo Factual do Bloqueio *
                </label>
                <textarea
                  value={blockReason}
                  onChange={e => setBlockReason(e.target.value)}
                  rows={2}
                  placeholder="Ex: Aguardando liberação formal de janela pela chefia médica..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ação Planejada para Desbloqueio
                </label>
                <input
                  type="text"
                  value={unblockPlan}
                  onChange={e => setUnblockPlan(e.target.value)}
                  placeholder="Ex: Reunião agendada às 14h com Dr. Silveira"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBlockModalTaskId(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBlock}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Registrar Bloqueio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE EVIDÊNCIA / VALIDAÇÃO DE TAREFA */}
        {evidenceModalTask && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 w-full max-w-md shadow-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Submeter Entrega para Validação</span>
                </h4>
                <button type="button" onClick={() => setEvidenceModalTask(null)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-slate-500">
                Tarefa: <strong>{evidenceModalTask.title}</strong>
              </p>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nota de Evidência Técnica / Comprovação de Teste *
                </label>
                <textarea
                  value={evidenceNoteInput}
                  onChange={e => setEvidenceNoteInput(e.target.value)}
                  rows={3}
                  placeholder="Descreva o log de teste, print de console ou resultado obtido para homologação..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEvidenceModalTask(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEvidenceSubmit}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Submeter para Homologação
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
