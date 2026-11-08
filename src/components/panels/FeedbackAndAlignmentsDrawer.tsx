import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  FileText, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Download, 
  Printer, 
  Eye, 
  ShieldCheck, 
  Archive, 
  TrendingUp, 
  Filter, 
  UserCheck,
  ChevronRight,
  Target
} from 'lucide-react';
import { FormalAlignment, ManagerialFeedback } from '../../types';
import { generateAlignmentPDF, generateFeedbackPDF, getAlignmentDocumentTitle } from '../../utils/pdfGenerator';

interface FeedbackAndAlignmentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alignments: FormalAlignment[];
  feedbacks: ManagerialFeedback[];
  onOpenNewFeedback: () => void;
  onOpenNewAlignment: () => void;
  onPreviewAlignment: (alignment: FormalAlignment) => void;
  onPreviewFeedback: (feedback: ManagerialFeedback) => void;
  onConfirmParticipantScience?: (alignmentId: string, participantId: string | number) => void;
}

export const FeedbackAndAlignmentsDrawer: React.FC<FeedbackAndAlignmentsDrawerProps> = ({
  isOpen,
  onClose,
  alignments,
  feedbacks,
  onOpenNewFeedback,
  onOpenNewAlignment,
  onPreviewAlignment,
  onPreviewFeedback,
  onConfirmParticipantScience
}) => {
  const [activeTab, setActiveTab] = useState<'FEEDBACKS' | 'ALIGNMENTS' | 'SIGNATURES' | 'LONGITUDINAL'>('FEEDBACKS');
  const [selectedCollaboratorFilter, setSelectedCollaboratorFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  // Calculos sintéticos
  const totalFeedbacks = feedbacks.length;
  const collectiveAlignments = alignments.filter(a => a.scope === 'COLETIVO').length;
  
  // Assinaturas pendentes em todos os alinhamentos
  let pendingSignaturesCount = 0;
  alignments.forEach(a => {
    a.participants.forEach(p => {
      if (p.signatureStatus === 'PENDENTE') pendingSignaturesCount++;
    });
  });

  const physicalArchivedCount = [
    ...alignments.filter(a => a.archivingInfo?.isArchivedPhysical),
    ...feedbacks.filter(f => f.archivingInfo?.isArchivedPhysical)
  ].length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-[#134F9F] dark:bg-blue-950 dark:text-blue-300">
                TPL-03 — Gestão Integrada
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Detalhamento Analítico Sob Demanda
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Feedback e Alinhamentos Formais
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desenvolvimento profissional, orientações, reconhecimento e acompanhamento de compromissos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewFeedback}
              type="button"
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Novo Feedback</span>
            </button>

            <button
              onClick={onOpenNewAlignment}
              type="button"
              className="px-3 py-1.5 text-xs font-semibold bg-[#134F9F] hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Novo Alinhamento</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Synthetic Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 shrink-0 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-2xs mb-1">
              <span>Feedbacks Homologados</span>
              <Award className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{totalFeedbacks}</div>
            <div className="text-2xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Ciclos Ativos</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-2xs mb-1">
              <span>Alinhamentos Coletivos</span>
              <Users className="w-3.5 h-3.5 text-[#134F9F] dark:text-blue-400" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{collectiveAlignments}</div>
            <div className="text-2xs text-[#134F9F] dark:text-blue-400 font-semibold mt-0.5">Equipe e Plantão</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-2xs mb-1">
              <span>Assinaturas Pendentes</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{pendingSignaturesCount}</div>
            <div className="text-2xs text-slate-500 mt-0.5">Aguardando Coleta</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-2xs mb-1">
              <span>Arquivo Físico DTI</span>
              <Archive className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{physicalArchivedCount}</div>
            <div className="text-2xs text-slate-500 mt-0.5">Tomos Catalogados</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('FEEDBACKS')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'FEEDBACKS'
                ? 'bg-[#134F9F] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Feedbacks Individuais ({feedbacks.length})
          </button>
          <button
            onClick={() => setActiveTab('ALIGNMENTS')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'ALIGNMENTS'
                ? 'bg-[#134F9F] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Alinhamentos Coletivos & Esporádicos ({alignments.length})
          </button>
          <button
            onClick={() => setActiveTab('SIGNATURES')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'SIGNATURES'
                ? 'bg-[#134F9F] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Assinaturas & Ciência
          </button>
          <button
            onClick={() => setActiveTab('LONGITUDINAL')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'LONGITUDINAL'
                ? 'bg-[#134F9F] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Acompanhamento Longitudinal
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: FEEDBACKS */}
          {activeTab === 'FEEDBACKS' && (
            <div className="space-y-4">
              {feedbacks.map((f) => (
                <div key={f.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                        {f.collaboratorName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {f.collaboratorName}
                          </span>
                          <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {f.feedbackNumber}
                          </span>
                          <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {f.status}
                          </span>
                        </div>
                        <p className="text-2xs text-slate-500">
                          {f.collaboratorRole} · {f.collaboratorDepartment} · Avaliado: {f.periodEvaluated}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPreviewFeedback(f)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors flex items-center gap-1 cursor-pointer"
                        title="Ver documento A4 e assinaturas"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" /> Visualizar
                      </button>
                      <button
                        type="button"
                        onClick={() => generateFeedbackPDF(f, true)}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
                        title="Gerar PDF"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                      <span className="font-bold text-2xs text-emerald-800 dark:text-emerald-300 uppercase block mb-1">
                        Pontos Fortes Registrados ({f.strengths.length})
                      </span>
                      <ul className="space-y-1 text-2xs text-slate-700 dark:text-slate-300">
                        {f.strengths.slice(0, 2).map(s => (
                          <li key={s.id} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold shrink-0">•</span>
                            <span>{s.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900/40">
                      <span className="font-bold text-2xs text-amber-800 dark:text-amber-300 uppercase block mb-1">
                        Oportunidades de Desenvolvimento ({f.developmentPoints.length})
                      </span>
                      <ul className="space-y-1 text-2xs text-slate-700 dark:text-slate-300">
                        {f.developmentPoints.slice(0, 2).map(d => (
                          <li key={d.id} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold shrink-0">•</span>
                            <span>{d.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Metas pactuadas */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-2xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#134F9F] dark:text-blue-400" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {f.developmentGoals.length} Metas Pactuadas
                      </span>
                      <span>·</span>
                      <span>
                        {f.developmentGoals.filter(g => g.status === 'ATINGIDA').length} atingidas no ciclo
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {f.archivingInfo?.isArchivedPhysical ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Arquivado fisicamente ({f.archivingInfo.bookNumber})
                        </span>
                      ) : (
                        <span className="text-slate-400">Pendente de arquivamento físico</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ALIGNMENTS */}
          {activeTab === 'ALIGNMENTS' && (
            <div className="space-y-4">
              {alignments.map((a) => {
                const title = getAlignmentDocumentTitle(a);
                const signedCount = a.participants.filter(p => p.signatureStatus !== 'PENDENTE').length;

                return (
                  <div key={a.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {title}
                          </span>
                          <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-[#134F9F] dark:bg-blue-950 dark:text-blue-300">
                            {a.alignmentNumber}
                          </span>
                          <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {a.scope === 'COLETIVO' ? `Coletivo (${a.participants.length} participantes)` : 'Individual'}
                          </span>
                        </div>
                        <p className="text-2xs text-slate-500 mt-0.5">
                          Assunto: <strong>{a.subject}</strong> · Realizado em: {a.dateTime} ({a.location})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onPreviewAlignment(a)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" /> Visualizar
                        </button>
                        <button
                          type="button"
                          onClick={() => generateAlignmentPDF(a, true)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </div>
                    </div>

                    {/* Participants List */}
                    <div className="space-y-1.5">
                      <span className="text-2xs font-bold uppercase text-slate-400 block">
                        Participantes e Status de Ciência:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {a.participants.map(p => (
                          <div key={p.id} className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-700/60 text-2xs">
                            <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                              <span>{p.name}</span>
                              <span className="font-mono text-slate-400">{p.alignmentRole}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-500 mt-1">
                              <span>{p.presence}</span>
                              <span className={p.signatureStatus !== 'PENDENTE' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                                {p.signatureStatus !== 'PENDENTE' ? '✓ Assinado' : '⏳ Pendente'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Compromissos e Arquivo */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-2xs text-slate-500">
                      <div>
                        <span>{a.generalCommitments.length} compromissos coletivos</span>
                        <span className="mx-2">·</span>
                        <span>{a.decisions.length} deliberações registradas</span>
                      </div>

                      <div className="font-medium">
                        Assinaturas: <strong className="text-slate-700 dark:text-slate-300">{signedCount} de {a.participants.length}</strong> coletadas
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: SIGNATURES */}
          {activeTab === 'SIGNATURES' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300">
                <strong>Rastreabilidade Individual: </strong>Cada participante possui ciência e assinatura independentes. A assinatura digital ou física no formulário confere validade jurídica e comprovação perante auditorias hospitalares.
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Documento</th>
                      <th className="p-3">Participante / Colaborador</th>
                      <th className="p-3">Papel</th>
                      <th className="p-3">Ciência</th>
                      <th className="p-3">Assinatura</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-2xs">
                    {alignments.flatMap(a => 
                      a.participants.map(p => ({
                        alnId: a.id,
                        docNumber: a.alignmentNumber,
                        subject: a.subject,
                        part: p
                      }))
                    ).map(item => (
                      <tr key={`${item.docNumber}-${item.part.id}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-[#134F9F] dark:text-blue-400">
                          {item.docNumber}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900 dark:text-white">{item.part.name}</p>
                          <p className="text-slate-500">{item.part.role}</p>
                        </td>
                        <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                          {item.part.alignmentRole}
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded ${
                            item.part.scienceStatus === 'CIENTE'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {item.part.scienceStatus}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                          {item.part.signatureStatus}
                        </td>
                        <td className="p-3 text-right">
                          {item.part.signatureStatus === 'PENDENTE' && onConfirmParticipantScience ? (
                            <button
                              type="button"
                              onClick={() => onConfirmParticipantScience(item.alnId, item.part.id)}
                              className="px-2 py-1 bg-[#134F9F] text-white hover:bg-blue-700 rounded text-2xs font-semibold cursor-pointer"
                            >
                              Coletar
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-semibold">Validado</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: LONGITUDINAL */}
          {activeTab === 'LONGITUDINAL' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                Acompanhamento contínuo da evolução profissional entre ciclos de alinhamentos e feedbacks formais.
              </div>

              {/* Exemplo Mariana Costa */}
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#134F9F] text-white flex items-center justify-center font-bold text-xs">
                      MC
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">Mariana Costa</h4>
                      <p className="text-2xs text-slate-500">Analista Sênior de Sistemas Clínicos (Tasy)</p>
                    </div>
                  </div>
                  <span className="text-2xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Evolução Positiva (+92% metas cumpridas)
                  </span>
                </div>

                <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-700 pl-3 ml-2 text-xs">
                  <div className="relative">
                    <span className="text-2xs font-bold text-slate-400">03/11/2026 — ALN-2026-090</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Reconhecimento Formal por Atuação de Destaque no Incidente do Banco Analítico</p>
                    <p className="text-2xs text-slate-500">Elogio funcional e assentamento em prontuário profissional.</p>
                  </div>
                  <div className="relative pt-2">
                    <span className="text-2xs font-bold text-slate-400">02/11/2026 — FDB-2026-042</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Feedback Periódico Mensal Homologado</p>
                    <p className="text-2xs text-slate-500">Meta anterior atingida (Tablespace 100GB). Nova meta pactuada: Follow-ups até 17h.</p>
                  </div>
                </div>
              </div>

              {/* Exemplo Lucas Mendes */}
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                      LM
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">Lucas Mendes</h4>
                      <p className="text-2xs text-slate-500">Analista de Suporte Presencial N1/N2</p>
                    </div>
                  </div>
                  <span className="text-2xs font-bold px-2 py-1 rounded bg-blue-100 text-[#134F9F] dark:bg-blue-950 dark:text-blue-300">
                    Acompanhamento em Andamento
                  </span>
                </div>

                <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-700 pl-3 ml-2 text-xs">
                  <div className="relative">
                    <span className="text-2xs font-bold text-slate-400">06/11/2026 — ALN-2026-088</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Alinhamento Coletivo de Passagem de Plantão e Escala</p>
                    <p className="text-2xs text-slate-500">Compromisso individual assumido: rondas nas 3 UTIs às 14h, 18h e 22h com rádio HT.</p>
                  </div>
                  <div className="relative pt-2">
                    <span className="text-2xs font-bold text-slate-400">28/10/2026 — ALN-2026-089</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Orientação de Conduta e Atendimento Humanizado</p>
                    <p className="text-2xs text-emerald-600 font-semibold">Meta de curso de Comunicação Não-Violenta CUMPRIDA em 04/11.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
