/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Componente Sintético Executivo Padronizado para Templates (TPL-01, TPL-02, TPL-03, TPL-04)
 * REGRA MANDATÓRIA: SINTÉTICO PRIMEIRO, ANALÍTICO SOB DEMANDA.
 * Zero-scroll no desktop (100% contido no viewport), revelação analítica apenas sob demanda.
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
  Check
} from 'lucide-react';
import { ArtifactPanel } from '../../types';
import { EvidenceBadge } from '../common/EvidenceBadge';

interface TemplateSyntheticDashboardProps {
  panel: ArtifactPanel;
  onOpenPresentation: () => void;
  onOpenDetailDrawer: () => void;
  onOpenHumanReview?: () => void;
  onBackToCatalog?: () => void;
  onOpenTicketById?: (ticketId: number) => void;
  isCompactChatMode?: boolean;
}

export const TemplateSyntheticDashboard: React.FC<TemplateSyntheticDashboardProps> = ({
  panel,
  onOpenPresentation,
  onOpenDetailDrawer,
  onOpenHumanReview,
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
          label: 'Feedback Individual',
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

  return (
    <div className={`w-full h-full flex flex-col justify-between gap-2.5 overflow-hidden ${isCompactChatMode ? 'p-1' : ''}`}>
      {/* 1. HEADER EXECUTIVO COMPACTO */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-2 rounded-lg border ${badgeConfig.color} shrink-0`}>
            <TemplateIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeConfig.color}`}>
                {panel.templateType}
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Ref: <strong className="text-slate-800 dark:text-slate-200">{panel.referenceDate}</strong>
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Fonte: <strong className="text-slate-800 dark:text-slate-200">{panel.source}</strong>
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                panel.status === 'APROVADO'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                {panel.status === 'APROVADO' ? '✓ HOMOLOGADO' : '✎ RASCUNHO / EM REVISÃO'}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
              {panel.title}
            </h2>
          </div>
        </div>

        {/* Ações Gerenciais no Topo */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenHumanReview && (
            <button
              type="button"
              onClick={onOpenHumanReview}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
              title="Revisão Humana e Homologação"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Revisão Humana</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenDetailDrawer}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-md transition-colors cursor-pointer"
            title="Ver Evidências e Detalhes Analíticos"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Evidências & Detalhes</span>
          </button>

          <button
            type="button"
            onClick={onOpenPresentation}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer"
            title="Apresentar em Reunião Executiva"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Apresentar</span>
          </button>
        </div>
      </div>

      {/* 2. LINHA DE 4 KPIs MANDATÓRIOS DO TEMPLATE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 shrink-0">
        {panel.summary.metricsBrief && panel.summary.metricsBrief.slice(0, 4).map((metric, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 flex flex-col justify-between shadow-2xs hover:border-blue-500/30 transition-colors"
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
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
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

      {/* 3. BLOCO SINTÉTICO CENTRAL: CONCLUSÃO PRINCIPAL + 3 PRIORIDADES / COMBINADOS */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-2.5 overflow-hidden">
        {/* Lado Esquerdo (7 cols): Conclusão Sintética & Decisões Chave */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-2 overflow-hidden">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>Conclusão Executiva Principal</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  SÍNTESE HOMOLOGADA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                "{panel.summary.headline}"
              </p>
            </div>

            {/* Destaque das Decisões ou Encaminhamentos */}
            <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Decisões & Encaminhamentos Centrais
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                {panel.summary.keyDecisionsSummary}
              </p>
            </div>

            {/* Rastreabilidade e Governança */}
            <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
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
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5 overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>
                {panel.templateType === 'TPL-01' ? 'Top 3 Prioridades do Turno' :
                 panel.templateType === 'TPL-02' ? 'Prioridades da Próxima Semana' :
                 panel.templateType === 'TPL-03' ? 'Combinados & Próximos Passos' :
                 'Próximas Entregas Críticas'}
              </span>
              <span className="text-xs font-mono font-bold text-[#134F9F] dark:text-blue-400">
                {panel.summary.topPriorities.length} ITENS
              </span>
            </div>

            <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5 overflow-hidden">
              {panel.summary.topPriorities.slice(0, 3).map((item, index) => (
                <div 
                  key={index}
                  className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-2 hover:border-blue-500/40 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-[#134F9F]/10 text-[#134F9F] dark:text-blue-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug line-clamp-2">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenDetailDrawer}
              className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              <span>Ver todas as seções e evidências ({panel.detail.sections.length} seções)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. FOOTER COMPACTO COM ATALHOS ANALÍTICOS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 shadow-2xs shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Contrato Canônico HEAL Ops 1.1 · Resolução desktop sem rolagem vertical</span>
        </div>

        <div className="flex items-center gap-3">
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
