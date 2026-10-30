import React, { useState } from 'react';
import { RepairOrder, BagItem } from '../types';
import { formatCOP, formatCOPSimple, getWorkStationLabel, getDeliveryDayLabel } from '../utils/formatters';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  ChevronRight, 
  Check, 
  Sparkles,
  ShoppingBag,
  Send
} from 'lucide-react';

interface ChuleoModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: RepairOrder[];
  onToggleItem: (orderId: string, itemId: string) => void;
  onPayoutCobbler: (orderId: string, itemId: string, payFromDrawerCash: boolean) => void;
  onNotifyWhatsApp: (order: RepairOrder) => void;
  onOpenOrderDetails: (order: RepairOrder) => void;
}

export const ChuleoModal: React.FC<ChuleoModalProps> = ({
  isOpen,
  onClose,
  orders,
  onToggleItem,
  onPayoutCobbler,
  onNotifyWhatsApp,
  onOpenOrderDetails,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Active orders with items that are either received or in process or ready
  const activeOrders = orders.filter((o) => o.status !== 'ENTREGADA' && o.status !== 'CANCELADA');

  const filteredOrders = activeOrders.filter((ord) => {
    if (selectedDayFilter !== 'TODOS' && ord.deliveryDayOfWeek !== selectedDayFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchFicha = ord.bagFichaNumber?.toLowerCase().includes(q);
      const matchPhone = ord.clientPhone.includes(q);
      const matchName = ord.clientName.toLowerCase().includes(q);
      const matchTicket = ord.ticketNumber?.toString().includes(q);
      return matchFicha || matchPhone || matchName || matchTicket;
    }
    return true;
  });

  const days: { id: string; label: string }[] = [
    { id: 'TODOS', label: 'Todos los Días' },
    { id: 'LUNES', label: 'Lunes' },
    { id: 'MARTES', label: 'Martes' },
    { id: 'MIERCOLES', label: 'Miércoles' },
    { id: 'JUEVES', label: 'Jueves' },
    { id: 'VIERNES', label: 'Viernes' },
    { id: 'SABADO', label: 'Sábado' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center font-bold text-2xl">
              ✓
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Chulear Llegada de Zapatos y Ropa (50/50)
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                Marca lo que devuelven el solador y la modista a la bolsa y liquida su mano de obra
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters and search bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por Ficha #, Celular o Factura..."
                className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-base font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Day filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {days.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDayFilter(d.id)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                    selectedDayFilter === d.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-stone-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-3 text-stone-300 dark:text-stone-700 stroke-[1.5]" />
              <p className="text-lg font-bold text-stone-700 dark:text-stone-300">
                No hay bolsas pendientes para este criterio
              </p>
              <p className="text-sm text-stone-500 mt-1">
                Todas las prendas están al día o no coinciden con la búsqueda.
              </p>
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const allDone = ord.items.every((i) => i.isCompleted);
              const doneCount = ord.items.filter((i) => i.isCompleted).length;
              const totalItems = ord.items.length;

              return (
                <div
                  key={ord.id}
                  className={`rounded-2xl border-2 transition-all overflow-hidden ${
                    allDone
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Big Badge for Ficha Física */}
                      <div className="px-3.5 py-2 rounded-xl bg-stone-900 text-amber-400 font-black text-xl tracking-tight shadow-sm border border-stone-800">
                        FICHA #{ord.bagFichaNumber || 'S/F'}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-stone-900 dark:text-white text-base sm:text-lg">
                            {ord.clientName}
                          </span>
                          <span className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-md font-bold">
                            Factura #{ord.ticketNumber || ord.id}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
                          <span>Cel: <strong className="text-stone-700 dark:text-stone-300">{ord.clientPhone}</strong></span>
                          <span>·</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            Cajón de {getDeliveryDayLabel(ord.deliveryDayOfWeek)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                        allDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {doneCount} de {totalItems} listos
                      </span>

                      <button
                        onClick={() => onOpenOrderDetails(ord)}
                        className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700"
                      >
                        Ver Factura
                      </button>
                    </div>
                  </div>

                  {/* Items list with individual check-off and 50/50 split */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Prendas en esta Bolsa (Ficha #{ord.bagFichaNumber})
                    </p>

                    <div className="space-y-2.5">
                      {ord.items.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 sm:p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                              item.isCompleted
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700'
                                : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => onToggleItem(ord.id, item.id)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform active:scale-90 ${
                                  item.isCompleted
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'border-2 border-stone-400 hover:border-emerald-600 text-transparent'
                                }`}
                                title={item.isCompleted ? 'Desmarcar' : 'Marcar como llegó'}
                              >
                                <Check className="w-5 h-5 stroke-[3]" />
                              </button>

                              <div>
                                <h4 className={`text-base font-bold leading-snug ${
                                  item.isCompleted 
                                    ? 'text-emerald-950 dark:text-emerald-200 line-through decoration-emerald-600/50' 
                                    : 'text-stone-900 dark:text-white'
                                }`}>
                                  {item.description}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                                  <span className="font-semibold text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-700 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-600">
                                    {getWorkStationLabel(item.station)}
                                  </span>
                                  <span className="font-bold text-stone-800 dark:text-stone-200">
                                    Cobro: {formatCOPSimple(item.price)}
                                  </span>
                                  <span className="font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                                    50% Zapatero: {formatCOPSimple(item.cobblerCut)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Artisan Payout Button & Status */}
                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              {item.cobblerPaid ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                                  <Check className="w-3.5 h-3.5" />
                                  50% Pagado
                                </span>
                              ) : (
                                <button
                                  onClick={() => onPayoutCobbler(ord.id, item.id, true)}
                                  className="text-xs font-extrabold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                                  title="Pagar en efectivo de la caja y registrar gasto"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                  Pagar {formatCOPSimple(item.cobblerCut)} (Caja)
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* All Done Banner & WhatsApp Trigger */}
                    {allDone && (
                      <div className="mt-4 p-4 rounded-xl bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-6 h-6 shrink-0 text-amber-300" />
                          <div>
                            <span className="font-extrabold text-base block">
                              ¡Bolsa Completa! Guardada en el Cajón de {getDeliveryDayLabel(ord.deliveryDayOfWeek)}
                            </span>
                            <span className="text-xs text-emerald-100">
                              Saldo pendiente por cobrar al entregar: <strong>{formatCOP(ord.balanceAmount)}</strong>
                            </span>
                          </div>
                        </div>

                        {ord.hasWhatsApp && (
                          <button
                            onClick={() => onNotifyWhatsApp(ord)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 font-black rounded-xl text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0"
                          >
                            <Send className="w-4 h-4 text-emerald-700" />
                            <span>Avisar al Cliente por WhatsApp</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
            Regla: El WhatsApp solo se habilita cuando el 100% de las piezas están chuleadas.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
