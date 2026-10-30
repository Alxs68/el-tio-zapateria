# 👞 Zapatería El Tío — Sistema de Gestión de Taller & Blindaje Legal

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Legal Tech Colombia](https://img.shields.io/badge/Cumplimiento_Legal-Decreto_1413_de_2018-008080?logo=scale&logoColor=white)](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=87829)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

> **Solución de software integral para microempresas de reparación y mantenimiento de calzado en Colombia.**  
> Diseñada para optimizar la atención en mostrador en horas pico, automatizar la emisión de recibos digitales por WhatsApp y **blindar jurídicamente al taller ante el abandono de mercancía** conforme al **Estatuto del Consumidor (Ley 1480 de 2011)** y el **Decreto 1413 de 2018**.

---

## 🎯 Problema de Negocio y Enfoque de Solución

En los talleres tradicionales de calzado y confección coexisten tres problemas críticos:
1. **Pérdida de espacio y dinero por mercancía abandonada:** Clientes que dejan calzados costosos, no los retiran durante meses o años, y posteriormente exigen indemnizaciones o generan cuellos de botella en bodega.
2. **Fricción y lentitud en mostrador:** Sistemas complejos o cuadernos de papel que retrasan la atención a clientes en horas pico.
3. **Privacidad de ingresos:** Exposición visual innecesaria de las ventas del día ante clientes o terceros que se acercan al mostrador.

### La Solución:
Una aplicación web progresiva (PWA / SPA) ultra-ágil, con diseño enfocado en la atención directa, recibos digitales automáticos con firma en pantalla y un motor de alertas legales y probatorias.

---

## ✨ Características Principales

### 1. ⚡ Mostrador Rápido & Atención Prioritaria
- **Ingreso en menos de 30 segundos:** Registro de cliente, celular WhatsApp, bolsa física, trabajo a realizar, abonos y fecha de entrega.
- **Buscador ágil en vivo:** Localice cualquier orden al instante por nombre de cliente, número de celular o etiqueta de bolsa.
- **Privacidad en mostrador:** Totales de ventas ocultos por defecto (`$ ••••••`) con botón de consulta privada y modal de **Cuadre Diario de Gaveta** (efectivo en caja vs. transferencias Nequi/Daviplata y gastos).

### 2. 📱 Recibo Digital por WhatsApp & Firma en Pantalla
- **Firma digital táctil (HTML5 Canvas):** El cliente firma directamente en pantalla con su dedo al ingresar sus zapatos.
- **Aceptación expresa de términos:** Consentimiento informado vinculando WhatsApp como canal oficial de avisos y aceptación del régimen de abandono.
- **Mensajes preformateados listos:** Envío del recibo con enlace web de consulta sin requerir que el cliente instale ninguna app.

### 3. ⚖️ Blindaje Legal Probatorio (Decreto 1413 de 2018)
- **Máquina de estados de seguimiento:**
  - `Recibido` ➔ `En Proceso` ➔ `Listo para Entrega (Día 0)`.
  - `Alerta Preventiva (Día 15)`: Recordatorio amistoso de retiro.
  - `Requerimiento Formal (Día 30)`: Notificación oficial con advertencia de cobro de bodegaje y plazo perentorio.
  - `Cuenta Regresiva de Abandono (Días 31 al 90)`: Plazo legal de 60 días para retiro.
  - `Declarado en Abandono (Día 91+)`: Pérdida de derecho de reclamo ordinario y habilitación para disposición de mercancía.
- **Bitácora Probatoria:** Registro automático de marcas de tiempo de cada aviso enviado por WhatsApp para sustentar legalmente la notificación ante la Superintendencia de Industria y Comercio (SIC).
- **Generación de Requerimiento Formal:** Especificación técnica para generar PDF con validez jurídica.

### 4. 👥 Gestión Multirrol de Taller
- Perfiles de operario configurados para el equipo de trabajo (**Don Elías**, **Yadi**, **Alexis**) con asignación de labores y filtro por operario responsable.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | SPA de alto rendimiento y renderizado instantáneo |
| **Lenguaje** | TypeScript | Tipado estricto en modelos de datos, estados y contratos |
| **Estilos** | Tailwind CSS | Interfaz moderna, accesible, responsiva para móviles y tablets |
| **Iconografía** | Lucide React | Iconos limpios e intuitivos para agilizar el uso en mostrador |
| **Firma Digital** | HTML5 Canvas API | Captura táctil de firma y conversión a Base64 vinculada a la orden |
| **Backend / Server** | Node.js + Express | Servidor ligero para API y despliegue contenerizado |
| **Despliegue** | Docker / OCI | Compatible con Oracle Cloud Always Free, Docker Compose o Vercel |

---

## 🏛️ Arquitectura de Separación: Demo vs. Producción

El proyecto implementa una estricta **separación de entornos** para garantizar la privacidad y seguridad:

* **Modo Demostración / Portafolio (Público):**  
  Opera con datos ficticios aislados en la sesión del navegador (`localStorage`). Cualquier visitante puede interactuar, crear órdenes y probar la firma táctil sin afectar datos reales ni bases de datos de producción.
* **Modo Taller Real (Producción Privada):**  
  Desplegado en servidor dedicado (Oracle Cloud Infrastructure) bajo variables de entorno protegidas (`.env`), con acceso restringido para los miembros del taller.

---

## 🚀 Puesta en Marcha Local

### Prerrequisitos
- Node.js 18+ o superior
- npm o bun

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/Alxs68/el-tio-zapateria.git
cd el-tio-zapateria

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### Construcción para Producción
```bash
npm run build
```

---

## 📖 Documentación Adicional

- [📄 Guía de Despliegue en Oracle Cloud Always Free](./DESPLIEGUE_ORACLE_CLOUD.md): Manual paso a paso para desplegar en una máquina virtual gratuita de Oracle Cloud con Ubuntu, Docker y Nginx.
- [⚖️ Especificación de Requerimientos Legales (ERS)](./ESPECIFICACION_REQUERIMIENTOS_LEGAL_ABANDONO.md): Marco normativo del Decreto 1413 de 2018, machine state y plantillas legales.

---

## 👤 Autor

**Alexis Oliveros**  
- GitHub: [@Alxs68](https://github.com/Alxs68)  
- Proyecto: *Sistema Operativo de Taller y Legal Tech para Zapatería El Tío*

---

*Desarrollado con dedicación para optimizar el trabajo artesanal tradicional con las mejores prácticas del desarrollo de software moderno.*
