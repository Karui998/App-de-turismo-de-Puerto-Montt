# Portal de Turismo - Comuna de Puerto Montt 🇨🇱
---

Este portal moderno e interactivo ofrece una ventana digital integrada para la comuna de **Puerto Montt**. El objetivo es facilitar la planificación de viajes tanto para habitantes locales como para turistas de la Patagonia Chilena, con un diseño limpio, moderno, optimizado para celulares y computadores, y alineado al tema **Sleek Interface**.

## 🛠️ Arquitectura y Tecnologías
La aplicación está construida sobre una arquitectura fullstack integrada para máximo rendimiento y simplicidad:
* **Frontend:** React 18+ (Typescript) estructurado con módulos limpios, animaciones fluidas mediante `motion` (`motion/react`) e íconos interactivos de `lucide-react`.
* **Estilado:** Tailwind CSS con una paleta elegante de azules profundos y gris claro patagónico, tipografías legibles y espacio negativo equilibrado.
* **Backend:** Servidor Node.js Express de alto rendimiento que expone APIs REST robustas para la información pública y validaciones de seguridad de nivel de administrador.
* **Base de Datos:** Doble capa de provisión (PostgreSQL listo para producción o almacén local fluido `database.sql` / `data_store.json`).
* **Seguridad:** Autenticación por Tokens Bearer y cifrado de contraseñas mediante `bcrypt` para las acciones CRUD del panel administrativo.

---

## 🔒 Credenciales de Acceso Administrador (Prueba)
Para entrar a gestionar los recursos (agregar, editar o remover destinos turísticos, comercios típicos o líneas de buses):
* **Correo electrónico:** `admin@turismopuertomontt.cl`
* **Contraseña preestablecida:** `admin123`

---

## 💡 Características Clave Destacadas
1. **Acceso Administrativo Discreto:** El botón frontal original fue reemplazado por un **menú compacto de tres líneas horizontales (hamburguesa)** en el header, y un botón secundario discreto al final de la sección *Acerca de*. Esto evita saturar visualmente el sitio para los turistas comunes.
2. **Imágenes Libres de Derechos (Carga Local sin Copy):** El panel de administración ahora permite:
   * **Cargar archivos locales** directos (PNG, JPG) de tu dispositivo, los cuales se procesan y almacenan automáticamente en base de datos codificados bajo el estándar Base64 seguro para que se visualicen de inmediato sin requerir servidores externos o enlaces web.
   * **Insertar Enlaces Externos (URL)** flexibles opcionalmente.
3. **Portal Informativo Resiliente:** Posee un apartado estilizado de "Acerca de" que detalla la misión cívica y turística de la comuna de Puerto Montt.

---

## 🚀 Cómo Ejecutar el Proyecto en Local

Para levantar el portal en tu entorno local, sigue los pasos a continuación:

### Prerrequisitos
* Tener instalado **Node.js** (versión 18 o superior).
* Tener instalado **npm**.

### Instrucciones
1. **Instalar Dependencias:** En la raíz del proyecto, ejecuta:
   ```bash
   npm install
   ```
2. **Iniciar Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá automáticamente en tu navegador o en el puerto local de Express.

3. **Construcción para Producción (Build):**
   ```bash
   npm run build
   ```
   Esto compilará el frontend hacia la carpeta `/dist` y creará un archivo único optimizado para ejecución de producción `dist/server.cjs` utilizando `esbuild`.

4. **Levantar Entorno de Producción:**
   ```bash
   npm run start
   ```

---

## 🌐 Cómo Subir el Portal a Internet (Despliegue)

Al ser una aplicación fullstack con backend en Express y base de datos, tienes opciones excelentes y gratuitas/semi-gratuitas de alta velocidad:

### Opción 1: Render.com (La más fácil y recomendada)
1. **Crear una cuenta gratis** en [Render.com](https://render.com/).
2. **Conectar tu repositorio de GitHub** en el panel.
3. Elige **"Web Service"** al momento de crear el nuevo recurso.
4. Rellena los parámetros de configuración del servicio con:
   * **Runtime:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start`
5. En la sección **Advanced / Environment Variables**, si vas a usar una base de datos PostgreSQL de producción (en lugar del archivo SQLite local auto-provisionado), agrega la variable `DATABASE_URL` con tu cadena de conexión externa. Si no se provee, la aplicación utilizará su base de datos local automática para operar de manera autónoma.
6. ¡Dale clic a **Deploy Web Service** y tu app estará en línea con SSL SSL (HTTPS) gratuito!

### Opción 2: Railway.app (Alternativa de un clic)
1. Inicia sesión en [Railway.app](https://railway.app/).
2. Presiona **"New Project"** y selecciona **"Deploy from GitHub"**.
3. Elige tu repositorio del portal.
4. Railway detectará la configuración de Node.js, compilará y levantará el puerto de manera 100% automática y transparente sin configuración extra.

### Opción 3: Contenedores Docker (Para Cloud Run o VPS propios)
Este portal está 100% dockerizado y configurado para entornos en la nube (Cloud Run, AWS ECS). Si tu plan es desplegarlo mediante Docker en tu propio servidor VPS o en Google Cloud:
1. Construye la imagen contenedora:
   ```bash
   docker build -t portal-turismo-puertomontt .
   ```
2. Corre el contenedor en el puerto deseado mapeado al `3000`:
   ```bash
   docker run -p 80:3000 --env DATABASE_URL="tu-enlace-Postgres-si-aplica" portal-turismo-puertomontt
   ```
