/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Dados Fictícios de Demonstração Homologados para Prototipação
 * IMPORTANTE: Dados estritamente simulados. Nenhum dado sensível de paciente ou credencial real.
 */

import { 
  Ticket, 
  Technician, 
  PendingItem, 
  AuditSnapshot, 
  ArtifactPanel,
  CurrentUser,
  MeetingAgreement,
  DevelopmentCommitment,
  ManagedProject,
  DevelopmentPlanSummary,
  FormalAlignment,
  ManagerialFeedback,
  FeedbackAndAlignmentSettings
} from '../types';

export const CURRENT_TIMESTAMP_BRT = '06/11/2026 10:10 (Brasília)';
export const LAST_SNAPSHOT_TIME_BRT = '06/11/2026 04:00 (Oficial)';

export const MOCK_USERS: CurrentUser[] = [
  {
    id: 'usr-1',
    name: 'Henrique Vasconcelos',
    email: 'h.vasconcelos@heal.org.br',
    role: 'GESTOR',
    department: 'Gestão Operacional de TI',
    avatarUrl: 'HV',
  },
  {
    id: 'usr-2',
    name: 'Mariana Costa',
    email: 'm.costa@heal.org.br',
    role: 'TECNICO',
    department: 'Sistemas Clínicos / Tasy',
    avatarUrl: 'MC',
  },
  {
    id: 'usr-3',
    name: 'Administrador HEAL',
    email: 'admin.ops@heal.org.br',
    role: 'ADMIN',
    department: 'Governança & Segurança da Informação',
    avatarUrl: 'AD',
  },
];

export const MOCK_TECHNICIANS: Technician[] = [
  {
    id: 101,
    name: 'Mariana Costa',
    role: 'Analista Sênior de Sistemas Clínicos (Tasy)',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    isManagementGroup: false,
    activeTicketsCount: 7,
    ticketsWithoutEvolution24hCount: 1,
    resolvedInPeriodCount: 14,
    avgObservedResolutionHours: 18.4,
    avatarInitials: 'MC',
    email: 'm.costa@heal.org.br',
  },
  {
    id: 102,
    name: 'Carlos Eduardo Ramos',
    role: 'Especialista em Redes & Infraestrutura Crítica',
    groupId: 15,
    groupName: 'Infraestrutura & Redes',
    isManagementGroup: false,
    activeTicketsCount: 9,
    ticketsWithoutEvolution24hCount: 2,
    resolvedInPeriodCount: 19,
    avgObservedResolutionHours: 22.1,
    avatarInitials: 'CR',
    email: 'c.ramos@heal.org.br',
  },
  {
    id: 103,
    name: 'Rafael Albuquerque',
    role: 'Técnico de Campo (Centro Cirúrgico e UTI)',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    isManagementGroup: false,
    activeTicketsCount: 5,
    ticketsWithoutEvolution24hCount: 0,
    resolvedInPeriodCount: 23,
    avgObservedResolutionHours: 7.2,
    avatarInitials: 'RA',
    email: 'r.albuquerque@heal.org.br',
  },
  {
    id: 104,
    name: 'Fernanda Lima',
    role: 'DBA & Especialista em PACS/Imagens',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    isManagementGroup: false,
    activeTicketsCount: 4,
    ticketsWithoutEvolution24hCount: 1,
    resolvedInPeriodCount: 8,
    avgObservedResolutionHours: 31.0,
    avatarInitials: 'FL',
    email: 'f.lima@heal.org.br',
  },
  {
    id: 105,
    name: 'Lucas Mendes',
    role: 'Analista de Suporte N1/N2',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    isManagementGroup: false,
    activeTicketsCount: 8,
    ticketsWithoutEvolution24hCount: 3,
    resolvedInPeriodCount: 16,
    avgObservedResolutionHours: 14.5,
    avatarInitials: 'LM',
    email: 'l.mendes@heal.org.br',
  },
  // Grupo 48 - Gestão: incluído para transparência de governança, mas EXCLUÍDO dos rankings operacionais
  {
    id: 4801,
    name: 'Dr. Roberto Silveira',
    role: 'Coordenador Executivo de TI Hospitalar',
    groupId: 48,
    groupName: 'Grupo 48 Gestão',
    isManagementGroup: true,
    activeTicketsCount: 2,
    ticketsWithoutEvolution24hCount: 0,
    resolvedInPeriodCount: 3,
    avgObservedResolutionHours: 48.0,
    avatarInitials: 'RS',
    email: 'r.silveira@heal.org.br',
  },
  {
    id: 4802,
    name: 'Paula Nogueira',
    role: 'Supervisora de Operações e Processos',
    groupId: 48,
    groupName: 'Grupo 48 Gestão',
    isManagementGroup: true,
    activeTicketsCount: 1,
    ticketsWithoutEvolution24hCount: 0,
    resolvedInPeriodCount: 2,
    avgObservedResolutionHours: 36.0,
    avatarInitials: 'PN',
    email: 'p.nogueira@heal.org.br',
  },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 48219,
    title: 'Falha de transmissão de telemetria dos monitores cardíacos — Leitos 09 a 14',
    status: 'em_atendimento',
    priorityGLPI: 'media', // No GLPI está média, mas gerencialmente é crítica!
    suggestedPriority: 'P1_CRITICA',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    technicianId: 103,
    technicianName: 'Rafael Albuquerque',
    category: 'Equipamentos Médicos / Monitorização',
    dateCreation: '2026-11-06T06:15:00-03:00',
    lastHumanActionDate: '2026-11-06T08:45:00-03:00',
    dateMod: '2026-11-06T09:12:00-03:00', // Modificado por bot de coleta
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'UTI Geral Adulto — 3º Andar',
    clinicalImpactAssessed: true,
    evidenceGaps: ['Falta validação de conectividade do switch reserva no rack Sul'],
    description: 'Central de enfermagem reportou queda intermitente nos dados dos leitos 09 a 14 no posto central. Monitores locais preservam alarmes sonoros auditados pela engenharia clínica.',
    tasks: [
      { id: 't1', description: 'Inspeção física do cabeamento estruturado patch panel C12', status: 'concluida', assignedTo: 'Rafael Albuquerque', date: '06/11 07:30' },
      { id: 't2', description: 'Troca de transceiver SFP no switch assistencial', status: 'em_andamento', assignedTo: 'Carlos Eduardo Ramos', date: '06/11 08:45' }
    ],
    followups: [
      { id: 'f1', authorName: 'Rafael Albuquerque', authorType: 'humana', date: '06/11 08:45', content: 'Substituído cabo drop do leito 11. Leitos 09 e 10 normalizaram. Investigando porta de uplink para 12-14.', isPrivate: false },
      { id: 'f2', authorName: 'GLPI Integration Daemon', authorType: 'automacao', date: '06/11 09:12', content: 'Status de ping da VLAN 104 restabelecido parcialmente (perda de 4%).', isPrivate: true }
    ]
  },
  {
    id: 48204,
    title: 'Lentidão severa na abertura de laudos radiológicos no visualizador PACS',
    status: 'em_atendimento',
    priorityGLPI: 'alta',
    suggestedPriority: 'P1_CRITICA',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    technicianId: 104,
    technicianName: 'Fernanda Lima',
    category: 'Sistemas de Imagem / PACS',
    dateCreation: '2026-11-05T14:30:00-03:00',
    lastHumanActionDate: '2026-11-05T17:10:00-03:00', // Sem evolução humana > 17h
    dateMod: '2026-11-06T04:00:00-03:00', // Batch do snapshot
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'Centro de Diagnóstico por Imagem (CDI)',
    clinicalImpactAssessed: true,
    evidenceGaps: ['Sem evidência de teste de IOPS no storage NAS-PACS-02', 'Ausência de log de transação do SQL do PACS anexado'],
    description: 'Médicos radiologistas relatam que tomografias com mais de 800 cortes demoram mais de 3 minutos para renderizar na estação de trabalho.',
    tasks: [
      { id: 't1', description: 'Verificação da fila de renderização DICOM', status: 'concluida', assignedTo: 'Fernanda Lima', date: '05/11 16:00' },
      { id: 't2', description: 'Coleta de métricas de I/O de disco no pool 3', status: 'pendente', assignedTo: 'Fernanda Lima', date: '05/11 17:10' }
    ],
    followups: [
      { id: 'f1', authorName: 'Fernanda Lima', authorType: 'humana', date: '05/11 17:10', content: 'Identificado gargalo de I/O no nó 2 do cluster PACS. Abrindo chamado emergencial com fornecedor da solução de storage.', isPrivate: false }
    ]
  },
  {
    id: 48191,
    title: 'Chamado sem técnico nominal: Travamento da prescrição eletrônica Tasy no Centro Obstétrico',
    status: 'novo',
    priorityGLPI: 'alta',
    suggestedPriority: 'P1_CRITICA',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    technicianId: undefined,
    technicianName: undefined, // SEM TÉCNICO NOMINAL!
    category: 'Prontuário Eletrônico / Prescrição',
    dateCreation: '2026-11-06T07:40:00-03:00',
    lastHumanActionDate: '2026-11-06T07:40:00-03:00',
    dateMod: '2026-11-06T07:40:00-03:00',
    isWithoutEvolution24h: false,
    hasNominalTech: false,
    hospitalLocation: 'Centro Obstétrico — 2º Andar',
    clinicalImpactAssessed: true,
    evidenceGaps: ['Chamado sem atribuição técnica há mais de 2 horas em setor assistencial de risco'],
    description: 'Posto de enfermagem obstétrica relata erro de timeout ao confirmar aprazamento de medicação pós-parto. Chamado aberto diretamente pelo coordenador de enfermagem.',
    tasks: [],
    followups: [
      { id: 'f1', authorName: 'Triagem Automática GLPI', authorType: 'automacao', date: '06/11 07:40', content: 'Chamado classificado para Grupo 12 - Sistemas Hospitalares. Aguardando assunção nominal.', isPrivate: false }
    ]
  },
  {
    id: 48098,
    title: 'Impressora térmica de pulseiras de identificação travando na Triagem Pronto Atendimento',
    status: 'pendente',
    priorityGLPI: 'media',
    suggestedPriority: 'P2_ALTA',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    technicianId: 105,
    technicianName: 'Lucas Mendes',
    category: 'Hardware Assistencial / Impressão Térmica',
    dateCreation: '2026-11-04T11:20:00-03:00',
    lastHumanActionDate: '2026-11-04T15:30:00-03:00', // > 24h sem evolução observável!
    dateMod: '2026-11-05T04:00:00-03:00',
    isWithoutEvolution24h: true, // EXCEÇÃO 24H!
    hasNominalTech: true,
    hospitalLocation: 'Pronto Atendimento Adulto — Triagem',
    clinicalImpactAssessed: false,
    evidenceGaps: ['Ausência de registro de intervenção técnica nas últimas 42 horas', 'Não há comprovação se foi fornecida impressora de contingência'],
    description: 'Equipamento Zebra ZD510 cortando código Datamatrix das pulseiras dos pacientes. Triagem utilizando impressora secundária da recepção provisoriamente.',
    tasks: [
      { id: 't1', description: 'Limpeza do sensor óptico e rolete tracionador', status: 'concluida', assignedTo: 'Lucas Mendes', date: '04/11 14:00' },
      { id: 't2', description: 'Troca da cabeça de impressão térmica', status: 'em_andamento', assignedTo: 'Lucas Mendes', date: '04/11 15:30' }
    ],
    followups: [
      { id: 'f1', authorName: 'Lucas Mendes', authorType: 'humana', date: '04/11 15:30', content: 'Cabeça térmica danificada. Solicitado componente no almoxarifado técnico.', isPrivate: false }
    ]
  },
  {
    id: 48112,
    title: 'Leitor de código de barras sem leitura na checagem beira-leito — Clínica Médica 4º Andar',
    status: 'em_atendimento',
    priorityGLPI: 'baixa',
    suggestedPriority: 'P3_MEDIA',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    technicianId: 105,
    technicianName: 'Lucas Mendes',
    category: 'Periféricos Assistenciais',
    dateCreation: '2026-11-04T09:00:00-03:00',
    lastHumanActionDate: '2026-11-04T10:15:00-03:00',
    dateMod: '2026-11-05T04:00:00-03:00',
    isWithoutEvolution24h: true, // > 24h sem evolução
    hasNominalTech: true,
    hospitalLocation: 'Internação 4º Andar — Posto 2',
    clinicalImpactAssessed: false,
    evidenceGaps: ['Mais de 48h sem apontamento de teste do leitor USB'],
    description: 'Leitor sem fio Zebra não faz o pareamento com a base do carrinho de enfermagem.',
    tasks: [],
    followups: [
      { id: 'f1', authorName: 'Lucas Mendes', authorType: 'humana', date: '04/11 10:15', content: 'Base foi reconfigurada via código de barras de fábrica. Ficou em teste no posto.', isPrivate: false }
    ]
  },
  {
    id: 48155,
    title: 'Inconsistência de estoque de antibióticos na interface Farmácia Central / Tasy',
    status: 'planejado',
    priorityGLPI: 'alta',
    suggestedPriority: 'P2_ALTA',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    technicianId: 101,
    technicianName: 'Mariana Costa',
    category: 'Integrações de Farmácia & Estoque',
    dateCreation: '2026-11-05T08:30:00-03:00',
    lastHumanActionDate: '2026-11-06T09:00:00-03:00',
    dateMod: '2026-11-06T09:05:00-03:00',
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'Farmácia Central — Subsolo 1',
    clinicalImpactAssessed: true,
    evidenceGaps: ['Aguardando conferência física de 2 lotes de Meropenem pelo farmacêutico responsável'],
    description: 'Interface de dispensa automática acusou divergência de 14 ampolas entre saldo físico e contábil após reinicialização do serviço de mensageria HL7.',
    tasks: [
      { id: 't1', description: 'Reconciliação da fila de mensagens HL7', status: 'concluida', assignedTo: 'Mariana Costa', date: '06/11 08:50' },
      { id: 't2', description: 'Reprocessamento das transações pendentes no Tasy', status: 'em_andamento', assignedTo: 'Mariana Costa', date: '06/11 09:00' }
    ],
    followups: [
      { id: 'f1', authorName: 'Mariana Costa', authorType: 'humana', date: '06/11 09:00', content: 'Fila HL7 expurgada de mensagens duplicadas. Reprocessamento em andamento em ambiente de contingência.', isPrivate: false }
    ]
  },
  {
    id: 48180,
    title: 'Ponto de rede oscilando no consultório de triagem pediátrica do Pronto Socorro',
    status: 'em_atendimento',
    priorityGLPI: 'media',
    suggestedPriority: 'P3_MEDIA',
    groupId: 15,
    groupName: 'Infraestrutura & Redes',
    technicianId: 102,
    technicianName: 'Carlos Eduardo Ramos',
    category: 'Infraestrutura de Rede / Cabeamento',
    dateCreation: '2026-11-05T16:00:00-03:00',
    lastHumanActionDate: '2026-11-06T08:10:00-03:00',
    dateMod: '2026-11-06T08:15:00-03:00',
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'Pronto Atendimento Infantil',
    clinicalImpactAssessed: false,
    evidenceGaps: [],
    description: 'Médica pediatra informou perda momentânea da sessão do prontuário durante atendimento.',
    tasks: [
      { id: 't1', description: 'Certificação do link de par trançado Cat6', status: 'concluida', assignedTo: 'Carlos Eduardo Ramos', date: '06/11 08:10' }
    ],
    followups: [
      { id: 'f1', authorName: 'Carlos Eduardo Ramos', authorType: 'humana', date: '06/11 08:10', content: 'Conector RJ45 fêmea no espelho de parede estava com pino 3 com oxidação mecânica. Tomada refeita e link certificado a 1Gbps full-duplex.', isPrivate: false }
    ]
  },
  {
    id: 47990,
    title: 'Falha na rotina de replicação do banco de dados analítico de indicadores hospitalares',
    status: 'solucionado',
    priorityGLPI: 'media',
    suggestedPriority: 'P3_MEDIA',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    technicianId: 104,
    technicianName: 'Fernanda Lima',
    category: 'Bancos de Dados & BI',
    dateCreation: '2026-11-03T02:00:00-03:00',
    lastHumanActionDate: '2026-11-05T18:20:00-03:00',
    dateMod: '2026-11-05T18:20:00-03:00',
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'Data Center Primário',
    clinicalImpactAssessed: false,
    evidenceGaps: [],
    description: 'Job noturno de CDC (Change Data Capture) falhou por falta de espaço temporário no tablespace.',
    tasks: [
      { id: 't1', description: 'Expansão de 100GB no storage LUN-DB01', status: 'concluida', assignedTo: 'Fernanda Lima', date: '05/11 17:00' },
      { id: 't2', description: 'Reprocessamento dos snapshots históricos', status: 'concluida', assignedTo: 'Fernanda Lima', date: '05/11 18:20' }
    ],
    followups: [
      { id: 'f1', authorName: 'Fernanda Lima', authorType: 'humana', date: '05/11 18:20', content: 'Espaço ampliado e replicação sincronizada com sucesso. Indicadores atualizados.', isPrivate: false }
    ]
  }
];

export const MOCK_PENDINGS: PendingItem[] = [
  {
    id: 'pend-01',
    stableFingerprint: 'HEAL-POP017-48098-FPT1',
    ticketId: 48098,
    ticketTitle: 'Impressora térmica de pulseiras de identificação travando na Triagem Pronto Atendimento',
    status: 'PERSISTENT',
    evidenceLevel: 'Indício de desconformidade',
    popRule: 'POP-TIN-017 v2.4 (Subitem 4.2 - Limiar 24h sem ação técnica documentada)',
    daysOpen: 2,
    assignedTechnicianName: 'Lucas Mendes',
    groupName: 'Suporte Presencial Assistencial',
    description: 'Chamado em setor crítico (Triagem) sem registro de intervenção humana documentada há mais de 42 horas.',
    evidenceNotes: 'POP-TIN-017 estabelece que setores de classificação de risco exigem acompanhamento com intervalo máximo de 24h. Ausência de atualização não comprova ausência de trabalho, porém enseja verificação gerencial imediata.',
    lastAuditDate: '06/11/2026 04:00',
    transitionHistory: [
      { from: 'NEW', to: 'PERSISTENT', timestamp: '06/11/2026 04:00', reason: 'Auditado no snapshot 04h: permaneceu >24h sem log de ação humana.' },
      { from: 'NEW', to: 'NEW', timestamp: '05/11/2026 04:00', reason: 'Entrada inicial no snapshot com prazo em curso.' }
    ]
  },
  {
    id: 'pend-02',
    stableFingerprint: 'HEAL-POP017-48191-FPT2',
    ticketId: 48191,
    ticketTitle: 'Chamado sem técnico nominal: Travamento da prescrição eletrônica Tasy no Centro Obstétrico',
    status: 'NEW',
    evidenceLevel: 'Desconformidade confirmada',
    popRule: 'POP-TIN-017 v2.4 (Subitem 3.1 - Atribuição Nominal Obrigatória para Área Assistencial)',
    daysOpen: 1,
    assignedTechnicianName: undefined,
    groupName: 'Sistemas Hospitalares',
    description: 'Chamado aberto para área assistencial de risco vital há mais de 2 horas apenas com grupo atribuído e sem responsável técnico nominal.',
    evidenceNotes: 'Fato comprovado no GLPI: campo "Técnico Atribuído" nulo. Regra institucional exige assunção nominal em até 30 minutos em áreas críticas.',
    lastAuditDate: '06/11/2026 04:00',
    transitionHistory: [
      { from: 'NEW', to: 'NEW', timestamp: '06/11/2026 08:00', reason: 'Detectado na varredura operacional matinal.' }
    ]
  },
  {
    id: 'pend-03',
    stableFingerprint: 'HEAL-POP017-48204-FPT3',
    ticketId: 48204,
    ticketTitle: 'Lentidão severa na abertura de laudos radiológicos no visualizador PACS',
    status: 'PERSISTENT',
    evidenceLevel: 'Verificação necessária',
    popRule: 'POP-TIN-017 v2.4 (Subitem 5.1 - Evidência de Contato com Fornecedor de Terceiros)',
    daysOpen: 2,
    assignedTechnicianName: 'Fernanda Lima',
    groupName: 'Sistemas Hospitalares',
    description: 'Apontamento técnico menciona acionamento de terceiro fornecedor de storage, porém sem número de protocolo ou comprovante formal anexado.',
    evidenceNotes: 'Necessário confirmar se o ticket externo foi efetivamente aberto junto ao suporte de nível 3 da fabricante do storage PACS.',
    lastAuditDate: '06/11/2026 04:00',
    transitionHistory: [
      { from: 'NEW', to: 'PERSISTENT', timestamp: '06/11/2026 04:00', reason: 'Persistência sem registro de evidência de protocolo externo.' }
    ]
  },
  {
    id: 'pend-04',
    stableFingerprint: 'HEAL-POP017-47990-FPT4',
    ticketId: 47990,
    ticketTitle: 'Falha na rotina de replicação do banco de dados analítico de indicadores hospitalares',
    status: 'RESOLVED_WITH_EVIDENCE',
    evidenceLevel: 'Fato confirmado',
    popRule: 'POP-TIN-017 v2.4 (Subitem 6.3 - Solução com Evidência Técnica Auditável)',
    daysOpen: 3,
    assignedTechnicianName: 'Fernanda Lima',
    groupName: 'Sistemas Hospitalares',
    description: 'Chamado concluído com relatório de volumetria de disco e print de sincronismo do job CDC anexados.',
    evidenceNotes: 'Auditoria confirmou conformidade documental plena: causa raiz identificada, ação preventiva registrada e logs válidos anexados.',
    lastAuditDate: '06/11/2026 04:00',
    transitionHistory: [
      { from: 'PERSISTENT', to: 'RESOLVED_WITH_EVIDENCE', timestamp: '06/11/2026 04:00', reason: 'Resolução comprovada na auditoria oficial 04h.' }
    ]
  }
];

export const MOCK_AUDITS: AuditSnapshot[] = [
  {
    id: 'audit-20261106-0400',
    timestamp: '06/11/2026 04:00',
    type: 'SNAPSHOT_04H',
    totalTicketsEvaluated: 142,
    newPendingsCount: 3,
    persistentPendingsCount: 8,
    reopenedPendingsCount: 1,
    resolvedWithEvidenceCount: 11,
    rulesEvaluated: ['POP-TIN-017 v2.4', 'POP-TIN-008 v1.9', 'Instrução Normativa DTI 03/2026'],
    limitations: 'Varredura automática via réplica somente-leitura do MariaDB GLPI. Não audita chamados com sigilo médico restrito pelo DPO.',
    auditor: 'Motor de Auditoria Noturna HEAL (Agendado 04h00)',
    status: 'CONCLUIDO'
  },
  {
    id: 'audit-20261105-0400',
    timestamp: '05/11/2026 04:00',
    type: 'SNAPSHOT_04H',
    totalTicketsEvaluated: 138,
    newPendingsCount: 6,
    persistentPendingsCount: 7,
    reopenedPendingsCount: 0,
    resolvedWithEvidenceCount: 9,
    rulesEvaluated: ['POP-TIN-017 v2.4', 'POP-TIN-008 v1.9'],
    limitations: 'Janela de manutenção programada no switch core às 03:30 causou atraso de 12 minutos na consolidação dos hashes.',
    auditor: 'Motor de Auditoria Noturna HEAL (Agendado 04h00)',
    status: 'CONCLUIDO'
  },
  {
    id: 'audit-20261104-1630',
    timestamp: '04/11/2026 16:30',
    type: 'MANUAL',
    totalTicketsEvaluated: 135,
    newPendingsCount: 2,
    persistentPendingsCount: 9,
    reopenedPendingsCount: 0,
    resolvedWithEvidenceCount: 5,
    rulesEvaluated: ['POP-TIN-017 v2.4'],
    limitations: 'Auditoria manual sob demanda solicitada pela Coordenação antes da reunião do comitê de segurança assistencial.',
    auditor: 'Henrique Vasconcelos (Gestor TI)',
    status: 'CONCLUIDO'
  }
];

export const MOCK_SAVED_PANELS: ArtifactPanel[] = [
  {
    id: 'art-daily-20261106',
    templateType: 'TPL-01',
    templateName: 'TPL-01 — Daily Operacional',
    title: 'Daily Operacional de TI — 06/11/2026',
    ownerName: 'Agente Gerencial',
    referenceDate: '06/11/2026',
    generationDate: '06/11/2026 07:15',
    source: 'SNAPSHOT_04H',
    version: 'v1.0 (Homologado)',
    status: 'APROVADO',
    summary: {
      headline: 'Estabilidade geral mantida com 2 pontos de atenção imediata: telemetria UTI Adulto e prescrição obstétrica sem técnico.',
      criticalAlertsCount: 2,
      topPriorities: [
        '#48219: Normalizar uplink da telemetria cardíaca leitos 12-14 na UTI Geral',
        '#48191: Atribuir responsável nominal imediato para prescrição no Centro Obstétrico',
        '#48098: Substituir impressora térmica da Triagem PA parada há >24h'
      ],
      keyDecisionsSummary: 'Priorização de campo direcionada ao Centro Cirúrgico e UTI antes das 10h. Grupo 48 apoia articulação com fornecedor PACS.',
      metricsBrief: [
        { label: 'Chamados Ativos', value: 33 },
        { label: 'Sem Evolução >24h', value: 7 },
        { label: 'Sem Técnico Nominal', value: 2 },
        { label: 'Tempo Médio Obs.', value: '18.2h' }
      ]
    },
    detail: {
      sections: [
        {
          title: '1. Resumo Executivo da Operação',
          description: 'Visão consolidada da infraestrutura e sistemas hospitalares no turno matinal.',
          items: [
            { title: 'Conectividade do Hospital', description: 'Links primário e de contingência operando com 100% de disponibilidade. Sem registros de indisponibilidade de internet ou WAN.' },
            { title: 'Sistemas Clínicos Core', description: 'Tasy ERP e visualizadores laboratoriais sem incidentes globais. Lentidão pontual reportada no PACS em investigação.' }
          ]
        },
        {
          title: '2. Pendências & Auditoria POP-TIN-017',
          description: 'Chamados em não-conformidade com as regras de documentação e tempo.',
          items: [
            { title: 'Chamado #48098 (Zebra Triagem)', description: '42 horas sem atualização observável.', responsible: 'Lucas Mendes', deadline: 'Hoje às 11:30', evidenceLevel: 'Indício de desconformidade', relatedTicketId: 48098 },
            { title: 'Chamado #48191 (Obstétrico)', description: 'Chamado assistencial sem técnico nominal.', responsible: 'Mariana Costa (Sugerido)', deadline: 'Imediato', evidenceLevel: 'Desconformidade confirmada', relatedTicketId: 48191 }
          ]
        },
        {
          title: '3. Carga e Distribuição da Equipe',
          description: 'Distribuição nominal dos 33 chamados ativos (excluindo Grupo 48 dos rankings de produtividade).',
          items: [
            { title: 'Suporte Presencial (Rafael / Lucas)', description: '13 chamados ativos. Rafael alocado na UTI Geral; Lucas focado nos periféricos do PA.' },
            { title: 'Sistemas & Dados (Mariana / Fernanda)', description: '11 chamados ativos. Foco em interfaces de farmácia e storage PACS.' },
            { title: 'Infraestrutura (Carlos Ramos)', description: '9 chamados ativos. Validação física de switches assistenciais.' }
          ]
        },
        {
          title: '4. Entregas Concluídas nas Últimas 24h',
          description: 'Chamados finalizados com evidência comprovada anexada.',
          items: [
            { title: '#47990: Banco de Indicadores', description: 'Tablespace ampliado em 100GB e réplicas CDC sincronizadas com logs validados.', evidenceLevel: 'Fato confirmado', relatedTicketId: 47990 },
            { title: '#47952: Certificado Digital Médicos', description: 'Tokens criptográficos A3 renovados para 6 cirurgiões de plantão.', evidenceLevel: 'Fato confirmado' }
          ]
        },
        {
          title: '5. As 3 Prioridades do Dia',
          description: 'Foco mandatório da liderança e técnicos para o turno.',
          items: [
            { title: 'Prioridade 1: Estabilizar Telemetria UTI Leitos 12-14', description: 'Troca de SFP e validação de pacotes na VLAN 104.', responsible: 'Rafael / Carlos Ramos', deadline: '11:00' },
            { title: 'Prioridade 2: Regularizar Prescrição Centro Obstétrico', description: 'Assunção nominal e teste de timeout do aprazamento.', responsible: 'Mariana Costa', deadline: '09:30' },
            { title: 'Prioridade 3: Entrega de Impressora Contingência PA', description: 'Instalação física de impressora térmica reserva na triagem.', responsible: 'Lucas Mendes', deadline: '10:30' }
          ]
        },
        {
          title: '6. Decisões e Encaminhamentos',
          description: 'Compromissos firmados pelo gestor autenticado com rastreabilidade.',
          items: [
            { title: 'Decisão DEC-2026-88', description: 'Autorizada abertura de chamado com garantia do fornecedor do storage PACS.' },
            { title: 'Decisão DEC-2026-89', description: 'Remanejamento de impressora térmica reserva da administração para o PA.' }
          ]
        }
      ],
      governanceNotes: 'Gerado automaticamente às 07:15 com base no SNAPSHOT_04H. Aprovado pelo Gestor Henrique Vasconcelos às 07:45.'
    }
  },
  {
    id: 'art-weekly-2026w45',
    templateType: 'TPL-02',
    templateName: 'TPL-02 — Alinhamento Semanal',
    title: 'Alinhamento Semanal TI — Semana 45/2026',
    ownerName: 'Agente Gerencial',
    referenceDate: '03/11 a 07/11/2026',
    generationDate: '04/11/2026 14:00',
    source: 'SNAPSHOT_04H',
    version: 'v1.1',
    status: 'APROVADO',
    summary: {
      headline: 'Aumento de 18% no volume de chamados de prescrição após atualização do Tasy v3.4. Resolução média estável em 18.4 horas.',
      criticalAlertsCount: 1,
      topPriorities: [
        'Ajuste fino de índices do banco Oracle do Tasy',
        'Plano de contingência para substituição de 5 switches de borda obsoletos',
        'Treinamento das novas enfermeiras no leitor beira-leito'
      ],
      keyDecisionsSummary: 'Congelamento de novas mudanças no Tasy durante o final de semana. Reunião de alinhamento com a diretoria médica na quinta-feira.',
      metricsBrief: [
        { label: 'Total Concluídos Sem.', value: 74 },
        { label: 'Backlog Atual', value: 33 },
        { label: 'Conformidade Doc.', value: '88%' },
        { label: 'Tempo Médio Semanal', value: '18.4h' }
      ]
    },
    detail: {
      sections: [
        {
          title: '1. Indicadores Chave da Semana',
          description: 'Métricas observadas de abertura, solução e documentação.',
          items: [
            { title: 'Volume Semanal', description: '82 chamados abertos vs 74 concluídos (+8 chamados no backlog líquido).' },
            { title: 'Qualidade Documental POP-TIN-017', description: '88% dos chamados fechados apresentaram logs e comprovação de ação humana comprovada.' }
          ]
        },
        {
          title: '2. Riscos & Dependências Externas',
          description: 'Fatores externos que afetam a operação da TI hospitalar.',
          items: [
            { title: 'Fornecedor PACS', description: 'Demora média de 6h para retorno em chamados de severidade 2.' },
            { title: 'Almoxarifado de Peças', description: 'Estoque de transceivers SFP e fontes redundantes em nível mínimo de segurança.' }
          ]
        }
      ]
    }
  },
  {
    id: 'art-feedback-mariana',
    templateType: 'TPL-03',
    templateName: 'TPL-03 — Feedback e Alinhamentos',
    title: 'Feedback e Alinhamentos — Mariana Costa',
    ownerName: 'Henrique Vasconcelos',
    referenceDate: 'Outubro / Novembro 2026',
    generationDate: '02/11/2026 16:30',
    source: 'REALTIME',
    version: 'v1.0 (Revisão Gerencial)',
    status: 'APROVADO',
    summary: {
      headline: 'Excelente resolutividade em incidentes de alta complexidade do Tasy. Oportunidade de melhoria no registro tempestivo de followups durante a tarde.',
      criticalAlertsCount: 0,
      topPriorities: [
        'Priorizar registros humanos nos chamados antes das 17h para mitigar falsos alertas na auditoria noturna 04h',
        'Mentoria técnica para Lucas Mendes nos fluxos de farmácia'
      ],
      keyDecisionsSummary: 'Feedback estruturado baseado estritamente em evidências factuais do GLPI, sem caráter punitivo ou disciplinar.',
      metricsBrief: [
        { label: 'Chamados Resolvidos (Mês)', value: 58 },
        { label: 'Tempo Médio Observado', value: '18.4h' },
        { label: 'Reaberturas', value: '1.7%' },
        { label: 'Qualidade Doc.', value: '94%' }
      ]
    },
    detail: {
      sections: [
        {
          title: '1. Evidências Factuais e Métricas Observadas',
          description: 'Dados extraídos do GLPI com confirmação humana.',
          items: [
            { title: 'Desempenho em Crises', description: 'Liderou com maestria o restabelecimento do módulo de faturamento hospitalar no dia 28/10, reduzindo o tempo de parada sem geração de erros contábeis.' },
            { title: 'Índice de Reabertura', description: 'Apenas 1 chamado reaberto em 58 concluídos no último ciclo de 30 dias.' }
          ]
        },
        {
          title: '2. Pontos Positivos Comprovados',
          items: [
            { title: 'Profundo conhecimento clínico', description: 'Capacidade diferenciada de traduzir termos assistenciais em configurações precisas no ERP Tasy.' },
            { title: 'Relação com equipe assistencial', description: 'Avaliações espontâneas muito positivas da equipe de enfermagem do Bloco Cirúrgico.' }
          ]
        },
        {
          title: '3. Plano de Desenvolvimento e Combinados',
          items: [
            { title: 'Apontamento de Acompanhamentos', description: 'Registrar notas de andamento intermediárias no GLPI para evitar que chamados fiquem classificados como "sem evolução observável" no snapshot das 04h.' },
            { title: 'Apoio em Documentação', description: 'Contribuir com 2 novos POPs de contingência para o módulo de agendamento cirúrgico.' }
          ]
        }
      ],
      governanceNotes: 'Documento confidencial gerencial. Sem natureza disciplinar. Revisão agendada para 30 dias.'
    }
  },
  {
    id: 'art-project-pacs',
    templateType: 'TPL-04',
    templateName: 'TPL-04 — Gestão de Projetos',
    title: 'Painel do Projeto — Expansão do Storage PACS & Laudos',
    ownerName: 'Agente Gerencial',
    referenceDate: 'Q4 2026',
    generationDate: '01/11/2026 10:00',
    source: 'REALTIME',
    version: 'v2.2',
    status: 'APROVADO',
    summary: {
      headline: 'Projeto em 68% de conclusão. Marco de migração de volumes antigos concluído; aguardando homologação do cache SSD.',
      criticalAlertsCount: 1,
      topPriorities: [
        'Homologação dos testes de estresse com 50 laudos simultâneos no CDI',
        'Recebimento fiscal dos novos módulos de memória para o storage secundário'
      ],
      keyDecisionsSummary: 'Manter a janela de contingência aos domingos das 01h às 05h para não interferir na rotina assistencial.',
      metricsBrief: [
        { label: 'Progresso Geral', value: '68%' },
        { label: 'Marcos Concluídos', value: '5 de 8' },
        { label: 'Riscos Ativos', value: '2' },
        { label: 'Previsão Conclusão', value: '25/11/2026' }
      ]
    },
    detail: {
      sections: [
        {
          title: '1. Cronograma e Marcos do Projeto',
          items: [
            { title: 'M1: Instalação física no Data Center', description: 'Racks cabeados e alimentados por no-break trifásico redundante.', status: 'Concluído' },
            { title: 'M2: Configuração dos pools ZFS e LUNs', description: 'Configuração dos volumes RAID-Z2 concluída com testes de redundância.', status: 'Concluído' },
            { title: 'M3: Teste de Carga de Imagens Tomográficas', description: 'Simulação com 200 exames de alta resolução.', status: 'Em andamento' }
          ]
        },
        {
          title: '2. Matriz de Riscos & Mitigações',
          items: [
            { title: 'Risco de degradação durante backup noturno', description: 'Mitigação: criação de snapshot assíncrono isolado na VLAN de réplica.', evidenceLevel: 'Fato confirmado' }
          ]
        }
      ]
    }
  }
];

export const MOCK_INDICATORS_DATA = {
  kpis: {
    totalOpen: 33,
    newTickets: 4,
    inProgress: 18,
    planned: 4,
    pending: 7,
    noNominalTech: 2,
    onlyGroup: 2,
    noEvolution24h: 3,
    resolvedPeriod: 80,
    avgObservedResolutionHours: 18.2, // Explicação: média ponderada das horas corridas entre data_abertura e data_solucao para chamados concluídos no período de 7 dias
    avgResolutionFormulaNotice: 'Fórmula: Σ(Data Solução - Data Abertura) / Total Chamados Solucionados no período de 7 dias. NUNCA interpretar como SLA ou MTTR contratual.',
  },
  statusDistribution: [
    { name: 'Em Atendimento', count: 18, percentage: 54 },
    { name: 'Pendente', count: 7, percentage: 21 },
    { name: 'Planejado', count: 4, percentage: 12 },
    { name: 'Novo', count: 4, percentage: 12 }
  ],
  categoryDistribution: [
    { name: 'Sistemas Hospitalares (Tasy/PACS)', count: 14, color: '#134F9F' },
    { name: 'Suporte Assistencial & Periféricos', count: 11, color: '#0284C7' },
    { name: 'Infraestrutura & Redes Críticas', count: 6, color: '#6366F1' },
    { name: 'Acessos & Segurança', count: 2, color: '#0D9488' }
  ],
  trendSeries: [
    { day: '31/10', abertos: 14, solucionados: 12, tempoMedio: 19.5 },
    { day: '01/11', abertos: 9, solucionados: 11, tempoMedio: 18.0 },
    { day: '02/11', abertos: 7, solucionados: 8, tempoMedio: 17.2 },
    { day: '03/11', abertos: 16, solucionados: 15, tempoMedio: 18.9 },
    { day: '04/11', abertos: 18, solucionados: 17, tempoMedio: 18.4 },
    { day: '05/11', abertos: 15, solucionados: 14, tempoMedio: 18.1 },
    { day: '06/11 (Parcial)', abertos: 8, solucionados: 6, tempoMedio: 18.2 }
  ],
  documentQualityIndex: {
    overallRate: 88.5,
    criteria: [
      { name: 'Ação humana documentada antes de 24h', compliance: 91 },
      { name: 'Atribuição nominal confirmada', compliance: 94 },
      { name: 'Causa raiz técnica registrada na solução', compliance: 82 },
      { name: 'Evidência de teste ou validação anexada', compliance: 87 }
    ]
  }
};

export const MOCK_MEETING_AGREEMENTS: MeetingAgreement[] = [
  // Acordos da Reunião Anterior (Daily de 05/11/2026)
  {
    agreementId: 'AGR-2026-101',
    sourceArtifactId: 'art-daily-20261106',
    sourceMeetingType: 'DAILY',
    meetingReferenceDate: '05/11/2026',
    isPreviousMeeting: true,
    description: 'Expansão emergencial de tablespace do banco analítico em 100GB para evitar travamentos de relatórios',
    type: 'tarefa',
    responsibleId: 101,
    responsibleName: 'Mariana Costa',
    deadline: '05/11/2026 18:00',
    priority: 'ALTA',
    status: 'CONCLUIDO',
    destination: 'GLPI',
    relatedTicketId: 47990,
    evidenceRefs: ['Tablespace ampliado em 100GB no Oracle ASM', 'Job CDC sincronizado sem latência'],
    notes: 'Concluído no plantão vespertino com log anexado ao chamado #47990.',
    createdAt: '05/11/2026 07:35',
    confirmedAt: '05/11/2026 07:40',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '05/11/2026 17:10',
    history: [
      {
        id: 'h-101-1',
        timestamp: '05/11/2026 07:40',
        author: 'Henrique Vasconcelos',
        action: 'Acordo confirmado durante o Daily de 05/11',
        newStatus: 'CONFIRMADO'
      },
      {
        id: 'h-101-2',
        timestamp: '05/11/2026 17:10',
        author: 'Mariana Costa',
        action: 'Conclusão registrada com evidência técnica',
        previousStatus: 'EM_ANDAMENTO',
        newStatus: 'CONCLUIDO',
        notes: 'Espaço em disco validado e alarme de 85% normalizado.'
      }
    ]
  },
  {
    agreementId: 'AGR-2026-102',
    sourceArtifactId: 'art-daily-20261106',
    sourceMeetingType: 'DAILY',
    meetingReferenceDate: '05/11/2026',
    isPreviousMeeting: true,
    description: 'Substituição física de patch cable e transceiver SFP na UTI Adulto Leitos 09 a 14',
    type: 'tarefa',
    responsibleId: 102,
    responsibleName: 'Carlos Eduardo',
    deadline: '05/11/2026 16:00',
    priority: 'P1_CRITICA',
    status: 'CONCLUIDO',
    destination: 'GLPI',
    relatedTicketId: 48219,
    evidenceRefs: ['Troca realizada no rack R04 leitos UTI', 'Ping sem perda de pacotes na VLAN 104'],
    notes: 'Cabo ótico substituído. Telemetria ainda apresentou instabilidade residual no nó 12.',
    createdAt: '05/11/2026 07:38',
    confirmedAt: '05/11/2026 07:40',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '05/11/2026 15:45',
    history: [
      {
        id: 'h-102-1',
        timestamp: '05/11/2026 07:40',
        author: 'Henrique Vasconcelos',
        action: 'Acordo confirmado na reunião Daily',
        newStatus: 'CONFIRMADO'
      },
      {
        id: 'h-102-2',
        timestamp: '05/11/2026 15:45',
        author: 'Carlos Eduardo',
        action: 'Concluído e testado no rack',
        previousStatus: 'EM_ANDAMENTO',
        newStatus: 'CONCLUIDO'
      }
    ]
  },
  {
    agreementId: 'AGR-2026-103',
    sourceArtifactId: 'art-daily-20261106',
    sourceMeetingType: 'DAILY',
    meetingReferenceDate: '05/11/2026',
    isPreviousMeeting: true,
    description: 'Remanejar impressora térmica de pulseiras reserva da administração para a Triagem do PA',
    type: 'encaminhamento',
    responsibleId: 105,
    responsibleName: 'Lucas Mendes',
    deadline: '05/11/2026 14:00',
    priority: 'ALTA',
    status: 'EM_ANDAMENTO',
    destination: 'GESTAO_HEAL',
    relatedTicketId: 48098,
    evidenceRefs: ['Equipamento patrimônio HEAL-04412 localizado no almoxarifado'],
    notes: 'ATRASADO: Lucas precisou atender emergência no Bloco Cirúrgico; impressora ainda aguarda transporte.',
    createdAt: '05/11/2026 07:42',
    confirmedAt: '05/11/2026 07:45',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '05/11/2026 18:30',
    history: [
      {
        id: 'h-103-1',
        timestamp: '05/11/2026 07:45',
        author: 'Henrique Vasconcelos',
        action: 'Acordo confirmado',
        newStatus: 'CONFIRMADO'
      },
      {
        id: 'h-103-2',
        timestamp: '05/11/2026 18:30',
        author: 'Lucas Mendes',
        action: 'Prazo excedido devido a suporte prioritário no Centro Cirúrgico',
        newStatus: 'EM_ANDAMENTO',
        notes: 'Reprogramado para o turno matinal de hoje (06/11).'
      }
    ]
  },
  {
    agreementId: 'AGR-2026-104',
    sourceArtifactId: 'art-daily-20261106',
    sourceMeetingType: 'DAILY',
    meetingReferenceDate: '05/11/2026',
    isPreviousMeeting: true,
    description: 'Renegociar protocolo e SLA de retorno com fornecedor do storage PACS para laudos tomográficos',
    type: 'compromisso',
    responsibleId: 4801,
    responsibleName: 'Dr. Roberto Silveira (Grupo 48)',
    deadline: '06/11/2026 12:00',
    priority: 'MEDIA',
    status: 'EM_ANDAMENTO',
    destination: 'GLPI',
    relatedTicketId: 48204,
    notes: 'Reunião agendada com o gerente de contas do fabricante para as 11h de hoje.',
    createdAt: '05/11/2026 07:45',
    confirmedAt: '05/11/2026 07:50',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '06/11/2026 08:30',
    history: [
      {
        id: 'h-104-1',
        timestamp: '05/11/2026 07:50',
        author: 'Henrique Vasconcelos',
        action: 'Acordo confirmado',
        newStatus: 'CONFIRMADO'
      }
    ]
  },

  // Acordos da Reunião Atual (Daily de 06/11/2026)
  {
    agreementId: 'AGR-2026-105',
    sourceArtifactId: 'art-daily-20261106',
    sourceMeetingType: 'DAILY',
    meetingReferenceDate: '06/11/2026',
    isPreviousMeeting: false,
    description: 'Normalizar enlace e telemetria cardíaca leitos 12-14 na UTI Geral com validação presencial',
    type: 'tarefa',
    responsibleId: 103,
    responsibleName: 'Rafael Albuquerque',
    deadline: 'Hoje às 11:00',
    priority: 'P1_CRITICA',
    status: 'CONFIRMADO',
    destination: 'GLPI',
    relatedTicketId: 48219,
    evidenceRefs: ['Acompanhamento de telemetria na enfermagem central'],
    notes: 'Prioridade número 1 do plantão aprovada pela gestão.',
    createdAt: '06/11/2026 10:10',
    confirmedAt: '06/11/2026 10:12',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '06/11/2026 10:12',
    history: [
      {
        id: 'h-105-1',
        timestamp: '06/11/2026 10:12',
        author: 'Henrique Vasconcelos',
        action: 'Acordo registrado e confirmado durante a reunião',
        newStatus: 'CONFIRMADO'
      }
    ]
  },
  {
    agreementId: 'AGR-2026-106',
    sourceArtifactId: 'art-daily-20261106',
    sourceMeetingType: 'DAILY',
    meetingReferenceDate: '06/11/2026',
    isPreviousMeeting: false,
    description: 'Assunção nominal e teste do aprazamento medicamentoso da prescrição no Centro Obstétrico',
    type: 'encaminhamento',
    responsibleId: 101,
    responsibleName: 'Mariana Costa',
    deadline: 'Hoje às 09:30',
    priority: 'ALTA',
    status: 'CONFIRMADO',
    destination: 'GLPI',
    relatedTicketId: 48191,
    notes: 'Chamado sem técnico nominal regularizado em conformidade com POP-TIN-017.',
    createdAt: '06/11/2026 10:10',
    confirmedAt: '06/11/2026 10:12',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '06/11/2026 10:12',
    history: [
      {
        id: 'h-106-1',
        timestamp: '06/11/2026 10:12',
        author: 'Henrique Vasconcelos',
        action: 'Acordo confirmado na Daily',
        newStatus: 'CONFIRMADO'
      }
    ]
  },
  {
    agreementId: 'AGR-2026-107',
    sourceArtifactId: 'art-daily-20261106',
    sourceMeetingType: 'DAILY',
    meetingReferenceDate: '06/11/2026',
    isPreviousMeeting: false,
    description: 'Autorizar formalmente acionamento de suporte de garantia com fabricante do storage PACS (DEC-2026-88)',
    type: 'decisao',
    responsibleId: 1,
    responsibleName: 'Henrique Vasconcelos',
    deadline: 'Hoje às 12:00',
    priority: 'ALTA',
    status: 'CONFIRMADO',
    destination: 'GESTAO_HEAL',
    relatedTicketId: 48204,
    notes: 'Decisão gerencial autônoma registrada na ata da reunião.',
    createdAt: '06/11/2026 10:10',
    confirmedAt: '06/11/2026 10:12',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '06/11/2026 10:12',
    history: [
      {
        id: 'h-107-1',
        timestamp: '06/11/2026 10:12',
        author: 'Henrique Vasconcelos',
        action: 'Decisão homologada na reunião',
        newStatus: 'CONFIRMADO'
      }
    ]
  },

  // Acordos do Alinhamento Semanal (Semana 45 e Semana 44)
  {
    agreementId: 'AGR-2026-091',
    sourceArtifactId: 'art-weekly-2026w45',
    sourceMeetingType: 'ALINHAMENTO_SEMANAL',
    meetingReferenceDate: 'Semana 44/2026',
    isPreviousMeeting: true,
    description: 'Auditoria de aderência documental às 4 regras POP-TIN-017 em 100% dos chamados fechados',
    type: 'tarefa',
    responsibleId: 4802,
    responsibleName: 'Paula Nogueira',
    deadline: '03/11/2026 17:00',
    priority: 'MEDIA',
    status: 'CONCLUIDO',
    destination: 'GESTAO_HEAL',
    evidenceRefs: ['Relatório de aderência 88.5% publicado'],
    notes: 'Meta superada na Semana 44 com relatório auditável congelado.',
    createdAt: '28/10/2026 14:00',
    confirmedAt: '28/10/2026 14:10',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '03/11/2026 16:50',
    history: [
      {
        id: 'h-091-1',
        timestamp: '28/10/2026 14:10',
        author: 'Henrique Vasconcelos',
        action: 'Acordo confirmado no Alinhamento Semanal',
        newStatus: 'CONFIRMADO'
      },
      {
        id: 'h-091-2',
        timestamp: '03/11/2026 16:50',
        author: 'Paula Nogueira',
        action: 'Conclusão registrada com taxa de 88.5%',
        newStatus: 'CONCLUIDO'
      }
    ]
  },
  {
    agreementId: 'AGR-2026-092',
    sourceArtifactId: 'art-weekly-2026w45',
    sourceMeetingType: 'ALINHAMENTO_SEMANAL',
    meetingReferenceDate: 'Semana 44/2026',
    isPreviousMeeting: true,
    description: 'Elaborar plano de contingência para substituição de 5 switches de borda assistenciais obsoletos',
    type: 'tarefa',
    responsibleId: 102,
    responsibleName: 'Carlos Eduardo',
    deadline: '07/11/2026 18:00',
    priority: 'ALTA',
    status: 'EM_ANDAMENTO',
    destination: 'GESTAO_HEAL',
    notes: 'Levantamento físico de portas concluído. Orçamento em cotação com fornecedores.',
    createdAt: '28/10/2026 14:15',
    confirmedAt: '28/10/2026 14:20',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '04/11/2026 11:30',
    history: [
      {
        id: 'h-092-1',
        timestamp: '28/10/2026 14:20',
        author: 'Henrique Vasconcelos',
        action: 'Acordo confirmado no Alinhamento Semanal',
        newStatus: 'CONFIRMADO'
      }
    ]
  },
  {
    agreementId: 'AGR-2026-093',
    sourceArtifactId: 'art-weekly-2026w45',
    sourceMeetingType: 'ALINHAMENTO_SEMANAL',
    meetingReferenceDate: 'Semana 44/2026',
    isPreviousMeeting: true,
    description: 'Treinamento das novas enfermeiras no leitor beira-leito e contingência de impressão térmica',
    type: 'compromisso',
    responsibleId: 105,
    responsibleName: 'Lucas Mendes',
    deadline: '04/11/2026 15:00',
    priority: 'MEDIA',
    status: 'EM_ANDAMENTO',
    destination: 'GESTAO_HEAL',
    notes: 'ATRASADO: 2 turmas concluídas; 1 turma pendente de liberação de escala pela chefia de enfermagem.',
    createdAt: '28/10/2026 14:20',
    confirmedAt: '28/10/2026 14:25',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '05/11/2026 09:00',
    history: [
      {
        id: 'h-093-1',
        timestamp: '28/10/2026 14:25',
        author: 'Henrique Vasconcelos',
        action: 'Acordo confirmado no Alinhamento Semanal',
        newStatus: 'CONFIRMADO'
      },
      {
        id: 'h-093-2',
        timestamp: '05/11/2026 09:00',
        author: 'Lucas Mendes',
        action: 'Prazo estendido para 09/11',
        newStatus: 'EM_ANDAMENTO',
        notes: 'Aguardando confirmação de liberação de escala do Pronto Atendimento.'
      }
    ]
  },
  {
    agreementId: 'AGR-2026-094',
    sourceArtifactId: 'art-weekly-2026w45',
    sourceMeetingType: 'ALINHAMENTO_SEMANAL',
    meetingReferenceDate: 'Semana 45/2026',
    isPreviousMeeting: false,
    description: 'Reindexação e ajuste fino das tabelas de prescrição eletrônica do Tasy no domingo às 02h00',
    type: 'compromisso',
    responsibleId: 101,
    responsibleName: 'Mariana Costa',
    deadline: '08/11/2026 05:00',
    priority: 'ALTA',
    status: 'CONFIRMADO',
    destination: 'GESTAO_HEAL',
    notes: 'Janela de manutenção homologada com a diretoria médica.',
    createdAt: '06/11/2026 10:10',
    confirmedAt: '06/11/2026 10:12',
    confirmedBy: 'Henrique Vasconcelos',
    updatedAt: '06/11/2026 10:12',
    history: [
      {
        id: 'h-094-1',
        timestamp: '06/11/2026 10:12',
        author: 'Henrique Vasconcelos',
        action: 'Acordo confirmado no Alinhamento Semanal',
        newStatus: 'CONFIRMADO'
      }
    ]
  }
];

// ==========================================
// PARTE A: PLANOS DE EVOLUÇÃO INDIVIDUAL
// ==========================================

export const MOCK_DEVELOPMENT_COMMITMENTS: DevelopmentCommitment[] = [
  // 1. Lucas Mendes: Comunicação e Atendimento Humanizado (Origem: Semana 44, acompanhamento na Semana 45)
  {
    id: 'DEV-2026-01',
    sourceMeetingType: 'ALINHAMENTO_SEMANAL',
    meetingReferenceDate: 'Semana 44/2026',
    isPreviousAlignment: true,
    collaboratorId: 105,
    collaboratorName: 'Lucas Mendes',
    collaboratorRole: 'Analista de Suporte Presencial N1/N2',
    registeredAt: '28/10/2026 14:40',
    developmentArea: 'Comunicação e Atendimento Humanizado',
    observedSituation: 'Durante o plantão de triagem no Pronto Atendimento, foram identificados registros nos chamados com termos ásperos ("usuário não soube usar o leitor e travou a fila"), gerando queixa formal de postura da supervisão assistencial.',
    evidencesObserved: [
      'Chamado #48098 (Nota de acompanhamento registrada às 14:22 de 27/10)',
      'Relato da Supervisora de Enfermagem do PA encaminhado à Gestão de TI em 28/10'
    ],
    operationalImpact: 'Ruído de relacionamento entre enfermagem e suporte de campo, elevando atrito na abertura de chamados críticos de risco assistencial.',
    agreedGoal: 'Adotar comunicação empática e acolhedora em 100% dos atendimentos presenciais e notas públicas no GLPI, com zero incidentes de atrito no ciclo de 30 dias.',
    collaboratorProposedCommitment: 'Compreendo o impacto no atendimento ao paciente. Comprometo-me a revisar todas as respostas antes de postar, manter saudação cordial e pedir auxílio ao Rafael sempre que identificar estresse na área.',
    practicalActions: [
      {
        id: 'act-01-1',
        description: 'Concluir treinamento interno de Comunicação Não-Violenta e Empatia em Saúde (Plataforma HEAL Ensino)',
        deadline: '05/11/2026',
        completed: true,
        completedAt: '04/11/2026 16:30',
        evidenceRef: 'Certificado anexado no portal RH'
      },
      {
        id: 'act-01-2',
        description: 'Adotar roteiro padronizado de saudação e explicação técnica amigável no atendimento presencial',
        deadline: '12/11/2026',
        completed: false
      },
      {
        id: 'act-01-3',
        description: 'Alinhamento quinzenal de escuta com o mentor Rafael Albuquerque',
        deadline: '18/11/2026',
        completed: false
      }
    ],
    mentorOrManagerId: 1,
    mentorOrManagerName: 'Henrique Vasconcelos',
    startDate: '28/10/2026',
    deadlineOrNextReview: '12/11/2026 (Próximo Alinhamento Semanal)',
    successCriteria: 'Zero queixas de postura pela enfermagem e elogio espontâneo registrado no fechamento dos chamados.',
    collaboratorNotes: 'Treinamento concluído. Já notei melhor receptividade da equipe do PA ao iniciar o atendimento cumprimentando nominalmente.',
    collaboratorSignedScience: true,
    collaboratorSignedScienceAt: '28/10/2026 16:00',
    managerNotes: 'Evolução notória na última semana. Lucas demonstrou maturidade profissional ao reconhecer a oportunidade de melhoria.',
    status: 'EM_ANDAMENTO',
    history: [
      {
        id: 'h-dev01-1',
        timestamp: '28/10/2026 14:40',
        author: 'Henrique Vasconcelos',
        action: 'Compromisso de melhoria registrado após alinhamento presencial',
        newValue: 'AGUARDANDO_CIENCIA'
      },
      {
        id: 'h-dev01-2',
        timestamp: '28/10/2026 16:00',
        author: 'Lucas Mendes',
        action: 'Colaborador assinou ciência formal no Portal',
        previousValue: 'AGUARDANDO_CIENCIA',
        newValue: 'EM_ANDAMENTO',
        justification: 'Ciência e aceite integral das ações pactuadas.'
      },
      {
        id: 'h-dev01-3',
        timestamp: '04/11/2026 16:30',
        author: 'Lucas Mendes',
        action: 'Ação 1 concluída com evidência',
        justification: 'Certificado de Comunicação Não-Violenta concluído.'
      }
    ]
  },

  // 2. Mariana Costa: Gestão de Prazos e Follow-ups no Turno Vespertino (Semana 44)
  {
    id: 'DEV-2026-02',
    sourceMeetingType: 'ALINHAMENTO_SEMANAL',
    meetingReferenceDate: 'Semana 44/2026',
    isPreviousAlignment: true,
    collaboratorId: 101,
    collaboratorName: 'Mariana Costa',
    collaboratorRole: 'Analista Sênior de Sistemas Clínicos (Tasy)',
    registeredAt: '29/10/2026 10:15',
    developmentArea: 'Gestão de Prazos e Follow-ups Tempestivos',
    observedSituation: 'Chamados em andamento de alta complexidade do Tasy foram mantidos sem apontamento no GLPI durante a tarde, disparando falso alerta de estagnação na auditoria noturna das 04h.',
    evidencesObserved: [
      'Chamado #48191 (Prescrição Centro Obstétrico - 22h sem apontamento humano)',
      'Relatório de Auditoria Noturna SNAPSHOT_04H de 29/10/2026'
    ],
    operationalImpact: 'Distorção nos indicadores de auditoria de conformidade POP-TIN-017 e sobrecarga na conferência matinal do gestor.',
    agreedGoal: 'Registrar apontamento humano intermediário em todos os chamados ativos antes das 17h00.',
    collaboratorProposedCommitment: 'Criar rotina pessoal às 16h45 para checar o painel e documentar o status atual das demandas.',
    practicalActions: [
      {
        id: 'act-02-1',
        description: 'Configurar alarme recorrente de fechamento de turno às 16h45 no Google Calendar',
        deadline: '30/10/2026',
        completed: true,
        completedAt: '30/10/2026 09:00',
        evidenceRef: 'Configuração validada'
      },
      {
        id: 'act-02-2',
        description: 'Manter zero chamados sem evolução >24h durante 10 dias úteis consecutivos',
        deadline: '10/11/2026',
        completed: false
      }
    ],
    mentorOrManagerId: 1,
    mentorOrManagerName: 'Henrique Vasconcelos',
    startDate: '29/10/2026',
    deadlineOrNextReview: '10/11/2026',
    successCriteria: 'Zero falsos positivos de estagnação no snapshot das 04h atribuídos à analista.',
    collaboratorNotes: 'Rotina implantada. Apenas 1 chamado na sexta-feira ficou no limite devido a reunião com a diretoria médica.',
    collaboratorSignedScience: true,
    collaboratorSignedScienceAt: '29/10/2026 11:00',
    managerNotes: 'Mariana é altamente resolutiva; o ajuste de horário de apontamento já trouxe grande ganho nos relatórios noturnos.',
    status: 'EM_ANDAMENTO',
    history: [
      {
        id: 'h-dev02-1',
        timestamp: '29/10/2026 10:15',
        author: 'Henrique Vasconcelos',
        action: 'Compromisso registrado',
        newValue: 'AGUARDANDO_CIENCIA'
      },
      {
        id: 'h-dev02-2',
        timestamp: '29/10/2026 11:00',
        author: 'Mariana Costa',
        action: 'Ciência confirmada',
        previousValue: 'AGUARDANDO_CIENCIA',
        newValue: 'EM_ANDAMENTO'
      }
    ]
  },

  // 3. Carlos Eduardo: Homologação e Testes Formais com Evidência Anexa (Semana 45 - AGUARDANDO_VALIDACAO)
  {
    id: 'DEV-2026-03',
    sourceMeetingType: 'ALINHAMENTO_SEMANAL',
    meetingReferenceDate: 'Semana 45/2026',
    isPreviousAlignment: false,
    collaboratorId: 102,
    collaboratorName: 'Carlos Eduardo Ramos',
    collaboratorRole: 'Especialista em Redes & Infraestrutura Crítica',
    registeredAt: '03/11/2026 15:30',
    developmentArea: 'Qualidade Documental POP-TIN-017 e Evidências Técnicas',
    observedSituation: 'Intervenções em patch cables e racks de switches concluídas com status de solucionado, porém sem anexo de teste de ping contínuo ou print de porta de fibra no GLPI.',
    evidencesObserved: [
      'Chamado #48219 (Telemetria UTI - sem print de console de portas anexado)',
      'POP-TIN-017 Subitem 6.3 (Solução com Evidência Técnica Auditável)'
    ],
    operationalImpact: 'Impossibilidade de auditar preventivamente a integridade dos uplinks sem nova visita presencial.',
    agreedGoal: 'Anexar evidência técnica auditável (log/print de porta/teste de banda) em 100% dos chamados de infraestrutura concluídos.',
    collaboratorProposedCommitment: 'Padronizar a captura de prints do console dos switches e medições de atenuação ótica diretamente pelo app corporativo.',
    practicalActions: [
      {
        id: 'act-03-1',
        description: 'Criar template de evidência rápida para intervenções de infraestrutura física',
        deadline: '05/11/2026',
        completed: true,
        completedAt: '05/11/2026 14:00',
        evidenceRef: 'Template compartilhado na pasta da equipe'
      },
      {
        id: 'act-03-2',
        description: 'Submeter 5 chamados consecutivos com evidência anexada e homologada',
        deadline: '07/11/2026',
        completed: true,
        completedAt: '06/11/2026 09:30',
        evidenceRef: 'Chamados #48219, #47952, #47880, #47810, #47790'
      }
    ],
    mentorOrManagerId: 1,
    mentorOrManagerName: 'Henrique Vasconcelos',
    startDate: '03/11/2026',
    deadlineOrNextReview: '07/11/2026',
    successCriteria: '100% de conformidade com Subitem 6.3 do POP-TIN-017 nos chamados finalizados.',
    collaboratorNotes: 'Todas as ações foram concluídas e os 5 chamados anexados com comprovação de console. Solicito validação pelo gestor.',
    collaboratorSignedScience: true,
    collaboratorSignedScienceAt: '03/11/2026 16:00',
    managerNotes: 'Aguardando revisão formal no final do turno de hoje para homologação.',
    status: 'AGUARDANDO_VALIDACAO',
    history: [
      {
        id: 'h-dev03-1',
        timestamp: '03/11/2026 15:30',
        author: 'Henrique Vasconcelos',
        action: 'Compromisso registrado',
        newValue: 'AGUARDANDO_CIENCIA'
      },
      {
        id: 'h-dev03-2',
        timestamp: '03/11/2026 16:00',
        author: 'Carlos Eduardo Ramos',
        action: 'Ciência formal realizada',
        newValue: 'EM_ANDAMENTO'
      },
      {
        id: 'h-dev03-3',
        timestamp: '06/11/2026 09:45',
        author: 'Carlos Eduardo Ramos',
        action: 'Solicitada validação de resultado ao gestor',
        previousValue: 'EM_ANDAMENTO',
        newValue: 'AGUARDANDO_VALIDACAO',
        justification: 'Todos os 5 chamados com evidências anexadas e testadas com sucesso.'
      }
    ]
  }
];

// ==========================================
// PARTE B: GESTÃO COMPLETA DE PROJETOS (TPL-04)
// ==========================================

export const MOCK_MANAGED_PROJECTS: ManagedProject[] = [
  {
    id: 'prj-pacs-01',
    code: 'PRJ-PACS-01',
    name: 'Expansão do Storage PACS & Laudos CDI',
    sponsor: 'Diretoria de Tecnologia & Diretoria Médica',
    manager: 'Henrique Vasconcelos',
    targetDate: '25/11/2026',
    generalValidatedProgress: 68,
    completedMilestonesCount: 5,
    totalMilestonesCount: 8,
    pendingDeliverablesCount: 3,
    overdueTasksCount: 1,
    criticalBlocksCount: 1,
    nextMilestone: {
      title: 'Homologação do Cache SSD Tomografia',
      date: '12/11/2026',
      daysRemaining: 6
    },
    phases: [
      {
        id: 'ph-01',
        order: 1,
        code: 'FASE_1',
        title: 'Fase 1: Diagnóstico de Volumetria & Dimensionamento',
        objective: 'Mapear taxa de crescimento de laudos DICOM e volumetria dos exames de ressonância e tomografia.',
        startDate: '01/09/2026',
        endDate: '20/09/2026',
        status: 'CONCLUIDA',
        progressPercentage: 100,
        deliverables: [
          {
            id: 'ent-01-1',
            code: 'ENT-01',
            phaseId: 'ph-01',
            title: 'Relatório de Volumetria Histórica DICOM (36 meses)',
            description: 'Levantamento estatístico de exames armazenados e projeção para 5 anos.',
            targetDate: '10/09/2026',
            completedDate: '09/09/2026',
            status: 'HOMOLOGADA',
            progressPercentage: 100,
            validatedBy: 'Henrique Vasconcelos',
            validatedAt: '10/09/2026 15:00',
            evidenceRefs: ['DOC-VOL-PACS-v1.2.pdf']
          },
          {
            id: 'ent-01-2',
            code: 'ENT-02',
            phaseId: 'ph-01',
            title: 'Dimensionamento de IOPS e Storage Primário/Secundário',
            description: 'Especificação técnica para armazenamento tiered com ZFS NVMe + SAS.',
            targetDate: '20/09/2026',
            completedDate: '18/09/2026',
            status: 'HOMOLOGADA',
            progressPercentage: 100,
            validatedBy: 'Henrique Vasconcelos',
            validatedAt: '20/09/2026 11:00'
          }
        ],
        milestones: [
          {
            id: 'm-01',
            phaseId: 'ph-01',
            title: 'M1: Aprovação da Arquitetura Técnica no Comitê',
            targetDate: '20/09/2026',
            actualDate: '19/09/2026',
            isCriticalPath: true,
            status: 'CONCLUIDO',
            description: 'Arquitetura validada sem ressalvas pelo corpo clínico de radiologia.'
          }
        ]
      },
      {
        id: 'ph-02',
        order: 2,
        code: 'FASE_2',
        title: 'Fase 2: Aquisição & Provisionamento Físico no Data Center',
        objective: 'Instalar racks, fontes redundantes, switches SAN Fibre Channel e novos nós de storage.',
        startDate: '21/09/2026',
        endDate: '15/10/2026',
        status: 'CONCLUIDA',
        progressPercentage: 100,
        deliverables: [
          {
            id: 'ent-02-1',
            code: 'ENT-03',
            phaseId: 'ph-02',
            title: 'Instalação Física e Cabeamento Estruturado no Rack R04',
            description: 'Instalação física com alimentação no-break A+B e cabeamento OM4.',
            targetDate: '05/10/2026',
            completedDate: '04/10/2026',
            status: 'HOMOLOGADA',
            progressPercentage: 100,
            validatedBy: 'Carlos Eduardo Ramos',
            validatedAt: '05/10/2026 17:00'
          },
          {
            id: 'ent-02-2',
            code: 'ENT-04',
            phaseId: 'ph-02',
            title: 'Configuração dos Switches SAN Fibre Channel 32Gbps',
            description: 'Zonemanager configurado com isolamento de nós e multi-pathing.',
            targetDate: '15/10/2026',
            completedDate: '14/10/2026',
            status: 'HOMOLOGADA',
            progressPercentage: 100,
            validatedBy: 'Henrique Vasconcelos',
            validatedAt: '15/10/2026 16:30'
          }
        ],
        milestones: [
          {
            id: 'm-02',
            phaseId: 'ph-02',
            title: 'M2: Energização e Certificação Térmica do Rack',
            targetDate: '08/10/2026',
            actualDate: '07/10/2026',
            isCriticalPath: false,
            status: 'CONCLUIDO',
            description: 'Testes de carga elétrica e dissipação térmica aprovados.'
          },
          {
            id: 'm-03',
            phaseId: 'ph-02',
            title: 'M3: Enlace SAN 32Gbps Estabelecido',
            targetDate: '15/10/2026',
            actualDate: '14/10/2026',
            isCriticalPath: true,
            status: 'CONCLUIDO',
            description: 'Enlace primário e secundário de fibra ativos sem descartes de frames.'
          }
        ]
      },
      {
        id: 'ph-03',
        order: 3,
        code: 'FASE_3',
        title: 'Fase 3: Migração de Volumes & Pool ZFS',
        objective: 'Criar volumes zpool com proteção RAID-Z2 e transferir acervo histórico de 18TB.',
        startDate: '16/10/2026',
        endDate: '08/11/2026',
        status: 'EM_ANDAMENTO',
        progressPercentage: 75,
        deliverables: [
          {
            id: 'ent-03-1',
            code: 'ENT-05',
            phaseId: 'ph-03',
            title: 'Criação do Zpool com Tiering NVMe L2ARC',
            description: 'Pool de 120TB bruto com cache de leitura e escrita síncrona SLOG.',
            targetDate: '25/10/2026',
            completedDate: '24/10/2026',
            status: 'HOMOLOGADA',
            progressPercentage: 100,
            validatedBy: 'Fernanda Lima',
            validatedAt: '25/10/2026 11:00'
          },
          {
            id: 'ent-03-2',
            code: 'ENT-06',
            phaseId: 'ph-03',
            title: 'Migração do Acervo Histórico (18TB)',
            description: 'Transferência de imagens anteriores a 2025 para novo pool secundário.',
            targetDate: '05/11/2026',
            status: 'EM_ANDAMENTO',
            progressPercentage: 88,
            evidenceRefs: ['Job ZFS Send/Receive ativo - 15.8TB / 18.0TB transferidos']
          }
        ],
        milestones: [
          {
            id: 'm-04',
            phaseId: 'ph-03',
            title: 'M4: Migração de Volumes Históricos Concluída',
            targetDate: '05/11/2026',
            actualDate: '06/11/2026',
            isCriticalPath: true,
            status: 'CONCLUIDO',
            description: 'Finalização do sincronismo diferencial com checksum SHA-256 verificado.'
          },
          {
            id: 'm-05',
            phaseId: 'ph-03',
            title: 'M5: Homologação do Cache SSD Tomografia',
            targetDate: '12/11/2026',
            isCriticalPath: true,
            status: 'EM_ANDAMENTO',
            description: 'Validação de abertura de tomografia computadorizada multislice em <1.5s.'
          }
        ]
      },
      {
        id: 'ph-04',
        order: 4,
        code: 'FASE_4',
        title: 'Fase 4: Teste de Carga & Homologação com Corpo Clínico',
        objective: 'Submeter o cluster a 50 laudos radiológicos simultâneos no CDI com validação dos radiologistas.',
        startDate: '09/11/2026',
        endDate: '18/11/2026',
        status: 'EM_ANDAMENTO',
        progressPercentage: 20,
        deliverables: [
          {
            id: 'ent-04-1',
            code: 'ENT-07',
            phaseId: 'ph-04',
            title: 'Teste de Estresse com 50 Estações Médicas Simultâneas',
            description: 'Simulação automatizada de busca e streaming DICOM na rede hospitalar.',
            targetDate: '14/11/2026',
            status: 'PLANEJADA',
            progressPercentage: 0
          },
          {
            id: 'ent-04-2',
            code: 'ENT-08',
            phaseId: 'ph-04',
            title: 'Ata de Homologação Assinada pelo Coordenador do CDI',
            description: 'Termo de aceite do corpo médico atestando ausência de latência.',
            targetDate: '18/11/2026',
            status: 'PLANEJADA',
            progressPercentage: 0
          }
        ],
        milestones: [
          {
            id: 'm-06',
            phaseId: 'ph-04',
            title: 'M6: Teste de Carga Aprovado com Latência < 1.5s',
            targetDate: '15/11/2026',
            isCriticalPath: true,
            status: 'PENDENTE',
            description: 'Critério eliminatório de desempenho assistencial.'
          }
        ]
      },
      {
        id: 'ph-05',
        order: 5,
        code: 'FASE_5',
        title: 'Fase 5: Go-Live Definitivo & Operação Assistida',
        objective: 'Virada final do tráfego do CDI para o novo storage e suporte assistido por 7 dias.',
        startDate: '19/11/2026',
        endDate: '25/11/2026',
        status: 'NAO_INICIADA',
        progressPercentage: 0,
        deliverables: [
          {
            id: 'ent-05-1',
            code: 'ENT-09',
            phaseId: 'ph-05',
            title: 'Virada de Produção (Cutover Noturno)',
            description: 'Janela de manutenção homologada para chaveamento de DNS e montagens NFS.',
            targetDate: '22/11/2026',
            status: 'PLANEJADA',
            progressPercentage: 0
          },
          {
            id: 'ent-05-2',
            code: 'ENT-10',
            phaseId: 'ph-05',
            title: 'Dossiê As-Built e Encerramento do Projeto',
            description: 'Documentação final entregue ao Grupo 48 e DTI.',
            targetDate: '25/11/2026',
            status: 'PLANEJADA',
            progressPercentage: 0
          }
        ],
        milestones: [
          {
            id: 'm-07',
            phaseId: 'ph-05',
            title: 'M7: Go-Live sem Interrupção Assistencial',
            targetDate: '22/11/2026',
            isCriticalPath: true,
            status: 'PENDENTE',
            description: 'Operação 100% no novo ambiente.'
          },
          {
            id: 'm-08',
            phaseId: 'ph-05',
            title: 'M8: Aceite Final da Diretoria Médica',
            targetDate: '25/11/2026',
            isCriticalPath: false,
            status: 'PENDENTE',
            description: 'Encerramento formal do projeto com termo de garantia.'
          }
        ]
      }
    ],
    tasks: [
      {
        id: 'tsk-01',
        code: 'TSK-01',
        phaseId: 'ph-03',
        deliverableId: 'ent-03-2',
        title: 'Verificação do Checksum do Bloco 14 do Acervo DICOM',
        description: 'Auditoria de integridade dos hashes MD5/SHA-256 das imagens migradas.',
        responsibleId: 104,
        responsibleName: 'Fernanda Lima',
        role: 'DBA & Especialista em PACS',
        startDate: '04/11/2026',
        dueDate: '06/11/2026',
        priority: 'ALTA',
        status: 'CONCLUIDO',
        progressPercentage: 100,
        subtasks: [
          { id: 'sub-01-1', title: 'Script de hash executado no pool antigo', completed: true, completedAt: '05/11/2026' },
          { id: 'sub-01-2', title: 'Script de hash executado no novo storage', completed: true, completedAt: '06/11/2026' },
          { id: 'sub-01-3', title: 'Comparação de integridade (zero divergências)', completed: true, completedAt: '06/11/2026' }
        ],
        evidenceNote: 'Relatório de integridade 100% aderente sem perda de quadros radiológicos.',
        lastUpdated: '06/11/2026 09:30'
      },
      {
        id: 'tsk-02',
        code: 'TSK-02',
        phaseId: 'ph-03',
        deliverableId: 'ent-03-2',
        title: 'Configurar Cache SSD L2ARC para Séries de Ressonância Magnética',
        description: 'Ajustar parâmetros vfs.zfs.arc_max e vfs.zfs.l2arc_write_max para priorizar exames de alto contraste.',
        responsibleId: 102,
        responsibleName: 'Carlos Eduardo Ramos',
        role: 'Infraestrutura',
        startDate: '05/11/2026',
        dueDate: '07/11/2026',
        priority: 'CRITICA',
        status: 'EM_ANDAMENTO',
        progressPercentage: 70,
        subtasks: [
          { id: 'sub-02-1', title: 'Dimensionar memória para L2ARC', completed: true, completedAt: '05/11/2026' },
          { id: 'sub-02-2', title: 'Aplicar parâmetros no sysctl.conf', completed: true, completedAt: '06/11/2026' },
          { id: 'sub-02-3', title: 'Validar warm-up com 500GB de imagens', completed: false }
        ],
        lastUpdated: '06/11/2026 10:00'
      },
      {
        id: 'tsk-03',
        code: 'TSK-03',
        phaseId: 'ph-03',
        deliverableId: 'ent-03-2',
        title: 'Liberação de Janela Noturna de Parada no Comitê Cirúrgico',
        description: 'Obter autorização formal do comitê de bloco cirúrgico para a janela técnica de domingo das 01h às 05h.',
        responsibleId: 4801,
        responsibleName: 'Dr. Roberto Silveira (Grupo 48)',
        role: 'Coordenação Executiva',
        startDate: '02/11/2026',
        dueDate: '05/11/2026',
        priority: 'CRITICA',
        status: 'BLOQUEADO',
        progressPercentage: 40,
        blockReason: 'Comitê solicitou plano de contingência caso ocorra transplante hepático de emergência durante a janela.',
        unblockAction: 'Apresentar documento de failover imediato para storage antigo em menos de 3 minutos.',
        subtasks: [
          { id: 'sub-03-1', title: 'Enviar solicitação com impacto previsto', completed: true, completedAt: '02/11/2026' },
          { id: 'sub-03-2', title: 'Anexar plano de failover imediato', completed: false },
          { id: 'sub-03-3', title: 'Assinatura formal da Diretoria Médica', completed: false }
        ],
        lastUpdated: '06/11/2026 08:30'
      },
      {
        id: 'tsk-04',
        code: 'TSK-04',
        phaseId: 'ph-04',
        deliverableId: 'ent-04-1',
        title: 'Preparar Roteiro de Teste de Estresse do Visualizador PACS',
        description: 'Script para abrir simultaneamente 50 exames de tomografia nos visualizadores das salas de laudo.',
        responsibleId: 101,
        responsibleName: 'Mariana Costa',
        role: 'Sistemas Clínicos',
        startDate: '04/11/2026',
        dueDate: '05/11/2026',
        priority: 'ALTA',
        status: 'EM_ANDAMENTO',
        progressPercentage: 60,
        subtasks: [
          { id: 'sub-04-1', title: 'Mapear as 12 salas de laudo do CDI', completed: true, completedAt: '04/11/2026' },
          { id: 'sub-04-2', title: 'Elaborar matriz de casos de teste', completed: true, completedAt: '05/11/2026' },
          { id: 'sub-04-3', title: 'Validar permissões de acesso com radiologistas', completed: false }
        ],
        lastUpdated: '06/11/2026 09:15'
      },
      {
        id: 'tsk-05',
        code: 'TSK-05',
        phaseId: 'ph-04',
        deliverableId: 'ent-04-1',
        title: 'Substituição das Placas de Rede 10GbE nas Workstations de Laudo',
        description: 'Instalar adaptadores PCIe 10G SFP+ em 4 estações de diagnóstico do CDI para eliminar gargalo local.',
        responsibleId: 103,
        responsibleName: 'Rafael Albuquerque',
        role: 'Suporte Presencial',
        startDate: '01/11/2026',
        dueDate: '04/11/2026',
        priority: 'MEDIA',
        status: 'EM_ANDAMENTO',
        progressPercentage: 50,
        subtasks: [
          { id: 'sub-05-1', title: 'Substituição nas estações 01 e 02', completed: true, completedAt: '03/11/2026' },
          { id: 'sub-05-2', title: 'Substituição nas estações 03 e 04', completed: false }
        ],
        lastUpdated: '05/11/2026 17:00'
      }
    ],
    risks: [
      {
        id: 'rsk-01',
        title: 'Sobrecarga de banda na VLAN assistencial durante a sincronização inicial',
        category: 'TECNICO',
        probability: 'MEDIA',
        impact: 'ALTO',
        mitigationAction: 'Limitar tráfego de replicação via QoS a no máximo 2.5 Gbps entre 07h e 20h.',
        owner: 'Carlos Eduardo Ramos',
        status: 'ATIVO'
      },
      {
        id: 'rsk-02',
        title: 'Atraso na liberação da janela de manutenção pelo Comitê Cirúrgico',
        category: 'OPERACIONAL',
        probability: 'ALTA',
        impact: 'CRITICO',
        mitigationAction: 'Apresentação presencial do protocolo de reversão em 3 minutos para a coordenação do Centro Cirúrgico.',
        owner: 'Dr. Roberto Silveira',
        status: 'ATIVO'
      },
      {
        id: 'rsk-03',
        title: 'Incompatibilidade de driver Fibre Channel no kernel antigo do servidor de contingência',
        category: 'INFRAESTRUTURA',
        probability: 'BAIXA',
        impact: 'MEDIO',
        mitigationAction: 'Atualização do HBA firmware realizada em laboratório com sucesso.',
        owner: 'Fernanda Lima',
        status: 'MITIGADO'
      }
    ],
    decisions: [
      {
        id: 'dec-pacs-01',
        title: 'Adoção de RAID-Z2 em vez de espelhamento tradicional RAID-10',
        committee: 'Comitê de Arquitetura de TI',
        date: '18/09/2026',
        decision: 'Manter RAID-Z2 com 2 discos de paridade por vdev, priorizando tolerância a dupla falha e aproveitamento de 75% da capacidade útil.',
        rationale: 'Análise de custo-benefício demonstrou ganho de 32TB úteis com segurança adequada para acervo DICOM.',
        participants: ['Henrique Vasconcelos', 'Carlos Eduardo Ramos', 'Fernanda Lima']
      },
      {
        id: 'dec-pacs-02',
        title: 'Horário da janela de virada fixado exclusivamente para o domingo às 01h00',
        committee: 'Comitê de Segurança do Paciente & DTI',
        date: '28/10/2026',
        decision: 'Apenas a madrugada de domingo apresenta o menor índice histórico de exames de politrauma e urgência.',
        rationale: 'Reduz em 90% a probabilidade de impacto em laudos vitais.',
        participants: ['Henrique Vasconcelos', 'Dr. Roberto Silveira', 'Coordenação Médica CDI']
      }
    ],
    changeLogs: [
      {
        id: 'chg-01',
        date: '24/10/2026',
        author: 'Henrique Vasconcelos',
        type: 'CRONOGRAMA',
        description: 'Extensão do prazo da migração de volumes em 3 dias',
        baselineBefore: 'Término previsto: 05/11/2026',
        baselineAfter: 'Término previsto: 08/11/2026',
        justification: 'Necessidade de preservar 100% da banda durante a semana de auditoria externa do hospital.',
        approvedBy: 'Dr. Roberto Silveira'
      },
      {
        id: 'chg-02',
        date: '30/10/2026',
        author: 'Carlos Eduardo Ramos',
        type: 'ESCOPO',
        description: 'Inclusão de 4 placas de rede 10G adicionais para as estações de ressonância 3T',
        baselineBefore: 'Apenas estações de tomografia contempladas com 10G',
        baselineAfter: 'Estações de tomografia e ressonância contempladas',
        justification: 'Exames de ressonância geram arquivos de 4GB que demoravam 35 segundos para renderizar no Gigabit comum.',
        approvedBy: 'Henrique Vasconcelos'
      }
    ]
  }
];

export const getDevelopmentPlanSummary = (commitments: DevelopmentCommitment[]): DevelopmentPlanSummary => {
  const activePlans = new Set(commitments.filter(c => c.status !== 'CANCELADO' && c.status !== 'CUMPRIDO').map(c => c.collaboratorId)).size;
  const completedCommitments = commitments.filter(c => c.status === 'CUMPRIDO').length;
  const monitoringCommitments = commitments.filter(c => c.status === 'EM_ANDAMENTO').length;
  const overdueCommitments = commitments.filter(c => c.status === 'NAO_CUMPRIDO' || (c.status === 'EM_ANDAMENTO' && c.isPreviousAlignment)).length;
  const awaitingValidation = commitments.filter(c => c.status === 'AGUARDANDO_VALIDACAO').length;

  return {
    activePlans,
    completedCommitments,
    monitoringCommitments,
    overdueCommitments,
    awaitingValidation
  };
};

// ==========================================
// TPL-03: FEEDBACK E ALINHAMENTOS FORMAIS
// ==========================================

export const MOCK_FORMAL_ALIGNMENTS: FormalAlignment[] = [
  // 1. Alinhamento Coletivo: Passagem de Plantão e Escala do Fim de Semana (3 Participantes)
  {
    id: 'aln-2026-088',
    alignmentNumber: 'ALN-2026-088',
    dateTime: '06/11/2026 11:30',
    location: 'Sala de Operações DTI / Presencial e Sala Segura',
    managerId: 1,
    managerName: 'Henrique Vasconcelos',
    managerRole: 'Gestor Operacional de TI',
    periodicity: 'ESPORADICO',
    scope: 'COLETIVO',
    category: 'PASSAGEM_PLATAOR_ESCALA',
    subject: 'Passagem de Plantão e Escala de Cobertura de TI no Fim de Semana',
    objective: 'Organizar transição de plantão presencial e de sobreaviso para a janela crítica de reindexação do Tasy e cobertura da UTI Adulto.',
    context: 'Reunião de alinhamento com a equipe de campo e sistemas antes da janela de manutenção programada das 02h de domingo.',
    topicsDiscussed: [
      'Alinhamento do rádio comunicador HT e telefone de emergência da TI',
      'Janela de manutenção do Tasy (domingo 02h às 05h) e suporte presencial no Bloco Cirúrgico',
      'Ronda preventiva nos leitos de UTI para verificação de transceivers de rede e impressoras de pulseiras'
    ],
    observedFactsOrSituations: 'No último fim de semana houve descontinuidade de comunicação entre a equipe de plantão e a supervisão assistencial durante a substituição de cabeamento na UTI.',
    transmittedOrientations: 'O técnico de plantão presencial deve realizar ronda preventiva a cada 4 horas nas áreas de risco vital (UTI e Pronto Atendimento) e manter o chamado de passagem registrado antes do encerramento do turno.',
    participants: [
      {
        id: 'p-1',
        collaboratorId: 105,
        name: 'Lucas Mendes',
        role: 'Analista de Suporte Presencial N1/N2',
        department: 'Suporte Assistencial & Periféricos',
        alignmentRole: 'PARTICIPANTE',
        presence: 'PRESENTE',
        individualStatement: 'Confirmo o recebimento do rádio HT e farei as rondas preventivas nos horários acordados (14h, 18h e 22h).',
        scienceStatus: 'CIENTE',
        scienceDate: '06/11/2026 12:00',
        signatureStatus: 'ASSINADO_DIGITAL',
        signatureDate: '06/11/2026 12:05'
      },
      {
        id: 'p-2',
        collaboratorId: 104,
        name: 'Rafael Albuquerque',
        role: 'Analista de Redes e Infraestrutura N2',
        department: 'Infraestrutura & Redes Críticas',
        alignmentRole: 'RELATOR',
        presence: 'PRESENTE',
        individualStatement: 'Vou monitorar os switches de borda da UTI e deixei cabos e transceivers sobressalentes identificados na gaveta A2 do datacenter.',
        scienceStatus: 'CIENTE',
        scienceDate: '06/11/2026 12:02',
        signatureStatus: 'ASSINADO_DIGITAL',
        signatureDate: '06/11/2026 12:08'
      },
      {
        id: 'p-3',
        collaboratorId: 101,
        name: 'Mariana Costa',
        role: 'Analista Sênior de Sistemas Clínicos (Tasy)',
        department: 'Sistemas Hospitalares (Tasy/PACS)',
        alignmentRole: 'PARTICIPANTE',
        presence: 'PRESENTE',
        individualStatement: 'Ficarei em sobreaviso remoto na janela das 02h às 05h de domingo e configurei alertas automáticos de locks no banco.',
        scienceStatus: 'PENDENTE_CIENCIA',
        signatureStatus: 'PENDENTE'
      }
    ],
    generalCommitments: [
      {
        id: 'gc-01',
        description: 'Checklist físico de passagem assinado conjuntamente entre o plantonista que entra e o que sai',
        responsibleName: 'Equipe de Plantão',
        isCollective: true,
        deadline: '06/11/2026 19:00',
        successCriteria: 'Checklist anexado no GLPI no chamado de turno.',
        status: 'EM_ANDAMENTO'
      },
      {
        id: 'gc-02',
        description: 'Testes de comunicação via rádio HT a cada troca de período',
        responsibleName: 'Lucas Mendes e Rafael Albuquerque',
        isCollective: true,
        deadline: '08/11/2026 22:00',
        successCriteria: '100% dos testes com resposta imediata registrada.',
        status: 'EM_ANDAMENTO'
      }
    ],
    individualCommitments: [
      {
        participantId: 'p-1',
        participantName: 'Lucas Mendes',
        commitment: {
          id: 'ic-01',
          description: 'Ronda presencial nas 3 UTIs às 14h, 18h e 22h com validação das impressoras de pulseiras',
          responsibleName: 'Lucas Mendes',
          responsibleId: 105,
          isCollective: false,
          deadline: '07/11/2026 23:00',
          successCriteria: 'Zero impressoras travadas sem suporte em menos de 15 minutos.',
          status: 'EM_ANDAMENTO'
        }
      },
      {
        participantId: 'p-3',
        participantName: 'Mariana Costa',
        commitment: {
          id: 'ic-02',
          description: 'Acompanhamento do job de reindexação do banco do Tasy e liberação do sistema até 05h00',
          responsibleName: 'Mariana Costa',
          responsibleId: 101,
          isCollective: false,
          deadline: '08/11/2026 05:00',
          successCriteria: 'Sistema disponível para prescrição médica matinal sem lentidão.',
          status: 'EM_ANDAMENTO'
        }
      }
    ],
    decisions: [
      'Aprovada escala especial de sobreaviso com bonificação conforme acordo coletivo HEAL.',
      'Definido Rafael Albuquerque como ponto focal de escalonamento em caso de indisponibilidade de links.'
    ],
    nextReviewDate: '09/11/2026 09:00 (Daily da manhã)',
    status: 'EM_REVISAO',
    version: 'v1.0 (Oficial)',
    elaboratedBy: 'Henrique Vasconcelos',
    reviewedBy: 'Henrique Vasconcelos',
    archivingInfo: {
      isArchivedPhysical: false,
      bookNumber: 'Livro de Plantão e Alinhamentos — Tomo 03/2026',
      physicalLocation: 'Armário DTI / Pasta 12-B'
    },
    history: [
      {
        timestamp: '06/11/2026 11:30',
        author: 'Henrique Vasconcelos',
        action: 'Alinhamento coletivo aberto e minuta gerada'
      },
      {
        timestamp: '06/11/2026 12:05',
        author: 'Lucas Mendes',
        action: 'Assinatura digital e confirmação de ciência realizadas'
      },
      {
        timestamp: '06/11/2026 12:08',
        author: 'Rafael Albuquerque',
        action: 'Assinatura digital e confirmação de ciência realizadas'
      }
    ]
  },

  // 2. Alinhamento Individual: Orientação de Conduta e Postura (Lucas Mendes)
  {
    id: 'aln-2026-089',
    alignmentNumber: 'ALN-2026-089',
    dateTime: '28/10/2026 15:00',
    location: 'Sala de Reuniões da Gestão de TI',
    managerId: 1,
    managerName: 'Henrique Vasconcelos',
    managerRole: 'Gestor Operacional de TI',
    periodicity: 'ESPORADICO',
    scope: 'INDIVIDUAL',
    category: 'ORIENTACAO_CONDUTA',
    subject: 'Alinhamento Formal de Comunicação e Atendimento Assistencial',
    objective: 'Orientar o colaborador sobre postura empática e linguagem humanizada nas interações com a equipe de enfermagem do Pronto Atendimento.',
    context: 'Registro de queixa sobre resposta ríspida em chamado da Triagem no dia 27/10/2026.',
    topicsDiscussed: [
      'Impacto do estresse na área assistencial e papel do suporte como facilitador',
      'Uso de termos acolhedores e proibição de apontamentos que culpabilizem o usuário',
      'Treinamento em Comunicação Não-Violenta e mentoria com analista sênior'
    ],
    observedFactsOrSituations: 'Apontamento no chamado #48098: "usuário não soube usar o leitor e travou a fila", gerando ruído desnecessário.',
    transmittedOrientations: 'Orientado que o atendimento em ambiente hospitalar exige compreensão da sobrecarga da enfermagem. O papel da TI é pedagógico e de apoio incondicional.',
    participants: [
      {
        id: 'p-lucas',
        collaboratorId: 105,
        name: 'Lucas Mendes',
        role: 'Analista de Suporte Presencial N1/N2',
        department: 'Suporte Assistencial & Periféricos',
        alignmentRole: 'PARTICIPANTE',
        presence: 'PRESENTE',
        individualStatement: 'Entendi plenamente a situação. Não tive a intenção de ser ríspido, mas reconheço que errei na escolha das palavras e assumo o compromisso de melhorar.',
        scienceStatus: 'CIENTE',
        scienceDate: '28/10/2026 15:40',
        signatureStatus: 'ASSINADO_FISICO',
        signatureDate: '28/10/2026 15:45'
      }
    ],
    generalCommitments: [],
    individualCommitments: [
      {
        participantId: 'p-lucas',
        participantName: 'Lucas Mendes',
        commitment: {
          id: 'ic-03',
          description: 'Conclusão do curso de Comunicação Não-Violenta (Plataforma HEAL Ensino) e mentoria quinzenal',
          responsibleName: 'Lucas Mendes',
          responsibleId: 105,
          isCollective: false,
          deadline: '05/11/2026',
          successCriteria: 'Certificado de conclusão entregue e zero reincidências em 60 dias.',
          status: 'CONCLUIDO'
        }
      }
    ],
    decisions: [
      'Alinhamento formal homologado sem aplicação de sanção disciplinar, de natureza educativa e preventiva.',
      'Acompanhamento nos próximos alinhamentos semanais.'
    ],
    nextReviewDate: '12/11/2026',
    status: 'APROVADO',
    version: 'v1.0 (Homologado)',
    elaboratedBy: 'Henrique Vasconcelos',
    reviewedBy: 'Henrique Vasconcelos',
    approvedAt: '28/10/2026 16:00',
    archivingInfo: {
      isArchivedPhysical: true,
      bookNumber: 'Livro de Registros Formais DTI — 2026',
      physicalLocation: 'Arquivo Geral DTI / Pasta Funcional Mendes, L.',
      scannedPdfUploaded: true,
      uploadedAt: '29/10/2026 09:15'
    },
    history: [
      {
        timestamp: '28/10/2026 15:00',
        author: 'Henrique Vasconcelos',
        action: 'Reunião de alinhamento individual conduzida'
      },
      {
        timestamp: '28/10/2026 15:45',
        author: 'Henrique Vasconcelos',
        action: 'Termo assinado fisicamente por ambas as partes e arquivado'
      }
    ]
  },

  // 3. Alinhamento Individual: Reconhecimento e Elogio Formal (Mariana Costa)
  {
    id: 'aln-2026-090',
    alignmentNumber: 'ALN-2026-090',
    dateTime: '03/11/2026 16:00',
    location: 'Gabinete da Gestão DTI',
    managerId: 1,
    managerName: 'Henrique Vasconcelos',
    managerRole: 'Gestor Operacional de TI',
    periodicity: 'ESPORADICO',
    scope: 'INDIVIDUAL',
    category: 'RECONHECIMENTO',
    subject: 'Reconhecimento Formal por Atuação de Destaque no Incidente do Banco Analítico',
    objective: 'Registrar formalmente elogio funcional à colaboradora pelo diagnóstico ágil e recuperação íntegra do módulo de faturamento hospitalar.',
    context: 'Atuação excepcional no chamado de crise #47990 no dia 28/10, evitando prejuízos financeiros e atrasos nas remessas SUS.',
    topicsDiscussed: [
      'Elogio formal da Diretoria de Finanças e Faturamento Hospitalar',
      'Registro do feito no prontuário profissional da colaboradora',
      'Indicação como multiplicadora interna para as rotinas de CDC e replicação'
    ],
    observedFactsOrSituations: 'Identificou saturação de tablespace antes de corrupção de índices e aplicou script de rebalanceamento em tempo recorde de 40 minutos.',
    transmittedOrientations: 'Parabenizada formalmente em nome do Instituto HEAL. Estimulada a liderar os workshops de boas práticas de banco de dados para a equipe.',
    participants: [
      {
        id: 'p-mariana',
        collaboratorId: 101,
        name: 'Mariana Costa',
        role: 'Analista Sênior de Sistemas Clínicos (Tasy)',
        department: 'Sistemas Hospitalares (Tasy/PACS)',
        alignmentRole: 'PARTICIPANTE',
        presence: 'PRESENTE',
        individualStatement: 'Agradeço imensamente o reconhecimento da gestão. Foi um trabalho árduo, mas a colaboração da equipe foi fundamental para o sucesso.',
        scienceStatus: 'CIENTE',
        scienceDate: '03/11/2026 16:15',
        signatureStatus: 'ASSINADO_DIGITAL',
        signatureDate: '03/11/2026 16:20'
      }
    ],
    generalCommitments: [],
    individualCommitments: [
      {
        participantId: 'p-mariana',
        participantName: 'Mariana Costa',
        commitment: {
          id: 'ic-04',
          description: 'Apresentar estudo de caso do incidente no próximo Alinhamento Mensal da equipe de TI',
          responsibleName: 'Mariana Costa',
          responsibleId: 101,
          isCollective: false,
          deadline: '19/11/2026',
          successCriteria: 'Slides e roteiro compartilhados na base de conhecimento interna.',
          status: 'EM_ANDAMENTO'
        }
      }
    ],
    decisions: [
      'Encaminhada cópia do presente termo ao Departamento de Recursos Humanos para assentamento funcional.',
      'Concessão de folga compensatória programada para 17/11/2026.'
    ],
    status: 'APROVADO',
    version: 'v1.0 (Publicado)',
    elaboratedBy: 'Henrique Vasconcelos',
    reviewedBy: 'Henrique Vasconcelos',
    approvedAt: '03/11/2026 16:30',
    archivingInfo: {
      isArchivedPhysical: true,
      bookNumber: 'Livro de Elogios e Reconhecimentos DTI — 2026',
      physicalLocation: 'Armário DTI / Pasta Elogios 2026'
    },
    history: [
      {
        timestamp: '03/11/2026 16:00',
        author: 'Henrique Vasconcelos',
        action: 'Termo de Reconhecimento homologado e assinado digitalmente'
      }
    ]
  }
];

export const MOCK_MANAGERIAL_FEEDBACKS: ManagerialFeedback[] = [
  // 1. Mariana Costa (TPL-03 Oficial)
  {
    id: 'fdb-2026-042',
    feedbackNumber: 'FDB-2026-042',
    collaboratorId: 101,
    collaboratorName: 'Mariana Costa',
    collaboratorRole: 'Analista Sênior de Sistemas Clínicos (Tasy)',
    collaboratorDepartment: 'Sistemas Hospitalares (Tasy/PACS)',
    managerId: 1,
    managerName: 'Henrique Vasconcelos',
    managerRole: 'Gestor Operacional de TI',
    feedbackDate: '02/11/2026',
    periodEvaluated: 'Outubro de 2026',
    feedbackType: 'PERIODICO_MENSAL',
    previousFeedbackRefId: 'FDB-2026-035',
    strengths: [
      {
        id: 'str-01',
        title: 'Alta resolutividade em incidentes de alta criticidade no ERP Tasy',
        description: 'Capacidade diferenciada de resolução rápida em chamados assistenciais críticos, com 98.3% de resolução sem reabertura.'
      },
      {
        id: 'str-02',
        title: 'Excelente relacionamento interpessoal com o corpo clínico e enfermagem',
        description: 'Constante postura colaborativa elogiada pelos médicos e coordenações assistenciais do Bloco Cirúrgico e UTI.'
      },
      {
        id: 'str-03',
        title: 'Capacidade de mentoria técnica para novos analistas',
        description: 'Disponibilidade contínua para esclarecer dúvidas de regras de negócio em prontuário eletrônico para a equipe N1.'
      }
    ],
    developmentPoints: [
      {
        id: 'dp-01',
        title: 'Apontamento tempestivo de follow-ups intermediários no GLPI',
        description: 'Chamados em atendimento durante a tarde permanecem sem atualização de texto antes das 17h, gerando falsos indícios de estagnação no snapshot noturno das 04h.',
        operationalImpact: 'Auditoria documental aponta risco de inconformidade por ausência de registro humano tempestivo.'
      },
      {
        id: 'dp-02',
        title: 'Documentação de POPs de contingência para módulos secundários',
        description: 'Necessidade de estruturar a documentação de procedimentos para permitir que o suporte de campo atue com autonomia nos finais de semana.'
      }
    ],
    technicalMetrics: [
      { label: 'Chamados Resolvidos no Mês', value: 58, source: 'GLPI MariaDB', target: '≥ 45' },
      { label: 'Taxa de Não-Reabertura', value: '98.3%', source: 'Auditoria POP-TIN-017', target: '≥ 95%' },
      { label: 'Índice de Qualidade Documental', value: '94.0%', source: 'Governança DTI', target: '≥ 85%' },
      { label: 'Tempo Médio Observado', value: '18.4h', source: 'GLPI Histórico', target: '≤ 24h' }
    ],
    managerialEvaluation: {
      collaboration: 'Exemplar — Sempre solícita e engajada com os objetivos da equipe.',
      communication: 'Muito boa — Clara e polida nas interações assistenciais e técnicas.',
      organization: 'Adequada — Precisa consolidar os registros no GLPI antes do final do turno.',
      posture: 'Exemplar — Pontual, ética e referência técnica positiva.',
      autonomy: 'Alta — Conduz incidentes complexos com independência técnica irretocável.',
      commitmentsCompliance: '92% dos combinados do ciclo anterior foram rigorosamente cumpridos.'
    },
    developmentGoals: [
      {
        id: 'dg-01',
        objective: 'Follow-ups tempestivos no GLPI até 17h00',
        target: '100% dos chamados em andamento com registro humano antes das 17h',
        practicalActions: [
          'Definir alarme de calendário às 16h45 para conferência de chamados abertos',
          'Utilizar modelo rápido de apontamento com causa raiz preliminar'
        ],
        responsible: 'Mariana Costa',
        startDate: '02/11/2026',
        deadline: '02/12/2026',
        successCriteria: 'Zero ocorrências de chamados > 24h sem apontamento humano.',
        expectedEvidences: 'Relatório da auditoria noturna SNAPSHOT_04H sem apontamentos de estagnação.',
        status: 'EM_ANDAMENTO'
      },
      {
        id: 'dg-02',
        objective: 'Elaboração de 2 novos POPs de Contingência do Tasy',
        target: 'Publicação dos POPs de Contingência do Bloco Cirúrgico e Farmácia no portal',
        practicalActions: [
          'Mapear fluxo de contingência manual da farmácia hospitalar',
          'Revisar com a coordenação farmacêutica e homologar com o gestor'
        ],
        responsible: 'Mariana Costa',
        startDate: '02/11/2026',
        deadline: '20/11/2026',
        successCriteria: 'Documentos homologados e disponíveis na base do DTI.',
        expectedEvidences: 'POPs aprovados com número de registro POP-TIN-022 e 023.',
        status: 'EM_ANDAMENTO'
      },
      {
        id: 'dg-03',
        objective: 'Meta do Ciclo Anterior: Ampliação de Tablespace e Redução de Latência',
        target: 'Expansão de 100GB concluída e replicação sincronizada',
        practicalActions: ['Execução de script no Oracle ASM', 'Validação no job CDC'],
        responsible: 'Mariana Costa',
        startDate: '01/10/2026',
        deadline: '31/10/2026',
        successCriteria: 'Latência de banco < 200ms.',
        expectedEvidences: 'Chamado #47990 concluído com logs anexados.',
        status: 'ATINGIDA',
        reviewDate: '02/11/2026',
        justification: 'Concluído com êxito absoluto antes do prazo regulamentar.'
      }
    ],
    collaboratorStatement: 'Concordo com os pontos destacados pelo gestor. De fato, a correria no período da tarde às vezes dificulta o registro no GLPI, mas vou adotar o alarme às 16h45 para garantir que nenhum chamado fique sem apontamento.',
    collaboratorSignedScience: true,
    collaboratorSignedScienceAt: '02/11/2026 17:15',
    status: 'HOMOLOGADO',
    version: 'v1.0 (Homologado)',
    archivingInfo: {
      isArchivedPhysical: true,
      bookNumber: 'Livro de Feedbacks e Desempenho DTI — 2026',
      physicalLocation: 'Armário DTI / Pasta Funcional Mariana Costa'
    },
    history: [
      {
        timestamp: '02/11/2026 16:30',
        author: 'Henrique Vasconcelos',
        action: 'Reunião de feedback concluída e minuta elaborada'
      },
      {
        timestamp: '02/11/2026 17:15',
        author: 'Mariana Costa',
        action: 'Ciência formal e assinatura digital registradas'
      }
    ]
  },

  // 2. Lucas Mendes (TPL-03 Suporte de Campo)
  {
    id: 'fdb-2026-043',
    feedbackNumber: 'FDB-2026-043',
    collaboratorId: 105,
    collaboratorName: 'Lucas Mendes',
    collaboratorRole: 'Analista de Suporte Presencial N1/N2',
    collaboratorDepartment: 'Suporte Assistencial & Periféricos',
    managerId: 1,
    managerName: 'Henrique Vasconcelos',
    managerRole: 'Gestor Operacional de TI',
    feedbackDate: '28/10/2026',
    periodEvaluated: 'Outubro de 2026',
    feedbackType: 'PERIODICO_MENSAL',
    strengths: [
      {
        id: 'str-lm-01',
        title: 'Agilidade no atendimento presencial de chamados no Pronto Atendimento',
        description: 'Tempo de resposta física menor que 10 minutos para chamados de risco no PA.'
      },
      {
        id: 'str-lm-02',
        title: 'Dedicação e prontidão nos plantões de cobertura',
        description: 'Disponibilidade imediata para cobrir ausências e intervir em falhas de hardware.'
      }
    ],
    developmentPoints: [
      {
        id: 'dp-lm-01',
        title: 'Comunicação e Atendimento Humanizado',
        description: 'Adotar comunicação empática nas interações e nos textos públicos do GLPI, evitando expressões que possam ser interpretadas como indelicadeza.',
        operationalImpact: 'Preservar a harmonia entre o suporte e a enfermagem assistencial.'
      },
      {
        id: 'dp-lm-02',
        title: 'Anexação de Evidências Conclusivas (POP-TIN-017 Subitem 6.3)',
        description: 'Garantir que todo chamado solucionado contenha print ou comprovante de teste antes do encerramento.'
      }
    ],
    technicalMetrics: [
      { label: 'Chamados Resolvidos no Mês', value: 42, source: 'GLPI MariaDB', target: '≥ 40' },
      { label: 'Tempo de Primeira Resposta Presencial', value: '11 min', source: 'GLPI Histórico', target: '≤ 15 min' },
      { label: 'Qualidade Documental', value: '82.0%', source: 'POP-TIN-017', target: '≥ 85%' }
    ],
    managerialEvaluation: {
      collaboration: 'Boa — Tem excelente vontade e disponibilidade para auxiliar colegas.',
      communication: 'Em evolução — Requer atenção contínua na modulação de tom com usuários sob estresse.',
      organization: 'Boa — Mantém suas ferramentas e equipamentos em ordem.',
      posture: 'Em evolução — Demonstrou grande maturidade ao aceitar o alinhamento de conduta.',
      autonomy: 'Média — Resolve questões de hardware com autonomia; precisa de suporte em regras de negócio.'
    },
    developmentGoals: [
      {
        id: 'dg-lm-01',
        objective: 'Concluir Capacitação em Comunicação Não-Violenta e Empatia',
        target: 'Certificado anexado no RH e nota máxima no módulo de atendimento',
        practicalActions: ['Realizar módulos online', 'Sessão de mentoria com Rafael'],
        responsible: 'Lucas Mendes',
        startDate: '28/10/2026',
        deadline: '05/11/2026',
        successCriteria: 'Zero reclamações assistenciais no ciclo.',
        expectedEvidences: 'Certificado HEAL Ensino.',
        status: 'ATINGIDA',
        reviewDate: '06/11/2026',
        justification: 'Concluído em 04/11 com nota 10 no módulo prático.'
      },
      {
        id: 'dg-lm-02',
        objective: 'Auditoria de Evidência Conclusiva em 100% dos Chamados Fechados',
        target: '100% de conformidade com Subitem 6.3 do POP-TIN-017',
        practicalActions: [
          'Anexar foto ou print do teste de impressão realizado com usuário',
          'Coletar visto no chamado pelo usuário solicitante'
        ],
        responsible: 'Lucas Mendes',
        startDate: '28/10/2026',
        deadline: '28/11/2026',
        successCriteria: 'Índice de conformidade documental > 90%.',
        expectedEvidences: 'Auditoria semanal de chamados fechados.',
        status: 'EM_ANDAMENTO'
      }
    ],
    collaboratorStatement: 'Reconheço a importância da comunicação no ambiente hospitalar. Já concluí o curso e estou aplicando a saudação cordial em todos os atendimentos.',
    collaboratorSignedScience: true,
    collaboratorSignedScienceAt: '28/10/2026 16:30',
    status: 'HOMOLOGADO',
    version: 'v1.0 (Oficial)',
    archivingInfo: {
      isArchivedPhysical: true,
      bookNumber: 'Livro de Feedbacks e Desempenho DTI — 2026',
      physicalLocation: 'Armário DTI / Pasta Funcional Lucas Mendes'
    },
    history: [
      {
        timestamp: '28/10/2026 15:30',
        author: 'Henrique Vasconcelos',
        action: 'Feedback periódico realizado'
      }
    ]
  }
];

export const DEFAULT_FEEDBACK_SETTINGS: FeedbackAndAlignmentSettings = {
  defaultPeriodicityMonths: 1,
  enableMultiParticipantSignatures: true,
  documentNumberingPrefix: 'ALN-2026',
  requireIndividualStatements: true,
  scienceDeadlineDays: 3,
  pdfHeaderInstitutionName: 'Instituto HEAL — Gestão Hospitalar & Saúde Assistencial',
  pdfHeaderDepartmentName: 'Diretoria de Tecnologia da Informação — DTI / HEAL Ops',
  archivingBookDefault: 'Livro de Registro de Alinhamentos e Feedbacks DTI — 2026',
  categoriesConfig: [
    { id: 'ALINHAMENTO_OPERACIONAL', label: 'Alinhamento Operacional Geral', isEnabled: true },
    { id: 'ORIENTACAO_CONDUTA', label: 'Orientação de Conduta e Postura', isEnabled: true },
    { id: 'ORIENTACAO_TECNICA', label: 'Orientação Técnica & POPs', isEnabled: true },
    { id: 'RECONHECIMENTO', label: 'Reconhecimento & Elogio Formal', isEnabled: true },
    { id: 'PASSAGEM_PLATAOR_ESCALA', label: 'Passagem de Plantão e Escala', isEnabled: true },
    { id: 'AJUSTE_FERIAS', label: 'Ajuste de Férias e Folgas', isEnabled: true },
    { id: 'DEFINICAO_PAPEL', label: 'Definição de Papel e Atribuições', isEnabled: true },
    { id: 'LIVRE', label: 'Registro Livre de Alinhamento', isEnabled: true }
  ]
};

