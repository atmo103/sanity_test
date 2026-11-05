# Panel de contenido DidaControl

## 1. Copiar los archivos

Extrae el ZIP dentro de tu carpeta `sanity_test`, conservando las rutas y reemplazando los archivos incluidos. El ZIP contiene los archivos nuevos y los archivos completos modificados; conserva el resto del proyecto y todos tus assets de `public`.

No hay paquetes nuevos que instalar. Se mantienen Next.js 16.4.5 y React 19.3.0.

## 2. Configurar el acceso y Sanity

En la raíz del proyecto, copia `.env.example` como `.env.local`. En PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Completa estos valores en `.env.local`:

| Variable | Valor |
| --- | --- |
| `SANITY_PROJECT_ID` | `1yuaf3m5`, ya incluido. |
| `SANITY_DATASET` | `production`, ya incluido. |
| `SANITY_API_WRITE_TOKEN` | Token del proyecto Dida con permiso **Editor**. Créalo en Sanity → proyecto Dida → API → Tokens → Add API token. |
| `PANEL_PASSWORD` | La clave compartida de la demostración, con al menos 16 caracteres. |
| `PANEL_SESSION_SECRET` | Secreto aleatorio para firmar las sesiones, de al menos 32 caracteres. |

Genera el secreto con:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

El token y el secreto permanecen en el servidor. No uses el prefijo `NEXT_PUBLIC_` ni subas `.env.local` a GitHub. El cliente solo recibe la clave `PANEL_PASSWORD`.

`PANEL_ORIGIN` es opcional; déjalo sin configurar para el uso habitual. Si tu proxy modifica el encabezado Host, establece el origen público exacto, por ejemplo `https://tu-demo.vercel.app`, sin barra final.

## 3. Abrir el panel

```powershell
npm run dev
```

Entra a **http://localhost:3000/panel**, escribe la clave y pulsa **Cargar contenido inicial** una sola vez. Esto copia a Sanity los 3 testimonios, 11 clientes y 5 noticias actuales, conservando las imágenes existentes.

- **Guardar borrador:** guarda el registro en Sanity sin cambiar el sitio público.
- **Vista previa:** guarda el borrador y abre el Home con los borradores, en otra pestaña protegida.
- **Publicar:** publica únicamente ese registro. Abre **Ver sitio** o recarga el Home para comprobarlo.
- **Orden:** los números menores aparecen primero; se aplica al publicar.
- **Visible en el Home:** permite ocultar un registro sin borrarlo; se aplica al publicar.
- **Noticias destacadas:** aparecen como tarjetas con imagen; las demás van al listado. No se crean páginas de artículo.
- **Eliminar:** quita el borrador y el registro publicado, previa confirmación.
- **Restablecer prueba:** devuelve exclusivamente el contenido de esta demostración a su estado inicial, previa confirmación. No elimina otros documentos de Sanity ni los archivos subidos.

Los logos de clientes se muestran en blanco en el Home. Usa archivos con fondo transparente. Las imágenes nuevas se suben realmente a Sanity; se aceptan JPG, PNG, WebP, AVIF y SVG de hasta 4 MB.

## 4. Compartir la demostración

Publica el repositorio en Vercel y agrega allí las mismas cinco variables de entorno. Después vuelve a desplegar. Comparte con el cliente **`https://tu-dominio/panel` y la clave del panel**. El cliente no necesita una cuenta de Sanity ni acceso a tu cuenta.

La sesión dura 8 horas. Cambiar la clave o el secreto invalida las sesiones anteriores. La demostración comparte el mismo contenido entre todas las personas que la prueben.

## Archivos y funcionamiento

- `app/panel/`: diseño, formularios, acceso y vista previa.
- `app/api/panel/[[...path]]/route.js`: sesiones, guardado, publicación, imágenes y restablecimiento.
- `app/lib/cms/`: conexión, validación y contenido inicial.
- `app/page.js`, `HomeTestimonials.jsx`, `HomeNews.jsx`: lectura del contenido publicado.
- `app/globals.css`: conserva los estilos existentes y añade el panel con clases propias.
- `.env.example` y `.gitignore`: configuración de ejemplo y exclusión de secretos.

El header, el hero, el footer y la configuración de Next no se modifican. Intro y Why permanecen comentados, como en tu versión de GitHub. Las noticias dejan de enlazar a las páginas del template original.

## Verificación

Compilación de producción comprobada con la versión real del proyecto. Flujos de acceso, borrador, publicación, imágenes, conflictos y restablecimiento probados contra un transporte de Sanity simulado, sin incluir ese simulador en esta entrega. Revisión visual en navegador desde 320 hasta 6400 px.

**La publicación en tu proyecto real requiere configurar tu token y realizar la primera prueba conectada.** El ZIP no contiene credenciales ni crea documentos en tu Sanity por sí solo. Antes de cargar el contenido inicial, el Home conserva los datos actuales como respaldo; si Sanity falla, también utiliza ese respaldo.

El acceso compartido está pensado para esta demostración. La limitación de intentos de entrada opera por instancia del servidor; una entrega definitiva con usuarios individuales requiere definir su autenticación correspondiente.
