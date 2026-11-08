/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Drawer Analítico Sob Demanda para Artefatos Gerenciais (TPL-01 a TPL-04)
 * REGRA MANDATÓRIA: SINTÉTICO PRIMEIRO, ANALÍTICO SOB DEMANDA.
 * Rolagem vertical permitida apenas dentro deste drawer analítico.
 */

import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  FileSpreadsheet, 
  Calendar, 
  User, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Presentation,
  Edit3,
  Copy,
  Printer
} from 'lucide-react';
import { ArtifactPanel, ArtifactSection } from '../../types';
import { EvidenceBadge } from '../common/EvidenceBadge';

interface TemplateDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  panel: ArtifactPanel;
  onOpenTicketById?: (ticketId: number) => void;
  onOpenPresentation?: () => void;
  onOpenHumanReview?: () => void;
}

export const TemplateDetailDrawer: React.FC<TemplateDetailDrawerProps> = ({
  isOpen,
  onClose,
  panel,
  onOpenTicketById,
  onOpenPresentation,
  onOpenHumanReview
}) => {
  if (!isOpen) return null;

  const [activeSectionIndex, setActiveSectionIndex] = useState<number | 'all'>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyMarkdown = () => {
    const text = `# ${panel.title}\nRef: ${panel.referenceDate} | Fonte: ${panel.source}\nStatus: ${panel.status}\n\n## Conclusão Sintética\n${panel.summary.headline}\n\n## Decisões & Encaminhamentos\n${panel.summary.keyDecisionsSummary}\n\n## Top Prioridades\n${panel.summary.topPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n` + 
      panel.detail.sections.map(s => `### ${s.title}\n${s.description || ''}\n${s.items.map(it => `- **${it.title}**: ${it.description || ''}${it.responsible ? ` (Resp: ${it.responsible})` : ''}`).join('\n')}`).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const visibleSections = activeSectionIndex === 'all' 
    ? panel.detail.sections 
    : [panel.detail.sections[activeSectionIndex as number]];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Drawer Container (Right side, responsive width) */}
      <div className="w-full max-w-2xl sm:max-w-3xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-250">
        {/* 1. DRAWER HEADER */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#134F9F]/10 text-[#134F9F] dark:text-blue-400 border border-[#134F9F]/20">
                {panel.templateType}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {panel.referenceDate}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                panel.status === 'APROVADO'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                {panel.status}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              Visão Analítica Completa & Evidências
            </h2>
            <p className="text-xs text-slate-500 truncate">
              {panel.title} · Autor: {panel.ownerName} · Fonte: {panel.source}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenPresentation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPresentation();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer"
                title="Apresentar em Modo Slides"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Apresentar</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              title="Copiar Relatório Completo"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. BARRA DE FILTRO POR SEÇÃO */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSectionIndex('all')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors shrink-0 cursor-pointer ${
              activeSectionIndex === 'all'
                ? 'bg-[#134F9F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Todas as Seções ({panel.detail.sections.length})
          </button>
          {panel.detail.sections.map((section, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSectionIndex(idx)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors shrink-0 cursor-pointer truncate max-w-[180px] ${
                activeSectionIndex === idx
                  ? 'bg-[#134F9F] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* 3. CONTEÚDO ANALÍTICO ROLÁVEL (DETALHE PROFUNDO) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Banner de Rastreabilidade */}
          <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-3 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Governança de Evidências:</strong> Todas as métricas e itens listados abaixo foram extraídos do <strong>{panel.source}</strong> sob as diretrizes do contrato <strong>{panel.templateType}</strong> e auditados segundo o <strong>POP-TIN-017</strong>.
            </div>
          </div>

          {/* Seções Analíticas */}
          {visibleSections.map((section, sIdx) => (
            <div 
              key={sIdx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-3"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>{section.title}</span>
                  <span className="text-[11px] font-mono text-slate-400 font-normal">
                    {section.items.length} {section.items.length === 1 ? 'item' : 'itens'}
                  </span>
                </h3>
                {section.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {section.description}
                  </p>
                )}
              </div>

              {/* Lista de Itens Analíticos */}
              <div className="space-y-2.5">
                {section.items.map((item, itIdx) => (
                  <div 
                    key={itIdx}
                    className="p-3 rounded-lg bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 hover:border-blue-500/30 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Nível de Evidência Auditável */}
                      {item.evidenceLevel && (
                        <div className="shrink-0">
                          <EvidenceBadge level={item.evidenceLevel} size="sm" />
                        </div>
                      )}
                    </div>

                    {/* Metadados: Responsável, Prazo, Ticket Vinculado */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-3 flex-wrap">
                        {item.responsible && (
                          <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                            <User className="w-3 h-3 text-slate-400" />
                            <strong>{item.responsible}</strong>
                          </span>
                        )}
                        {item.deadline && (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{item.deadline}</span>
                          </span>
                        )}
                      </div>

                      {/* Link direto para auditar chamado no GLPI */}
                      {item.relatedTicketId && onOpenTicketById && (
                        <button
                          type="button"
                          onClick={() => onOpenTicketById(item.relatedTicketId!)}
                          className="inline-flex items-center gap-1 font-semibold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          <span>Auditar Chamado #{item.relatedTicketId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Notas de Governança e Limitações do Snapshot */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Notas de Auditoria & Limitações do Artefato</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {panel.detail.governanceNotes || 'Artefato homologado com extração determinística via réplica de leitura GLPI MariaDB. Snapshots oficiais congelados às 04h00 diárias.'}
            </p>
            {panel.detail.limitations && panel.detail.limitations.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <span className="font-semibold block text-slate-600 dark:text-slate-400">Limitações observadas:</span>
                {panel.detail.limitations.map((lim, lIdx) => (
                  <p key={lIdx}>• {lim}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. FOOTER DO DRAWER */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Versão congelada <strong className="font-mono text-slate-700 dark:text-slate-300">{panel.version}</strong>
          </div>

          <div className="flex items-center gap-2">
            {onOpenHumanReview && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHumanReview();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-md cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Revisar Painel</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md cursor-pointer transition-colors"
            >
              Fechar Visualização Analítica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
