import React, { useState } from 'react';
import { RepairOrder, Client } from '../types';
import { formatCOP, formatCOPSimple, formatDate, getOrderStatusMeta, getDeliveryDayLabel } from '../utils/formatters';
import { Search, X, Package, User, ChevronRight, Phone, Check, ArrowRight } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: RepairOrder[];
  clients: Client[];
  onSelectOrder: (order: RepairOrder) => void;
  onSelectClient: (client: Client) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  orders,
  clients,
  onSelectOrder,
  onSelectClient,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const clean = query.trim().toLowerCase();
  const cleanDigits = query.replace(/\D/g, '');

  const matchedOrders = clean
    ? orders.filter((o) => {
        const matchPhone = cleanDigits && o.clientPhone.replace(/\D/g, '').includes(cleanDigits);
        const matchFicha = o.bagFichaNumber && o.bagFichaNumber.toLowerCase() === clean;
        const matchName = o.clientName.toLowerCase().includes(clean);
        const matchTicket = o.ticketNumber && o.ticketNumber.toString().includes(clean);
        const matchId = o.id.toLowerCase().includes(clean);
        return matchPhone || matchFicha || matchName || matchTicket || matchId;
      })
    : orders.slice(0, 5);

  const matchedClients = clean
    ? clients.filter((c) => {
        const matchPhone = cleanDigits && c.phone.replace(/\D/g, '').includes(cleanDigits);
        const matchName = c.fullName.toLowerCase().includes(clean);
        return matchPhone || matchName;
      })
    : [];

  return (
    <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-xs flex items-start justify-center p-3 pt-12 sm:pt-20 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full border-2 border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar - High Accessibility */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center gap-3">
          <Search className="w-6 h-6 text-amber-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Digite el celular del cliente o número de Ficha..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-xl font-black bg-transparent focus:outline-none placeholder-stone-500 text-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-white text-sm font-bold px-2 py-1"
            >
              ✕
            </button>
          )}
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1">
          <div className="flex items-center justify-between text-xs font-black uppercase text-stone-500 tracking-wider">
            <span>Bolsas y Facturas Encontradas ({matchedOrders.length})</span>
            {clean && <span>Resultados para: "{query}"</span>}
          </div>

          {matchedOrders.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-stone-400" />
              <p className="text-base font-bold text-stone-700 dark:text-stone-300">
                No se encontraron órdenes con este número o nombre
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Verifique que el celular o la Ficha estén bien escritos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matchedOrders.map((ord) => {
                const meta = getOrderStatusMeta(ord.status);
                return (
                  <button
                    key={ord.id}
                    onClick={() => {
                      onSelectOrder(ord);
                      onClose();
                    }}
                    className="w-full text-left p-4 rounded-2xl border-2 border-stone-200 dark:border-stone-800 hover:border-amber-500 bg-stone-50 dark:bg-stone-850 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="px-3.5 py-2 rounded-xl bg-stone-900 text-amber-400 font-black text-xl shrink-0 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                        #{ord.bagFichaNumber || 'S/F'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-base text-stone-900 dark:text-white">
                            {ord.clientName}
                          </span>
                          <span className="text-xs bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded font-bold">
                            Factura #{ord.ticketNumber || ord.id}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600 dark:text-stone-300 font-bold flex items-center gap-2 mt-0.5">
                          <span>Cel: {ord.clientPhone}</span>
                          <span>·</span>
                          <span className="text-amber-700 dark:text-amber-400 font-black">
                            📍 {ord.lockerLocation}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-1 line-clamp-1">
                          {ord.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-stone-200 dark:border-stone-800">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">
                          Saldo por Cobrar
                        </span>
                        <span className={`text-lg font-black tabular-nums ${ord.balanceAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {ord.balanceAmount > 0 ? formatCOP(ord.balanceAmount) : '¡Paz y Salvo!'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${meta.badgeBg} ${meta.badgeText}`}>
                          {meta.label}
                        </span>
                        <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-amber-600 transition-colors" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span>Consejo: Don Elías solo necesita pedir el número de celular al cliente.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 text-white font-bold rounded-xl"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
