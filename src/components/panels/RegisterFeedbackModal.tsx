import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Calendar, 
  User, 
  Database,
  FileText,
  Target
} from 'lucide-react';
import { ManagerialFeedback, FeedbackStrength, FeedbackDevelopmentPoint, DevelopmentGoal, GoalStatus } from '../../types';
import { MOCK_TECHNICIANS } from '../../data/mockData';

interface RegisterFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFeedback: (feedback: ManagerialFeedback) => void;
  existingFeedbacks?: ManagerialFeedback[];
  currentUser?: { name: string; role: string; id: string | number };
}

export const RegisterFeedbackModal: React.FC<RegisterFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSaveFeedback,
  existingFeedbacks = [],
  currentUser = { name: 'Henrique Vasconcelos', role: 'Gestor Operacional de TI', id: 1 }
}) => {
  const [collaboratorId, setCollaboratorId] = useState<number>(101); // Mariana Costa default
  const [periodEvaluated, setPeriodEvaluated] = useState('');
  const [feedbackDate, setFeedbackDate] = useState(() => new Date().toLocaleDateString('pt-BR'));
  const [feedbackType, setFeedbackType] = useState<ManagerialFeedback['feedbackType']>('PERIODICO_MENSAL');
  
  // Optional GLPI metrics toggle
  const [includeGlpiMetrics, setIncludeGlpiMetrics] = useState(true);

  // Strengths start clean
  const [strengths, setStrengths] = useState<FeedbackStrength[]>([]);
  const [newStrengthTitle, setNewStrengthTitle] = useState('');
  const [newStrengthDesc, setNewStrengthDesc] = useState('');

  // Development points start clean
  const [devPoints, setDevPoints] = useState<FeedbackDevelopmentPoint[]>([]);
  const [newDevTitle, setNewDevTitle] = useState('');
  const [newDevDesc, setNewDevDesc] = useState('');
  const [newDevImpact, setNewDevImpact] = useState('');

  // Managerial criteria start clean
  const [collaboration, setCollaboration] = useState('');
  const [communication, setCommunication] = useState('');
  const [organization, setOrganization] = useState('');
  const [posture, setPosture] = useState('');
  const [autonomy, setAutonomy] = useState('');

  // Development Goals start clean
  const [goals, setGoals] = useState<DevelopmentGoal[]>([]);

  const [newGoalObjective, setNewGoalObjective] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalEvidence, setNewGoalEvidence] = useState('');

  // Colaborador selecionado
  const selectedTech = MOCK_TECHNICIANS.find(t => t.id === collaboratorId) || MOCK_TECHNICIANS[0];

  // Identifica se há feedback anterior para este colaborador
  const previousFeedback = existingFeedbacks.find(f => f.collaboratorId === collaboratorId);

  if (!isOpen) return null;

  const handleAddStrength = () => {
    if (!newStrengthTitle.trim()) return;
    setStrengths(prev => [
      ...prev,
      {
        id: `str-${Date.now()}`,
        title: newStrengthTitle,
        description: newStrengthDesc || 'Evidência documentada em reunião.'
      }
    ]);
    setNewStrengthTitle('');
    setNewStrengthDesc('');
  };

  const handleRemoveStrength = (id: string) => {
    setStrengths(prev => prev.filter(s => s.id !== id));
  };

  const handleAddDevPoint = () => {
    if (!newDevTitle.trim()) return;
    setDevPoints(prev => [
      ...prev,
      {
        id: `dp-${Date.now()}`,
        title: newDevTitle,
        description: newDevDesc || 'Ponto alinhado para acompanhamento.',
        operationalImpact: newDevImpact || undefined
      }
    ]);
    setNewDevTitle('');
    setNewDevDesc('');
    setNewDevImpact('');
  };

  const handleRemoveDevPoint = (id: string) => {
    setDevPoints(prev => prev.filter(d => d.id !== id));
  };

  const handleAddGoal = () => {
    if (!newGoalObjective.trim()) return;
    setGoals(prev => [
      ...prev,
      {
        id: `dg-${Date.now()}`,
        objective: newGoalObjective,
        target: newGoalTarget || 'Cumprimento integral dos prazos pactuados',
        practicalActions: ['Execução das tarefas conforme alinhamento com gestor'],
        responsible: selectedTech.name,
        startDate: feedbackDate,
        deadline: newGoalDeadline || 'Próximo Alinhamento',
        successCriteria: 'Validação pelo gestor e zero inconformidades.',
        expectedEvidences: newGoalEvidence || 'Registro no chamado ou relatório de auditoria.',
        status: 'EM_ANDAMENTO'
      }
    ]);
    setNewGoalObjective('');
    setNewGoalTarget('');
    setNewGoalEvidence('');
  };

  const handleUpdateGoalStatus = (goalId: string, newStatus: GoalStatus) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: newStatus } : g));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFeedback: ManagerialFeedback = {
      id: `fdb-2026-${Date.now().toString().slice(-4)}`,
      feedbackNumber: `FDB-2026-0${Math.floor(Math.random() * 50) + 50}`,
      collaboratorId: selectedTech.id,
      collaboratorName: selectedTech.name,
      collaboratorRole: selectedTech.role,
      collaboratorDepartment: selectedTech.groupName,
      managerId: 1,
      managerName: 'Henrique Vasconcelos',
      managerRole: 'Gestor Operacional de TI',
      feedbackDate,
      periodEvaluated,
      feedbackType,
      previousFeedbackRefId: previousFeedback ? previousFeedback.feedbackNumber : undefined,
      strengths,
      developmentPoints: devPoints,
      technicalMetrics: includeGlpiMetrics ? [
        { label: 'Chamados Resolvidos no Mês', value: selectedTech.resolvedInPeriodCount, source: 'GLPI MariaDB', target: '≥ 40' },
        { label: 'Tempo Médio Observado', value: `${selectedTech.avgObservedResolutionHours}h`, source: 'GLPI Histórico', target: '≤ 24h' },
        { label: 'Taxa de Documentação Conforme', value: '94.0%', source: 'POP-TIN-017', target: '≥ 85%' },
        { label: 'Chamados Ativos em Andamento', value: selectedTech.activeTicketsCount, source: 'GLPI Tempo Real' }
      ] : undefined,
      managerialEvaluation: {
        collaboration,
        communication,
        organization,
        posture,
        autonomy,
        commitmentsCompliance: 'Acompanhamento longitudinal formal'
      },
      developmentGoals: goals,
      collaboratorSignedScience: false,
      status: 'RASCUNHO',
      version: 'v1.0 (Oficial)',
      archivingInfo: {
        isArchivedPhysical: false,
        bookNumber: 'Livro de Feedbacks e Desempenho DTI — 2026',
        physicalLocation: `Armário DTI / Pasta Funcional ${selectedTech.name.split(' ')[0]}`
      },
      history: [
        {
          timestamp: `${feedbackDate} 10:00`,
          author: 'Henrique Vasconcelos',
          action: 'Novo feedback individual registrado no Portal'
        }
      ]
    };

    onSaveFeedback(newFeedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                TPL-03 — Novo Feedback Individual
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Registro de Feedback e Desenvolvimento Profissional
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-6 text-xs text-slate-800 dark:text-slate-200">
          
          {/* Identificação */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
              1. Identificação do Colaborador e Ciclo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Colaborador Avaliado</label>
                <select
                  value={collaboratorId}
                  onChange={(e) => setCollaboratorId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {MOCK_TECHNICIANS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Período de Referência</label>
                <input
                  type="text"
                  value={periodEvaluated}
                  onChange={(e) => setPeriodEvaluated(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Ex: Novembro de 2026"
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Tipo de Feedback</label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="PERIODICO_MENSAL">Periódico Mensal</option>
                  <option value="DESENVOLVIMENTO">Plano de Desenvolvimento</option>
                  <option value="TECNICO">Técnico / POPs</option>
                  <option value="PONTUAL">Pontual / Específico</option>
                  <option value="PROBATORIO">Acompanhamento Probatório</option>
                </select>
              </div>
            </div>

            {/* Previous Feedback Notice */}
            {previousFeedback && (
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-2xs flex items-center justify-between">
                <span>
                  <strong>Histórico Longitudinal: </strong>Existe feedback anterior ({previousFeedback.feedbackNumber} de {previousFeedback.feedbackDate}). As metas anteriores foram integradas para acompanhamento.
                </span>
                <span className="font-bold underline cursor-pointer">Ver metas anteriores</span>
              </div>
            )}

            {/* Toggle GLPI Metrics */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="toggleGlpi"
                checked={includeGlpiMetrics}
                onChange={(e) => setIncludeGlpiMetrics(e.target.checked)}
                className="w-4 h-4 rounded text-[#134F9F] focus:ring-[#134F9F]"
              />
              <label htmlFor="toggleGlpi" className="text-2xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                Vincular métricas técnicas reais do GLPI (Chamados resolvidos, Tempo Médio e Aderência POP-TIN-017)
              </label>
            </div>
          </div>

          {/* 2. Pontos Fortes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                2. Pontos Fortes e Reconhecimento ({strengths.length})
              </h3>
            </div>

            <div className="space-y-2">
              {strengths.map(s => (
                <div key={s.id} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-300">{s.title}</p>
                    <p className="text-2xs text-slate-600 dark:text-slate-300 mt-0.5">{s.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStrength(s.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Strength input */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
              <input
                type="text"
                value={newStrengthTitle}
                onChange={(e) => setNewStrengthTitle(e.target.value)}
                placeholder="Título do ponto forte (ex: Domínio em suporte assistencial na UTI)"
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStrengthDesc}
                  onChange={(e) => setNewStrengthDesc(e.target.value)}
                  placeholder="Detalhamento ou evidência observada"
                  className="flex-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddStrength}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-2xs cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* 3. Pontos de Desenvolvimento */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              3. Oportunidades de Desenvolvimento e Atenção ({devPoints.length})
            </h3>

            <div className="space-y-2">
              {devPoints.map(d => (
                <div key={d.id} className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-300">{d.title}</p>
                    <p className="text-2xs text-slate-600 dark:text-slate-300 mt-0.5">{d.description}</p>
                    {d.operationalImpact && (
                      <p className="text-2xs text-slate-500 italic mt-1">Impacto: {d.operationalImpact}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDevPoint(d.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Dev Point input */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
              <input
                type="text"
                value={newDevTitle}
                onChange={(e) => setNewDevTitle(e.target.value)}
                placeholder="Título da oportunidade (ex: Follow-ups tempestivos antes das 17h)"
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newDevDesc}
                  onChange={(e) => setNewDevDesc(e.target.value)}
                  placeholder="Detalhamento da situação observada"
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  value={newDevImpact}
                  onChange={(e) => setNewDevImpact(e.target.value)}
                  placeholder="Impacto operacional observado"
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddDevPoint}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-2xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Adicionar Ponto
                </button>
              </div>
            </div>
          </div>

          {/* 4. Avaliação Gerencial */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
              4. Critérios de Avaliação Gerencial
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Colaboração & Espírito de Equipe</label>
                <input
                  type="text"
                  value={collaboration}
                  onChange={(e) => setCollaboration(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Comunicação Assistencial & Pares</label>
                <input
                  type="text"
                  value={communication}
                  onChange={(e) => setCommunication(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Organização & Qualidade Documental</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Postura Profissional & Assiduidade</label>
                <input
                  type="text"
                  value={posture}
                  onChange={(e) => setPosture(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 5. Metas de Desenvolvimento */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
              5. Metas Individuais de Desenvolvimento e Prazos ({goals.length})
            </h3>

            <div className="space-y-2">
              {goals.map(g => (
                <div key={g.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 dark:text-white">{g.objective}</p>
                      <select
                        value={g.status}
                        onChange={(e) => handleUpdateGoalStatus(g.id, e.target.value as GoalStatus)}
                        className="text-2xs font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                      >
                        <option value="EM_ANDAMENTO">Em Andamento</option>
                        <option value="ATINGIDA">Meta Atingida</option>
                        <option value="PARCIALMENTE_ATINGIDA">Parcialmente Atingida</option>
                        <option value="RENEGOCIADA">Prazo Renegociado</option>
                        <option value="NAO_ATINGIDA">Não Atingida</option>
                        <option value="CANCELADA">Cancelada</option>
                      </select>
                    </div>
                    <p className="text-2xs text-slate-600 dark:text-slate-300 mt-1">Alvo: {g.target} · Prazo: {g.deadline}</p>
                    <p className="text-2xs text-slate-500 italic mt-0.5">Evidência: {g.expectedEvidences}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGoals(prev => prev.filter(item => item.id !== g.id))}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Goal input */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
              <input
                type="text"
                value={newGoalObjective}
                onChange={(e) => setNewGoalObjective(e.target.value)}
                placeholder="Objetivo da meta (ex: Registro de apontamento humano antes das 17h)"
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="Alvo mensurável"
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  value={newGoalDeadline}
                  onChange={(e) => setNewGoalDeadline(e.target.value)}
                  placeholder="Prazo (ex: 06/12/2026)"
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  value={newGoalEvidence}
                  onChange={(e) => setNewGoalEvidence(e.target.value)}
                  placeholder="Evidência auditável"
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="px-3 py-1.5 bg-[#134F9F] hover:bg-blue-700 text-white font-semibold rounded text-2xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Adicionar Meta
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Salvar Feedback e Gerar Documento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
