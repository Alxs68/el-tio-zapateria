import React, { useState } from 'react';
import { 
  FinancialSummary, 
  RepairOrder, 
  MoneyMovement, 
  PaymentMethod 
} from '../types';
import { 
  formatCOP, 
  formatCOPSimple, 
  formatDate, 
  getOrderStatusMeta, 
  generateWhatsAppNotification 
} from '../utils/formatters';
import { StorageService } from '../services/storage';
import { 
  Lock, 
  Unlock, 
  DollarSign, 
  Smartphone, 
  TrendingUp, 
  TrendingDown, 
  ArrowDownRight, 
  ArrowUpRight, 
  Receipt, 
  Users, 
  ShieldCheck, 
  KeyRound, 
  PlusCircle, 
  Download, 
  Filter, 
  Calendar, 
  Clock, 
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Scissors,
  CheckCircle2
} from 'lucide-react';

interface FinancesViewProps {
  summary: FinancialSummary;
  orders: RepairOrder[];
  onLockFinances: () => void;
  onOpenExpenseModal: () => void;
  onOpenOrderDetails: (order: RepairOrder) => void;
  onExportJSON: () => void;
  onResetDemoData?: () => void;
  onRequestChangePin: () => void;
  onNotifyWhatsApp?: (order: RepairOrder) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  summary,
  orders,
  onLockFinances,
  onOpenExpenseModal,
  onOpenOrderDetails,
  onExportJSON,
  onResetDemoData,
  onRequestChangePin,
  onNotifyWhatsApp,
}) => {
  const [subTab, setSubTab] = useState<'drawer' | 'movements' | 'artisans' | 'debt' | 'analytics'>('drawer');
  const [movementFilter, setMovementFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [searchMovement, setSearchMovement] = useState('');

  // All chronological movements
  const movements = StorageService.getAllMoneyMovements();

  const filteredMovements = movements.filter((m) => {
    const isOut = m.type === 'EGRESO_GASTO' || m.type === 'EGRESO_PAGO_ARTESANO';
    const matchesType =
      movementFilter === 'ALL' ||
      (movementFilter === 'IN' && !isOut) ||
      (movementFilter === 'OUT' && isOut);

    const clean = searchMovement.trim().toLowerCase();
    if (!clean) return matchesType;

    const matchesQuery =
      m.description.toLowerCase().includes(clean) ||
      (m.clientName && m.clientName.toLowerCase().includes(clean)) ||
      (m.ticketNumber && m.ticketNumber.toString().includes(clean)) ||
      (m.bagFichaNumber && m.bagFichaNumber.toLowerCase().includes(clean)) ||
      m.registeredBy.toLowerCase().includes(clean);

    return matchesType && matchesQuery;
  });

  // Calculate artisan splits 50/50
  const artisanStats = orders.reduce(
    (acc, order) => {
      order.items?.forEach((item) => {
        const station = item.station || 'SOLADOR';
        if (!acc[station]) {
          acc[station] = {
            totalEarned: 0,
            paid: 0,
            pending: 0,
            itemCount: 0,
          };
        }
        acc[station].totalEarned += item.cobblerCut;
        acc[station].itemCount += 1;
        if (item.cobblerPaid) {
          acc[station].paid += item.cobblerCut;
        } else {
          acc[station].pending += item.cobblerCut;
        }
      });
      return acc;
    },
    {} as Record<string, { totalEarned: number; paid: number; pending: number; itemCount: number }>
  );

  // Orders with pending debt (portfolio)
  const pendingDebtOrders = orders
    .filter((o) => o.status !== 'CANCELADA' && o.balanceAmount > 0)
    .sort((a, b) => b.balanceAmount - a.balanceAmount);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Banner: Protected Session Notification & Lock Action */}
      <div className="bg-stone-900 border-2 border-stone-800 rounded-3xl p-5 sm:p-6 text-stone-100 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Unlock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Caja y Movimientos de Dinero
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Desbloqueado
                </span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm font-medium mt-0.5">
                Datos privados protegidos con PIN · Ocultos del mostrador al atender clientes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onRequestChangePin}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-amber-300 border border-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Cambiar PIN de 4 dígitos"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Cambiar PIN</span>
            </button>

            <button
              onClick={onOpenExpenseModal}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
              <span>Anotar Gasto</span>
            </button>

            <button
              onClick={onLockFinances}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 text-xs sm:text-sm font-black flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
              title="Bloquear y regresar al mostrador de atención al cliente"
            >
              <Lock className="w-4 h-4 text-stone-950" />
              <span>Bloquear y Volver al Mostrador</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-800 overflow-x-auto scroll-touch">
          {[
            { id: 'drawer', label: '💵 Cuadre de Gaveta (Hoy)', icon: DollarSign },
            { id: 'movements', label: '📋 Libro de Movimientos (Kárdex)', icon: Receipt },
            { id: 'artisans', label: '✂️ Liquidación a Artesanos (50/50)', icon: Scissors },
            { id: 'debt', label: '💼 Cartera por Cobrar', icon: Users },
            { id: 'analytics', label: '📊 Métricas & Medios de Pago', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-750 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-VIEW 1: CUADRE DE GAVETA (HOY) */}
      {subTab === 'drawer' && (
        <div className="space-y-6">
          {/* Hero Card: Real Cash in Drawer */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-stone-900 to-stone-900 border-2 border-emerald-600/70 text-stone-100 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
                  <span>💵 Arqueo en Vivo · Billetes y Monedas</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </span>
                <div className="text-4xl sm:text-6xl font-black text-emerald-400 tabular-nums my-2 tracking-tight">
                  {formatCOP(summary.expectedCashInDrawer)}
                </div>
                <p className="text-stone-300 text-xs sm:text-sm font-medium">
                  Efectivo físico que debe haber en la gaveta en este instante (Recaudo en efectivo - Gastos de hoy).
                </p>
              </div>

              <div className="sm:self-end">
                <button
                  onClick={onOpenExpenseModal}
                  className="w-full sm:w-auto px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Sacar Dinero para Gasto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Breakdown Grid for Today */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Cobrado en Efectivo Hoy */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wide">Efectivo Ingresado Hoy</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-white tabular-nums">
                {formatCOP(summary.todayCashCollected)}
              </div>
              <span className="text-[11px] text-stone-500 font-medium block mt-1">
                Anticipos y cancelaciones en billetes
              </span>
            </div>

            {/* Card 2: Nequi / Daviplata Hoy */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wide">Nequi / Daviplata Hoy</span>
                <Smartphone className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-black text-sky-600 dark:text-sky-400 tabular-nums">
                {formatCOP(summary.todayNequiDaviplataCollected)}
              </div>
              <span className="text-[11px] text-stone-500 font-medium block mt-1">
                Transferencias a cuentas bancarias
              </span>
            </div>

            {/* Card 3: Gastos Menores de Caja Hoy */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wide">Gastos Menores Salidos</span>
                <TrendingDown className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 tabular-nums">
                {formatCOP(summary.todayExpenses)}
              </div>
              <span className="text-[11px] text-stone-500 font-medium block mt-1">
                Almuerzo, pegante, hilazas, pasajes
              </span>
            </div>

            {/* Card 4: Total Ingresos Brutos Hoy */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wide">Total Recaudado Hoy</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-white tabular-nums">
                {formatCOP(summary.todayRevenue)}
              </div>
              <span className="text-[11px] text-stone-500 font-medium block mt-1">
                Efectivo + Nequi/Daviplata juntos
              </span>
            </div>
          </div>

          {/* Today's Recent Movements preview */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-stone-900 dark:text-white">
                  Últimos Movimientos del Día
                </h3>
                <p className="text-xs text-stone-500">
                  Transacciones registradas en caja hoy en tiempo real
                </p>
              </div>
              <button
                onClick={() => setSubTab('movements')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Ver Libro Completo</span>
                <span>→</span>
              </button>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {movements.slice(0, 5).map((m) => {
                const isOut = m.type === 'EGRESO_GASTO' || m.type === 'EGRESO_PAGO_ARTESANO';
                return (
                  <div key={m.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isOut
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                      >
                        {isOut ? (
                          <ArrowDownRight className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                            {m.description}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                            {m.paymentMethod}
                          </span>
                        </div>
                        <span className="text-xs text-stone-400 block mt-0.5">
                          {formatDate(m.date)} · Registrado por {m.registeredBy}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-base font-black tabular-nums ${
                          isOut
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isOut ? '-' : '+'}{formatCOP(m.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: LIBRO DE MOVIMIENTOS (KÁRDEX COMPLETO) */}
      {subTab === 'movements' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-stone-900 dark:text-white">
                Libro Diario de Caja (Kárdex de Movimientos)
              </h2>
              <p className="text-xs text-stone-500">
                Auditoría detallada de cada ingreso, abono, gasto menor y pago a artesanos
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onExportJSON}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Copia</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {[
                  { id: 'ALL', label: 'Todos' },
                  { id: 'IN', label: '🟢 Solo Ingresos' },
                  { id: 'OUT', label: '🔴 Solo Egresos' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMovementFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      movementFilter === f.id
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={searchMovement}
                onChange={(e) => setSearchMovement(e.target.value)}
                placeholder="Buscar por cliente, factura, ficha o concepto..."
                className="px-3.5 py-1.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Movement List */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs overflow-hidden">
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredMovements.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-sm font-semibold">
                  No se encontraron movimientos registrados con los filtros actuales.
                </div>
              ) : (
                filteredMovements.map((m) => {
                  const isOut = m.type === 'EGRESO_GASTO' || m.type === 'EGRESO_PAGO_ARTESANO';
                  return (
                    <div
                      key={m.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                            isOut
                              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          }`}
                        >
                          {isOut ? (
                            <ArrowDownRight className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-stone-900 dark:text-white text-sm sm:text-base">
                              {m.description}
                            </span>
                            {m.bagFichaNumber && (
                              <span className="px-2 py-0.5 rounded-md bg-stone-900 text-amber-400 text-xs font-black">
                                Ficha #{m.bagFichaNumber}
                              </span>
                            )}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                              {m.paymentMethod}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-stone-400 mt-1 flex-wrap">
                            <span>🕒 {formatDate(m.date)}</span>
                            <span>•</span>
                            <span>👤 Registrado por: {m.registeredBy}</span>
                            {m.reference && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-[11px]">Ref: {m.reference}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right sm:self-center shrink-0">
                        <span
                          className={`text-lg sm:text-xl font-black tabular-nums block ${
                            isOut
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {isOut ? '-' : '+'}{formatCOP(m.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: LIQUIDACIÓN A ARTESANOS (50/50) */}
      {subTab === 'artisans' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              Liquidación de Mano de Obra (50/50)
            </h2>
            <p className="text-xs text-stone-500">
              Control de ganancias y pagos para Solador, Costura de Calzado, Modistería y Banco
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(artisanStats).map(([stationKey, data]) => {
              const label =
                stationKey === 'SOLADOR'
                  ? 'Solador (Suelas)'
                  : stationKey === 'COSTURA_CALZADO'
                  ? 'Costura de Calzado'
                  : stationKey === 'MODISTERIA'
                  ? 'Modistería (Prendas)'
                  : 'Banco Don Elías';

              return (
                <div
                  key={stationKey}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                      {label}
                    </span>
                    <span className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md font-bold text-stone-500">
                      {data.itemCount} arreglos
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>Total 50% Generado:</span>
                      <strong className="text-stone-900 dark:text-white font-black">
                        {formatCOP(data.totalEarned)}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                      <span>Liquidado / Pagado:</span>
                      <strong className="font-black">{formatCOP(data.paid)}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400">
                      <span>Pendiente por Liquidar:</span>
                      <strong className="font-black">{formatCOP(data.pending)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: CARTERA PENDIENTE POR COBRAR */}
      {subTab === 'debt' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-stone-900 dark:text-white">
                Cartera Pendiente por Cobrar
              </h2>
              <p className="text-xs text-stone-500">
                Total acumulado en zapatos y prendas listos o en proceso: <strong className="text-amber-600">{formatCOP(summary.totalPendingBalance)}</strong>
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs overflow-hidden">
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {pendingDebtOrders.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-sm font-semibold">
                  ¡Excelente! No hay facturas con saldo pendiente por cobrar en este momento.
                </div>
              ) : (
                pendingDebtOrders.map((ord) => {
                  const statusMeta = getOrderStatusMeta(ord.status);
                  return (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-stone-900 dark:text-white">
                            {ord.clientName}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-900 text-amber-400 text-xs font-black">
                            Ficha #{ord.bagFichaNumber || 'S/F'}
                          </span>
                          <span className="text-xs text-stone-400 font-mono">
                            Factura #{ord.ticketNumber || ord.id}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {ord.description} · Celular: <strong className="text-stone-700 dark:text-stone-300">{ord.clientPhone}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-stone-400 block">Debe</span>
                          <span className="text-base font-black text-amber-600 dark:text-amber-400 tabular-nums">
                            {formatCOP(ord.balanceAmount)}
                          </span>
                        </div>

                        {onNotifyWhatsApp && ord.status === 'LISTA PARA ENTREGAR' && (
                          <button
                            onClick={() => onNotifyWhatsApp(ord)}
                            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                            title="Cobrar y notificar por WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onOpenOrderDetails(ord)}
                          className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-bold rounded-xl transition-colors"
                        >
                          Ver Factura
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: MÉTRICAS & MEDIOS DE PAGO */}
      {subTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white">
              Métricas Consolidadas y Medios de Pago
            </h2>
            <p className="text-xs text-stone-500">
              Distribución de ingresos por canal (Efectivo vs. Bancos), tipos de prenda y volumen histórico
            </p>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              <span className="text-xs font-bold text-stone-500 uppercase">Total Recaudado Histórico</span>
              <div className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mt-1">
                {formatCOP(summary.totalRevenueCollected)}
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">Abonos y pagos completados</span>
            </div>

            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              <span className="text-xs font-bold text-stone-500 uppercase">Total Órdenes Registradas</span>
              <div className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mt-1">
                {summary.totalOrders}
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                {summary.deliveredCount} entregadas · {summary.readyCount} listas en cajón
              </span>
            </div>

            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Cartera Total</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums mt-1">
                {formatCOP(summary.totalPendingBalance)}
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                {pendingDebtOrders.length} clientes con saldo pendiente
              </span>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
            <h3 className="text-base font-black text-stone-900 dark:text-white">
              Recaudo por Método de Pago (Colombia)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(() => {
                const breakdown: Record<string, { total: number; count: number }> = {
                  EFECTIVO: { total: 0, count: 0 },
                  NEQUI: { total: 0, count: 0 },
                  DAVIPLATA: { total: 0, count: 0 },
                  TRANSFERENCIA: { total: 0, count: 0 },
                };
                orders.forEach((o) => {
                  o.payments.forEach((p) => {
                    if (breakdown[p.paymentMethod]) {
                      breakdown[p.paymentMethod].total += p.amount;
                      breakdown[p.paymentMethod].count += 1;
                    }
                  });
                });
                const total = summary.totalRevenueCollected || 1;
                return Object.entries(breakdown).map(([method, data]) => {
                  const pct = Math.round((data.total / total) * 100);
                  return (
                    <div key={method} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                          {method}
                        </span>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          {pct}%
                        </span>
                      </div>
                      <div className="text-lg font-black tabular-nums text-stone-800 dark:text-stone-100 mt-1">
                        {formatCOP(data.total)}
                      </div>
                      <span className="text-xs text-stone-400 mt-0.5 block">
                        {data.count} {data.count === 1 ? 'transacción' : 'transacciones'}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Danger zone / Admin Reset */}
          {onResetDemoData && (
            <div className="p-5 rounded-2xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-stone-700 dark:text-stone-300 block">
                  Reinicio de Base de Datos de Prueba
                </span>
                <span className="text-xs text-stone-500">
                  Permite limpiar la base de datos o restaurar los datos de ejemplo iniciales.
                </span>
              </div>
              <button
                onClick={onResetDemoData}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
              >
                Opciones de Reinicio
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
