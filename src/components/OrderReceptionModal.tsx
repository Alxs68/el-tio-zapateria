import React, { useState, useEffect } from 'react';
import { 
  Client, 
  ServiceCatalogItem, 
  StaffMember, 
  ShoeType, 
  PaymentMethod, 
  RepairOrder,
  BagItem,
  DeliveryDay,
  WorkStation,
  ArticleType
} from '../types';
import { 
  formatCOP, 
  formatCOPSimple, 
  validateColombianPhone, 
  getDeliveryDayLabel,
  getWorkStationLabel 
} from '../utils/formatters';
import { 
  X, 
  Plus, 
  Trash2, 
  Camera, 
  ShieldCheck, 
  Calculator, 
  Check, 
  UserPlus,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  Scissors,
  Wrench,
  Shirt
} from 'lucide-react';

interface OrderReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextTicketNumber: number;
  clients: Client[];
  services: ServiceCatalogItem[];
  staffList: StaffMember[];
  activeUser: StaffMember;
  onSaveOrder: (newOrder: Omit<RepairOrder, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => void;
  onQuickCreateClient: (client: Omit<Client, 'id' | 'createdAt' | 'repairCount'>) => Client;
}

export const OrderReceptionModal: React.FC<OrderReceptionModalProps> = ({
  isOpen,
  onClose,
  nextTicketNumber,
  clients,
  services,
  staffList,
  activeUser,
  onSaveOrder,
  onQuickCreateClient,
}) => {
  // Client info
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [hasWhatsApp, setHasWhatsApp] = useState(true);

  // Workshop Physical Bag Tokens
  const [bagFichaNumber, setBagFichaNumber] = useState('');
  const [deliveryDay, setDeliveryDay] = useState<DeliveryDay>('JUEVES');

  // Items inside this bag
  const [items, setItems] = useState<Array<{
    id: string;
    articleType: ArticleType;
    description: string;
    station: WorkStation;
    price: number;
  }>>([
    {
      id: `itm-${Date.now()}-1`,
      articleType: 'CALZADO',
      description: '1p Zapatillas Azules Makey',
      station: 'SOLADOR',
      price: 23000,
    },
  ]);

  // Payment
  const [depositAmount, setDepositAmount] = useState<number>(23000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EFECTIVO');
  const [paymentReference, setPaymentReference] = useState('');

  const [observations, setObservations] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-lookup client as soon as 10 digits are entered
  useEffect(() => {
    const clean = clientPhone.replace(/\D/g, '');
    if (clean.length === 10) {
      const match = clients.find((c) => c.phone.replace(/\D/g, '').includes(clean));
      if (match) {
        setClientName(match.fullName);
      }
    }
  }, [clientPhone, clients]);

  if (!isOpen) return null;

  // Calculations
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const balanceAmount = Math.max(0, totalAmount - (depositAmount || 0));
  const suggestedDeposit = Math.round(totalAmount * 0.5);

  const days: { id: DeliveryDay; label: string }[] = [
    { id: 'LUNES', label: 'Lunes' },
    { id: 'MARTES', label: 'Martes' },
    { id: 'MIERCOLES', label: 'Miércoles' },
    { id: 'JUEVES', label: 'Jueves' },
    { id: 'VIERNES', label: 'Viernes' },
    { id: 'SABADO', label: 'Sábado' },
  ];

  const handleAddItem = (articleType: ArticleType = 'CALZADO') => {
    const defaultStation: WorkStation = articleType === 'ROPA_MODISTERIA' ? 'MODISTERIA' : 'SOLADOR';
    const defaultDesc = articleType === 'ROPA_MODISTERIA' 
      ? '1 Prenda modistería (ruedo / cremallera)' 
      : '1 Par de calzado para reparación';
    const defaultPrice = articleType === 'ROPA_MODISTERIA' ? 15000 : 20000;

    setItems([
      ...items,
      {
        id: `itm-${Date.now()}-${items.length + 1}`,
        articleType,
        description: defaultDesc,
        station: defaultStation,
        price: defaultPrice,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Validate Phone
    const phoneVal = validateColombianPhone(clientPhone);
    if (!phoneVal.isValid) {
      setErrorMessage(phoneVal.message || 'Número de celular inválido.');
      return;
    }

    // 2. Validate Client Name
    if (!clientName.trim()) {
      setErrorMessage('Por favor ingrese el nombre del cliente.');
      return;
    }

    // 3. Validate Bag Ficha
    if (!bagFichaNumber.trim()) {
      setErrorMessage('Por favor escriba el número de la Ficha física amarrada a la bolsa (ej. 13).');
      return;
    }

    // 4. Validate Items
    if (items.length === 0 || totalAmount <= 0) {
      setErrorMessage('Debe agregar al menos una prenda o par de zapatos con su valor a reparar.');
      return;
    }

    // Save or update client in database
    const savedClient = onQuickCreateClient({
      fullName: clientName.trim(),
      phone: clientPhone.replace(/\D/g, ''),
      notes: `Cliente registrado en Factura #${nextTicketNumber} (Ficha #${bagFichaNumber})`,
    });

    // Prepare BagItems with 50/50 split
    const bagItems: BagItem[] = items.map((item) => ({
      id: item.id,
      articleType: item.articleType,
      description: item.description,
      station: item.station,
      price: item.price,
      cobblerCut: Math.round(item.price * 0.5), // 50% split for cobbler
      cobblerPaid: false,
      isCompleted: false,
    }));

    // Prepare initial payment if any
    const payments = depositAmount > 0 ? [
      {
        id: `pay-${Date.now()}`,
        date: new Date().toISOString(),
        amount: depositAmount,
        paymentMethod,
        reference: paymentReference || `Abono factura #${nextTicketNumber}`,
        registeredBy: activeUser.name,
        notes: `Abono inicial en mostrador al recibir la orden`,
      },
    ] : [];

    // Calculate delivery date estimated
    const now = new Date();
    const estDate = new Date();
    estDate.setDate(now.getDate() + 3);

    const fullDescription = items.map((i) => i.description).join(' + ');

    onSaveOrder({
      ticketNumber: nextTicketNumber,
      bagFichaNumber: bagFichaNumber.trim(),
      deliveryDayOfWeek: deliveryDay,
      clientId: savedClient.id,
      clientName: savedClient.fullName,
      clientPhone: savedClient.phone,
      hasWhatsApp,
      receivedDate: now.toISOString(),
      estimatedDeliveryDate: estDate.toISOString(),
      shoeType: items.some(i => i.articleType === 'CALZADO') ? 'tenis_deportivos' : 'ropa_prenda',
      description: fullDescription,
      items: bagItems,
      services: items.map((item) => ({
        serviceId: 'srv-generic',
        name: item.description,
        price: item.price,
      })),
      totalAmount,
      paidAmount: depositAmount || 0,
      balanceAmount,
      lockerLocation: `Cajón de ${getDeliveryDayLabel(deliveryDay)} (Ficha #${bagFichaNumber.trim()})`,
      assignedStaffId: activeUser.id,
      assignedStaffName: activeUser.name,
      observations,
      photos: [],
      dataPrivacyAuthorized: true,
      status: 'RECIBIDA',
      payments,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-2xl w-full my-4 overflow-hidden flex flex-col">
        
        {/* Physical Receipt Style Header */}
        <div className="bg-sky-700 text-white p-5 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="text-[11px] font-bold text-sky-200 uppercase tracking-widest">
                NIT. 17.018.382-1 · Régimen Simplificado
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>CLÍNICA DE CALZADO Y ROPA "EL TIO"</span>
              </h2>
              <p className="text-xs text-sky-100 font-medium mt-0.5">
                C.C. Santiago Plaza (Cra. 56 con Autop. Simón Bolívar) · Cel. 317 507 8009 - Cali
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs text-sky-200 font-bold uppercase">Factura de Venta</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums">
                Nº {nextTicketNumber}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Phone & Name */}
          <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="text-xs font-black uppercase text-stone-500 tracking-wider">
              1. Datos del Cliente (Búsqueda por Celular)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Celular del Cliente (10 dígitos) *
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Ej. 3108924435"
                  className="w-full px-3.5 py-3 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 rounded-xl text-lg font-black text-stone-900 dark:text-white focus:outline-none focus:border-sky-600 tabular-nums"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Señor(a) / Nombre Completo *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Yanira González"
                  className="w-full px-3.5 py-3 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 rounded-xl text-base font-bold text-stone-900 dark:text-white focus:outline-none focus:border-sky-600"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="wa-check"
                checked={hasWhatsApp}
                onChange={(e) => setHasWhatsApp(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
              <label htmlFor="wa-check" className="text-xs font-semibold text-stone-600 dark:text-stone-300 cursor-pointer">
                El cliente tiene WhatsApp (se le enviará comprobante y aviso de retiro)
              </label>
            </div>
          </div>

          {/* Section 2: Physical Bag Token & Delivery Day */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 space-y-4">
            <div className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 tracking-wider">
              2. Ficha Física de la Bolsa y Día de Entrega
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Big Ficha Input */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-amber-950 dark:text-amber-200 mb-1">
                  Nº Ficha Física (En cinta/bolsa) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-amber-600 text-xl">
                    #
                  </span>
                  <input
                    type="text"
                    value={bagFichaNumber}
                    onChange={(e) => setBagFichaNumber(e.target.value)}
                    placeholder="13"
                    className="w-full pl-8 pr-3 py-3 bg-white dark:bg-stone-800 border-2 border-amber-400 dark:border-amber-600 rounded-xl text-2xl font-black text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 tabular-nums"
                    required
                  />
                </div>
              </div>

              {/* Delivery Day Buttons */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-amber-950 dark:text-amber-200 mb-1.5">
                  Promesa Día de Entrega (Compartimiento) *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {days.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDeliveryDay(d.id)}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                        deliveryDay === d.id
                          ? 'bg-amber-600 text-stone-950 shadow-md ring-2 ring-amber-400 scale-105'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-amber-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Articles in this Bag (Shoes & Clothing) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-stone-500 tracking-wider block">
                  3. Prendas y Calzado en esta Bolsa
                </span>
                <span className="text-xs text-stone-500">
                  Todo va en la misma bolsa bajo la Ficha #{bagFichaNumber || '...'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddItem('CALZADO')}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Calzado
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('ROPA_MODISTERIA')}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-sky-300 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Ropa
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      Artículo #{index + 1} ({item.articleType === 'ROPA_MODISTERIA' ? '🧵 Ropa' : '👞 Calzado'})
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Quitar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* Description */}
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                        placeholder="Ej. 1p Zapatillas Azules Makey, Ruedo pantalón..."
                        className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-sm font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-sky-600"
                        required
                      />
                    </div>

                    {/* Destination Station */}
                    <div className="sm:col-span-3">
                      <select
                        value={item.station}
                        onChange={(e) => handleUpdateItem(index, 'station', e.target.value as WorkStation)}
                        className="w-full px-2 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-xs font-bold text-stone-800 dark:text-stone-200 focus:outline-none"
                      >
                        <option value="SOLADOR">Solador (Suelas/Tapas)</option>
                        <option value="COSTURA_CALZADO">Costura Calzado</option>
                        <option value="MODISTERIA">Modistería (Esposa Don Elías)</option>
                        <option value="BANCO_DON_ELIAS">Banco Don Elías</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                          $
                        </span>
                        <input
                          type="number"
                          min="1000"
                          step="500"
                          value={item.price || ''}
                          onChange={(e) => handleUpdateItem(index, 'price', Number(e.target.value))}
                          placeholder="23000"
                          className="w-full pl-6 pr-2 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-sm font-black text-stone-900 dark:text-white focus:outline-none focus:border-sky-600 tabular-nums"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block text-right mt-0.5">
                        50% artesano: {formatCOPSimple(item.price * 0.5)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Flexible Deposit and Payment */}
          <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <div>
                <span className="text-xs text-stone-400 uppercase tracking-wider block font-bold">
                  Valor Total del Trabajo
                </span>
                <span className="text-3xl font-black text-white tabular-nums">
                  {formatCOP(totalAmount)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-400 uppercase tracking-wider block font-bold">
                  Saldo Restante al Recoger
                </span>
                <span className={`text-2xl font-black tabular-nums ${balanceAmount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {balanceAmount > 0 ? formatCOP(balanceAmount) : '¡Paz y Salvo!'}
                </span>
              </div>
            </div>

            {/* Abono Field & Flexible Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-300">
                  ¿Cuánto deja abonado el cliente hoy? (No es camisa de fuerza)
                </label>
                <span className="text-xs text-amber-300 font-medium">
                  Sugerido 50%: {formatCOPSimple(suggestedDeposit)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-stone-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={depositAmount || ''}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-3 bg-stone-800 border-2 border-stone-700 focus:border-amber-400 rounded-xl text-xl font-black text-amber-400 tabular-nums focus:outline-none"
                    placeholder="Ej. 30000"
                  />
                </div>

                {/* Quick Selection Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositAmount(suggestedDeposit)}
                    className="flex-1 py-2.5 px-2 bg-stone-800 hover:bg-stone-700 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl transition-colors"
                  >
                    50% ({formatCOPSimple(suggestedDeposit)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositAmount(totalAmount)}
                    className="flex-1 py-2.5 px-2 bg-stone-800 hover:bg-stone-700 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl transition-colors"
                  >
                    Total (100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositAmount(0)}
                    className="py-2.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-400 text-xs font-bold rounded-xl transition-colors"
                  >
                    $0
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {depositAmount > 0 && (
              <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-400 mr-2">Medio de Pago:</span>
                {(['EFECTIVO', 'NEQUI', 'DAVIPLATA', 'TRANSFERENCIA'] as PaymentMethod[]).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                      paymentMethod === pm
                        ? 'bg-amber-500 text-stone-950 font-black'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Legal Note from Physical Receipt */}
          <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-[11px] text-stone-600 dark:text-stone-400 leading-tight">
            <strong>Nota legal:</strong> Si el producto no ha sido retirado dentro de los 45 días será considerado abandonado en los términos del Art. 2525 y 2526 del Código Civil Colombiano.
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-7 py-3 bg-sky-700 hover:bg-sky-600 active:bg-sky-800 text-white font-black text-base rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>Guardar Factura #{nextTicketNumber} (Ficha #{bagFichaNumber || '...'})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
