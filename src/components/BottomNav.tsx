import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Users, 
  BarChart3 
} from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'orders' | 'clients' | 'catalog' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'orders' | 'clients' | 'catalog' | 'reports') => void;
  onOpenNewOrder: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewOrder,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 text-stone-300">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Tablero</span>
        </button>

        {/* Tab 2: Orders */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'orders' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Órdenes</span>
        </button>

        {/* Central Prominent CTA: Nueva Reparación */}
        <div className="flex items-center justify-center -mt-5">
          <button
            onClick={onOpenNewOrder}
            aria-label="Registrar Nueva Reparación"
            className="w-13 h-13 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-900/40 active:scale-95 transition-transform border-3 border-stone-900"
          >
            <PlusCircle className="w-7 h-7 text-stone-950" />
          </button>
        </div>

        {/* Tab 4: Clientes */}
        <button
          onClick={() => setActiveTab('clients')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'clients' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Clientes</span>
        </button>

        {/* Tab 5: Caja & Finanzas (Protegido) */}
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
            activeTab === 'reports' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1 flex items-center gap-0.5">
            <span>Finanzas</span>
            <span className="text-[9px]">🔒</span>
          </span>
        </button>

      </div>
    </nav>
  );
};
