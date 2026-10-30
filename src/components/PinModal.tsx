import React, { useState, useEffect } from 'react';
import { Lock, Delete, X, ShieldAlert, KeyRound, Check } from 'lucide-react';
import { StorageService } from '../services/storage';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Acceso Seguro a Caja y Finanzas',
  description = 'Ingrese la clave de 4 dígitos para consultar los números de dinero y movimientos de caja.',
}) => {
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changeSuccessMsg, setChangeSuccessMsg] = useState<string | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMessage(null);
      setIsChangingPin(false);
      setNewPin('');
      setConfirmPin('');
      setChangeSuccessMsg(null);
    }
  }, [isOpen]);

  // Handle keyboard inputs
  useEffect(() => {
    if (!isOpen || isChangingPin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
        setErrorMessage(null);
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        if (pin.length < 4) {
          const next = pin + e.key;
          setPin(next);
          setErrorMessage(null);
          if (next.length === 4) {
            verifyAndProceed(next);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin, isChangingPin]);

  const verifyAndProceed = (pinToCheck: string) => {
    const isValid = StorageService.verifyFinancePin(pinToCheck);
    if (isValid) {
      setErrorMessage(null);
      onSuccess();
    } else {
      setErrorMessage('Clave incorrecta. Intente de nuevo.');
      setTimeout(() => {
        setPin('');
      }, 500);
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const next = pin + num;
      setPin(next);
      setErrorMessage(null);
      if (next.length === 4) {
        verifyAndProceed(next);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setErrorMessage('La nueva clave debe tener 4 dígitos.');
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMessage('Las dos claves no coinciden.');
      return;
    }
    StorageService.setFinancePin(newPin);
    setChangeSuccessMsg('¡Clave actualizada correctamente!');
    setTimeout(() => {
      setIsChangingPin(false);
      setPin('');
      setNewPin('');
      setConfirmPin('');
      setChangeSuccessMsg(null);
      onSuccess();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-stone-900 border-2 border-stone-700 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden text-stone-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight">
                {title}
              </h3>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Privado del Mostrador
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-5">
          {!isChangingPin ? (
            <>
              <div>
                <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed">
                  {description}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  (Clave predeterminada inicial: <strong className="text-stone-300 font-mono">1234</strong>)
                </p>
              </div>

              {/* 4 Digit Dots Indicator */}
              <div className="flex items-center justify-center gap-4 py-2">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pin.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full transition-all duration-150 ${
                        isFilled
                          ? 'bg-amber-400 scale-125 shadow-md shadow-amber-500/50'
                          : 'border-2 border-stone-700 bg-stone-800'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-bounce">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Numeric Keypad (Optimized for finger touch & speed) */}
              <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeyPress(digit)}
                    className="h-13 sm:h-14 rounded-2xl bg-stone-800/90 hover:bg-stone-750 active:bg-amber-500 active:text-stone-950 border border-stone-700 text-xl font-black text-white transition-all shadow-sm flex items-center justify-center"
                  >
                    {digit}
                  </button>
                ))}
                
                <button
                  onClick={() => setIsChangingPin(true)}
                  className="h-13 sm:h-14 rounded-2xl bg-stone-800/40 hover:bg-stone-800 text-stone-400 hover:text-amber-400 text-xs font-bold transition-all flex flex-col items-center justify-center"
                  title="Cambiar PIN"
                >
                  <KeyRound className="w-4 h-4 mb-0.5" />
                  <span className="text-[9px]">Cambiar</span>
                </button>

                <button
                  onClick={() => handleKeyPress('0')}
                  className="h-13 sm:h-14 rounded-2xl bg-stone-800/90 hover:bg-stone-750 active:bg-amber-500 active:text-stone-950 border border-stone-700 text-xl font-black text-white transition-all shadow-sm flex items-center justify-center"
                >
                  0
                </button>

                <button
                  onClick={handleDelete}
                  className="h-13 sm:h-14 rounded-2xl bg-stone-800/40 hover:bg-stone-800 active:bg-stone-700 text-stone-300 hover:text-white text-sm font-bold transition-all flex items-center justify-center"
                  title="Borrar dígito"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              {/* Secondary return action */}
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="text-xs text-stone-400 hover:text-stone-200 font-semibold transition-colors"
                >
                  ← Cancelar y volver al mostrador
                </button>
              </div>
            </>
          ) : (
            /* Change PIN form */
            <form onSubmit={handleSaveNewPin} className="space-y-4 text-left">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Nueva Clave de Seguridad
                </span>
                <p className="text-xs text-stone-400 mb-3">
                  Asigne un PIN de 4 dígitos fácil de recordar para el dueño y administrador.
                </p>
              </div>

              {changeSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{changeSuccessMsg}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-bold">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  Nuevo PIN (4 dígitos numéricos)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  className="w-full text-center tracking-widest text-2xl font-black py-2.5 bg-stone-950 border border-stone-700 rounded-xl focus:border-amber-400 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  Confirmar Nuevo PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  className="w-full text-center tracking-widest text-2xl font-black py-2.5 bg-stone-950 border border-stone-700 rounded-xl focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(false);
                    setErrorMessage(null);
                  }}
                  className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black rounded-xl transition-colors shadow-sm"
                >
                  Guardar PIN
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
