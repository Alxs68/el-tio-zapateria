import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (includeSampleTicket1807: boolean) => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [includeRealSample, setIncludeRealSample] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-amber-600 text-stone-950 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-950/20 flex items-center justify-center font-bold">
              <RotateCcw className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Limpieza y Reinicio de Datos
              </h2>
              <p className="text-xs text-stone-900 font-semibold">
                Control de datos para Don Elías, Yadi y Alexis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-950 hover:bg-stone-950/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl text-amber-900 dark:text-amber-200 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <p className="leading-snug">
              Esta opción elimina las órdenes de prueba anteriores para dejar la zapatería 100% limpia para el trabajo real de Don Elías.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
              ¿Cómo deseas iniciar la zapatería?
            </label>

            <button
              type="button"
              onClick={() => setIncludeRealSample(true)}
              className={`w-full p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                includeRealSample
                  ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 text-stone-900 dark:text-white ring-2 ring-amber-600/20'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                includeRealSample ? 'border-amber-600 bg-amber-600 text-stone-950' : 'border-stone-400'
              }`}>
                {includeRealSample && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <span className="font-extrabold text-sm block text-stone-900 dark:text-white">
                  Incluir Recibo Real #1807 (Yanira González)
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-400 block mt-0.5 leading-snug">
                  Carga el recibo verificado de Zapatillas Makey ($23.000, Ficha #13, Jueves). El próximo ticket será el <strong>#1808</strong>.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIncludeRealSample(false)}
              className={`w-full p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                !includeRealSample
                  ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 text-stone-900 dark:text-white ring-2 ring-amber-600/20'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                !includeRealSample ? 'border-amber-600 bg-amber-600 text-stone-950' : 'border-stone-400'
              }`}>
                {!includeRealSample && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <span className="font-extrabold text-sm block text-stone-900 dark:text-white">
                  Totalmente en Blanco (Cero Órdenes)
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-400 block mt-0.5 leading-snug">
                  Sin ninguna orden previa. Inicia la secuencia de recibos desde el ticket #1801.
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmReset(includeRealSample);
                onClose();
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 font-extrabold rounded-xl text-sm shadow-md transition-transform active:scale-95"
            >
              Confirmar y Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
