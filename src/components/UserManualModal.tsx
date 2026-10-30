import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  BookOpen, 
  PlusCircle, 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  MessageSquare, 
  Search, 
  ShieldAlert, 
  HelpCircle,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'inicio' | 'recepcion' | 'estados' | 'pagos' | 'whatsapp' | 'caja' | 'preguntas'>('inicio');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 px-5 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-stone-950 font-bold">
              <BookOpen className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Manual de Usuario — Zapatería El Tío
              </h2>
              <span className="text-xs text-amber-400 font-medium">
                Guía sencilla paso a paso para el mostrador y el taller
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition-colors"
              title="Imprimir manual para tenerlo en físico en el taller"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Imprimir Guía</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors ml-1"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 flex items-center gap-1.5 overflow-x-auto scroll-touch shrink-0">
          <button
            onClick={() => setActiveSection('inicio')}
            className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeSection === 'inicio'
                ? 'border-amber-600 text-stone-950 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setActiveSection('recepcion')}
            className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1 ${
              activeSection === 'recepcion'
                ? 'border-amber-600 text-stone-950 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>1. Recibir Zapato</span>
          </button>
          <button
            onClick={() => setActiveSection('estados')}
            className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1 ${
              activeSection === 'estados'
                ? 'border-amber-600 text-stone-950 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>2. Colores y Estados</span>
          </button>
          <button
            onClick={() => setActiveSection('pagos')}
            className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1 ${
              activeSection === 'pagos'
                ? 'border-amber-600 text-stone-950 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>3. Pagos y Entrega</span>
          </button>
          <button
            onClick={() => setActiveSection('whatsapp')}
            className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1 ${
              activeSection === 'whatsapp'
                ? 'border-amber-600 text-stone-950 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>4. WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveSection('caja')}
            className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1 ${
              activeSection === 'caja'
                ? 'border-amber-600 text-stone-950 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>5. Cuadre de Caja</span>
          </button>
          <button
            onClick={() => setActiveSection('preguntas')}
            className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1 ${
              activeSection === 'preguntas'
                ? 'border-amber-600 text-stone-950 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Preguntas Frecuentes</span>
          </button>
        </div>

        {/* Manual Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-stone-800">
          
          {/* TAB 0: Inicio / Resumen */}
          {activeSection === 'inicio' && (
            <div className="space-y-5">
              <div className="bg-amber-50 p-4 sm:p-5 rounded-2xl border border-amber-200">
                <h3 className="text-base sm:text-lg font-bold text-amber-950 mb-1">
                  ¡Bienvenido al sistema de Zapatería El Tío!
                </h3>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                  Esta aplicación fue diseñada para que sea muy fácil y rápida de usar desde su celular, tableta o computador. No necesita ser un experto en computadores: todo está en español, con precios en pesos colombianos y con botones grandes y claros.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-900 flex items-center justify-center font-bold text-sm mb-2">
                    1
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">Todo en un solo lugar</h4>
                  <p className="text-xs text-stone-600">
                    Sabe exactamente qué zapatos están en el taller, en qué casillero guardarlos y cuánto debe cada cliente.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-900 flex items-center justify-center font-bold text-sm mb-2">
                    2
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">Cuentas claras y sin enredos</h4>
                  <p className="text-xs text-stone-600">
                    El sistema calcula automáticamente el total, resta los abonos y no deja entregar zapatos sin pagar (salvo que usted lo autorice).
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-900 flex items-center justify-center font-bold text-sm mb-2">
                    3
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">Avisos por WhatsApp</h4>
                  <p className="text-xs text-stone-600">
                    Con un solo toque le avisa al cliente que sus zapatos ya están listos para que pase a recogerlos y cancelarlos.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-stone-100 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide mb-2">
                  ¿Cómo navegar en la aplicación desde el celular?
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  En la parte de abajo de su pantalla tiene una barra con 5 iconos:
                  <br />
                  • <strong>Tablero:</strong> La pantalla principal con los números del día y las órdenes recientes.
                  <br />
                  • <strong>Órdenes:</strong> La lista completa de todos los zapatos recibidos para buscar por número o nombre.
                  <br />
                  • <strong>Botón redondo naranja (+):</strong> El botón más importante para recibir calzado nuevo.
                  <br />
                  • <strong>Clientes:</strong> Para ver los teléfonos y el historial de cada persona.
                  <br />
                  • <strong>Finanzas:</strong> Para ver cuánto dinero ha entrado en efectivo, Nequi o Daviplata.
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: Recepción de Calzado */}
          {activeSection === 'recepcion' && (
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Paso a Paso</span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  ¿Cómo registrar un zapato que llega al mostrador?
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center font-bold shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <strong className="text-stone-900 block text-xs sm:text-sm">Toque el botón naranja "Nueva Reparación"</strong>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Está en la esquina superior derecha o en el botón grande del centro abajo en el celular. Se abrirá el formulario de ingreso.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center font-bold shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <strong className="text-stone-900 block text-xs sm:text-sm">Seleccione el cliente o regístrelo</strong>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Si el cliente ya ha venido antes, elíjalo de la lista. Si es nuevo, toque <strong>"+ Registrar nuevo cliente"</strong> y escriba su nombre y su número de celular (10 dígitos).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center font-bold shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <strong className="text-stone-900 block text-xs sm:text-sm">Indique el tipo de calzado y el trabajo</strong>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Elija si son zapatos formales, tenis, botas, tacones, etc. En la descripción escriba brevemente lo que pide el cliente (ej. <em>"Cambio de tapas y lustre café"</em>).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center font-bold shrink-0 text-xs">
                    4
                  </div>
                  <div>
                    <strong className="text-stone-900 block text-xs sm:text-sm">Agregue los servicios y el abono inicial</strong>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Seleccione los servicios del catálogo. Si el precio acordado con el cliente es diferente, puede cambiar el valor directamente. El sistema suma todo automáticamente. Luego anote si dejó abono (en efectivo, Nequi, etc.) o si lo pagará completo al retirar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center font-bold shrink-0 text-xs">
                    5
                  </div>
                  <div>
                    <strong className="text-stone-900 block text-xs sm:text-sm">Asigne el Casillero físico y Guarde</strong>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Seleccione en qué estante o casilla colocará los zapatos (ej. <em>Casillero A-04</em>). Puede tomarle una foto al zapato con el celular si lo desea. Al tocar <strong>"Guardar Orden"</strong>, se creará el número único (ej. ORD-1005) y podrá imprimir el comprobante.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Colores y Estados */}
          {activeSection === 'estados' && (
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Control del Taller</span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  Los 4 Estados del Zapato y qué significan sus colores
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 flex items-start gap-3">
                  <span className="px-2.5 py-1 bg-amber-200 text-amber-950 font-bold rounded-md text-xs shrink-0">
                    RECIBIDA (Amarillo)
                  </span>
                  <div>
                    <strong className="text-stone-900 text-xs sm:text-sm block">El zapato acaba de ingresar al taller</strong>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Está guardado en el casillero esperando que el maestro zapatero comience las labores.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-300 flex items-start gap-3">
                  <span className="px-2.5 py-1 bg-blue-200 text-blue-950 font-bold rounded-md text-xs shrink-0">
                    EN PROCESO (Azul)
                  </span>
                  <div>
                    <strong className="text-stone-900 text-xs sm:text-sm block">El zapato está en el banco de trabajo</strong>
                    <p className="text-xs text-stone-600 mt-0.5">
                      El maestro zapatero o el operario ya está cosiendo, pegando o lustrando el calzado.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 flex items-start gap-3">
                  <span className="px-2.5 py-1 bg-emerald-200 text-emerald-950 font-bold rounded-md text-xs shrink-0">
                    LISTA PARA ENTREGAR (Verde)
                  </span>
                  <div>
                    <strong className="text-stone-900 text-xs sm:text-sm block">¡Trabajo terminado y verificado!</strong>
                    <p className="text-xs text-stone-600 mt-0.5">
                      El zapato está listo, limpio y empacado en el casillero o mostrador. Aquí es el momento ideal para tocar la pestaña <strong>"Notificar (WhatsApp)"</strong> y avisarle al cliente que ya puede venir.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-stone-100 rounded-xl border border-stone-300 flex items-start gap-3">
                  <span className="px-2.5 py-1 bg-stone-800 text-white font-bold rounded-md text-xs shrink-0">
                    ENTREGADA (Gris Oscuro)
                  </span>
                  <div>
                    <strong className="text-stone-900 text-xs sm:text-sm block">El cliente vino, pagó y se llevó su calzado</strong>
                    <p className="text-xs text-stone-600 mt-0.5">
                      La orden queda cerrada con fecha, hora y el nombre de quien entregó.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
                <strong>💡 Consejo útil:</strong> Para cambiar de estado, solo abra la orden tocando sobre ella y presione el botón del nuevo estado (por ejemplo, pase de <em>En Proceso</em> a <em>Lista para Entrega</em> cuando termine de pulir).
              </div>
            </div>
          )}

          {/* TAB 3: Pagos y Entrega */}
          {activeSection === 'pagos' && (
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Seguridad del Negocio</span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  ¿Cómo cobrar los saldos y entregar el calzado?
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>1. Cuando el cliente viene a pagar o abonar:</span>
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    1. Abra la orden del cliente tocando sobre ella.
                    <br />
                    2. Toque la pestaña <strong>"Abonos & Pagos"</strong>.
                    <br />
                    3. El sistema ya le muestra exactamente cuánto debe en color rojo.
                    <br />
                    4. Escriba el valor que le entregó el cliente, elija si pagó en <strong>Efectivo, Nequi o Daviplata</strong>, y presione <strong>"Confirmar Pago"</strong>.
                    <br />
                    5. El saldo se actualizará al instante y quedará registrado quién recibió el dinero.
                  </p>
                </div>

                <div className="p-4 bg-red-50/70 rounded-xl border border-red-200 space-y-2">
                  <h4 className="font-bold text-red-950 text-sm flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>2. Regla de Oro: ¿Se puede entregar con deuda?</span>
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Por seguridad, <strong>la aplicación no permite a los operarios marcar un zapato como "Entregado" si tiene saldo pendiente</strong>.
                  </p>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    <strong>¿Qué pasa si es un cliente de confianza y Don Tío le fía?:</strong>
                    <br />
                    Solamente un <strong>Administrador (Don Tío)</strong> puede autorizar la entrega con deuda pendiente. El sistema le pedirá escribir un motivo breve (ej. <em>"Cliente conocido, transfiere por Nequi en la tarde"</em>) para que nada se pierda ni se olvide.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WhatsApp */}
          {activeSection === 'whatsapp' && (
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Comunicación Fácil</span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  ¿Cómo avisarle al cliente por WhatsApp con un solo toque?
                </h3>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <p className="text-xs text-emerald-950 leading-relaxed">
                  Ya no tiene que ponerse a escribir en su celular mensajes largos como <em>"Hola don Pedro, sus zapatos ya están listos, el saldo es de tanto..."</em>.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2 text-xs text-stone-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                    <span>Abra la orden del cliente.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-stone-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                    <span>Toque la pestaña con el icono verde <strong>"Notificar (WhatsApp)"</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-stone-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                    <span>Elija el mensaje deseado (por ejemplo, <em>"Reparación Lista para Retiro"</em>) y presione el botón verde <strong>"Enviar por WhatsApp"</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-stone-700">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                    <span>Se abrirá el WhatsApp del cliente con todo el texto ya escrito con el nombre, número de orden y valor a pagar. Solo presione enviar.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Cuadre de Caja */}
          {activeSection === 'caja' && (
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Cierre del Día</span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  ¿Cómo ver cuánto dinero entró y hacer el cuadre de caja?
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Para saber cuánto dinero se recaudó hoy al cerrar la zapatería, vaya a la sección <strong>"Finanzas & Reportes"</strong> (en el menú superior o en la pestaña "Finanzas" de la barra de abajo).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Ingresos de Hoy</span>
                    <p className="text-xs text-stone-600 mt-1">
                      Le muestra en verde el total exacto que ingresó en el día por abonos y cancelaciones.
                    </p>
                  </div>
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-800 uppercase block">Desglose por Métodos</span>
                    <p className="text-xs text-stone-600 mt-1">
                      Le separa cuánto fue en billetes de <strong>Efectivo</strong>, cuánto por <strong>Nequi</strong>, cuánto por <strong>Daviplata</strong> y cuánto por <strong>Transferencia</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-700">
                  <strong>Copia de Seguridad:</strong> Si desea guardar un archivo de respaldo de todas sus reparaciones y clientes en su computador, solo toque el botón <strong>"Exportar Copia JSON"</strong> en la pantalla de Finanzas.
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Preguntas Frecuentes */}
          {activeSection === 'preguntas' && (
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Ayuda Rápida</span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  Preguntas Frecuentes del Mostrador
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">¿Qué hago si cierro la aplicación o apago el celular?</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    No se preocupe: todos los clientes, zapatos, abonos y fotos quedan guardados automáticamente. Al volver a abrir la página, todo estará tal cual lo dejó.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">¿Cómo encuentro rápido un zapato si el cliente llega con el ticket?</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Toque el botón con la lupa <strong>"Buscar"</strong> en la parte de arriba y escriba el número (ejemplo: <em>1002</em>) o el nombre del cliente. El sistema le mostrará de inmediato la orden y en qué casillero está guardado el zapato.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">¿Puedo cambiar las tarifas de los servicios?</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Sí. Si tiene activo el rol de <strong>Administrador (Don Tío)</strong>, vaya a la pestaña <strong>"Tarifas y Servicios"</strong> donde puede subir o bajar los precios del catálogo y agregar nuevos servicios.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-stone-600 text-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Zapatería El Tío · Medellín, Colombia</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Cerrar Manual
          </button>
        </div>

      </div>
    </div>
  );
};
