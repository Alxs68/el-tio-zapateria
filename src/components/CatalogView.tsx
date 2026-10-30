import React, { useState } from 'react';
import { ServiceCatalogItem, StaffMember } from '../types';
import { formatCOP } from '../utils/formatters';
import { 
  Wrench, 
  Plus, 
  Trash2, 
  Edit2, 
  Lock, 
  ShieldCheck, 
  X, 
  Check, 
  Tag, 
  Clock,
  AlertCircle
} from 'lucide-react';

interface CatalogViewProps {
  services: ServiceCatalogItem[];
  activeUser: StaffMember;
  onSaveService: (service: ServiceCatalogItem) => void;
  onDeleteService: (id: string) => void;
}

const CATEGORIES = [
  { id: 'suelas', label: 'Suelas & Tapas' },
  { id: 'costura', label: 'Costura & Pegado' },
  { id: 'lustre', label: 'Lustre & Tintura' },
  { id: 'ortopedia', label: 'Plantillas & Ortopedia' },
  { id: 'accesorios', label: 'Cremalleras & Herrajes' },
  { id: 'general', label: 'Horma & Mantenimiento' },
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  services,
  activeUser,
  onSaveService,
  onDeleteService,
}) => {
  const isAdmin = activeUser.role === 'ADMIN';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingService, setEditingService] = useState<Partial<ServiceCatalogItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter services by category
  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handleOpenNewModal = () => {
    if (!isAdmin) return;
    setEditingService({
      name: '',
      description: '',
      category: 'suelas',
      basePrice: 20000,
      estimatedHours: 4,
      active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: ServiceCatalogItem) => {
    if (!isAdmin) return;
    setEditingService({ ...service });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingService?.name?.trim()) {
      setFormError('El nombre del servicio es obligatorio.');
      return;
    }
    if (!editingService?.basePrice || editingService.basePrice <= 0) {
      setFormError('La tarifa base en COP debe ser mayor a cero.');
      return;
    }

    const saved: ServiceCatalogItem = {
      id: editingService.id || `srv-${Date.now()}`,
      name: editingService.name.trim(),
      description: editingService.description?.trim() || '',
      category: (editingService.category as any) || 'general',
      basePrice: Number(editingService.basePrice),
      estimatedHours: Number(editingService.estimatedHours) || 4,
      active: editingService.active ?? true,
    };

    onSaveService(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Header and Role Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Catálogo de Servicios & Tarifas (COP)
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Precios oficiales y tiempos estimados de reparación del taller Zapatería El Tío.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={handleOpenNewModal}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-stone-950" />
            <span>Nuevo Servicio</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-stone-100 text-stone-700 px-3 py-2 rounded-xl text-xs border border-stone-200">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Modo Consulta (Solo el Administrador puede editar tarifas)</span>
          </div>
        )}
      </div>

      {/* Role notice for Operario */}
      {!isAdmin && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Usuario actual: <strong>{activeUser.name}</strong> (Rol: {activeUser.role}). Para crear o modificar tarifas, cambie al perfil de <strong>Don Tío (ADMIN)</strong> en la barra superior.
            </span>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto scroll-touch">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Todos ({services.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = services.filter((s) => s.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`bg-white border rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all ${
              service.active ? 'border-stone-200' : 'border-stone-200 opacity-60 bg-stone-50'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  {CATEGORIES.find((c) => c.id === service.category)?.label || service.category}
                </span>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(service)}
                      className="p-1 text-stone-400 hover:text-stone-800 rounded transition-colors"
                      title="Editar tarifa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar el servicio "${service.name}" del catálogo?`)) {
                          onDeleteService(service.id);
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                      title="Eliminar del catálogo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-sm sm:text-base text-stone-900 leading-snug">
                {service.name}
              </h3>
              
              <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                {service.description || 'Sin descripción detallada.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <Clock className="w-3.5 h-3.5" />
                <span>~{service.estimatedHours} horas</span>
              </div>

              <div className="text-right">
                <span className="text-sm sm:text-base font-extrabold text-stone-950 font-mono tabular-nums">
                  {formatCOP(service.basePrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Service Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 border border-stone-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                {editingService.id ? 'Editar Tarifa de Servicio' : 'Nuevo Servicio en Catálogo'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nombre del Servicio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cambio de Tapas Italianas"
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Categoría</label>
                  <select
                    value={editingService.category || 'suelas'}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tarifa Base (COP) *</label>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-stone-500">$</span>
                    <input
                      type="number"
                      required
                      min="1000"
                      step="1000"
                      value={editingService.basePrice || ''}
                      onChange={(e) => setEditingService({ ...editingService, basePrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-bold font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tiempo Estimado (Horas)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={editingService.estimatedHours || 4}
                  onChange={(e) => setEditingService({ ...editingService, estimatedHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Descripción del Procedimiento</label>
                <textarea
                  rows={2}
                  placeholder="Materiales utilizados, tipo de adhesivo o especificaciones..."
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingService.active ?? true}
                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300"
                  />
                  <span className="font-semibold text-stone-800">Servicio activo en mostrador</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg shadow-xs"
                >
                  Guardar Tarifa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
