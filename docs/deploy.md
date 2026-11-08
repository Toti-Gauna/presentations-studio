# Deploy · arquitectura elegida (02/11): Hostinger + Render

| Pieza | Dónde | Qué hace |
|---|---|---|
| Presentación (sitio estático) | **Hostinger**, hosting compartido (`presentaciones.handyc.com`) | Hub, pantalla pública, presentador, control del celular (páginas) |
| Servidor de control | **Render** (`handyx-control`, **plan gratis**, USD 0) | `/ws` (WebSocket), `/api/sesiones`, `/salud`, `/r/<id>` de los QR |

El celular abre la página del control desde Hostinger y se conecta por WSS al servidor de Render. El servidor solo acepta
el origen exacto de la presentación (`ALLOWED_ORIGINS`). Sin base de datos.

## ¿Hace falta otro backend o repo?
No. El servidor de control vive en **este repo** (`server/`) y Render lo levanta con `render.yaml`. Va en la **misma cuenta**
de Render que el BE de la landing, pero como **servicio aparte** (`handyx-control`): no se mezcla con `Handy-landing-page-be`,
que guarda PII cifrada y tiene invariantes propias (sin estado compartido, sin base de datos acá).

## Plan gratis de Render (decisión de Ignacio, 02/11)
El servicio de control usa el plan **Free** (`render.yaml`): USD 0, pero duerme tras 15 min sin tráfico y tarda ~1 min en
despertar. Por eso el presentador, al abrirse, lo despierta (avisa "Despertando el servidor de control…" y espera hasta 90 s)
y mientras está abierto le consulta `/salud` cada 4 min. El smoke del deploy también tolera el arranque en frío.
**El día del pitch: abrir el presentador 5 minutos antes.** Para que nunca duerma: Render → Instance Type → Starter, sin tocar código.

## Mismo método que la landing (02/11)
La publicación en Hostinger copia la de `Handy-landing-page-fe`: `scripts/hostinger-publish.sh` (lock, respaldo `.tar.gz`,
staging, chequeo de archivos, vuelta atrás) + `scripts/hostinger-smoke.sh` (prueba pública) + `.github/workflows/deploy-hostinger.yml`
con los **mismos nombres** de variables y secretos. Diferencias: perfil `presentaciones`, que **solo** puede escribir en
`…/domains/presentaciones.handyc.com/public_html` (o `…/domains/handyc.com/public_html/presentaciones`), y el smoke también prueba Render
(`/salud` y que acepte el origen de la presentación).

| GitHub (este repo) | Valor |
|---|---|
| Variables | `HOSTINGER_DEPLOY_ENABLED=true`, `HOSTINGER_HOST`, `HOSTINGER_PORT`, `HOSTINGER_USER` (iguales a la landing), `HOSTINGER_PATH` (absoluta, la del subdominio), `DOMINIO`, `VITE_DECK`, `SERVIDOR_CONTROL` |
| Secretos | `HOSTINGER_SSH_KEY` (la misma clave de la landing o una nueva), `HOSTINGER_KNOWN_HOSTS` (`ssh-keyscan -p <puerto> <host>`) |
| Entorno | `hostinger-presentaciones` (se crea solo; podés exigir aprobación manual) |

## Pasos
1. **Hostinger:** hPanel → Dominios → Subdominios → `presentaciones` (carpeta `domains/presentaciones.handyc.com/public_html`). Borrá el
   `.htaccess`/`default.php` que deje Hostinger (el script no pisa un `.htaccess` ajeno).
2. **Render:** New → Blueprint con este repo (lee `render.yaml`) o Web Service a mano con `render-control.md`.
   `ALLOWED_ORIGINS = https://presentaciones.handyc.com`. Probar `https://<servicio>.onrender.com/salud` → `{"ok":true}`.
3. `./configurar.sh` → opción **1**. Pide host/puerto/usuario (los de la landing), carpeta, URL de Render y si reusás la clave.
4. **GitHub:** `bash salida/deploy/cargar-en-github.sh` (o pegar `github-variables.txt` / `github-secretos.txt`).
5. Mergear a `main` (o Actions → **Deploy Hostinger** → Run workflow): compila apuntando a Render, publica con respaldo,
   prueba las dos puntas y si algo falla restaura el respaldo.
6. Día del evento: hub → **Presentar** → **Conectar control remoto** (ya viene completado con Render) → QR privado → Aprobar.

## Otras opciones (quedan listas)
- **Todo en un VPS con Docker:** opción 2 del configurador (`Dockerfile`, Caddy con HTTPS, `.github/workflows/deploy-vps.yml`).
- **Todo en un servicio de Render:** `deploy/render-todo-en-uno.yaml` (web + control en el mismo dominio).

## Verificado / no verificado
- Verificado en local: presentación estática en un origen + servidor de control en otro (como Hostinger + Render):
  conexión automática, emparejamiento, comando confirmado, origen ajeno rechazado (403).
- Verificado en local: presentador con el servidor apagado muestra "Despertando…" y vuelve al estado normal cuando el servidor arranca.
- Verificado en local: `hostinger-publish.sh` (publica, rechaza carpeta ajena con salida 2, restaura respaldo) y
  `hostinger-smoke.sh` (pasa, y falla si Render no acepta el origen); configurador con nombres de la landing.
- No verificado: Render y Hostinger reales (cuentas de Ignacio), DNS, teléfonos en redes distintas.
