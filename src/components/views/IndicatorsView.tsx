/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Indicadores & Analytics Operacionais
 * 100% CONSOLIDADO EM 1 PÁGINA ÚNICA (SEM SCROLL VERTICAL E SEM CLIPPING)
 * Header executivo compacto com métricas integradas + Grade 2x2 com proporção perfeita
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileCheck, 
  Layers, 
  Maximize2,
  SlidersHorizontal,
  PieChart,
  Activity,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { MOCK_INDICATORS_DATA } from '../../data/mockData';
import { DetailDrawer } from '../common/DetailDrawer';
import { Modal } from '../common/Modal';

export const IndicatorsView: React.FC = () => {
  const data = MOCK_INDICATORS_DATA;

  // Estado para Drawer Analítico de Métricas
  const [selectedIndicatorDetail, setSelectedIndicatorDetail] = useState<string | null>(null);

  // Estado para Modal de Aumentar Visualização de Gráfico Específico
  const [maximizedChart, setMaximizedChart] = useState<'balance' | 'category' | 'quality' | 'status' | null>(null);

  // Estado para Personalização de Visibilidade de Gráficos
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [visibleCharts, setVisibleCharts] = useState({
    showBalance: true,
    showCategory: true,
    showQuality: true,
    showStatus: true
  });

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-4 overflow-hidden gap-2.5">
      {/* HEADER EXECUTIVO INTEGRADO: TÍTULO + 3 KPIS ESSENCIAIS EM FAIXA COMPACTA (ZERO DESPERDÍCIO VERTICAL) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs shrink-0">
        {/* Identificação do Módulo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#134F9F] dark:text-blue-400 border border-blue-200 dark:border-blue-900/40 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Indicadores & Analytics Operacionais</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              4 dimensões consolidadas · POP-TIN-017 · Sem rolagem vertical
            </p>
          </div>
        </div>

        {/* Cluster de 3 Métricas Essenciais Compactas Integradas */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Métrica 1: Resolução sem Reabertura */}
          <button
            type="button"
            onClick={() => setSelectedIndicatorDetail('reabertura')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors text-left cursor-pointer group"
            title="Clique para detalhar taxa de reabertura"
          >
            <div className="w-2 h-7 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold leading-tight">Sem Reabertura (30d)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">98.3%</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">+0.8%</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 ml-1 shrink-0" />
          </button>

          {/* Métrica 2: Qualidade Documental */}
          <button
            type="button"
            onClick={() => setSelectedIndicatorDetail('qualidade_doc')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors text-left cursor-pointer group"
            title="Clique para ver regras POP-TIN-017"
          >
            <div className="w-2 h-7 rounded-full bg-blue-600 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold leading-tight">Qualidade POP-TIN-017</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{data.documentQualityIndex.overallRate}%</span>
                <span className="text-[10px] font-mono font-semibold text-slate-500">Meta &ge; 85%</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 ml-1 shrink-0" />
          </button>

          {/* Métrica 3: Tempo Médio Observado */}
          <button
            type="button"
            onClick={() => setSelectedIndicatorDetail('tempo_medio')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors text-left cursor-pointer group"
            title="Clique para entender a fórmula de cálculo (não é SLA)"
          >
            <div className="w-2 h-7 rounded-full bg-indigo-500 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold leading-tight">Tempo Médio (7d)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{data.kpis.avgObservedResolutionHours}h</span>
                <span className="text-[10px] font-mono text-slate-500">Observado</span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 ml-1 shrink-0" />
          </button>

          {/* Botão de Personalização */}
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer shrink-0"
            title="Personalizar cards do painel"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
          </button>
        </div>
      </div>

      {/* GRADE CENTRAL 2x2 COM PROPORÇÃO PERFEITA (ZERO CLIPPING, 100% VISÍVEL NO VIEWPORT) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-2.5 overflow-hidden">
        {/* QUADRANTE 1: BALANÇO DIÁRIO DE VAZÃO (7 DIAS) */}
        {visibleCharts.showBalance && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-colors">
            {/* Header do Card */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-blue-50 dark:bg-blue-950/60 text-[#134F9F] dark:text-blue-400 shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    1. Balanço Diário de Vazão (Abertos vs Solucionados)
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400">
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                      Novos (87)
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                      Solucionados (83)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMaximizedChart('balance')}
                    className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    title="Aumentar visualização deste gráfico"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Barras de Vazão Compactas com Alinhamento Tabular */}
              <div className="space-y-1.5 py-1">
                {data.trendSeries.slice(-5).map(item => (
                  <div key={item.day} className="flex items-center gap-2">
                    <span className="w-12 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
                      {item.day}
                    </span>
                    <div className="flex-1 flex items-center gap-1.5 h-4.5">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 rounded text-[11px] text-white font-mono font-bold flex items-center justify-end px-1.5 transition-all"
                        style={{ width: `${Math.max(14, item.abertos * 4.6)}%` }}
                        title={`${item.abertos} novos chamados`}
                      >
                        {item.abertos}
                      </div>
                      <div 
                        className="bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 rounded text-[11px] text-white font-mono font-bold flex items-center justify-end px-1.5 transition-all"
                        style={{ width: `${Math.max(14, item.solucionados * 4.6)}%` }}
                        title={`${item.solucionados} chamados solucionados`}
                      >
                        {item.solucionados}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linha de Síntese no Rodapé do Card */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium font-mono text-[11px]">
                Taxa de vazão acumulada: <strong className="text-emerald-700 dark:text-emerald-400">98.2%</strong>
              </span>
              <button
                type="button"
                onClick={() => setMaximizedChart('balance')}
                className="text-xs font-bold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Série 30d</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* QUADRANTE 2: QUALIDADE DOCUMENTAL POP-TIN-017 */}
        {visibleCharts.showQuality && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-colors">
            {/* Header do Card */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    2. Auditoria Documental (Regras POP-TIN-017)
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded">
                    {data.documentQualityIndex.overallRate}% Geral
                  </span>
                  <button
                    type="button"
                    onClick={() => setMaximizedChart('quality')}
                    className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    title="Aumentar visualização deste gráfico"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Critérios POP-TIN-017 */}
              <div className="space-y-1.5 py-1">
                {data.documentQualityIndex.criteria.map(crit => (
                  <div key={crit.name} className="space-y-0.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span className="truncate max-w-[280px] text-xs">{crit.name}</span>
                      <span className={`font-mono font-bold text-xs ${crit.compliance >= 85 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {crit.compliance}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${crit.compliance >= 85 ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-amber-600 dark:bg-amber-500'}`} 
                        style={{ width: `${crit.compliance}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linha de Síntese no Rodapé do Card */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                Meta de conformidade &ge; 85% para todos os subitens
              </span>
              <button
                type="button"
                onClick={() => setMaximizedChart('quality')}
                className="text-xs font-bold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Auditar Regras</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* QUADRANTE 3: MACRO-CATEGORIAS DE TI */}
        {visibleCharts.showCategory && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-colors">
            {/* Header do Card */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    3. Distribuição por Macro-Categorias de TI
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    33 Chamados Ativos
                  </span>
                  <button
                    type="button"
                    onClick={() => setMaximizedChart('category')}
                    className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    title="Aumentar visualização deste gráfico"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Barras de Categoria */}
              <div className="space-y-2 py-1">
                {data.categoryDistribution.map(cat => (
                  <div key={cat.name} className="space-y-0.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span className="truncate max-w-[260px] text-xs">{cat.name}</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {cat.count} <span className="text-slate-500 font-normal">({Math.round((cat.count/33)*100)}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: `${(cat.count / 33) * 100}%`, backgroundColor: cat.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linha de Síntese no Rodapé do Card */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                Sistemas Hospitalares (Tasy/PACS) concentram 42% da carga
              </span>
              <button
                type="button"
                onClick={() => setMaximizedChart('category')}
                className="text-xs font-bold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Detalhamento</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        )}

        {/* QUADRANTE 4: STATUS DOS CHAMADOS ATIVOS */}
        {visibleCharts.showStatus && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs hover:border-blue-400/60 dark:hover:border-blue-500/40 transition-colors">
            {/* Header do Card */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 shrink-0">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    4. Status Operacional dos Chamados Ativos
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded">
                    Fluxo Controlado
                  </span>
                  <button
                    type="button"
                    onClick={() => setMaximizedChart('status')}
                    className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    title="Aumentar visualização deste gráfico"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grid 2x2 de Status Operacional Compacto */}
              <div className="grid grid-cols-2 gap-2 py-0.5 text-xs">
                {data.statusDistribution.map(s => (
                  <div key={s.name} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-semibold truncate">{s.name}</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{s.count}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({s.percentage}%)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Caixa de Conformidade de Tempo de Resposta */}
              <div className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">Meta Resolução &le; 24h:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                  Atual 18.2h (Conforme)
                </span>
              </div>
            </div>

            {/* Linha de Síntese no Rodapé do Card */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                Nenhum chamado crítico sem atribuição
              </span>
              <button
                type="button"
                onClick={() => setMaximizedChart('status')}
                className="text-xs font-bold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Ver Fila</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE PERSONALIZAR QUAIS GRÁFICOS APARECEM */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Personalizar Gráficos Operacionais"
        subtitle="Escolha quais cards de indicadores devem permanecer visíveis no painel consolidado"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Selecione os gráficos ativos para otimizar o seu viewport de gestão mantendo a consolidação em tela única:
          </p>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100">
              <span className="font-bold text-slate-800 dark:text-slate-200">1. Balanço Diário (Novos vs Solucionados)</span>
              <input
                type="checkbox"
                checked={visibleCharts.showBalance}
                onChange={(e) => setVisibleCharts({ ...visibleCharts, showBalance: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#134F9F] focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100">
              <span className="font-bold text-slate-800 dark:text-slate-200">2. Auditoria Documental (POP-TIN-017)</span>
              <input
                type="checkbox"
                checked={visibleCharts.showQuality}
                onChange={(e) => setVisibleCharts({ ...visibleCharts, showQuality: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#134F9F] focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100">
              <span className="font-bold text-slate-800 dark:text-slate-200">3. Macro-Categorias de TI Hospitalar</span>
              <input
                type="checkbox"
                checked={visibleCharts.showCategory}
                onChange={(e) => setVisibleCharts({ ...visibleCharts, showCategory: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#134F9F] focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100">
              <span className="font-bold text-slate-800 dark:text-slate-200">4. Status Operacional dos Chamados</span>
              <input
                type="checkbox"
                checked={visibleCharts.showStatus}
                onChange={(e) => setVisibleCharts({ ...visibleCharts, showStatus: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#134F9F] focus:ring-0 cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="px-4 py-2 font-bold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md text-xs sm:text-sm cursor-pointer"
            >
              Confirmar Exibição
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL PARA AUMENTAR VISUALIZAÇÃO DE GRÁFICO (MODAL AMPLIADO) */}
      {maximizedChart && (
        <Modal
          isOpen={true}
          onClose={() => setMaximizedChart(null)}
          title={
            maximizedChart === 'balance' ? 'Balanço Diário de Abertura vs Solução (Visualização Ampliada)' :
            maximizedChart === 'category' ? 'Macro-Categorias de TI Hospitalar (Visualização Ampliada)' :
            maximizedChart === 'quality' ? 'Critérios de Qualidade Documental POP-TIN-017 (Visualização Ampliada)' :
            'Distribuição de Status dos Chamados Ativos (Visualização Ampliada)'
          }
          subtitle="Análise aprofundada com séries históricas completas e métricas comparativas"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            {maximizedChart === 'balance' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Histórico Diário Detalhado
                  </h4>
                  <div className="space-y-2">
                    {data.trendSeries.map(item => (
                      <div key={item.day} className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 w-28">{item.day}</span>
                        <div className="flex items-center gap-6 font-mono text-xs">
                          <span className="text-blue-700 dark:text-blue-400 font-bold">Novos: {item.abertos}</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">Solucionados: {item.solucionados}</span>
                          <span className="text-slate-600 dark:text-slate-400">Tempo Médio: {item.tempoMedio}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {maximizedChart === 'category' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    Detalhamento por Macro-Categoria
                  </h4>
                  <div className="space-y-2.5">
                    {data.categoryDistribution.map(cat => (
                      <div key={cat.name} className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span>{cat.name}</span>
                          <span className="font-mono">{cat.count} chamados ({Math.round((cat.count/33)*100)}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all" 
                            style={{ width: `${(cat.count / 33) * 100}%`, backgroundColor: cat.color }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {maximizedChart === 'quality' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    Conformidade das 4 Regras Canônicas POP-TIN-017
                  </h4>
                  <div className="space-y-2.5">
                    {data.documentQualityIndex.criteria.map(crit => (
                      <div key={crit.name} className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                          <span>{crit.name}</span>
                          <span className={`font-mono font-bold ${crit.compliance >= 85 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>{crit.compliance}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${crit.compliance >= 85 ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-amber-600 dark:bg-amber-500'}`} 
                            style={{ width: `${crit.compliance}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {maximizedChart === 'status' && (
              <div className="grid grid-cols-2 gap-3">
                {data.statusDistribution.map(s => (
                  <div key={s.name} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">{s.name}</span>
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 block">{s.count}</span>
                    <span className="text-xs font-mono text-[#134F9F] dark:text-blue-400 font-bold">{s.percentage}% do total</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMaximizedChart(null)}
                className="px-4 py-2 text-white bg-[#134F9F] hover:bg-blue-800 rounded font-bold text-xs sm:text-sm cursor-pointer"
              >
                Fechar Visualização Ampliada
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DRAWER ANALÍTICO DE INDICADORES */}
      {selectedIndicatorDetail && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedIndicatorDetail(null)}
          title="Detalhamento do Indicador"
          subtitle="Composição de cálculo, regras aplicáveis e limitações de governança"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 block mb-1 tracking-wider">
                Definição Operacional
              </span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {selectedIndicatorDetail === 'tempo_medio' && data.kpis.avgResolutionFormulaNotice}
                {selectedIndicatorDetail === 'qualidade_doc' && 'Mede o percentual de chamados fechados que contêm evidência técnica explícita anexada, atribuição nominal válida e relato técnico circunstanciado sem depender apenas de date_mod.'}
                {selectedIndicatorDetail === 'reabertura' && 'Mede o índice de chamados que foram reabertos pelo solicitante após encerramento técnico no período de 30 dias.'}
              </p>
            </div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
};
