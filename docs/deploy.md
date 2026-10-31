# Deploy (Fase 9 · al final) — preparado, NO ejecutado

Estado al 31/10: configuración lista; **no se desplegó nada**. Desde la sesión de trabajo no hay acceso a Hostinger, Render, VPS
ni DNS (y el proxy bloquea `*.handyc.com`), así que nada de esto está verificado contra la infraestructura real.

## Distribución propuesta (a confirmar con los accesos)
| Componente | Dónde | Por qué |
|---|---|---|
| Build estático (`dist/`) | Hostinger, subdominio propio (p. ej. `pitch.handyc.com`) | Estático, ya contratado |
| Servidor de sesiones (WSS) | Render (web service) **o** VPS con Caddy | Necesita proceso persistente y WebSocket; Hostinger compartido no sirve |
| Redirecciones QR estables `/r/<id>` | Mismo servidor de sesiones (`sesiones.handyc.com/r/...`) o `api.handyc.com` si se integra | Destino controlado por el autor |

Neon: no hace falta (no hay datos persistentes que lo justifiquen). Ningún servicio nuevo pago.

## Pasos
1. DNS: `pitch` → Hostinger; `sesiones` → Render (CNAME) o VPS (A).
2. Servidor: Render con `deploy/render.yaml` **o** VPS con `deploy/presentations-sesiones.service` + `deploy/Caddyfile`.
   Variables: `ALLOWED_ORIGINS=https://pitch.handyc.com`, `CONFIAR_PROXY=true`. Verificar `GET https://sesiones.handyc.com/salud`.
3. Build: `VITE_SERVIDOR=https://sesiones.handyc.com VITE_PUBLICADA=<etiqueta> npm run build` → `deploy/hostinger-publicar.sh`.
4. Si se usa la ruta estable: cambiar `urlEstable` en `qr.json` al dominio real, `definitivo: true`, regenerar QR (`npm run qr`).

## Verificación (checklist humano)
- [ ] `/salud` responde por HTTPS; WSS conecta desde `pitch.handyc.com` y se rechaza desde otro origen.
- [ ] Celular en **datos móviles** controla la computadora en **Wi-Fi del evento** (redes distintas).
- [ ] Reinicio del servidor durante un ensayo: la computadora sigue local; se vuelve a emparejar.
- [ ] Render: medir si el proceso duerme; si duerme, abrir `/salud` 10 min antes.
- [ ] QR públicos A y B leídos desde la última fila con iOS y Android; redirección `/r/<id>` al destino activo.
