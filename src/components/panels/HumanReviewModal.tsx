/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Modal de Revisão Humana e Homologação Gerencial
 * Atende ao item de governança: o Agente gera a minuta, o gestor humano revisa,
 * ajusta notas, assina e homologa o artefato.
 */

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Edit3, 
  Save, 
  User, 
  Clock, 
  FileCheck 
} from 'lucide-react';
import { ArtifactPanel } from '../../types';

interface HumanReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  panel: ArtifactPanel;
  onSaveReviewedPanel: (reviewedPanel: ArtifactPanel) => void;
}

export const HumanReviewModal: React.FC<HumanReviewModalProps> = ({
  isOpen,
  onClose,
  panel,
  onSaveReviewedPanel
}) => {
  if (!isOpen) return null;

  const [headline, setHeadline] = useState<string>(panel.summary.headline);
  const [decisionsSummary, setDecisionsSummary] = useState<string>(panel.summary.keyDecisionsSummary);
  const [reviewerNotes, setReviewerNotes] = useState<string>(
    panel.humanReview?.notes || 'Validado conforme diretrizes operacionais do plantão. Indicadores consistentes com a réplica GLPI.'
  );
  const [status, setStatus] = useState<'APROVADO' | 'EM_REVISAO' | 'RASCUNHO'>('APROVADO');

  const handleSave = () => {
    const updated: ArtifactPanel = {
      ...panel,
      status: status,
      summary: {
        ...panel.summary,
        headline,
        keyDecisionsSummary: decisionsSummary
      },
      humanReview: {
        reviewedBy: 'Henrique Vasconcelos (Gestor TI)',
        reviewedAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        notes: reviewerNotes,
        status: status
      },
      version: status === 'APROVADO' ? `${panel.version} (Homologado)` : `${panel.version} (Revisado)`
    };

    onSaveReviewedPanel(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-[#134F9F] dark:text-blue-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Revisão e Homologação Gerencial
              </h2>
              <p className="text-xs text-slate-500">
                {panel.templateType} · {panel.title}
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
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status Selection */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Status da Homologação
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('APROVADO')}
                className={`p-2 rounded-lg border text-center font-semibold transition-all cursor-pointer ${
                  status === 'APROVADO'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                ✓ Aprovado / Homologado
              </button>
              <button
                type="button"
                onClick={() => setStatus('EM_REVISAO')}
                className={`p-2 rounded-lg border text-center font-semibold transition-all cursor-pointer ${
                  status === 'EM_REVISAO'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                ✎ Em Revisão
              </button>
              <button
                type="button"
                onClick={() => setStatus('RASCUNHO')}
                className={`p-2 rounded-lg border text-center font-semibold transition-all cursor-pointer ${
                  status === 'RASCUNHO'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Rascunho
              </button>
            </div>
          </div>

          {/* Headline Edit */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Conclusão Sintética Principal (Executive Headline)
            </label>
            <textarea
              rows={3}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 leading-relaxed"
              placeholder="Ajuste a síntese executiva do painel..."
            />
          </div>

          {/* Key Decisions Edit */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Decisões e Encaminhamentos Centrais
            </label>
            <textarea
              rows={2}
              value={decisionsSummary}
              onChange={(e) => setDecisionsSummary(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 leading-relaxed"
              placeholder="Decisões tomadas pela gestão..."
            />
          </div>

          {/* Reviewer Notes */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Parecer / Notas de Homologação do Gestor
            </label>
            <input
              type="text"
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="Parecer da revisão..."
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Assinado digitalmente por <strong>Henrique Vasconcelos (Gestor TI)</strong>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-md cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar & Homologar no Catálogo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
