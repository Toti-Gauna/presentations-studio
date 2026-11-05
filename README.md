# Presentations Studio

Motor web de **presentaciones dirigidas en vivo**: escenario 16:9, vista del presentador, control desde el celular por QR
privado, QR públicos A/B, cifras rotuladas desde una única fuente, respaldo PDF/MP4/local. Primer caso: el pitch de **Handyx**
para ATICMA 2026. Después: producto **Eclipse** (presentaciones creadas con Claude, sin editor).

## Uso rápido
```sh
npm ci
npm run dev                      # http://localhost:5173/ → lanzador (sin control remoto)
npm run build && SERVIR_ESTATICOS=dist npm run servidor   # http://localhost:8787/ con control remoto (red local)
```
Hub (`/`): elegí presentación y versión. Presentador: `/presentador/?deck=handyx&version=aticma` · Pantalla pública: `/presentar/?deck=…`.
- **Handyx ATICMA 2026** (`deck=handyx-aticma&version=evento` o `estatica`): siete diapositivas (180 s) con el guion de Ignacio, modo de
  ensayo, cierre con el clip del mundo, 28 láminas de respaldo (proyección, costos, CAC/LTV, competencia, marca, herramientas, plan mes a
  mes, inversión, USD 1 M / 5 M, Business, maneras de multiplicar ingresos, tesorería, IPO) y 18 posibles preguntas del jurado. Ver [`docs/handyx/aticma-validacion.md`](docs/handyx/aticma-validacion.md).
- **Handyx v1 institucional** (`deck=handyx`): `aticma` (180 s), `corta` (60 s), `angel` (≈ 6 min), `vc` (≈ 9 min).
- **Handyx v2 comercial** (`deck=handyx-v2`, mismas cifras): `comercial` (≈ 5 min), `marca-marketing` (2 min), `anuncios` (reel).

## Ensayar y presentar el pitch ATICMA
1. Presentador: `/presentador/?deck=handyx-aticma&version=evento` (o el hub). **Abrir pantalla pública** → proyector → **F**.
2. Ensayo: **▶ Reloj** (R) · → / espacio / clicker · **■ Finalizar** registra el tiempo y el de cada diapositiva · **Nuevo ensayo** vuelve
   a cero sin recargar · **N** oculta notas. Las notas muestran tramo, guion y próxima transición.
3. Avanzar nunca entra a los anexos: **número + Enter** abre cualquier lámina (Esc cancela), **Mayús + letra** los primeros 24 anexos
   (sin N ni R), también el índice o el menú ☰ del celular; **0** vuelve. Diapositiva 7: → en «Hoy empezamos en Mar del Plata» arranca el
   clip del mundo (para que suene, un clic o F en la pantalla pública antes de empezar).
4. Refrescar el presentador no vuelve al inicio. Sin animaciones: `version=estatica`. Celular: Conectar control remoto → QR privado → Aprobar.
5. Contingencia: `npm run build && npm run exportar:pdf -- --deck=handyx-aticma --version=evento` y
   `npm run exportar:pptx -- --deck=handyx-aticma --version=evento` (python-pptx) → `salida/`.

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
| `npm run exportar:pptx -- --deck=handyx-aticma --version=evento` | PPTX de contingencia (imágenes + notas del orador) |
| `npm run exportar:video -- --version=aticma` | MP4 H.264 del recorrido |
| `npm run paquete:local` | zip para funcionar sin internet |
| `npm run publicar -- --deck=handyx --etiqueta=…` | congela una versión con huella |

## Estructura
`src/core` (esquema, estado, afirmaciones, QR, protocolo: sin marca) · `src/render` · `src/transporte` · `src/vistas` · `src/econ` ·
`server/` (sesiones HTTP+WS) · `brands/<marca>` · `decks/<deck>` · `scripts/` · `e2e/` · `tests/` · `docs/` · `deploy/`.

Continuidad: [`docs/handoff.md`](docs/handoff.md) · Plan: [`docs/plan-fases.md`](docs/plan-fases.md) · Función: [`docs/guia-funcion.md`](docs/guia-funcion.md).
