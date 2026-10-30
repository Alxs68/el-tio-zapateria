import React, { useState } from 'react';
import { Client, RepairOrder } from '../types';
import { formatCOP, formatDate, validateColombianPhone, getOrderStatusMeta } from '../utils/formatters';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Calendar, 
  FileText, 
  Package, 
  ChevronRight,
  UserCheck,
  X,
  AlertCircle
} from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  orders: RepairOrder[];
  onSaveClient: (client: Client) => void;
  onSelectOrder: (order: RepairOrder) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  orders,
  onSaveClient,
  onSelectOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.replace(/\D/g, '').includes(q) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  // Client's repair orders
  const clientOrders = selectedClient
    ? orders.filter((o) => o.clientId === selectedClient.id)
    : [];

  const totalSpentByClient = clientOrders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalDebtByClient = clientOrders.reduce((sum, o) => sum + (o.status !== 'CANCELADA' ? o.balanceAmount : 0), 0);

  const handleOpenNewClientModal = () => {
    setEditingClient({
      fullName: '',
      phone: '',
      notes: '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditClientModal = (c: Client) => {
    setEditingClient({ ...c });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!editingClient?.fullName?.trim()) {
      setModalError('El nombre completo es obligatorio.');
      return;
    }

    const phoneCheck = validateColombianPhone(editingClient.phone || '');
    if (!phoneCheck.isValid) {
      setModalError(phoneCheck.message || 'Teléfono no válido.');
      return;
    }

    const saved: Client = {
      id: editingClient.id || `cli-${Date.now()}`,
      fullName: editingClient.fullName.trim(),
      phone: editingClient.phone!.trim(),
      notes: editingClient.notes?.trim() || undefined,
      createdAt: editingClient.createdAt || new Date().toISOString(),
      repairCount: editingClient.repairCount || 0,
    };

    onSaveClient(saved);
    setSelectedClient(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Directorio de Clientes
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Consulta datos de contacto, notas y todo el historial de reparaciones de cada cliente.
          </p>
        </div>

        <button
          onClick={handleOpenNewClientModal}
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 text-stone-950" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Main 2-Column Split: List on Left, Details & History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Search & Client List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 space-y-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o celular..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto scroll-touch">
            {filteredClients.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-500">
                No se encontraron clientes coincidentes.
              </div>
            ) : (
              filteredClients.map((c) => {
                const isSelected = selectedClient?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClient(c)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between min-h-[56px] ${
                      isSelected
                        ? 'bg-amber-50/80 border border-amber-300'
                        : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                        {c.fullName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                        <Phone className="w-3 h-3 text-stone-600" />
                        <span>{c.phone}</span>
                      </div>
                      {c.notes && (
                        <p className="text-[11px] text-stone-600 line-clamp-1 mt-0.5 italic">
                          {c.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[11px] font-semibold text-stone-600 block">
                        {c.repairCount || 0} {(c.repairCount || 0) === 1 ? 'reparación' : 'reparaciones'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400 ml-auto mt-1" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Selected Client Details & Repair Orders History (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedClient ? (
            <>
              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                      Perfil del Cliente
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                      {selectedClient.fullName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-600">
                      <span className="flex items-center gap-1 font-semibold text-stone-800">
                        <Phone className="w-3.5 h-3.5 text-amber-600" />
                        {selectedClient.phone}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        Cliente desde {formatDate(selectedClient.createdAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEditClientModal(selectedClient)}
                    className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    Editar
                  </button>
                </div>

                {selectedClient.notes && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-700">
                    <span className="font-semibold block text-stone-900 mb-0.5">Observaciones:</span>
                    {selectedClient.notes}
                  </div>
                )}

                {/* Client Stats Banner */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-center">
                    <span className="text-[10px] text-stone-500 block uppercase font-medium">Reparaciones</span>
                    <span className="text-base font-bold text-stone-900 tabular-nums">{clientOrders.length}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-800 block uppercase font-medium">Total Pagado</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-900 tabular-nums truncate block">
                      {formatCOP(totalSpentByClient)}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-lg border text-center ${totalDebtByClient > 0 ? 'bg-red-50 border-red-200' : 'bg-stone-50 border-stone-200'}`}>
                    <span className={`text-[10px] block uppercase font-medium ${totalDebtByClient > 0 ? 'text-red-700' : 'text-stone-500'}`}>
                      Saldo Pendiente
                    </span>
                    <span className={`text-xs sm:text-sm font-bold tabular-nums truncate block ${totalDebtByClient > 0 ? 'text-red-600' : 'text-stone-700'}`}>
                      {formatCOP(totalDebtByClient)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Repair History List */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-3">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wide block">
                  Historial de Calzado & Reparaciones ({clientOrders.length})
                </span>

                {clientOrders.length === 0 ? (
                  <div className="text-center py-6 text-xs text-stone-500">
                    Este cliente aún no registra órdenes de reparación.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {clientOrders.map((ord) => {
                      const meta = getOrderStatusMeta(ord.status);
                      return (
                        <div
                          key={ord.id}
                          onClick={() => onSelectOrder(ord)}
                          className="p-3 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-stone-900">{ord.id}</span>
                              <span className={`px-2 py-0.2 text-[10px] font-bold rounded border ${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}`}>
                                {meta.label}
                              </span>
                            </div>
                            <p className="text-xs text-stone-700 font-medium line-clamp-1 mt-1">
                              {ord.description}
                            </p>
                            <span className="text-[11px] text-stone-500 block mt-0.5">
                              Recibido: {formatDate(ord.receivedDate)} · {ord.lockerLocation}
                            </span>
                          </div>

                          <div className="text-right shrink-0 ml-3">
                            <span className="text-xs font-bold text-stone-900 tabular-nums block">
                              {formatCOP(ord.totalAmount)}
                            </span>
                            {ord.balanceAmount > 0 ? (
                              <span className="text-[10px] text-red-600 font-bold tabular-nums block">
                                Debe {formatCOP(ord.balanceAmount)}
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-700 font-semibold block">
                                Paz y Salvo
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              Seleccione un cliente para ver su perfil e historial de reparaciones.
            </div>
          )}
        </div>

      </div>

      {/* Create / Edit Client Modal */}
      {isModalOpen && editingClient && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 border border-stone-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                {editingClient.id ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Andrés Camilo Restrepo"
                  value={editingClient.fullName || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Celular (10 dígitos) *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 312 456 7890"
                  value={editingClient.phone || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Observaciones / Preferencias</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Cliente frecuente, prefiere cordones encerados..."
                  value={editingClient.notes || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
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
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
