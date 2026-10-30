import React, { useState } from 'react';
import { CashExpense } from '../types';
import { formatCOP } from '../utils/formatters';
import { X, DollarSign, Utensils, Wrench, Users, HelpCircle } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<CashExpense, 'id'>) => void;
  activeUserName: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  activeUserName,
}) => {
  const [amount, setAmount] = useState<number>(15000);
  const [category, setCategory] = useState<CashExpense['category']>('ALMUERZO');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError('Por favor ingrese un valor de gasto válido en pesos.');
      return;
    }
    if (!description.trim()) {
      setError('Por favor indique en qué se gastó el dinero (ej. Almuerzo Don Elías, Pegante boxer, etc.).');
      return;
    }

    onSaveExpense({
      date: new Date().toISOString(),
      amount,
      category,
      description: description.trim(),
      registeredBy: activeUserName,
    });

    onClose();
    // Reset form
    setDescription('');
    setAmount(15000);
    setError(null);
  };

  const quickAmounts = [5000, 10000, 15000, 20000, 30000, 50000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xl">
              💸
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Anotar Gasto / Salida de Caja
              </h2>
              <p className="text-xs text-red-100 font-medium">
                Descuenta del efectivo físico en la gaveta del mostrador
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">
              Valor del Gasto (en Pesos COP)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-stone-400">
                $
              </span>
              <input
                type="number"
                min="500"
                step="500"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-2xl font-black text-stone-900 dark:text-white focus:outline-none focus:border-red-600 tabular-nums"
                placeholder="15000"
                required
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    amount === q
                      ? 'bg-red-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  ${(q / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">
              Categoría del Gasto
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCategory('ALMUERZO');
                  if (!description) setDescription('Almuerzo Don Elías / Taller');
                }}
                className={`p-3 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all ${
                  category === 'ALMUERZO'
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold ring-2 ring-red-600/20'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                }`}
              >
                <Utensils className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">Almuerzo / Comida</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('MATERIALES');
                  if (!description) setDescription('Pegante / Tintas / Materiales');
                }}
                className={`p-3 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all ${
                  category === 'MATERIALES'
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold ring-2 ring-red-600/20'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                }`}
              >
                <Wrench className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">Materiales / Pegante</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('PAGO_ZAPATERO');
                  if (!description) setDescription('Pago 50% mano de obra zapatero');
                }}
                className={`p-3 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all ${
                  category === 'PAGO_ZAPATERO'
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold ring-2 ring-red-600/20'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                }`}
              >
                <Users className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">Pago Zapatero (50%)</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('OTRO')}
                className={`p-3 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all ${
                  category === 'OTRO'
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold ring-2 ring-red-600/20'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                }`}
              >
                <HelpCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">Otro Gasto</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">
              Detalle / Motivo del Gasto
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Almuerzo Don Elías, Compra de pegante boxer, Pasaje..."
              className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-base font-medium text-stone-900 dark:text-white focus:outline-none focus:border-red-600"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>Guardar Gasto ({formatCOP(amount)})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
