# Presentations Studio

Motor web de **presentaciones dirigidas en vivo**: escenario 16:9, vista del presentador, control desde el celular por QR
privado, QR públicos A/B, cifras rotuladas desde una única fuente, respaldo PDF/MP4/local. Primer caso: el pitch de **Handyx**
para ATICMA (semifinal prevista 05/11/2026). Después: producto **Eclipse** (presentaciones creadas con Claude, sin editor).

## Uso rápido
```sh
npm ci
npm run dev                      # http://localhost:5173/ → lanzador (sin control remoto)
npm run build && SERVIR_ESTATICOS=dist npm run servidor   # http://localhost:8787/ con control remoto (red local)
```
Hub (`/`): elegí presentación y versión. Presentador: `/presentador/?deck=handyx&version=aticma` · Pantalla pública: `/presentar/?deck=…`.
- **Handyx ATICMA 3 minutos** (`deck=handyx-aticma&version=evento`, 03/11): cuatro pantallas estáticas (180 s) + seis anexos.
  Guion: [`docs/handyx/aticma-3min-guion.md`](docs/handyx/aticma-3min-guion.md) · fuentes y pendientes: [`docs/handyx/aticma-3min-fuentes-y-pendientes.md`](docs/handyx/aticma-3min-fuentes-y-pendientes.md).
- **Handyx v1 institucional** (`deck=handyx`): `aticma` (180 s), `corta` (60 s), `angel` (≈ 6 min), `vc` (≈ 9 min).
- **Handyx v2 comercial** (`deck=handyx-v2`, mismas cifras): `comercial` (≈ 5 min), `marca-marketing` (2 min), `anuncios` (reel).

## Presentar el pitch ATICMA de 3 minutos
1. Arrancar: `npm run dev` (solo teclado) o `npm run build && SERVIR_ESTATICOS=dist npm run servidor` (con celular en la red local), o la publicación de Hostinger.
2. Presentador: `/presentador/?deck=handyx-aticma&version=evento` → **Abrir pantalla pública** → arrastrarla al proyector → **F**.
3. Avance manual: → / espacio / clicker / celular. Avanzar se detiene en la 4.ª pantalla: los anexos solo se abren con
   **Mayús + A…F** (o desde el índice o el menú ☰ del celular); **0** vuelve a la última pantalla principal.
4. Reloj (**R**) solo en el presentador: marca el ritmo, no corta ni avanza. Notas y guion literal solo en el presentador.
5. Modo evento estático por defecto (sin animaciones ni sonidos de entrada). Para ensayar con movimiento: `&movimiento=ligero`.
6. Un refresco accidental del presentador vuelve a la misma pantalla (posición recordada en la pestaña).
7. Celular: **Conectar control remoto** → QR privado (nunca se proyecta) → **Aprobar**. Detalle: [`docs/guia-funcion.md`](docs/guia-funcion.md).
8. Respaldo: `npm run exportar:pdf -- --deck=handyx-aticma --version=evento` (diapositivas) y `… --modo=lectura` (texto) → `salida/pdf/`.
   Sin Chromium: abrir `/imprimir/?deck=handyx-aticma&version=evento` y usar Imprimir → Guardar como PDF (16:9, sin márgenes).

## Deploy en Hostinger (Docker)
`./configurar.sh` te pide los datos por consola y genera todo lo que hay que pegar en Hostinger y en GitHub. Ver [`docs/deploy-hostinger.md`](docs/deploy-hostinger.md). Render: [`docs/deploy.md`](docs/deploy.md).

## Comandos
| Comando | Qué hace |
|---|---|
| `npm run verify` | typecheck + pruebas + validación de decks + build (puerta de cada lote) |
| `npm run e2e` | recorrido real en Chromium (presentador, pública, celular, cortes de red) — requiere build |
| `npm run validar` | valida decks, afirmaciones, QR y duraciones |
| `npm run escenarios` | recalcula `docs/handyx/escenarios.md` |
| `npm run qr [-- --comprobar]` | QR públicos SVG/PNG + informe de destinos en `salida/qr/` |
| `npm run exportar:pdf -- --deck=handyx-aticma --version=evento [--modo=lectura]` | PDF de respaldo / documento de lectura |
| `npm run exportar:video -- --version=aticma` | MP4 H.264 del recorrido |
| `npm run paquete:local` | zip para funcionar sin internet |
| `npm run publicar -- --deck=handyx --etiqueta=…` | congela una versión con huella |

## Estructura
`src/core` (esquema, estado, afirmaciones, QR, protocolo: sin marca) · `src/render` · `src/transporte` · `src/vistas` · `src/econ` ·
`server/` (sesiones HTTP+WS) · `brands/<marca>` · `decks/<deck>` · `scripts/` · `e2e/` · `tests/` · `docs/` · `deploy/`.

Continuidad: [`docs/handoff.md`](docs/handoff.md) · Plan: [`docs/plan-fases.md`](docs/plan-fases.md) · Función: [`docs/guia-funcion.md`](docs/guia-funcion.md).
