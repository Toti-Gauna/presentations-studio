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
- **Handyx v1 institucional** (`deck=handyx`): `aticma` (180 s), `corta` (60 s), `angel` (≈ 6 min), `vc` (≈ 9 min).
- **Handyx v2 comercial** (`deck=handyx-v2`, mismas cifras): `comercial` (≈ 5 min), `marca-marketing` (2 min), `anuncios` (reel).

## Comandos
| Comando | Qué hace |
|---|---|
| `npm run verify` | typecheck + pruebas + validación de decks + build (puerta de cada lote) |
| `npm run e2e` | recorrido real en Chromium (presentador, pública, celular, cortes de red) — requiere build |
| `npm run validar` | valida decks, afirmaciones, QR y duraciones |
| `npm run escenarios` | recalcula `docs/handyx/escenarios.md` |
| `npm run qr [-- --comprobar]` | QR públicos SVG/PNG + informe de destinos en `salida/qr/` |
| `npm run exportar:pdf -- --version=aticma [--modo=lectura]` | PDF de respaldo / documento de lectura |
| `npm run exportar:video -- --version=aticma` | MP4 H.264 del recorrido |
| `npm run paquete:local` | zip para funcionar sin internet |
| `npm run publicar -- --deck=handyx --etiqueta=…` | congela una versión con huella |

## Estructura
`src/core` (esquema, estado, afirmaciones, QR, protocolo: sin marca) · `src/render` · `src/transporte` · `src/vistas` · `src/econ` ·
`server/` (sesiones HTTP+WS) · `brands/<marca>` · `decks/<deck>` · `scripts/` · `e2e/` · `tests/` · `docs/` · `deploy/`.

Continuidad: [`docs/handoff.md`](docs/handoff.md) · Plan: [`docs/plan-fases.md`](docs/plan-fases.md) · Función: [`docs/guia-funcion.md`](docs/guia-funcion.md).
