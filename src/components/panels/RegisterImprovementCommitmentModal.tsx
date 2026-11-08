/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Modal de Registro de Compromisso de Melhoria (+ Registrar compromisso de melhoria)
 * Integração TPL-02 (Alinhamento Semanal) com TPL-03 (Feedback Individual)
 * Permite registrar compromissos acordados com colaboradores para acompanhamento longitudinal.
 */

import React, { useState } from 'react';
import { 
  X, 
  Target, 
  User, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sparkles,
  HeartHandshake,
  Award
} from 'lucide-react';
import { 
  DevelopmentCommitment, 
  DevelopmentAction, 
  DevelopmentCommitmentStatus,
  CurrentUser,
  Technician 
} from '../../types';
import { MOCK_TECHNICIANS } from '../../data/mockData';

interface RegisterImprovementCommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: CurrentUser | null;
  sourceMeetingReferenceDate?: string;
  onSaveCommitment: (commitment: DevelopmentCommitment) => void;
}

export const RegisterImprovementCommitmentModal: React.FC<RegisterImprovementCommitmentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  sourceMeetingReferenceDate = 'Semana 45/2026',
  onSaveCommitment
}) => {
  if (!isOpen) return null;

  // Lista de colaboradores técnicos aptos a plano de desenvolvimento
  const eligibleTechs = MOCK_TECHNICIANS.filter(t => !t.isManagementGroup);

  const [collaboratorId, setCollaboratorId] = useState<number>(eligibleTechs[3]?.id || 105); // Lucas Mendes por padrão
  const selectedCollaborator = eligibleTechs.find(t => t.id === collaboratorId) || eligibleTechs[0];

  const [developmentArea, setDevelopmentArea] = useState<string>('Comunicação e Atendimento Humanizado');
  const [observedSituation, setObservedSituation] = useState<string>('');
  const [evidencesText, setEvidencesText] = useState<string>('');
  const [operationalImpact, setOperationalImpact] = useState<string>('');
  const [agreedGoal, setAgreedGoal] = useState<string>('');
  const [collaboratorProposedCommitment, setCollaboratorProposedCommitment] = useState<string>('');
  
  // Ações práticas com prazos
  const [actions, setActions] = useState<{ id: string; description: string; deadline: string }[]>([
    { id: '1', description: 'Participar de capacitação técnica/comportamental', deadline: 'Em 7 dias' },
    { id: '2', description: 'Revisar notas públicas antes do envio no GLPI', deadline: 'Diário' }
  ]);
  const [newActionDesc, setNewActionDesc] = useState<string>('');
  const [newActionDeadline, setNewActionDeadline] = useState<string>('12/11/2026');

  const [mentorName, setMentorName] = useState<string>(currentUser?.name || 'Henrique Vasconcelos');
  const [startDate, setStartDate] = useState<string>('Hoje (06/11/2026)');
  const [deadlineOrNextReview, setDeadlineOrNextReview] = useState<string>('13/11/2026 (Próximo Alinhamento)');
  const [successCriteria, setSuccessCriteria] = useState<string>('');
  const [collaboratorNotes, setCollaboratorNotes] = useState<string>('');
  const [managerNotes, setManagerNotes] = useState<string>('');
  const [initialStatus, setInitialStatus] = useState<DevelopmentCommitmentStatus>('AGUARDANDO_CIENCIA');

  const areaSuggestions = [
    'Comunicação e Atendimento Humanizado',
    'Qualidade Documental POP-TIN-017 e Evidências',
    'Gestão de Prazos e Follow-ups no GLPI',
    'Homologação e Testes Técnicos Formais',
    'Postura Interpessoal e Empatia em Áreas Críticas',
    'Mentoria e Compartilhamento de Conhecimento'
  ];

  const handleAddAction = () => {
    if (!newActionDesc.trim()) return;
    setActions(prev => [
      ...prev,
      {
        id: String(Date.now()),
        description: newActionDesc.trim(),
        deadline: newActionDeadline.trim() || 'A definir'
      }
    ]);
    setNewActionDesc('');
  };

  const handleRemoveAction = (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observedSituation.trim() || !agreedGoal.trim()) return;

    const evidences = evidencesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const practicalActions: DevelopmentAction[] = actions.map(a => ({
      id: a.id,
      description: a.description,
      deadline: a.deadline,
      completed: false
    }));

    const author = currentUser?.name || 'Henrique Vasconcelos';
    const nowTimestamp = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newCommitment: DevelopmentCommitment = {
      id: `DEV-${Date.now().toString().slice(-6)}`,
      sourceMeetingType: 'ALINHAMENTO_SEMANAL',
      meetingReferenceDate: sourceMeetingReferenceDate,
      isPreviousAlignment: false,
      collaboratorId,
      collaboratorName: selectedCollaborator.name,
      collaboratorRole: selectedCollaborator.role,
      registeredAt: nowTimestamp,
      developmentArea,
      observedSituation: observedSituation.trim(),
      evidencesObserved: evidences.length > 0 ? evidences : ['Apontamento formal pactuado no Alinhamento Semanal'],
      operationalImpact: operationalImpact.trim() || 'Apoio ao alinhamento com os objetivos operacionais da equipe.',
      agreedGoal: agreedGoal.trim(),
      collaboratorProposedCommitment: collaboratorProposedCommitment.trim() || 'Comprometo-me a executar as ações combinadas e relatar meu progresso.',
      practicalActions,
      mentorOrManagerName: mentorName,
      startDate,
      deadlineOrNextReview,
      successCriteria: successCriteria.trim() || 'Evolução demonstrada sem reincidências de apontamentos no período.',
      collaboratorNotes: collaboratorNotes.trim(),
      collaboratorSignedScience: false,
      managerNotes: managerNotes.trim(),
      status: initialStatus,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: nowTimestamp,
          author,
          action: 'Compromisso de melhoria registrado durante o Alinhamento Semanal',
          newValue: initialStatus,
          justification: 'Alinhamento gerencial bilateral formalizado.'
        }
      ]
    };

    onSaveCommitment(newCommitment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  Registrar Compromisso de Melhoria Individual
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  TPL-02 / TPL-03
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pactuação construtiva com base factual, sem caráter punitivo ou julgamento disciplinar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com rolagem interna suave */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Card Ético e de Governança */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-2.5 text-blue-900 dark:text-blue-300">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Diretriz de Governança HEAL Ops:</strong> O plano registra fatos verificáveis e ações práticas pactuadas de comum acordo. Não registra acusações, traços de personalidade ou sanções disciplinares. Fica restrito ao alinhamento gerencial e ao colaborador.
            </div>
          </div>

          {/* 1. Colaborador e Área de Desenvolvimento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Colaborador Pactuante *
              </label>
              <select
                value={collaboratorId}
                onChange={e => setCollaboratorId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {eligibleTechs.map(tech => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} — {tech.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Área de Desenvolvimento *
              </label>
              <input
                type="text"
                list="area-suggestions"
                value={developmentArea}
                onChange={e => setDevelopmentArea(e.target.value)}
                placeholder="Ex: Comunicação e Atendimento Humanizado"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              />
              <datalist id="area-suggestions">
                {areaSuggestions.map((s, i) => <option key={i} value={s} />)}
              </datalist>
            </div>
          </div>

          {/* 2. Situação Observada e Evidências Fatuais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Situação Observada (Factual e Respeitosa) *
              </label>
              <textarea
                value={observedSituation}
                onChange={e => setObservedSituation(e.target.value)}
                rows={3}
                placeholder="Descreva de forma demonstrativa e factual a oportunidade observada..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span className="text-[10px] text-slate-400">
                Evite generalizações ("sempre", "nunca"); relate episódios específicos.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Evidências Observadas (1 por linha)
              </label>
              <textarea
                value={evidencesText}
                onChange={e => setEvidencesText(e.target.value)}
                rows={3}
                placeholder="Ex: Chamado GLPI #48098 (Nota de 27/10)&#10;Relato da supervisão do PA em 28/10"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* 3. Impacto Operacional e Objetivo Pactuado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Impacto Operacional na Rotina / Equipe
              </label>
              <input
                type="text"
                value={operationalImpact}
                onChange={e => setOperationalImpact(e.target.value)}
                placeholder="Ex: Ruído de relacionamento com enfermagem e retardo na triagem"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Objetivo Pactuado (Resultado Esperado Positivo) *
              </label>
              <input
                type="text"
                value={agreedGoal}
                onChange={e => setAgreedGoal(e.target.value)}
                placeholder="Ex: Adotar comunicação empática em 100% dos atendimentos com zero queixas"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium"
                required
              />
            </div>
          </div>

          {/* 4. Compromisso Proposto pelo Colaborador (Voz do Colaborador) */}
          <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40">
            <label className="block font-semibold text-indigo-950 dark:text-indigo-200 mb-1">
              Compromisso Proposto pelo Colaborador (O que ele pretende fazer) *
            </label>
            <textarea
              value={collaboratorProposedCommitment}
              onChange={e => setCollaboratorProposedCommitment(e.target.value)}
              rows={2}
              placeholder="Ex: 'Vou revisar as respostas antes de postar, manter saudação cordial e pedir apoio ao Rafael quando a triagem estiver tensa.'"
              className="w-full px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 italic"
            />
          </div>

          {/* 5. Ações Práticas a Executar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Ações Práticas a Executar ({actions.length})
              </label>
              <span className="text-[11px] text-slate-400">Passos concretos com prazo</span>
            </div>

            <div className="space-y-1.5 mb-2">
              {actions.map((act, index) => (
                <div 
                  key={act.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 truncate font-medium">
                      {act.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {act.deadline}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAction(act.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remover ação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar nova ação */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newActionDesc}
                onChange={e => setNewActionDesc(e.target.value)}
                placeholder="Descrever nova ação prática..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={newActionDeadline}
                onChange={e => setNewActionDeadline(e.target.value)}
                placeholder="Prazo (ex: 15/11)"
                className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-center font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={handleAddAction}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>

          {/* 6. Governança: Mentor, Prazo e Critério Objetivo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Responsável pelo Acompanhamento
              </label>
              <input
                type="text"
                value={mentorName}
                onChange={e => setMentorName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Próxima Avaliação / Prazo *
              </label>
              <input
                type="text"
                value={deadlineOrNextReview}
                onChange={e => setDeadlineOrNextReview(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estado Inicial
              </label>
              <select
                value={initialStatus}
                onChange={e => setInitialStatus(e.target.value as DevelopmentCommitmentStatus)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="AGUARDANDO_CIENCIA">Aguardando Ciência do Colaborador</option>
                <option value="EM_ANDAMENTO">Em Andamento (Ciência Já Coletada)</option>
                <option value="PROPOSTO">Proposto para Discussão</option>
              </select>
            </div>
          </div>

          {/* 7. Critérios Objetivos de Sucesso */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Critérios Objetivos de Sucesso (Como saberemos que foi cumprido?) *
            </label>
            <input
              type="text"
              value={successCriteria}
              onChange={e => setSuccessCriteria(e.target.value)}
              placeholder="Ex: Zero reclamações de postura no PA e 100% de saudações cordiais nos chamados fechados"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium"
              required
            />
          </div>

          {/* 8. Observações Iniciais do Gestor */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações do Gestor
            </label>
            <input
              type="text"
              value={managerNotes}
              onChange={e => setManagerNotes(e.target.value)}
              placeholder="Notas de incentivo ou contexto para o próximo alinhamento..."
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </form>

        {/* Rodapé com Ações */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>Referência: {sourceMeetingReferenceDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Salvar Compromisso de Melhoria</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
