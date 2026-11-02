# Deploy en Hostinger con Docker (configurador por consola)

## ¿Hace falta backend?
- **Para presentar con teclado o clicker: no.** El sitio estático alcanza (pantalla pública + presentador en la misma
  computadora, PDF, paquete local).
- **Para manejarlo desde el celular: sí, un servidor chico** (un proceso Node con WebSocket, sin base de datos). El celular y
  la computadora no pueden hablarse directo por internet; necesitan un punto de encuentro. Con Docker ese servidor va
  **en el mismo contenedor** que la presentación: un solo servicio, un solo dominio.

| Hosting de Hostinger | Qué se publica | Celular |
|---|---|---|
| **VPS** (Docker) | contenedor = presentación + control, detrás de Caddy (HTTPS automático) | ✅ desde cualquier red |
| **Compartido** | solo el sitio estático (rsync por SSH, puerto 65002) | ❌ salvo que apunte a un servidor aparte (VPS o Render) |

## Paso a paso (sin Codespaces lento: todo por consola)
```sh
./configurar.sh          # o: npm run configurar   (si no tenés Node 22.18+, lo corre dentro de Docker)
```
Te pregunta: VPS o compartido, dominio, repo y rama, presentación por defecto, IP/usuario/puerto SSH, carpeta, email para
HTTPS y si genera una clave SSH nueva. Genera en `salida/deploy/` (no se versiona):

| Archivo | Para qué |
|---|---|
| `LEEME.md` | los pasos en orden, con tus datos |
| `github-variables.txt` / `github-secretos.txt` | copiar y pegar en GitHub → Settings → Secrets and variables → Actions |
| `cargar-en-github.sh` | lo mismo en un comando con `gh` (Codespaces ya está logueado) |
| `preparar-vps.sh` | pegar **una vez** en la terminal del VPS: instala Docker si falta, autoriza la clave, crea la carpeta con `docker-compose.yml`, `Caddyfile` y `.env` |
| `docker-compose.yml`, `Caddyfile`, `.env` | los mismos archivos por separado |
| `.htaccess` (compartido) | caché y cabeceras; el workflow ya lo sube |
| `clave-deploy` / `.pub` | clave SSH solo para el deploy (la privada va como secreto `DEPLOY_SSH_KEY`) |

Después: **GitHub → Actions → Deploy Hostinger → Run workflow** (o push a la rama elegida). El workflow
(`.github/workflows/deploy-hostinger.yml`) corre las pruebas, y según el modo:
- **VPS:** construye la imagen, la manda por SSH (`docker save | docker load`, sin registro ni tokens extra) y hace `docker compose up -d`.
- **Compartido:** compila y sube `dist/` con rsync.
Termina probando `https://<dominio>/salud` (VPS) o la portada (compartido).

## Probar la imagen en tu máquina
```sh
docker build -t presentaciones:actual .
docker run --rm -p 8787:8787 presentaciones:actual     # http://localhost:8787 → hub; /salud
```

## Verificado en esta sesión
- `docker build` y contenedor: hub, presentación, `/salud`, redirección QR, usuario sin privilegios (`node`).
- Contra el contenedor: presentador → servidor del mismo origen → emparejar celular → comando confirmado.
- Configurador en los dos modos (respuestas redirigidas), validaciones de datos, permisos 600 en secretos.
- La clave generada sin `ssh-keygen` (RSA 4096 desde Node) la acepta OpenSSH y su pública coincide.
- `docker compose config` y `caddy validate` sobre los archivos generados.
## No verificado
El workflow en GitHub Actions (necesita tus secretos), el VPS real, el DNS y el certificado de Let's Encrypt.
