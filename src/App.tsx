/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Portal de Gestão Operacional da TI do Instituto HEAL
 * Aplicação Central Integrada com Princípio UX "Sintético Primeiro, Analítico sob Demanda"
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationRoute, 
  CurrentUser, 
  Ticket, 
  Technician, 
  PendingItem, 
  AuditSnapshot, 
  ArtifactPanel,
  PopSpecification,
  OperationalCalculationSettings,
  NavMenuItemConfig,
  MeetingAgreement,
  AgreementStatus,
  DevelopmentCommitment,
  DevelopmentCommitmentStatus,
  ManagedProject,
  ProjectTaskStatus,
  FormalAlignment,
  ManagerialFeedback,
  FeedbackAndAlignmentSettings
} from './types';
import { 
  MOCK_USERS, 
  MOCK_TICKETS, 
  MOCK_TECHNICIANS, 
  MOCK_PENDINGS, 
  MOCK_AUDITS, 
  MOCK_SAVED_PANELS,
  MOCK_MEETING_AGREEMENTS,
  MOCK_DEVELOPMENT_COMMITMENTS,
  MOCK_MANAGED_PROJECTS,
  MOCK_FORMAL_ALIGNMENTS,
  MOCK_MANAGERIAL_FEEDBACKS,
  DEFAULT_FEEDBACK_SETTINGS
} from './data/mockData';
import {
  validateActionAuthentication,
  confirmParticipantScience,
  refuseParticipantScience,
  collectParticipantPhysicalSignature,
  refuseParticipantPhysicalSignature,
  collectManagerPhysicalSignature,
  archiveDocumentPhysical
} from './utils/documentGovernance';
import {
  DEFAULT_POP_SPEC,
  DEFAULT_CALCULATION_SETTINGS,
  DEFAULT_MENU_CONFIG
} from './data/settingsDefaults';

// Componentes de Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Visualizações dos Módulos
import { OverviewView } from './components/views/OverviewView';
import { TicketsView } from './components/views/TicketsView';
import { TeamView } from './components/views/TeamView';
import { PendingsView } from './components/views/PendingsView';
import { AuditsView } from './components/views/AuditsView';
import { IndicatorsView } from './components/views/IndicatorsView';
import { AgenteGerencialView } from './components/views/AgenteGerencialView';
import { DailyAndPanelsView } from './components/views/DailyAndPanelsView';
import { TemplatesGuideView } from './components/views/TemplatesGuideView';
import { SettingsView } from './components/views/SettingsView';
import { LoginView } from './components/views/LoginView';

export default function App() {
  // Estado de Autenticação
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(MOCK_USERS[0]);

  // Estado de Rota Ativa
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>('visao-geral');

  // Estado de Tema Escuro / Claro (Padrão: Modo Claro)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('heal_ops_theme');
      if (saved) return saved === 'dark';
    } catch {
      // fallback
    }
    return false; // Padrão: Modo Claro
  });

  // Fonte de Dados Ativa (REALTIME vs SNAPSHOT_04H)
  const [dataSource, setDataSource] = useState<'REALTIME' | 'SNAPSHOT_04H'>('SNAPSHOT_04H');

  // Dados do Sistema
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [technicians, setTechnicians] = useState<Technician[]>(MOCK_TECHNICIANS);
  const [pendings, setPendings] = useState<PendingItem[]>(MOCK_PENDINGS);
  const [audits, setAudits] = useState<AuditSnapshot[]>(MOCK_AUDITS);
  const [savedPanels, setSavedPanels] = useState<ArtifactPanel[]>(MOCK_SAVED_PANELS);
  const [agreements, setAgreements] = useState<MeetingAgreement[]>(MOCK_MEETING_AGREEMENTS);
  const [developmentCommitments, setDevelopmentCommitments] = useState<DevelopmentCommitment[]>(MOCK_DEVELOPMENT_COMMITMENTS);
  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>(MOCK_MANAGED_PROJECTS);
  const [formalAlignments, setFormalAlignments] = useState<FormalAlignment[]>(MOCK_FORMAL_ALIGNMENTS);
  const [managerialFeedbacks, setManagerialFeedbacks] = useState<ManagerialFeedback[]>(MOCK_MANAGERIAL_FEEDBACKS);
  const [feedbackSettings, setFeedbackSettings] = useState<FeedbackAndAlignmentSettings>(DEFAULT_FEEDBACK_SETTINGS);

  // Parâmetros de Governança, Regras POP-TIN-017 e Fórmulas de Cálculo
  const [popSpec, setPopSpec] = useState<PopSpecification>(DEFAULT_POP_SPEC);
  const [calculationSettings, setCalculationSettings] = useState<OperationalCalculationSettings>(DEFAULT_CALCULATION_SETTINGS);

  // Configuração e Ordem do Menu Lateral da Esquerda
  const [menuConfig, setMenuConfig] = useState<NavMenuItemConfig[]>(() => {
    try {
      const saved = localStorage.getItem('heal_ops_menu_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_MENU_CONFIG;
  });

  const handleUpdateMenuConfig = (newConfig: NavMenuItemConfig[]) => {
    setMenuConfig(newConfig);
    try {
      localStorage.setItem('heal_ops_menu_config', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  // Estados de Transição e Parâmetros entre Módulos
  const [targetTicketId, setTargetTicketId] = useState<number | null>(null);
  const [agenteInitialPrompt, setAgenteInitialPrompt] = useState<string | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Estado de Sidebar Recolhida (Padrão: contraída por preferência do usuário)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('heal_ops_sidebar_collapsed');
      if (saved !== null) return saved === 'true';
    } catch {
      // fallback
    }
    return true; // Padrão: Sempre contraída
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('heal_ops_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Efeito para sincronizar a classe 'dark' no elemento raiz HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Alternância de Tema
  const handleToggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('heal_ops_theme', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Alternância de Fonte de Dados
  const handleToggleDataSource = () => {
    setDataSource(prev => (prev === 'REALTIME' ? 'SNAPSHOT_04H' : 'REALTIME'));
  };

  // Navegação entre rotas mantendo comportamento padrão da barra lateral em todo o projeto
  const handleRouteChange = (route: NavigationRoute) => {
    setCurrentRoute(route);
  };

  // Navegação direta para Chamado específico
  const handleNavigateToTicket = (ticketId: number) => {
    setTargetTicketId(ticketId);
    handleRouteChange('chamados');
  };

  // Solicitar ação no Agente vinda de outro módulo
  const handleOpenAgenteWithPrompt = (prompt: string) => {
    setAgenteInitialPrompt(prompt);
    handleRouteChange('agente-gerencial');
  };

  // Abrir chat do Agente Gerencial pelo Header
  const handleOpenAgenteChat = () => {
    handleRouteChange('agente-gerencial');
  };

  // Salvar artefato aprovado no catálogo de Daily e Painéis
  const handleSaveArtifact = (artifact: ArtifactPanel) => {
    setSavedPanels(prev => [artifact, ...prev.filter(p => p.id !== artifact.id)]);
  };

  // Atualizar painel existente (ex: após revisão humana)
  const handleUpdatePanel = (updatedPanel: ArtifactPanel) => {
    setSavedPanels(prev => prev.map(p => p.id === updatedPanel.id ? updatedPanel : p));
  };

  // Registrar novo acordo assumido durante reunião Daily ou Alinhamento
  const handleSaveAgreement = (newAgreement: MeetingAgreement) => {
    setAgreements(prev => [newAgreement, ...prev]);
  };

  // Atualizar status e auditoria de acordo existente
  const handleUpdateAgreementStatus = (agreementId: string, newStatus: AgreementStatus, note?: string) => {
    setAgreements(prev => prev.map(a => {
      if (a.agreementId === agreementId) {
        const nowTimestamp = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const authorName = currentUser?.name || 'Operador não identificado';
        return {
          ...a,
          status: newStatus,
          updatedAt: nowTimestamp,
          notes: note || a.notes,
          history: [
            ...a.history,
            {
              id: `h-${Date.now()}`,
              timestamp: nowTimestamp,
              author: authorName,
              action: `Status alterado para ${newStatus}`,
              previousStatus: a.status,
              newStatus,
              notes: note
            }
          ]
        };
      }
      return a;
    }));
  };

  // Gerenciamento de Planos de Evolução Individual (TPL-02 e TPL-03)
  const handleSaveCommitment = (newCommitment: DevelopmentCommitment) => {
    setDevelopmentCommitments(prev => [newCommitment, ...prev]);
  };

  const handleUpdateCommitmentStatus = (
    commitmentId: string, 
    newStatus: DevelopmentCommitmentStatus, 
    actionNote?: string,
    validationFeedback?: string
  ) => {
    const author = currentUser?.name || 'Operador não identificado';
    const nowTimestamp = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setDevelopmentCommitments(prev => prev.map(c => {
      if (c.id !== commitmentId) return c;
      const historyItem = {
        id: `h-${Date.now()}`,
        timestamp: nowTimestamp,
        author,
        action: actionNote || `Status alterado para ${newStatus}`,
        previousValue: c.status,
        newValue: newStatus,
        justification: validationFeedback
      };

      return {
        ...c,
        status: newStatus,
        validationFeedback: validationFeedback !== undefined ? validationFeedback : c.validationFeedback,
        validatedBy: (newStatus === 'CUMPRIDO' || newStatus === 'PARCIALMENTE_CUMPRIDO') ? author : c.validatedBy,
        validatedAt: (newStatus === 'CUMPRIDO' || newStatus === 'PARCIALMENTE_CUMPRIDO') ? nowTimestamp : c.validatedAt,
        collaboratorSignedScience: (newStatus === 'EM_ANDAMENTO' && c.status === 'AGUARDANDO_CIENCIA') ? true : c.collaboratorSignedScience,
        collaboratorSignedScienceAt: (newStatus === 'EM_ANDAMENTO' && c.status === 'AGUARDANDO_CIENCIA') ? nowTimestamp : c.collaboratorSignedScienceAt,
        history: [historyItem, ...c.history]
      };
    }));
  };

  const handleToggleActionCompleted = (commitmentId: string, actionId: string) => {
    const nowTimestamp = new Date().toLocaleDateString('pt-BR');
    setDevelopmentCommitments(prev => prev.map(c => {
      if (c.id !== commitmentId) return c;
      return {
        ...c,
        practicalActions: c.practicalActions.map(a => {
          if (a.id !== actionId) return a;
          return {
            ...a,
            completed: !a.completed,
            completedAt: !a.completed ? nowTimestamp : undefined
          };
        })
      };
    }));
  };

  const handleAddEvolutionNote = (commitmentId: string, note: string) => {
    const author = currentUser?.name || 'Operador não identificado';
    const nowTimestamp = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setDevelopmentCommitments(prev => prev.map(c => {
      if (c.id !== commitmentId) return c;
      const historyItem = {
        id: `h-${Date.now()}`,
        timestamp: nowTimestamp,
        author,
        action: `Evolução: ${note}`
      };
      return {
        ...c,
        history: [historyItem, ...c.history]
      };
    }));
  };

  // Gerenciamento Completo de Projetos (TPL-04)
  const handleUpdateTaskStatus = (taskId: string, newStatus: ProjectTaskStatus, note?: string) => {
    setManagedProjects(prev => prev.map(prj => {
      const task = prj.tasks.find(t => t.id === taskId);
      if (!task) return prj;

      const updatedTasks = prj.tasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: newStatus,
          progressPercentage: newStatus === 'CONCLUIDO' ? 100 : t.progressPercentage,
          evidenceNote: note || t.evidenceNote
        };
      });

      const completedCount = updatedTasks.filter(t => t.status === 'CONCLUIDO').length;
      const criticalBlocks = updatedTasks.filter(t => t.status === 'BLOQUEADO').length;

      return {
        ...prj,
        tasks: updatedTasks,
        criticalBlocksCount: criticalBlocks
      };
    }));
  };

  const handleUpdateTaskProgress = (taskId: string, progress: number) => {
    setManagedProjects(prev => prev.map(prj => ({
      ...prj,
      tasks: prj.tasks.map(t => t.id === taskId ? { ...t, progressPercentage: progress } : t)
    })));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setManagedProjects(prev => prev.map(prj => ({
      ...prj,
      tasks: prj.tasks.map(t => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
        const completedCount = updatedSubtasks.filter(s => s.completed).length;
        const newProgress = Math.round((completedCount / updatedSubtasks.length) * 100);
        return {
          ...t,
          subtasks: updatedSubtasks,
          progressPercentage: newProgress,
          status: newProgress === 100 ? 'AGUARDANDO_VALIDACAO' : t.status
        };
      })
    })));
  };

  const handleReportBlock = (taskId: string, reason: string, action: string) => {
    setManagedProjects(prev => prev.map(prj => ({
      ...prj,
      criticalBlocksCount: prj.criticalBlocksCount + 1,
      tasks: prj.tasks.map(t => t.id === taskId ? {
        ...t,
        status: 'BLOQUEADO',
        blockReason: reason,
        unblockAction: action
      } : t)
    })));
  };

  // Gestão de Alinhamentos Formais e Feedbacks (TPL-03)
  const handleSaveAlignment = (newAlignment: FormalAlignment) => {
    setFormalAlignments(prev => [newAlignment, ...prev]);
  };

  const handleSaveFeedback = (newFeedback: ManagerialFeedback) => {
    setManagerialFeedbacks(prev => [newFeedback, ...prev]);
  };

  // Confirmar ciência formal: atualiza APENAS estado de ciência
  const handleConfirmScience = (docId: string, participantId: string | number, notes?: string) => {
    const authCheck = validateActionAuthentication(currentUser);
    if (!authCheck.allowed) {
      alert(authCheck.error || 'Ação bloqueada: Confirmação de ciência exige operador autenticado.');
      return;
    }
    const operator = authCheck.operatorName!;
    const nowTimestamp = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setFormalAlignments(prev => prev.map(a => {
      if (a.id === docId || a.alignmentNumber === docId) {
        return confirmParticipantScience(a, participantId, operator, nowTimestamp, notes);
      }
      return a;
    }));
  };

  // Registrar recusa de ciência
  const handleRefuseScience = (docId: string, participantId: string | number, justification: string) => {
    const authCheck = validateActionAuthentication(currentUser);
    if (!authCheck.allowed) {
      alert(authCheck.error || 'Ação bloqueada: Registro de recusa exige operador autenticado.');
      return;
    }
    const operator = authCheck.operatorName!;
    const nowTimestamp = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setFormalAlignments(prev => prev.map(a => {
      if (a.id === docId || a.alignmentNumber === docId) {
        return refuseParticipantScience(a, participantId, operator, nowTimestamp, justification);
      }
      return a;
    }));
  };

  // Registrar assinatura manuscrita: atualiza APENAS assinatura física e metadados
  const handleCollectPhysicalSignature = (
    docId: string, 
    participantId: string | number, 
    operatorName?: string, 
    date?: string, 
    notes?: string
  ) => {
    const authCheck = validateActionAuthentication(currentUser);
    if (!authCheck.allowed) {
      alert(authCheck.error || 'Ação bloqueada: Registro de assinatura física exige operador autenticado.');
      return;
    }
    const operator = operatorName || authCheck.operatorName!;
    const nowTimestamp = date || (new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

    setFormalAlignments(prev => prev.map(a => {
      if (a.id === docId || a.alignmentNumber === docId) {
        return collectParticipantPhysicalSignature(a, participantId, operator, nowTimestamp, notes);
      }
      return a;
    }));
  };

  // Registrar recusa de assinatura física manuscrita
  const handleRefusePhysicalSignature = (
    docId: string,
    participantId: string | number,
    operatorName?: string,
    date?: string,
    justification?: string
  ) => {
    const authCheck = validateActionAuthentication(currentUser);
    if (!authCheck.allowed) {
      alert(authCheck.error || 'Ação bloqueada: Registro de recusa exige operador autenticado.');
      return;
    }
    const operator = operatorName || authCheck.operatorName!;
    const nowTimestamp = date || (new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    const cleanJustification = justification || 'Recusa verbal do participante em apor firma manuscrita.';

    setFormalAlignments(prev => prev.map(a => {
      if (a.id === docId || a.alignmentNumber === docId) {
        return refuseParticipantPhysicalSignature(a, participantId, operator, nowTimestamp, cleanJustification);
      }
      return a;
    }));
  };

  // Registrar assinatura física do gestor/condutor
  const handleCollectManagerSignature = (docId: string, operatorName?: string, date?: string) => {
    const authCheck = validateActionAuthentication(currentUser);
    if (!authCheck.allowed) {
      alert(authCheck.error || 'Ação bloqueada: Registro de assinatura do gestor exige operador autenticado.');
      return;
    }
    const operator = operatorName || authCheck.operatorName!;
    const nowTimestamp = date || (new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

    setFormalAlignments(prev => prev.map(a => {
      if (a.id === docId || a.alignmentNumber === docId) {
        return collectManagerPhysicalSignature(a, operator, nowTimestamp);
      }
      return a;
    }));
  };

  // Arquivamento físico institucional com livro e tomo
  const handleArchivePhysical = (
    docId: string, 
    bookNumber: string, 
    physicalLocation: string,
    operatorName?: string,
    archiveDate?: string
  ) => {
    const authCheck = validateActionAuthentication(currentUser);
    if (!authCheck.allowed) {
      alert(authCheck.error || 'Ação bloqueada: Arquivamento físico exige operador autenticado.');
      return;
    }
    const operator = operatorName || authCheck.operatorName!;
    const nowTimestamp = archiveDate || (new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

    if (!bookNumber || !bookNumber.trim() || !physicalLocation || !physicalLocation.trim()) {
      alert('Ação bloqueada: O arquivamento físico exige indicação formal de livro/tomo e localização física.');
      return;
    }

    setFormalAlignments(prev => prev.map(a => {
      if (a.id === docId || a.alignmentNumber === docId) {
        const result = archiveDocumentPhysical(a, bookNumber, physicalLocation, operator, nowTimestamp);
        if (!result.success) {
          alert(result.error || 'Falha no arquivamento.');
          return a;
        }
        return result.alignment!;
      }
      return a;
    }));

    setManagerialFeedbacks(prev => prev.map(f => {
      if (f.id === docId || f.feedbackNumber === docId) {
        return {
          ...f,
          status: 'ARQUIVADO',
          archivingInfo: {
            isArchivedPhysical: true,
            bookNumber: bookNumber.trim(),
            physicalLocation: physicalLocation.trim()
          }
        };
      }
      return f;
    }));
  };

  // Disparo de Auditoria Manual
  const handleTriggerManualAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const newAudit: AuditSnapshot = {
        id: `audit-${Date.now()}`,
        timestamp: '06/11/2026 10:10 (Manual)',
        type: 'MANUAL',
        totalTicketsEvaluated: 142,
        newPendingsCount: 3,
        persistentPendingsCount: 8,
        reopenedPendingsCount: 1,
        resolvedWithEvidenceCount: 12,
        rulesEvaluated: ['POP-TIN-017 v2.4', 'POP-TIN-008 v1.9', 'Instrução Normativa DTI 03/2026'],
        limitations: 'Varredura manual acionada pelo Gestor. Validação de hashes em andamento.',
        auditor: `${currentUser?.name || 'Gestor'} (Auditoria Manual)`,
        status: 'CONCLUIDO'
      };
      setAudits(prev => [newAudit, ...prev]);
      setIsAuditing(false);
    }, 1200);
  };

  // Sincronização manual com a réplica GLPI
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Se o usuário não estiver autenticado, exibir a tela de Login Institucional
  if (!currentUser) {
    return <LoginView onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  // Contadores para alertas de navegação
  const unassignedCount = tickets.filter(t => !t.hasNominalTech && t.status !== 'fechado' && t.status !== 'solucionado').length;
  const pendingAlertsCount = pendings.filter(p => p.status === 'PERSISTENT' || p.status === 'NEW').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar de Navegação Executiva (com suporte a Mobile/Tablet Off-Canvas, Ordem Personalizável e Auto-Recolhimento) */}
      <Sidebar
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
        currentUser={currentUser}
        onSwitchUser={(u) => setCurrentUser(u)}
        allUsers={MOCK_USERS}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onLogout={() => setCurrentUser(null)}
        unassignedCount={unassignedCount}
        pendingAlertsCount={pendingAlertsCount}
        dataSource={dataSource}
        onToggleDataSource={handleToggleDataSource}
        menuConfig={menuConfig}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar Contract */}
        <Header
          currentRoute={currentRoute}
          onOpenAgenteChat={handleOpenAgenteChat}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
          dataSource={dataSource}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Viewport dos Módulos — Zero-Scroll com Utilização Dinâmica do Espaço */}
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {currentRoute === 'visao-geral' && (
            <OverviewView
              tickets={tickets}
              latestAudit={audits[0]}
              onNavigateToTicket={handleNavigateToTicket}
              onNavigateToRoute={handleRouteChange}
              dataSource={dataSource}
            />
          )}

          {currentRoute === 'chamados' && (
            <TicketsView
              tickets={tickets}
              initialTicketId={targetTicketId}
              onClearInitialTicketId={() => setTargetTicketId(null)}
            />
          )}

          {currentRoute === 'equipe' && (
            <TeamView
              technicians={technicians}
              tickets={tickets}
              onOpenAgenteForFeedback={(name) => handleOpenAgenteWithPrompt(`Monte uma minuta de feedback individual fundamentado para ${name}.`)}
            />
          )}

          {currentRoute === 'pendencias' && (
            <PendingsView
              pendings={pendings}
              onOpenTicket={handleNavigateToTicket}
              popVersion={popSpec.version}
            />
          )}

          {currentRoute === 'auditorias' && (
            <AuditsView
              audits={audits}
              onTriggerManualAudit={handleTriggerManualAudit}
              isAuditing={isAuditing}
            />
          )}

          {currentRoute === 'indicadores' && (
            <IndicatorsView />
          )}

          {currentRoute === 'agente-gerencial' && (
            <AgenteGerencialView
              tickets={tickets}
              technicians={technicians}
              pendings={pendings}
              agreements={agreements}
              onSaveAgreement={handleSaveAgreement}
              onUpdateAgreementStatus={handleUpdateAgreementStatus}
              currentUser={currentUser}
              onSaveArtifactToCatalog={handleSaveArtifact}
              onNavigateToSavedPanels={() => handleRouteChange('daily-paineis')}
              initialPrompt={agenteInitialPrompt}
              onClearInitialPrompt={() => setAgenteInitialPrompt(undefined)}
              onOpenTicketById={handleNavigateToTicket}
            />
          )}

          {currentRoute === 'daily-paineis' && (
            <DailyAndPanelsView
              savedPanels={savedPanels}
              agreements={agreements}
              onSaveAgreement={handleSaveAgreement}
              onUpdateAgreementStatus={handleUpdateAgreementStatus}
              developmentCommitments={developmentCommitments}
              onSaveCommitment={handleSaveCommitment}
              onUpdateCommitmentStatus={handleUpdateCommitmentStatus}
              onToggleActionCompleted={handleToggleActionCompleted}
              onAddEvolutionNote={handleAddEvolutionNote}
              managedProjects={managedProjects}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateTaskProgress={handleUpdateTaskProgress}
              onToggleSubtask={handleToggleSubtask}
              onReportBlock={handleReportBlock}
              currentUser={currentUser}
              formalAlignments={formalAlignments}
              onSaveAlignment={handleSaveAlignment}
              managerialFeedbacks={managerialFeedbacks}
              onSaveFeedback={handleSaveFeedback}
              onConfirmScience={handleConfirmScience}
              onCollectPhysicalSignature={handleCollectPhysicalSignature}
              onCollectManagerSignature={handleCollectManagerSignature}
              onArchivePhysical={handleArchivePhysical}
              onNavigateToAgente={(prompt) => prompt ? handleOpenAgenteWithPrompt(prompt) : handleRouteChange('agente-gerencial')}
              onOpenTicketById={handleNavigateToTicket}
              onUpdatePanel={handleUpdatePanel}
            />
          )}

          {currentRoute === 'templates' && (
            <TemplatesGuideView
              onOpenAgenteForTemplate={(code) => handleOpenAgenteWithPrompt(`Gere um relatório estruturado no modelo ${code} com base nas evidências atuais.`)}
            />
          )}

          {currentRoute === 'configuracoes' && (
            <SettingsView
              currentUser={currentUser}
              isDarkMode={isDarkMode}
              onToggleTheme={handleToggleTheme}
              dataSource={dataSource}
              onToggleDataSource={handleToggleDataSource}
              popSpec={popSpec}
              onUpdatePopSpec={(s) => setPopSpec(s)}
              calculationSettings={calculationSettings}
              onUpdateCalculationSettings={(c) => setCalculationSettings(c)}
              menuConfig={menuConfig}
              onUpdateMenuConfig={handleUpdateMenuConfig}
              feedbackSettings={feedbackSettings}
              onUpdateFeedbackSettings={(s) => setFeedbackSettings(s)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
