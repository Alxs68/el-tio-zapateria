# ESPECIFICACIÓN DE REQUERIMIENTOS DE SOFTWARE (ERS)
## Módulo de Blindaje Jurídico, Firma Digital Táctil y Gestión de Abandono de Mercancía
**Proyecto:** Sistema de Gestión Taller "Clínica de Calzado y Ropa El Tío"  
**Versión:** 1.0.0  
**Fecha:** Octubre 2026  
**Marco Normativo Aplicable:** Ley 1480 de 2011 (Estatuto del Consumidor, Art. 18), Decreto 1413 de 2018 (Reglamentación de bienes muebles no reclamados) y Ley 527 de 1999 (Comercio Electrónico y Firmas Digitales/Electrónicas).

---

## 1. MARCO LEGAL Y REGLAS DE NEGOCIO (COLOMBIA)

### 1.1 Contexto Jurídico
El artículo 18 de la Ley 1480 de 2011, reglamentado por el **Decreto 1413 de 2018**, establece el procedimiento legal mediante el cual un prestador de servicios de reparación, mantenimiento o confección puede disponer legalmente de los bienes muebles que los clientes dejan abandonados:
1. **Paso 1 (Plazo de retiro ordinario):** Concluido el servicio o vencida la fecha pactada de entrega, el consumidor tiene **un (1) mes** para reclamar el bien.
2. **Paso 2 (Requerimiento formal):** Transcurrido dicho mes sin retiro, el prestador del servicio debe **requerir formalmente al consumidor** por un canal idóneo comprobable (en este sistema, WhatsApp pactado expresamente mediante firma electrónica).
3. **Paso 3 (Período de gracia legal):** A partir de la fecha del requerimiento formal, el consumidor cuenta con **dos (2) meses adicionales** para retirar el bien y cancelar el saldo adeudado más los gastos de bodegaje o custodia pactados.
4. **Paso 4 (Declaratoria de Abandono):** Si transcurren los dos (2) meses posteriores al requerimiento (90 días calendario acumulados) sin que el bien sea reclamado, **la ley entiende que el bien ha sido abandonado**, facultando al taller a disponer de él, donarlo o rematarlo para cubrir costos de mano de obra y almacenamiento, extinguiendo la responsabilidad civil frente a reclamos ordinarios.

---

## 2. MODELO DE DATOS Y CAPTURA DE INFORMACIÓN (INGRESOS)

### 2.1 Esquema de Entidades (TypeScript / Relacional)

```typescript
// Entidad extendida de la Orden de Servicio
export interface LegalOrderRecord {
  // Identificadores y Metadatos
  id: string;                          // UUID v4
  ticketNumber: number;                // Consecutivo fiscal (ej. 1807)
  bagFichaNumber: number;              // Número físico de ficha/bolsa (ej. 13)
  createdAt: string;                   // ISO 8601 Timestamp de recepción
  promisedDeliveryDate: string;        // YYYY-MM-DD (Obligatorio)
  
  // Cliente (Canal Oficial de Notificación)
  customer: {
    fullName: string;                  // Mínimo 3 caracteres
    phone: string;                     // 10 dígitos (ej. 3108924435)
    normalizedPhoneE164: string;       // +573108924435 (Obligatorio para WhatsApp API)
    documentId?: string;               // Cédula de Ciudadanía opcional
  };

  // Detalle del Calzado / Prenda
  items: Array<{
    id: string;
    tradeType: 'CALZADO' | 'COSTURA';
    description: string;               // Detalle del calzado (marca, color, tipo de daño)
    serviceType: string;               // ej. 'Soladura completa', 'Cambio de tapas'
    serviceCostCOP: number;            // Precio en COP
    cobblerCutPercentage: number;      // ej. 50%
  }>;

  // Aspectos Financieros
  financials: {
    totalServiceCostCOP: number;       // Suma de servicios
    downPaymentCOP: number;            // Abono inicial
    pendingBalanceCOP: number;         // Saldo pendiente por pagar
    dailyStorageFeeCOP: number;        // Tarifa diaria de bodegaje pactada (ej. $1.000 COP/día)
    accumulatedStorageFeeCOP: number;  // Calculado dinámicamente si entra en mora
  };

  // Blindaje Jurídico y Firma Táctil
  legalConsent: {
    signedAt: string;                  // ISO 8601 Timestamp exacto de la firma
    signatureBase64: string;           // Data URI 'data:image/png;base64,...'
    signerDeviceUserAgent: string;     // Captura de navegador/dispositivo
    signerIpAddress?: string;          // IP del dispositivo en el momento de la firma
    acceptedTermsVersion: string;      // ej. 'DEC-1413-2018-V1'
    legalClauseText: string;           // Texto legal estricto congelado en el registro
  };

  // Máquina de Estados del Ciclo de Vida Legal
  legalLifecycle: {
    currentState: LegalAbandonmentState;
    readyForDeliveryAt?: string;       // Fecha exacta cuando los zapatos quedaron listos (Día 0)
    day15AlertDispatchedAt?: string;   // Timestamp Alerta WhatsApp Día 15
    day30FormalNoticeDispatchedAt?: string; // Timestamp Requerimiento Día 30
    legalDeadlineForWithdrawal?: string;    // Fecha límite final (Día 90)
    declaredAbandonedAt?: string;      // Timestamp oficial de abandono (Día 91+)
    evidenceLogs: Array<{
      id: string;
      eventType: 'ALERTA_LISTO' | 'ALERTA_DIA15' | 'REQUERIMIENTO_DIA30_PDF' | 'VISITA_CLIENTE';
      dispatchedAt: string;
      dispatchedBy: string;
      whatsAppMessageText: string;
      screenshotEvidenceBase64?: string; // Pantallazo de chat con confirmación/chulos de WhatsApp
      deliveryReceiptStatus: 'SENT' | 'DELIVERED' | 'READ' | 'MANUAL_VERIFIED';
    }>;
  };
}

export type LegalAbandonmentState = 
  | 'RECIBIDO_EN_PROCESO'               // Estado 1: Trabajo en taller
  | 'LISTO_PARA_ENTREGA'                // Estado 2: Día 0 (Comienza reloj legal)
  | 'ALERTA_VENCIMIENTO_DIA15'          // Estado 3: Día 15 (Alerta preventiva)
  | 'REQUERIMIENTO_FORMAL_DIA30'        // Estado 4: Día 30 (Notificación formal PDF)
  | 'CUENTA_REGRESIVA_ABANDONO'         // Estado 5: Días 31 a 90 (2 meses legales)
  | 'DECLARADO_EN_ABANDONO';            // Estado 6: Día 91+ (Extinción de reclamo)
```

### 2.2 Validaciones Críticas y Reglas de Bloqueo
1. **Regla de integridad telefónica:** El campo `phone` debe contener exactamente 10 dígitos numéricos en formato móvil colombiano (prefijos válidos `300`, `301`, `302`, `304`, `305`, `310`, `311`, `312`, `313`, `314`, `315`, `316`, `317`, `318`, `319`, `320`, `321`, `322`, `323`, `324`, `350`, `351`). **Si no cumple, el botón de guardado permanece deshabilitado.**
2. **Regla de fecha prometida:** La fecha no puede ser anterior a la fecha actual ni estar vacía.
3. **Regla de bloqueo por ausencia de firma:** No se permite registrar una orden si el canvas de firma se encuentra vacío (`signatureEmpty === true`).

---

## 3. COMPONENTE DE FIRMA DIGITAL EN PANTALLA (CANVAS TÁCTIL)

### 3.1 Requisitos Funcionales del Canvas
* **Soporte Táctil y Puntero:** Implementación de `PointerEvents` (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) para responder a dedos en pantallas móviles/tablets y a mouse o stylus en escritorios.
* **Prevención de Scroll:** Atributo CSS `touch-action: none;` aplicado al lienzo para evitar que el gesto de firma desplace la pantalla del navegador.
* **Resolución Retina/High-DPI:** Escalado con `window.devicePixelRatio` para evitar firmas pixeladas.
* **Control de Trazos Mínimos:** Algoritmo que valida que la firma tenga al menos 15 puntos de contacto o un área mínima cubierta, impidiendo que un toque accidental de un punto valide el registro.
* **Botón Limpiar / Borrar:** Permite al cliente reiniciar el trazo si cometió un error.

### 3.2 Texto Legal Obligatorio Visible sobre el Lienzo
El siguiente texto debe mostrarse en tipografía clara y destacada inmediatamente encima del área de firma:

> **AUTORIZACIÓN Y ACEPTACIÓN DE CONDICIONES LEGALES:**  
> *"Al firmar en esta pantalla, autorizo y reconozco expresamente que el número de WhatsApp suministrado constituye el canal oficial y válido para todas las comunicaciones y requerimientos legales. Conozco y acepto que tengo un plazo máximo de un (1) mes contado a partir de la fecha de entrega o aviso de terminación para retirar el bien. Cumplido este mes, se emitirá requerimiento formal concediéndome dos (2) meses adicionales, vencidos los cuales el bien se declarará legalmente en estado de abandono en los términos del Decreto 1413 de 2018 y el Artículo 18 de la Ley 1480 de 2011, facultando al establecimiento a disponer del mismo para cubrir los costos de reparación y bodegaje acumulados."*

### 3.3 Exportación y Almacenamiento
* Se genera una representación `data:image/png;base64` optimizada (recortando márgenes transparentes).
* La firma se estampa con sello de tiempo (Timestamp ISO UTC y Hora Legal de Colombia) y se asocia al `ticketNumber` y al recibo digital.

---

## 4. MÁQUINA DE ESTADOS Y LÓGICA TEMPORAL (TIMELINE LEGAL)

```
[Ingreso]
   │
   ▼
[Estado 1: RECIBIDO / EN PROCESO]
   │ (El artesano termina el trabajo y se marca "Listo")
   ▼
[Estado 2: LISTO PARA ENTREGA (Día 0)] ────────► Dispara Alerta WhatsApp 1 (Amigable)
   │
   ├─► Si no retira al Día 15
   ▼
[Estado 3: ALERTA VENCIMIENTO (Día 15)] ────────► Dispara Alerta WhatsApp 2 (Preventiva + Bodegaje)
   │
   ├─► Si cumple 30 días sin retiro (Día 30 posterior a terminación)
   ▼
[Estado 4: REQUERIMIENTO FORMAL (Día 30)] ─────► Dispara Alerta WhatsApp 3 con PDF Legal Adjunto
   │                                             (Inicia período de gracia de 2 meses)
   ▼
[Estado 5: CUENTA REGRESIVA ABANDONO] ─────────► Panel muestra días restantes (60 días descartan a 0)
   │ (Días 31 al 90 calendario)
   ▼
[Estado 6: DECLARADO EN ABANDONO (Día 91+)] ───► Bloqueo de reclamo ordinario.
                                                 Facultad legal de disposición (Decreto 1413 de 2018).
```

### 4.1 Definición de Transiciones y Cálculos Temporales
Sea $T_{terminacion}$ la fecha y hora en que se marcó el estado `LISTO_PARA_ENTREGA`:
* **Día actual relativo ($D$):** $\lfloor (T_{actual} - T_{terminacion}) / 86400000 \rfloor$.
* **Estado 2:** $0 \le D < 15$.
* **Estado 3:** $15 \le D < 30$.
* **Estado 4:** $D = 30$ (Acción obligatoria: Generar y remitir Requerimiento Formal PDF).
* **Estado 5:** $31 \le D \le 90$ (Días restantes de gracia legal = $90 - D$).
* **Estado 6:** $D > 90$ (El sistema bloquea la orden como "Bienes Legalmente Abandonados").

---

## 5. ESPECIFICACIÓN DE VISTAS (UI / UX)

### 5.1 Panel del Administrador (Semáforo de Abandono)
Diseñado con alto contraste y botones táctiles amplios para Don Elías y los administradores:

1. **Bandeja Verde (En Tiempo / Listos para entrega - Días 0 al 14):**
   * Muestra: Ficha, Nombre del Cliente, Teléfono, Saldo y Fecha de Terminación.
   * Acción: Botón verde gigante *"WhatsApp: Listo para retirar"*.
2. **Bandeja Amarilla (Alerta de Demora - Días 15 al 29):**
   * Muestra: Días de retraso (ej. "Lleva 18 días sin retirar"), Bodegaje causado.
   * Acción: Botón amarillo *"WhatsApp: Recordatorio Día 15"*.
3. **Bandeja Naranja (Requerimiento Formal Mandatorio - Día 30):**
   * Muestra: Insignia *"Requiere Notificación Formal Decreto 1413"*.
   * Acción: Botón *"Generar PDF Legal y Abrir WhatsApp"*.
4. **Bandeja Roja (Cuenta Regresiva de Abandono - Días 31 al 90):**
   * Muestra: Contador regresivo visible (ej. *"Quedan 24 días para abandono definitivo"*).
   * Módulo de Evidencias: Botón *"Cargar Captura de Pantalla"* para adjuntar el pantallazo de WhatsApp donde se evidencian los chulos azules o de entrega.
5. **Bandeja Negra / Púrpura (Declarados en Abandono - Día 91+):**
   * Muestra: Acta de Abandono Consumado, fecha en que caducó el derecho de reclamo, liquidación de costos de servicio no cubiertos y opción de *"Descargar Expediente Probatorio Completo"*.

### 5.2 Vista del Cliente (Recibo Digital en Línea)
Acceso vía URL única cifrada (ej. `/recibo/{orderId}`):
* Encabezado con imagen corporativa: "Clínica de Calzado y Ropa El Tío".
* Resumen de servicios, abonos y saldo pendiente en COP.
* **Sello de Estado Dinámico:**
  * Si está en plazo: Badge verde *"¡Tus zapatos están listos esperándote!"*.
  * Si está en días 15-30: Badge amarillo *"Recordatorio: Retira tu calzado para evitar cobros de custodia"*.
  * Si está en días 31-90: Banner de alerta con el artículo legal y la cuenta regresiva de retiro.
* **Firma Estampada:** Muestra al pie la firma táctil que el cliente estampó al entregar sus prendas, con la fecha, hora y cláusula legal aceptada.

---

## 6. PLANTILLAS OFICIALES DE NOTIFICACIÓN VÍA WHATSAPP

### 6.1 Plantilla 1: Notificación de Calzado Listo (Día 0)
```text
¡Hola, {{NOMBRE_CLIENTE}}! Te saludamos de la Clínica de Calzado y Ropa El Tío (Local 188 C.C. Santiago Plaza). 👞✨

Nos alegra informarte que tu trabajo (Ficha #{{NUMERO_FICHA}}, {{DESCRIPCION_CALZADO}}) ya está completamente LISTO para entrega y quedó excelente.

📋 Detalle del servicio:
• Valor total: ${{VALOR_TOTAL_COP}}
• Saldo pendiente por cancelar: ${{SALDO_PENDIENTE_COP}}
• Ubicación: Local 188 - C.C. Santiago Plaza, Cali.

Puedes ver tu recibo digital y detalle aquí:
{{ENLACE_RECIBO_DIGITAL}}

Te esperamos en nuestros horarios habituales para entregarte tus prendas. ¡Gracias por confiar en nosotros!
```

### 6.2 Plantilla 2: Alerta Preventiva de Retiro y Bodegaje (Día 15)
```text
Estimado(a) {{NOMBRE_CLIENTE}}, te saludamos de la Clínica de Calzado y Ropa El Tío.

Te recordamos cordialmente que tu servicio con Ficha #{{NUMERO_FICHA}} ({{DESCRIPCION_CALZADO}}) se encuentra terminado y listo para entrega desde el {{FECHA_TERMINACION}} (hace 15 días).

⚠️ Saldo pendiente: ${{SALDO_PENDIENTE_COP}}

De acuerdo con el acuerdo de servicio y el Decreto 1413 de 2018, los artículos terminados cuentan con 30 días de custodia sin costo adicional. Te invitamos a reclamar tu calzado a la mayor brevedad antes del {{FECHA_LIMITE_MES}} para evitar cargos adicionales de bodegaje o el inicio del proceso formal de no retiro.

Atentamente,
Administración - Clínica de Calzado y Ropa El Tío
Tel: 3108924435 - C.C. Santiago Plaza Local 188
```

### 6.3 Plantilla 3: Requerimiento Formal Legal de Abandono (Día 30)
```text
NOTIFICACIÓN OFICIAL DE REQUERIMIENTO FORMAL DE RETIRO
De conformidad con el Artículo 18 de la Ley 1480 de 2011 y el Decreto 1413 de 2018

Cali, {{FECHA_ACTUAL}}
Señor(a): {{NOMBRE_CLIENTE}}
Teléfono registrado: {{NUMERO_CELULAR}}
Orden de Servicio / Ficha: #{{NUMERO_FICHA}}
Prenda / Calzado: {{DESCRIPCION_CALZADO}}

Por medio de la presente nos permitimos informarle que habiendo transcurrido un (1) mes desde la fecha prometida de entrega y notificación de terminación del servicio sin que el bien haya sido reclamado, procedemos a realizar formal REQUERIMIENTO DE RETIRO conforme a la ley colombiana.

Adjunto a este mensaje encontrará el documento formal en PDF con radicado legal #{{ID_RADICADO}}.

A partir de la fecha de recibo de esta comunicación, cuenta con un término perentorio e improrrogable de dos (2) meses (plazo final: {{FECHA_LIMITE_FINAL_90_DIAS}}) para presentarse a nuestro establecimiento (C.C. Santiago Plaza, Local 188), cancelar el saldo pendiente (${{SALDO_PENDIENTE_COP}}) más los costos de almacenamiento acumulados (${{BODEGAJE_ACUMULADO_COP}}), y retirar el bien.

Vencido dicho plazo sin que se verifique el retiro, el bien se declarará formal y legalmente en ESTADO DE ABANDONO, autorizándose a este establecimiento comercial a disponer del mismo para cubrir las expensas causadas, extinguiéndose toda responsabilidad posterior.

Clínica de Calzado y Ropa El Tío
NIT: 17.018.382-1 | Don Elías Oliveros
```

---

## 7. ESTRUCTURA Y VARIABLES DEL PDF LEGAL AUTOMATIZADO

El sistema debe compilar un PDF estándar (formato A4) generado dinámicamente con las siguientes variables:

### 7.1 Variables de Inyección Dinámica
| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `{{EMPRESA_NOMBRE}}` | Razón Social / Nombre Comercial | Clínica de Calzado y Ropa El Tío |
| `{{EMPRESA_NIT}}` | Identificación Tributaria | NIT 17.018.382-1 |
| `{{EMPRESA_DIRECCION}}` | Domicilio comercial | C.C. Santiago Plaza, Local 188, Cali |
| `{{RADICADO_NUMERO}}` | ID único de requerimiento | REQ-2026-1807-AB |
| `{{FECHA_EXPEDICION}}` | Fecha y hora de generación | 30 de Octubre de 2026, 11:45 AM |
| `{{CLIENTE_NOMBRE}}` | Nombre del consumidor | Yanira González |
| `{{CLIENTE_TELEFONO}}` | Canal pactado | 3108924435 |
| `{{ORDEN_NUMERO}}` | Número de recibo y ficha | Recibo #1807 / Ficha #13 |
| `{{DESCRIPCION_BIEN}}` | Detalle específico | Zapatillas Makey azul / Soladura completa |
| `{{FECHA_INGRESO}}` | Fecha de recepción inicial | 24 de Octubre de 2026 |
| `{{FECHA_TERMINACION}}` | Fecha de aviso de listo | 25 de Octubre de 2026 |
| `{{FECHA_LIMITE_FINAL}}` | Fecha límite legal de los 2 meses | 25 de Diciembre de 2026 |
| `{{VALOR_SERVICIO}}` | Costo de mano de obra y repuestos | $11.500 COP |
| `{{ABONO_INICIAL}}` | Anticipo pagado | $0 COP |
| `{{SALDO_PENDIENTE}}` | Saldo adeudado | $11.500 COP |
| `{{COSTO_BODEGAJE}}` | Gastos de custodia acumulados | $15.000 COP |
| `{{FIRMA_CLIENTE_IMG}}` | Imagen de la firma digital capturada | `data:image/png;base64,...` |

### 7.2 Cláusulas Jurídicas Redactadas en el PDF
1. **Fundamento Fáctico:** Relación circunstanciada de la recepción del bien mueble y de la prestación efectiva del servicio artesanal contratado.
2. **Fundamento Jurídico:** Cita textual del Decreto 1413 de 2018 (artículos 1, 2, 3 y 4) y el Estatuto del Consumidor (Ley 1480 de 2011, artículo 18).
3. **Validez del Canal Digital:** Declaración de eficacia del canal WhatsApp como medio idóneo pactado de conformidad con la Ley 527 de 1999 (mensajes de datos probatorios).
4. **Liquidación de Expensas:** Cuadro discriminado del saldo insoluto del trabajo y la tasa diaria de custodia pactada en la orden inicial.
5. **Apercibimiento Legal:** Advertencia expresa de que, al término de los 60 días calendario siguientes, operará de pleno derecho la declaratoria de abandono, con facultad dispositiva a favor del taller.

---

## 8. POLÍTICA DE RETENCIÓN DE DATOS Y EXPEDIENTE PROBATORIO

### 8.1 Obligación Legal de Archivo (3 Años)
De conformidad con las prescripciones de acciones de protección al consumidor y responsabilidad civil extracontractual y comercial en Colombia:
* El expediente digital de cada orden con potencial o declaratoria de abandono debe conservarse **durante un período mínimo de tres (3) años** contados a partir de la fecha de declaratoria de abandono o entrega efectiva.

### 8.2 Componentes del "Expediente Digital Inmutable"
Para cada orden, el sistema mantendrá un archivo indivisible compuesto por:
1. **Hash de Integridad (SHA-256):** Generado al momento del registro y firma de la orden para garantizar que no ha existido alteración posterior.
2. **Trazabilidad de Firma:** Imagen de la firma con metadatos de timestamp UTC, User-Agent e IP.
3. **Log de Notificaciones:** Registro de cada mensaje remitido a WhatsApp (texto exacto, fecha y hora).
4. **Archivo de Evidencias Fotográficas:** Almacenamiento seguro de las capturas de pantalla cargadas por el taller que evidencian los tildes de envío/lectura en WhatsApp Web.
5. **Copia del PDF de Requerimiento:** Guardado en almacenamiento persistente con su número de radicado.

---

## 9. CHECKLIST DE IMPLEMENTACIÓN INMEDIATA PARA EL EQUIPO DE DESARROLLO

- [ ] **Frontend (Firma Táctil):** Crear componente `DigitalSignaturePad.tsx` en React con validación de trazo mínimo y botón limpiar.
- [ ] **Frontend (Recepción):** Modificar `OrderReceptionModal.tsx` para hacer obligatorios los campos `phone` y `promisedDeliveryDate` antes de permitir firmar.
- [ ] **Servicio de Estados:** Agregar función en `storage.ts` que calcule automáticamente la categoría semafórica (Verde, Amarillo, Naranja, Rojo, Negro) evaluando las fechas frente al día actual.
- [ ] **Generador de WhatsApp:** Integrar las 3 plantillas de texto dinámicas en `formatters.ts` con llamada a `https://api.whatsapp.com/send?phone=...&text=...`.
- [ ] **Generador de PDF:** Implementar generador de documento con `pdfmake` o `@react-pdf/renderer` para imprimir o descargar el PDF formal con el sello de la firma digital.
- [ ] **Módulo de Evidencias:** Permitir subir imagen JPG/PNG como evidencia probatoria del mensaje de WhatsApp.
