import React, { useState } from 'react';
import { 
  RepairOrder, 
  FinancialSummary, 
  PaymentMethod,
  ServiceCatalogItem 
} from '../types';
import { 
  formatCOP, 
  formatDate, 
  getShoeTypeLabel,
  generateWhatsAppNotification 
} from '../utils/formatters';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  Download, 
  RotateCcw, 
  Phone, 
  ChevronRight, 
  PieChart, 
  Calendar,
  CheckCircle2,
  Wallet
} from 'lucide-react';

interface ReportsViewProps {
  orders: RepairOrder[];
  summary: FinancialSummary;
  services: ServiceCatalogItem[];
  onSelectOrder: (order: RepairOrder) => void;
  onExportJSON: () => void;
  onResetDemoData: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  orders,
  summary,
  services,
  onSelectOrder,
  onExportJSON,
  onResetDemoData,
}) => {
  // Calculate breakdown by payment method
  const paymentMethodBreakdown: Record<PaymentMethod, { total: number; count: number }> = {
    EFECTIVO: { total: 0, count: 0 },
    NEQUI: { total: 0, count: 0 },
    DAVIPLATA: { total: 0, count: 0 },
    TRANSFERENCIA: { total: 0, count: 0 },
    TARJETA: { total: 0, count: 0 },
  };

  orders.forEach((ord) => {
    ord.payments.forEach((p) => {
      if (paymentMethodBreakdown[p.paymentMethod]) {
        paymentMethodBreakdown[p.paymentMethod].total += p.amount;
        paymentMethodBreakdown[p.paymentMethod].count += 1;
      }
    });
  });

  // Orders with pending balance (portfolio to collect)
  const pendingDebtOrders = orders
    .filter((o) => o.status !== 'CANCELADA' && o.balanceAmount > 0)
    .sort((a, b) => b.balanceAmount - a.balanceAmount);

  // Shoes popularity
  const shoeTypeCounts: Record<string, number> = {};
  orders.forEach((o) => {
    shoeTypeCounts[o.shoeType] = (shoeTypeCounts[o.shoeType] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Reportes Financieros & Operacionales
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Ingresos en pesos colombianos, métodos de recaudo y control estricto de cartera por cobrar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportJSON}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Descargar copia de seguridad en JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Copia JSON</span>
          </button>
          <button
            onClick={() => {
              if (confirm('¿Desea restaurar los datos de demostración originales de Zapatería El Tío?')) {
                onResetDemoData();
              }
            }}
            className="px-3 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Restaurar datos iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Restablecer Demo</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wide">Recaudado Histórico</span>
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-950 tabular-nums">
            {formatCOP(summary.totalRevenueCollected)}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Total de abonos y cancelaciones</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wide">Ingresos de Hoy</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-800 tabular-nums">
            {formatCOP(summary.todayRevenue)}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">Caja recibida el día de hoy</p>
        </div>

        <div className="p-5 bg-red-50/70 rounded-2xl border border-red-200 shadow-2xs">
          <div className="flex items-center justify-between text-red-900 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wide">Saldo por Cobrar</span>
            <DollarSign className="w-4 h-4 text-red-700" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-red-700 tabular-nums">
            {formatCOP(summary.totalPendingBalance)}
          </div>
          <p className="text-[11px] text-red-800 mt-1 font-medium">
            En {pendingDebtOrders.length} {pendingDebtOrders.length === 1 ? 'orden pendiente' : 'órdenes pendientes'}
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wide">Total Reparaciones</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 tabular-nums">
            {summary.totalOrders}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {summary.deliveredCount} entregadas · {summary.readyCount} listas
          </p>
        </div>

      </div>

      {/* 2-Column Split: Payment Methods Breakdown & Top Shoe Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Payment Methods Breakdown */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              Recaudo por Método de Pago (Colombia)
            </h3>
            <CreditCard className="w-4 h-4 text-stone-400" />
          </div>

          <div className="space-y-3">
            {Object.entries(paymentMethodBreakdown).map(([method, data]) => {
              const totalRevenue = summary.totalRevenueCollected || 1;
              const percentage = Math.round((data.total / totalRevenue) * 100);

              return (
                <div key={method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-stone-800">
                    <span>
                      {method} <span className="text-stone-400 text-[11px]">({data.count} pagos)</span>
                    </span>
                    <span className="font-mono font-bold text-stone-900 tabular-nums">
                      {formatCOP(data.total)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shoe Types Distribution */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              Distribución por Tipo de Calzado
            </h3>
            <PieChart className="w-4 h-4 text-stone-400" />
          </div>

          <div className="space-y-2.5">
            {Object.entries(shoeTypeCounts).map(([type, count]) => {
              const label = getShoeTypeLabel(type as any);
              const percentage = Math.round((count / (summary.totalOrders || 1)) * 100);

              return (
                <div key={type} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl text-xs border border-stone-100">
                  <span className="font-semibold text-stone-800">{label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-500 font-medium">{count} pares</span>
                    <span className="font-bold text-amber-700 font-mono tabular-nums">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Portfolio / Pending Balance Collection Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              Cartera de Clientes con Saldo Pendiente
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Órdenes de calzado pendientes por cancelar al momento de entrega o aviso.
            </p>
          </div>
          <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
            Total Cartera: {formatCOP(summary.totalPendingBalance)}
          </span>
        </div>

        {pendingDebtOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-500 bg-stone-50 rounded-xl">
            ¡Excelente! Todas las órdenes registradas se encuentran totalmente canceladas.
          </div>
        ) : (
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 border-b border-stone-200 text-stone-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Orden</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Calzado & Casillero</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                  <th className="py-2.5 px-3 text-right">Saldo Pendiente</th>
                  <th className="py-2.5 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {pendingDebtOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                      {ord.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-stone-900 block">{ord.clientName}</span>
                      <span className="text-[11px] text-stone-500">{ord.clientPhone}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-stone-800">{getShoeTypeLabel(ord.shoeType)}</span>
                      <span className="text-[10px] text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 ml-1.5">
                        {ord.lockerLocation}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-stone-700">
                      {formatCOP(ord.totalAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-red-600">
                      {formatCOP(ord.balanceAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onSelectOrder(ord)}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded text-[11px] transition-colors"
                      >
                        Ver / Cobrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
