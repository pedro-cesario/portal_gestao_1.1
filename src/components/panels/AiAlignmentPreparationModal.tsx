import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Printer, 
  Download, 
  User, 
  Users, 
  MessageSquare, 
  Target, 
  AlertCircle, 
  Check, 
  Plus, 
  Trash2, 
  Edit3,
  HelpCircle,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';
import { 
  FormalAlignment, 
  AlignmentParticipant, 
  AlignmentCategory, 
  AlignmentTone, 
  AlignmentAiPreparationResult,
  ProposedGoalDraft
} from '../../types';
import { MOCK_TECHNICIANS } from '../../data/mockData';
import { 
  generateAiAlignmentPreparation, 
  TONE_CONFIG, 
  CATEGORY_LABELS 
} from '../../utils/alignmentAiService';
import { generateAlignmentPDF } from '../../utils/pdfGenerator';

interface AiAlignmentPreparationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAlignment: (alignment: FormalAlignment) => void;
  onPreviewAlignment: (alignment: FormalAlignment) => void;
  currentUser?: { name: string; role: string; id: string | number } | null;
}

export const AiAlignmentPreparationModal: React.FC<AiAlignmentPreparationModalProps> = ({
  isOpen,
  onClose,
  onSaveAlignment,
  onPreviewAlignment,
  currentUser
}) => {
  // Controle de etapas: 1 a 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ETAPA 1: Anotações Livres do Gestor
  const [selectedTechIds, setSelectedTechIds] = useState<number[]>([101]); // Mariana Costa default
  const [scope, setScope] = useState<'INDIVIDUAL' | 'COLETIVO'>('INDIVIDUAL');
  const [category, setCategory] = useState<AlignmentCategory>('ORIENTACAO_CONDUTA');
  const [primaryObjective, setPrimaryObjective] = useState('');
  const [spontaneousStrengths, setSpontaneousStrengths] = useState('');
  const [spontaneousDevPoints, setSpontaneousDevPoints] = useState('');
  const [spontaneousContext, setSpontaneousContext] = useState('');
  const [previousCommitments, setPreviousCommitments] = useState('');
  const [includeGlpiMetrics, setIncludeGlpiMetrics] = useState(true);

  // ETAPA 2: Preparação com IA & Seletor de Tom
  const [selectedTone, setSelectedTone] = useState<AlignmentTone>('EQUILIBRADO_PROFISSIONAL');
  const [aiResult, setAiResult] = useState<AlignmentAiPreparationResult | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Editáveis da Minuta da IA
  const [editedSubject, setEditedSubject] = useState('');
  const [editedObjective, setEditedObjective] = useState('');
  const [editedContext, setEditedContext] = useState('');
  const [editedFacts, setEditedFacts] = useState('');
  const [editedOrientations, setEditedOrientations] = useState('');
  const [editableGoals, setEditableGoals] = useState<ProposedGoalDraft[]>([]);

  // ETAPA 3: Condução ao Vivo
  const [checkedScriptSteps, setCheckedScriptSteps] = useState<Record<number, boolean>>({});
  const [liveMeetingNotes, setLiveMeetingNotes] = useState('');
  const [liveParticipantStatements, setLiveParticipantStatements] = useState<Record<number, string>>({});
  const [meetingStartTime] = useState<Date>(new Date());

  // ETAPA 4: Registro Pós-Reunião (Inicialmente limpo para preenchimento honesto após a conversa)
  const [finalDecisions, setFinalDecisions] = useState<string>('');
  const [finalObservations, setFinalObservations] = useState<string>('');
  
  // Governança estrita: Presença, pactuação e realização não presumidas
  const [participantPresence, setParticipantPresence] = useState<Record<number, 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO' | 'PRESENCA_NAO_CONFIRMADA'>>({});
  const [confirmedGoalIds, setConfirmedGoalIds] = useState<Record<string, boolean>>({});
  const [isMeetingConductedConfirmed, setIsMeetingConductedConfirmed] = useState<boolean>(false);
  const [conductionDateTime, setConductionDateTime] = useState<string>('');

  // ETAPA 5: Documento Formal Concluído
  const [finalAlignmentObject, setFinalAlignmentObject] = useState<FormalAlignment | null>(null);

  if (!isOpen) return null;

  // Alterna seleção de colaboradores
  const toggleTechSelection = (techId: number) => {
    if (scope === 'INDIVIDUAL') {
      setSelectedTechIds([techId]);
    } else {
      setSelectedTechIds(prev => 
        prev.includes(techId) ? prev.filter(id => id !== techId) : [...prev, techId]
      );
    }
  };

  // Gerar ou regerar com IA (Etapa 1 -> Etapa 2) — Execução direta sem delay artificial
  const handleGeneratePreparation = (toneToUse: AlignmentTone = selectedTone) => {
    setIsGeneratingAi(true);
    const result = generateAiAlignmentPreparation(
      {
        participantIds: selectedTechIds,
        category,
        spontaneousStrengths,
        spontaneousDevPoints,
        spontaneousContext,
        primaryObjective,
        previousCommitmentsToRescue: previousCommitments,
        includeGlpiMetrics,
        tone: toneToUse
      },
      currentUser?.name || 'Operador não identificado'
    );

    setAiResult(result);
    setSelectedTone(toneToUse);
    setEditedSubject(result.preliminaryDraft.subject);
    setEditedObjective(result.preliminaryDraft.objective);
    setEditedContext(result.preliminaryDraft.context);
    setEditedFacts(result.preliminaryDraft.observedFactsOrSituations);
    setEditedOrientations(result.preliminaryDraft.transmittedOrientations);
    setEditableGoals(result.proposedGoals);
    setIsGeneratingAi(false);
    setCurrentStep(2);
  };

  // Checkbox de checklist do roteiro ao vivo
  const toggleScriptCheck = (stepNumber: number) => {
    setCheckedScriptSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  // Concluir Etapa 4 e gerar objeto formal para Etapa 5 — Governança estrita
  const handleConsolidateFormalDocument = () => {
    const draftNumber = `MINUTA-LOC-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedTechs = MOCK_TECHNICIANS.filter(t => selectedTechIds.includes(t.id));

    // Regra: Participante NÃO é considerado presente automaticamente
    const participants: AlignmentParticipant[] = selectedTechs.map((t, idx) => ({
      id: `part-${Date.now()}-${idx}`,
      collaboratorId: t.id,
      name: t.name,
      role: t.role,
      department: t.groupName,
      alignmentRole: 'PARTICIPANTE',
      presence: participantPresence[t.id] || 'PRESENCA_NAO_CONFIRMADA',
      individualStatement: liveParticipantStatements[t.id] || '',
      scienceStatus: 'PENDENTE',
      signatureStatus: 'ASSINATURA_FISICA_PENDENTE'
    }));

    // Regra: Não criar compromisso confirmado a partir de sugestão de IA automaticamente
    // Apenas metas explicitamente confirmadas e pactuadas pelo gestor tornam-se compromissos ativos
    const generalCommitments = editableGoals
      .filter(g => !!confirmedGoalIds[g.id])
      .map((g, idx) => ({
        id: `gc-${Date.now()}-${idx}`,
        description: `${g.objective} (Meta: ${g.target})`,
        responsibleName: g.responsible,
        isCollective: scope === 'COLETIVO',
        deadline: g.deadline,
        successCriteria: g.expectedEvidence,
        status: 'EM_ANDAMENTO' as const
      }));

    // REGRA MANDATÓRIA: NÃO INVENTAR DECISÕES.
    // Se vazio, apresentar estritamente frase informativa sem sugerir concordância
    const cleanDecisions: string[] = finalDecisions.trim().length > 0
      ? [finalDecisions.trim()]
      : ['Não foram registradas decisões pactuadas nesta reunião.'];

    // REGRA MANDATÓRIA: NÃO ATRIBUIR DATA DE REALIZAÇÃO COM BASE APENAS NO MOMENTO DA PREPARAÇÃO
    const effectiveDateTime = isMeetingConductedConfirmed
      ? (conductionDateTime.trim() || `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`)
      : 'Aguardando realização presencial da reunião';

    const documentStatus = isMeetingConductedConfirmed ? 'EM_REVISAO' : 'AGUARDANDO_REALIZACAO';

    const managerName = currentUser?.name || 'Operador não identificado';
    const managerId = currentUser?.id || 0;
    const managerRole = currentUser?.role || 'Gestor Operacional de TI';

    const alignmentDoc: FormalAlignment = {
      id: `aln-ai-${Date.now()}`,
      alignmentNumber: draftNumber,
      dateTime: effectiveDateTime,
      location: 'Sala de Operações DTI / Presencial',
      managerId,
      managerName,
      managerRole,
      periodicity: 'ESPORADICO',
      scope,
      category,
      subject: editedSubject || `Alinhamento — ${participants.map(p => p.name).join(', ')}`,
      objective: editedObjective,
      context: editedContext,
      topicsDiscussed: aiResult?.preliminaryDraft.topicsDiscussed || [
        'Apresentação de orientações e alinhamento de rotinas operacionais'
      ],
      observedFactsOrSituations: editedFacts,
      transmittedOrientations: editedOrientations,
      participants,
      generalCommitments,
      individualCommitments: [],
      decisions: cleanDecisions,
      nextReviewDate: 'Em 30 dias (Acompanhamento Periódico)',
      status: documentStatus,
      version: 'v1.0 (Minuta Formal)',
      elaboratedBy: managerName,
      reviewedBy: managerName,
      managerSignatureStatus: 'ASSINATURA_FISICA_PENDENTE',
      archivingInfo: {
        isArchivedPhysical: false,
        bookNumber: undefined,
        physicalLocation: undefined,
        isSimulation: true
      },
      history: [
        {
          timestamp: new Date().toLocaleDateString('pt-BR'),
          author: managerName,
          action: isMeetingConductedConfirmed
            ? 'Minuta elaborada e reunião confirmada como realizada pelo gestor'
            : 'Preparação preliminar gerada pelo gestor (Reunião presencial pendente)'
        }
      ]
    };

    setFinalAlignmentObject(alignmentDoc);
    setCurrentStep(5);
  };

  const handleSaveAndClose = () => {
    if (finalAlignmentObject) {
      onSaveAlignment(finalAlignmentObject);
    }
    onClose();
  };

  const handleSaveAndPreview = () => {
    if (finalAlignmentObject) {
      onSaveAlignment(finalAlignmentObject);
      onPreviewAlignment(finalAlignmentObject);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header com Navegador de Etapas */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  IA Assistiva HEAL · 5 Etapas
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Preparação Humanizada de Alinhamentos
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {currentStep === 1 && 'Etapa 1: Anotações Livres do Gestor'}
                {currentStep === 2 && 'Etapa 2: Preparação com IA & Seletor de Tom'}
                {currentStep === 3 && 'Etapa 3: Condução ao Vivo (Modo Roteiro)'}
                {currentStep === 4 && 'Etapa 4: Registro Pós-Reunião & Consolidação'}
                {currentStep === 5 && 'Etapa 5: Documento Formal e Impressão A4'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
          {[
            { num: 1, label: '1. Anotações' },
            { num: 2, label: '2. Preparação IA' },
            { num: 3, label: '3. Ao Vivo' },
            { num: 4, label: '4. Consolidação' },
            { num: 5, label: '5. Documento A4' }
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                // Só permite avançar para etapas geradas
                if (s.num <= currentStep || (s.num === 2 && aiResult)) {
                  setCurrentStep(s.num);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                currentStep === s.num
                  ? 'bg-[#134F9F] text-white shadow-xs'
                  : currentStep > s.num
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-2xs ${
                currentStep === s.num ? 'bg-white/20 text-white' : currentStep > s.num ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 dark:bg-slate-700'
              }`}>
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* ========================================================= */}
          {/* ETAPA 1: ANOTAÇÕES LIVRES DO GESTOR */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200">
                <span className="font-bold block mb-1">Como funciona a Preparação Natural com IA:</span>
                Escreva livremente com suas palavras o que você observou, os pontos fortes e os pontos de melhoria. A IA organizará um roteiro de condução humanizado, propostas de metas e a minuta da ata institucional.
              </div>

              {/* Escopo e Participantes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Escopo do Alinhamento
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setScope('INDIVIDUAL');
                        if (selectedTechIds.length > 1) setSelectedTechIds([selectedTechIds[0]]);
                      }}
                      className={`p-2 rounded-lg border text-center font-semibold transition-colors cursor-pointer ${
                        scope === 'INDIVIDUAL'
                          ? 'border-[#134F9F] bg-blue-50 text-[#134F9F] dark:bg-blue-950 dark:border-blue-500 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Individual (1 Colaborador)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScope('COLETIVO')}
                      className={`p-2 rounded-lg border text-center font-semibold transition-colors cursor-pointer ${
                        scope === 'COLETIVO'
                          ? 'border-[#134F9F] bg-blue-50 text-[#134F9F] dark:bg-blue-950 dark:border-blue-500 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Coletivo (Múltiplos)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoria da Pauta
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AlignmentCategory)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#134F9F]"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seleção de Colaboradores de MOCK_TECHNICIANS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Selecione o(s) Colaborador(es) Envolvido(s)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {MOCK_TECHNICIANS.map((tech) => {
                    const isSelected = selectedTechIds.includes(tech.id);
                    return (
                      <div
                        key={tech.id}
                        onClick={() => toggleTechSelection(tech.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-[#134F9F] bg-blue-50/70 dark:bg-blue-950/40 text-[#134F9F] dark:text-blue-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-2xs ${
                            isSelected ? 'bg-[#134F9F] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}>
                            {tech.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="line-clamp-1">{tech.name}</p>
                            <span className="text-2xs opacity-75 block">{tech.groupName}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#134F9F] dark:text-blue-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Anotações Espontâneas do Gestor */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Objetivo Principal da Conversa
                  </label>
                  <input
                    type="text"
                    value={primaryObjective}
                    onChange={(e) => setPrimaryObjective(e.target.value)}
                    placeholder="Ex: Alinhar pontualidade nas passagens de plantão e registro tempestivo no GLPI."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#134F9F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                      Pontos Fortes Observados (Reconhecimento)
                    </label>
                    <textarea
                      rows={3}
                      value={spontaneousStrengths}
                      onChange={(e) => setSpontaneousStrengths(e.target.value)}
                      placeholder="Ex: Muito bom relacionamento com enfermagem, presteza no atendimento presencial..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#134F9F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                      Pontos a Desenvolver / Oportunidades de Ajuste
                    </label>
                    <textarea
                      rows={3}
                      value={spontaneousDevPoints}
                      onChange={(e) => setSpontaneousDevPoints(e.target.value)}
                      placeholder="Ex: Chamados da tarde sem apontamento intermediário, falta de registro do rádio no plantão..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#134F9F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contexto Operacional e Fatos Observados
                  </label>
                  <textarea
                    rows={2}
                    value={spontaneousContext}
                    onChange={(e) => setSpontaneousContext(e.target.value)}
                    placeholder="Ex: No plantão de domingo a UTI reportou demora na troca de bobina da impressora de pulseiras..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#134F9F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Metas ou Compromissos Anteriores a Resgatar (Opcional)
                  </label>
                  <input
                    type="text"
                    value={previousCommitments}
                    onChange={(e) => setPreviousCommitments(e.target.value)}
                    placeholder="Ex: Acordo de atualizar chamados antes das 17h firmado na reunião da semana passada."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#134F9F]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <input
                    type="checkbox"
                    id="glpi-metric-chk"
                    checked={includeGlpiMetrics}
                    onChange={(e) => setIncludeGlpiMetrics(e.target.checked)}
                    className="rounded text-[#134F9F] focus:ring-[#134F9F] cursor-pointer"
                  />
                  <label htmlFor="glpi-metric-chk" className="text-slate-600 dark:text-slate-400 cursor-pointer">
                    Consultar métricas operacionais consolidadas dos colaboradores no GLPI
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ETAPA 2: PREPARAÇÃO COM IA & SELETOR DE TOM */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-5">
              
              {/* Seletor de Tom */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>Selecione a Abordagem e o Tom da Conversa:</span>
                  <span className="text-2xs text-purple-600 dark:text-purple-400 font-semibold">
                    A IA ajusta as falas, perguntas e minuta ao tom escolhido
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {(Object.keys(TONE_CONFIG) as AlignmentTone[]).map((tKey) => {
                    const cfg = TONE_CONFIG[tKey];
                    const isSelected = selectedTone === tKey;
                    return (
                      <div
                        key={tKey}
                        onClick={() => handleGeneratePreparation(tKey)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 ring-2 ring-purple-600/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {cfg.label.split(' ')[0]} {cfg.label.split(' ')[1] || ''}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                          </div>
                          <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {cfg.description}
                          </p>
                        </div>
                        <span className={`text-3xs font-semibold px-2 py-0.5 rounded mt-2 self-start ${cfg.badgeColor}`}>
                          {tKey === 'EQUILIBRADO_PROFISSIONAL' ? 'Recomendado' : 'Específico'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disclaimer de IA Assistiva */}
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-lg text-2xs text-purple-900 dark:text-purple-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Origem: Preparação Demonstrativa no Frontend (Aguardando conciliação com FastAPI e Luna CLI AGY):</span> Roteiro humanizado e minuta preliminar estruturados localmente. Todos os 3 blocos abaixo são 100% editáveis pelo gestor antes, durante e após a realização da reunião.
                </div>
              </div>

              {/* Bloco 1: Roteiro de Condução em 7 Etapas */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      1. Roteiro Estruturado de Condução (7 Passos Humanizados)
                    </h3>
                  </div>
                  <span className="text-2xs text-slate-500">Usado na Etapa 3 ao vivo</span>
                </div>

                <div className="space-y-2.5">
                  {aiResult?.conversationScript.map((step) => (
                    <div key={step.stepNumber} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-1">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-[#134F9F] dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center text-2xs">
                          {step.stepNumber}
                        </span>
                        <span>{step.title}</span>
                      </div>
                      <p className="text-2xs text-slate-500 italic mb-2">{step.guideline}</p>
                      
                      <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                        <span className="text-3xs font-bold uppercase text-slate-400 block">Sugestão de fala:</span>
                        {step.suggestedTalkingPoints.map((tp, idx) => (
                          <p key={idx} className="text-2xs text-slate-700 dark:text-slate-300 font-medium">{tp}</p>
                        ))}
                      </div>

                      {step.reflectiveQuestions && step.reflectiveQuestions.length > 0 && (
                        <div className="mt-2 space-y-1 bg-purple-50 dark:bg-purple-950/30 p-2 rounded text-2xs">
                          <span className="text-3xs font-bold uppercase text-purple-700 dark:text-purple-300 block">Perguntas para escuta ativa:</span>
                          {step.reflectiveQuestions.map((q, idx) => (
                            <p key={idx} className="text-purple-900 dark:text-purple-200">💬 {q}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloco 2: Propostas de Metas Objetivas */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      2. Propostas de Metas Objetivas para Pactuação
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newG: ProposedGoalDraft = {
                        id: `goal-manual-${Date.now()}`,
                        objective: 'Novo compromisso operacional',
                        target: '100% de conformidade',
                        practicalActions: ['Ação prática pactuada'],
                        responsible: 'Colaborador',
                        deadline: 'Em 30 dias',
                        expectedEvidence: 'Relatório ou chamado no GLPI'
                      };
                      setEditableGoals(prev => [...prev, newG]);
                    }}
                    className="text-2xs font-semibold text-[#134F9F] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Meta
                  </button>
                </div>

                <div className="space-y-2">
                  {editableGoals.map((g, idx) => (
                    <div key={g.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">Meta {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setEditableGoals(prev => prev.filter(item => item.id !== g.id))}
                          className="text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-3xs font-semibold text-slate-500 uppercase block mb-0.5">Objetivo</label>
                          <input
                            type="text"
                            value={g.objective}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditableGoals(prev => prev.map(item => item.id === g.id ? { ...item, objective: val } : item));
                            }}
                            className="w-full text-xs p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-3xs font-semibold text-slate-500 uppercase block mb-0.5">Alvo Mensurável</label>
                          <input
                            type="text"
                            value={g.target}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditableGoals(prev => prev.map(item => item.id === g.id ? { ...item, target: val } : item));
                            }}
                            className="w-full text-xs p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
                        <div>
                          <span className="text-slate-500">Prazo: {g.deadline} · Responsável: {g.responsible}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Evidência: {g.expectedEvidence}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloco 3: Minuta Preliminar do Documento */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      3. Minuta Preliminar da Ata Formal Institucional
                    </h3>
                  </div>
                  <span className="text-2xs text-slate-500">Pronta para formalização</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assunto da Ata</label>
                    <input
                      type="text"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fatos Observados</label>
                    <textarea
                      rows={2}
                      value={editedFacts}
                      onChange={(e) => setEditedFacts(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Orientações Transmitidas pela Gestão</label>
                    <textarea
                      rows={2}
                      value={editedOrientations}
                      onChange={(e) => setEditedOrientations(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* ETAPA 3: CONDUÇÃO AO VIVO (MODO ROTEIRO) */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 dark:text-blue-200 block">Modo Executivo de Condução ao Vivo</span>
                  <span className="text-2xs text-blue-700 dark:text-blue-300">
                    Utilize este painel durante a conversa para marcar tópicos abordados e registrar falas imediatas.
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 text-xs font-mono font-bold bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-700">
                  <Clock className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                  <span>Sessão em andamento</span>
                </div>
              </div>

              {/* Roteiro Interativo com Checklists */}
              <div className="space-y-2">
                {aiResult?.conversationScript.map((step) => {
                  const isChecked = !!checkedScriptSteps[step.stepNumber];
                  return (
                    <div 
                      key={step.stepNumber} 
                      className={`p-3 rounded-lg border text-xs transition-colors ${
                        isChecked 
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleScriptCheck(step.stepNumber)}
                          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isChecked
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-bold ${isChecked ? 'text-emerald-900 dark:text-emerald-300 line-through' : 'text-slate-900 dark:text-white'}`}>
                              Passo {step.stepNumber}: {step.title}
                            </span>
                            <span className="text-3xs text-slate-400">
                              {isChecked ? 'Concluído' : 'Pendente'}
                            </span>
                          </div>
                          <p className="text-2xs text-slate-600 dark:text-slate-400 mt-0.5">{step.guideline}</p>
                          
                          <div className="mt-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded text-2xs text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-slate-500 block mb-0.5">Pontos a abordar:</span>
                            {step.suggestedTalkingPoints.map((tp, idx) => (
                              <p key={idx}>• {tp}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Registro de Manifestação do Colaborador em Tempo Real */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#134F9F]" />
                  Manifestação Individual Declarada pelo Colaborador
                </h4>
                <p className="text-2xs text-slate-500">
                  Registre as declarações, justificativas ou compromissos verbais do participante durante a reunião.
                </p>

                {MOCK_TECHNICIANS.filter(t => selectedTechIds.includes(t.id)).map((tech) => (
                  <div key={tech.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
                    <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Manifestação de {tech.name} ({tech.role}):
                    </label>
                    <textarea
                      rows={2}
                      value={liveParticipantStatements[tech.id] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLiveParticipantStatements(prev => ({
                          ...prev,
                          [tech.id]: val
                        }));
                      }}
                      placeholder={`O que ${tech.name} declarou ou pontuou durante o alinhamento...`}
                      className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#134F9F]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ETAPA 4: REGISTRO PÓS-REUNIÃO & CONSOLIDAÇÃO */}
          {/* ========================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {/* Confirmação de Realização Presencial */}
              <div className={`p-3.5 rounded-lg border text-xs transition-colors ${
                isMeetingConductedConfirmed 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="meeting-conducted-chk"
                    checked={isMeetingConductedConfirmed}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsMeetingConductedConfirmed(checked);
                      if (checked && !conductionDateTime) {
                        const now = new Date();
                        setConductionDateTime(`${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
                      }
                    }}
                    className="mt-0.5 rounded text-[#134F9F] focus:ring-[#134F9F] cursor-pointer shrink-0"
                  />
                  <div className="flex-1">
                    <label htmlFor="meeting-conducted-chk" className="font-bold cursor-pointer block">
                      Confirmar que a reunião presencial foi efetivamente realizada
                    </label>
                    <p className="text-2xs opacity-85 mt-0.5">
                      {isMeetingConductedConfirmed 
                        ? 'Reunião confirmada pelo gestor. Informe abaixo a data/hora real da condução e a presença individual de cada participante.' 
                        : 'Atenção: Sem esta confirmação humana, o documento será registrado como "Aguardando Realização", sem presunção de ocorrência.'}
                    </p>
                    
                    {isMeetingConductedConfirmed && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-2xs font-bold text-slate-700 dark:text-slate-300 shrink-0">Data/Hora Real da Sessão:</span>
                        <input
                          type="text"
                          value={conductionDateTime}
                          onChange={(e) => setConductionDateTime(e.target.value)}
                          placeholder="dd/mm/aaaa hh:mm"
                          className="text-xs px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Registro de Presença Individual dos Participantes */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                  Confirmação de Presença dos Participantes:
                </span>
                <p className="text-2xs text-slate-500">
                  Presença não presumida automaticamente. Marque a condição de cada participante na reunião.
                </p>

                <div className="space-y-1.5 pt-1">
                  {MOCK_TECHNICIANS.filter(t => selectedTechIds.includes(t.id)).map((tech) => {
                    const currentPresence = participantPresence[tech.id] || 'PRESENCA_NAO_CONFIRMADA';
                    return (
                      <div key={tech.id} className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{tech.name}</span>
                          <span className="text-slate-500 ml-1.5 text-2xs">({tech.role})</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {(['PRESENTE', 'AUSENTE', 'JUSTIFICADO', 'PRESENCA_NAO_CONFIRMADA'] as const).map((pStatus) => (
                            <button
                              key={pStatus}
                              type="button"
                              onClick={() => setParticipantPresence(prev => ({ ...prev, [tech.id]: pStatus }))}
                              className={`px-2 py-0.5 rounded text-2xs font-semibold cursor-pointer transition-colors ${
                                currentPresence === pStatus
                                  ? pStatus === 'PRESENTE'
                                    ? 'bg-emerald-600 text-white'
                                    : pStatus === 'AUSENTE'
                                    ? 'bg-rose-600 text-white'
                                    : pStatus === 'JUSTIFICADO'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-amber-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              {pStatus === 'PRESENTE' ? 'Presente' : pStatus === 'AUSENTE' ? 'Ausente' : pStatus === 'JUSTIFICADO' ? 'Justificado' : 'Não Confirmado'}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pactuação Explícita de Metas (Proposta IA vs Compromisso Confirmado) */}
              {editableGoals.length > 0 && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Pactuação de Compromissos (Validação Humana Obrigatória):
                    </span>
                    <span className="text-2xs text-purple-600 dark:text-purple-400 font-semibold">
                      Propostas da IA não são compromissos até validação explícita
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {editableGoals.map((g) => {
                      const isConfirmed = !!confirmedGoalIds[g.id];
                      return (
                        <div 
                          key={g.id}
                          className={`p-2.5 rounded border text-xs transition-colors ${
                            isConfirmed 
                              ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              id={`goal-confirm-${g.id}`}
                              checked={isConfirmed}
                              onChange={(e) => setConfirmedGoalIds(prev => ({ ...prev, [g.id]: e.target.checked }))}
                              className="mt-0.5 rounded text-[#134F9F] focus:ring-[#134F9F] cursor-pointer shrink-0"
                            />
                            <div className="flex-1">
                              <label htmlFor={`goal-confirm-${g.id}`} className="font-bold text-slate-900 dark:text-white cursor-pointer block">
                                {g.objective}
                              </label>
                              <p className="text-2xs text-slate-600 dark:text-slate-400 mt-0.5">
                                Meta: {g.target} · Resp: {g.responsible} · Prazo: {g.deadline}
                              </p>
                              <span className={`text-3xs font-semibold px-1.5 py-0.2 rounded mt-1 inline-block ${
                                isConfirmed 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' 
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {isConfirmed ? '✓ Compromisso Pactuado Formalmente' : 'Proposta da IA (Não pactuado)'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Decisões Finais Pactuadas */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Decisões Finais Pactuadas na Reunião
                  </label>
                  <p className="text-2xs text-slate-500 mb-1.5">
                    Preencha apenas o que foi efetivamente deliberado. Se deixado vazio, o documento registrará: <em>"Não foram registradas decisões pactuadas nesta reunião."</em>
                  </p>
                  <textarea
                    rows={2}
                    value={finalDecisions}
                    onChange={(e) => setFinalDecisions(e.target.value)}
                    placeholder="Descreva decisões deliberadas durante a reunião, ou deixe em branco caso nenhuma decisão tenha sido pactuada..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Observações Adicionais da Gestão
                  </label>
                  <textarea
                    rows={2}
                    value={finalObservations}
                    onChange={(e) => setFinalObservations(e.target.value)}
                    placeholder="Observações complementares da condução..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ETAPA 5: DOCUMENTO FORMAL E IMPRESSÃO A4 */}
          {/* ========================================================= */}
          {currentStep === 5 && finalAlignmentObject && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Documento Institucional Formal Estruturado
                </div>
                <p className="text-emerald-800 dark:text-emerald-300 text-2xs leading-relaxed">
                  A ata formal foi gerada sob a referência <strong>{finalAlignmentObject.alignmentNumber}</strong> com diagramação vetorial A4 pronta para impressão. Conforme o procedimento operacional padrão do Hospital HEAL, colete as assinaturas manuscritas a caneta de todos os participantes e anexe a folha ao livro físico de alinhamentos da DTI.
                </p>
              </div>

              {/* Card Resumo do Documento */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div>
                    <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-[#134F9F] dark:bg-blue-950 dark:text-blue-300">
                      {finalAlignmentObject.alignmentNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {finalAlignmentObject.subject}
                    </h3>
                  </div>
                  <span className="text-2xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Aguardando Coleta Física
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-2xs">
                  <div>
                    <span className="text-slate-400 block">Data / Hora</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{finalAlignmentObject.dateTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Condutor</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{finalAlignmentObject.managerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Participantes</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{finalAlignmentObject.participants.length} integrantes</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Compromissos</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{finalAlignmentObject.generalCommitments.length} metas</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 text-2xs space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Diretrizes para Arquivamento Físico:</span>
                  <p className="text-slate-600 dark:text-slate-400">
                    1. Imprima o documento em folha A4 através do botão abaixo.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    2. Colha a assinatura manuscrita a caneta de todos os participantes e do gestor condutor.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    3. Cole ou arquive no Livro de Tomos da DTI e registre a localização física no sistema.
                  </p>
                </div>

                {/* Botões de Ação do PDF */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => generateAlignmentPDF(finalAlignmentObject, true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar PDF Institucional A4</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const pdf = generateAlignmentPDF(finalAlignmentObject, false);
                      window.open(pdf.output('bloburl'), '_blank');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>Imprimir Folha A4</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between shrink-0 text-xs">
          <div>
            {currentStep > 1 && currentStep < 5 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 1 && (
              <button
                type="button"
                disabled={isGeneratingAi || selectedTechIds.length === 0}
                onClick={() => handleGeneratePreparation()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Preparando com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Preparar com IA (Avançar para Etapa 2)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}

            {currentStep === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#134F9F] hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Iniciar Condução ao Vivo (Etapa 3)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <span>Concluir Reunião & Consolidar (Etapa 4)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="button"
                onClick={handleConsolidateFormalDocument}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#134F9F] hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Gerar Ata Formal e PDF A4 (Etapa 5)</span>
              </button>
            )}

            {currentStep === 5 && (
              <>
                <button
                  type="button"
                  onClick={handleSaveAndPreview}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Ver no Visualizador de Documentos
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndClose}
                  className="px-4 py-2 bg-[#134F9F] hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Salvar no Catálogo & Concluir
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
