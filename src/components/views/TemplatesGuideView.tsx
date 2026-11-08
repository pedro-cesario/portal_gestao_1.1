/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Catálogo de Templates & Capacidades Planejadas (TPL-00 a TPL-05+)
 * Layout 100% contido sem scroll na janela principal (Zero-Scroll Viewport)
 */

import React, { useState } from 'react';
import { 
  Layers, 
  FileSpreadsheet, 
  Users, 
  FolderKanban, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface TemplatesGuideViewProps {
  onOpenAgenteForTemplate: (templateName: string) => void;
}

export const TemplatesGuideView: React.FC<TemplatesGuideViewProps> = ({
  onOpenAgenteForTemplate
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('TPL-01');

  const templates = [
    {
      id: 'TPL-01',
      code: 'TPL-01 — Daily Operacional',
      status: 'HOMOLOGADO',
      statusColor: 'text-emerald-500 bg-emerald-500/10',
      description: 'Modelo canônico com 6 seções obrigatórias: Resumo, Pendências, Equipe, Entregas, Prioridades e Decisões. Limiar de 24h sem atualização e até 3 prioridades.',
      sections: [
        '1. Resumo Executivo da Operação',
        '2. Pendências & Auditoria POP-TIN-017',
        '3. Carga e Distribuição da Equipe (exclui Grupo 48)',
        '4. Entregas Concluídas nas Últimas 24h',
        '5. As 3 Prioridades do Turno',
        '6. Decisões e Encaminhamentos GLPI'
      ],
      rules: 'Atualização ao abrir; limiar de 24h sem atualização humana; até 3 prioridades mandatórias.'
    },
    {
      id: 'TPL-02',
      code: 'TPL-02 — Alinhamento Semanal',
      status: 'HOMOLOGADO',
      statusColor: 'text-emerald-500 bg-emerald-500/10',
      description: 'Consolidação periódica com acordos executivos e Planos de Evolução Individual da Equipe. Rastreamento longitudinal de compromissos pactuados, critérios objetivos de sucesso e validação formal pelo gestor.',
      sections: [
        '1. Indicadores Chave da Semana',
        '2. Riscos & Dependências Externas',
        '3. Acordos da Reunião Anterior & Atuais',
        '4. Planos de Evolução Individual da Equipe'
      ],
      rules: 'Sintético na capa; detalhamento sob demanda de acordos e compromissos com ciência formal do colaborador.'
    },
    {
      id: 'TPL-03',
      code: 'TPL-03 — Feedback e Alinhamentos',
      status: 'HOMOLOGADO',
      statusColor: 'text-emerald-500 bg-emerald-500/10',
      description: 'Desenvolvimento profissional, orientações, reconhecimento e acompanhamento de compromissos. Registros individuais e coletivos (passagem de plantão, escala, conduta), metas longitudinais, emissão de termos formais para impressão A4 e arquivamento físico.',
      sections: [
        '1. Feedback Individual & Metas de Desenvolvimento',
        '2. Alinhamentos Coletivos (Passagem de Plantão e Escala)',
        '3. Orientações de Conduta, Postura e Reconhecimento',
        '4. Termos Formais A4, Assinaturas Independentes & Tomos DTI'
      ],
      rules: 'Coleta individual de ciência e assinatura obrigatória; suporte a 1 ou múltiplos participantes; arquivamento com livro e tomos.'
    },
    {
      id: 'TPL-04',
      code: 'TPL-04 — Gestão Completa de Projetos',
      status: 'HOMOLOGADO',
      statusColor: 'text-emerald-500 bg-emerald-500/10',
      description: 'Ambiente gerencial completo para iniciativas estruturantes (Storage PACS, Wi-Fi, Tasy): 5 Fases sequenciais, Cronograma Gantt executivo, Responsabilidades por técnico com workflow de execução, homologação de entregas e Matriz de Riscos.',
      sections: [
        '1. Roadmap por Fases & Checklist de Entregas',
        '2. Cronograma Visual Gantt Executivo',
        '3. Responsabilidades e Tarefas por Pessoa',
        '4. Matriz de Riscos, Decisões e Change Log'
      ],
      rules: '6 KPIs sintéticos no painel; marcos críticos com homologação formal antes da liberação de fases subsequentes.'
    },
    {
      id: 'TPL-05',
      code: 'TPL-05+ — Extensões Futuras',
      status: 'ROADMAP',
      statusColor: 'text-blue-400 bg-blue-500/10',
      description: 'Novos modelos gerenciais sob governança de versões (Comitê de Crise, Auditoria Externa ONA/JCI, Inventário de Hardware).',
      sections: ['Sob especificação da DTI'],
      rules: 'Governança estrita de versionamento sem redefinir código existente.'
    }
  ];

  const current = templates.find(t => t.id === selectedTemplate) || templates[0];

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-4 overflow-hidden gap-3">
      {/* Banner Superior Compacto */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#134F9F] dark:text-blue-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              Catálogo Institucional de Templates (TPL-00 a TPL-05+)
            </h2>
            <span className="hidden md:inline text-xs text-slate-400 font-mono">
              · Padrões oficiais HEAL
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            Modelos homologados para composição e compilação no Agente Gerencial
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenAgenteForTemplate(current.code)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden xs:inline">Gerar {current.id}</span>
          <span className="xs:hidden">Gerar</span>
        </button>
      </div>

      {/* Grid Central: Lista de Templates à Esquerda + Prévia do Template à Direita (Responsivo Tablet/Celular) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        {/* Lista de Modelos (5 Colunas) */}
        <div className="lg:col-span-5 max-h-48 lg:max-h-none lg:h-full overflow-y-auto pr-1 space-y-1.5">
          {templates.map(tpl => (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                selectedTemplate === tpl.id
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{tpl.code}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${tpl.statusColor}`}>
                  {tpl.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>
            </div>
          ))}
        </div>

        {/* Detalhe do Template Selecionado (7 Colunas) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-xs overflow-y-auto">
          <div className="space-y-3">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold text-[#134F9F] dark:text-blue-400">
                  Especificação Canônica
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${current.statusColor}`}>
                  {current.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {current.code}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {current.description}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Seções Estruturadas Obrigatórias
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {current.sections.map((sec, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{sec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded text-xs text-blue-950 dark:text-blue-300">
              <strong className="block mb-0.5">Regras de Validação & UX:</strong>
              {current.rules}
            </div>
          </div>

          {/* Roadmap de Extensões Integradas */}
          <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">
              Capacidades Planejadas do Roadmap:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono">
              <span className="p-1 bg-slate-100 dark:bg-slate-800 rounded truncate">INT-01: Escrita GLPI</span>
              <span className="p-1 bg-slate-100 dark:bg-slate-800 rounded truncate">INT-02: Notas Gerenciais</span>
              <span className="p-1 bg-slate-100 dark:bg-slate-800 rounded truncate">INT-03: Voz/Transcrição</span>
              <span className="p-1 bg-slate-100 dark:bg-slate-800 rounded truncate">GATE-01: Homologação</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
