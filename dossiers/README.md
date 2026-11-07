# Dossiers y tríptico de Handyx

Material editorial impreso y digital: tríptico institucional y cuatro dossiers (Business & Investment, Customer App,
Professional App y Operations Portal). Plan por olas: `docs/handyx/plan-dossiers.md`.

## Carpetas

- `herramientas/` · scripts de producción.
  - `capturar-lienzo.cjs`: renderiza en PNG (a 2x) los tableros de un lienzo de diseño bajado a disco, con el motor del
    propio lienzo. `node dossiers/herramientas/capturar-lienzo.cjs <lienzo> <salida> [filtro] [escala] [paralelo]`.
  - `inventariar-material.py`: inventario del material del pitch (escenas, capturas, conceptos, personajes, cifras).
- `inventario/` · `material.md` y `material.json` (generados).
- `marca/` · logo vectorial trazado del original de la landing (`logo-handyx.svg` azul #1F57A8 y `logo-handyx-blanco.svg`).

## Fuentes que no van al repo

Las copias de los tres lienzos (app del usuario, app del especialista y portal interno) y su motor se bajan a la carpeta de
trabajo de la sesión con el Artifact tool (`list` + `read`); las capturas se regeneran con `capturar-lienzo.cjs`.

## Herramientas del sistema

`apt-get install -y potrace qpdf ghostscript` (vectorizar, armar y revisar los PDF de imprenta). Playwright y Chromium ya
están en el entorno.

## Reglas

Nada inventado: cada función con su estado (Construido · En pruebas · Diseñado · Concepto) y cada cifra de
`decks/handyx-aticma/afirmaciones.json` con su rótulo. Personajes: solo Foco, Engranaje, Llave y Brocha; Business sobrio.
Sin datos personales reales ni credenciales. Contacto impreso: ignaciogauna.developer@gmail.com · 223 667-4044 ·
landing.handyc.com. QR único: `landing.handyc.com/handyx/` (6 botones: landing, 4 dossiers y portafolio).
