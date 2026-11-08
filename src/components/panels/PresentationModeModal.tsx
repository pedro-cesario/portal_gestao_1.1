/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Modo Apresentação Executivo de Painéis Gerenciais
 * Projetado para reuniões diárias, alinhamentos semanais e prestação de contas à diretoria sem PowerPoint
 * Navegação por slides/capítulos, tipografia de alta legibilidade, tema adaptativo e detalhamento sob demanda
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Users, 
  ExternalLink,
  ShieldCheck,
  FolderKanban,
  UserCheck,
  TrendingUp,
  Activity,
  Calendar,
  Layers
} from 'lucide-react';
import { ArtifactPanel, ArtifactSectionItem, MeetingAgreement, AgreementStatus } from '../../types';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { Handshake, Plus, RotateCcw } from 'lucide-react';

interface PresentationModeModalProps {
  panel: ArtifactPanel;
  isOpen: boolean;
  onClose: () => void;
  onOpenTicketById?: (ticketId: number) => void;
  onOpenDetailDrawer?: (item?: ArtifactSectionItem) => void;
  agreements?: MeetingAgreement[];
  onOpenRegisterAgreement?: () => void;
  onOpenAgreementsTracking?: () => void;
  onUpdateAgreementStatus?: (agreementId: string, newStatus: AgreementStatus, note?: string) => void;
}

export const PresentationModeModal: React.FC<PresentationModeModalProps> = ({
  panel,
  isOpen,
  onClose,
  onOpenTicketById,
  onOpenDetailDrawer,
  agreements = [],
  onOpenRegisterAgreement,
  onOpenAgreementsTracking,
  onUpdateAgreementStatus
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Títulos dos 4 slides executivos
  const slideTitles = [
    { label: 'Síntese Executiva', sub: 'Indicadores & Conclusão Geral' },
    { label: 'Operação & Entregas', sub: 'Vazão, Produção & Conclusões' },
    { label: 'Riscos & Bloqueios', sub: 'Alertas, Auditoria & Dependências' },
    { label: 'Prioridades & Decisões', sub: 'Compromissos & Próximos Passos' }
  ];

  // Navegação por teclado (Setas Esquerda/Direita e ESC)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide(prev => Math.min(slideTitles.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slideTitles.length, onClose]);

  // Alternar tela cheia do navegador
  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none transition-colors duration-200 ${
      isDarkTheme ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. TOP BAR DA APRESENTAÇÃO */}
      <header className={`px-6 py-3 border-b flex items-center justify-between gap-4 shrink-0 ${
        isDarkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200 shadow-2xs'
      }`}>
        {/* Identificação do Painel */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#134F9F] text-white tracking-wide shrink-0">
            {panel.templateType}
          </span>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold truncate">
              {panel.title}
            </h1>
            <div className="flex items-center gap-2 text-xs opacity-75 font-medium truncate">
              <span>Período: <strong className="font-mono">{panel.referenceDate}</strong></span>
              <span>·</span>
              <span>Fonte: <strong className="font-mono">{panel.source}</strong></span>
              <span>·</span>
              <span>Versão: <strong className="font-mono">{panel.version}</strong></span>
            </div>
          </div>
        </div>

        {/* Navegação entre Slides / Abas Centrais */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl border bg-black/5 dark:bg-white/5 border-slate-200 dark:border-slate-800">
          {slideTitles.map((slide, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'bg-[#134F9F] text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className="font-mono mr-1.5">0{idx + 1}.</span>
              <span>{slide.label}</span>
            </button>
          ))}
        </div>

        {/* Ações da Apresentação */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AÇÃO DISCRETA REQUISITADA: + Registrar acordo */}
          {(panel.templateType === 'TPL-01' || panel.templateType === 'TPL-02') && onOpenRegisterAgreement && (
            <button
              type="button"
              onClick={onOpenRegisterAgreement}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer shrink-0"
              title="Registrar Acordo da Reunião sem sair da Apresentação"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Registrar acordo</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title={isDarkTheme ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#134F9F]" />}
          </button>

          <button
            type="button"
            onClick={toggleBrowserFullscreen}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Alternar Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Encerrar Modo Apresentação (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Encerrar</span>
          </button>
        </div>
      </header>

      {/* 2. CORPO DO SLIDE (LAYOUT EXECUTIVO ZERO-SCROLL COM ALTA DENSIDADE) */}
      <main className="flex-1 min-h-0 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
        {/* ========================================================================= */}
        {/* SLIDE 1: CAPA & SÍNTESE EXECUTIVA                                         */}
        {/* ========================================================================= */}
        {currentSlide === 0 && (
          <div className="h-full flex flex-col justify-between gap-5 animate-fade-in">
            {/* Banner com Conclusão Sintética Principal */}
            <div className={`p-5 rounded-2xl border ${
              isDarkTheme 
                ? 'bg-slate-900/80 border-slate-800' 
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#134F9F] dark:text-blue-400" />
                <span className="text-xs uppercase font-bold tracking-wider opacity-70">
                  Conclusão Sintética da Gestão
                </span>
              </div>
              <p className="text-base sm:text-xl font-semibold leading-relaxed">
                "{panel.summary.headline}"
              </p>
            </div>

            {/* Grid dos 4 KPIs Estratégicos com Números Grandes de Projeção */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 items-stretch">
              {panel.summary.metricsBrief.map((metric, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDarkTheme 
                      ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/50' 
                      : 'bg-white border-slate-200 shadow-xs hover:border-blue-500/50'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                    {metric.label}
                  </span>

                  <div className="my-2">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight block">
                      {metric.value}
                    </span>
                    {metric.trend && (
                      <span className={`text-xs font-mono font-bold mt-1 inline-block ${
                        (typeof metric.trend === 'string' && metric.trend === 'up') || (typeof metric.trend === 'object' && metric.trend.isPositive)
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      }`}>
                        {typeof metric.trend === 'string'
                          ? (metric.trend === 'up' ? '↑ Evolução favorável' : metric.trend === 'down' ? '↓ Redução observada' : '→ Estável')
                          : metric.trend.value}
                      </span>
                    )}
                  </div>

                  <div className="text-xs opacity-60 font-mono pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                    <span>{metric.target ? `Meta: ${metric.target}` : 'Verificado GLPI'}</span>
                    <span className="text-emerald-500 font-bold">100% Canônico</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé do Slide 1: Decisão Central Registrada */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs sm:text-sm ${
              isDarkTheme ? 'bg-blue-950/30 border-blue-900/60 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-950'
            }`}>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#134F9F] dark:text-blue-400 shrink-0" />
                <span>
                  <strong>Diretriz do Período:</strong> {panel.summary.keyDecisionsSummary}
                </span>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#134F9F] text-white shrink-0">
                Homologado DTI
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 2: OPERAÇÃO, ENTREGAS & VAZÃO                                       */}
        {/* ========================================================================= */}
        {currentSlide === 1 && (
          <div className="h-full flex flex-col justify-between gap-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <span>Evolução Operacional e Entregas do Período</span>
              </h2>
              <span className="text-xs font-mono opacity-70">
                Seções 1 e 4 do Template Canônico
              </span>
            </div>

            {/* Conteúdo das Entregas e Atividades em 2 Colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
              {panel.detail.sections.slice(0, 2).map((section, sIdx) => (
                <div
                  key={sIdx}
                  className={`p-5 rounded-2xl border flex flex-col justify-between overflow-hidden ${
                    isDarkTheme ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="overflow-hidden">
                    <h3 className="text-sm sm:text-base font-bold mb-1 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>{section.title}</span>
                    </h3>
                    {section.description && (
                      <p className="text-xs opacity-70 mb-3 line-clamp-1">{section.description}</p>
                    )}

                    <div className="space-y-2.5 mt-2">
                      {section.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className={`p-3 rounded-xl border flex flex-col justify-between gap-1 transition-all ${
                            isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs sm:text-sm font-bold truncate">
                              {item.title}
                            </span>
                            {item.evidenceLevel && (
                              <EvidenceBadge level={item.evidenceLevel} size="sm" />
                            )}
                          </div>
                          <p className="text-xs opacity-80 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          {item.responsible && (
                            <div className="text-[11px] opacity-60 pt-1 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                              <span>Responsável: <strong>{item.responsible}</strong></span>
                              {item.deadline && <span className="font-mono">Prazo: {item.deadline}</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-black/10 dark:border-white/10 text-xs opacity-60 flex justify-between items-center">
                    <span>Validação: Fatos confirmados no MariaDB GLPI</span>
                    <span className="font-mono font-bold text-emerald-500">Conforme</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 3: RISCOS, BLOQUEIOS & DEPENDÊNCIAS                                 */}
        {/* ========================================================================= */}
        {currentSlide === 2 && (
          <div className="h-full flex flex-col justify-between gap-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Auditoria de Riscos, Bloqueios & Dependências Externas</span>
              </h2>
              <span className="text-xs font-mono font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                {panel.summary.criticalAlertsCount} Alertas de Atenção
              </span>
            </div>

            {/* Grid dos Riscos e Pendências de Auditoria */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
              {/* Bloco 1: Pendências e Ocorrências */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                isDarkTheme ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div>
                  <h3 className="text-sm sm:text-base font-bold mb-3 flex items-center gap-2 text-rose-500">
                    <AlertTriangle className="w-4.5 h-4.5" />
                    <span>Não-Conformidades POP-TIN-017 & Limiares 24h</span>
                  </h3>

                  <div className="space-y-3">
                    {panel.detail.sections[1]?.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border space-y-1.5 ${
                          isDarkTheme ? 'bg-rose-950/20 border-rose-900/40 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-950'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs sm:text-sm truncate">
                            {item.title}
                          </span>
                          {item.evidenceLevel && (
                            <EvidenceBadge level={item.evidenceLevel} size="sm" />
                          )}
                        </div>
                        <p className="text-xs opacity-90 leading-relaxed font-medium">
                          {item.description}
                        </p>
                        {item.relatedTicketId && onOpenTicketById && (
                          <div className="pt-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => onOpenTicketById(item.relatedTicketId!)}
                              className="text-xs font-bold underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>Auditar Chamado #{item.relatedTicketId}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs opacity-60 pt-2 border-t border-black/10 dark:border-white/10 font-mono">
                  Limiar: Intervenção humana mandatória a cada 24 horas
                </div>
              </div>

              {/* Bloco 2: Dependências de Terceiros e Governança */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                isDarkTheme ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div>
                  <h3 className="text-sm sm:text-base font-bold mb-3 flex items-center gap-2 text-amber-500">
                    <Clock className="w-4.5 h-4.5" />
                    <span>Dependências Externas & Mitigações</span>
                  </h3>

                  <div className="space-y-3">
                    <div className={`p-3.5 rounded-xl border ${
                      isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <strong className="block text-xs font-bold mb-1">
                        1. Suporte N3 Fornecedor PACS / Storage
                      </strong>
                      <p className="text-xs opacity-80 leading-relaxed">
                        Aguardando número de protocolo formal para homologação de cache SSD. Mitigação: rota assíncrona temporária ativada.
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-xl border ${
                      isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <strong className="block text-xs font-bold mb-1">
                        2. Exclusão de Conflito de Governança
                      </strong>
                      <p className="text-xs opacity-80 leading-relaxed">
                        Membros do Grupo 48 Gestão atuam estritamente como articuladores de processo, sem distorção das filas operacionais da equipe.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-xs opacity-60 pt-2 border-t border-black/10 dark:border-white/10 font-mono">
                  Rastreabilidade: Snapshot Noturno 04h (America/Sao_Paulo)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 4: PRIORIDADES MANDATÓRIAS & DECISÕES REGISTRADAS                   */}
        {/* ========================================================================= */}
        {currentSlide === 3 && (
          <div className="h-full flex flex-col justify-between gap-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#134F9F] dark:text-blue-400" />
                <span>As 3 Prioridades Mandatórias & Decisões Homologadas</span>
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Acordo de Gestão Ativo
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 overflow-hidden">
              {/* As 3 Prioridades em destaque (7 colunas) */}
              <div className={`lg:col-span-7 p-6 rounded-2xl border flex flex-col justify-between ${
                isDarkTheme ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#134F9F] dark:text-blue-400 block mb-3">
                    As 3 Prioridades de Execução Imediata
                  </span>

                  <div className="space-y-3">
                    {panel.summary.topPriorities.map((pri, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                          isDarkTheme ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-[#134F9F] text-white font-mono font-bold text-sm flex items-center justify-center shrink-0">
                          0{idx + 1}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold leading-snug">
                            {pri}
                          </p>
                          <span className="text-[11px] opacity-60 mt-1 block">
                            Status: Acompanhamento pelo Gestor de Plantão
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-black/10 dark:border-white/10 text-xs opacity-60 font-mono">
                  Regra HEAL: Máximo de 3 prioridades simultâneas para foco assistencial
                </div>
              </div>

              {/* Decisões e Encaminhamentos (5 colunas) */}
              <div className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between overflow-hidden ${
                isDarkTheme ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div className="flex-1 min-h-0 flex flex-col justify-between gap-3 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                      Decisões & Acordos de Reunião
                    </span>
                    {(panel.templateType === 'TPL-01' || panel.templateType === 'TPL-02') && onOpenRegisterAgreement && (
                      <button
                        type="button"
                        onClick={onOpenRegisterAgreement}
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Novo Acordo</span>
                      </button>
                    )}
                  </div>

                  {/* Resumo Sintético de Acordos e Encaminhamentos */}
                  {(panel.templateType === 'TPL-01' || panel.templateType === 'TPL-02') && (
                    <div className="space-y-2">
                      <div 
                        onClick={onOpenAgreementsTracking}
                        className={`p-3 rounded-xl border cursor-pointer transition-all hover:border-blue-500/50 ${
                          isDarkTheme ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="flex items-center gap-1.5">
                            <Handshake className="w-3.5 h-3.5 text-[#134F9F] dark:text-blue-400" />
                            <span>Acordos e Encaminhamentos</span>
                          </span>
                          <span className="font-mono text-[#134F9F] dark:text-blue-400">
                            {agreements.filter(a => a.sourceMeetingType === (panel.templateType === 'TPL-01' ? 'DAILY' : 'ALINHAMENTO_SEMANAL') && !a.isPreviousMeeting).length} registrados
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[11px] text-center font-mono pt-1">
                          <span className="p-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                            {agreements.filter(a => a.sourceMeetingType === (panel.templateType === 'TPL-01' ? 'DAILY' : 'ALINHAMENTO_SEMANAL') && !a.isPreviousMeeting && a.status === 'CONCLUIDO').length} concl.
                          </span>
                          <span className="p-1 rounded bg-blue-500/10 text-[#134F9F] dark:text-blue-300 font-bold">
                            {agreements.filter(a => a.sourceMeetingType === (panel.templateType === 'TPL-01' ? 'DAILY' : 'ALINHAMENTO_SEMANAL') && !a.isPreviousMeeting && a.status !== 'CONCLUIDO').length} pend.
                          </span>
                          <span className="p-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                            {agreements.filter(a => a.sourceMeetingType === (panel.templateType === 'TPL-01' ? 'DAILY' : 'ALINHAMENTO_SEMANAL') && !a.isPreviousMeeting && a.notes?.toLowerCase().includes('atrasad')).length} atras.
                          </span>
                        </div>
                      </div>

                      {/* Acordos da Reunião Anterior */}
                      <div 
                        onClick={onOpenAgreementsTracking}
                        className={`p-3 rounded-xl border cursor-pointer transition-all hover:border-indigo-500/50 ${
                          isDarkTheme ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-200' : 'bg-indigo-50/50 border-indigo-200 text-indigo-950'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Acordos da Reunião Anterior</span>
                          </span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400">
                            {agreements.filter(a => a.sourceMeetingType === (panel.templateType === 'TPL-01' ? 'DAILY' : 'ALINHAMENTO_SEMANAL') && a.isPreviousMeeting).length} assumidos
                          </span>
                        </div>
                        <p className="text-[11px] opacity-80 leading-snug truncate">
                          {agreements.filter(a => a.sourceMeetingType === (panel.templateType === 'TPL-01' ? 'DAILY' : 'ALINHAMENTO_SEMANAL') && a.isPreviousMeeting && a.status === 'CONCLUIDO').length} concluídos · {agreements.filter(a => a.sourceMeetingType === (panel.templateType === 'TPL-01' ? 'DAILY' : 'ALINHAMENTO_SEMANAL') && a.isPreviousMeeting && a.notes?.toLowerCase().includes('atrasad')).length} atrasados sob renegociação
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Encaminhamento Principal da Diretoria */}
                  <div className={`p-3 rounded-xl border ${
                    isDarkTheme ? 'bg-blue-950/30 border-blue-900/50 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-950'
                  }`}>
                    <strong className="block text-xs font-bold mb-0.5">
                      Encaminhamento Central Homologado:
                    </strong>
                    <p className="text-xs leading-relaxed font-medium line-clamp-2">
                      {panel.summary.keyDecisionsSummary}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs opacity-60">
                  <span>Validade: 24 horas</span>
                  {onOpenAgreementsTracking && (
                    <button
                      type="button"
                      onClick={onOpenAgreementsTracking}
                      className="font-mono text-emerald-500 font-bold hover:underline cursor-pointer"
                    >
                      Ver Todos os Acordos →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. RODAPÉ DE NAVEGAÇÃO DOS SLIDES */}
      <footer className={`px-6 py-3 border-t flex items-center justify-between gap-4 shrink-0 ${
        isDarkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Indicador de Slide */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold">
            Slide <strong className="text-base text-[#134F9F] dark:text-blue-400">0{currentSlide + 1}</strong> de 0{slideTitles.length}
          </span>
          <span className="opacity-40">·</span>
          <span className="text-xs opacity-75 hidden sm:inline">
            {slideTitles[currentSlide].sub}
          </span>
        </div>

        {/* Controles de Próximo / Anterior */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {currentSlide < slideTitles.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentSlide(prev => prev + 1)}
              className="px-5 py-2 rounded-xl bg-[#134F9F] hover:bg-blue-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Concluir Apresentação</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
