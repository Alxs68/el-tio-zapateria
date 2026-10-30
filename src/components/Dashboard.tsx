import React, { useState } from 'react';
import { 
  RepairOrder, 
  FinancialSummary, 
  OrderStatus, 
  DeliveryDay,
  AppMode 
} from '../types';
import { 
  formatCOP, 
  formatCOPSimple, 
  formatDate, 
  getOrderStatusMeta, 
  getShoeTypeLabel,
  getDeliveryDayLabel 
} from '../utils/formatters';
import { 
  Inbox, 
  Cog, 
  CheckCircle2, 
  Truck, 
  DollarSign, 
  Search, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  BookOpen,
  ShoppingBag,
  Check,
  Send,
  Utensils,
  Scissors
} from 'lucide-react';

interface DashboardProps {
  orders: RepairOrder[];
  summary: FinancialSummary;
  appMode: AppMode;
  onOpenOrder: (order: RepairOrder) => void;
  onOpenNewOrder: () => void;
  onOpenChuleoModal: () => void;
  onOpenExpenseModal: () => void;
  onSearchOrders: () => void;
  onOpenUserManual?: () => void;
  onQuickFilterStatus?: (status: OrderStatus | 'ALL') => void;
  onNotifyWhatsApp?: (order: RepairOrder) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  orders,
  summary,
  appMode,
  onOpenOrder,
  onOpenNewOrder,
  onOpenChuleoModal,
  onOpenExpenseModal,
  onSearchOrders,
  onOpenUserManual,
  onNotifyWhatsApp,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<DeliveryDay | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = selectedFilter === 'ALL' || ord.status === selectedFilter;
    const matchesDay = selectedDayFilter === 'ALL' || ord.deliveryDayOfWeek === selectedDayFilter;
    const cleanQuery = searchQuery.trim().toLowerCase();
    
    if (!cleanQuery) return matchesStatus && matchesDay;

    const cleanDigits = searchQuery.replace(/\D/g, '');
    const matchesSearch =
      ord.id.toLowerCase().includes(cleanQuery) ||
      (ord.ticketNumber && ord.ticketNumber.toString().includes(cleanQuery)) ||
      (ord.bagFichaNumber && ord.bagFichaNumber.toLowerCase().includes(cleanQuery)) ||
      ord.clientName.toLowerCase().includes(cleanQuery) ||
      (cleanDigits && ord.clientPhone.replace(/\D/g, '').includes(cleanDigits)) ||
      ord.description.toLowerCase().includes(cleanQuery);

    return matchesStatus && matchesDay && matchesSearch;
  });

  const weekDays: { id: DeliveryDay; label: string }[] = [
    { id: 'LUNES', label: 'Lunes' },
    { id: 'MARTES', label: 'Martes' },
    { id: 'MIERCOLES', label: 'Miércoles' },
    { id: 'JUEVES', label: 'Jueves' },
    { id: 'VIERNES', label: 'Viernes' },
    { id: 'SABADO', label: 'Sábado' },
  ];

  // ==========================================
  // RENDER: MODO DON ELÍAS (86 AÑOS - MOSTRADOR)
  // ==========================================
  if (appMode === 'DON_ELIAS') {
    return (
      <div className="space-y-6 pb-20">
        
        {/* Welcome Header */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border-2 border-stone-800 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-amber-400 font-extrabold text-sm tracking-wider uppercase">
                Mostrador Don José Elías (86 años)
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Clínica de Calzado y Ropa "El Tío"
              </h1>
              <p className="text-stone-300 text-base sm:text-lg mt-1 font-medium">
                C.C. Santiago Plaza · Mostrador Principal
              </p>
            </div>

            {/* Quick Cash Drawer Display */}
            <div className="bg-stone-800 p-4 rounded-2xl border border-stone-700 text-right w-full sm:w-auto">
              <span className="text-xs text-stone-400 font-bold uppercase block">
                Efectivo en Gaveta Hoy
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                {formatCOP(summary.expectedCashInDrawer)}
              </span>
              <button
                onClick={onOpenExpenseModal}
                className="mt-2 w-full px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <span>💸 Anotar Gasto / Almuerzo</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 GIANT ACTION BUTTONS FOR DON ELÍAS (Massive Touch Targets >= 64px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Recibir Pedido */}
          <button
            onClick={onOpenNewOrder}
            className="p-6 sm:p-8 rounded-3xl bg-sky-700 hover:bg-sky-600 active:bg-sky-800 text-white shadow-xl flex items-center gap-5 text-left transition-transform active:scale-[0.98] border-2 border-sky-600 min-h-[120px]"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 text-3xl sm:text-4xl">
              🟢
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-sky-200 uppercase tracking-wider block">
                Paso 1 · En el mostrador
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                1. Recibir Pedido
              </h2>
              <p className="text-sky-100 text-sm sm:text-base font-semibold mt-1">
                Anotar Ficha física, cliente y promesa de entrega
              </p>
            </div>
          </button>

          {/* Card 2: Repartir a Zapateros / Modista */}
          <button
            onClick={onOpenChuleoModal}
            className="p-6 sm:p-8 rounded-3xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 shadow-xl flex items-center gap-5 text-left transition-transform active:scale-[0.98] border-2 border-amber-500 min-h-[120px]"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-950/20 flex items-center justify-center shrink-0 text-3xl sm:text-4xl">
              📦
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider block">
                Paso 2 · Hacia el taller
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                2. Repartir a Oficios
              </h2>
              <p className="text-stone-900 text-sm sm:text-base font-bold mt-1">
                Entregar al solador, costura o modista
              </p>
            </div>
          </button>

          {/* Card 3: Chulear Llegada de Zapatos (50/50) */}
          <button
            onClick={onOpenChuleoModal}
            className="p-6 sm:p-8 rounded-3xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white shadow-xl flex items-center gap-5 text-left transition-transform active:scale-[0.98] border-2 border-emerald-600 min-h-[120px]"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 text-3xl sm:text-4xl">
              ✓
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-emerald-200 uppercase tracking-wider block">
                Paso 3 · Regreso al mostrador
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                3. Chulear Llegada (50/50)
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base font-semibold mt-1">
                Marcar lo arreglado y pagar o anotar el 50%
              </p>
            </div>
          </button>

          {/* Card 4: Buscar por Celular y Entregar */}
          <button
            onClick={onSearchOrders}
            className="p-6 sm:p-8 rounded-3xl bg-stone-900 hover:bg-stone-850 active:bg-stone-950 text-amber-400 shadow-xl flex items-center gap-5 text-left transition-transform active:scale-[0.98] border-2 border-amber-500/40 min-h-[120px]"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400/20 flex items-center justify-center shrink-0 text-3xl sm:text-4xl text-amber-400">
              🔍
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-stone-400 uppercase tracking-wider block">
                Paso 4 · Cuando llega el cliente
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                4. Buscar por Celular
              </h2>
              <p className="text-amber-300 text-sm sm:text-base font-semibold mt-1">
                Ver en qué cajón está y cuánto debe
              </p>
            </div>
          </button>
        </div>

        {/* WORKSHOP SHELF COMPARTMENTS (Lunes a Sábado) */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                📦 Los Cajones de la Semana (Lunes a Sábado)
              </h3>
              <p className="text-stone-500 text-sm font-medium">
                Toca cualquier cajón para ver las bolsas que van allí
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {weekDays.map((d) => {
              const count = orders.filter(
                (o) => o.deliveryDayOfWeek === d.id && o.status !== 'ENTREGADA' && o.status !== 'CANCELADA'
              ).length;

              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDayFilter(selectedDayFilter === d.id ? 'ALL' : d.id);
                  }}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    selectedDayFilter === d.id
                      ? 'bg-amber-500 border-stone-950 text-stone-950 shadow-md ring-2 ring-amber-400 font-black'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider block text-stone-500 dark:text-stone-400">
                    Cajón
                  </span>
                  <span className="text-lg font-black text-stone-900 dark:text-white block mt-0.5">
                    {d.label}
                  </span>
                  <div className="mt-2 text-2xl font-black tabular-nums text-amber-700 dark:text-amber-400">
                    {count} {count === 1 ? 'bolsa' : 'bolsas'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active orders list for Don Elías */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
              Bolsas Pendientes en Taller ({filteredOrders.filter(o => o.status !== 'ENTREGADA').length})
            </h3>

            {selectedDayFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedDayFilter('ALL')}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                ✕ Quitar filtro de día ({selectedDayFilter})
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredOrders.filter(o => o.status !== 'ENTREGADA').length === 0 ? (
              <div className="text-center py-10 text-stone-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-stone-400" />
                <p className="text-base font-bold text-stone-700 dark:text-stone-300">
                  No hay bolsas en este cajón en este momento
                </p>
              </div>
            ) : (
              filteredOrders.filter(o => o.status !== 'ENTREGADA').map((ord) => {
                const statusMeta = getOrderStatusMeta(ord.status);
                const allDone = ord.items?.every((i) => i.isCompleted);

                return (
                  <div
                    key={ord.id}
                    onClick={() => onOpenOrder(ord)}
                    className="p-4 sm:p-5 rounded-2xl border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 hover:border-amber-500 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="px-3.5 py-2 rounded-xl bg-stone-900 text-amber-400 font-black text-xl shrink-0">
                        #{ord.bagFichaNumber || 'S/F'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-lg text-stone-900 dark:text-white">
                            {ord.clientName}
                          </span>
                          <span className="text-xs bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded font-bold">
                            Factura #{ord.ticketNumber || ord.id}
                          </span>
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-300 font-medium mt-0.5">
                          {ord.description}
                        </div>
                        <div className="text-xs text-amber-700 dark:text-amber-400 font-bold mt-1">
                          📍 Cajón de {getDeliveryDayLabel(ord.deliveryDayOfWeek)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-stone-500 block">Saldo</span>
                        <span className={`text-lg font-black tabular-nums ${ord.balanceAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {ord.balanceAmount > 0 ? formatCOP(ord.balanceAmount) : 'Paz y Salvo'}
                        </span>
                      </div>

                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${statusMeta.badgeBg} ${statusMeta.badgeText}`}>
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MODO SUPERVISIÓN (YADI & ALEXIS)
  // ==========================================
  return (
    <div className="space-y-6 pb-20">
      
      {/* Supervisión Header */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
              <span>Supervisión y Control Familiar</span>
              <span>·</span>
              <span>Yadi & Alexis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tablero de Control Zapatería "El Tío"
            </h1>
            <p className="text-stone-300 text-sm mt-1">
              Monitoreo en tiempo real de ingresos, saldo por cobrar, cajones y pagos a zapateros.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewOrder}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nueva Factura / Ficha</span>
            </button>
            <button
              onClick={onOpenChuleoModal}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Chuleo (50/50)</span>
            </button>
            <button
              onClick={onOpenExpenseModal}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-red-300 border border-red-500/30 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors"
            >
              <span>💸 Anotar Gasto</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Financial & Operational Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Metric 1: Recibidas */}
        <button
          onClick={() => setSelectedFilter('RECIBIDA')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedFilter === 'RECIBIDA'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400/20'
              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-400'
          }`}
        >
          <span className="text-xs text-stone-500 font-bold block">Recibidas</span>
          <span className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mt-1 block">
            {summary.receivedCount}
          </span>
        </button>

        {/* Metric 2: En Proceso */}
        <button
          onClick={() => setSelectedFilter('EN PROCESO')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedFilter === 'EN PROCESO'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-400/20'
              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-blue-400'
          }`}
        >
          <span className="text-xs text-stone-500 font-bold block">En Oficios</span>
          <span className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mt-1 block">
            {summary.inProcessCount}
          </span>
        </button>

        {/* Metric 3: Listas para Entregar */}
        <button
          onClick={() => setSelectedFilter('LISTA PARA ENTREGAR')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedFilter === 'LISTA PARA ENTREGAR'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-400/20'
              : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-400'
          }`}
        >
          <span className="text-xs text-stone-500 font-bold block">Listas en Cajón</span>
          <span className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mt-1 block">
            {summary.readyCount}
          </span>
        </button>

        {/* Metric 4: Efectivo Esperado en Caja */}
        <div className="p-4 rounded-2xl border bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-left">
          <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold block">Efectivo en Gaveta</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums mt-1 block">
            {formatCOPSimple(summary.expectedCashInDrawer)}
          </span>
        </div>

        {/* Metric 5: Cobrado Hoy (Efectivo + Nequi) */}
        <div className="p-4 rounded-2xl border bg-stone-900 text-white border-stone-800 text-left">
          <span className="text-xs text-stone-400 font-bold block">Ingresos de Hoy</span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums mt-1 block">
            {formatCOPSimple(summary.todayRevenue)}
          </span>
        </div>

        {/* Metric 6: Saldo Pendiente por Cobrar */}
        <div className="p-4 rounded-2xl border bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-left">
          <span className="text-xs text-amber-900 dark:text-amber-300 font-bold block">Cartera por Cobrar</span>
          <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 tabular-nums mt-1 block">
            {formatCOPSimple(summary.totalPendingBalance)}
          </span>
        </div>
      </div>

      {/* Orders Filter & Search bar */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por Celular, Ficha #, Cliente o Factura..."
              className="w-full pl-11 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'RECIBIDA', 'EN PROCESO', 'LISTA PARA ENTREGAR', 'ENTREGADA'] as (OrderStatus | 'ALL')[]).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                  selectedFilter === st
                    ? 'bg-amber-600 text-stone-950'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {st === 'ALL' ? 'Todas' : getOrderStatusMeta(st).label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold uppercase">
              <tr>
                <th className="p-3">Ficha</th>
                <th className="p-3">Factura</th>
                <th className="p-3">Cliente / Celular</th>
                <th className="p-3">Cajón de Entrega</th>
                <th className="p-3">Descripción</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-right">Saldo</th>
                <th className="p-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No se encontraron órdenes con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const meta = getOrderStatusMeta(ord.status);
                  return (
                    <tr
                      key={ord.id}
                      onClick={() => onOpenOrder(ord)}
                      className="hover:bg-stone-50 dark:hover:bg-stone-850 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-black text-amber-600">
                        #{ord.bagFichaNumber || 'S/F'}
                      </td>
                      <td className="p-3 font-bold text-stone-800 dark:text-stone-200">
                        Nº {ord.ticketNumber || ord.id}
                      </td>
                      <td className="p-3">
                        <span className="font-extrabold block text-stone-900 dark:text-white">
                          {ord.clientName}
                        </span>
                        <span className="text-xs text-stone-500 font-mono">
                          {ord.clientPhone}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-xs text-stone-700 dark:text-stone-300">
                        {ord.lockerLocation}
                      </td>
                      <td className="p-3 text-xs text-stone-600 dark:text-stone-400 max-w-xs truncate">
                        {ord.description}
                      </td>
                      <td className="p-3 text-right font-bold tabular-nums">
                        {formatCOPSimple(ord.totalAmount)}
                      </td>
                      <td className={`p-3 text-right font-black tabular-nums ${ord.balanceAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {formatCOPSimple(ord.balanceAmount)}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${meta.badgeBg} ${meta.badgeText}`}>
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
