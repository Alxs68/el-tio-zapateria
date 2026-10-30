import React, { useState } from 'react';
import { 
  RepairOrder, 
  StaffMember, 
  OrderStatus, 
  PaymentMethod,
  BagItem 
} from '../types';
import { 
  formatCOP, 
  formatCOPSimple, 
  formatDate, 
  formatDateTime, 
  getOrderStatusMeta, 
  getShoeTypeLabel, 
  getWorkStationLabel,
  getDeliveryDayLabel,
  generateWhatsAppNotification 
} from '../utils/formatters';
import { 
  X, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Phone, 
  MessageSquare, 
  Send, 
  Share2, 
  Copy, 
  Printer, 
  User, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  Check, 
  ArrowRight,
  History,
  Lock,
  ExternalLink,
  Sparkles,
  Scissors
} from 'lucide-react';

interface OrderDetailsModalProps {
  order: RepairOrder | null;
  isOpen: boolean;
  onClose: () => void;
  activeUser: StaffMember;
  onUpdateStatus: (
    orderId: string, 
    newStatus: OrderStatus, 
    reason?: string,
    deliveryDetails?: {
      deliveredBy: string;
      receivedByName?: string;
      adminAuthorizedDebt?: boolean;
      adminAuthorizationReason?: string;
    }
  ) => void;
  onAddPayment: (
    orderId: string,
    payment: {
      amount: number;
      paymentMethod: PaymentMethod;
      reference?: string;
      notes?: string;
    }
  ) => void;
  onToggleItem?: (orderId: string, itemId: string) => void;
  onPayoutCobbler?: (orderId: string, itemId: string, payFromDrawerCash: boolean) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  activeUser,
  onUpdateStatus,
  onAddPayment,
  onToggleItem,
  onPayoutCobbler,
}) => {
  if (!isOpen || !order) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'items' | 'payments' | 'history' | 'receipt'>('info');
  
  // Payment recording state
  const [paymentAmount, setPaymentAmount] = useState<number>(order.balanceAmount);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EFECTIVO');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Status transition state
  const [transitionError, setTransitionError] = useState<string | null>(null);
  const [showAdminExceptionModal, setShowAdminExceptionModal] = useState(false);
  const [adminExceptionReason, setAdminExceptionReason] = useState('');

  // Copy notification state
  const [copiedNotification, setCopiedNotification] = useState(false);

  const isAdmin = activeUser.role === 'ADMIN';
  const statusMeta = getOrderStatusMeta(order.status);
  const hasPendingBalance = order.balanceAmount > 0;
  const allItemsCompleted = order.items && order.items.length > 0 ? order.items.every((i) => i.isCompleted) : true;

  // Handle Status change request
  const handleRequestStatusChange = (targetStatus: OrderStatus) => {
    setTransitionError(null);

    // Business check: If trying to mark as ENTREGADA with pending balance
    if (targetStatus === 'ENTREGADA' && hasPendingBalance) {
      if (!isAdmin) {
        setTransitionError(
          `Acción bloqueada: No se puede entregar calzado con saldo pendiente de ${formatCOP(order.balanceAmount)}. Se requiere el pago total o la autorización de un Administrador.`
        );
        return;
      } else {
        setShowAdminExceptionModal(true);
        return;
      }
    }

    onUpdateStatus(order.id, targetStatus, `Cambio de estado a ${targetStatus} registrado por ${activeUser.name}`);
  };

  // Handle Admin Authorization of Delivery with Debt
  const handleConfirmAdminException = () => {
    if (!adminExceptionReason.trim()) {
      setTransitionError('Debe ingresar el motivo de la autorización expresa del saldo pendiente.');
      return;
    }

    onUpdateStatus(
      order.id,
      'ENTREGADA',
      `Entrega autorizada con deuda de ${formatCOP(order.balanceAmount)}. Motivo: ${adminExceptionReason}`,
      {
        deliveredBy: activeUser.name,
        receivedByName: order.clientName,
        adminAuthorizedDebt: true,
        adminAuthorizationReason: adminExceptionReason,
      }
    );
    setShowAdminExceptionModal(false);
    setAdminExceptionReason('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setPaymentSuccessMsg(null);

    if (paymentAmount <= 0) {
      setPaymentError('El monto a pagar debe ser mayor a cero.');
      return;
    }

    if (paymentAmount > order.balanceAmount) {
      setPaymentError(`El abono (${formatCOP(paymentAmount)}) no puede superar el saldo pendiente (${formatCOP(order.balanceAmount)}).`);
      return;
    }

    try {
      onAddPayment(order.id, {
        amount: paymentAmount,
        paymentMethod,
        reference: paymentReference || undefined,
        notes: paymentNotes || undefined,
      });

      setPaymentSuccessMsg(`¡Abono de ${formatCOP(paymentAmount)} registrado exitosamente!`);
      setPaymentAmount(Math.max(0, order.balanceAmount - paymentAmount));
      setPaymentReference('');
      setPaymentNotes('');
    } catch (err: any) {
      setPaymentError(err.message || 'Error registrando el pago');
    }
  };

  const handleSendWhatsApp = (type: 'RECEPCION' | 'LISTA' | 'ENTREGA') => {
    const { url } = generateWhatsAppNotification(order, type);
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-3xl w-full my-4 overflow-hidden flex flex-col">
        
        {/* Physical Blue Ticket Header */}
        <div className="bg-sky-800 text-white p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-black text-xl tracking-tight shadow-md">
              FICHA #{order.bagFichaNumber || 'S/F'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight">
                  Factura Nº {order.ticketNumber || order.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${statusMeta.badgeBg} ${statusMeta.badgeText}`}>
                  {statusMeta.label}
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Cajón: <strong className="text-amber-300 font-bold">{order.lockerLocation}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('receipt')}
              className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Ver Recibo Físico</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 px-4 gap-2 text-xs sm:text-sm font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-sky-600 text-sky-700 dark:text-sky-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            📋 Resumen y Saldo
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'items'
                ? 'border-sky-600 text-sky-700 dark:text-sky-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <span>🛍️ Prendas en Bolsa</span>
            <span className="px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-700 text-[10px]">
              {order.items?.length || 1}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-sky-600 text-sky-700 dark:text-sky-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            💵 Abonos ({formatCOPSimple(order.paidAmount)})
          </button>
          <button
            onClick={() => setActiveTab('receipt')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'receipt'
                ? 'border-sky-600 text-sky-700 dark:text-sky-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            🧾 Factura Don Elías
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-sky-600 text-sky-700 dark:text-sky-400'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            🕒 Historial
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[75vh] space-y-6">
          {transitionError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <span>{transitionError}</span>
            </div>
          )}

          {/* TAB 1: INFO & ACTIONS */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Financial Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-900 text-white rounded-2xl">
                <div>
                  <span className="text-xs text-stone-400 uppercase font-bold block">Total Trabajo</span>
                  <span className="text-2xl font-black tabular-nums">{formatCOP(order.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 uppercase font-bold block">Abonado</span>
                  <span className="text-2xl font-black text-emerald-400 tabular-nums">{formatCOP(order.paidAmount)}</span>
                </div>
                <div>
                  <span className="text-xs text-stone-400 uppercase font-bold block">Saldo por Cobrar</span>
                  <span className={`text-2xl font-black tabular-nums ${hasPendingBalance ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {hasPendingBalance ? formatCOP(order.balanceAmount) : '¡Paz y Salvo!'}
                  </span>
                </div>
              </div>

              {/* Client & Compartment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-2">
                  <span className="text-xs font-black uppercase text-stone-500">Cliente</span>
                  <div className="font-extrabold text-stone-900 dark:text-white text-lg">
                    {order.clientName}
                  </div>
                  <div className="text-sm text-stone-600 dark:text-stone-300 font-bold flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>{order.clientPhone}</span>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleSendWhatsApp(order.status === 'LISTA PARA ENTREGAR' ? 'LISTA' : 'RECEPCION')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Abrir WhatsApp del Cliente</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-2">
                  <span className="text-xs font-black uppercase text-stone-500">Ubicación y Entrega</span>
                  <div className="font-extrabold text-amber-600 text-lg">
                    {order.lockerLocation}
                  </div>
                  <div className="text-xs text-stone-500">
                    Día prometido: <strong>{getDeliveryDayLabel(order.deliveryDayOfWeek)}</strong>
                  </div>
                  <div className="text-xs text-stone-500">
                    Recibido el: {formatDate(order.receivedDate)}
                  </div>
                </div>
              </div>

              {/* Workflow Status Actions */}
              <div className="p-5 rounded-2xl border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 space-y-3">
                <span className="text-xs font-black uppercase text-stone-500 tracking-wider block">
                  Acciones Rápidas de Estado
                </span>

                <div className="flex flex-wrap items-center gap-3">
                  {order.status === 'RECIBIDA' && (
                    <button
                      onClick={() => handleRequestStatusChange('EN PROCESO')}
                      className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <span>📦 Iniciar Labores (Repartir a Oficios)</span>
                    </button>
                  )}

                  {order.status === 'EN PROCESO' && (
                    <button
                      onClick={() => handleRequestStatusChange('LISTA PARA ENTREGAR')}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>✓ Marcar como Lista para Entregar</span>
                    </button>
                  )}

                  {order.status === 'LISTA PARA ENTREGAR' && (
                    <button
                      onClick={() => handleRequestStatusChange('ENTREGADA')}
                      className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-black text-base rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                    >
                      <span>🤝 Entregar Calzado al Cliente</span>
                    </button>
                  )}

                  {order.status === 'ENTREGADA' && (
                    <div className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl text-stone-600 dark:text-stone-300 font-bold text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Pedido entregado satisfactoriamente</span>
                    </div>
                  )}

                  {hasPendingBalance && (
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Registrar Abono / Cancelar Saldo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ITEMS IN BAG & 50/50 SPLIT */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                    Prendas y Calzado de la Ficha #{order.bagFichaNumber}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Marca cuando el zapatero o modista traiga la pieza terminada
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {onToggleItem && (
                        <button
                          onClick={() => onToggleItem(order.id, item.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform active:scale-90 ${
                            item.isCompleted
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'border-2 border-stone-400 hover:border-emerald-600 text-transparent'
                          }`}
                          title={item.isCompleted ? 'Desmarcar' : 'Marcar como llegó'}
                        >
                          <Check className="w-5 h-5 stroke-[3]" />
                        </button>
                      )}

                      <div>
                        <h4 className={`text-base font-bold ${
                          item.isCompleted ? 'line-through text-emerald-950 dark:text-emerald-300' : 'text-stone-900 dark:text-white'
                        }`}>
                          {item.description}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="font-semibold text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-700 px-2 py-0.5 rounded">
                            {getWorkStationLabel(item.station)}
                          </span>
                          <span className="font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                            50% Artesano: {formatCOPSimple(item.cobblerCut)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {item.cobblerPaid ? (
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                          ✓ 50% Liquidado
                        </span>
                      ) : onPayoutCobbler ? (
                        <button
                          onClick={() => onPayoutCobbler(order.id, item.id, true)}
                          className="text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-stone-950 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          Pagar {formatCOPSimple(item.cobblerCut)} (Caja)
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS / ABONOS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {paymentSuccessMsg && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-sm font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{paymentSuccessMsg}</span>
                </div>
              )}

              {paymentError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm font-bold">
                  {paymentError}
                </div>
              )}

              {hasPendingBalance ? (
                <form onSubmit={handleRecordPayment} className="p-5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
                  <h4 className="text-base font-extrabold text-stone-900 dark:text-white">
                    Registrar Nuevo Abono o Cancelación de Saldo
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Valor a Recibir (Saldo Pendiente: {formatCOP(order.balanceAmount)})
                      </label>
                      <input
                        type="number"
                        min="500"
                        max={order.balanceAmount}
                        step="500"
                        value={paymentAmount || ''}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-xl font-black text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 tabular-nums"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        Medio de Pago
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-sm font-bold text-stone-900 dark:text-white focus:outline-none"
                      >
                        <option value="EFECTIVO">Efectivo (Gaveta del Taller)</option>
                        <option value="NEQUI">Nequi</option>
                        <option value="DAVIPLATA">Daviplata</option>
                        <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-base rounded-xl shadow-md transition-transform active:scale-95"
                  >
                    Guardar Abono de {formatCOP(paymentAmount)}
                  </button>
                </form>
              ) : (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-200">
                    ¡Esta orden está totalmente cancelada (Paz y Salvo)!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    No hay ningún valor pendiente por cobrar al cliente.
                  </p>
                </div>
              )}

              {/* Payments history table */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-stone-500 tracking-wider block">
                  Historial de Pagos Realizados
                </span>
                <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold">
                      <tr>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">Monto</th>
                        <th className="p-3">Medio</th>
                        <th className="p-3">Recibido por</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                      {order.payments?.map((p) => (
                        <tr key={p.id}>
                          <td className="p-3">{formatDate(p.date)}</td>
                          <td className="p-3 font-bold text-stone-900 dark:text-white tabular-nums">{formatCOP(p.amount)}</td>
                          <td className="p-3">{p.paymentMethod}</td>
                          <td className="p-3 text-stone-500">{p.registeredBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHYSICAL RECEIPT VISUAL REPLICA */}
          {activeTab === 'receipt' && (
            <div className="bg-sky-50 dark:bg-stone-950 p-4 sm:p-6 rounded-2xl border-2 border-sky-300 dark:border-sky-900 font-mono text-stone-900 dark:text-stone-100 max-w-xl mx-auto shadow-inner">
              {/* Receipt Header matching user attachment */}
              <div className="text-center border-b-2 border-dashed border-sky-400 pb-4 mb-4">
                <div className="text-xs font-bold tracking-wider uppercase text-sky-800 dark:text-sky-300">
                  CLÍNICA DE CALZADO Y ROPA
                </div>
                <div className="text-2xl font-black tracking-tight text-stone-900 dark:text-white mt-0.5">
                  "EL TIO"
                </div>
                <div className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                  JOSÉ ELÍAS OLIVEROS MARTÍNEZ
                </div>
                <div className="text-[10px] text-stone-600 dark:text-stone-400">
                  NIT. 17.018.382-1 - RÉGIMEN SIMPLIFICADO
                </div>
                <div className="text-[10px] text-stone-600 dark:text-stone-400 mt-1">
                  C.C. SANTIAGO PLAZA (CRA. 56 CON AUTOP. SIMON BOLIVAR) - CALI
                </div>
                <div className="text-[11px] font-black text-stone-800 dark:text-stone-200">
                  TEL. 317 507 8009
                </div>
              </div>

              {/* Receipt Info Fields */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div>
                  <span className="font-bold">Fecha: </span>
                  <span>{formatDate(order.receivedDate)}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-red-600">FACTURA Nº </span>
                  <span className="font-black text-red-600 text-sm">{order.ticketNumber || order.id}</span>
                </div>
                <div>
                  <span className="font-bold">Señor(es): </span>
                  <span className="font-bold">{order.clientName}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold bg-amber-300 text-stone-950 px-2 py-0.5 rounded text-xs font-black">
                    FICHA #{order.bagFichaNumber}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-bold">Cel: </span>
                  <span>{order.clientPhone}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-t-2 border-b-2 border-stone-800 dark:border-stone-400 py-2 mb-3">
                <div className="flex justify-between font-bold text-xs border-b border-stone-400 pb-1 mb-1">
                  <span>CANT. / DESCRIPCIÓN</span>
                  <span>VALOR</span>
                </div>
                {order.items?.map((item, idx) => (
                  <div key={item.id} className="flex justify-between text-xs py-1">
                    <span>1p {item.description}</span>
                    <span className="font-bold tabular-nums">{formatCOPSimple(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Bottom calculations */}
              <div className="space-y-1 text-xs border-b-2 border-dashed border-sky-400 pb-3 mb-3">
                <div className="flex justify-between font-black text-sm bg-sky-200/50 dark:bg-stone-800 p-1.5 rounded">
                  <span>DÍA DE ENTREGA:</span>
                  <span className="text-sky-900 dark:text-sky-200 font-extrabold uppercase">
                    {getDeliveryDayLabel(order.deliveryDayOfWeek)}
                  </span>
                </div>
                <div className="flex justify-between font-black text-sm">
                  <span>TOTAL:</span>
                  <span className="tabular-nums">{formatCOP(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ABONO:</span>
                  <span className="tabular-nums">{formatCOP(order.paidAmount)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-red-700 dark:text-red-400">
                  <span>SALDO:</span>
                  <span className="tabular-nums">{formatCOP(order.balanceAmount)}</span>
                </div>
              </div>

              {/* Legal clause */}
              <div className="text-[9px] text-stone-600 dark:text-stone-400 leading-tight text-center">
                NOTA: Si el producto no ha sido retirado dentro de los 45 días será considerado abandonado en los términos del Art. 2525 y 2526 del Código Civil Colombiano.
              </div>

              <div className="mt-4 pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Recibo</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <span className="text-xs font-black uppercase text-stone-500 tracking-wider block">
                Trazabilidad y Movimientos
              </span>

              <div className="space-y-3">
                {order.statusHistory?.map((h) => (
                  <div key={h.id} className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-stone-500">
                      <span className="font-bold text-stone-700 dark:text-stone-300">{h.changedBy}</span>
                      <span>{formatDateTime(h.changedAt)}</span>
                    </div>
                    <p className="font-semibold text-stone-900 dark:text-white">{h.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Ficha #{order.bagFichaNumber} · Cajón de {getDeliveryDayLabel(order.deliveryDayOfWeek)}
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
