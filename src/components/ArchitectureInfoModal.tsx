import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  FileCode2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface ArchitectureInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureInfoModal: React.FC<ArchitectureInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 px-5 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Informe de Arquitectura, Persistencia & Entrega
              </h2>
              <span className="text-[11px] text-stone-400">
                Auditoría técnica transparente del sistema Zapatería El Tío
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-stone-700">
          
          {/* 1. Qué funciona REALMENTE */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Funcionalidades 100% Reales y Operativas</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-5 text-xs text-stone-700 leading-relaxed">
              <li>
                <strong>Recepción completa de calzado:</strong> Generación correlativa de orden (<code className="bg-stone-100 px-1 py-0.5 rounded text-stone-900">ORD-1005</code>), tipo de calzado, selección múltiple de servicios con cálculo matemático automático en COP, abono inicial, casillero físico y operario asignado.
              </li>
              <li>
                <strong>Validación estricta de saldo para entrega:</strong> No permite marcar calzado como <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-900">ENTREGADA</code> si tiene saldo pendiente (&gt; $0), salvo autorización expresa y justificada con rol de <strong>Administrador</strong>.
              </li>
              <li>
                <strong>Cálculo financiero y prevención de doble pago:</strong> Cálculo en vivo de <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-900">Saldo = Total - Abonos</code>, bloqueo de números negativos, validación de topes y protección contra doble clic en abonos.
              </li>
              <li>
                <strong>Flujo de estados coherente:</strong> Validaciones lógicas que impiden saltos incoherentes entre <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-900">RECIBIDA → EN PROCESO → LISTA PARA ENTREGAR → ENTREGADA</code>.
              </li>
              <li>
                <strong>Historial y auditoría:</strong> Cada cambio de estado o pago guarda fecha, hora exacta, operario responsable y motivo.
              </li>
              <li>
                <strong>Directorio y búsqueda de clientes:</strong> Búsqueda en tiempo real por nombre y celular validado (formato Colombia de 10 dígitos iniciando en 3), con historial de órdenes por cliente.
              </li>
              <li>
                <strong>Gestión de tarifas y roles:</strong> Modo de consulta para Operario y modo de edición/creación de tarifas para Administrador.
              </li>
              <li>
                <strong>Captura de fotografías:</strong> Acceso a la cámara del celular o selector de archivos con previsualización inmediata.
              </li>
              <li>
                <strong>Tratamiento de datos personales:</strong> Validación obligatoria de Habeas Data (Ley 1581 de 2012).
              </li>
            </ul>
          </div>

          {/* 2. Qué es DEMOSTRATIVO o requiere integraciones externas */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>2. Funcionalidades Asistidas / Estado de Notificaciones</span>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-2">
              <p className="leading-relaxed">
                <strong>Notificaciones por WhatsApp:</strong> La aplicación genera los enlaces directos oficiales (<code className="bg-white px-1 py-0.5 rounded text-stone-800">https://wa.me/57...</code>) con el mensaje redactado en español listo para enviar desde el WhatsApp del taller o del operario.
              </p>
              <p className="leading-relaxed text-stone-600">
                <strong>Honestidad técnica:</strong> No se finge ni se simula un envío desatendido en segundo plano sin intervención humana. Para que los mensajes de WhatsApp o SMS salgan automáticamente a las 3:00 am o al momento del cambio de estado sin tocar el celular, se requiere contratar y configurar la <strong>API oficial de Meta (WhatsApp Business Cloud API)</strong> o un proveedor SMS como <strong>Twilio / Hablaqui</strong> con credenciales de servidor.
              </p>
            </div>
          </div>

          {/* 3. Cómo se almacenan los datos actualmente */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs">
              <Database className="w-4 h-4 text-blue-600" />
              <span>3. Persistencia de Datos en el Prototipo</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Los datos se conservan de forma permanente en el navegador utilizando <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-900 font-mono">localStorage</code> serializado bajo el patrón Repositorio (<code className="bg-stone-100 px-1 py-0.5 rounded text-stone-900 font-mono">StorageService</code>). Si el usuario recarga la página o cierra la pestaña, toda la información persiste.
            </p>
            <p className="text-xs text-stone-500 italic">
              <strong>Nota de seguridad:</strong> El almacenamiento local del navegador no es una base de datos centralizada compartida entre múltiples celulares. Está diseñado como prototipo desacoplado listo para cambiar el adaptador a llamadas HTTP REST hacia un backend real.
            </p>
          </div>

          {/* 4. Arquitectura recomendada para Producción Segura */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs">
              <Server className="w-4 h-4 text-purple-600" />
              <span>4. Arquitectura para Producción Multidispositivo</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Backend & Base de Datos:</span>
                <p className="text-stone-600">
                  • <strong>Servidor:</strong> Node.js con Express o Fastify en contenedor Docker (Google Cloud Run / AWS ECS).
                  <br />
                  • <strong>Base de datos:</strong> PostgreSQL con Drizzle ORM o Prisma, soportando transacciones ACID para evitar cobros inconsistentes.
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Seguridad & Autenticación:</span>
                <p className="text-stone-600">
                  • Tokens JWT con HTTPS obligatorio y cabeceras CORS restringidas.
                  <br />
                  • Roles RBAC (Administrador y Operario) validados en backend.
                  <br />
                  • Almacenamiento de fotos en Google Cloud Storage o AWS S3 (URLs firmadas).
                </p>
              </div>
            </div>
          </div>

          {/* 5. Requisitos de Hardware y Escalabilidad */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-xs">
              <Cpu className="w-4 h-4 text-stone-800" />
              <span>5. Requisitos de Hardware & Escalabilidad</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1 list-disc pl-5">
              <li><strong>Celulares/Tabletas de mostrador:</strong> Cualquier dispositivo Android (Chrome) o iOS (Safari) con al menos 2 GB de RAM y cámara funcional.</li>
              <li><strong>Servidor de producción:</strong> Mínimo 1 vCPU, 1 GB de RAM (soporta holgadamente más de 50.000 órdenes y cientos de peticiones por minuto con caché HTTP).</li>
              <li><strong>Impresora de tickets:</strong> Impresora térmica estándar de 58mm o 80mm vía Bluetooth o USB compatible con ESC/POS para los comprobantes del calzado.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
