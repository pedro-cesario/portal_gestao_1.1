/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Sidebar de Navegação Executiva
 * Padrão contraído com Ícones + Abreviações Textuais de Alta Legibilidade
 * Novo seletor de Fonte Ativa (Database / Radio) substituindo caracteres unicode antigos
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Users, 
  AlertCircle, 
  ShieldCheck, 
  BarChart3, 
  Bot, 
  FileSpreadsheet, 
  Layers, 
  Settings, 
  Moon, 
  Sun, 
  LogOut, 
  Hospital, 
  X, 
  Database,
  Radio,
  Sparkles
} from 'lucide-react';
import { NavigationRoute, CurrentUser, NavMenuItemConfig } from '../../types';

interface SidebarProps {
  currentRoute: NavigationRoute;
  onRouteChange: (route: NavigationRoute) => void;
  currentUser: CurrentUser;
  onSwitchUser: (user: CurrentUser) => void;
  allUsers: CurrentUser[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  unassignedCount: number;
  pendingAlertsCount: number;
  dataSource: 'REALTIME' | 'SNAPSHOT_04H';
  onToggleDataSource: () => void;
  menuConfig?: NavMenuItemConfig[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const ROUTE_ICONS: Record<NavigationRoute, React.ElementType> = {
  'visao-geral': LayoutDashboard,
  'chamados': TicketIcon,
  'equipe': Users,
  'pendencias': AlertCircle,
  'auditorias': ShieldCheck,
  'indicadores': BarChart3,
  'agente-gerencial': Bot,
  'daily-paineis': FileSpreadsheet,
  'templates': Layers,
  'configuracoes': Settings,
};

// Abreviações curtas e autoexplicativas para o modo contraído
const ROUTE_ABBREVIATIONS: Record<NavigationRoute, string> = {
  'visao-geral': 'GERAL',
  'chamados': 'CHAM',
  'equipe': 'EQUIPE',
  'pendencias': 'PEND',
  'auditorias': 'AUDIT',
  'indicadores': 'INDIC',
  'agente-gerencial': 'AGENTE',
  'daily-paineis': 'DAILY',
  'templates': 'GUIA',
  'configuracoes': 'CONFIG',
};

const DEFAULT_ITEMS: { id: NavigationRoute; label: string }[] = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'chamados', label: 'Chamados GLPI' },
  { id: 'equipe', label: 'Equipe Técnica' },
  { id: 'pendencias', label: 'Pendências & POP' },
  { id: 'auditorias', label: 'Auditorias (04h)' },
  { id: 'indicadores', label: 'Indicadores' },
  { id: 'agente-gerencial', label: 'Agente Gerencial' },
  { id: 'daily-paineis', label: 'Daily e Painéis' },
  { id: 'templates', label: 'Catálogo de Templates' },
  { id: 'configuracoes', label: 'Configurações' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
  currentUser,
  onSwitchUser,
  allUsers,
  isDarkMode,
  onToggleTheme,
  onLogout,
  unassignedCount,
  pendingAlertsCount,
  dataSource,
  onToggleDataSource,
  menuConfig,
  isCollapsed = true,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) => {
  // No mobile/tablet ou com drawer aberto, a barra NUNCA deve ser recolhida em ícones
  const isEffectiveCollapsed = isCollapsed && !isMobileOpen;

  const effectiveConfig = (menuConfig && menuConfig.length > 0)
    ? menuConfig.filter(m => m.isVisible || m.id === 'configuracoes')
    : DEFAULT_ITEMS;

  const navItems = effectiveConfig.map(cfg => {
    const isChamados = cfg.id === 'chamados';
    const isPendencias = cfg.id === 'pendencias';
    return {
      id: cfg.id,
      label: cfg.label,
      shortLabel: ROUTE_ABBREVIATIONS[cfg.id] || cfg.label.slice(0, 5).toUpperCase(),
      icon: ROUTE_ICONS[cfg.id] || LayoutDashboard,
      badgeCount: isChamados ? unassignedCount : isPendencias ? pendingAlertsCount : undefined,
      badgeAlert: isChamados ? unassignedCount > 0 : isPendencias ? pendingAlertsCount > 0 : false,
    };
  });

  const handleNavClick = (route: NavigationRoute) => {
    onRouteChange(route);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Overlay Backdrop para Mobile e Tablet */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer: Off-canvas no Mobile/Tablet, Fixo/Recolhível no Desktop */}
      <aside 
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50
          ${isEffectiveCollapsed ? 'lg:w-20 w-72' : 'lg:w-68 w-72'} h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
          text-slate-700 dark:text-slate-300 flex flex-col justify-between shrink-0 select-none overflow-hidden
          transition-all duration-200 ease-in-out
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Brand Header & Data Source */}
        <div className="shrink-0">
          <div className={`border-b border-slate-200 dark:border-slate-800 flex items-center ${isEffectiveCollapsed ? 'p-2 flex-col gap-2' : 'px-4 py-3 justify-between'}`}>
            <div className={`flex items-center ${isEffectiveCollapsed ? 'flex-col gap-1.5' : 'gap-2.5'}`}>
              <div 
                className="w-9 h-9 rounded-xl bg-[#134F9F] flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0"
                title="HEAL Ops — Instituto HEAL Hospitalar"
              >
                <Hospital className="w-5 h-5" />
              </div>

              {!isEffectiveCollapsed && (
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">HEAL Ops</span>
                    <span className="text-xs font-bold text-[#134F9F] dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">TI</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">Instituto HEAL Hospitalar</p>
                </div>
              )}
            </div>

            {/* Botão de Fechar Drawer exclusivo para Mobile/Tablet */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Data Source & Clock Bar (Ícones Modernos: Database vs Radio) */}
          <div className={`bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800/80 ${isEffectiveCollapsed ? 'p-2 flex flex-col items-center' : 'px-4 py-2 space-y-1'}`}>
            {isEffectiveCollapsed ? (
              <button
                type="button"
                onClick={onToggleDataSource}
                className={`w-14 h-11 rounded-lg flex flex-col items-center justify-center gap-0.5 border transition-all cursor-pointer shadow-2xs group ${
                  dataSource === 'REALTIME' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100' 
                    : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/50 text-[#134F9F] dark:text-blue-400 hover:bg-blue-100'
                }`}
                title={
                  dataSource === 'REALTIME'
                    ? 'Fonte Ativa: Tempo Real GLPI (Clique para alternar para Snapshot 04h)'
                    : 'Fonte Ativa: Snapshot Oficial das 04h00 (Clique para alternar para Tempo Real)'
                }
              >
                {dataSource === 'REALTIME' ? (
                  <>
                    <Radio className="w-4 h-4 animate-pulse group-hover:scale-110 transition-transform text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[9px] font-mono font-bold leading-none tracking-tight">LIVE</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 group-hover:scale-110 transition-transform text-[#134F9F] dark:text-blue-400" />
                    <span className="text-[9px] font-mono font-bold leading-none tracking-tight">04h</span>
                  </>
                )}
              </button>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fonte Ativa:</span>
                  <button
                    type="button"
                    onClick={onToggleDataSource}
                    className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2 py-1 rounded-md transition-colors cursor-pointer border ${
                      dataSource === 'REALTIME' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100' 
                        : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-[#134F9F] dark:text-blue-400 hover:bg-blue-100'
                    }`}
                    title="Clique para alternar entre dados em tempo real e snapshot oficial 04h"
                  >
                    {dataSource === 'REALTIME' ? (
                      <>
                        <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                        <span>TEMPO REAL</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5 text-[#134F9F] dark:text-blue-400" />
                        <span>SNAPSHOT 04H</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Horário Oficial:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">10:10 (Brasília)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation Items: ÍCONE + ABREVIAÇÃO NO MODO CONTRAÍDO (ZERO SCROLLBAR) */}
        <nav className={`flex-1 min-h-0 flex flex-col justify-evenly overflow-hidden ${isEffectiveCollapsed ? 'px-1.5 py-1' : 'px-3 py-1'}`} aria-label="Navegação Principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                title={`${item.label} (Atalho: ${item.shortLabel})`}
                className={`w-full rounded-xl transition-all cursor-pointer relative group ${
                  isEffectiveCollapsed 
                    ? 'py-1 px-0.5 flex flex-col items-center justify-center gap-1' 
                    : 'flex items-center justify-between px-3 py-2'
                } ${
                  isActive
                    ? 'bg-[#134F9F] text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                {/* Ícone com indicador de alerta/badge */}
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'}`} />

                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className={`absolute -top-1 -right-2.5 min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-mono font-bold leading-none shadow-2xs ${
                      isActive 
                        ? 'bg-rose-500 text-white ring-1 ring-white' 
                        : 'bg-rose-600 text-white ring-1 ring-white dark:ring-slate-900'
                    }`}>
                      {item.badgeCount}
                    </span>
                  )}
                </div>

                {/* No modo contraído: Abreviação textual em maiúsculas */}
                {isEffectiveCollapsed && (
                  <span className={`text-[9.5px] font-bold tracking-tight uppercase leading-none font-mono ${
                    isActive 
                      ? 'text-white' 
                      : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                  }`}>
                    {item.shortLabel}
                  </span>
                )}

                {/* No modo expandido: Rótulo completo com badge lateral */}
                {!isEffectiveCollapsed && (
                  <>
                    <span className="truncate font-semibold text-sm">{item.label}</span>
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md font-mono ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : item.badgeAlert 
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {item.badgeCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile, Theme and System Health */}
        <div className={`shrink-0 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 ${isEffectiveCollapsed ? 'p-2 space-y-1.5 flex flex-col items-center' : 'p-3 space-y-2'}`}>
          {isEffectiveCollapsed ? (
            <>
              {/* Collapsed Avatar Circle */}
              <div 
                className="w-9 h-9 rounded-xl bg-blue-500/15 text-[#134F9F] dark:text-blue-300 font-bold text-xs flex items-center justify-center cursor-pointer border border-blue-200 dark:border-blue-800 shadow-2xs hover:scale-105 transition-transform"
                title={`${currentUser.name} (${currentUser.role}) — ${currentUser.department}`}
              >
                {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>

              {/* Theme & Logout Icons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
                >
                  {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Sair da sessão"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* User Switcher for Testing Profiles */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Perfil Ativo</span>
                  <span className="text-xs font-bold text-[#134F9F] dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                    {currentUser.role}
                  </span>
                </div>
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const u = allUsers.find(x => x.id === e.target.value);
                    if (u) onSwitchUser(u);
                  }}
                  className="w-full text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">
                  {currentUser.department}
                </div>
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Alternar entre modo escuro e claro"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
                  <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Sair da sessão"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
