# Deploy en Render (un solo servicio) — listo para crear

Un único **Web Service** de Render sirve todo en el mismo dominio HTTPS: la presentación (build estático), el control
remoto (WebSocket seguro, WSS) y las redirecciones de QR. El celular controla la computadora **desde cualquier red**
(datos móviles o Wi-Fi del evento). Configuración: `render.yaml` en la raíz (copia en `deploy/render.yaml`).

## Crear el servicio (lo hace Ignacio en Render; Claude no tiene acceso a la cuenta)
1. Render → **New → Blueprint** → elegir el repo `Toti-Gauna/presentations-studio`, rama `claude/modest-gauss-jin0gy`
   (o `main` cuando se mergee; cambiar `branch` en `render.yaml`). Render lee `render.yaml` y crea `handyx-pitch`.
   - Alternativa manual: **New → Web Service** · Runtime Node · Build `npm ci --include=dev && npx vite build` ·
     Start `node server/main.ts` · Health check `/salud` · variables: `NODE_VERSION=22.18.0`, `SERVIR_ESTATICOS=dist`,
     `MISMO_ORIGEN=true`, `CONFIAR_PROXY=true`, `QR_REDIRECCIONES=decks/handyx/qr.json`.
2. Plan: **Starter** (no se duerme). En **Free** el proceso se duerme: abrir `/salud` 2–3 minutos antes de presentar.
3. Cuando termine: abrir `https://<servicio>.onrender.com/salud` → `{"ok":true,…}`.

## Usarlo el día del evento
1. En la computadora: `https://<servicio>.onrender.com/` → hub → **Handyx · Pitch premium** → **Presentar**.
2. **Abrir pantalla pública** → arrastrarla al proyector → **F** (pantalla completa) → un clic en esa ventana (sonido).
3. **Conectar control remoto** (el servidor ya viene completado: es el mismo dominio) → escanear el **QR privado** con el
   celular → **Aprobar**. Desde el celular: deslizar ← → o botones; **☰ Diapositivas** para elegir cualquier lámina.
4. Si se cae internet: el teclado o el clicker siguen funcionando en la computadora.

## Dominio propio (opcional)
Render → Settings → Custom Domain (`pitch.handyc.com`) + CNAME en el DNS de handyc.com. Con `MISMO_ORIGEN=true` no hay que tocar nada más.

## Verificado y no verificado
- Verificado en esta sesión: el modo un solo servicio (prueba automática de mismo origen), build y servidor sirviendo `dist/`
  con control remoto en `localhost` (E2E 21/21).
- **No verificado:** el despliegue real en Render (requiere la cuenta de Ignacio) y la prueba entre redes con teléfonos reales.
