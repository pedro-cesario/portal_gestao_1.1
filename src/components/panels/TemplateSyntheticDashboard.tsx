/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Componente Sintético Executivo Padronizado para Templates (TPL-01 a TPL-04)
 * REGRA MANDATÓRIA: SINTÉTICO PRIMEIRO, ANALÍTICO SOB DEMANDA.
 * Zero-scroll no desktop (100% contido no viewport), revelação analítica apenas sob demanda.
 * Inclui: "+ Registrar acordo", "Acordos e Encaminhamentos" e "Acordos da reunião anterior".
 */

import React from 'react';
import { 
  FileSpreadsheet, 
  Layers, 
  User, 
  FolderKanban, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Presentation, 
  FileText, 
  Edit3, 
  ArrowRight,
  TrendingUp,
  Award,
  Milestone,
  Check,
  Handshake,
  Plus,
  RotateCcw,
  Users
} from 'lucide-react';
import { ArtifactPanel, MeetingAgreement, DevelopmentCommitment, ManagedProject } from '../../types';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { HeartHandshake } from 'lucide-react';
import { getDevelopmentPlanSummary } from '../../data/mockData';

interface TemplateSyntheticDashboardProps {
  panel: ArtifactPanel;
  agreements?: MeetingAgreement[];
  developmentCommitments?: DevelopmentCommitment[];
  managedProjects?: ManagedProject[];
  onOpenPresentation: () => void;
  onOpenDetailDrawer: () => void;
  onOpenHumanReview?: () => void;
  onOpenRegisterAgreement?: () => void;
  onOpenAgreementsTracking?: () => void;
  onOpenRegisterCommitment?: () => void;
  onOpenDevelopmentPlans?: () => void;
  onOpenProjectManagement?: () => void;
  onOpenRegisterFeedback?: () => void;
  onOpenRegisterAlignment?: () => void;
  onOpenFeedbackAndAlignments?: () => void;
  onOpenAiPreparation?: () => void;
  onBackToCatalog?: () => void;
  onOpenTicketById?: (ticketId: number) => void;
  isCompactChatMode?: boolean;
}

export const TemplateSyntheticDashboard: React.FC<TemplateSyntheticDashboardProps> = ({
  panel,
  agreements = [],
  developmentCommitments = [],
  managedProjects = [],
  onOpenPresentation,
  onOpenDetailDrawer,
  onOpenHumanReview,
  onOpenRegisterAgreement,
  onOpenAgreementsTracking,
  onOpenRegisterCommitment,
  onOpenDevelopmentPlans,
  onOpenProjectManagement,
  onOpenRegisterFeedback,
  onOpenRegisterAlignment,
  onOpenFeedbackAndAlignments,
  onOpenAiPreparation,
  onBackToCatalog,
  onOpenTicketById,
  isCompactChatMode = false
}) => {
  // Cores e Ícones por tipo de template
  const getTemplateBadge = (type: string) => {
    switch (type) {
      case 'TPL-01':
        return {
          icon: FileSpreadsheet,
          label: 'Daily Operacional TI',
          color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20'
        };
      case 'TPL-02':
        return {
          icon: Layers,
          label: 'Alinhamento Semanal',
          color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
        };
      case 'TPL-03':
        return {
          icon: User,
          label: 'Feedback e Alinhamentos',
          color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        };
      case 'TPL-04':
        return {
          icon: FolderKanban,
          label: 'Gestão de Projetos',
          color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'
        };
      default:
        return {
          icon: FileSpreadsheet,
          label: type,
          color: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20'
        };
    }
  };

  const badgeConfig = getTemplateBadge(panel.templateType);
  const TemplateIcon = badgeConfig.icon;

  const isMeetingTemplate = panel.templateType === 'TPL-01' || panel.templateType === 'TPL-02';
  const isWeeklyAlignment = panel.templateType === 'TPL-02';
  const isProjectTemplate = panel.templateType === 'TPL-04';
  const meetingType = panel.templateType === 'TPL-01' ? 'DAILY' : 'ALINHAMENTO_SEMANAL';

  // Acordos filtrados para este tipo de reunião
  const currentMeetingAgreements = agreements.filter(a => a.sourceMeetingType === meetingType && !a.isPreviousMeeting);
  const previousMeetingAgreements = agreements.filter(a => a.sourceMeetingType === meetingType && a.isPreviousMeeting);

  const totalAgreements = currentMeetingAgreements.length;
  const completedAgreements = currentMeetingAgreements.filter(a => a.status === 'CONCLUIDO').length;
  const pendingAgreements = currentMeetingAgreements.filter(a => a.status === 'CONFIRMADO' || a.status === 'EM_ANDAMENTO' || a.status === 'AGUARDANDO_CONFIRMACAO').length;
  const overdueAgreements = currentMeetingAgreements.filter(a => a.notes?.toLowerCase().includes('atrasad') || (a.status === 'EM_ANDAMENTO' && a.isPreviousMeeting)).length;

  // Planos de desenvolvimento sintetizados
  const planSummary = getDevelopmentPlanSummary(developmentCommitments);

  // Projeto selecionado (se TPL-04)
  const currentProject = managedProjects[0];

  return (
    <div className={`w-full h-full flex flex-col justify-between gap-2 overflow-hidden ${isCompactChatMode ? 'p-1' : ''}`}>
      {/* 1. HEADER EXECUTIVO COMPACTO */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1.5 rounded-lg border ${badgeConfig.color} shrink-0`}>
            <TemplateIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${badgeConfig.color}`}>
                {panel.templateType}
              </span>
              <span className="text-[10px] text-slate-400">·</span>
              {/* Dimensão 1: Estado da Especificação (RASCUNHO | EM_HOMOLOGACAO | HOMOLOGADO) */}
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                panel.specificationStatus === 'HOMOLOGADO'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
              }`} title="Estado da Especificação: A ausência de evidência institucional resulta em 'Em Homologação'">
                ESPECIFICAÇÃO: {panel.specificationStatus === 'HOMOLOGADO' ? 'HOMOLOGADO' : 'EM HOMOLOGAÇÃO'}
              </span>
              <span className="text-[10px] text-slate-400">·</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Ref: <strong className="text-slate-800 dark:text-slate-200">{panel.referenceDate}</strong>
              </span>
              <span className="text-[10px] text-slate-400">·</span>
              {/* Dimensão 2: Origem dos Dados (DEMONSTRATIVO | SNAPSHOT | REALTIME | INDISPONIVEL) */}
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20" title="Origem dos dados operacionais: nunca REALTIME para dados demonstrativos">
                DADOS: {panel.dataOrigin || (panel.source === 'SNAPSHOT_04H' ? 'DEMONSTRATIVO (SNAPSHOT 04H)' : 'DEMONSTRATIVO')}
              </span>
              <span className="text-[10px] text-slate-400">·</span>
              {/* Dimensão 3: Estado do Registro (RASCUNHO | EM_REVISAO | FORMALIZADO | ARQUIVADO) */}
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                panel.status === 'APROVADO'
                  ? 'bg-blue-500/10 text-[#134F9F] dark:text-blue-400 border border-blue-500/20'
                  : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
              }`} title="Estado do registro específico deste artefato">
                REGISTRO: {panel.status === 'APROVADO' ? 'FORMALIZADO' : 'EM REVISÃO'}
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
              {panel.title}
            </h2>
          </div>
        </div>

        {/* Ações Gerenciais no Topo */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {/* AÇÃO DISCRETA REQUISITADA: + Registrar acordo */}
          {isMeetingTemplate && onOpenRegisterAgreement && (
            <button
              type="button"
              onClick={onOpenRegisterAgreement}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Registrar acordo ou encaminhamento da reunião"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrar acordo</span>
            </button>
          )}

          {/* AÇÃO DISCRETA REQUISITADA: + Registrar compromisso de melhoria (TPL-02) */}
          {isWeeklyAlignment && onOpenRegisterCommitment && (
            <button
              type="button"
              onClick={onOpenRegisterCommitment}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Registrar compromisso individual de melhoria pactuado no alinhamento"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>+ Registrar compromisso</span>
            </button>
          )}

          {/* AÇÃO DISCRETA REQUISITADA: Gestão Completa de Projetos (TPL-04) */}
          {isProjectTemplate && onOpenProjectManagement && (
            <button
              type="button"
              onClick={onOpenProjectManagement}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Abrir ambiente completo de gestão do projeto (Fases, Gantt, Tarefas e Riscos)"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Gestão do Projeto</span>
            </button>
          )}

          {/* AÇÕES DISCRETAS: TPL-03 Feedback e Alinhamentos */}
          {panel.templateType === 'TPL-03' && onOpenRegisterFeedback && (
            <button
              type="button"
              onClick={onOpenRegisterFeedback}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Registrar novo feedback individual de desenvolvimento"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Novo Feedback</span>
            </button>
          )}

          {panel.templateType === 'TPL-03' && onOpenRegisterAlignment && (
            <button
              type="button"
              onClick={onOpenRegisterAlignment}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#134F9F] dark:text-blue-300 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Registrar alinhamento coletivo ou esporádico com coleta de assinaturas"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Novo Alinhamento</span>
            </button>
          )}

          {panel.templateType === 'TPL-03' && onOpenFeedbackAndAlignments && (
            <button
              type="button"
              onClick={onOpenFeedbackAndAlignments}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 rounded-md transition-colors cursor-pointer shadow-2xs"
              title="Abrir painel analítico de feedbacks, alinhamentos e termos A4"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Gestão de Termos</span>
            </button>
          )}

          {onOpenHumanReview && (
            <button
              type="button"
              onClick={onOpenHumanReview}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
              title="Revisão Humana e Homologação"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Revisão</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenDetailDrawer}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-md transition-colors cursor-pointer"
            title="Ver Evidências e Detalhes Analíticos"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Evidências</span>
          </button>

          <button
            type="button"
            onClick={onOpenPresentation}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer"
            title="Apresentar em Reunião Executiva"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Apresentar</span>
          </button>
        </div>
      </div>

      {/* 2. LINHA DE KPIs SINTÉTICOS MANDATÓRIOS DO TEMPLATE */}
      {isProjectTemplate && currentProject ? (
        // Se TPL-04: Os 6 KPIs Executivos Mandatórios de Projeto
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold truncate">Progresso Validado</span>
            <div className="text-base sm:text-lg font-bold font-mono text-purple-600 dark:text-purple-400">
              {currentProject.generalValidatedProgress}%
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold truncate">Marcos Concluídos</span>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {currentProject.completedMilestonesCount} <span className="text-xs text-slate-400 font-normal">/ {currentProject.totalMilestonesCount}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold truncate">Entregas Pendentes</span>
            <div className="text-base sm:text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
              {currentProject.pendingDeliverablesCount}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold truncate">Tarefas Atrasadas</span>
            <div className={`text-base sm:text-lg font-bold font-mono ${currentProject.overdueTasksCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {currentProject.overdueTasksCount}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold truncate">Bloqueios Críticos</span>
            <div className={`text-base sm:text-lg font-bold font-mono ${currentProject.criticalBlocksCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {currentProject.criticalBlocksCount}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold truncate">Próximo Marco</span>
            <div className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 truncate mt-0.5" title={currentProject.nextMilestone.title}>
              em {currentProject.nextMilestone.daysRemaining} dias
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 shrink-0">
          {panel.summary.metricsBrief && panel.summary.metricsBrief.slice(0, 4).map((metric, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex flex-col justify-between shadow-2xs hover:border-blue-500/30 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span className="truncate font-medium">{metric.label}</span>
                {metric.trend && (
                  <span className={`text-[10px] font-mono font-bold ${
                    (typeof metric.trend === 'string' && metric.trend === 'up') || (typeof metric.trend === 'object' && metric.trend.isPositive)
                      ? 'text-emerald-500' 
                      : (typeof metric.trend === 'string' && metric.trend === 'down') || (typeof metric.trend === 'object' && !metric.trend.isPositive)
                      ? 'text-rose-500' 
                      : 'text-slate-400'
                  }`}>
                    {typeof metric.trend === 'string' 
                      ? (metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→')
                      : (metric.trend.isPositive ? `↑ ${metric.trend.value}` : `↓ ${metric.trend.value}`)}
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex items-baseline justify-between">
                <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                  {metric.value}
                </span>
                {metric.target && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Meta {metric.target}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. SEÇÃO SINTÉTICA (ACORDOS PARA TPL-01 / PLANOS DE EVOLUÇÃO PARA TPL-02 / GESTÃO PARA TPL-04) */}
      {isWeeklyAlignment ? (
        // ALINHAMENTO SEMANAL (TPL-02): 3 Cards Sintéticos (Acordos Atuais, Acordos Anteriores, Planos de Evolução)
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 shrink-0">
          {/* Card Sintético: Acordos e Encaminhamentos */}
          <div 
            onClick={onOpenAgreementsTracking}
            className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex items-center justify-between shadow-2xs hover:border-blue-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-[#134F9F] dark:text-blue-400 shrink-0">
                <Handshake className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] transition-colors truncate">
                    Acordos Semanal
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-blue-500/10 text-[#134F9F] dark:text-blue-400">
                    {totalAgreements}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                  <span className="text-emerald-600 font-semibold">{completedAgreements} ok</span> · <span className="text-blue-600">{pendingAgreements} pend</span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
          </div>

          {/* Card Sintético: Acordos da Reunião Anterior */}
          <div 
            onClick={onOpenAgreementsTracking}
            className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex items-center justify-between shadow-2xs hover:border-indigo-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors truncate">
                    Acordos Anteriores
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded">
                    {previousMeetingAgreements.length}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                  <span className="text-emerald-600 font-semibold">{previousMeetingAgreements.filter(a => a.status === 'CONCLUIDO').length} concluídos</span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
          </div>

          {/* Card Sintético REQUISITADO: Planos de Evolução da Equipe */}
          <div 
            onClick={onOpenDevelopmentPlans}
            className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex items-center justify-between shadow-2xs hover:border-indigo-500 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors truncate">
                    Planos de Evolução
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {planSummary.activePlans} ativos
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                  <span className="text-purple-600 font-semibold">{planSummary.awaitingValidation} validação</span>
                  <span> · </span>
                  <span className="text-emerald-600 font-semibold">{planSummary.completedCommitments} cumpridos</span>
                  {planSummary.overdueCommitments > 0 && (
                    <>
                      <span> · </span>
                      <span className="text-amber-600 font-bold">{planSummary.overdueCommitments} sob revisão</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-0.5">
              <span>Evolução</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      ) : isMeetingTemplate ? (
        // DAILY (TPL-01): Os 2 Cards Sintéticos de Acordos
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 shrink-0">
          <div 
            onClick={onOpenAgreementsTracking}
            className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex items-center justify-between shadow-2xs hover:border-blue-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-[#134F9F] dark:text-blue-400 shrink-0">
                <Handshake className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] transition-colors truncate">
                    Acordos e Encaminhamentos
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-[#134F9F] dark:text-blue-400">
                    {totalAgreements}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{completedAgreements} concluídos</span>
                  <span>·</span>
                  <span className="text-blue-600 dark:text-blue-400">{pendingAgreements} pendentes</span>
                  {overdueAgreements > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">{overdueAgreements} atrasados</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-0.5">
              <span>Detalhar</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div 
            onClick={onOpenAgreementsTracking}
            className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex items-center justify-between shadow-2xs hover:border-blue-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors truncate">
                    Acordos da Reunião Anterior
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                    {previousMeetingAgreements.length} assumidos
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono truncate">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {previousMeetingAgreements.filter(a => a.status === 'CONCLUIDO').length} concluídos
                  </span>
                  <span>·</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {previousMeetingAgreements.filter(a => a.notes?.toLowerCase().includes('atrasad') || (a.status === 'EM_ANDAMENTO')).length} sob acompanhamento
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-0.5">
              <span>Evolução</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      ) : isProjectTemplate ? (
        // GESTÃO DE PROJETOS (TPL-04): Launcher Executivo de Gestão Completa
        <div 
          onClick={onOpenProjectManagement}
          className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-lg p-2.5 flex items-center justify-between shadow-2xs hover:border-purple-500 cursor-pointer transition-all group shrink-0"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors truncate">
                  Ambiente Integrado de Gestão Completa do Projeto
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Fases · Gantt · Tarefas · Riscos
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                5 Fases sequenciais, cronograma executivo, distribuição de tarefas por técnico e matriz de riscos.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform shrink-0 flex items-center gap-1">
            <span>Abrir Gestão Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      ) : panel.templateType === 'TPL-03' ? (
        // FEEDBACK E ALINHAMENTOS (TPL-03): 4 Fluxos de Ação Gerencial
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 shrink-0">
          {/* FLUXO 1: Preparar Alinhamento com IA */}
          <div 
            onClick={onOpenAiPreparation || onOpenFeedbackAndAlignments}
            className="md:col-span-3 bg-white dark:bg-slate-900 border border-purple-500/40 hover:border-purple-600 rounded-lg p-2.5 flex items-center justify-between shadow-2xs cursor-pointer transition-all group bg-gradient-to-r from-purple-500/5 to-transparent"
            title="Preparação humanizada com assistente gerencial de redação em 5 etapas"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors truncate">
                    1. Preparar com IA
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    5 Etapas
                  </span>
                </div>
                <div className="text-[10px] text-purple-700 dark:text-purple-300 font-medium truncate mt-0.5">
                  Roteiro humanizado e minuta A4
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>

          {/* FLUXO 2: Registrar Feedback Individual */}
          <div 
            onClick={onOpenRegisterFeedback || onOpenFeedbackAndAlignments}
            className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex items-center justify-between shadow-2xs hover:border-emerald-500/50 cursor-pointer transition-all group"
            title="Registrar novo feedback individual de desenvolvimento técnico e comportamental"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors truncate">
                    2. Feedback Individual
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    + Registrar
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                  <span className="text-emerald-600 font-semibold">Técnico Nominal</span> · Metas & Critérios
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
          </div>

          {/* FLUXO 3: Registrar Alinhamento Coletivo */}
          <div 
            onClick={onOpenRegisterAlignment || onOpenFeedbackAndAlignments}
            className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex items-center justify-between shadow-2xs hover:border-blue-500/50 cursor-pointer transition-all group"
            title="Registrar alinhamento coletivo ou de passagem de plantão com múltiplos participantes"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-[#134F9F] dark:text-blue-400 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] transition-colors truncate">
                    3. Alinhamento Coletivo
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-blue-500/10 text-[#134F9F] dark:text-blue-400">
                    + Registrar
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                  <span className="text-[#134F9F] dark:text-blue-400 font-semibold">Equipe & Escala</span> · Atas A4
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
          </div>

          {/* FLUXO 4: Consultar Histórico e Documentos */}
          <div 
            onClick={onOpenFeedbackAndAlignments}
            className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex items-center justify-between shadow-2xs hover:border-slate-400 cursor-pointer transition-all group"
            title="Consultar repositório documental, atas emitidas, status de assinaturas e livro físico"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-700 transition-colors truncate">
                    4. Histórico & Documentos
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Livro Físico
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                  <span className="text-emerald-600 font-semibold">Dossiês & Atas</span> · Coleta Manuscrita
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
          </div>
        </div>
      ) : null}


      {/* 4. BLOCO SINTÉTICO CENTRAL: CONCLUSÃO PRINCIPAL + 3 PRIORIDADES / COMBINADOS */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
        {/* Lado Esquerdo (7 cols): Conclusão Sintética & Decisões Chave */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5 overflow-hidden">
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>Conclusão Executiva Principal</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[9px] bg-emerald-500/10 px-1.5 py-0.2 rounded">
                  SÍNTESE HOMOLOGADA
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 line-clamp-3">
                "{panel.summary.headline}"
              </p>
            </div>

            {/* Destaque das Decisões ou Encaminhamentos */}
            <div className="mt-0.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Decisões & Encaminhamentos Centrais
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                {panel.summary.keyDecisionsSummary}
              </p>
            </div>

            {/* Rastreabilidade e Governança */}
            <div className="mt-0.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate">
                Autor: <strong className="text-slate-700 dark:text-slate-300 font-mono">{panel.ownerName}</strong> · Versão: <strong className="text-slate-700 dark:text-slate-300 font-mono">{panel.version}</strong>
              </span>
              {panel.humanReview?.reviewedAt && (
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] shrink-0">
                  Revisado por {panel.humanReview.reviewedBy}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lado Direito (5 cols): As 3 Prioridades do Dia / Metas / Combinados */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-1 overflow-hidden">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              <span>
                {panel.templateType === 'TPL-01' ? 'Top 3 Prioridades do Turno' :
                 panel.templateType === 'TPL-02' ? 'Prioridades da Próxima Semana' :
                 panel.templateType === 'TPL-03' ? 'Combinados & Próximos Passos' :
                 'Próximas Entregas Críticas'}
              </span>
              <span className="text-[11px] font-mono font-bold text-[#134F9F] dark:text-blue-400">
                {panel.summary.topPriorities.length} ITENS
              </span>
            </div>

            <div className="flex-1 min-h-0 flex flex-col justify-between gap-1 overflow-hidden">
              {panel.summary.topPriorities.slice(0, 3).map((item, index) => (
                <div 
                  key={index}
                  className="p-1.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-1.5 hover:border-blue-500/40 transition-colors"
                >
                  <span className="w-4 h-4 rounded-full bg-[#134F9F]/10 text-[#134F9F] dark:text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug line-clamp-1">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenDetailDrawer}
              className="mt-0.5 pt-1 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              <span>Ver todas as seções e evidências ({panel.detail.sections.length} seções)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. FOOTER COMPACTO COM ATALHOS ANALÍTICOS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 shadow-2xs shrink-0">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Contrato Canônico HEAL Ops 1.1 · Resolução desktop sem rolagem vertical</span>
        </div>

        <div className="flex items-center gap-2.5">
          {onBackToCatalog && (
            <button
              type="button"
              onClick={onBackToCatalog}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium cursor-pointer"
            >
              ← Voltar ao Catálogo
            </button>
          )}
          <button
            type="button"
            onClick={onOpenDetailDrawer}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            Abrir Visão Analítica Completa →
          </button>
        </div>
      </div>
    </div>
  );
};
