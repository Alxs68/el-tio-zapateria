import { OrderStatus, ShoeType, RepairOrder, DeliveryDay, WorkStation, ArticleType } from '../types';

/**
 * Formats a number to Colombian Pesos (COP).
 * Example: 25000 -> "$ 25.000 COP"
 */
export function formatCOP(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$ 0 COP';
  }
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `${formatted} COP`;
}

/**
 * Compact format for badges or small cards: "$ 25.000"
 */
export function formatCOPSimple(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$ 0';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats an ISO date into Spanish conversational format
 * Example: "27 de oct, 2026"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats date and time
 * Example: "27 oct 2026, 03:45 pm"
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

/**
 * Validates a Colombian phone number (cellular standard: 10 digits starting with 3)
 */
export function validateColombianPhone(phone: string): { isValid: boolean; message?: string } {
  const digits = phone.replace(/\D/g, '');
  if (!digits) {
    return { isValid: false, message: 'El número de teléfono es obligatorio.' };
  }
  if (digits.length !== 10) {
    return { isValid: false, message: 'El celular debe tener 10 dígitos (ej. 310 892 4435).' };
  }
  if (!digits.startsWith('3')) {
    return { isValid: false, message: 'En Colombia los celulares inician con el número 3.' };
  }
  return { isValid: true };
}

/**
 * Cleans phone number to international WhatsApp format for Colombia (+57)
 */
export function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `57${digits}`;
  }
  if (digits.startsWith('57') && digits.length === 12) {
    return digits;
  }
  return digits;
}

export function getShoeTypeLabel(type: ShoeType): string {
  const map: Record<ShoeType, string> = {
    zapatos_formales: 'Zapatos Formales',
    tenis_deportivos: 'Zapatillas / Tenis',
    botas_cuero: 'Botas de Cuero / Dotación',
    tacones: 'Tacones / Dama',
    sandalias: 'Sandalias / Chanclas',
    mocasines: 'Mocasines / Casual',
    botines: 'Botines / Chelsea',
    ropa_prenda: 'Prenda de Ropa / Modistería',
    marroquineria_bolso: 'Bolso / Morral / Marroquinería',
    otro: 'Otro Tipo de Artículo',
  };
  return map[type] || 'Artículo';
}

export function getWorkStationLabel(station: WorkStation): string {
  switch (station) {
    case 'SOLADOR':
      return 'Maestro Solador (Suelas/Tapas)';
    case 'COSTURA_CALZADO':
      return 'Costura Calzado (Costura/Cremalleras)';
    case 'MODISTERIA':
      return 'Modistería (Ropa - Esposa Don Elías)';
    case 'BANCO_DON_ELIAS':
      return 'Banco Don Elías (Lustre/Retoques)';
  }
}

export function getArticleTypeLabel(type: ArticleType): string {
  switch (type) {
    case 'CALZADO':
      return 'Calzado / Zapatos';
    case 'ROPA_MODISTERIA':
      return 'Ropa / Modistería';
    case 'MARROQUINERIA':
      return 'Marroquinería / Bolsos';
    case 'OTRO':
      return 'Otro';
  }
}

export function getDeliveryDayLabel(day: DeliveryDay): string {
  const map: Record<DeliveryDay, string> = {
    LUNES: 'Lunes',
    MARTES: 'Martes',
    MIERCOLES: 'Miércoles',
    JUEVES: 'Jueves',
    VIERNES: 'Viernes',
    SABADO: 'Sábado',
  };
  return map[day] || day;
}

export interface StatusMeta {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  description: string;
  allowedNextStates: OrderStatus[];
}

export function getOrderStatusMeta(status: OrderStatus): StatusMeta {
  switch (status) {
    case 'RECIBIDA':
      return {
        label: 'Recibida',
        badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
        badgeText: 'text-amber-900 dark:text-amber-300',
        borderColor: 'border-amber-300 dark:border-amber-700',
        description: 'Recibido en mostrador con Ficha física. Esperando reparto a oficios.',
        allowedNextStates: ['EN PROCESO', 'CANCELADA'],
      };
    case 'EN PROCESO':
      return {
        label: 'En Proceso',
        badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
        badgeText: 'text-blue-900 dark:text-blue-300',
        borderColor: 'border-blue-300 dark:border-blue-700',
        description: 'En manos del solador, costura o modista. Esperando chuleo de llegada.',
        allowedNextStates: ['LISTA PARA ENTREGAR', 'CANCELADA'],
      };
    case 'LISTA PARA ENTREGAR':
      return {
        label: 'Lista para Entregar',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
        badgeText: 'text-emerald-900 dark:text-emerald-300',
        borderColor: 'border-emerald-300 dark:border-emerald-700',
        description: '100% chuleado en la bolsa física. En el cajón del día listo para retiro.',
        allowedNextStates: ['ENTREGADA', 'EN PROCESO', 'CANCELADA'],
      };
    case 'ENTREGADA':
      return {
        label: 'Entregada',
        badgeBg: 'bg-stone-200 dark:bg-stone-800',
        badgeText: 'text-stone-900 dark:text-stone-200',
        borderColor: 'border-stone-400 dark:border-stone-600',
        description: 'Pedido entregado en mostrador. Saldo cobrado a satisfacción.',
        allowedNextStates: [],
      };
    case 'CANCELADA':
      return {
        label: 'Cancelada',
        badgeBg: 'bg-red-100 dark:bg-red-950/60',
        badgeText: 'text-red-900 dark:text-red-300',
        borderColor: 'border-red-300 dark:border-red-700',
        description: 'Orden anulada o devuelta.',
        allowedNextStates: ['RECIBIDA'],
      };
  }
}

/**
 * Generates WhatsApp notification text and URL based on physical receipt details
 */
export function generateWhatsAppNotification(
  order: RepairOrder,
  notificationType: 'RECEPCION' | 'LISTA' | 'ENTREGA'
): { message: string; url: string } {
  const shopHeader = '👞 CLÍNICA DE CALZADO Y ROPA "EL TIO" 🧵';
  const shopLocation = 'C.C. Santiago Plaza (Cra. 56 con Autop. Simón Bolívar) - Cali\nTel: 317 507 8009';
  const cleanPhone = cleanPhoneForWhatsApp(order.clientPhone);
  
  let message = '';

  const ticketLabel = order.ticketNumber ? `Factura Nº ${order.ticketNumber}` : `Orden ${order.id}`;
  const fichaLabel = order.bagFichaNumber ? `Ficha Física #${order.bagFichaNumber}` : '';
  const dayLabel = order.deliveryDayOfWeek ? getDeliveryDayLabel(order.deliveryDayOfWeek) : 'Próximo';

  if (notificationType === 'RECEPCION') {
    const itemsList = order.items && order.items.length > 0
      ? order.items.map((i, idx) => `  ${idx + 1}. ${i.description} (${formatCOPSimple(i.price)})`).join('\n')
      : `  • ${order.description}`;

    message = `${shopHeader}\n` +
      `NIT: 17.018.382-1 - Régimen Simplificado\n` +
      `${shopLocation}\n\n` +
      `Hola *${order.clientName}*, hemos recibido su pedido:\n\n` +
      `🧾 *${ticketLabel}* | 🏷️ *${fichaLabel}*\n` +
      `📦 *Artículos en la bolsa:*\n${itemsList}\n\n` +
      `📅 *Día de entrega prometido:* ${dayLabel}\n` +
      `💰 *Total:* ${formatCOP(order.totalAmount)}\n` +
      `💵 *Abono:* ${formatCOP(order.paidAmount)}\n` +
      `🔴 *Saldo a pagar:* ${formatCOP(order.balanceAmount)}\n\n` +
      `📍 *Ubicación:* ${order.lockerLocation}\n\n` +
      `_Nota legal: Si el producto no ha sido retirado dentro de los 45 días será considerado abandonado en los términos del Art. 2525 y 2526 del Código Civil Colombiano._\n\n` +
      `¡Le avisaremos cuando su bolsa esté 100% lista!`;
  } else if (notificationType === 'LISTA') {
    message = `${shopHeader}\n` +
      `¡Buenas noticias *${order.clientName}*! 🎉\n\n` +
      `Su trabajo con *${ticketLabel}* (🏷️ *${fichaLabel}*) ya está *100% LISTO PARA RETIRAR*.\n\n` +
      `📦 *Ubicación:* ${order.lockerLocation}\n` +
      `💰 *Saldo a cancelar al recoger:* ${formatCOP(order.balanceAmount)}\n\n` +
      `📍 Lo esperamos en el C.C. Santiago Plaza (Cra. 56 con Autop. Simón Bolívar). Horario: 9:00 AM a 1:00 PM y 3:00 PM a 7:00 PM.\n` +
      `¡Gracias por preferir a Don Elías!`;
  } else {
    message = `${shopHeader}\n` +
      `Hola *${order.clientName}*, confirmamos la entrega satisfactoria de su pedido *${ticketLabel}* (Ficha #${order.bagFichaNumber}). ✅\n\n` +
      `Esperamos que el trabajo artesanal haya sido de su total agrado.\n` +
      `¡Fue un placer servirle y que tenga un excelente día!`;
  }

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;

  return { message, url };
}
