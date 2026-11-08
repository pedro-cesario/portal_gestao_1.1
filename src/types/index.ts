/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Portal de Gestão Operacional da TI do Instituto HEAL
 * Tipagem canônica e contratos de dados
 */

export type UserRole = 'GESTOR' | 'TECNICO' | 'ADMIN';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
}

export type TicketStatus = 'novo' | 'em_atendimento' | 'planejado' | 'pendente' | 'solucionado' | 'fechado';

export type GLPIPriority = 'muito_baixa' | 'baixa' | 'media' | 'alta' | 'muito_alta';

export type ManagerialPriority = 'P1_CRITICA' | 'P2_ALTA' | 'P3_MEDIA' | 'P4_PADRAO';

export type AuthorshipType = 'humana' | 'automacao' | 'indeterminada';

export type EvidenceLevel = 
  | 'Fato confirmado'
  | 'Indício de desconformidade'
  | 'Verificação necessária'
  | 'Desconformidade confirmada';

export type CanonicalPendingStatus = 
  | 'NEW'
  | 'PERSISTENT'
  | 'REOPENED'
  | 'WAITING_EXTERNAL'
  | 'INCONCLUSIVE'
  | 'RESOLVED_WITH_EVIDENCE';

export interface TicketFollowup {
  id: string;
  authorName: string;
  authorType: AuthorshipType;
  date: string; // ISO ou formatado BRT
  content: string;
  isPrivate: boolean;
}

export interface TicketTask {
  id: string;
  description: string;
  status: 'concluida' | 'em_andamento' | 'pendente';
  assignedTo?: string;
  date: string;
}

export interface Ticket {
  id: number;
  title: string;
  status: TicketStatus;
  priorityGLPI: GLPIPriority;
  suggestedPriority: ManagerialPriority;
  groupId: number;
  groupName: string;
  technicianId?: number;
  technicianName?: string;
  category: string;
  dateCreation: string; // ISO
  lastHumanActionDate: string; // última ação humana comprovada
  dateMod: string; // data de modificação técnica no GLPI (NUNCA interpretar isoladamente como ação humana!)
  isWithoutEvolution24h: boolean;
  hasNominalTech: boolean;
  hospitalLocation: string; // Bloco Cirúrgico, UTI Adulto, Farmácia Central, etc.
  clinicalImpactAssessed: boolean;
  evidenceGaps: string[];
  tasks: TicketTask[];
  followups: TicketFollowup[];
  description: string;
}

export interface Technician {
  id: number;
  name: string;
  role: string;
  groupId: number;
  groupName: string;
  isManagementGroup: boolean; // Grupo 48 Gestão: excluído dos rankings de produtividade
  activeTicketsCount: number;
  ticketsWithoutEvolution24hCount: number;
  resolvedInPeriodCount: number;
  avgObservedResolutionHours: number; // tempo médio observado (não é MTTR nem SLA!)
  avatarInitials: string;
  email: string;
}

export interface PendingItem {
  id: string;
  stableFingerprint: string; // Identificador estável
  ticketId: number;
  ticketTitle: string;
  status: CanonicalPendingStatus;
  evidenceLevel: EvidenceLevel;
  popRule: string; // ex: POP-TIN-017 v2.4
  daysOpen: number;
  assignedTechnicianName?: string;
  groupName: string;
  description: string;
  evidenceNotes: string;
  lastAuditDate: string;
  transitionHistory: {
    from: CanonicalPendingStatus;
    to: CanonicalPendingStatus;
    timestamp: string;
    reason: string;
  }[];
}

export interface AuditSnapshot {
  id: string;
  timestamp: string;
  type: 'SNAPSHOT_04H' | 'MANUAL';
  totalTicketsEvaluated: number;
  newPendingsCount: number;
  persistentPendingsCount: number;
  reopenedPendingsCount: number;
  resolvedWithEvidenceCount: number;
  rulesEvaluated: string[];
  limitations: string;
  auditor: string;
  status: 'CONCLUIDO' | 'ALERTA';
}

export type PanelTemplateType = 'TPL-01' | 'TPL-02' | 'TPL-03' | 'TPL-04';

export interface ArtifactMetric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable' | { value: string; isPositive: boolean };
  target?: string;
  isAvailable?: boolean;
  evidenceRef?: string;
}

export interface ArtifactSectionItem {
  title: string;
  description: string;
  responsible?: string;
  deadline?: string;
  status?: string;
  evidenceLevel?: EvidenceLevel;
  relatedTicketId?: number;
  metrics?: { label: string; value: string | number }[];
}

export interface ArtifactSection {
  title: string;
  description?: string;
  items: ArtifactSectionItem[];
}

export interface ArtifactHumanReview {
  reviewedBy?: string;
  reviewDate?: string;
  reviewedAt?: string;
  notes?: string;
  status: 'RASCUNHO' | 'EM_REVISAO' | 'APROVADO' | 'ARQUIVADO';
}

export interface ArtifactPanel {
  id: string;
  templateType: PanelTemplateType;
  templateName: string;
  title: string;
  ownerName: string;
  referenceDate: string; // Data de referência (America/Sao_Paulo)
  generationDate: string;
  source: 'REALTIME' | 'SNAPSHOT_04H';
  version: string;
  status: 'APROVADO' | 'RASCUNHO' | 'EM_REVISAO' | 'ARQUIVADO';
  parameters?: {
    period?: string;
    targetCollaboratorId?: number;
    targetCollaboratorName?: string;
    targetProjectId?: string;
    targetProjectName?: string;
    collaboratorName?: string;
    projectName?: string;
  };
  summary: {
    headline: string;
    criticalAlertsCount: number;
    topPriorities: string[];
    keyDecisionsSummary: string;
    metricsBrief: ArtifactMetric[];
  };
  detail: {
    sections: ArtifactSection[];
    governanceNotes?: string;
    limitations?: string[];
    evidenceLogs?: { timestamp: string; source: string; entry: string }[];
  };
  humanReview?: ArtifactHumanReview;
  agreementsSummary?: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    renegotiated?: number;
  };
}

export type AgreementType = 'decisao' | 'tarefa' | 'encaminhamento' | 'compromisso';
export type AgreementStatus = 'RASCUNHO' | 'AGUARDANDO_CONFIRMACAO' | 'CONFIRMADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
export type AgreementDestination = 'GLPI' | 'GESTAO_HEAL';
export type AgreementPriority = 'P1_CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';
export type SourceMeetingType = 'DAILY' | 'ALINHAMENTO_SEMANAL' | 'REUNIAO_GERENCIAL';

export interface AgreementHistoryItem {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  notes?: string;
  previousStatus?: AgreementStatus;
  newStatus?: AgreementStatus;
}

export interface MeetingAgreement {
  agreementId: string;
  sourceArtifactId?: string;
  sourceMeetingType: SourceMeetingType;
  meetingReferenceDate?: string; // ex: '05/11/2026' ou 'Semana 44/2026'
  isPreviousMeeting?: boolean; // indica se é da reunião anterior
  description: string;
  type: AgreementType;
  responsibleId?: number;
  responsibleName: string;
  deadline: string;
  priority: AgreementPriority;
  status: AgreementStatus;
  destination: AgreementDestination;
  relatedTicketId?: number;
  evidenceRefs?: string[];
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
  confirmedBy?: string;
  updatedAt: string;
  history: AgreementHistoryItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  pathType?: 'FAST_PATH' | 'AGY';
  sources?: string[];
  analyticalDetail?: string; // Conteúdo aprofundado para revelação progressiva ("Ver análise completa")
  quickArtifact?: ArtifactPanel;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
  templateGenerated?: string;
}

export type NavigationRoute = 
  | 'visao-geral'
  | 'chamados'
  | 'equipe'
  | 'pendencias'
  | 'auditorias'
  | 'indicadores'
  | 'agente-gerencial'
  | 'daily-paineis'
  | 'templates'
  | 'configuracoes';

export interface NavMenuItemConfig {
  id: NavigationRoute;
  label: string;
  isVisible: boolean;
  isLocked?: boolean; // ex: 'configuracoes' não pode ser desativado
}

export interface PopRule {
  id: string; // ex: 'POP-TIN-017-R1'
  title: string;
  description: string;
  defaultEvidenceLevel: EvidenceLevel;
  thresholdHours: number; // ex: 24h
  severity: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';
  isActive: boolean;
  applicableExceptions: string;
  createdAt: string;
  updatedAt: string;
}

export interface PopRevision {
  version: string;
  date: string;
  author: string;
  summary: string;
  rulesCount: number;
}

export interface PopSpecification {
  code: string; // 'POP-TIN-017'
  version: string; // 'v2.4'
  status: 'VIGENTE' | 'HOMOLOGADA' | 'RASCUNHO' | 'ARQUIVADA';
  homologatedBy: string; // 'Diretoria de Tecnologia da Informação (DTI)'
  effectiveDate: string; // '01/08/2026'
  changeNotes: string;
  rules: PopRule[];
  revisionHistory: PopRevision[];
}

export interface OperationalCalculationSettings {
  // Limiar de estagnação geral
  stagnationThresholdHours: number; // 24

  // Parâmetros do Tempo Médio Observado
  avgResolutionTime: {
    excludeWeekends: boolean;
    excludeWaitingExternal: boolean;
    excludeUnassignedTime: boolean;
    excludeReopened: boolean;
    calculationWindowDays: number; // 30
  };

  // Governança de Equipe
  teamGovernance: {
    excludeManagementGroup48: boolean;
    maxActiveTicketsPerTechThreshold: number; // 6
    stalledTicketsAlertThreshold: number; // 2
    excludedGroupIds: number[]; // [48]
  };

  // Horários dos Snapshots Oficiais (America/Sao_Paulo)
  snapshotSchedules: {
    nightlyAuditTime: string; // '04:00'
    morningBriefTime: string; // '07:00'
    shiftCutoffTime: string; // '17:00'
  };

  // Classificação de Autoria Humana vs Automação
  authorshipRules: {
    automationKeywords: string[]; // ['glpi_sync', 'notificacao_automatica', 'alert_bot', 'rotina_noturna', 'system']
    minCharsForValidHumanEvidence: number; // 15
  };

  // Setores Críticos de Alta Prioridade
  emergencyLocations: string[];
}

export interface SettingsAuditLog {
  id: string;
  timestamp: string;
  user: string;
  section: string;
  changeDescription: string;
}

// ==========================================
// PARTE A: PLANOS DE EVOLUÇÃO INDIVIDUAL
// ==========================================

export type DevelopmentCommitmentStatus = 
  | 'PROPOSTO'
  | 'AGUARDANDO_CIENCIA'
  | 'EM_ANDAMENTO'
  | 'AGUARDANDO_VALIDACAO'
  | 'CUMPRIDO'
  | 'PARCIALMENTE_CUMPRIDO'
  | 'NAO_CUMPRIDO'
  | 'REPLANEJADO'
  | 'CANCELADO';

export interface DevelopmentAction {
  id: string;
  description: string;
  deadline: string;
  completed: boolean;
  completedAt?: string;
  evidenceRef?: string;
}

export interface DevelopmentHistoryItem {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  fieldChanged?: string;
  previousValue?: string;
  newValue?: string;
  justification?: string;
}

export interface DevelopmentCommitment {
  id: string;
  sourceMeetingType: SourceMeetingType;
  meetingReferenceDate: string; // ex: 'Semana 44/2026' ou '06/11/2026'
  isPreviousAlignment?: boolean;
  collaboratorId: number;
  collaboratorName: string;
  collaboratorRole?: string;
  registeredAt: string;
  developmentArea: string; // Atendimento ao usuário, Comunicação técnica, Cumprimento de prazos, POP-TIN-017, Homologação e testes, etc.
  observedSituation: string; // Descrição demonstrativa, factual e respeitosa
  evidencesObserved: string[]; // Chamados GLPI, logs, relatos com data
  operationalImpact: string; // Impacto na operação/equipe
  agreedGoal: string; // Resultado esperado mensurável
  collaboratorProposedCommitment: string; // O que o colaborador combinou que fará
  practicalActions: DevelopmentAction[];
  mentorOrManagerId?: number;
  mentorOrManagerName: string;
  startDate: string;
  deadlineOrNextReview: string;
  successCriteria: string; // Critérios objetivos mensuráveis
  collaboratorNotes?: string;
  collaboratorSignedScience?: boolean; // Ciência formal do colaborador
  collaboratorSignedScienceAt?: string;
  managerNotes?: string;
  status: DevelopmentCommitmentStatus;
  validationFeedback?: string;
  validatedBy?: string;
  validatedAt?: string;
  history: DevelopmentHistoryItem[];
}

export interface DevelopmentPlanSummary {
  activePlans: number;
  completedCommitments: number;
  monitoringCommitments: number;
  overdueCommitments: number;
  awaitingValidation: number;
}

// ==========================================
// PARTE B: GESTÃO COMPLETA DE PROJETOS (TPL-04)
// ==========================================

export type ProjectTaskStatus = 
  | 'NAO_INICIADO'
  | 'PLANEJADO'
  | 'EM_ANDAMENTO'
  | 'BLOQUEADO'
  | 'AGUARDANDO_VALIDACAO'
  | 'AJUSTES_SOLICITADOS'
  | 'CONCLUIDO'
  | 'CANCELADO';

export interface ProjectSubtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProjectDeliverable {
  id: string;
  code: string; // 'ENT-01'
  phaseId: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'PLANEJADA' | 'EM_ANDAMENTO' | 'AGUARDANDO_VALIDACAO' | 'HOMOLOGADA' | 'ATRASADA';
  progressPercentage: number;
  validatedBy?: string;
  validatedAt?: string;
  evidenceRefs?: string[];
}

export interface ProjectTask {
  id: string;
  code: string; // 'TSK-01'
  phaseId: string;
  deliverableId?: string;
  title: string;
  description: string;
  responsibleId?: number;
  responsibleName: string;
  role: string;
  startDate: string;
  dueDate: string;
  priority: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';
  status: ProjectTaskStatus;
  progressPercentage: number; // 0 - 100
  blockReason?: string;
  unblockAction?: string;
  evidenceNote?: string;
  evidenceUrls?: string[];
  subtasks: ProjectSubtask[];
  dependencies?: string[]; // Códigos de tarefas pré-requisito
  lastUpdated: string;
  history?: { timestamp: string; author: string; action: string; note?: string }[];
}

export interface ProjectMilestone {
  id: string;
  phaseId: string;
  title: string;
  targetDate: string;
  actualDate?: string;
  isCriticalPath: boolean;
  status: 'CONCLUIDO' | 'EM_ANDAMENTO' | 'PENDENTE' | 'ATRASADO';
  description: string;
}

export interface ProjectPhase {
  id: string;
  order: number;
  code: string; // 'FASE_1'
  title: string;
  objective: string;
  startDate: string;
  endDate: string;
  status: 'CONCLUIDA' | 'EM_ANDAMENTO' | 'NAO_INICIADA' | 'ATRASADA';
  progressPercentage: number;
  deliverables: ProjectDeliverable[];
  milestones: ProjectMilestone[];
}

export interface ProjectRisk {
  id: string;
  title: string;
  category: 'TECNICO' | 'OPERACIONAL' | 'FORNECEDOR' | 'CLINICO' | 'INFRAESTRUTURA';
  probability: 'BAIXA' | 'MEDIA' | 'ALTA';
  impact: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  mitigationAction: string;
  owner: string;
  status: 'ATIVO' | 'MITIGADO' | 'OCORRIDO';
}

export interface ProjectDecision {
  id: string;
  title: string;
  committee: string;
  date: string;
  decision: string;
  rationale: string;
  participants: string[];
}

export interface ProjectChangeLog {
  id: string;
  date: string;
  author: string;
  type: 'ESCOPO' | 'CRONOGRAMA' | 'RECURSO' | 'ARQUITETURA';
  description: string;
  baselineBefore: string;
  baselineAfter: string;
  justification: string;
  approvedBy: string;
}

export interface ManagedProject {
  id: string;
  code: string; // 'PRJ-PACS-01'
  name: string;
  sponsor: string;
  manager: string;
  targetDate: string;
  generalValidatedProgress: number; // % ponderado
  completedMilestonesCount: number;
  totalMilestonesCount: number;
  pendingDeliverablesCount: number;
  overdueTasksCount: number;
  criticalBlocksCount: number;
  nextMilestone: { title: string; date: string; daysRemaining: number };
  phases: ProjectPhase[];
  tasks: ProjectTask[];
  risks: ProjectRisk[];
  decisions: ProjectDecision[];
  changeLogs: ProjectChangeLog[];
}

