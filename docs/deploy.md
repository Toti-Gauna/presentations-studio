# Deploy · arquitectura elegida (02/11): Hostinger + Render

| Pieza | Dónde | Qué hace |
|---|---|---|
| Presentación (sitio estático) | **Hostinger**, hosting compartido (`pitch.handyc.com`) | Hub, pantalla pública, presentador, control del celular (páginas) |
| Servidor de control | **Render** (`handyx-control`, plan pago: no se duerme) | `/ws` (WebSocket), `/api/sesiones`, `/salud`, `/r/<id>` de los QR |

El celular abre la página del control desde Hostinger y se conecta por WSS al servidor de Render. El servidor solo acepta
el origen exacto de la presentación (`ALLOWED_ORIGINS`). Sin base de datos.

## Pasos
1. `./configurar.sh` → opción **1** (Hostinger + Render). Genera `salida/deploy/` con variables y secretos de GitHub,
   `render-control.md` y los pasos (ver `docs/deploy-hostinger.md`).
2. **Render:** New → Blueprint con este repo (lee `render.yaml`) o un Web Service a mano con los valores de `render-control.md`.
   `ALLOWED_ORIGINS = https://pitch.handyc.com`. Probar `https://<servicio>.onrender.com/salud`.
3. **GitHub:** cargar variables y secretos (`bash salida/deploy/cargar-en-github.sh`) → Actions → **Deploy Hostinger** → Run.
   El workflow compila la presentación apuntando a Render (`SERVIDOR_CONTROL`), la sube a Hostinger y verifica las dos puntas.
4. Día del evento: hub → **Presentar** → **Conectar control remoto** (ya viene completado con Render) → QR privado → Aprobar.

## Otras opciones (quedan listas)
- **Todo en un VPS con Docker:** opción 2 del configurador (`Dockerfile`, Caddy con HTTPS).
- **Todo en un servicio de Render:** `deploy/render-todo-en-uno.yaml` (web + control en el mismo dominio).

## Verificado / no verificado
- Verificado en local: presentación estática en un origen + servidor de control en otro (como Hostinger + Render):
  conexión automática, emparejamiento, comando confirmado, origen ajeno rechazado (403).
- No verificado: Render y Hostinger reales (cuentas de Ignacio), DNS, teléfonos en redes distintas.
