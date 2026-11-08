import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Archive,
  UserCheck,
  Check
} from 'lucide-react';
import { FormalAlignment, ManagerialFeedback } from '../../types';
import { generateAlignmentPDF, generateFeedbackPDF, getAlignmentDocumentTitle } from '../../utils/pdfGenerator';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'ALIGNMENT' | 'FEEDBACK';
  alignment?: FormalAlignment | null;
  feedback?: ManagerialFeedback | null;
  onConfirmScience?: (documentId: string, participantId: string | number) => void;
  onArchivePhysical?: (documentId: string, bookNumber: string, physicalLocation: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentType,
  alignment,
  feedback,
  onConfirmScience,
  onArchivePhysical
}) => {
  const [activeTab, setActiveTab] = useState<'DOCUMENT' | 'ARCHIVING' | 'SIGNATURES'>('DOCUMENT');
  const [bookNumberInput, setBookNumberInput] = useState(
    alignment?.archivingInfo?.bookNumber || feedback?.archivingInfo?.bookNumber || 'Livro de Registros DTI — Tomo 03/2026'
  );
  const [locationInput, setLocationInput] = useState(
    alignment?.archivingInfo?.physicalLocation || feedback?.archivingInfo?.physicalLocation || 'Arquivo Geral DTI / Pasta 14-C'
  );
  const [archiveSuccess, setArchiveSuccess] = useState(false);

  if (!isOpen) return null;

  const docNumber = documentType === 'ALIGNMENT' ? alignment?.alignmentNumber : feedback?.feedbackNumber;
  const docTitle = documentType === 'ALIGNMENT' && alignment 
    ? getAlignmentDocumentTitle(alignment) 
    : 'TERMO DE FEEDBACK E DESENVOLVIMENTO INDIVIDUAL';

  const handleDownloadPDF = () => {
    if (documentType === 'ALIGNMENT' && alignment) {
      generateAlignmentPDF(alignment, true);
    } else if (documentType === 'FEEDBACK' && feedback) {
      generateFeedbackPDF(feedback, true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveArchive = (e: React.FormEvent) => {
    e.preventDefault();
    if (onArchivePhysical && docNumber) {
      onArchivePhysical(docNumber, bookNumberInput, locationInput);
      setArchiveSuccess(true);
      setTimeout(() => setArchiveSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none">
        
        {/* Header - Hidden on print */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#134F9F]/10 dark:bg-blue-500/20 text-[#134F9F] dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-[#134F9F] dark:bg-blue-950 dark:text-blue-300">
                  {docNumber}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {documentType === 'ALIGNMENT' ? 'Alinhamento Formal' : 'Feedback Individual'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                {docTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Imprimir documento em folha A4"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Imprimir A4</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Gerar e baixar PDF institucional"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Gerar PDF</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Hidden on print */}
        <div className="px-5 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-4 shrink-0 print:hidden text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('DOCUMENT')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'DOCUMENT'
                  ? 'bg-[#134F9F] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Documento Formatado (A4)
            </button>
            <button
              onClick={() => setActiveTab('SIGNATURES')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'SIGNATURES'
                  ? 'bg-[#134F9F] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Quadro de Assinaturas & Ciência
            </button>
            <button
              onClick={() => setActiveTab('ARCHIVING')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'ARCHIVING'
                  ? 'bg-[#134F9F] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Registro de Arquivamento Físico
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-500 text-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Auditoria e rastreabilidade HEAL Ops ativas</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/60 print:p-0 print:bg-white">
          
          {activeTab === 'DOCUMENT' && (
            <div className="max-w-[760px] mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 sm:p-8 shadow-sm print:border-none print:shadow-none print:p-0 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-sans">
              
              {/* Institutional Header */}
              <div className="border-b-2 border-[#134F9F] pb-4 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#134F9F] text-white flex items-center justify-center font-bold text-sm tracking-wider">
                      HEAL
                    </div>
                    <div>
                      <h1 className="text-xs sm:text-sm font-bold text-[#134F9F] tracking-wide uppercase">
                        Instituto HEAL — Gestão Hospitalar & Saúde Assistencial
                      </h1>
                      <p className="text-2xs sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Diretoria de Tecnologia da Informação — DTI | Núcleo de Governança Operacional
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {docNumber}
                    </span>
                    <p className="text-2xs text-slate-400 mt-1">Via Oficial de Registro</p>
                  </div>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center mb-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  {docTitle}
                </h2>
                {documentType === 'ALIGNMENT' && alignment && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                    Assunto: {alignment.subject}
                  </p>
                )}
                {documentType === 'FEEDBACK' && feedback && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                    Colaborador: {feedback.collaboratorName} ({feedback.collaboratorRole}) — Período: {feedback.periodEvaluated}
                  </p>
                )}
              </div>

              {/* Metadata Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 text-xs">
                <div>
                  <span className="block text-2xs font-semibold text-slate-500 uppercase">Data e Hora</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {documentType === 'ALIGNMENT' ? alignment?.dateTime : feedback?.feedbackDate}
                  </span>
                </div>
                <div>
                  <span className="block text-2xs font-semibold text-slate-500 uppercase">Local / Meio</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {documentType === 'ALIGNMENT' ? alignment?.location : 'Presencial / Gabinete DTI'}
                  </span>
                </div>
                <div>
                  <span className="block text-2xs font-semibold text-slate-500 uppercase">Gestor Condutor</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {documentType === 'ALIGNMENT' ? alignment?.managerName : feedback?.managerName}
                  </span>
                </div>
                {documentType === 'ALIGNMENT' && alignment && (
                  <>
                    <div>
                      <span className="block text-2xs font-semibold text-slate-500 uppercase">Escopo</span>
                      <span className="font-medium text-[#134F9F] dark:text-blue-400">
                        {alignment.scope === 'COLETIVO' ? 'Coletivo (Múltiplos Participantes)' : 'Individual'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-2xs font-semibold text-slate-500 uppercase">Periodicidade</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {alignment.periodicity === 'PERIODICO_MENSAL' ? 'Periódico Mensal' : 'Esporádico / Pontual'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-2xs font-semibold text-slate-500 uppercase">Status</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {alignment.status}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Alignment Document Details */}
              {documentType === 'ALIGNMENT' && alignment && (
                <div className="space-y-6">
                  {/* 1. Participantes */}
                  <div>
                    <h3 className="text-xs font-bold text-[#134F9F] dark:text-blue-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1 mb-2.5">
                      1. Participantes do Alinhamento ({alignment.participants.length})
                    </h3>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
                      <table className="w-full text-left text-2xs sm:text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-2">Nome Completo</th>
                            <th className="p-2">Cargo / Área</th>
                            <th className="p-2">Papel</th>
                            <th className="p-2">Ciência</th>
                            <th className="p-2 text-right">Assinatura</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {alignment.participants.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <td className="p-2 font-medium text-slate-900 dark:text-slate-100">{p.name}</td>
                              <td className="p-2 text-slate-600 dark:text-slate-300">{p.role} · {p.department}</td>
                              <td className="p-2 text-slate-600 dark:text-slate-400 font-mono text-2xs">{p.alignmentRole}</td>
                              <td className="p-2">
                                <span className={`inline-flex items-center gap-1 text-2xs font-semibold px-1.5 py-0.5 rounded ${
                                  p.scienceStatus === 'CIENTE'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                }`}>
                                  {p.scienceStatus === 'CIENTE' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                  {p.scienceStatus}
                                </span>
                              </td>
                              <td className="p-2 text-right">
                                <span className="font-mono text-2xs text-slate-500">
                                  {p.signatureStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. Contexto e Objetivos */}
                  <div>
                    <h3 className="text-xs font-bold text-[#134F9F] dark:text-blue-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                      2. Contexto e Objetivos
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Objetivo: </strong>{alignment.objective}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Contexto: </strong>{alignment.context}
                    </p>
                  </div>

                  {/* 3. Fatos e Orientações */}
                  <div>
                    <h3 className="text-xs font-bold text-[#134F9F] dark:text-blue-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">
                      3. Fatos Observados e Diretrizes Transmitidas
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                        <span className="block text-2xs font-bold text-slate-500 uppercase mb-1">Fatos e Situações Observadas</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {alignment.observedFactsOrSituations || 'Sem anotações de inconformidade.'}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded border border-blue-100 dark:border-blue-900/40">
                        <span className="block text-2xs font-bold text-[#134F9F] dark:text-blue-400 uppercase mb-1">Diretrizes e Orientações Transmitidas</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {alignment.transmittedOrientations}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4. Tabela de Compromissos */}
                  <div>
                    <h3 className="text-xs font-bold text-[#134F9F] dark:text-blue-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1 mb-2.5">
                      4. Quadro de Compromissos e Prazos Firmados
                    </h3>
                    <div className="space-y-2">
                      {alignment.generalCommitments.map((gc) => (
                        <div key={gc.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <span className="inline-block text-2xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#134F9F] dark:bg-blue-950 dark:text-blue-300 mr-2">
                              Geral / Coletivo
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{gc.description}</span>
                            <div className="text-2xs text-slate-500 mt-1">
                              Critério de Êxito: {gc.successCriteria}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-2xs font-bold text-slate-500 block">Prazo: {gc.deadline}</span>
                            <span className="text-2xs text-slate-600 dark:text-slate-400">Resp: {gc.responsibleName}</span>
                          </div>
                        </div>
                      ))}

                      {alignment.individualCommitments.map((ic) => (
                        <div key={ic.commitment.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <span className="inline-block text-2xs font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 mr-2">
                              Individual · {ic.participantName}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{ic.commitment.description}</span>
                            <div className="text-2xs text-slate-500 mt-1">
                              Critério de Êxito: {ic.commitment.successCriteria}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-2xs font-bold text-slate-500 block">Prazo: {ic.commitment.deadline}</span>
                            <span className="text-2xs text-slate-600 dark:text-slate-400">Resp: {ic.commitment.responsibleName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Manifestações Individuais */}
                  {alignment.participants.some(p => p.individualStatement) && (
                    <div>
                      <h3 className="text-xs font-bold text-[#134F9F] dark:text-blue-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1 mb-2.5">
                        5. Manifestações Individuais dos Participantes
                      </h3>
                      <div className="space-y-2">
                        {alignment.participants.filter(p => p.individualStatement).map(p => (
                          <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded border border-slate-200 dark:border-slate-800 text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              {p.name} ({p.role}):
                            </span>
                            <p className="italic text-slate-600 dark:text-slate-400">
                              "{p.individualStatement}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Bloco de Assinaturas */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-bold text-[#134F9F] dark:text-blue-400 uppercase tracking-wide mb-4 text-center">
                      6. Termo de Ciência e Assinaturas
                    </h3>
                    <p className="text-2xs text-slate-500 text-center mb-8 max-w-xl mx-auto leading-relaxed">
                      Declaramos para todos os efeitos que participamos do alinhamento formal acima identificado, tomamos ciência de suas diretrizes e assumimos os compromissos pactuados.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                      {/* Gestor */}
                      <div className="text-center">
                        <div className="border-t border-slate-400 dark:border-slate-600 pt-2 mx-auto max-w-[240px]">
                          <p className="font-bold text-xs text-slate-900 dark:text-white">{alignment.managerName}</p>
                          <p className="text-2xs text-slate-500">{alignment.managerRole} — Condutor</p>
                          <span className="inline-block mt-1 text-2xs text-emerald-600 dark:text-emerald-400 font-mono">
                            [Homologado no Portal]
                          </span>
                        </div>
                      </div>

                      {/* Participantes */}
                      {alignment.participants.map((p) => (
                        <div key={p.id} className="text-center">
                          <div className="border-t border-slate-400 dark:border-slate-600 pt-2 mx-auto max-w-[240px]">
                            <p className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</p>
                            <p className="text-2xs text-slate-500">{p.role} — {p.department}</p>
                            <span className="inline-block mt-1 text-2xs font-mono">
                              {p.signatureStatus === 'ASSINADO_DIGITAL' ? (
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  ✓ Assinado Digitalmente ({p.signatureDate})
                                </span>
                              ) : p.signatureStatus === 'ASSINADO_FISICO' ? (
                                <span className="text-blue-600 dark:text-blue-400">
                                  ✓ Assinatura Física Coletada
                                </span>
                              ) : (
                                <span className="text-amber-600 dark:text-amber-400">
                                  ⏳ Pendente de Coleta
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Document Details */}
              {documentType === 'FEEDBACK' && feedback && (
                <div className="space-y-6">
                  {/* 1. Pontos Fortes */}
                  <div>
                    <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1 mb-2.5">
                      1. Pontos Fortes e Reconhecimento
                    </h3>
                    <div className="space-y-2">
                      {feedback.strengths.map((str) => (
                        <div key={str.id} className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded border border-emerald-100 dark:border-emerald-900/40 text-xs">
                          <strong className="text-emerald-900 dark:text-emerald-300 block mb-0.5">
                            {str.title}
                          </strong>
                          <p className="text-slate-700 dark:text-slate-300">{str.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Pontos de Desenvolvimento */}
                  <div>
                    <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1 mb-2.5">
                      2. Oportunidades de Desenvolvimento e Pontos de Atenção
                    </h3>
                    <div className="space-y-2">
                      {feedback.developmentPoints.map((dp) => (
                        <div key={dp.id} className="p-3 bg-amber-50/40 dark:bg-amber-950/20 rounded border border-amber-100 dark:border-amber-900/40 text-xs">
                          <strong className="text-amber-900 dark:text-amber-300 block mb-0.5">
                            {dp.title}
                          </strong>
                          <p className="text-slate-700 dark:text-slate-300">{dp.description}</p>
                          {dp.operationalImpact && (
                            <p className="text-2xs text-slate-500 mt-1 italic">
                              Impacto Operacional: {dp.operationalImpact}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Avaliação Gerencial */}
                  <div>
                    <h3 className="text-xs font-bold text-[#134F9F] dark:text-blue-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1 mb-2.5">
                      3. Critérios de Avaliação Gerencial
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {feedback.managerialEvaluation.collaboration && (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                          <span className="text-2xs font-bold text-slate-500 uppercase block">Colaboração & Equipe</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{feedback.managerialEvaluation.collaboration}</span>
                        </div>
                      )}
                      {feedback.managerialEvaluation.communication && (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                          <span className="text-2xs font-bold text-slate-500 uppercase block">Comunicação Assistencial</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{feedback.managerialEvaluation.communication}</span>
                        </div>
                      )}
                      {feedback.managerialEvaluation.organization && (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                          <span className="text-2xs font-bold text-slate-500 uppercase block">Organização & Documentação</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{feedback.managerialEvaluation.organization}</span>
                        </div>
                      )}
                      {feedback.managerialEvaluation.posture && (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800">
                          <span className="text-2xs font-bold text-slate-500 uppercase block">Postura Profissional</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{feedback.managerialEvaluation.posture}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. Metas Individuais de Desenvolvimento */}
                  <div>
                    <h3 className="text-xs font-bold text-[#134F9F] dark:text-blue-400 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-1 mb-2.5">
                      4. Metas Individuais de Desenvolvimento e Prazos
                    </h3>
                    <div className="space-y-2">
                      {feedback.developmentGoals.map((goal, idx) => (
                        <div key={goal.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-800 text-xs">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white">
                              Meta {idx + 1}: {goal.objective}
                            </span>
                            <span className={`text-2xs font-bold px-1.5 py-0.5 rounded ${
                              goal.status === 'ATINGIDA' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-blue-100 text-[#134F9F] dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {goal.status}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mb-1">Alvo: {goal.target} · Prazo: {goal.deadline}</p>
                          <p className="text-2xs text-slate-500 italic">Evidência: {goal.expectedEvidences}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assinaturas */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-2 gap-8 text-center pt-4">
                      <div>
                        <div className="border-t border-slate-400 dark:border-slate-600 pt-2 mx-auto max-w-[220px]">
                          <p className="font-bold text-xs text-slate-900 dark:text-white">{feedback.managerName}</p>
                          <p className="text-2xs text-slate-500">{feedback.managerRole} — Gestor</p>
                        </div>
                      </div>
                      <div>
                        <div className="border-t border-slate-400 dark:border-slate-600 pt-2 mx-auto max-w-[220px]">
                          <p className="font-bold text-xs text-slate-900 dark:text-white">{feedback.collaboratorName}</p>
                          <p className="text-2xs text-slate-500">{feedback.collaboratorRole} — Colaborador</p>
                          {feedback.collaboratorSignedScience && (
                            <span className="text-2xs text-emerald-600 dark:text-emerald-400 block mt-0.5">
                              ✓ Ciente e assinado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Institutional Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-2xs text-slate-400 flex items-center justify-between">
                <span>HEAL Ops · Protocolo de Governança DTI v1.1</span>
                <span>Documento emitido pelo Portal de Gestão Operacional HEAL</span>
              </div>
            </div>
          )}

          {activeTab === 'SIGNATURES' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                  Quadro de Assinaturas e Confirmação de Ciência
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Controle individual de assinaturas. A confirmação de um participante é estritamente pessoal e não substitui a dos demais.
                </p>

                {documentType === 'ALIGNMENT' && alignment && (
                  <div className="space-y-3">
                    {/* Gestor */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#134F9F] text-white flex items-center justify-center font-bold text-xs">
                          HV
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{alignment.managerName}</p>
                          <p className="text-2xs text-slate-500">{alignment.managerRole} (Condutor / Gestor)</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Assinado & Homologado
                      </span>
                    </div>

                    {/* Participantes */}
                    {alignment.participants.map((p) => (
                      <div key={p.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                            {p.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</p>
                            <p className="text-2xs text-slate-500">{p.role} · {p.department} ({p.alignmentRole})</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {p.signatureStatus !== 'PENDENTE' ? (
                            <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              <Check className="w-3 h-3" /> {p.signatureStatus}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-2xs text-amber-600 dark:text-amber-400 font-semibold">
                                Pendente
                              </span>
                              {onConfirmScience && (
                                <button
                                  type="button"
                                  onClick={() => onConfirmScience(alignment.id, p.id)}
                                  className="px-2.5 py-1 text-2xs font-semibold bg-[#134F9F] text-white hover:bg-blue-700 rounded transition-colors cursor-pointer"
                                >
                                  Assinar Ciência
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ARCHIVING' && (
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm mb-1">
                <Archive className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                Registro de Arquivamento Físico do Documento Assinado
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Após coletar as assinaturas físicas em papel A4, registre a localização no livro de tomos e gaveta do arquivo DTI para fins de auditoria institucional.
              </p>

              {archiveSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Arquivamento físico registrado com sucesso no catálogo institucional.
                </div>
              )}

              <form onSubmit={handleSaveArchive} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Livro ou Tomo de Registro
                  </label>
                  <input
                    type="text"
                    value={bookNumberInput}
                    onChange={(e) => setBookNumberInput(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#134F9F]"
                    placeholder="Ex: Livro de Alinhamentos e Plantões DTI — Tomo 03/2026"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Localização Física / Armário / Pasta
                  </label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#134F9F]"
                    placeholder="Ex: Armário DTI Sala 102 / Gaveta 04 / Pasta Funcional"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-2xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <Building2 className="w-3.5 h-3.5" />
                    Guarda Documental Conforme Regulamento HEAL
                  </div>
                  <p>Prazo mínimo de guarda em arquivo ativo: 5 anos. Sujeito à inspeção por auditorias de certificação hospitalar ONA / Qmentum.</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#134F9F] text-white hover:bg-blue-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Salvar Registro de Arquivo
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
