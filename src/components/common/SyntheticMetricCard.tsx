/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — SyntheticMetricCard (Cartão Sintético de Nível 1 com Acionador para Nível 2)
 */

import React from 'react';
import { ChevronRight, Info } from 'lucide-react';

interface SyntheticMetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  alertLevel?: 'none' | 'warning' | 'critical' | 'info';
  formulaExplanation?: string;
  onClickDetail?: () => void;
  ctaText?: string;
  compact?: boolean;
}

export const SyntheticMetricCard: React.FC<SyntheticMetricCardProps> = ({
  label,
  value,
  subtext,
  trend,
  alertLevel = 'none',
  formulaExplanation,
  onClickDetail,
  ctaText = 'Detalhar',
  compact = false
}) => {
  const borderStyles = {
    none: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
    info: 'border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20',
    warning: 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20',
    critical: 'border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20',
  }[alertLevel];

  return (
    <div 
      className={`relative flex flex-col justify-between rounded-lg bg-white dark:bg-slate-900 border transition-all duration-150 ${borderStyles} group shadow-xs hover:shadow-sm ${
        compact ? 'p-2 sm:p-2.5' : 'p-3 sm:p-3.5'
      }`}
    >
      <div>
        <div className={`flex items-center justify-between gap-1.5 ${compact ? 'mb-1' : 'mb-1.5'}`}>
          <span className={`${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-bold text-slate-800 dark:text-slate-200 truncate`}>
            {label}
          </span>
          {formulaExplanation && (
            <button
              type="button"
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer shrink-0"
              title={formulaExplanation}
              aria-label={`Explicação da fórmula para ${label}`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className={`${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono tabular-nums leading-none`}>
            {value}
          </span>
          {trend && (
            <span className={`text-[11px] font-bold font-mono ${
              trend.isNeutral 
                ? 'text-slate-600 dark:text-slate-400' 
                : trend.isPositive 
                  ? 'text-emerald-700 dark:text-emerald-400' 
                  : 'text-amber-700 dark:text-amber-400'
            }`}>
              {trend.value}
            </span>
          )}
        </div>

        {subtext && (
          <p className={`${compact ? 'mt-1 text-[11px]' : 'mt-1.5 text-xs'} text-slate-600 dark:text-slate-400 line-clamp-1 leading-normal font-medium`}>
            {subtext}
          </p>
        )}
      </div>

      {onClickDetail && (
        <div className={`${compact ? 'mt-1.5 pt-1.5' : 'mt-2.5 pt-2'} border-t border-slate-200 dark:border-slate-800 flex items-center justify-between`}>
          <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono font-medium">
            Sintético
          </span>
          <button
            type="button"
            onClick={onClickDetail}
            className="inline-flex items-center gap-0.5 text-xs font-bold text-[#134F9F] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            <span>{ctaText}</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};
