import React, { useState, useEffect } from 'react';
import { 
  RepairOrder, 
  Client, 
  ServiceCatalogItem, 
  StaffMember, 
  FinancialSummary, 
  OrderStatus, 
  PaymentMethod,
  AppMode,
  CashExpense,
  NotificationType,
} from './types';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { OrderReceptionModal } from './components/OrderReceptionModal';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { ChuleoModal } from './components/ChuleoModal';
import { ExpenseModal } from './components/ExpenseModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ClientsView } from './components/ClientsView';
import { CatalogView } from './components/CatalogView';
import { ReportsView } from './components/ReportsView';
import { FinancesView } from './components/FinancesView';
import { PinModal } from './components/PinModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { ArchitectureInfoModal } from './components/ArchitectureInfoModal';
import { UserManualModal } from './components/UserManualModal';
import { formatCOP, formatCOPSimple, getOrderStatusMeta, getShoeTypeLabel, formatDate, generateWhatsAppNotification } from './utils/formatters';
import { Search, PlusCircle, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'clients' | 'catalog' | 'reports'>('dashboard');

  // Application Mode: Modo Don Elías (Mostrador - 86 años) vs Modo Supervisión (Yadi & Alexis)
  const [appMode, setAppMode] = useState<AppMode>(() => StorageService.getAppMode());

  // Application Data States
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [activeUser, setActiveUser] = useState<StaffMember>(() => StorageService.getActiveUser());
  const [summary, setSummary] = useState<FinancialSummary>(() => StorageService.getFinancialSummary());
  const [nextTicketNumber, setNextTicketNumber] = useState<number>(() => StorageService.getNextTicketNumber());

  // Modal Controls
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [isQuickSearchModalOpen, setIsQuickSearchModalOpen] = useState(false);
  const [isChuleoModalOpen, setIsChuleoModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isUserManualOpen, setIsUserManualOpen] = useState(false);

  // Security & Authentication Gate
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isAdministrationUnlocked, setIsAdministrationUnlocked] = useState(false);
  const [pendingActionAfterPin, setPendingActionAfterPin] = useState<(() => void) | null>(null);
  const [pinPromptTitle, setPinPromptTitle] = useState('Acceso Seguro a Administración');
  const [pinPromptDesc, setPinPromptDesc] = useState('Ingrese la clave de 4 dígitos para acceder al panel de administración.');

  // Orders View Filter
  const [orderListStatusFilter, setOrderListStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [orderListSearchQuery, setOrderListSearchQuery] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load All Data
  const refreshAllData = () => {
    const loadedOrders = StorageService.getOrders();
    const loadedClients = StorageService.getClients();
    const loadedServices = StorageService.getServices();
    const loadedStaff = StorageService.getStaff();
    const currentUser = StorageService.getActiveUser();
    const financialSummary = StorageService.getFinancialSummary();
    const currentTicket = StorageService.getNextTicketNumber();

    setOrders(loadedOrders);
    setClients(loadedClients);
    setServices(loadedServices);
    setStaffList(loadedStaff);
    setActiveUser(currentUser);
    setSummary(financialSummary);
    setNextTicketNumber(currentTicket);

    // Refresh selectedOrder if currently open in modal
    if (selectedOrder) {
      const refreshed = loadedOrders.find((o) => o.id === selectedOrder.id);
      if (refreshed) setSelectedOrder(refreshed);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Toggle App Mode with Password Protection
  const handleToggleAppMode = () => {
    if (appMode === 'DON_ELIAS') {
      // Switching from Mostrador El Tío to Administración: MUST ASK FOR PASSWORD
      setPinPromptTitle('Acceso a Administración & Supervisión');
      setPinPromptDesc('Ingrese su clave de 4 dígitos para ingresar al modo de administración y control.');
      setPendingActionAfterPin(() => () => {
        StorageService.setAppMode('SUPERVISION');
        setAppMode('SUPERVISION');
        setIsAdministrationUnlocked(true);
        showToast('🔒 Modo Administración y Supervisión activado');
      });
      setIsPinModalOpen(true);
    } else {
      // Returning to Mostrador El Tío: instantly lock session
      StorageService.setAppMode('DON_ELIAS');
      setAppMode('DON_ELIAS');
      setIsAdministrationUnlocked(false);
      setActiveTab('dashboard');
      showToast('👞 Mostrador El Tío activo (Atención al Cliente)');
    }
  };

  // Protected Tab Navigation
  const handleNavigateTab = (tab: 'dashboard' | 'orders' | 'clients' | 'catalog' | 'reports') => {
    if (tab === 'reports' && !isAdministrationUnlocked) {
      setPinPromptTitle('Acceso a Caja y Finanzas');
      setPinPromptDesc('Ingrese su clave de 4 dígitos para consultar los números de dinero y movimientos.');
      setPendingActionAfterPin(() => () => {
        setIsAdministrationUnlocked(true);
        setActiveTab('reports');
        showToast('🔓 Acceso a Caja y Finanzas concedido');
      });
      setIsPinModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    setIsAdministrationUnlocked(true);
    if (pendingActionAfterPin) {
      pendingActionAfterPin();
      setPendingActionAfterPin(null);
    }
  };

  const handleLockFinances = () => {
    setIsAdministrationUnlocked(false);
    StorageService.setAppMode('DON_ELIAS');
    setAppMode('DON_ELIAS');
    setActiveTab('dashboard');
    showToast('🔒 Sesión bloqueada. Regresando a Mostrador El Tío.');
  };

  // Handlers
  const handleSaveNewOrder = (
    orderData: Omit<RepairOrder, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>
  ) => {
    const created = StorageService.createOrder(orderData);
    refreshAllData();
    showToast(`Factura Nº ${created.ticketNumber} registrada exitosamente.`);
    setSelectedOrder(created);
    setIsOrderDetailsModalOpen(true);
  };

  const handleQuickCreateClient = (
    clientData: Omit<Client, 'id' | 'createdAt' | 'repairCount'>
  ): Client => {
    const created = StorageService.saveClient(clientData as Client);
    refreshAllData();
    return created;
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    reason?: string,
    deliveryDetails?: {
      deliveredBy: string;
      receivedByName?: string;
      adminAuthorizedDebt?: boolean;
      adminAuthorizationReason?: string;
    }
  ) => {
    const updated = StorageService.updateOrderStatus(orderId, newStatus, reason, deliveryDetails);
    refreshAllData();
    setSelectedOrder(updated);
    showToast(`Orden ${orderId} actualizada a estado: ${newStatus}`);
  };

  const handleAddPayment = (
    orderId: string,
    payment: {
      amount: number;
      paymentMethod: PaymentMethod;
      reference?: string;
      notes?: string;
    }
  ) => {
    const updated = StorageService.addOrderPayment(orderId, payment);
    refreshAllData();
    setSelectedOrder(updated);
    showToast(`Abono de ${formatCOP(payment.amount)} registrado en orden ${orderId}.`);
  };

  const handleToggleItemChuleo = (orderId: string, itemId: string) => {
    const updated = StorageService.toggleItemChuleo(orderId, itemId);
    refreshAllData();
    setSelectedOrder(updated);
  };

  const handlePayoutCobbler = (orderId: string, itemId: string, payFromDrawerCash: boolean) => {
    const updated = StorageService.payoutCobblerItem(orderId, itemId, payFromDrawerCash);
    refreshAllData();
    setSelectedOrder(updated);
    showToast('Liquidación 50% al artesano registrada.');
  };

  const handleSaveExpense = (expense: Omit<CashExpense, 'id'>) => {
    StorageService.addExpense(expense);
    refreshAllData();
    showToast(`Gasto de ${formatCOP(expense.amount)} registrado en la gaveta.`);
  };

  const handleConfirmReset = (includeRealSample: boolean) => {
    StorageService.resetToZero(includeRealSample);
    refreshAllData();
    showToast(includeRealSample ? 'Reinicio completado con Factura #1807 (Yanira González).' : 'Reinicio completado en blanco (cero órdenes).');
  };

  const handleNotifyWhatsApp = (order: RepairOrder, type?: NotificationType) => {
    const notifType: NotificationType = type || (order.status === 'LISTA PARA ENTREGAR' ? 'LISTA' : 'RECEPCION');
    const { url, previewSummary } = generateWhatsAppNotification(order, notifType);
    
    // Automatically log into legal evidence history
    const updated = StorageService.logOrderNotification(order.id, {
      type: notifType,
      sentBy: activeUser.name,
      recipientPhone: order.clientPhone,
      summary: previewSummary,
    });
    refreshAllData();
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder(updated);
    }
    window.open(url, '_blank');
    showToast(`Aviso registrado y enviado por WhatsApp (${notifType}).`);
  };

  const handleLogNotification = (
    orderId: string,
    type: NotificationType,
    summary: string
  ) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;
    const updated = StorageService.logOrderNotification(orderId, {
      type,
      sentBy: activeUser.name,
      recipientPhone: ord.clientPhone,
      summary,
    });
    refreshAllData();
    setSelectedOrder(updated);
    showToast(`Aviso de WhatsApp guardado en la bitácora legal.`);
  };

  const handleSaveClient = (client: Client) => {
    StorageService.saveClient(client);
    refreshAllData();
    showToast(`Cliente ${client.fullName} guardado.`);
  };

  const handleSaveService = (service: ServiceCatalogItem) => {
    StorageService.saveService(service);
    refreshAllData();
    showToast(`Servicio "${service.name}" actualizado.`);
  };

  const handleDeleteService = (id: string) => {
    const services = StorageService.getServices().filter((s) => s.id !== id);
    localStorage.setItem('zapateria_eltio_services_v2', JSON.stringify(services));
    refreshAllData();
    showToast('Servicio eliminado del catálogo.');
  };

  const handleSwitchUser = (staff: StaffMember) => {
    StorageService.setActiveUser(staff.id);
    setActiveUser(staff);
    showToast(`Usuario activo: ${staff.name}`);
  };

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zapateria-el-tio-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Copia de respaldo JSON descargada.');
  };

  const handleOpenOrderDetails = (order: RepairOrder) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  // Orders list filter
  const filteredOrderList = orders.filter((ord) => {
    const matchesStatus = orderListStatusFilter === 'ALL' || ord.status === orderListStatusFilter;
    const clean = orderListSearchQuery.trim().toLowerCase();
    if (!clean) return matchesStatus;

    const matchesSearch =
      ord.id.toLowerCase().includes(clean) ||
      (ord.ticketNumber && ord.ticketNumber.toString().includes(clean)) ||
      (ord.bagFichaNumber && ord.bagFichaNumber.toLowerCase().includes(clean)) ||
      ord.clientName.toLowerCase().includes(clean) ||
      ord.clientPhone.includes(clean) ||
      ord.lockerLocation.toLowerCase().includes(clean) ||
      ord.description.toLowerCase().includes(clean);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        appMode={appMode}
        onToggleAppMode={handleToggleAppMode}
        activeUser={activeUser}
        staffList={staffList}
        onSwitchUser={handleSwitchUser}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
        onOpenQuickSearch={() => setIsQuickSearchModalOpen(true)}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
        onOpenUserManual={() => setIsUserManualOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-5 pb-16">
        
        {/* View 1: Mostrador El Tío / Tablero */}
        {activeTab === 'dashboard' && (
          <Dashboard
            orders={orders}
            summary={summary}
            appMode={appMode}
            onOpenOrder={handleOpenOrderDetails}
            onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
            onOpenChuleoModal={() => setIsChuleoModalOpen(true)}
            onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
            onSearchOrders={() => setIsQuickSearchModalOpen(true)}
            onOpenUserManual={() => setIsUserManualOpen(true)}
            onNotifyWhatsApp={handleNotifyWhatsApp}
            onOpenReportsTab={() => handleNavigateTab('reports')}
            onRequestAdminMode={handleToggleAppMode}
            onReturnToMostrador={handleLockFinances}
          />
        )}

        {/* View 2: All Orders & Tracking Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6 pb-20 lg:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  Todas las Facturas y Reparaciones
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Búsqueda por número de Ficha, Factura, Celular, Cliente o Cajón de la semana.
                </p>
              </div>

              <button
                onClick={() => setIsNewOrderModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-stone-950" />
                <span>Registrar Factura / Ficha</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-x-auto scroll-touch">
                  {(['ALL', 'RECIBIDA', 'EN PROCESO', 'LISTA PARA ENTREGAR', 'ENTREGADA', 'CANCELADA'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderListStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        orderListStatusFilter === st
                          ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 shadow-xs'
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                      }`}
                    >
                      {st === 'ALL' ? 'Todas las facturas' : st}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por Ficha, celular, cliente..."
                    value={orderListSearchQuery}
                    onChange={(e) => setOrderListSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {orderListSearchQuery && (
                    <button
                      onClick={() => setOrderListSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Table View */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Ficha</th>
                      <th className="py-2.5 px-3">Factura</th>
                      <th className="py-2.5 px-3">Cliente & Contacto</th>
                      <th className="py-2.5 px-3">Prendas / Trabajo</th>
                      <th className="py-2.5 px-3">Ubicación / Cajón</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-right">Saldo</th>
                      <th className="py-2.5 px-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    {filteredOrderList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-stone-500">
                          No se encontraron órdenes registradas.
                        </td>
                      </tr>
                    ) : (
                      filteredOrderList.map((ord) => {
                        const meta = getOrderStatusMeta(ord.status);
                        return (
                          <tr
                            key={ord.id}
                            onClick={() => handleOpenOrderDetails(ord)}
                            className="hover:bg-stone-50 dark:hover:bg-stone-850 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-3 font-black text-amber-600 text-sm">
                              #{ord.bagFichaNumber || 'S/F'}
                            </td>
                            <td className="py-3 px-3 font-bold text-stone-900 dark:text-stone-100">
                              Nº {ord.ticketNumber || ord.id}
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-stone-900 dark:text-white block">
                                {ord.clientName}
                              </span>
                              <span className="text-[11px] text-stone-500 font-mono">
                                {ord.clientPhone}
                              </span>
                            </td>
                            <td className="py-3 px-3 max-w-xs">
                              <span className="text-stone-800 dark:text-stone-200 line-clamp-1">
                                {ord.description}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-amber-700 dark:text-amber-400 font-semibold">
                                {ord.lockerLocation}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right font-bold tabular-nums">
                              {formatCOPSimple(ord.totalAmount)}
                            </td>
                            <td className={`py-3 px-3 text-right font-black tabular-nums ${ord.balanceAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {formatCOPSimple(ord.balanceAmount)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${meta.badgeBg} ${meta.badgeText}`}>
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
        )}

        {/* View 3: Clients Directory */}
        {activeTab === 'clients' && (
          <ClientsView
            clients={clients}
            orders={orders}
            onSelectOrder={handleOpenOrderDetails}
            onSaveClient={handleSaveClient}
          />
        )}

        {/* View 4: Catalog */}
        {activeTab === 'catalog' && (
          <CatalogView
            services={services}
            activeUser={activeUser}
            onSaveService={handleSaveService}
            onDeleteService={handleDeleteService}
          />
        )}

        {/* View 5: Caja y Finanzas (Protegido con Contraseña) */}
        {activeTab === 'reports' && (
          <FinancesView
            summary={summary}
            orders={orders}
            onLockFinances={handleLockFinances}
            onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
            onOpenOrderDetails={handleOpenOrderDetails}
            onExportJSON={handleExportJSON}
            onResetDemoData={() => setIsResetModalOpen(true)}
            onRequestChangePin={() => setIsChangePasswordModalOpen(true)}
            onNotifyWhatsApp={handleNotifyWhatsApp}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile / Tablet */}
      {appMode === 'SUPERVISION' && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={handleNavigateTab}
          onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
        />
      )}

      {/* Modal: Reception of Order / Ficha */}
      <OrderReceptionModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        nextTicketNumber={nextTicketNumber}
        clients={clients}
        services={services}
        staffList={staffList}
        activeUser={activeUser}
        onSaveOrder={handleSaveNewOrder}
        onQuickCreateClient={handleQuickCreateClient}
      />

      {/* Modal: Order Details & Physical Receipt */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderDetailsModalOpen}
        onClose={() => setIsOrderDetailsModalOpen(false)}
        activeUser={activeUser}
        onUpdateStatus={handleUpdateOrderStatus}
        onAddPayment={handleAddPayment}
        onToggleItem={handleToggleItemChuleo}
        onPayoutCobbler={handlePayoutCobbler}
        onLogNotification={handleLogNotification}
      />

      {/* Modal: Chuleo de Llegada (50/50) */}
      <ChuleoModal
        isOpen={isChuleoModalOpen}
        onClose={() => setIsChuleoModalOpen(false)}
        orders={orders}
        onToggleItem={handleToggleItemChuleo}
        onPayoutCobbler={handlePayoutCobbler}
        onNotifyWhatsApp={handleNotifyWhatsApp}
        onOpenOrderDetails={handleOpenOrderDetails}
      />

      {/* Modal: Register Expense / Almuerzo */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSaveExpense={handleSaveExpense}
        activeUserName={activeUser.name}
      />

      {/* Modal: Reset / Clean Data to Zero */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />

      {/* Modal: Quick Search by Phone / Ficha */}
      <QuickSearchModal
        isOpen={isQuickSearchModalOpen}
        onClose={() => setIsQuickSearchModalOpen(false)}
        orders={orders}
        clients={clients}
        onSelectOrder={handleOpenOrderDetails}
        onSelectClient={(cli) => {
          setOrderListSearchQuery(cli.phone);
          setActiveTab('orders');
        }}
      />

      {/* Modal: Architecture Info */}
      <ArchitectureInfoModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Modal: User Manual */}
      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
      />

      {/* Security Gate: PIN Modal for Admin & Finances */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          setPendingActionAfterPin(null);
        }}
        onSuccess={handlePinSuccess}
        title={pinPromptTitle}
        description={pinPromptDesc}
      />

      {/* Security Gate: Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSuccess={(msg) => showToast(msg)}
        activeUserName={activeUser.name}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-stone-900 text-stone-100 border border-amber-500/30 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in text-xs sm:text-sm font-semibold max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
