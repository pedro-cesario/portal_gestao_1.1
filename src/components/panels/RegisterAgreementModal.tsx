/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Modal de Registro de Acordo de Reunião (+ Registrar acordo)
 * Projetado para uso ágil durante reuniões Daily (TPL-01) e Alinhamento Semanal (TPL-02),
 * acessível tanto na visualização padrão quanto dentro do Modo Apresentação.
 */

import React, { useState } from 'react';
import { 
  X, 
  Handshake, 
  CheckCircle2, 
  Clock, 
  User, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Tag, 
  FileText,
  Save,
  Radio
} from 'lucide-react';
import { 
  MeetingAgreement, 
  AgreementType, 
  AgreementPriority, 
  AgreementDestination, 
  AgreementStatus, 
  SourceMeetingType,
  CurrentUser 
} from '../../types';

interface RegisterAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceMeetingType: SourceMeetingType;
  sourceArtifactId?: string;
  meetingReferenceDate?: string;
  defaultTicketId?: number;
  currentUser?: CurrentUser | null;
  onSaveAgreement: (newAgreement: MeetingAgreement) => void;
}

export const RegisterAgreementModal: React.FC<RegisterAgreementModalProps> = ({
  isOpen,
  onClose,
  sourceMeetingType,
  sourceArtifactId,
  meetingReferenceDate = 'Hoje (06/11/2026)',
  defaultTicketId,
  currentUser,
  onSaveAgreement
}) => {
  if (!isOpen) return null;

  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<AgreementType>('tarefa');
  const [responsibleName, setResponsibleName] = useState<string>('Mariana Costa');
  const [customResponsible, setCustomResponsible] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('Hoje às 16:00');
  const [priority, setPriority] = useState<AgreementPriority>('ALTA');
  const [destination, setDestination] = useState<AgreementDestination>(defaultTicketId ? 'GLPI' : 'GESTAO_HEAL');
  const [relatedTicketId, setRelatedTicketId] = useState<string>(defaultTicketId ? String(defaultTicketId) : '');
  const [notes, setNotes] = useState<string>('');
  const [evidenceText, setEvidenceText] = useState<string>('');
  const [status, setStatus] = useState<AgreementStatus>('CONFIRMADO'); // Gestor pode confirmar direto durante a reunião

  const teamMembers = [
    { id: 101, name: 'Mariana Costa', role: 'Sistemas Clínicos' },
    { id: 102, name: 'Carlos Eduardo', role: 'Infraestrutura' },
    { id: 103, name: 'Rafael Albuquerque', role: 'Suporte UTI' },
    { id: 105, name: 'Lucas Mendes', role: 'Suporte Presencial N1/N2' },
    { id: 104, name: 'Fernanda Lima', role: 'Sistemas Tasy' },
    { id: 4801, name: 'Dr. Roberto Silveira (Grupo 48)', role: 'Coordenação TI' },
    { id: 1, name: currentUser?.name || 'Henrique Vasconcelos', role: 'Gestor TI' }
  ];

  const handleTypeSelect = (selectedType: AgreementType) => {
    setType(selectedType);
    if (selectedType === 'decisao') {
      setDestination('GESTAO_HEAL');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const assignedName = responsibleName === 'OUTRO' ? customResponsible.trim() || 'Não atribuído' : responsibleName;
    const authorName = currentUser?.name || 'Henrique Vasconcelos';
    const nowTimestamp = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newAgreement: MeetingAgreement = {
      agreementId: `AGR-${Date.now().toString().slice(-6)}`,
      sourceArtifactId,
      sourceMeetingType,
      meetingReferenceDate,
      isPreviousMeeting: false,
      description: description.trim(),
      type,
      responsibleName: assignedName,
      deadline: deadline.trim() || 'Conforme alinhamento',
      priority,
      status,
      destination,
      relatedTicketId: relatedTicketId ? parseInt(relatedTicketId, 10) : undefined,
      evidenceRefs: evidenceText.trim() ? evidenceText.split(';').map(s => s.trim()).filter(Boolean) : undefined,
      notes: notes.trim() || undefined,
      createdAt: nowTimestamp,
      confirmedAt: status === 'CONFIRMADO' ? nowTimestamp : undefined,
      confirmedBy: status === 'CONFIRMADO' ? authorName : undefined,
      updatedAt: nowTimestamp,
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: nowTimestamp,
          author: authorName,
          action: status === 'CONFIRMADO' ? 'Acordo registrado e confirmado na reunião' : 'Acordo registrado como rascunho',
          newStatus: status,
          notes: notes.trim() || undefined
        }
      ]
    };

    onSaveAgreement(newAgreement);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-[#134F9F]/10 text-[#134F9F] dark:text-blue-400 shrink-0">
              <Handshake className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                  Registrar Acordo da Reunião
                </h2>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-[#134F9F] dark:text-blue-400 border border-blue-500/20">
                  {sourceMeetingType === 'DAILY' ? 'Daily' : 'Alinhamento'}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Ref: {meetingReferenceDate} · Registrado por {currentUser?.name || 'Gestor'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
            {/* 1. Tipo de Acordo */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tipo de Acordo:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['tarefa', 'decisao', 'encaminhamento', 'compromisso'] as AgreementType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeSelect(t)}
                    className={`py-1.5 px-2 rounded-lg border text-center font-semibold capitalize text-xs transition-colors cursor-pointer ${
                      type === t
                        ? 'border-[#134F9F] bg-blue-500/15 text-[#134F9F] dark:text-blue-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Descrição do Acordo */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Descrição do Acordo / Encaminhamento <span className="text-rose-500">*</span>:
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Trocar transceiver SFP e normalizar enlace de telemetria leitos 12-14..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 3. Responsável e Prazo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Responsável:
                </label>
                <select
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                  <option value="OUTRO">Outro / Terceiro...</option>
                </select>
                {responsibleName === 'OUTRO' && (
                  <input
                    type="text"
                    placeholder="Nome do responsável..."
                    value={customResponsible}
                    onChange={(e) => setCustomResponsible(e.target.value)}
                    className="w-full mt-1.5 p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                  />
                )}
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Prazo de Conclusão:
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Ex: Hoje às 16:00, 07/11 às 12:00..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 4. Prioridade e Destino */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Prioridade:
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as AgreementPriority)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="P1_CRITICA">P1 Crítica (Urgência Assistencial)</option>
                  <option value="ALTA">Alta Prioridade</option>
                  <option value="MEDIA">Média Prioridade</option>
                  <option value="BAIXA">Baixa Prioridade</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Destino do Acordo:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDestination('GLPI')}
                    className={`p-2 rounded-lg border text-center font-semibold text-xs transition-colors cursor-pointer ${
                      destination === 'GLPI'
                        ? 'border-blue-500 bg-blue-500/15 text-[#134F9F] dark:text-blue-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    Chamado GLPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setDestination('GESTAO_HEAL')}
                    className={`p-2 rounded-lg border text-center font-semibold text-xs transition-colors cursor-pointer ${
                      destination === 'GESTAO_HEAL'
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    Gestão HEAL
                  </button>
                </div>
              </div>
            </div>

            {/* Chamado GLPI Relacionado (Se destino for GLPI ou houver vínculo) */}
            {destination === 'GLPI' && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ID do Chamado GLPI Vinculado:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={relatedTicketId}
                    onChange={(e) => setRelatedTicketId(e.target.value)}
                    placeholder="Ex: 48219"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    * O acordo será associado ao histórico de governança do chamado, sem alterar SLA automaticamente.
                  </span>
                </div>
              </div>
            )}

            {/* 5. Situação / Confirmação */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Situação do Registro:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setStatus('CONFIRMADO')}
                  className={`py-1.5 px-2 rounded-lg border text-center font-semibold text-xs transition-colors cursor-pointer ${
                    status === 'CONFIRMADO'
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ✓ Confirmado pelo Gestor
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('AGUARDANDO_CONFIRMACAO')}
                  className={`py-1.5 px-2 rounded-lg border text-center font-semibold text-xs transition-colors cursor-pointer ${
                    status === 'AGUARDANDO_CONFIRMACAO'
                      ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Aguardando Confirmação
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('RASCUNHO')}
                  className={`py-1.5 px-2 rounded-lg border text-center font-semibold text-xs transition-colors cursor-pointer ${
                    status === 'RASCUNHO'
                      ? 'border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Rascunho
                </button>
              </div>
            </div>

            {/* Observações Opcionais */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Observações / Evidências Relacionadas:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Alinhado diretamente com enfermeira-chefe da UTI..."
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-md cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!description.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md shadow-xs cursor-pointer transition-colors disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Gravar Acordo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
