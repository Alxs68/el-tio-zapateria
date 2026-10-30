import {
  RepairOrder,
  Client,
  ServiceCatalogItem,
  StaffMember,
  FinancialSummary,
  OrderStatus,
  PaymentMethod,
  OrderPayment,
  BagItem,
  CashExpense,
  DeliveryDay,
  WorkStation,
  NotificationType,
  OrderNotificationLog,
  MoneyMovement,
} from '../types';

const STORAGE_KEYS = {
  ORDERS: 'zapateria_eltio_orders_v2',
  CLIENTS: 'zapateria_eltio_clients_v2',
  SERVICES: 'zapateria_eltio_services_v2',
  STAFF: 'zapateria_eltio_staff_v2',
  EXPENSES: 'zapateria_eltio_expenses_v2',
  ACTIVE_USER: 'zapateria_eltio_active_user_v2',
  NEXT_TICKET_NUM: 'zapateria_eltio_next_ticket_v2',
  APP_MODE: 'zapateria_eltio_app_mode_v2',
  FINANCE_PIN: 'zapateria_eltio_finance_pin_v2',
};

// Initial Seed Catalog including Shoes, Clothing/Modistería and Leather Goods
const INITIAL_SERVICES: ServiceCatalogItem[] = [
  {
    id: 'srv-1',
    name: 'Cambio de Tapas para Tacón',
    description: 'Reemplazo de tapas de poliuretano antideslizante de alta durabilidad.',
    category: 'suelas',
    basePrice: 15000,
    estimatedHours: 2,
    active: true,
  },
  {
    id: 'srv-2',
    name: 'Cambio de Suela Completa (Cuero o Crepé)',
    description: 'Desmonte total de suela vieja, nivelado de planta y postura de suela nueva importada.',
    category: 'suelas',
    basePrice: 65000,
    estimatedHours: 24,
    active: true,
  },
  {
    id: 'srv-3',
    name: 'Cosido y Pegado Perimetral Reforzado',
    description: 'Pegado con cemento de contacto vulcanizado más costura con hilo encerado #3.',
    category: 'costura',
    basePrice: 22000,
    estimatedHours: 4,
    active: true,
  },
  {
    id: 'srv-4',
    name: 'Tintura y Lustre Artesanal a la Crema',
    description: 'Limpieza profunda de poros, tintura al tono original y acabado con cera carnauba.',
    category: 'lustre',
    basePrice: 30000,
    estimatedHours: 6,
    active: true,
  },
  {
    id: 'srv-5',
    name: 'Reparación de Zapatillas / Tenis (Makey, etc.)',
    description: 'Pegado vulcanizado, remiendo de capellada, costura perimetral o cambio de taloneras.',
    category: 'suelas',
    basePrice: 23000,
    estimatedHours: 5,
    active: true,
  },
  {
    id: 'srv-6',
    name: 'Modistería: Ruedo / Dobladillo de Pantalón',
    description: 'Toma de medida, corte simétrico y costura invisible o pespunte fino a máquina.',
    category: 'ropa',
    basePrice: 12000,
    estimatedHours: 3,
    active: true,
  },
  {
    id: 'srv-7',
    name: 'Modistería: Cambio de Cremallera en Prenda',
    description: 'Desmonte de cierre dañado, instalación de cremallera nueva reforzada en chaqueta o falda.',
    category: 'ropa',
    basePrice: 18000,
    estimatedHours: 4,
    active: true,
  },
  {
    id: 'srv-8',
    name: 'Modistería: Ajuste de Cintura o Mangas',
    description: 'Reducción de cintura o entalle lateral de camisas, vestidos o pantalones.',
    category: 'ropa',
    basePrice: 20000,
    estimatedHours: 5,
    active: true,
  },
  {
    id: 'srv-9',
    name: 'Cambio de Cremallera / Cierre para Botas',
    description: 'Instalación de cremallera metálica YKK para botas de caña alta o botines.',
    category: 'accesorios',
    basePrice: 28000,
    estimatedHours: 5,
    active: true,
  },
  {
    id: 'srv-10',
    name: 'Plantillas Ortopédicas en Badana Natural',
    description: 'Confección a la medida con soporte de arco metatarsiano y badana suave transpirable.',
    category: 'ortopedia',
    basePrice: 25000,
    estimatedHours: 3,
    active: true,
  },
  {
    id: 'srv-11',
    name: 'Alargue o Ensanche en Horma Calefactada',
    description: 'Proceso mecánico progresivo de 48 horas para ampliar empeine o longitud.',
    category: 'general',
    basePrice: 18000,
    estimatedHours: 48,
    active: true,
  },
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-1',
    name: 'Don José Elías Oliveros ("Don Tío")',
    role: 'ADMIN',
    specialty: 'Maestro Zapatero & Mostrador (86 años)',
    phone: '3175078009',
    active: true,
  },
  {
    id: 'stf-2',
    name: 'Yadi Oliveros',
    role: 'ADMIN',
    specialty: 'Administración, Cuentas y Supervisión',
    phone: '3150000000',
    active: true,
  },
  {
    id: 'stf-3',
    name: 'Alexis Oliveros',
    role: 'ADMIN',
    specialty: 'Sistemas y Soporte Familiar',
    phone: '3104567890',
    active: true,
  },
  {
    id: 'stf-4',
    name: 'Esposa de Don Elías (Modistería)',
    role: 'OPERARIO',
    specialty: 'Confección, Ruedos y Cremalleras de Ropa',
    phone: '',
    active: true,
  },
  {
    id: 'stf-5',
    name: 'Maestro Solador',
    role: 'OPERARIO',
    specialty: 'Suelas, Tapas, Tacones y Clavado',
    phone: '',
    active: true,
  },
  {
    id: 'stf-6',
    name: 'Maestro Costura Calzado',
    role: 'OPERARIO',
    specialty: 'Costura Pesada, Parches y Cremalleras de Botas',
    phone: '',
    active: true,
  },
];

// Initial Real Clients: starting with Yanira González from verified physical receipt 1807
const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-yanira-1807',
    fullName: 'Yanira González',
    phone: '3108924435',
    notes: 'Cliente de factura #1807. Reparación zapatillas Makey.',
    createdAt: '2026-10-27T10:00:00.000Z',
    repairCount: 1,
  },
];

// Initial Verified Order: Receipt #1807
const INITIAL_ORDERS: RepairOrder[] = [
  {
    id: 'ORD-1807',
    ticketNumber: 1807,
    bagFichaNumber: '13',
    deliveryDayOfWeek: 'JUEVES',
    clientId: 'cli-yanira-1807',
    clientName: 'Yanira González',
    clientPhone: '3108924435',
    hasWhatsApp: true,
    receivedDate: '2026-10-27T10:00:00.000Z',
    estimatedDeliveryDate: '2026-10-29T17:00:00.000Z',
    shoeType: 'tenis_deportivos',
    description: '1p Zapatillas Azules Makey (Ficha #13 - Cajón de JUEVES)',
    items: [
      {
        id: 'itm-1807-1',
        articleType: 'CALZADO',
        description: '1p Zapatillas Azules Makey',
        station: 'SOLADOR',
        price: 23000,
        cobblerCut: 11500, // 50% split for cobbler
        cobblerPaid: false,
        isCompleted: false,
      },
    ],
    services: [
      {
        serviceId: 'srv-5',
        name: 'Reparación de Zapatillas / Tenis (Makey)',
        price: 23000,
      },
    ],
    totalAmount: 23000,
    paidAmount: 23000,
    balanceAmount: 0, // Paid in full
    lockerLocation: 'Cajón de JUEVES (Ficha #13)',
    assignedStaffId: 'stf-5',
    assignedStaffName: 'Maestro Solador',
    observations: 'Trabajo con Ficha #13. Entregar día Jueves. Paz y salvo cancelado.',
    photos: [],
    dataPrivacyAuthorized: true,
    status: 'RECIBIDA',
    statusHistory: [
      {
        id: 'hist-1807',
        toStatus: 'RECIBIDA',
        changedAt: '2026-10-27T10:00:00.000Z',
        changedBy: 'Don José Elías Oliveros ("Don Tío")',
        reason: 'Recibido en mostrador con Ficha #13 para entregar el Jueves. Cancelado total $23.000',
      },
    ],
    payments: [
      {
        id: 'pay-1807',
        date: '2026-10-27T10:00:00.000Z',
        amount: 23000,
        paymentMethod: 'EFECTIVO',
        reference: 'Recibo #1807',
        registeredBy: 'Don José Elías Oliveros ("Don Tío")',
        notes: 'Pago total por adelantado en efectivo al recibir las zapatillas',
      },
    ],
    createdAt: '2026-10-27T10:00:00.000Z',
    updatedAt: '2026-10-27T10:00:00.000Z',
  },
];

export class StorageService {
  private static load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  private static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save to localStorage for key ${key}:`, e);
    }
  }

  // Next Ticket Sequence Number (default starting at 1808)
  static getNextTicketNumber(): number {
    const raw = localStorage.getItem(STORAGE_KEYS.NEXT_TICKET_NUM);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NEXT_TICKET_NUM, '1808');
      return 1808;
    }
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 1808 : parsed;
  }

  static incrementTicketNumber(): number {
    const current = this.getNextTicketNumber();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEYS.NEXT_TICKET_NUM, next.toString());
    return current;
  }

  // App Mode (Don Elías vs Supervisión)
  static getAppMode(): 'DON_ELIAS' | 'SUPERVISION' {
    const mode = localStorage.getItem(STORAGE_KEYS.APP_MODE);
    if (mode === 'SUPERVISION') return 'SUPERVISION';
    return 'DON_ELIAS'; // Default to Don Elías friendly mode
  }

  static setAppMode(mode: 'DON_ELIAS' | 'SUPERVISION'): void {
    localStorage.setItem(STORAGE_KEYS.APP_MODE, mode);
  }

  // Services Catalog
  static getServices(): ServiceCatalogItem[] {
    const list = this.load<ServiceCatalogItem[]>(STORAGE_KEYS.SERVICES, []);
    if (list.length === 0) {
      this.save(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
      return INITIAL_SERVICES;
    }
    return list;
  }

  static saveService(item: ServiceCatalogItem): ServiceCatalogItem {
    const list = this.getServices();
    const idx = list.findIndex((s) => s.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    this.save(STORAGE_KEYS.SERVICES, list);
    return item;
  }

  // Staff
  static getStaff(): StaffMember[] {
    const list = this.load<StaffMember[]>(STORAGE_KEYS.STAFF, []);
    if (list.length === 0) {
      this.save(STORAGE_KEYS.STAFF, INITIAL_STAFF);
      return INITIAL_STAFF;
    }
    return list;
  }

  static getActiveUser(): StaffMember {
    const user = this.load<StaffMember | null>(STORAGE_KEYS.ACTIVE_USER, null);
    if (user) return user;
    const staff = this.getStaff();
    const defaultUser = staff[0] || INITIAL_STAFF[0];
    this.save(STORAGE_KEYS.ACTIVE_USER, defaultUser);
    return defaultUser;
  }

  static setActiveUser(staffId: string): StaffMember {
    const staff = this.getStaff();
    const found = staff.find((s) => s.id === staffId);
    if (found) {
      this.save(STORAGE_KEYS.ACTIVE_USER, found);
      return found;
    }
    return this.getActiveUser();
  }

  // Clients
  static getClients(): Client[] {
    const list = this.load<Client[]>(STORAGE_KEYS.CLIENTS, []);
    if (list.length === 0) {
      this.save(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
      return INITIAL_CLIENTS;
    }
    return list;
  }

  static getClientByPhone(phone: string): Client | undefined {
    const clean = phone.replace(/\D/g, '');
    if (!clean) return undefined;
    return this.getClients().find((c) => c.phone.replace(/\D/g, '').includes(clean));
  }

  static saveClient(client: Client): Client {
    const list = this.getClients();
    const cleanPhone = client.phone.replace(/\D/g, '');
    const idx = list.findIndex(
      (c) => c.id === client.id || (cleanPhone && c.phone.replace(/\D/g, '') === cleanPhone)
    );

    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        ...client,
        phone: cleanPhone || client.phone,
      };
      this.save(STORAGE_KEYS.CLIENTS, list);
      return list[idx];
    }

    const newClient: Client = {
      ...client,
      id: client.id || `cli-${Date.now()}`,
      phone: cleanPhone || client.phone,
      createdAt: client.createdAt || new Date().toISOString(),
      repairCount: client.repairCount || 0,
    };
    list.unshift(newClient);
    this.save(STORAGE_KEYS.CLIENTS, list);
    return newClient;
  }

  // Expenses
  static getExpenses(): CashExpense[] {
    return this.load<CashExpense[]>(STORAGE_KEYS.EXPENSES, []);
  }

  static addExpense(expense: Omit<CashExpense, 'id'>): CashExpense {
    const list = this.getExpenses();
    const newExp: CashExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    list.unshift(newExp);
    this.save(STORAGE_KEYS.EXPENSES, list);
    return newExp;
  }

  // Orders
  static getOrders(): RepairOrder[] {
    const list = this.load<RepairOrder[]>(STORAGE_KEYS.ORDERS, []);
    if (list.length === 0) {
      this.save(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      return INITIAL_ORDERS;
    }
    return list;
  }

  static getOrderById(id: string): RepairOrder | undefined {
    return this.getOrders().find((o) => o.id === id);
  }

  static createOrder(
    data: Omit<RepairOrder, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>
  ): RepairOrder {
    const orders = this.getOrders();
    const ticketNum = data.ticketNumber || this.incrementTicketNumber();
    const orderId = `ORD-${ticketNum}`;
    const now = new Date().toISOString();
    const activeUser = this.getActiveUser();

    // Ensure items have proper structure
    const items: BagItem[] = (data.items && data.items.length > 0)
      ? data.items
      : [
          {
            id: `itm-${Date.now()}-1`,
            articleType: 'CALZADO',
            description: data.description || 'Arreglo de calzado',
            station: 'SOLADOR',
            price: data.totalAmount || 0,
            cobblerCut: Math.round((data.totalAmount || 0) * 0.5),
            cobblerPaid: false,
            isCompleted: false,
          },
        ];

    const initialHistory = [
      {
        id: `hist-${Date.now()}`,
        toStatus: 'RECIBIDA' as OrderStatus,
        changedAt: now,
        changedBy: activeUser.name,
        reason: `Recepción con Ficha #${data.bagFichaNumber || 'S/N'} para entrega el día ${data.deliveryDayOfWeek || 'PRÓXIMO'}. Abono inicial: $${(data.paidAmount || 0).toLocaleString('es-CO')}`,
      },
    ];

    const newOrder: RepairOrder = {
      ...data,
      id: orderId,
      ticketNumber: ticketNum,
      bagFichaNumber: data.bagFichaNumber || 'S/F',
      deliveryDayOfWeek: data.deliveryDayOfWeek || 'SABADO',
      hasWhatsApp: data.hasWhatsApp ?? true,
      items,
      createdAt: now,
      updatedAt: now,
      status: 'RECIBIDA',
      statusHistory: initialHistory,
      payments: data.payments || [],
      lockerLocation: data.lockerLocation || `Cajón de ${data.deliveryDayOfWeek || 'ENTREGA'} (Ficha #${data.bagFichaNumber || 'S/F'})`,
    };

    orders.unshift(newOrder);
    this.save(STORAGE_KEYS.ORDERS, orders);

    // Update client repair count
    if (data.clientId) {
      const clients = this.getClients();
      const cIdx = clients.findIndex((c) => c.id === data.clientId);
      if (cIdx >= 0) {
        clients[cIdx].repairCount = (clients[cIdx].repairCount || 0) + 1;
        this.save(STORAGE_KEYS.CLIENTS, clients);
      }
    }

    return newOrder;
  }

  /**
   * Chuleo de artículo terminado:
   * When artisan returns an item, check it off. If 100% of items in the bag are completed,
   * auto-advance order status to 'LISTA PARA ENTREGAR'.
   */
  static toggleItemChuleo(orderId: string, itemId: string): RepairOrder {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Orden no encontrada');

    const order = orders[idx];
    const now = new Date().toISOString();
    const activeUser = this.getActiveUser();

    const itm = order.items.find((i) => i.id === itemId);
    if (!itm) throw new Error('Artículo no encontrado en la bolsa');

    itm.isCompleted = !itm.isCompleted;
    itm.completedAt = itm.isCompleted ? now : undefined;

    // Check if 100% of items are completed
    const allCompleted = order.items.every((i) => i.isCompleted);
    const prevStatus = order.status;

    if (allCompleted && order.status !== 'ENTREGADA') {
      order.status = 'LISTA PARA ENTREGAR';
      order.statusHistory.push({
        id: `hist-${Date.now()}`,
        fromStatus: prevStatus,
        toStatus: 'LISTA PARA ENTREGAR',
        changedAt: now,
        changedBy: activeUser.name,
        reason: `Todas las piezas de la Ficha #${order.bagFichaNumber} fueron chuleadas y están completas en la bolsa. Listo para avisar al cliente.`,
      });
    } else if (!allCompleted && order.status === 'LISTA PARA ENTREGAR') {
      order.status = 'EN PROCESO';
      order.statusHistory.push({
        id: `hist-${Date.now()}`,
        fromStatus: prevStatus,
        toStatus: 'EN PROCESO',
        changedAt: now,
        changedBy: activeUser.name,
        reason: `Se desmarcó una pieza en la Ficha #${order.bagFichaNumber}. Vuelve a estado en proceso.`,
      });
    }

    order.updatedAt = now;
    orders[idx] = order;
    this.save(STORAGE_KEYS.ORDERS, orders);
    return order;
  }

  /**
   * Payout 50% cut to cobbler/artisan:
   * Can pay immediately from counter cash drawer or accumulate for Saturday.
   */
  static payoutCobblerItem(
    orderId: string,
    itemId: string,
    payFromDrawerCash: boolean = true
  ): RepairOrder {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Orden no encontrada');

    const order = orders[idx];
    const activeUser = this.getActiveUser();
    const now = new Date().toISOString();

    const itm = order.items.find((i) => i.id === itemId);
    if (!itm) throw new Error('Artículo no encontrado en la bolsa');

    itm.cobblerPaid = true;
    itm.cobblerPaidDate = now;

    // If paid immediately in cash, record cash expense out of the drawer
    if (payFromDrawerCash && itm.cobblerCut > 0) {
      this.addExpense({
        date: now,
        amount: itm.cobblerCut,
        category: 'PAGO_ZAPATERO',
        description: `Pago 50% zapatero por Ficha #${order.bagFichaNumber} (${itm.description})`,
        registeredBy: activeUser.name,
      });
    }

    order.statusHistory.push({
      id: `hist-${Date.now()}`,
      toStatus: order.status,
      changedAt: now,
      changedBy: activeUser.name,
      reason: `Liquidado 50% al artesano: $${itm.cobblerCut.toLocaleString('es-CO')} ${payFromDrawerCash ? '(Efectivo de caja)' : '(Acumulado)'}`,
    });

    order.updatedAt = now;
    orders[idx] = order;
    this.save(STORAGE_KEYS.ORDERS, orders);
    return order;
  }

  static updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    reason?: string,
    deliveryDetails?: {
      deliveredBy: string;
      receivedByName?: string;
      adminAuthorizedDebt?: boolean;
      adminAuthorizationReason?: string;
    }
  ): RepairOrder {
    const all = this.getOrders();
    const index = all.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Orden no encontrada');

    const order = all[index];
    const prevStatus = order.status;
    const now = new Date().toISOString();
    const activeUser = this.getActiveUser();

    order.status = newStatus;
    order.updatedAt = now;

    order.statusHistory.push({
      id: `hist-${Date.now()}`,
      fromStatus: prevStatus,
      toStatus: newStatus,
      changedAt: now,
      changedBy: activeUser.name,
      reason: reason || `Cambio de estado a ${newStatus}`,
    });

    if (newStatus === 'ENTREGADA') {
      order.deliveryDetails = {
        deliveredAt: now,
        deliveredBy: deliveryDetails?.deliveredBy || activeUser.name,
        receivedByName: deliveryDetails?.receivedByName || order.clientName,
        adminAuthorizedDebt: deliveryDetails?.adminAuthorizedDebt || false,
        adminAuthorizationReason: deliveryDetails?.adminAuthorizationReason,
      };
    }

    all[index] = order;
    this.save(STORAGE_KEYS.ORDERS, all);
    return order;
  }

  static addOrderPayment(
    orderId: string,
    payment: {
      amount: number;
      paymentMethod: PaymentMethod;
      reference?: string;
      notes?: string;
      registeredBy?: string;
    }
  ): RepairOrder {
    const all = this.getOrders();
    const index = all.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Orden no encontrada');

    const order = all[index];
    const activeUser = this.getActiveUser();
    const now = new Date().toISOString();

    if (payment.amount <= 0) {
      throw new Error('El valor del pago debe ser mayor a cero.');
    }

    const newPayment: OrderPayment = {
      id: `pay-${Date.now()}`,
      date: now,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      reference: payment.reference,
      registeredBy: payment.registeredBy || activeUser.name,
      notes: payment.notes,
    };

    order.payments.push(newPayment);
    order.paidAmount += payment.amount;
    order.balanceAmount = Math.max(0, order.totalAmount - order.paidAmount);
    order.updatedAt = now;

    // Log in history
    order.statusHistory.push({
      id: `hist-${Date.now()}`,
      toStatus: order.status,
      changedAt: now,
      changedBy: activeUser.name,
      reason: `Pago recibido: $${payment.amount.toLocaleString('es-CO')} vía ${payment.paymentMethod}. Saldo restante: $${order.balanceAmount.toLocaleString('es-CO')}`,
    });

    all[index] = order;
    this.save(STORAGE_KEYS.ORDERS, all);
    return order;
  }

  /**
   * Registers a WhatsApp notification sent to the client as legal and operational proof
   */
  static logOrderNotification(
    orderId: string,
    notification: {
      type: NotificationType;
      sentBy: string;
      recipientPhone: string;
      summary: string;
    }
  ): RepairOrder {
    const all = this.getOrders();
    const index = all.findIndex((o) => o.id === orderId);
    if (index === -1) throw new Error('Orden no encontrada');

    const order = all[index];
    const now = new Date().toISOString();

    if (!order.notificationLogs) {
      order.notificationLogs = [];
    }

    const logEntry: OrderNotificationLog = {
      id: `notif-${Date.now()}`,
      type: notification.type,
      sentAt: now,
      sentBy: notification.sentBy,
      recipientPhone: notification.recipientPhone,
      summary: notification.summary,
    };

    order.notificationLogs.push(logEntry);
    order.updatedAt = now;

    // Register in history for legal backing
    order.statusHistory.push({
      id: `hist-${Date.now()}`,
      toStatus: order.status,
      changedAt: now,
      changedBy: notification.sentBy,
      reason: `Aviso WhatsApp (${notification.type}) enviado al ${notification.recipientPhone}: "${notification.summary}"`,
    });

    all[index] = order;
    this.save(STORAGE_KEYS.ORDERS, all);
    return order;
  }

  // Search orders quickly by phone, ficha number, client name, or ticket number
  static searchOrders(query: string): RepairOrder[] {
    const clean = query.trim().toLowerCase();
    if (!clean) return this.getOrders();
    const cleanDigits = query.replace(/\D/g, '');

    return this.getOrders().filter((ord) => {
      const matchPhone = cleanDigits && ord.clientPhone.replace(/\D/g, '').includes(cleanDigits);
      const matchFicha = ord.bagFichaNumber && ord.bagFichaNumber.toLowerCase() === clean;
      const matchId = ord.id.toLowerCase().includes(clean);
      const matchName = ord.clientName.toLowerCase().includes(clean);
      const matchTicket = ord.ticketNumber && ord.ticketNumber.toString().includes(clean);
      const matchDesc = ord.description.toLowerCase().includes(clean);
      return matchPhone || matchFicha || matchId || matchName || matchTicket || matchDesc;
    });
  }

  // Financial Summary & Live Cash Drawer Balance
  static getFinancialSummary(): FinancialSummary {
    const orders = this.getOrders();
    const expenses = this.getExpenses();
    const todayStr = new Date().toISOString().split('T')[0];

    let totalPendingBalance = 0;
    let totalRevenueCollected = 0;
    let todayRevenue = 0;
    let todayCashCollected = 0;
    let todayNequiDaviplataCollected = 0;

    let receivedCount = 0;
    let inProcessCount = 0;
    let readyCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;

    for (const ord of orders) {
      if (ord.status === 'RECIBIDA') receivedCount++;
      else if (ord.status === 'EN PROCESO') inProcessCount++;
      else if (ord.status === 'LISTA PARA ENTREGAR') readyCount++;
      else if (ord.status === 'ENTREGADA') deliveredCount++;
      else if (ord.status === 'CANCELADA') cancelledCount++;

      if (ord.status !== 'CANCELADA') {
        totalPendingBalance += ord.balanceAmount;
      }

      for (const p of ord.payments) {
        totalRevenueCollected += p.amount;
        if (p.date.startsWith(todayStr)) {
          todayRevenue += p.amount;
          if (p.paymentMethod === 'EFECTIVO') {
            todayCashCollected += p.amount;
          } else {
            todayNequiDaviplataCollected += p.amount;
          }
        }
      }
    }

    let todayExpenses = 0;
    let todayCobblerPayouts = 0;
    for (const exp of expenses) {
      if (exp.date.startsWith(todayStr)) {
        todayExpenses += exp.amount;
        if (exp.category === 'PAGO_ZAPATERO') {
          todayCobblerPayouts += exp.amount;
        }
      }
    }

    // Expected cash in drawer = today's cash collections minus expenses paid in cash
    const expectedCashInDrawer = Math.max(0, todayCashCollected - todayExpenses);

    return {
      receivedCount,
      inProcessCount,
      readyCount,
      deliveredCount,
      cancelledCount,
      totalOrders: orders.length,
      totalPendingBalance,
      totalRevenueCollected,
      todayRevenue,
      todayCashCollected,
      todayNequiDaviplataCollected,
      todayExpenses,
      todayCobblerPayouts,
      expectedCashInDrawer,
    };
  }

  // Reset to Zero with Clean Workshop
  static resetToZero(includeRealTicket1807: boolean = true): void {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);

    if (includeRealTicket1807) {
      this.save(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      this.save(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
      localStorage.setItem(STORAGE_KEYS.NEXT_TICKET_NUM, '1808');
    } else {
      this.save(STORAGE_KEYS.ORDERS, []);
      this.save(STORAGE_KEYS.CLIENTS, []);
      localStorage.setItem(STORAGE_KEYS.NEXT_TICKET_NUM, '1801');
    }
  }

  // Security PIN for Finances and Cash Movement
  static getFinancePin(): string {
    const saved = localStorage.getItem(STORAGE_KEYS.FINANCE_PIN);
    return saved || '1234';
  }

  static setFinancePin(pin: string): void {
    if (!pin || pin.length < 4) {
      throw new Error('El PIN debe tener al menos 4 dígitos numéricos.');
    }
    localStorage.setItem(STORAGE_KEYS.FINANCE_PIN, pin);
  }

  static verifyFinancePin(pin: string): boolean {
    const current = this.getFinancePin();
    return pin.trim() === current.trim();
  }

  // Get all money movements (inflows and outflows) in chronological order
  static getAllMoneyMovements(): MoneyMovement[] {
    const orders = this.getOrders();
    const expenses = this.getExpenses();
    const movements: MoneyMovement[] = [];

    // Order payments (inflows)
    for (const ord of orders) {
      ord.payments.forEach((p, idx) => {
        const isFirst = idx === 0 && p.amount < ord.totalAmount;
        movements.push({
          id: p.id || `pay-${ord.id}-${idx}`,
          date: p.date,
          type: isFirst ? 'INGRESO_ABONO' : 'INGRESO_SALDO',
          amount: p.amount,
          paymentMethod: p.paymentMethod,
          description: `Cobro ${isFirst ? 'Abono Inicial' : 'Saldo/Pago'} - Factura #${ord.ticketNumber || ord.id}`,
          reference: p.reference,
          registeredBy: p.registeredBy || 'Caja',
          orderId: ord.id,
          ticketNumber: ord.ticketNumber,
          bagFichaNumber: ord.bagFichaNumber,
          clientName: ord.clientName,
        });
      });
    }

    // Cash expenses (outflows)
    for (const exp of expenses) {
      movements.push({
        id: exp.id,
        date: exp.date,
        type: exp.category === 'PAGO_ZAPATERO' ? 'EGRESO_PAGO_ARTESANO' : 'EGRESO_GASTO',
        amount: exp.amount,
        paymentMethod: 'EFECTIVO',
        description: exp.description || `Gasto menor: ${exp.category}`,
        registeredBy: exp.registeredBy || 'Caja',
      });
    }

    // Sort descending by date (most recent first)
    return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Backup & JSON Export
  static exportDataJSON(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      shop: 'Clínica de Calzado y Ropa El Tío',
      nit: '17.018.382-1',
      orders: this.getOrders(),
      clients: this.getClients(),
      services: this.getServices(),
      staff: this.getStaff(),
      expenses: this.getExpenses(),
    };
    return JSON.stringify(data, null, 2);
  }
}
