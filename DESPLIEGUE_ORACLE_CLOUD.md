# Guía de Despliegue en Oracle Cloud Infrastructure (OCI) Always Free Tier
## Zapatería El Tío — Aplicación Web

Esta guía detalla paso a paso cómo desplegar la aplicación en su máquina virtual gratuita de **Oracle Cloud (Always Free)** para que su papá y los operarios del taller puedan acceder a ella desde cualquier celular, tableta o computador con internet.

---

### Opción Rápida Inmediata (Sin Desplegar Aún)
Si desea que su papá pruebe la aplicación **en este mismo instante** desde su celular sin esperar a configurar Oracle Cloud, compártale este enlace directo generado en la nube de Google AI Studio:

🔗 **Enlace de Demostración Activo:**
`https://ais-pre-ezdxycgzrazofh25f5huwk-895885039269.us-east1.run.app`

---

## Despliegue Permanente en Oracle Cloud Always Free

Oracle Cloud ofrece de forma **100% gratuita de por vida (Always Free)**:
- Hasta 4 OCPU y 24 GB de RAM en procesadores Ampere A1 (ARM64), o 2 instancias AMD Micro x86_64.
- IP pública estática gratuita.
- 200 GB de almacenamiento en disco.

---

### Paso 1: Crear la Instancia en la Consola de Oracle Cloud
1. Inicie sesión en [cloud.oracle.com](https://cloud.oracle.com).
2. Vaya al menú **Compute > Instances** y haga clic en **Create Instance**.
3. **Nombre:** `zapateria-el-tio-server`.
4. **Image and Shape:**
   - **Imagen:** Ubuntu 24.04 LTS o Ubuntu 22.04 LTS.
   - **Shape:** *VM.Standard.A1.Flex* (Ampere ARM, 2 OCPU y 12 GB RAM) o *VM.Standard.E2.1.Micro* (AMD 1 OCPU, 1 GB RAM). Ambos son elegibles para Always Free.
5. **Networking:** Seleccione su VCN pública y asegúrese de que esté marcada la opción **Assign a public IPv4 address**.
6. **SSH Keys:** Descargue su clave privada (`id_rsa`) para conectarse por terminal.
7. Haga clic en **Create**. En unos minutos tendrá su **Dirección IP Pública** (ejemplo: `129.153.xx.xx`).

---

### Paso 2: Abrir los Puertos en la Consola de Oracle (VCN Security List)
Por defecto, Oracle bloquea el tráfico entrante. Debe abrir los puertos HTTP y de la aplicación:
1. En la consola de OCI, vaya a **Networking > Virtual Cloud Networks**.
2. Haga clic en su VCN y luego en **Security Lists > Default Security List**.
3. Haga clic en **Add Ingress Rules** y agregue las siguientes reglas:
   - **Source CIDR:** `0.0.0.0/0`
   - **IP Protocol:** `TCP`
   - **Destination Port Range:** `80, 443, 3000`
   - **Description:** `Permitir tráfico Web y App Zapatería`
4. Haga clic en **Add Ingress Rules**.

---

### Paso 3: Conectarse por SSH y Abrir el Firewall Interno de Ubuntu
Oracle Linux y Ubuntu en OCI traen un firewall interno estricto (`iptables`). Conéctese a su servidor:

```bash
ssh -i /ruta/a/su/clave.key ubuntu@<IP_PUBLICA_ORACLE>
```

Ejecute estos comandos para abrir el firewall del sistema operativo:

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Abrir puertos en iptables interno de Oracle
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT

# Guardar reglas persistentes para que no se borren al reiniciar
sudo netfilter-persistent save
```

---

### Paso 4: Instalar Docker y Docker Compose
Ejecute en la terminal de la máquina virtual:

```bash
# Instalar Docker oficial
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Permitir a su usuario ejecutar docker sin sudo
sudo usermod -aG docker ubuntu
newgrp docker

# Instalar docker compose
sudo apt install -y docker-compose-plugin
```

---

### Paso 5: Subir el Proyecto y Desplegar con Docker
En la máquina virtual:

```bash
# 1. Clonar o descargar el repositorio
git clone <URL_DE_SU_REPOSITORIO_GITHUB> zapateria-app
cd zapateria-app

# 2. Levantar el contenedor en segundo plano
docker compose up -d --build
```

Compruebe que el contenedor esté corriendo:
```bash
docker ps
```

En este momento, la aplicación ya estará disponible en:
`http://<IP_PUBLICA_ORACLE>:3000`

---

### Paso 6: Configurar Dominio y HTTPS Gratuito con Caddy (Recomendado)
Para que su papá pueda entrar con un nombre fácil (ejemplo: `taller.midominio.com` o una IP segura con candado verde) y pueda instalarla como **App en la pantalla de inicio del celular**:

Instale Caddy Web Server (gestiona certificados SSL de Let's Encrypt automáticamente):

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLF 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLF 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy -y
```

Edite la configuración de Caddy (`sudo nano /etc/caddy/Caddyfile`):

```caddy
# Si tiene un dominio propio:
zapateria.sudominio.com {
    reverse_proxy localhost:3000
}

# O si entra por la IP pública directamente:
:80 {
    reverse_proxy localhost:3000
}
```

Reinicie Caddy:
```bash
sudo systemctl restart caddy
```

---

### Paso 7: Cómo Instalar la Aplicación en el Celular de su Papá
1. En el celular de su papá (Android o iPhone), abra el navegador (Chrome o Safari).
2. Ingrese a la dirección web de la zapatería.
3. En el menú del navegador (los 3 puntos en Android o el botón de compartir en iPhone), seleccione:
   👉 **"Agregar a la pantalla principal"** o **"Instalar aplicación"**.
4. Se creará un icono con el nombre de **Zapatería El Tío** como si fuera una aplicación nativa descargada de la tienda, con acceso directo y a pantalla completa.
