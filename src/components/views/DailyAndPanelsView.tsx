/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Daily e Painéis (Biblioteca & Histórico de Artefatos Gerados)
 * REGRA MANDATÓRIA: Exclusivamente catálogo e visualização dos painéis homologados.
 * Criação sob demanda é realizada estritamente pelo Agente Gerencial.
 * UX: SINTÉTICO PRIMEIRO, ANALÍTICO SOB DEMANDA (Desktop Zero-Scroll).
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Sparkles, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft,
  Printer,
  FileText,
  Info,
  Presentation,
  Edit3,
  Layers,
  FolderKanban,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { ArtifactPanel, MeetingAgreement, AgreementStatus, CurrentUser } from '../../types';
import { TemplateSyntheticDashboard } from '../panels/TemplateSyntheticDashboard';
import { TemplateDetailDrawer } from '../panels/TemplateDetailDrawer';
import { PresentationModeModal } from '../panels/PresentationModeModal';
import { HumanReviewModal } from '../panels/HumanReviewModal';
import { RegisterAgreementModal } from '../panels/RegisterAgreementModal';
import { AgreementsTrackingDrawer } from '../panels/AgreementsTrackingDrawer';

interface DailyAndPanelsViewProps {
  savedPanels: ArtifactPanel[];
  agreements?: MeetingAgreement[];
  onSaveAgreement?: (newAgreement: MeetingAgreement) => void;
  onUpdateAgreementStatus?: (agreementId: string, newStatus: AgreementStatus, note?: string) => void;
  currentUser?: CurrentUser | null;
  onNavigateToAgente: (prefillPrompt?: string) => void;
  onOpenTicketById: (ticketId: number) => void;
  onUpdatePanel?: (updatedPanel: ArtifactPanel) => void;
}

export const DailyAndPanelsView: React.FC<DailyAndPanelsViewProps> = ({
  savedPanels,
  agreements = [],
  onSaveAgreement = () => {},
  onUpdateAgreementStatus = () => {},
  currentUser,
  onNavigateToAgente,
  onOpenTicketById,
  onUpdatePanel
}) => {
  const [selectedPanel, setSelectedPanel] = useState<ArtifactPanel | null>(null);
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modais e gavetas
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isRegisterAgreementOpen, setIsRegisterAgreementOpen] = useState<boolean>(false);
  const [isAgreementsTrackingOpen, setIsAgreementsTrackingOpen] = useState<boolean>(false);
  const [activePanelForModal, setActivePanelForModal] = useState<ArtifactPanel | null>(null);

  const filteredPanels = savedPanels.filter(p => {
    if (templateFilter !== 'all' && p.templateType !== templateFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchOwner = p.ownerName.toLowerCase().includes(q);
      const matchRef = p.referenceDate.toLowerCase().includes(q);
      if (!matchTitle && !matchOwner && !matchRef) return false;
    }
    return true;
  });

  const [catalogPage, setCatalogPage] = useState<number>(1);
  const pageSize = 6;
  const totalPages = Math.ceil(filteredPanels.length / pageSize) || 1;
  const paginatedPanels = filteredPanels.slice((catalogPage - 1) * pageSize, catalogPage * pageSize);

  const handleOpenPresentationForPanel = (panel: ArtifactPanel) => {
    setActivePanelForModal(panel);
    setIsPresentationOpen(true);
  };

  const handleOpenDetailForPanel = (panel: ArtifactPanel) => {
    setActivePanelForModal(panel);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenReviewForPanel = (panel: ArtifactPanel) => {
    setActivePanelForModal(panel);
    setIsReviewModalOpen(true);
  };

  const handleSaveReviewed = (reviewed: ArtifactPanel) => {
    if (onUpdatePanel) {
      onUpdatePanel(reviewed);
    }
    if (selectedPanel && selectedPanel.id === reviewed.id) {
      setSelectedPanel(reviewed);
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'TPL-01': return FileSpreadsheet;
      case 'TPL-02': return Layers;
      case 'TPL-03': return User;
      case 'TPL-04': return FolderKanban;
      default: return FileSpreadsheet;
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 overflow-hidden gap-2.5">
      {/* SE NÃO HOUVER PAINEL SELECIONADO: EXIBIR O CATÁLOGO (NÍVEL 1 SINTÉTICO) */}
      {!selectedPanel ? (
        <div className="flex-1 min-h-0 flex flex-col justify-between gap-2.5 overflow-hidden">
          {/* Banner de Governança da Biblioteca */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2.5 shadow-xs shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#134F9F] dark:text-blue-400" />
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  Catálogo Oficial de Painéis e Dailies Operacionais
                </h2>
                <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-[#134F9F] dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                  HEAL Ops 1.1
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Artefatos gerenciais padronizados (TPL-01 a TPL-04) · Sintético primeiro, analítico sob demanda
              </p>
            </div>

            {/* Ação: Gerar Novo Painel no Agente Gerencial */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-400">
                Novo painel sob demanda?
              </span>
              <button
                type="button"
                onClick={() => onNavigateToAgente()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Solicitar ao Agente Gerencial</span>
              </button>
            </div>
          </div>

          {/* Barra de Filtros e Busca do Catálogo */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2">
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Buscar por título, autor ou data..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCatalogPage(1);
                  }}
                  className="w-full text-xs pl-8 pr-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={templateFilter}
                onChange={(e) => {
                  setTemplateFilter(e.target.value);
                  setCatalogPage(1);
                }}
                className="text-xs px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">Todos os Modelos (TPL-01 a TPL-04)</option>
                <option value="TPL-01">TPL-01 — Daily Operacional</option>
                <option value="TPL-02">TPL-02 — Alinhamento Semanal</option>
                <option value="TPL-03">TPL-03 — Feedback Individual</option>
                <option value="TPL-04">TPL-04 — Gestão de Projetos</option>
              </select>
            </div>

            <div className="text-slate-400 text-[11px] font-mono">
              {filteredPanels.length} artefatos disponíveis
            </div>
          </div>

          {/* GRADE DE ARTEFATOS DO CATÁLOGO (COM AS 3 AÇÕES: VISUALIZAR, APRESENTAR, DETALHAR) */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 overflow-hidden">
            {paginatedPanels.map(panel => {
              const Icon = getTemplateIcon(panel.templateType);
              return (
                <div
                  key={panel.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-blue-500/50 transition-all group shadow-2xs hover:shadow-sm"
                >
                  <div>
                    {/* Topline do Card: Tipo de Template, Status e Fonte */}
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-[#134F9F] dark:text-blue-400" />
                        <span className="font-mono font-bold text-[#134F9F] dark:text-blue-400">
                          {panel.templateType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          panel.status === 'APROVADO'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}>
                          {panel.status === 'APROVADO' ? 'HOMOLOGADO' : 'RASCUNHO'}
                        </span>
                        <span className="font-mono text-slate-400 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {panel.source}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {panel.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 italic">
                      "{panel.summary.headline}"
                    </p>

                    {/* Metadados: Data de Referência e Atualização */}
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div>
                        <span>Referência:</span>
                        <strong className="block text-slate-700 dark:text-slate-300 font-mono truncate">{panel.referenceDate}</strong>
                      </div>
                      <div>
                        <span>Última Atualização:</span>
                        <strong className="block text-slate-700 dark:text-slate-300 font-mono truncate">{panel.generationDate.split(' ')[0]}</strong>
                      </div>
                    </div>
                  </div>

                  {/* AS 3 AÇÕES EXPLICITAS CONFORME ITEM 5: VISUALIZAR, APRESENTAR, DETALHAR */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedPanel(panel)}
                      className="inline-flex items-center justify-center gap-1 py-1 px-1.5 text-xs font-semibold text-[#134F9F] dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded transition-colors cursor-pointer"
                      title="Visualizar Painel Sintético"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visualizar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPresentationForPanel(panel)}
                      className="inline-flex items-center justify-center gap-1 py-1 px-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded transition-colors shadow-2xs cursor-pointer"
                      title="Modo Apresentação Executivo"
                    >
                      <Presentation className="w-3.5 h-3.5" />
                      <span>Apresentar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDetailForPanel(panel)}
                      className="inline-flex items-center justify-center gap-1 py-1 px-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                      title="Detalhar Evidências Analíticas"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Detalhar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RODAPÉ DE PAGINAÇÃO DA BIBLIOTECA */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex items-center justify-between text-xs text-slate-500 shadow-2xs shrink-0">
            <div>
              Mostrando <strong className="font-mono text-slate-900 dark:text-slate-100">{paginatedPanels.length}</strong> de <strong className="font-mono">{filteredPanels.length}</strong> artefatos homologados
            </div>

            <div className="flex items-center gap-2">
              <span>
                Página <strong className="font-mono text-slate-900 dark:text-slate-100">{catalogPage}</strong> de <strong className="font-mono">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={catalogPage <= 1}
                  onClick={() => setCatalogPage(p => Math.max(1, p - 1))}
                  className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
                >
                  ←
                </button>
                <button
                  type="button"
                  disabled={catalogPage >= totalPages}
                  onClick={() => setCatalogPage(p => Math.min(totalPages, p + 1))}
                  className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-xs disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VISUALIZAÇÃO SINTÉTICA EXECUTIVA DO PAINEL SELECIONADO (ZERO-SCROLL) */
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <TemplateSyntheticDashboard
            panel={selectedPanel}
            agreements={agreements}
            onOpenPresentation={() => {
              setActivePanelForModal(selectedPanel);
              setIsPresentationOpen(true);
            }}
            onOpenDetailDrawer={() => {
              setActivePanelForModal(selectedPanel);
              setIsDetailDrawerOpen(true);
            }}
            onOpenHumanReview={() => {
              setActivePanelForModal(selectedPanel);
              setIsReviewModalOpen(true);
            }}
            onOpenRegisterAgreement={() => {
              setActivePanelForModal(selectedPanel);
              setIsRegisterAgreementOpen(true);
            }}
            onOpenAgreementsTracking={() => {
              setActivePanelForModal(selectedPanel);
              setIsAgreementsTrackingOpen(true);
            }}
            onBackToCatalog={() => setSelectedPanel(null)}
            onOpenTicketById={onOpenTicketById}
          />
        </div>
      )}

      {/* MODAL MODO APRESENTAÇÃO EXECUTIVO */}
      {isPresentationOpen && activePanelForModal && (
        <PresentationModeModal
          panel={activePanelForModal}
          agreements={agreements}
          isOpen={isPresentationOpen}
          onClose={() => setIsPresentationOpen(false)}
          onOpenTicketById={onOpenTicketById}
          onOpenRegisterAgreement={() => setIsRegisterAgreementOpen(true)}
          onOpenAgreementsTracking={() => setIsAgreementsTrackingOpen(true)}
          onUpdateAgreementStatus={onUpdateAgreementStatus}
        />
      )}

      {/* DRAWER ANALÍTICO SOB DEMANDA */}
      {isDetailDrawerOpen && activePanelForModal && (
        <TemplateDetailDrawer
          isOpen={isDetailDrawerOpen}
          onClose={() => setIsDetailDrawerOpen(false)}
          panel={activePanelForModal}
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
      {isReviewModalOpen && activePanelForModal && (
        <HumanReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          panel={activePanelForModal}
          currentUser={currentUser}
          onSaveReviewedPanel={handleSaveReviewed}
        />
      )}

      {/* MODAL DE REGISTRO DE ACORDO (+ Registrar acordo) */}
      {isRegisterAgreementOpen && activePanelForModal && (
        <RegisterAgreementModal
          isOpen={isRegisterAgreementOpen}
          onClose={() => setIsRegisterAgreementOpen(false)}
          sourceMeetingType={activePanelForModal.templateType === 'TPL-02' ? 'ALINHAMENTO_SEMANAL' : 'DAILY'}
          sourceArtifactId={activePanelForModal.id}
          meetingReferenceDate={activePanelForModal.referenceDate}
          currentUser={currentUser}
          onSaveAgreement={onSaveAgreement}
        />
      )}

      {/* DRAWER ANALÍTICO DE ACOMPANHAMENTO DE ACORDOS */}
      {isAgreementsTrackingOpen && activePanelForModal && (
        <AgreementsTrackingDrawer
          isOpen={isAgreementsTrackingOpen}
          onClose={() => setIsAgreementsTrackingOpen(false)}
          agreements={agreements}
          sourceMeetingType={activePanelForModal.templateType === 'TPL-02' ? 'ALINHAMENTO_SEMANAL' : 'DAILY'}
          meetingReferenceDate={activePanelForModal.referenceDate}
          onOpenRegisterModal={() => {
            setIsAgreementsTrackingOpen(false);
            setIsRegisterAgreementOpen(true);
          }}
          onUpdateAgreementStatus={onUpdateAgreementStatus}
          onOpenTicketById={onOpenTicketById}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
