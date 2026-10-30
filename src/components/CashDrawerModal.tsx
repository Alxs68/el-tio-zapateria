import React, { useEffect } from 'react';
import { FinancialSummary } from '../types';
import { formatCOP } from '../utils/formatters';
import { 
  Lock, 
  EyeOff, 
  DollarSign, 
  Smartphone, 
  TrendingUp, 
  Receipt, 
  Utensils, 
  AlertCircle,
  X,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface CashDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: FinancialSummary;
  onOpenExpenseModal: () => void;
  onOpenReportsTab?: () => void;
}

export const CashDrawerModal: React.FC<CashDrawerModalProps> = ({
  isOpen,
  onClose,
  summary,
  onOpenExpenseModal,
  onOpenReportsTab,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-stone-900 border-2 border-stone-700 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden text-stone-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Discreet & Secure */}
        <div className="bg-stone-800/90 border-b border-stone-700 p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Cuadre de Caja del Día
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Privado
                </span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm font-medium mt-0.5">
                Clínica de Calzado "El Tío" · Local 188 C.C. Santiago Plaza
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-stone-700/60 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title="Ocultar y volver al mostrador (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Privacy Notice */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              Cifras protegidas. Recuerde cerrar esta ventana al atender al cliente en mostrador.
            </span>
          </div>

          {/* MAIN CASH IN DRAWER (EFECTIVO EN GAVETA) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-stone-900 border-2 border-emerald-600/60 text-center shadow-lg">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-300 block">
              💵 Efectivo Real en Gaveta Hoy
            </span>
            <div className="text-3xl sm:text-5xl font-black text-emerald-400 tabular-nums my-2">
              {formatCOP(summary.expectedCashInDrawer)}
            </div>
            <p className="text-xs text-stone-300 font-medium">
              Dinero en billetes y monedas que debe haber en la caja física ahora mismo
            </p>
          </div>

          {/* BREAKDOWN OF TODAY'S MONEY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Cash Collected Today */}
            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700">
              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase mb-1">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Cobrado en Efectivo Hoy</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">
                {formatCOP(summary.todayCashCollected)}
              </div>
              <span className="text-[11px] text-stone-400 font-medium">
                Anticipos y entregas en físico
              </span>
            </div>

            {/* Nequi / Daviplata Collected Today */}
            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700">
              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase mb-1">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span>Nequi / Daviplata Hoy</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-sky-400 tabular-nums">
                {formatCOP(summary.todayNequiDaviplataCollected)}
              </div>
              <span className="text-[11px] text-stone-400 font-medium">
                Transferencias recibidas
              </span>
            </div>

            {/* Total Revenue Today */}
            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700">
              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase mb-1">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Total Facturado Hoy</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                {formatCOP(summary.todayRevenue)}
              </div>
              <span className="text-[11px] text-stone-400 font-medium">
                Efectivo + Transferencias
              </span>
            </div>

            {/* Expenses Today */}
            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700">
              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase mb-1">
                <Receipt className="w-4 h-4 text-red-400" />
                <span>Gastos Salidos de Gaveta</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-red-400 tabular-nums">
                -{formatCOP(summary.todayExpenses)}
              </div>
              <span className="text-[11px] text-stone-400 font-medium">
                Almuerzos, pegantes o compras
              </span>
            </div>
          </div>

          {/* QUICK EXPENSE ACTION */}
          <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>¿Salió plata para el almuerzo o materiales?</span>
              </h4>
              <p className="text-xs text-stone-400 font-medium">
                Regístrelo para que el cuadre de caja al final del día sea exacto.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenExpenseModal();
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shrink-0 shadow-md"
            >
              💸 Anotar Gasto / Almuerzo
            </button>
          </div>

          {/* Full Report Option (For Yadi / Alexis) */}
          {onOpenReportsTab && (
            <button
              onClick={() => {
                onClose();
                onOpenReportsTab();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-stone-700"
            >
              <span>Ver reporte histórico detallado y arqueos de caja</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Footer with Big Ocultar Button */}
        <div className="bg-stone-800/80 border-t border-stone-700 p-4 sm:p-5 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <EyeOff className="w-5 h-5" />
            <span>Ocultar Cifras y Volver al Mostrador</span>
          </button>
        </div>
      </div>
    </div>
  );
};
