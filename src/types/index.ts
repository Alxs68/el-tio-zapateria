export type OrderStatus = 
  | 'RECIBIDA'
  | 'EN PROCESO'
  | 'LISTA PARA ENTREGAR'
  | 'ENTREGADA'
  | 'CANCELADA';

export type ShoeType = 
  | 'zapatos_formales'
  | 'tenis_deportivos'
  | 'botas_cuero'
  | 'tacones'
  | 'sandalias'
  | 'mocasines'
  | 'botines'
  | 'ropa_prenda'
  | 'marroquineria_bolso'
  | 'otro';

export type DeliveryDay = 
  | 'LUNES' 
  | 'MARTES' 
  | 'MIERCOLES' 
  | 'JUEVES' 
  | 'VIERNES' 
  | 'SABADO';

export type ArticleType = 
  | 'CALZADO' 
  | 'ROPA_MODISTERIA' 
  | 'MARROQUINERIA' 
  | 'OTRO';

export type WorkStation = 
  | 'SOLADOR' 
  | 'COSTURA_CALZADO' 
  | 'MODISTERIA' 
  | 'BANCO_DON_ELIAS';

export type PaymentMethod = 
  | 'EFECTIVO'
  | 'NEQUI'
  | 'DAVIPLATA'
  | 'TRANSFERENCIA'
  | 'TARJETA';

export type UserRole = 'ADMIN' | 'OPERARIO';
export type AppMode = 'DON_ELIAS' | 'SUPERVISION';

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  specialty?: string;
  phone?: string;
  active: boolean;
}

export interface Client {
  id: string;
  fullName: string;
  phone: string;
  notes?: string;
  createdAt: string;
  repairCount?: number;
}

export interface OrderServiceItem {
  serviceId: string;
  name: string;
  price: number; // in COP
  notes?: string;
}

/**
 * An individual item/article inside the customer's physical bag (Ficha).
 * Supports both shoe repairs, clothing alterations, and leather goods.
 */
export interface BagItem {
  id: string;
  articleType: ArticleType;
  description: string; // e.g. "1p Zapatillas Azules Makey" or "Pantalón dril ruedo"
  station: WorkStation; // Solador, Costura, Modistería, Banco Don Elías
  price: number; // Price charged in COP
  cobblerCut: number; // 50% split for artisan in COP
  cobblerPaid: boolean; // Has the 50% been liquidated?
  cobblerPaidDate?: string;
  isCompleted: boolean; // Chuleado when artisan brings it finished
  completedAt?: string;
}

export interface OrderPayment {
  id: string;
  date: string;
  amount: number; // in COP
  paymentMethod: PaymentMethod;
  reference?: string;
  registeredBy: string;
  notes?: string;
}

export interface StatusHistoryEntry {
  id: string;
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  changedAt: string;
  changedBy: string;
  reason?: string;
}

export interface DeliveryDetails {
  deliveredAt: string;
  deliveredBy: string;
  receivedByName?: string;
  adminAuthorizedDebt?: boolean;
  adminAuthorizationReason?: string;
}

export interface RepairOrder {
  id: string; // Unique order code, e.g. "ORD-1808"
  ticketNumber?: number; // Physical consecutive ticket, e.g. 1807, 1808
  bagFichaNumber: string; // Physical metal/tape token on bag, e.g. "13"
  deliveryDayOfWeek: DeliveryDay; // Compartment: LUNES..SABADO
  clientId: string;
  clientName: string;
  clientPhone: string;
  hasWhatsApp?: boolean;
  receivedDate: string; // ISO date string
  estimatedDeliveryDate: string; // ISO date string
  shoeType: ShoeType;
  description: string;
  items: BagItem[]; // Items in this bag with 50/50 split and stations
  services: OrderServiceItem[];
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  lockerLocation: string; // Physical compartment, e.g. "Cajón de JUEVES (Ficha #13)"
  assignedStaffId: string;
  assignedStaffName: string;
  observations?: string;
  photos: string[]; // Base64 data URLs or preview links
  dataPrivacyAuthorized: boolean; // Habeas Data Colombia Ley 1581
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  payments: OrderPayment[];
  deliveryDetails?: DeliveryDetails;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCatalogItem {
  id: string;
  name: string;
  description: string;
  category: 'suelas' | 'costura' | 'lustre' | 'ortopedia' | 'accesorios' | 'ropa' | 'general';
  basePrice: number; // in COP
  estimatedHours: number;
  active: boolean;
}

export interface CashExpense {
  id: string;
  date: string;
  amount: number; // in COP
  category: 'ALMUERZO' | 'MATERIALES' | 'PAGO_ZAPATERO' | 'OTRO';
  description: string;
  registeredBy: string;
}

export interface FinancialSummary {
  receivedCount: number;
  inProcessCount: number;
  readyCount: number;
  deliveredCount: number;
  cancelledCount: number;
  totalOrders: number;
  totalPendingBalance: number; // Total portfolio / balance to collect
  totalRevenueCollected: number; // Total money collected
  todayRevenue: number;
  todayCashCollected: number;
  todayNequiDaviplataCollected: number;
  todayExpenses: number;
  todayCobblerPayouts: number;
  expectedCashInDrawer: number;
}
