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
 * Calculates days elapsed since order was ready or received
 */
export function getDaysSinceReadyOrReceived(order: RepairOrder): number {
  const readyHistory = order.statusHistory.find((h) => h.toStatus === 'LISTA PARA ENTREGAR');
  const baseDateStr = readyHistory ? readyHistory.changedAt : order.receivedDate;
  if (!baseDateStr) return 0;
  
  const baseDate = new Date(baseDateStr).getTime();
  const now = new Date().getTime();
  const diffDays = Math.floor((now - baseDate) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export interface AbandonmentAlertStatus {
  days: number;
  level: 'NORMAL' | 'AVISO_30D' | 'RIESGO_60D' | 'ABANDONO_LEGAL_90D';
  badgeLabel: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export function getAbandonmentStatus(order: RepairOrder): AbandonmentAlertStatus | null {
  if (order.status === 'ENTREGADA' || order.status === 'CANCELADA') {
    return null;
  }

  const days = getDaysSinceReadyOrReceived(order);

  if (days >= 90) {
    return {
      days,
      level: 'ABANDONO_LEGAL_90D',
      badgeLabel: `⚠️ ${days} días: Abandono Legal Cumplido`,
      badgeBg: 'bg-rose-100 dark:bg-rose-950/80',
      badgeText: 'text-rose-900 dark:text-rose-200',
      description: 'Superó los 90 días legales (Decreto 1413 de 2018). El taller tiene facultad legal de disposición.',
    };
  }

  if (days >= 60) {
    return {
      days,
      level: 'RIESGO_60D',
      badgeLabel: `🚨 ${days} días: Aviso Legal Requerido`,
      badgeBg: 'bg-orange-100 dark:bg-orange-950/80',
      badgeText: 'text-orange-900 dark:text-orange-200',
      description: 'Lleva más de 60 días sin retirar. Enviar notificación de advertencia legal de abandono.',
    };
  }

  if (days >= 30) {
    return {
      days,
      level: 'AVISO_30D',
      badgeLabel: `⏳ ${days} días sin retirar`,
      badgeBg: 'bg-amber-100 dark:bg-amber-950/80',
      badgeText: 'text-amber-900 dark:text-amber-200',
      description: 'Cumplió más de 30 días terminado en taller. Enviar recordatorio amigable al cliente.',
    };
  }

  return {
    days,
    level: 'NORMAL',
    badgeLabel: `${days} días`,
    badgeBg: 'bg-stone-100 dark:bg-stone-800',
    badgeText: 'text-stone-700 dark:text-stone-300',
    description: 'Dentro del plazo normal de entrega.',
  };
}

/**
 * Generates WhatsApp notification text and URL based on physical receipt details
 */
export function generateWhatsAppNotification(
  order: RepairOrder,
  notificationType: 'RECEPCION' | 'LISTA' | 'RECORDATORIO_30D' | 'AVISO_LEGAL_60D' | 'ENTREGA'
): { message: string; url: string; previewSummary: string } {
  const shopHeader = '👞 CLÍNICA DE CALZADO Y ROPA "EL TIO" 🧵';
  const shopLocation = 'C.C. Santiago Plaza (Cra. 56 con Autop. Simón Bolívar) - Cali\nTel: 317 507 8009';
  const cleanPhone = cleanPhoneForWhatsApp(order.clientPhone);
  
  let message = '';
  let previewSummary = '';

  const ticketLabel = order.ticketNumber ? `Factura Nº ${order.ticketNumber}` : `Orden ${order.id}`;
  const fichaLabel = order.bagFichaNumber ? `Ficha Física #${order.bagFichaNumber}` : '';
  const dayLabel = order.deliveryDayOfWeek ? getDeliveryDayLabel(order.deliveryDayOfWeek) : 'Próximo';

  if (notificationType === 'RECEPCION') {
    previewSummary = `Ingreso: Factura #${order.ticketNumber || order.id} (Ficha #${order.bagFichaNumber})`;
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
      `_Aviso comercial: Por favor retirar sus prendas en un plazo máximo de 30 días tras ser avisado. Cumplidos 60 días sin retiro, el taller dispondrá de las prendas para cubrir costos de mano de obra y bodegaje según el Art. 18 de la Ley 1480 y Decreto 1413 de 2018._\n\n` +
      `¡Le avisaremos cuando su bolsa esté 100% lista!`;
  } else if (notificationType === 'LISTA') {
    previewSummary = `Aviso calzado listo: Factura #${order.ticketNumber || order.id} (Ficha #${order.bagFichaNumber})`;
    message = `${shopHeader}\n` +
      `¡Buenas noticias *${order.clientName}*! 🎉\n\n` +
      `Su trabajo con *${ticketLabel}* (🏷️ *${fichaLabel}*) ya está *100% LISTO PARA RETIRAR*.\n\n` +
      `📦 *Ubicación:* ${order.lockerLocation}\n` +
      `💰 *Saldo a cancelar al recoger:* ${formatCOP(order.balanceAmount)}\n\n` +
      `📍 Lo esperamos en el C.C. Santiago Plaza (Cra. 56 con Autop. Simón Bolívar, Local 188). Horario: 9:00 AM a 1:00 PM y 3:00 PM a 7:00 PM.\n` +
      `¡Gracias por preferir a Don Elías!`;
  } else if (notificationType === 'RECORDATORIO_30D') {
    previewSummary = `Recordatorio 30 días sin retiro: Factura #${order.ticketNumber || order.id}`;
    message = `${shopHeader}\n` +
      `Estimado(a) *${order.clientName}*, le saludamos de la Clínica de Calzado El Tío.\n\n` +
      `Le recordamos cordialmente que su trabajo con *${ticketLabel}* (🏷️ *${fichaLabel}*) lleva más de *30 días terminado* en nuestro taller esperando su retiro.\n\n` +
      `💰 *Saldo pendiente:* ${formatCOP(order.balanceAmount)}\n` +
      `📍 *Ubicación:* Local 188 - C.C. Santiago Plaza, Cali.\n\n` +
      `Le solicitamos por favor pasar a recogerlo en el transcurso de esta semana para evitar costos de custodia o congestión en bodega.\n\n` +
      `¡Muchas gracias por su atención y colaboración!`;
  } else if (notificationType === 'AVISO_LEGAL_60D') {
    previewSummary = `Aviso legal 60 días abandono: Factura #${order.ticketNumber || order.id}`;
    message = `${shopHeader}\n` +
      `⚠️ *NOTIFICACIÓN DE PRENDA NO RECLAMADA - CUSTODIA FINAL*\n\n` +
      `Señor(a) *${order.clientName}*,\n` +
      `Nos comunicamos respecto a su orden *${ticketLabel}* (🏷️ *${fichaLabel}*), la cual se encuentra terminada en nuestro taller desde hace más de 60 días sin haber sido reclamada.\n\n` +
      `💰 Saldo insoluto: ${formatCOP(order.balanceAmount)}\n\n` +
      `De conformidad con el *Artículo 18 de la Ley 1480 de 2011 (Estatuto del Consumidor) y el Decreto 1413 de 2018*, le concedemos un plazo improrrogable para presentarse en el Local 188 (C.C. Santiago Plaza) antes de cumplir los 90 días calendario.\n\n` +
      `Vencido dicho plazo legal, el taller se verá facultado para declarar la mercancía en estado de abandono y disponer de la misma para cubrir los costos de reparación causados, extinguiéndose la responsabilidad de custodia.\n\n` +
      `Atentamente,\n` +
      `Don Elías Oliveros - Clínica de Calzado y Ropa El Tío\n` +
      `Tel: 317 507 8009`;
  } else {
    previewSummary = `Confirmación de entrega: Factura #${order.ticketNumber || order.id}`;
    message = `${shopHeader}\n` +
      `Hola *${order.clientName}*, confirmamos la entrega satisfactoria de su pedido *${ticketLabel}* (Ficha #${order.bagFichaNumber}). ✅\n\n` +
      `Esperamos que el trabajo artesanal haya sido de su total agrado.\n` +
      `¡Fue un placer servirle y que tenga un excelente día!`;
  }

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;

  return { message, url, previewSummary };
}
