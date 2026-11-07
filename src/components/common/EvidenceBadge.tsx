/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Componente de Camadas de Conclusão / Evidência
 * Diferenciação visual clara e acessível entre Fato, Indício, Verificação e Desconformidade
 */

import React from 'react';
import { EvidenceLevel } from '../../types';
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';

interface EvidenceBadgeProps {
  level: EvidenceLevel;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ 
  level, 
  size = 'md',
  showIcon = true 
}) => {
  const config = {
    'Fato confirmado': {
      text: 'Fato confirmado',
      icon: CheckCircle2,
      style: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 font-semibold',
      description: 'Comprovado por logs, registros biométricos ou validação física.'
    },
    'Indício de desconformidade': {
      text: 'Indício de desconformidade',
      icon: AlertTriangle,
      style: 'text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 font-semibold',
      description: 'Sinalizador operacional que requer checagem; não constitui falta culposa.'
    },
    'Verificação necessária': {
      text: 'Verificação necessária',
      icon: HelpCircle,
      style: 'text-sky-900 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700 font-semibold',
      description: 'Informação pendente de protocolo externo ou retorno de terceiros.'
    },
    'Desconformidade confirmada': {
      text: 'Desconformidade confirmada',
      icon: XCircle,
      style: 'text-rose-900 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 font-semibold',
      description: 'Violação objetiva documentada das regras POP-TIN vigentes.'
    }
  }[level];

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded ${sizeClasses} ${config.style}`}
      title={config.description}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{config.text}</span>
    </span>
  );
};
