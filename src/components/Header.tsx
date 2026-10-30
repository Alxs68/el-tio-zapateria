import React from 'react';
import { StaffMember, AppMode } from '../types';
import { 
  Wrench, 
  UserCheck, 
  Plus, 
  Search, 
  Info, 
  RotateCcw,
  BookOpen,
  Glasses,
  LayoutDashboard,
  Lock,
  KeyRound
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'orders' | 'clients' | 'catalog' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'orders' | 'clients' | 'catalog' | 'reports') => void;
  appMode: AppMode;
  onToggleAppMode: () => void;
  activeUser: StaffMember;
  staffList: StaffMember[];
  onSwitchUser: (staff: StaffMember) => void;
  onOpenNewOrder: () => void;
  onOpenQuickSearch: () => void;
  onOpenArchitectureModal: () => void;
  onOpenUserManual: () => void;
  onOpenResetModal: () => void;
  onOpenChangePassword?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  appMode,
  onToggleAppMode,
  activeUser,
  staffList,
  onSwitchUser,
  onOpenNewOrder,
  onOpenQuickSearch,
  onOpenArchitectureModal,
  onOpenUserManual,
  onOpenResetModal,
  onOpenChangePassword,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-3 h-16 sm:h-18">
        
        {/* Zone 1: Brand title matching physical receipt */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-black shadow-md text-xl">
              👞
            </div>
            <div>
              <span className="text-base sm:text-xl font-black tracking-tight text-white block leading-tight">
                El Tío · Calzado y Ropa
              </span>
              <span className="text-[10px] sm:text-xs text-amber-400 font-bold tracking-wide uppercase block">
                NIT 17.018.382-1 · C.C. Santiago Plaza
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Visible in Supervisión mode) */}
        {appMode === 'SUPERVISION' && (
          <nav className="hidden lg:flex items-center gap-5 text-sm font-bold text-stone-300">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors py-1 ${
                activeTab === 'dashboard' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-white'
              }`}
            >
              Tablero
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`transition-colors py-1 ${
                activeTab === 'orders' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-white'
              }`}
            >
              Todas las Facturas
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`transition-colors py-1 ${
                activeTab === 'clients' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-white'
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`transition-colors py-1 ${
                activeTab === 'catalog' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-white'
              }`}
            >
              Tarifas
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'reports' ? 'text-amber-400 border-b-2 border-amber-400' : 'hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Caja & Finanzas</span>
            </button>
          </nav>
        )}

        {/* Zone 3: Mode Switcher & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Main Mode Toggle */}
          {appMode === 'DON_ELIAS' ? (
            <button
              onClick={onToggleAppMode}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black bg-stone-800 hover:bg-stone-750 text-amber-300 border-2 border-stone-700 hover:border-amber-400 flex items-center gap-1.5 transition-all shadow-sm"
              title="Acceder a Administración y Caja (Requiere Contraseña)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Administración 🔒</span>
              <span className="sm:hidden">Admin 🔒</span>
            </button>
          ) : (
            <button
              onClick={onToggleAppMode}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center gap-1.5 transition-all shadow-sm ring-2 ring-amber-400/50"
              title="Bloquear administración y regresar a Mostrador El Tío"
            >
              <Glasses className="w-4 h-4 text-stone-950" />
              <span className="hidden sm:inline">Volver a Mostrador El Tío</span>
              <span className="sm:hidden">Mostrador</span>
            </button>
          )}

          {/* Secure Change Password Button */}
          {onOpenChangePassword && (
            <button
              onClick={onOpenChangePassword}
              className="p-2 sm:px-2.5 sm:py-2 bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 border border-stone-700 transition-colors"
              title="Cambiar contraseña de administración de forma segura"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline">Clave</span>
            </button>
          )}

          {/* Quick Search */}
          <button
            onClick={onOpenQuickSearch}
            className="p-2 sm:px-3 sm:py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700"
            title="Buscar por celular o ficha"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline">Buscar...</span>
          </button>

          {/* User selection (Only Don Elías, Yadi, Alexis) */}
          <div className="hidden sm:flex items-center bg-stone-800 border border-stone-700 rounded-xl p-1 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-1" />
            <select
              value={activeUser.id}
              onChange={(e) => {
                const found = staffList.find((s) => s.id === e.target.value);
                if (found) onSwitchUser(found);
              }}
              className="bg-transparent text-stone-200 text-xs font-bold focus:outline-none cursor-pointer pr-1 py-1"
            >
              {staffList.slice(0, 3).map((staff) => (
                <option key={staff.id} value={staff.id} className="bg-stone-900 text-stone-100">
                  {staff.name.split(' ')[0]} ({staff.role === 'ADMIN' ? 'Admin' : 'Taller'})
                </option>
              ))}
            </select>
          </div>

          {/* Reset button (Supervisión) */}
          {appMode === 'SUPERVISION' && (
            <button
              onClick={onOpenResetModal}
              className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-colors"
              title="Limpieza y reinicio a cero"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
