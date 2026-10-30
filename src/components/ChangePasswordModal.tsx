import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  X, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  activeUserName?: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  activeUserName = 'Administrador',
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Verify current password
    if (!StorageService.verifyFinancePin(currentPassword)) {
      setError('La contraseña actual es incorrecta. Verifíquela e intente de nuevo.');
      return;
    }

    // 2. Validate new password length
    if (newPassword.trim().length < 4) {
      setError('La nueva contraseña debe tener como mínimo 4 caracteres o dígitos.');
      return;
    }

    // 3. Must not be the same as current
    if (newPassword.trim() === currentPassword.trim()) {
      setError('La nueva contraseña no puede ser idéntica a la anterior.');
      return;
    }

    // 4. Confirmation match
    if (newPassword !== confirmPassword) {
      setError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    // 5. Save securely
    try {
      StorageService.setFinancePin(newPassword.trim());
      // Record security metadata
      localStorage.setItem('zapateria_eltio_pass_last_change', new Date().toISOString());
      localStorage.setItem('zapateria_eltio_pass_changed_by', activeUserName);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onSuccess('Contraseña de administración actualizada exitosamente.');
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Error al guardar la nueva contraseña.');
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setIsSuccess(false);
    onClose();
  };

  const lastChange = localStorage.getItem('zapateria_eltio_pass_last_change');
  const changedBy = localStorage.getItem('zapateria_eltio_pass_changed_by');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-stone-900 border-2 border-stone-700 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-stone-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-stone-800/90 border-b border-stone-700 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                Cambio Seguro de Contraseña
              </h2>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Seguridad de Administración & Caja
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-stone-700/60 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-300 font-medium leading-relaxed">
            Para proteger los datos monetarios y el acceso administrativo frente a clientes y personal no autorizado, verifique su clave actual antes de definir la nueva.
          </p>

          {lastChange && (
            <div className="text-[11px] text-stone-400 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between">
              <span>Última modificación:</span>
              <strong className="text-stone-300">
                {new Date(lastChange).toLocaleDateString('es-CO')} {changedBy ? `(${changedBy})` : ''}
              </strong>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs font-bold flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>¡Contraseña actualizada con éxito! Guardando...</span>
            </div>
          )}

          {/* Paso 1: Contraseña Actual */}
          <div>
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wide block mb-1">
              1. Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Ingrese la clave actual (inicial: 1234)"
                className="w-full px-4 py-2.5 pr-11 bg-stone-950 border border-stone-700 focus:border-amber-400 rounded-xl text-sm font-medium text-white placeholder-stone-500 focus:outline-none transition-colors"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Paso 2: Nueva Contraseña */}
          <div>
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wide block mb-1">
              2. Nueva Contraseña (mínimo 4 dígitos/caracteres)
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Nueva clave secreta..."
                className="w-full px-4 py-2.5 pr-11 bg-stone-950 border border-stone-700 focus:border-amber-400 rounded-xl text-sm font-medium text-white placeholder-stone-500 focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Paso 3: Confirmar Nueva Contraseña */}
          <div>
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wide block mb-1">
              3. Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Repita la nueva clave..."
                className="w-full px-4 py-2.5 pr-11 bg-stone-950 border border-stone-700 focus:border-amber-400 rounded-xl text-sm font-medium text-white placeholder-stone-500 focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Checklist */}
          <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60 space-y-1 text-xs">
            <div className="flex items-center gap-2 text-stone-300 font-semibold">
              <span className={newPassword.length >= 4 ? 'text-emerald-400' : 'text-stone-500'}>
                {newPassword.length >= 4 ? '✓' : '○'} Mínimo 4 caracteres o números
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-300 font-semibold">
              <span className={newPassword.length > 0 && newPassword === confirmPassword ? 'text-emerald-400' : 'text-stone-500'}>
                {newPassword.length > 0 && newPassword === confirmPassword ? '✓' : '○'} Las contraseñas coinciden
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 text-stone-950 text-xs font-black rounded-xl transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-stone-950" />
              <span>Actualizar Clave</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
