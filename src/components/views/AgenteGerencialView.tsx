/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Agente Gerencial (Copiloto Central de Gestão Operacional)
 * Motor de criação de painéis padronizados (TPL-01 a TPL-04), FAST_PATH e AGY Analítico
 * Integração completa: Geração por prompt ou chips, parâmetros, prévia sintética,
 * apresentação executiva em tela cheia, gaveta analítica de evidências e revisão humana.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  FileSpreadsheet, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Clock,
  Layers,
  FileCheck,
  MessageSquare,
  Plus,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  ArrowRight,
  Presentation,
  FileText,
  Edit3,
  FolderKanban,
  User,
  SlidersHorizontal,
  Calendar,
  X
} from 'lucide-react';
import { ChatMessage, ArtifactPanel, Ticket, Technician, PendingItem, ChatSession, PanelTemplateType } from '../../types';
import { PresentationModeModal } from '../panels/PresentationModeModal';
import { TemplateDetailDrawer } from '../panels/TemplateDetailDrawer';
import { HumanReviewModal } from '../panels/HumanReviewModal';

interface AgenteGerencialViewProps {
  tickets: Ticket[];
  technicians: Technician[];
  pendings: PendingItem[];
  onSaveArtifactToCatalog: (artifact: ArtifactPanel) => void;
  onNavigateToSavedPanels: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onOpenTicketById?: (ticketId: number) => void;
}

export const AgenteGerencialView: React.FC<AgenteGerencialViewProps> = ({
  tickets,
  technicians,
  pendings,
  onSaveArtifactToCatalog,
  onNavigateToSavedPanels,
  initialPrompt,
  onClearInitialPrompt,
  onOpenTicketById
}) => {
  // Pre-seeded Histórico de Sessões Realistas
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'session-active',
      title: 'Plantão Atual — Análise & Geração 06/11',
      updatedAt: '10:10 (Brasília)',
      templateGenerated: 'TPL-01',
      messages: [
        {
          id: 'msg-welcome',
          role: 'assistant',
          content: 'Olá! Sou o Agente Gerencial da TI do Instituto HEAL. Posso responder consultas operacionais rápidas, auditar evidências ou gerar painéis estruturados (Daily, Alinhamento Semanal, Feedback Individual ou Gestão de Projetos). Como posso apoiar sua gestão agora?',
          timestamp: '10:00 (Brasília)',
          pathType: 'FAST_PATH',
          sources: ['GLPI Réplica MariaDB', 'Auditoria Snapshot 04h']
        }
      ]
    },
    {
      id: 'session-yesterday',
      title: 'Daily & Prioridades de 05/11',
      updatedAt: '05/11 17:30',
      templateGenerated: 'TPL-01',
      messages: [
        {
          id: 'm1',
          role: 'user',
          content: 'Gere o Daily Operacional referente ao dia 05/11 e liste as 3 prioridades do plantão.',
          timestamp: '05/11 07:10'
        },
        {
          id: 'm2',
          role: 'assistant',
          content: 'Daily do dia 05/11 gerado com sucesso. As 3 prioridades aprovadas foram: 1) Expansão de tablespace do banco analítico; 2) Investigação de I/O no nó 2 do cluster PACS; 3) Substituição preventiva do patch cable na UTI Adulto.',
          timestamp: '05/11 07:11',
          pathType: 'FAST_PATH',
          sources: ['Snapshot 04h00', 'GLPI Réplica']
        }
      ]
    },
    {
      id: 'session-weekly-45',
      title: 'Alinhamento Semanal — Semana 45/2026',
      updatedAt: '04/11 14:15',
      templateGenerated: 'TPL-02',
      messages: [
        {
          id: 'm-w1',
          role: 'user',
          content: 'Prepare nosso alinhamento semanal com balanço de abertura e entregas.',
          timestamp: '04/11 14:00'
        },
        {
          id: 'm-w2',
          role: 'assistant',
          content: 'Alinhamento Semanal consolidado sob o modelo TPL-02 com 74 chamados concluídos na semana, 88% de conformidade documental e plano de contenção para os switches de borda.',
          timestamp: '04/11 14:02',
          pathType: 'AGY',
          sources: ['GLPI Réplica MariaDB', 'Auditorias Noturnas 04h']
        }
      ]
    },
    {
      id: 'session-mariana',
      title: 'Dossiê Feedback Mariana Costa (Tasy)',
      updatedAt: '04/11 16:40',
      templateGenerated: 'TPL-03',
      messages: [
        {
          id: 'm3',
          role: 'user',
          content: 'Monte a minuta de feedback individual estruturado para a analista Mariana Costa.',
          timestamp: '04/11 16:30'
        },
        {
          id: 'm4',
          role: 'assistant',
          content: 'Dossiê TPL-03 compilado com base em 58 chamados resolvidos no período, 1.7% de taxa de reabertura e 94% de qualidade documental. Conclusões disciplinares automáticas excluídas conforme governança.',
          timestamp: '04/11 16:32',
          pathType: 'AGY',
          sources: ['Histórico GLPI Mariana Costa', 'Auditorias POP-TIN-017']
        }
      ]
    },
    {
      id: 'session-pacs',
      title: 'Acompanhamento Projeto Storage PACS CDI',
      updatedAt: '03/11 11:20',
      templateGenerated: 'TPL-04',
      messages: [
        {
          id: 'm5',
          role: 'user',
          content: 'Monte uma apresentação sobre o andamento do projeto Storage PACS.',
          timestamp: '03/11 11:15'
        },
        {
          id: 'm6',
          role: 'assistant',
          content: 'Painel TPL-04 de Gestão de Projetos estruturado com 68% de conclusão, 5 marcos concluídos de 8 e cronograma pronto para apresentação aos diretores.',
          timestamp: '03/11 11:18',
          pathType: 'AGY',
          sources: ['Cronograma DTI', 'Chamado #48204']
        }
      ]
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('session-active');
  const [showHistorySidebar, setShowHistorySidebar] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return false;
    return true;
  });

  // Mensagens da sessão ativa
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [expandedDetailId, setExpandedDetailId] = useState<string | null>(null);
  const [savedPanelSuccess, setSavedPanelSuccess] = useState<string | null>(null);

  // Estados dos Modais Integrados
  const [modalArtifact, setModalArtifact] = useState<ArtifactPanel | null>(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Modal / Gaveta de Seleção de Parâmetros Rápidos
  const [activeParamTemplate, setActiveParamTemplate] = useState<PanelTemplateType | null>(null);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('Mariana Costa');
  const [selectedProject, setSelectedProject] = useState<string>('Expansão Storage PACS & Laudos CDI');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Hoje (06/11/2026)');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isProcessing, activeSessionId]);

  // Se houver um prompt inicial vindo de outro módulo
  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Quick Action Chips de Templates
  const templateChips = [
    {
      id: 'TPL-01' as PanelTemplateType,
      label: 'Daily Operacional',
      code: 'TPL-01',
      icon: FileSpreadsheet,
      color: 'hover:border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/10',
      prompt: 'Monte meu Daily de hoje.'
    },
    {
      id: 'TPL-02' as PanelTemplateType,
      label: 'Alinhamento Semanal',
      code: 'TPL-02',
      icon: Layers,
      color: 'hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
      prompt: 'Prepare nosso alinhamento semanal.'
    },
    {
      id: 'TPL-03' as PanelTemplateType,
      label: 'Feedback Individual',
      code: 'TPL-03',
      icon: User,
      color: 'hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      prompt: 'Gere um feedback individual do colaborador.'
    },
    {
      id: 'TPL-04' as PanelTemplateType,
      label: 'Gestão de Projetos',
      code: 'TPL-04',
      icon: FolderKanban,
      color: 'hover:border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/10',
      prompt: 'Monte uma apresentação sobre o andamento do projeto.'
    }
  ];

  // Iniciar nova conversa
  const handleStartNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'Nova Conversa Operacional',
      updatedAt: 'Agora (10:10)',
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: 'Nova conversa iniciada. Como posso apoiar a gestão operacional da TI agora? Posso responder sobre o status do GLPI, analisar pendências ou gerar painéis executivos padronizados.',
          timestamp: '10:10 (Brasília)',
          pathType: 'FAST_PATH',
          sources: ['GLPI Réplica MariaDB', 'Snapshot Noturno 04h']
        }
      ]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  // Excluir conversa
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      alert('Você deve manter pelo menos uma conversa no histórico.');
      return;
    }
    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    if (activeSessionId === sessionId) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Atualizar mensagens na sessão ativa
  const appendMessageToActiveSession = (newMsg: ChatMessage, newTitle?: string, generatedTpl?: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: newTitle || (s.title === 'Nova Conversa Operacional' ? newMsg.content.slice(0, 38) + '...' : s.title),
          updatedAt: '10:10 (Brasília)',
          templateGenerated: generatedTpl || s.templateGenerated,
          messages: [...s.messages, newMsg]
        };
      }
      return s;
    }));
  };

  // Executar geração com parâmetros confirmados
  const handleConfirmTemplateWithParams = () => {
    if (!activeParamTemplate) return;
    const tpl = activeParamTemplate;
    setActiveParamTemplate(null);

    if (tpl === 'TPL-01') {
      handleSend(`Gere o Daily Operacional para o período: ${selectedPeriod}`);
    } else if (tpl === 'TPL-02') {
      handleSend(`Prepare o Alinhamento Semanal para a ${selectedPeriod}`);
    } else if (tpl === 'TPL-03') {
      handleSend(`Gere um feedback individual estruturado para o colaborador: ${selectedCollaborator}`);
    } else if (tpl === 'TPL-04') {
      handleSend(`Monte uma apresentação executiva sobre o projeto: ${selectedProject}`);
    }
  };

  // Processamento do Envio de Prompt
  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: '10:10 (Brasília)'
    };

    appendMessageToActiveSession(userMsg);
    setInputPrompt('');
    setIsProcessing(true);

    const lower = query.toLowerCase();

    // 1. TPL-01: DAILY OPERACIONAL
    if (lower.includes('daily') || lower.includes('tpl-01') || lower.includes('monte meu daily') || lower.includes('painel de hoje')) {
      setProcessingStatus('Etapa 1/3: Consultando snapshot 04h e calculando chamados abertos, novos e concluídos...');
      setTimeout(() => {
        setProcessingStatus('Etapa 2/3: Mapeando pendências >24h, chamados sem técnico nominal e ocorrências críticas...');
      }, 500);

      setTimeout(() => {
        const dailyArtifact: ArtifactPanel = {
          id: `art-daily-${Date.now()}`,
          templateType: 'TPL-01',
          templateName: 'TPL-01 — Daily Operacional',
          title: 'Daily Operacional TI — 06/11/2026',
          ownerName: 'Agente Gerencial',
          referenceDate: '06/11/2026',
          generationDate: '06/11/2026 10:10',
          source: 'SNAPSHOT_04H',
          version: 'v1.0 (Prévia Gerada)',
          status: 'RASCUNHO',
          summary: {
            headline: 'Estabilidade operacional mantida com 2 alertas críticos: telemetria UTI Adulto e prescrição obstétrica sem técnico.',
            criticalAlertsCount: 2,
            topPriorities: [
              '#48219: Normalizar uplink telemetria leitos 12-14 na UTI Adulto',
              '#48191: Atribuir responsável nominal para prescrição no Centro Obstétrico',
              '#48098: Substituir impressora térmica da Triagem PA parada há >24h'
            ],
            keyDecisionsSummary: 'Priorização de campo direcionada à UTI Geral e Centro Obstétrico antes das 11h. Grupo 48 apoia articulação com fornecedor PACS.',
            metricsBrief: [
              { label: 'Chamados Ativos', value: 33, trend: 'stable' },
              { label: 'Sem Evolução >24h', value: 3, trend: 'down', target: '0' },
              { label: 'Sem Técnico Nominal', value: 2, trend: 'up', target: '0' },
              { label: 'Tempo Médio Obs.', value: '18.2h', trend: 'down', target: '<24h' }
            ]
          },
          detail: {
            sections: [
              {
                title: '1. Resumo Executivo da Operação',
                description: 'Visão consolidada da infraestrutura e sistemas hospitalares no turno matinal.',
                items: [
                  { title: 'Conectividade e Links', description: 'Ambos os links de fibra com 100% de disponibilidade. Sem indisponibilidades registradas.' },
                  { title: 'Sistemas Clínicos Core', description: 'Tasy ERP e visualizadores laboratoriais operando normalmente. Aprazamento obstétrico sob observação.' }
                ]
              },
              {
                title: '2. Pendências & Auditoria POP-TIN-017',
                description: 'Chamados auditados com desconformidades de documentação ou prazo.',
                items: [
                  { title: 'Chamado #48098 (Zebra Triagem)', description: '42 horas sem ação técnica documentada.', responsible: 'Lucas Mendes', deadline: 'Hoje 11:30', evidenceLevel: 'Indício de desconformidade', relatedTicketId: 48098 },
                  { title: 'Chamado #48191 (Prescrição Obstétrica)', description: 'Chamado assistencial sem técnico nominal há mais de 2h.', responsible: 'Sem técnico (Atribuído a Grupo)', deadline: 'Imediato', evidenceLevel: 'Desconformidade confirmada', relatedTicketId: 48191 }
                ]
              },
              {
                title: '3. Carga e Distribuição da Equipe Técnica',
                description: 'Distribuição nominal dos 33 chamados ativos (excluindo Grupo 48 Gestão dos rankings operacionais).',
                items: [
                  { title: 'Suporte Presencial (Rafael / Lucas)', description: '13 chamados. Rafael alocado na UTI Geral; Lucas em periféricos do PA.' },
                  { title: 'Sistemas & Dados (Mariana / Fernanda)', description: '11 chamados. Interfaces de farmácia e storage PACS.' },
                  { title: 'Infraestrutura (Carlos Ramos)', description: '9 chamados. Switches assistenciais e links de dados.' }
                ]
              },
              {
                title: '4. Entregas Concluídas nas Últimas 24h',
                items: [
                  { title: '#47990: Banco de Indicadores', description: 'Tablespace ampliado em 100GB e réplicas CDC sincronizadas com logs validados.', evidenceLevel: 'Fato confirmado', relatedTicketId: 47990 },
                  { title: '#47952: Certificado Digital Médicos', description: 'Tokens criptográficos A3 renovados para 6 cirurgiões de plantão.', evidenceLevel: 'Fato confirmado' }
                ]
              },
              {
                title: '5. As 3 Prioridades do Turno',
                items: [
                  { title: 'Prioridade 1: Telemetria UTI Leitos 12-14', description: 'Troca de transceiver SFP e validação de pacotes VLAN 104.', responsible: 'Rafael Albuquerque / Carlos Ramos', deadline: '11:00' },
                  { title: 'Prioridade 2: Prescrição Centro Obstétrico', description: 'Assunção nominal e teste de timeout do aprazamento.', responsible: 'Mariana Costa', deadline: '09:30' },
                  { title: 'Prioridade 3: Impressora Contingência PA', description: 'Instalação de equipamento reserva na triagem.', responsible: 'Lucas Mendes', deadline: '10:30' }
                ]
              },
              {
                title: '6. Decisões e Encaminhamentos',
                items: [
                  { title: 'Decisão DEC-2026-88', description: 'Autorizada abertura de chamado com garantia do fornecedor PACS.' },
                  { title: 'Decisão DEC-2026-89', description: 'Remanejamento temporário de impressora térmica da administração.' }
                ]
              }
            ],
            governanceNotes: 'Gerado sob demanda pelo Agente Gerencial em estrita conformidade com o padrão canônico TPL-01 e snapshot 04h.',
            limitations: [
              'Extração automatizada de réplica de leitura MariaDB sem acesso a dados clínicos protegidos.',
              'Ranking de técnicos exclui coordenadores do Grupo 48 para preservar a isonomia.'
            ]
          }
        };

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: 'Daily Operacional gerado com sucesso conforme o modelo **TPL-01**! Sintetizei as 6 seções obrigatórias: Resumo da Operação, Pendências POP-TIN-017, Carga da Equipe, Entregas, 3 Prioridades do Turno e Decisões. Você pode apresentar em tela cheia na reunião, abrir a gaveta analítica ou revisar e salvar no catálogo.',
          timestamp: '10:10 (Brasília)',
          pathType: 'AGY',
          sources: ['Snapshot Oficial 04h00', 'Réplica GLPI MariaDB', 'POP-TIN-017 v2.4'],
          quickArtifact: dailyArtifact,
          analyticalDetail: 'Base de dados consolidada com 33 chamados ativos, 80 solucionados na semana e 3 pendências críticas sob acompanhamento gerencial.'
        };

        appendMessageToActiveSession(botMsg, 'Geração de Daily Operacional', 'TPL-01');
        setIsProcessing(false);
      }, 1100);

    // 2. TPL-02: ALINHAMENTO SEMANAL
    } else if (lower.includes('alinhamento') || lower.includes('semanal') || lower.includes('tpl-02') || lower.includes('semana')) {
      setProcessingStatus('Etapa 1/3: Consolidando resultado do período da Semana 45 e vazão de chamados...');
      setTimeout(() => {
        setProcessingStatus('Etapa 2/3: Mapeando pendências persistentes, entregas concluídas e matriz de riscos...');
      }, 500);

      setTimeout(() => {
        const weeklyArtifact: ArtifactPanel = {
          id: `art-weekly-${Date.now()}`,
          templateType: 'TPL-02',
          templateName: 'TPL-02 — Alinhamento Semanal',
          title: 'Alinhamento Semanal TI — Semana 45/2026',
          ownerName: 'Agente Gerencial',
          referenceDate: '03/11 a 07/11/2026 (Semana 45)',
          generationDate: '06/11/2026 10:10',
          source: 'SNAPSHOT_04H',
          version: 'v1.0 (Minuta Gerada)',
          status: 'RASCUNHO',
          summary: {
            headline: 'Aumento de 18% no volume de chamados de prescrição após atualização do Tasy v3.4. Resolução média estável em 18.4 horas.',
            criticalAlertsCount: 1,
            topPriorities: [
              'Ajuste fino de índices do banco Oracle do Tasy para eliminar lentidão de prescrição',
              'Plano de contingência e aquisição para substituição de 5 switches de borda obsoletos',
              'Treinamento das novas enfermeiras no leitor beira-leito e contingência de impressão'
            ],
            keyDecisionsSummary: 'Congelamento de novas mudanças no Tasy durante o final de semana. Reunião de alinhamento com a diretoria médica na quinta-feira.',
            metricsBrief: [
              { label: 'Total Concluídos Sem.', value: 74, trend: 'up' },
              { label: 'Backlog Atual', value: 33, trend: 'stable' },
              { label: 'Conformidade Doc.', value: '88%', trend: 'up', target: '≥85%' },
              { label: 'Tempo Médio Semanal', value: '18.4h', trend: 'down', target: '<24h' }
            ]
          },
          detail: {
            sections: [
              {
                title: '1. Resultado Operacional do Período & Evolução',
                description: 'Volume de abertura vs encerramento na Semana 45.',
                items: [
                  { title: 'Vazão Operacional da Semana', description: '82 novos chamados registrados vs 74 concluídos (Taxa de vazão de 90.2%). Variação líquida de +8 chamados no backlog.' },
                  { title: 'Tempo Médio Observado Semanal', description: 'Média de 18.4 horas para resolução técnica de primeiro ciclo, dentro da meta diretiva de 24h.' }
                ]
              },
              {
                title: '2. Pendências Resolvidas, Novas e Persistentes',
                description: 'Auditoria de conformidade com POP-TIN-017.',
                items: [
                  { title: 'Pendências Resolvidas com Evidência', description: '11 chamados tiveram apontamento auditável regularizado nas últimas 72h.', evidenceLevel: 'Fato confirmado' },
                  { title: 'Pendências Persistentes (>24h)', description: '2 chamados (#48098 e #48204) permanecem sob acompanhamento intensivo.', evidenceLevel: 'Indício de desconformidade' }
                ]
              },
              {
                title: '3. Principais Entregas da Equipe na Semana',
                items: [
                  { title: 'Expansão Tablespace Banco Analítico', description: 'Adição de 100GB e balanceamento de queries do Tasy concluídos com sucesso.', responsible: 'Mariana Costa' },
                  { title: 'Substituição de Patch Panels UTI Geral', description: 'Recabeamento e etiquetagem dos racks 03 e 04 sem interrupção assistencial.', responsible: 'Carlos Ramos / Rafael Albuquerque' }
                ]
              },
              {
                title: '4. Riscos Identificados & Dependências Externas',
                items: [
                  { title: 'SLA de Terceiro Fornecedor PACS', description: 'Demora média de 6h para retorno em chamados de severidade 2 pelo fabricante.', evidenceLevel: 'Verificação necessária' },
                  { title: 'Estoque Mínimo de Transceivers SFP', description: 'Almoxarifado com apenas 2 unidades sobressalentes para contingência.' }
                ]
              },
              {
                title: '5. Prioridades da Próxima Semana',
                items: [
                  { title: 'Prioridade 1: Otimização de Queries Tasy', description: 'Reindexação das tabelas de prescrição eletrônica agendada para domingo 02h.', responsible: 'Mariana Costa' },
                  { title: 'Prioridade 2: Homologação Nova Impressora PA', description: 'Teste de estresse com 200 pulseiras de identificação.', responsible: 'Lucas Mendes' }
                ]
              },
              {
                title: '6. Decisões & Responsáveis Homologados',
                items: [
                  { title: 'Aprovação de Janela de Manutenção', description: 'Autorizada janela técnica no domingo das 01h às 05h com aviso às chefias assistenciais.' }
                ]
              }
            ],
            governanceNotes: 'Artefato padronizado TPL-02. Preparado para apresentação executiva de coordenação semanal.'
          }
        };

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: 'Alinhamento Semanal gerado com sucesso sob o modelo **TPL-02**! O painel consolida o resultado do período, evolução dos chamados, pendências resolvidas e persistentes, entregas da equipe, riscos e as prioridades da próxima semana com seus respectivos donos.',
          timestamp: '10:10 (Brasília)',
          pathType: 'AGY',
          sources: ['Snapshot Noturno 04h', 'GLPI Réplica MariaDB', 'Auditoria Semanal Consolidada'],
          quickArtifact: weeklyArtifact,
          analyticalDetail: 'Comparativo da Semana 45 vs Semana 44: Aumento de 18% em chamados de prescrição após a atualização do Tasy v3.4; índice de qualidade documental subiu de 85.2% para 88.0%.'
        };

        appendMessageToActiveSession(botMsg, 'Alinhamento Semanal — Semana 45', 'TPL-02');
        setIsProcessing(false);
      }, 1100);

    // 3. TPL-03: FEEDBACK INDIVIDUAL DO COLABORADOR
    } else if (lower.includes('feedback') || lower.includes('mariana') || lower.includes('colaborador') || lower.includes('tpl-03')) {
      const targetTech = lower.includes('lucas') ? 'Lucas Mendes' :
                         lower.includes('rafael') ? 'Rafael Albuquerque' :
                         lower.includes('carlos') ? 'Carlos Eduardo' :
                         lower.includes('fernanda') ? 'Fernanda Lima' : 'Mariana Costa';

      setProcessingStatus(`Etapa 1/3: Extraindo histórico de atendimentos e evidências de ${targetTech}...`);
      setTimeout(() => {
        setProcessingStatus('Etapa 2/3: Verificando aderência às 4 regras do POP-TIN-017 sem notas subjetivas...');
      }, 500);

      setTimeout(() => {
        const feedbackArtifact: ArtifactPanel = {
          id: `art-feedback-${Date.now()}`,
          templateType: 'TPL-03',
          templateName: 'TPL-03 — Feedback Individual',
          title: `Dossiê de Feedback Técnico — ${targetTech}`,
          ownerName: 'Henrique Vasconcelos',
          referenceDate: 'Ciclo Outubro / Novembro 2026',
          generationDate: '06/11/2026 10:10',
          source: 'REALTIME',
          version: 'v1.0 (Minuta Agente)',
          status: 'RASCUNHO',
          parameters: {
            collaboratorName: targetTech,
            period: 'Outubro / Novembro 2026'
          },
          summary: {
            headline: `Excelente resolutividade em chamados complexos com 58 resoluções no período. Oportunidade de registrar followups antes das 17h.`,
            criticalAlertsCount: 0,
            topPriorities: [
              'Registrar followups antes das 17h para mitigar falsos alertas no snapshot noturno das 04h',
              'Apoiar mentoria em processos assistenciais para novos analistas da equipe',
              'Conduzir homologação dos novos fluxos de contingência do sistema'
            ],
            keyDecisionsSummary: 'Feedback fundamentado estritamente em evidências factuais do GLPI, com foco em desenvolvimento e sem caráter punitivo ou disciplinar.',
            metricsBrief: [
              { label: 'Chamados Concluídos', value: 58, trend: 'up' },
              { label: 'Tempo Médio Obs.', value: '18.4h', trend: 'down', target: '<24h' },
              { label: 'Taxa de Reabertura', value: '1.7%', trend: 'down', target: '<3%' },
              { label: 'Qualidade Doc.', value: '94%', trend: 'up', target: '≥85%' }
            ]
          },
          detail: {
            sections: [
              {
                title: '1. Identificação do Colaborador & Período',
                description: 'Dados funcionais e escopo de atuação do colaborador.',
                items: [
                  { title: 'Colaborador Avaliado', description: `${targetTech} · Especialidade: Sistemas Clínicos / Assistencial · Período: Outubro e Novembro 2026.` },
                  { title: 'Critérios de Avaliação', description: 'Baseado exclusivamente em apontamentos auditáveis do GLPI, conforme regras do POP-TIN-017.' }
                ]
              },
              {
                title: '2. Resumo das Atividades & Métricas Fatuais',
                description: 'Volume e estabilidade das entregas no período.',
                items: [
                  { title: 'Resolução de Crise de Faturamento (28/10)', description: 'Identificou trava em fila de mensageria e restabeleceu em 1h15 com zero impacto fiscal.', evidenceLevel: 'Fato confirmado' },
                  { title: 'Índice de Reabertura Residual', description: 'Apenas 1 chamado reaberto em 58 concluídos no ciclo de 30 dias (Taxa de 1.7%).', evidenceLevel: 'Fato confirmado' }
                ]
              },
              {
                title: '3. Qualidade dos Registros & Evidências POP-TIN-017',
                description: 'Aderência às 4 regras de documentação técnica.',
                items: [
                  { title: 'Regra R1 (Ação Humana <24h)', description: '96% dos chamados com registro tempestivo documentado.' },
                  { title: 'Regra R3 (Causa Raiz Registrada)', description: '100% dos fechamentos detalharam diagnóstico técnico e método de resolução.' }
                ]
              },
              {
                title: '4. Pontos Positivos Comprovados',
                items: [
                  { title: 'Profundo Conhecimento Clínico', description: 'Excelente capacidade de interlocução com equipes médicas e coordenação de enfermagem.' },
                  { title: 'Proatividade na Mitigação de Riscos', description: 'Alertou tempestivamente sobre saturação de tablespace antes de gerar impacto nos usuários.' }
                ]
              },
              {
                title: '5. Oportunidades de Melhoria Construtivas',
                items: [
                  { title: 'Apontamentos Intermediários', description: 'Documentar andamentos antes das 17h para evitar que chamados caiam no alerta noturno das 04h.' }
                ]
              },
              {
                title: '6. Combinados, Metas & Próximos Passos',
                items: [
                  { title: 'Mentoria Técnica Semanal', description: 'Dedicar 2h semanais para compartilhar conhecimento de módulos assistenciais com a equipe N1.' },
                  { title: 'Documentação de POP de Contingência', description: 'Revisar e publicar o procedimento operacional padrão do módulo cirúrgico até o final do mês.' }
                ]
              }
            ],
            governanceNotes: 'Documento confidencial gerencial estruturado conforme modelo canônico TPL-03. Sem natureza disciplinar.',
            limitations: [
              'Excluídas notas subjetivas e avaliações pessoais automatizadas sem critérios prévios.'
            ]
          }
        };

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `Dossiê de Feedback Individual estruturado para **${targetTech}** gerado com sucesso sob o modelo **TPL-03**! As evidências foram fundamentadas diretamente nos registros do GLPI e no POP-TIN-017, garantindo caráter construtivo, objetivo e livre de notas punitivas automatizadas.`,
          timestamp: '10:10 (Brasília)',
          pathType: 'AGY',
          sources: [`Histórico Nominal GLPI (${targetTech})`, 'Auditorias POP-TIN-017', 'Logs de Fechamento de Chamados'],
          quickArtifact: feedbackArtifact,
          analyticalDetail: `Métricas do colaborador no ciclo: 58 chamados resolvidos, tempo médio de 18.4h, taxa de reabertura de 1.7% e índice de qualidade documental de 94%.`
        };

        appendMessageToActiveSession(botMsg, `Feedback Individual — ${targetTech}`, 'TPL-03');
        setIsProcessing(false);
      }, 1000);

    // 4. TPL-04: GESTÃO DE PROJETOS
    } else if (lower.includes('projeto') || lower.includes('projetos') || lower.includes('tpl-04') || lower.includes('pacs') || lower.includes('apresentação sobre o andamento')) {
      const targetProject = lower.includes('tasy') ? 'Atualização ERP Tasy v3.4' :
                            lower.includes('wifi') || lower.includes('rede') ? 'Infraestrutura Wi-Fi Assistencial' :
                            'Expansão Storage PACS & Laudos CDI';

      setProcessingStatus(`Etapa 1/3: Coletando marcos, cronograma e entregas do projeto ${targetProject}...`);
      setTimeout(() => {
        setProcessingStatus('Etapa 2/3: Mapeando riscos ativos, bloqueios e decisões necessárias da diretoria...');
      }, 500);

      setTimeout(() => {
        const projectArtifact: ArtifactPanel = {
          id: `art-project-${Date.now()}`,
          templateType: 'TPL-04',
          templateName: 'TPL-04 — Gestão de Projetos',
          title: `Painel do Projeto — ${targetProject}`,
          ownerName: 'Agente Gerencial',
          referenceDate: 'Q4 2026',
          generationDate: '06/11/2026 10:10',
          source: 'REALTIME',
          version: 'v2.2 (Minuta Agente)',
          status: 'RASCUNHO',
          parameters: {
            projectName: targetProject,
            period: 'Q4 2026'
          },
          summary: {
            headline: 'Projeto em 68% de conclusão física. Marco de migração de volumes concluído; testes de estresse no CDI agendados.',
            criticalAlertsCount: 1,
            topPriorities: [
              'Homologação dos testes de estresse com 50 laudos tomográficos simultâneos no CDI',
              'Recebimento fiscal dos novos módulos de memória para o storage secundário',
              'Treinamento da equipe de radiologia na nova estação de visualização rápida'
            ],
            keyDecisionsSummary: 'Manter a janela de contingência aos domingos das 01h às 05h para não interferir na rotina assistencial.',
            metricsBrief: [
              { label: 'Progresso Geral', value: '68%', trend: 'up' },
              { label: 'Marcos Concluídos', value: '5 de 8', trend: 'up' },
              { label: 'Riscos Ativos', value: '2', trend: 'stable' },
              { label: 'Previsão Conclusão', value: '25/11/2026' }
            ]
          },
          detail: {
            sections: [
              {
                title: '1. Identificação e Situação do Projeto',
                description: 'Visão executiva do escopo, liderança e status.',
                items: [
                  { title: 'Iniciativa Estratégica', description: `${targetProject} · Patrocinador: Diretoria de TI (DTI) · Situação: No Prazo (Verde/Amarelo).` },
                  { title: 'Objetivo Principal', description: 'Garantir retenção de exames de alta resolução por 5 anos com tempo de renderização <3 segundos.' }
                ]
              },
              {
                title: '2. Etapas, Marcos e Cronograma',
                description: 'Evolução dos marcos contratuais.',
                items: [
                  { title: 'M1: Especificação e Aquisição Hardware', description: 'Concluído em 15/09 com entrega do storage SAN.', evidenceLevel: 'Fato confirmado' },
                  { title: 'M2: Instalação e Cabeamento SAN', description: 'Concluído em 02/10 com validação de enlaces 16Gbps.', evidenceLevel: 'Fato confirmado' },
                  { title: 'M3: Migração de Dados Legados (120TB)', description: 'Concluído em 28/10 com 100% de integridade comprovada por hash.', evidenceLevel: 'Fato confirmado' },
                  { title: 'M4: Testes de Carga e Estresse CDI', description: 'Em andamento (Previsão: 10/11).', evidenceLevel: 'Verificação necessária' },
                  { title: 'M5: Go-Live Definitivo', description: 'Previsto para 25/11/2026.' }
                ]
              },
              {
                title: '3. Entregas Concluídas Recentes',
                items: [
                  { title: 'Alocação de Pool Flash NVMe', description: 'Configurados 30TB de cache para acelerar laudos de emergência.', responsible: 'Carlos Ramos' }
                ]
              },
              {
                title: '4. Bloqueios e Riscos Identificados',
                items: [
                  { title: 'Risco R-02 (Latência de Rede em Picos)', description: 'Investigação do switch de distribuição assistencial no CDI.', evidenceLevel: 'Indício de desconformidade' },
                  { title: 'Dependência D-01 (Liberação Fiscal)', description: 'Aguardando faturamento de módulos complementares pela integradora.' }
                ]
              },
              {
                title: '5. Decisões Necessárias da Diretoria',
                items: [
                  { title: 'Aditivo de Suporte 24x7 Fabricante', description: 'Submeter termo aditivo para cobertura presencial durante o primeiro mês pós go-live.' }
                ]
              },
              {
                title: '6. Próximas Ações Imediatas',
                items: [
                  { title: 'Bateria de Testes Noturnos CDI', description: 'Simulação com equipe de plantão no sábado às 22h.', responsible: 'Henrique Vasconcelos / Mariana Costa' }
                ]
              }
            ],
            governanceNotes: 'Estruturado sob o template gerencial TPL-04. Pronto para apresentação executiva de comitê de projetos.'
          }
        };

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `Painel executivo de Gestão de Projetos para **${targetProject}** gerado com sucesso sob o modelo **TPL-04**! Inclui identificação, progresso geral (68%), marcos e cronograma, entregas concluídas, riscos e decisões para apresentação à diretoria.`,
          timestamp: '10:10 (Brasília)',
          pathType: 'AGY',
          sources: ['Cronograma DTI Q4', 'Métricas de I/O do Storage', 'Contrato Integrador PACS'],
          quickArtifact: projectArtifact,
          analyticalDetail: `O projeto acumula 5 marcos concluídos de 8 planejados. O marco crítico atual é a homologação de estresse simultâneo no CDI no próximo sábado.`
        };

        appendMessageToActiveSession(botMsg, `Gestão de Projetos — ${targetProject}`, 'TPL-04');
        setIsProcessing(false);
      }, 1100);

    // 5. RESPOSTA PADRÃO OPERACIONAL (CONSULTA GERAL GLPI)
    } else {
      setProcessingStatus('Processando consulta com réplica GLPI e regras POP-TIN-017...');
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `Entendido. Com base nos dados ativos do GLPI (33 chamados abertos e 80 solucionados na semana), a operação de TI do Instituto HEAL mantém estabilidade global de 98.2%.\n\nPrincipais direcionamentos sugeridos:\n1. Manter foco na normalização da telemetria da UTI Geral (#48219).\n2. Realizar a assunção nominal da prescrição obstétrica (#48191).\n3. Validar a entrega de impressora reserva na triagem do PA (#48098).\n\nVocê pode gerar qualquer um dos nossos painéis estruturados clicando nos atalhos acima ou escrevendo: *"Monte meu Daily de hoje"*, *"Prepare nosso alinhamento semanal"*, *"Gere um feedback individual"* ou *"Monte uma apresentação do projeto"*.`,
          timestamp: '10:10 (Brasília)',
          pathType: 'AGY',
          sources: ['GLPI Réplica MariaDB', 'Snapshot Noturno 04h'],
          analyticalDetail: 'Parâmetros avaliados:\n- Total de chamados com mais de 24h sem ação técnica: 3\n- Total de técnicos com sobrecarga acima de 8 chamados: 2\n- Nível de conformidade documental POP-TIN-017: 88.5%'
        };
        appendMessageToActiveSession(botMsg);
        setIsProcessing(false);
      }, 800);
    }
  };

  const handleApproveAndSave = (artifact: ArtifactPanel) => {
    const approved: ArtifactPanel = {
      ...artifact,
      status: 'APROVADO',
      version: `${artifact.version} (Homologado)`
    };
    onSaveArtifactToCatalog(approved);
    setSavedPanelSuccess(`O painel "${artifact.title}" foi aprovado e arquivado com sucesso no catálogo de Daily e Painéis!`);
    setTimeout(() => setSavedPanelSuccess(null), 5000);
  };

  const handleOpenPresentation = (artifact: ArtifactPanel) => {
    setModalArtifact(artifact);
    setIsPresentationOpen(true);
  };

  const handleOpenDetail = (artifact: ArtifactPanel) => {
    setModalArtifact(artifact);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenReview = (artifact: ArtifactPanel) => {
    setModalArtifact(artifact);
    setIsReviewModalOpen(true);
  };

  const handleSaveReviewedFromModal = (reviewed: ArtifactPanel) => {
    onSaveArtifactToCatalog(reviewed);
    setSavedPanelSuccess(`O painel "${reviewed.title}" foi revisado e homologado no catálogo com sucesso!`);
    setTimeout(() => setSavedPanelSuccess(null), 5000);
  };

  return (
    <div className="p-2 sm:p-3 w-full h-full flex gap-3 relative overflow-hidden">
      {/* SIDEBAR DE HISTÓRICO DE CONVERSAS */}
      {showHistorySidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setShowHistorySidebar(false)}
          />

          <aside className="fixed inset-y-0 left-0 z-40 md:static w-72 bg-white dark:bg-slate-900 border-r md:border border-slate-200 dark:border-slate-800 md:rounded-lg flex flex-col justify-between shrink-0 shadow-sm transition-all overflow-hidden">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Histórico de Conversas
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleStartNewSession}
                  className="p-1 rounded text-slate-500 hover:text-white hover:bg-[#134F9F] transition-colors cursor-pointer"
                  title="Nova Conversa"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistorySidebar(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Recolher histórico"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lista de Sessões */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
              {sessions.map(session => {
                const isActive = session.id === activeSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      setActiveSessionId(session.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        setShowHistorySidebar(false);
                      }
                    }}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all group flex flex-col gap-1 ${
                      isActive
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="truncate leading-tight">
                        {session.title}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 transition-opacity cursor-pointer"
                        title="Excluir conversa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      <span>{session.updatedAt}</span>
                      {session.templateGenerated && (
                        <span className="bg-blue-500/10 dark:bg-blue-500/20 text-[#134F9F] dark:text-blue-400 font-bold px-1.5 py-0.2 rounded">
                          {session.templateGenerated}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rodapé do Histórico */}
            <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <span>{sessions.length} sessões</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">Memória OK</span>
            </div>
          </aside>
        </>
      )}

      {/* ÁREA CENTRAL DO CHAT */}
      <div className="flex-1 flex flex-col justify-between min-w-0 h-full overflow-hidden">
        {/* CABEÇALHO DO AGENTE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 sm:p-3 shrink-0 mb-2 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {!showHistorySidebar && (
                <button
                  type="button"
                  onClick={() => setShowHistorySidebar(true)}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Abrir histórico de conversas"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              )}

              <div className="w-8 h-8 rounded-lg bg-[#134F9F] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate max-w-[280px] sm:max-w-md">
                    {activeSession ? activeSession.title : 'Agente Gerencial'}
                  </h2>
                  <span className="text-xs font-mono font-bold bg-blue-500/10 text-[#134F9F] dark:text-blue-400 px-2 py-0.5 rounded">
                    HEAL Ops 1.1
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Gerador inteligente de painéis · Padrão sintético primeiro, analítico sob demanda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                Snapshot 04h Auditado
              </span>
            </div>
          </div>
        </div>

        {savedPanelSuccess && (
          <div className="mb-2 p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 rounded-lg text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{savedPanelSuccess}</span>
            </div>
            <button
              type="button"
              onClick={onNavigateToSavedPanels}
              className="text-xs sm:text-sm font-bold text-[#134F9F] dark:text-blue-300 underline shrink-0 cursor-pointer"
            >
              Abrir em Daily e Painéis →
            </button>
          </div>
        )}

        {/* ÁREA DE CONVERSA COM ROLAGEM */}
        <div className={`flex-1 pr-1 mb-2 ${messages.length <= 1 ? 'overflow-hidden flex flex-col justify-center py-1' : 'overflow-y-auto space-y-4'}`}>
          {messages.length <= 1 ? (
            /* ESTADO INICIAL: APRESENTAÇÃO DOS 4 TEMPLATES COM ACESSO RÁPIDO */
            <div className="w-full flex flex-col justify-center px-1 sm:px-3">
              <div className="text-center mb-3 shrink-0">
                <div className="inline-flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#134F9F] to-blue-500 flex items-center justify-center text-white shadow-xs">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100">
                    Qual painel gerencial você deseja gerar agora?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                  Selecione um template padronizado ou digite seu pedido em linguagem natural:
                </p>
              </div>

              {/* Grid dos 4 Templates Oficiais (TPL-01 a TPL-04) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full">
                {templateChips.map((tpl) => {
                  const Icon = tpl.icon;
                  return (
                    <div
                      key={tpl.id}
                      className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#134F9F] dark:hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-lg ${tpl.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {tpl.code}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {tpl.label}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {tpl.id === 'TPL-01' ? 'Resumo executivo do dia, pendências >24h e as 3 prioridades do plantão.' :
                           tpl.id === 'TPL-02' ? 'Balanço da semana 45, vazão de chamados, riscos e prioridades.' :
                           tpl.id === 'TPL-03' ? 'Dossiê objetivo baseado em evidências factuais e POP-TIN-017.' :
                           'Painel executivo com progresso %, marcos, riscos e decisões.'}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSend(tpl.prompt)}
                          className="flex-1 py-1.5 px-2 bg-[#134F9F] hover:bg-blue-800 text-white font-semibold text-xs rounded transition-colors text-center cursor-pointer shadow-2xs"
                        >
                          Gerar Agora
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveParamTemplate(tpl.id)}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                          title="Configurar Parâmetros"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* LISTA DE MENSAGENS COM PREVIEW DOS ARTEFATOS */
            messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-4xl lg:max-w-5xl rounded-xl p-3.5 sm:p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#134F9F] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs'
                  }`}
                >
                  {/* Header da Mensagem do Bot */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Agente Gerencial</span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                          msg.pathType === 'FAST_PATH' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-blue-500/15 text-[#134F9F] dark:text-blue-400'
                        }`}>
                          {msg.pathType || 'AGY'}
                        </span>
                      </div>
                      <span className="font-mono text-xs">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Conteúdo Principal da Resposta */}
                  <div className="whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* PRÉVIA VISUAL DO ARTEFATO GERADO COM TODAS AS 4 AÇÕES INTEGRADAS */}
                  {msg.quickArtifact && (
                    <div className="mt-3.5 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-blue-500/10 text-[#134F9F] dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                            {msg.quickArtifact.templateType}
                          </span>
                          <strong className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                            {msg.quickArtifact.title}
                          </strong>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          msg.quickArtifact.status === 'APROVADO'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}>
                          {msg.quickArtifact.status}
                        </span>
                      </div>

                      {/* Headline Executiva */}
                      <p className="text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                        "{msg.quickArtifact.summary.headline}"
                      </p>

                      {/* 4 KPIs do Painel */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                        {msg.quickArtifact.summary.metricsBrief.map((m, idx) => (
                          <div key={idx} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
                            <span className="text-[10px] text-slate-400 block truncate">{m.label}</span>
                            <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{m.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* As 3 Prioridades */}
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] block">
                          Top Prioridades & Encaminhamentos:
                        </span>
                        <div className="space-y-1 text-slate-600 dark:text-slate-300">
                          {msg.quickArtifact.summary.topPriorities.slice(0, 3).map((p, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 p-1 rounded bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60">
                              <span className="text-[#134F9F] dark:text-blue-400 font-bold font-mono text-xs">{idx + 1}.</span>
                              <span className="text-xs">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BARRA DE AÇÕES EXECUTIVAS DO ARTEFATO CONFORME ITEM 4 */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Fonte: {msg.quickArtifact.source} · {msg.quickArtifact.referenceDate}
                        </span>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleOpenPresentation(msg.quickArtifact!)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded shadow-2xs transition-colors cursor-pointer"
                            title="Abrir no Modo Apresentação Executivo"
                          >
                            <Presentation className="w-3.5 h-3.5" />
                            <span>Apresentar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDetail(msg.quickArtifact!)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="Acessar Evidências e Detalhes Analíticos"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Evidências</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenReview(msg.quickArtifact!)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="Revisão Humana do Gestor"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>Revisão</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApproveAndSave(msg.quickArtifact!)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded transition-colors cursor-pointer"
                            title="Salvar no Catálogo Oficial"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Salvar no Catálogo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botão de Revelação Progressiva ("Ver análise completa") */}
                  {msg.analyticalDetail && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setExpandedDetailId(expandedDetailId === msg.id ? null : msg.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        <span>{expandedDetailId === msg.id ? 'Ocultar análise completa' : 'Ver análise completa com fontes e evidências'}</span>
                        {expandedDetailId === msg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {expandedDetailId === msg.id && (
                        <div className="mt-2 p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
                          <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                            Detalhamento Factual & Justificativas
                          </div>
                          <p className="whitespace-pre-line leading-relaxed">
                            {msg.analyticalDetail}
                          </p>
                          {msg.sources && (
                            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                              <strong>Fontes:</strong>
                              <span>{msg.sources.join(' · ')}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isProcessing && (
            <div className="flex flex-col items-start">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 shadow-xs flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#134F9F] animate-spin shrink-0" />
                <span>{processingStatus || 'Processando modelo com regras canônicas...'}</span>
              </div>
            </div>
          )}
          {messages.length > 1 && <div ref={messagesEndRef} />}
        </div>

        {/* BARRA DE SELEÇÃO RÁPIDA DE TEMPLATES (CHIPS FIXOS NO RODAPÉ DO CHAT) */}
        <div className="py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 text-xs">
          <span className="text-slate-400 text-xs font-semibold shrink-0">Modelos:</span>
          {templateChips.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleSend(tpl.prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#134F9F] dark:hover:border-blue-400 text-slate-700 dark:text-slate-300 transition-colors text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-[#134F9F] dark:text-blue-400" />
                <span>{tpl.label}</span>
              </button>
            );
          })}
        </div>

        {/* CAMPO DE ENTRADA DO CHAT */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative shrink-0 pt-1"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ex: 'Monte meu Daily de hoje', 'Prepare nosso alinhamento semanal', 'Gere um feedback individual'..."
              disabled={isProcessing}
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isProcessing}
              className="px-4 py-2.5 bg-[#134F9F] hover:bg-blue-800 text-white rounded-lg transition-colors font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </div>
        </form>
      </div>

      {/* MODAL DE PARÂMETROS DO TEMPLATE (Quando o usuário clica no seletor avançado) */}
      {activeParamTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#134F9F] dark:text-blue-400">
                  {activeParamTemplate}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Configuração de Parâmetros
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveParamTemplate(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {activeParamTemplate === 'TPL-03' ? (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Selecione o Colaborador para Feedback:
                  </label>
                  <select
                    value={selectedCollaborator}
                    onChange={(e) => setSelectedCollaborator(e.target.value)}
                    className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Mariana Costa">Mariana Costa (Sistemas Clínicos)</option>
                    <option value="Carlos Eduardo">Carlos Eduardo (Infraestrutura)</option>
                    <option value="Lucas Mendes">Lucas Mendes (Suporte Presencial N1/N2)</option>
                    <option value="Rafael Albuquerque">Rafael Albuquerque (Suporte UTI)</option>
                    <option value="Fernanda Lima">Fernanda Lima (Sistemas Tasy)</option>
                  </select>
                </div>
              ) : activeParamTemplate === 'TPL-04' ? (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Selecione a Iniciativa / Projeto:
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Expansão Storage PACS & Laudos CDI">Expansão Storage PACS & Laudos CDI</option>
                    <option value="Atualização ERP Tasy v3.4">Atualização ERP Tasy v3.4</option>
                    <option value="Infraestrutura Wi-Fi Assistencial">Infraestrutura Wi-Fi Assistencial</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Período de Referência:
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Hoje (06/11/2026)">Hoje (06/11/2026 - Snapshot 04h)</option>
                    <option value="Ontem (05/11/2026)">Ontem (05/11/2026)</option>
                    <option value="Semana 45/2026">Semana 45/2026 (03/11 a 07/11)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveParamTemplate(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmTemplateWithParams}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded shadow-xs cursor-pointer"
              >
                Gerar com Parâmetros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MODO APRESENTAÇÃO */}
      {isPresentationOpen && modalArtifact && (
        <PresentationModeModal
          panel={modalArtifact}
          isOpen={isPresentationOpen}
          onClose={() => setIsPresentationOpen(false)}
          onOpenTicketById={onOpenTicketById}
        />
      )}

      {/* DRAWER ANALÍTICO */}
      {isDetailDrawerOpen && modalArtifact && (
        <TemplateDetailDrawer
          isOpen={isDetailDrawerOpen}
          onClose={() => setIsDetailDrawerOpen(false)}
          panel={modalArtifact}
          onOpenTicketById={onOpenTicketById}
          onOpenPresentation={() => {
            setIsDetailDrawerOpen(false);
            setIsPresentationOpen(true);
          }}
          onOpenHumanReview={() => {
            setIsDetailDrawerOpen(false);
            setIsReviewModalOpen(true);
          }}
        />
      )}

      {/* MODAL DE REVISÃO HUMANA */}
      {isReviewModalOpen && modalArtifact && (
        <HumanReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          panel={modalArtifact}
          onSaveReviewedPanel={handleSaveReviewedFromModal}
        />
      )}
    </div>
  );
};
