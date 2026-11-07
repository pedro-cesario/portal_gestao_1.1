/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Visão Geral (Central de Comando Executiva)
 * 100% CONSOLIDADA EM UMA ÚNICA PÁGINA COM USO DINÂMICO DO ESPAÇO E ZERO SCROLL
 * Reorganização estrutural completa: eliminação de sobreposição de elementos,
 * cards perfeitamente dimensionados e rodapé integrado e sem colisões.
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  UserX, 
  Activity, 
  Server, 
  Layers, 
  FileText, 
  Sparkles, 
  Info, 
  Calendar, 
  ExternalLink,
  Maximize2,
  SlidersHorizontal,
  Users,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Ticket, AuditSnapshot, EvidenceLevel } from '../../types';
import { SyntheticMetricCard } from '../common/SyntheticMetricCard';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { DetailDrawer } from '../common/DetailDrawer';
import { Modal } from '../common/Modal';
import { TicketStatusText, ManagerialPriorityTag } from '../common/StatusTag';

interface OverviewViewProps {
  tickets: Ticket[];
  latestAudit: AuditSnapshot;
  onNavigateToTicket: (ticketId: number) => void;
  onNavigateToRoute: (route: any) => void;
  dataSource: 'REALTIME' | 'SNAPSHOT_04H';
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  tickets,
  latestAudit,
  onNavigateToTicket,
  onNavigateToRoute,
  dataSource
}) => {
  // Estados para Nível 2 e Modal Ampliado
  const [selectedKpiDrilldown, setSelectedKpiDrilldown] = useState<string | null>(null);
  const [selectedRiskTicket, setSelectedRiskTicket] = useState<Ticket | null>(null);
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);
  const [maximizedCard, setMaximizedCard] = useState<'priorities' | 'health' | 'team' | null>(null);

  // Cálculos sintéticos operacionais
  const openTickets = tickets.filter(t => t.status !== 'fechado' && t.status !== 'solucionado');
  const unassignedTickets = tickets.filter(t => !t.hasNominalTech && t.status !== 'fechado' && t.status !== 'solucionado');
  const noEvolution24hTickets = tickets.filter(t => t.isWithoutEvolution24h && t.status !== 'fechado' && t.status !== 'solucionado');
  const inProgressTickets = tickets.filter(t => t.status === 'em_atendimento');
  const newTickets = tickets.filter(t => t.status === 'novo');
  const solvedCount = 80;

  // As 3 Prioridades Operacionais Imediatas (Mandatório: até 3 prioridades na síntese)
  const top3Priorities = tickets
    .filter(t => t.suggestedPriority === 'P1_CRITICA' || t.isWithoutEvolution24h || !t.hasNominalTech)
    .slice(0, 3);

  return (
    <div className="w-full h-full flex flex-col p-2.5 sm:p-3.5 overflow-hidden gap-2 sm:gap-2.5">
      {/* 1. BARRA SUPERIOR: CONEXÃO GLPI & STATUS DE OPERAÇÃO (COMPACTA E SEM SOBREPOSIÇÃO) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Server className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Conexão GLPI:
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Réplica Read-Only · <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{dataSource}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-500 dark:text-slate-400 hidden md:inline text-xs">
              Snapshot: <strong className="text-slate-700 dark:text-slate-300 font-mono">04:00 (Brasília)</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFormulaModal(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-md transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Exibir fórmulas de cálculo e tempo médio"
          >
            <Info className="w-3.5 h-3.5 text-[#134F9F] dark:text-blue-400" />
            <span>Fórmulas</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToRoute('agente-gerencial')}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerar Daily</span>
          </button>
        </div>
      </div>

      {/* 2. FAIXA DE 6 KPIS ESSENCIAIS CONSOLIDADOS (COMPACTOS PARA ECONOMIZAR ESPAÇO VERTICAL) */}
      <section aria-label="KPIs Operacionais Essenciais" className="shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <SyntheticMetricCard
            label="Chamados Abertos"
            value={openTickets.length}
            subtext="Fila ativa em atendimento"
            trend={{ value: "+2 hoje", isPositive: false }}
            onClickDetail={() => setSelectedKpiDrilldown('abertos')}
            ctaText="Ver lista"
            compact={true}
          />

          <SyntheticMetricCard
            label="Novos / Em Andamento"
            value={`${newTickets.length} / ${inProgressTickets.length}`}
            subtext="4 aguardando triagem"
            alertLevel="info"
            onClickDetail={() => setSelectedKpiDrilldown('novos')}
            ctaText="Detalhar"
            compact={true}
          />

          <SyntheticMetricCard
            label="Sem Técnico Nominal"
            value={unassignedTickets.length}
            subtext="Apenas grupo atribuído"
            alertLevel={unassignedTickets.length > 0 ? "critical" : "none"}
            onClickDetail={() => setSelectedKpiDrilldown('sem_tecnico')}
            ctaText="Atribuir"
            compact={true}
          />

          <SyntheticMetricCard
            label="Sem Evolução 24h"
            value={noEvolution24hTickets.length}
            subtext="Limiar POP-TIN-017"
            alertLevel={noEvolution24hTickets.length > 0 ? "warning" : "none"}
            onClickDetail={() => setSelectedKpiDrilldown('sem_evolucao')}
            ctaText="Auditar"
            compact={true}
          />

          <SyntheticMetricCard
            label="Solucionados (7d)"
            value={solvedCount}
            subtext="Com evidência comprovada"
            trend={{ value: "98% conf.", isPositive: true }}
            onClickDetail={() => setSelectedKpiDrilldown('solucionados')}
            ctaText="Histórico"
            compact={true}
          />

          <SyntheticMetricCard
            label="Tempo Médio Obs."
            value="18.2h"
            subtext="Abertura a solução"
            formulaExplanation="Fórmula: Σ(Data Solução - Data Abertura) / Total Concluídos no período de 7 dias. Não equivale a SLA ou MTTR."
            onClickDetail={() => setShowFormulaModal(true)}
            ctaText="Fórmula"
            compact={true}
          />
        </div>
      </section>

      {/* 3. GRADE CENTRAL CONSOLIDADA EM 3 COLUNAS (ZERO CLIPPING, NENHUMA SOBREPOSIÇÃO) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2.5 overflow-hidden">
        {/* COLUNA 1: AS 3 PRIORIDADES DO PLANTÃO */}
        <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between shadow-2xs hover:border-blue-500/50 transition-colors overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  As 3 Prioridades do Plantão
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMaximizedCard('priorities')}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                title="Aumentar Visualização das Prioridades"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Lista dos 3 itens prioritários em cards compactos */}
            <div className="flex-1 flex flex-col justify-between gap-1.5 overflow-hidden">
              {top3Priorities.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedRiskTicket(ticket)}
                  className="p-2 sm:p-2.5 rounded-md bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/60 cursor-pointer transition-all group shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-mono text-xs font-bold text-[#134F9F] dark:text-blue-400">
                        #{ticket.id}
                      </span>
                      <ManagerialPriorityTag priority={ticket.suggestedPriority} />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 line-clamp-1">
                      {ticket.title}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center mt-1 pt-1 border-t border-slate-200/50 dark:border-slate-800/60">
                    <span className="truncate max-w-[140px] font-medium">{ticket.hospitalLocation}</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {ticket.technicianName?.split(' ')[0] || 'Sem técnico'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="text-[11px] text-slate-500 font-mono">POP-TIN-017 Vigente</span>
            <button
              type="button"
              onClick={() => onNavigateToRoute('chamados')}
              className="font-bold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Ver chamados</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* COLUNA 2: SAÚDE OPERACIONAL & SNAPSHOT 04H */}
        <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between shadow-2xs hover:border-blue-500/50 transition-colors overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-[#134F9F] dark:text-blue-400 shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  Saúde Operacional & Snapshot 04h
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMaximizedCard('health')}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                title="Aumentar Visualização da Auditoria"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Informações de Saúde Consolidada com distribuição fluida */}
            <div className="flex-1 flex flex-col justify-between gap-2 overflow-hidden">
              <div className="p-2 sm:p-2.5 rounded-md bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-slate-800 dark:text-slate-200 font-bold text-xs">
                  <span>Conformidade Documental</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-sm">88.5%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '88.5%' }} />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">Meta institucional: &ge; 85% de conformidade</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">Novas no snapshot 04h:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-xs">+{latestAudit.newPendingsCount}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">Persistentes (&gt;24h sem ação):</span>
                  <span className="font-mono font-bold text-rose-700 dark:text-rose-400 text-xs">{latestAudit.persistentPendingsCount}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 px-2 rounded bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">Resolvidas com comprovação:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">{latestAudit.resolvedWithEvidenceCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <button
              type="button"
              onClick={() => onNavigateToRoute('auditorias')}
              className="text-[#134F9F] dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Ver Auditoria 04h</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-500 font-mono">Snapshot Diário</span>
          </div>
        </div>

        {/* COLUNA 3: CAPACIDADE E DISTRIBUIÇÃO DA EQUIPE */}
        <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between shadow-2xs hover:border-blue-500/50 transition-colors overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  Capacidade da Equipe & Carteiras
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMaximizedCard('team')}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                title="Aumentar Visualização da Equipe"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Indicadores Consolidados da Equipe */}
            <div className="flex-1 flex flex-col justify-between gap-2 overflow-hidden">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-mono font-bold">Técnicos Ativos</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-base block mt-0.5">5 operacionais</span>
                </div>
                <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-mono font-bold">Carga Média</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-base block mt-0.5">6.6 chamados</span>
                </div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-950 dark:text-blue-300">
                <strong className="block mb-0.5 font-bold">Governança DTI: Grupo 48 Gestão</strong>
                2 gestores dedicados à auditoria e conformidade, excluídos da distribuição operacional.
              </div>

              <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="font-bold text-[11px]">Equilíbrio de Carga:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-xs">92% (Normal)</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-400 text-[11px] font-mono">5 técnicos alocados</span>
            <button
              type="button"
              onClick={() => onNavigateToRoute('equipe')}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Ver carteiras</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. RODAPÉ EXECUTIVO CONSOLIDADO (REORGANIZADO: NUNCA SOBREPÕE OS CARDS, DOCK SLIM E INTEGRADO) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-between gap-3 text-xs shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 font-bold truncate">
            Central de Gestão HEAL Ops
          </span>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline truncate">
            Painel consolidado em página única sem rolagem vertical
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToRoute('chamados')}
            className="font-semibold text-slate-600 dark:text-slate-300 hover:text-[#134F9F] dark:hover:text-blue-400 transition-colors cursor-pointer text-xs"
          >
            Chamados
          </button>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <button
            type="button"
            onClick={() => onNavigateToRoute('pendencias')}
            className="font-semibold text-slate-600 dark:text-slate-300 hover:text-[#134F9F] dark:hover:text-blue-400 transition-colors cursor-pointer text-xs"
          >
            Pendências
          </button>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <button
            type="button"
            onClick={() => onNavigateToRoute('equipe')}
            className="font-semibold text-slate-600 dark:text-slate-300 hover:text-[#134F9F] dark:hover:text-blue-400 transition-colors cursor-pointer text-xs"
          >
            Equipe
          </button>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <button
            type="button"
            onClick={() => onNavigateToRoute('auditorias')}
            className="font-bold text-[#134F9F] dark:text-blue-400 hover:underline transition-colors cursor-pointer text-xs"
          >
            Auditorias
          </button>
        </div>
      </div>

      {/* MODAL DE AUMENTAR VISUALIZAÇÃO DE UM CARD DA VISÃO GERAL */}
      {maximizedCard && (
        <Modal
          isOpen={true}
          onClose={() => setMaximizedCard(null)}
          title={
            maximizedCard === 'priorities'
              ? 'As 3 Prioridades do Plantão (Visualização Ampliada)'
              : maximizedCard === 'health'
                ? 'Saúde Operacional & Snapshot 04h (Visualização Ampliada)'
                : 'Capacidade da Equipe Técnica & Carteiras (Visualização Ampliada)'
          }
          subtitle="Modo de análise aprofundada com todos os dados e trilhas factuais"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {maximizedCard === 'priorities' && (
              <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-300">
                  Os 3 chamados abaixo foram triados pelo motor determinístico como prioritários imediatos por envolverem risco clínico/assistencial ou violação direta das tolerâncias do POP-TIN-017:
                </p>
                <div className="space-y-3">
                  {top3Priorities.map(t => (
                    <div key={t.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#134F9F] dark:text-blue-400">
                          #{t.id} · {t.title}
                        </span>
                        <ManagerialPriorityTag priority={t.suggestedPriority} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <div>Setor: <strong className="text-slate-800 dark:text-slate-200">{t.hospitalLocation}</strong></div>
                        <div>Técnico: <strong className="text-slate-800 dark:text-slate-200">{t.technicianName || 'Sem técnico'}</strong></div>
                        <div>Última ação: <span className="font-mono text-slate-700 dark:text-slate-300">{t.lastHumanActionDate.replace('T', ' ').slice(0, 16)}</span></div>
                        <div>Status GLPI: <TicketStatusText status={t.status} /></div>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setMaximizedCard(null);
                            onNavigateToTicket(t.id);
                          }}
                          className="px-3 py-1.5 font-semibold text-xs text-white bg-[#134F9F] rounded hover:bg-blue-800 cursor-pointer"
                        >
                          Abrir Chamado Completo →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {maximizedCard === 'health' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-900/50">
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm mb-1">
                    Auditoria Canônica Noturna (04h00 BRT)
                  </h4>
                  <p className="text-xs text-blue-800/90 dark:text-blue-300">
                    A auditoria das 04h é o marco zero da governança diária. Todos os prazos e tolerâncias do POP-TIN-017 tomam este snapshot como base determinística.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                    <span className="text-xs text-slate-400 block font-semibold">Total Avaliado</span>
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">{latestAudit.totalTicketsEvaluated}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                    <span className="text-xs text-slate-400 block font-semibold">Persistentes</span>
                    <span className="text-2xl font-bold font-mono text-rose-500">{latestAudit.persistentPendingsCount}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                    <span className="text-xs text-slate-400 block font-semibold">Resolvidas c/ Evidência</span>
                    <span className="text-2xl font-bold font-mono text-emerald-500">{latestAudit.resolvedWithEvidenceCount}</span>
                  </div>
                </div>
              </div>
            )}

            {maximizedCard === 'team' && (
              <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-300">
                  Capacidade ativa consolidada da equipe de TI do Instituto HEAL:
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                    <strong className="block text-slate-900 dark:text-slate-100 text-sm mb-1">Suporte Presencial</strong>
                    <p className="text-slate-500">2 analistas alocados para atendimento assistencial e periféricos de triagem.</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                    <strong className="block text-slate-900 dark:text-slate-100 text-sm mb-1">Sistemas Clínicos (Tasy)</strong>
                    <p className="text-slate-500">2 analistas especialistas em prontuário eletrônico, PACS e farmácia.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* MODAL DE FÓRMULA DE CÁLCULO DE TEMPO MÉDIO */}
      <Modal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        title="Regra de Cálculo: Tempo Médio Observado"
        subtitle="Especificação matemática da métrica operacional em conformidade com o POP-TIN-017"
      >
        <div className="space-y-3 text-xs sm:text-sm">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            O <strong>Tempo Médio Observado</strong> reflete a média aritmética do tempo decorrido entre a data de abertura e a data da solução registrada nos chamados finalizados nos últimos 7 dias.
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-mono text-xs text-blue-900 dark:text-blue-300">
            Tempo Médio = Σ(Data Solução - Data Abertura) / Total de Chamados Solucionados
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded text-xs space-y-1">
            <strong className="block font-semibold">Nota de Governança Institucional:</strong>
            <p>
              Esta métrica <strong>não equivale a SLA nem a MTTR</strong>. É um indicador de vazão factual para apoio à gestão e calibração de escala da equipe assistencial.
            </p>
          </div>
        </div>
      </Modal>

      {/* DRAWER ANALÍTICO DE DRILLDOWN DE KPIS */}
      {selectedKpiDrilldown && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedKpiDrilldown(null)}
          title={`Detalhamento Analítico: ${
            selectedKpiDrilldown === 'abertos' ? 'Chamados Abertos' :
            selectedKpiDrilldown === 'novos' ? 'Novos e em Atendimento' :
            selectedKpiDrilldown === 'sem_tecnico' ? 'Chamados sem Técnico Nominal' :
            selectedKpiDrilldown === 'sem_evolucao' ? 'Sem Evolução > 24 Horas' :
            'Chamados Solucionados com Evidência'
          }`}
          subtitle="Lista consolidada com rastreabilidade direta ao GLPI"
        >
          <div className="space-y-3 text-xs sm:text-sm">
            <p className="text-slate-500 dark:text-slate-400">
              Registros filtrados correspondentes ao indicador selecionado:
            </p>

            <div className="space-y-2">
              {tickets
                .filter(t => {
                  if (selectedKpiDrilldown === 'abertos') return t.status !== 'fechado' && t.status !== 'solucionado';
                  if (selectedKpiDrilldown === 'novos') return t.status === 'novo' || t.status === 'em_atendimento';
                  if (selectedKpiDrilldown === 'sem_tecnico') return !t.hasNominalTech && t.status !== 'fechado' && t.status !== 'solucionado';
                  if (selectedKpiDrilldown === 'sem_evolucao') return t.isWithoutEvolution24h && t.status !== 'fechado' && t.status !== 'solucionado';
                  return t.status === 'solucionado';
                })
                .slice(0, 10)
                .map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedKpiDrilldown(null);
                      onNavigateToTicket(t.id);
                    }}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-[#134F9F] dark:text-blue-400">#{t.id}</span>
                      <TicketStatusText status={t.status} />
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{t.title}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                      <span>{t.hospitalLocation}</span>
                      <span>Resp: {t.technicianName || 'Sem técnico'}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </DetailDrawer>
      )}

      {/* DRAWER PARA CHAMADO CLICADO NA SÍNTESE */}
      {selectedRiskTicket && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedRiskTicket(null)}
          title={`Chamado #${selectedRiskTicket.id} — ${selectedRiskTicket.title}`}
          subtitle={`Setor: ${selectedRiskTicket.hospitalLocation} · Prioridade: ${selectedRiskTicket.suggestedPriority}`}
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Diagnóstico Gerencial
              </span>
              <p className="text-slate-800 dark:text-slate-200 mt-1.5 leading-relaxed font-medium">
                {selectedRiskTicket.suggestedPriority === 'P1_CRITICA'
                  ? 'Reclassificado para P1 Crítica por envolver suporte direto a leitos intensivos ou risco de descontinuidade assistencial.'
                  : 'Requer atenção imediata de supervisão para evitar extrapolação dos limites do POP-TIN-017.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-slate-400 text-xs block font-medium">Técnico Nominal</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                  {selectedRiskTicket.technicianName || 'Não atribuído'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                <span className="text-slate-400 text-xs block font-medium">Última Ação Humana</span>
                <span className="font-bold font-mono text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                  {selectedRiskTicket.lastHumanActionDate.replace('T', ' ').slice(0, 16)}
                </span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const id = selectedRiskTicket.id;
                  setSelectedRiskTicket(null);
                  onNavigateToTicket(id);
                }}
                className="px-4 py-2 font-semibold text-xs sm:text-sm text-white bg-[#134F9F] hover:bg-blue-800 rounded-md cursor-pointer transition-colors"
              >
                Abrir na Gestão de Chamados →
              </button>
            </div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
};
