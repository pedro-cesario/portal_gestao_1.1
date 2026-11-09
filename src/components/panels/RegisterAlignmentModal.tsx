import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  Target, 
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  FormalAlignment, 
  AlignmentParticipant, 
  AlignmentCommitment, 
  AlignmentCategory, 
  AlignmentParticipantRole, 
  AlignmentPresence 
} from '../../types';
import { MOCK_TECHNICIANS } from '../../data/mockData';

interface RegisterAlignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAlignment: (alignment: FormalAlignment) => void;
  currentUser?: { name: string; role: string; id: string | number };
}

export const RegisterAlignmentModal: React.FC<RegisterAlignmentModalProps> = ({
  isOpen,
  onClose,
  onSaveAlignment,
  currentUser = { name: 'Henrique Vasconcelos', role: 'Gestor Operacional de TI', id: 1 }
}) => {
  const [periodicity, setPeriodicity] = useState<'PERIODICO_MENSAL' | 'ESPORADICO'>('ESPORADICO');
  const [scope, setScope] = useState<'INDIVIDUAL' | 'COLETIVO'>('INDIVIDUAL');
  const [category, setCategory] = useState<AlignmentCategory>('ALINHAMENTO_OPERACIONAL');
  const [subject, setSubject] = useState('');
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    return `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  });
  const [location, setLocation] = useState('Sala de Operações DTI / Presencial');
  const [objective, setObjective] = useState('');
  const [context, setContext] = useState('');
  const [observedFacts, setObservedFacts] = useState('');
  const [transmittedOrientations, setTransmittedOrientations] = useState('');
  
  // Participants starts clean
  const [participants, setParticipants] = useState<AlignmentParticipant[]>([]);

  // General commitments starts clean
  const [generalCommitments, setGeneralCommitments] = useState<AlignmentCommitment[]>([]);

  const [newGcDesc, setNewGcDesc] = useState('');
  const [newGcResp, setNewGcResp] = useState('');
  const [newGcDeadline, setNewGcDeadline] = useState('');
  const [newGcCriteria, setNewGcCriteria] = useState('');

  // Quick participant adding
  const [selectedTechToAdd, setSelectedTechToAdd] = useState<number>(101); // Mariana Costa default
  const [selectedRoleForNew, setSelectedRoleForNew] = useState<AlignmentParticipantRole>('PARTICIPANTE');

  if (!isOpen) return null;

  const handleAddParticipant = () => {
    const tech = MOCK_TECHNICIANS.find(t => t.id === selectedTechToAdd);
    if (!tech) return;

    if (participants.some(p => p.collaboratorId === tech.id)) {
      return; // already added
    }

    setParticipants(prev => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        collaboratorId: tech.id,
        name: tech.name,
        role: tech.role,
        department: tech.groupName,
        alignmentRole: selectedRoleForNew,
        presence: 'PRESENTE',
        individualStatement: '',
        scienceStatus: 'PENDENTE',
        signatureStatus: 'ASSINATURA_FISICA_PENDENTE'
      }
    ]);
  };

  const handleRemoveParticipant = (id: string | number) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateParticipantStatement = (id: string | number, statement: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, individualStatement: statement } : p));
  };

  const handleAddGeneralCommitment = () => {
    if (!newGcDesc.trim()) return;
    setGeneralCommitments(prev => [
      ...prev,
      {
        id: `gc-${Date.now()}`,
        description: newGcDesc,
        responsibleName: newGcResp || 'Todos os participantes',
        isCollective: scope === 'COLETIVO',
        deadline: newGcDeadline || 'A combinar',
        successCriteria: newGcCriteria || 'Aderência ao procedimento',
        status: 'EM_ANDAMENTO'
      }
    ]);
    setNewGcDesc('');
    setNewGcResp('');
    setNewGcDeadline('');
    setNewGcCriteria('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const alignmentNum = `MINUTA-LOC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAlignment: FormalAlignment = {
      id: `aln-${Date.now()}`,
      alignmentNumber: alignmentNum,
      dateTime,
      location,
      managerId: currentUser.id,
      managerName: currentUser.name,
      managerRole: currentUser.role,
      periodicity,
      scope,
      category,
      subject: subject || `Alinhamento Operacional — ${participants.map(p => p.name).join(', ') || 'Equipe DTI'}`,
      objective,
      context,
      topicsDiscussed: [
        'Apresentação de orientações e rotinas pactuadas',
        'Alinhamento de prazos e responsabilidades operacionais',
        'Pactuação de compromissos para assinatura física e arquivamento'
      ],
      observedFactsOrSituations: observedFacts,
      transmittedOrientations,
      participants,
      generalCommitments,
      individualCommitments: [],
      decisions: [
        'Aprovadas as diretrizes operacionais pactuadas entre as partes.',
        'Emissão de folha formal em A4 para coleta de assinaturas manuscritas e arquivamento no livro físico.'
      ],
      nextReviewDate: 'Acompanhamento em 30 dias',
      status: 'RASCUNHO_PREPARACAO',
      version: 'v1.0 (Minuta Provisória)',
      elaboratedBy: currentUser.name,
      reviewedBy: currentUser.name,
      managerSignatureStatus: 'ASSINATURA_FISICA_PENDENTE',
      archivingInfo: {
        isArchivedPhysical: false,
        bookNumber: 'Livro de Plantão e Alinhamentos — Tomo 03/2026',
        physicalLocation: 'Arquivo Ativo DTI / Armário 102',
        isSimulation: true
      },
      history: [
        {
          timestamp: dateTime,
          author: currentUser.name,
          action: 'Minuta provisória criada no Portal de Gestão Operacional'
        }
      ]
    };

    onSaveAlignment(newAlignment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#134F9F]/10 dark:bg-blue-500/20 text-[#134F9F] dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-[#134F9F] dark:bg-blue-950 dark:text-blue-300">
                TPL-03 — Novo Alinhamento Formal
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Registro de Alinhamento (Individual ou Coletivo)
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
          
          {/* Parâmetros Gerais */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
              1. Dados Gerais e Enquadramento
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Escopo do Alinhamento</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="COLETIVO">Coletivo (Múltiplos Participantes)</option>
                  <option value="INDIVIDUAL">Individual (1 Colaborador)</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Periodicidade</label>
                <select
                  value={periodicity}
                  onChange={(e) => setPeriodicity(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="ESPORADICO">Esporádico / Pontual</option>
                  <option value="PERIODICO_MENSAL">Periódico Mensal</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Categoria de Registro</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="PASSAGEM_PLATAOR_ESCALA">Passagem de Plantão e Escala</option>
                  <option value="ALINHAMENTO_OPERACIONAL">Alinhamento Operacional Geral</option>
                  <option value="ORIENTACAO_CONDUTA">Orientação de Conduta e Postura</option>
                  <option value="ORIENTACAO_TECNICA">Orientação Técnica & POPs</option>
                  <option value="RECONHECIMENTO">Reconhecimento & Elogio Formal</option>
                  <option value="DEFINICAO_PAPEL">Definição de Papel e Atribuições</option>
                  <option value="AJUSTE_FERIAS">Ajuste de Férias e Folgas</option>
                  <option value="LIVRE">Registro Livre de Alinhamento</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Assunto / Tópico Central</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  placeholder="Ex: Escala de Cobertura e Transição de Plantão UTI"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Data e Hora</label>
                <input
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Local / Meio da Reunião</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Ex: Sala de Operações DTI / Presencial"
              />
            </div>
          </div>

          {/* 2. Participantes (Multi-participante coletivo) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                2. Participantes Convocados ({participants.length})
              </h3>
              <span className="text-2xs text-slate-500">
                Coleta individual de ciência e assinatura
              </span>
            </div>

            <div className="space-y-2">
              {participants.map((p) => (
                <div key={p.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{p.name}</span>
                      <span className="text-slate-500 text-2xs ml-2">({p.role} · {p.department})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {p.alignmentRole}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(p.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        title="Remover participante"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Individual Statement Input */}
                  <div>
                    <label className="block text-2xs text-slate-500 font-medium mb-1">
                      Manifestação Individual / Declaração de Ciência do Participante:
                    </label>
                    <input
                      type="text"
                      value={p.individualStatement || ''}
                      onChange={(e) => handleUpdateParticipantStatement(p.id, e.target.value)}
                      placeholder="Declaração do colaborador durante o alinhamento..."
                      className="w-full px-2.5 py-1.5 text-2xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Participant Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
              <select
                value={selectedTechToAdd}
                onChange={(e) => setSelectedTechToAdd(Number(e.target.value))}
                className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
              >
                {MOCK_TECHNICIANS.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.groupName})
                  </option>
                ))}
              </select>

              <select
                value={selectedRoleForNew}
                onChange={(e) => setSelectedRoleForNew(e.target.value as any)}
                className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              >
                <option value="PARTICIPANTE">Participante</option>
                <option value="RELATOR">Relator</option>
                <option value="OUVINTE">Ouvinte</option>
              </select>

              <button
                type="button"
                onClick={handleAddParticipant}
                className="px-3 py-1.5 bg-[#134F9F] hover:bg-blue-700 text-white font-semibold rounded text-2xs flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> + Adicionar Participante
              </button>
            </div>
          </div>

          {/* 3. Contexto, Fatos e Orientações */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
              3. Contexto, Fatos Observados e Diretrizes
            </h3>

            <div>
              <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Objetivo da Reunião</label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Fatos ou Situações Observadas</label>
              <textarea
                value={observedFacts}
                onChange={(e) => setObservedFacts(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-500 uppercase mb-1">Diretrizes e Orientações Transmitidas</label>
              <textarea
                value={transmittedOrientations}
                onChange={(e) => setTransmittedOrientations(e.target.value)}
                rows={2}
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          {/* 4. Quadro de Compromissos */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
              4. Quadro de Compromissos e Prazos Firmados ({generalCommitments.length})
            </h3>

            <div className="space-y-2">
              {generalCommitments.map(c => (
                <div key={c.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">{c.description}</p>
                    <p className="text-2xs text-slate-500 mt-1">
                      Resp: <strong>{c.responsibleName}</strong> · Prazo: <strong>{c.deadline}</strong>
                    </p>
                    <p className="text-2xs text-slate-400 italic">Critério: {c.successCriteria}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGeneralCommitments(prev => prev.filter(item => item.id !== c.id))}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Commitment */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
              <input
                type="text"
                value={newGcDesc}
                onChange={(e) => setNewGcDesc(e.target.value)}
                placeholder="Descrição do compromisso ou ação pactuada"
                className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newGcResp}
                  onChange={(e) => setNewGcResp(e.target.value)}
                  placeholder="Responsável"
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  value={newGcDeadline}
                  onChange={(e) => setNewGcDeadline(e.target.value)}
                  placeholder="Prazo"
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
                <input
                  type="text"
                  value={newGcCriteria}
                  onChange={(e) => setNewGcCriteria(e.target.value)}
                  placeholder="Critério de êxito"
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddGeneralCommitment}
                  className="px-3 py-1.5 bg-[#134F9F] hover:bg-blue-700 text-white font-semibold rounded text-2xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Adicionar Compromisso
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
              Homologar Minuta e Gerar Documento Formal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
