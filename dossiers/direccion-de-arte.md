# Dirección de arte · Colección Handyx (ola 2)

La colección parte del «Sistema visual Handyx» de los lienzos (azul para actuar, amarillo para destacar, navy para leer;
Archivo ancho para títulos, DM Sans para leer) y lo lleva al papel con criterio editorial. La muestra aprobable está en
`dossiers/piezas/*/index.html` (tapas, una doble página por dossier y las dos caras del tríptico); todo lo demás se
construye igual.

## Principios

1. **Cada página tiene una razón y un mensaje.** Un título que afirma (con una sola palabra marcada en amarillo), una
   bajada que lo explica y la evidencia: capturas, tabla de funciones con estado o una cifra con su fuente.
2. **La honestidad es parte del diseño.** Chips de estado (Construido · En pruebas · Diseñado · Concepto), rótulo en
   cada imagen, tipo de dato en cada cifra y una línea de fuente al pie. Se muestran como un sistema, no como letra chica.
3. **Producto real, no ilustraciones de producto.** Solo capturas de los lienzos y de las apps, dentro de un celular con
   proporción real o de un navegador mínimo. Nada generado por IA, nada inventado.
4. **Aire y jerarquía.** Mucho blanco, grilla de 12 columnas, una idea por bloque. Si no entra, se divide, no se achica.

## Formato y grilla

- A4 vertical (210 × 297 mm) para los dossiers; A4 apaisado para el tríptico (paneles de 97 / 100 / 100 mm por fuera y
  100 / 100 / 97 mm por dentro; el de 97 mm es la solapa que se pliega hacia adentro).
- Márgenes: 18 mm a los lados, 22 mm arriba (cabecera a 10 mm) y 21 mm abajo (folio a 10 mm). Tapas: 16 / 15 / 14 mm.
- Grilla de 12 columnas con 5 mm de calle (`.grilla` + `.c-N`). Espaciado vertical en pasos de `.esp-1` (2 mm) a
  `.esp-5` (16 mm).
- Sangrado de 3 mm: los fondos de color y las imágenes que tocan el borde usan `.a-sangre` / `.fondo-tapa` /
  `.permite-salir`; el resto queda dentro de la caja.
- Dobles páginas: los pares enfrentados (par a la izquierda, impar a la derecha) se componen en espejo; ver Customer
  10 | 11 y Professional 10 | 11.

## Tipografía

| Uso | Estilo |
|---|---|
| Título de tapa | Archivo 900 al 125 %, 40–47 pt, interlineado 0,93 |
| Título de página (`h1`) | Archivo 900 al 125 %, 27 pt, una palabra marcada (`<mark>`) |
| Subtítulo (`h2`) | Archivo 800 al 112,5 %, 15 pt |
| Bajada | DM Sans 12,2 pt / 1,42 |
| Texto | DM Sans 9,6 pt / 1,46 |
| Tablas | DM Sans 8 pt; encabezados 6,3 pt en mayúsculas espaciadas |
| Cifras | Archivo 900 al 125 %, 17–40 pt, números tabulares |
| Ceja, rótulos y chips | DM Sans 750–800, 5,9–6,8 pt, mayúsculas espaciadas |

Nada por debajo de 5,5 pt (el control lo bloquea). Fuentes estáticas embebidas como TrueType; los símbolos que no
tienen (→ ✓ ≠ ≈) salen de «Símbolos Handyx».

## Color y personalidad de cada pieza

Paleta común: navy `#0E1D36` (leer), azul `#1F57A8` (actuar), amarillo `#F5F59A` (destacar), cielo `#E9EFF9`, arena
`#F3F0E8`, hueso `#F7F6F1`, verde `#137140` y rojo `#B3261E` (solo estados). Cada pieza tiene un acento:

| Pieza | Tapa | Acento | Personajes |
|---|---|---|---|
| Tríptico | Azul con el Inicio de la app y el Foco | azul + amarillo | Foco, Llave, Engranaje y Brocha (chicos) |
| 01 Business & Investment | Navy con el mapa de líneas de Mar del Plata (OpenStreetMap) | navy, sobrio | Ninguno (a lo sumo uno en la contratapa) |
| 02 Customer App | Azul con el celular y el Foco | azul | Foco |
| 03 Professional App | Amarillo con el celular, la Llave y la Brocha | navy sobre amarillo | Llave y Brocha |
| 04 Operations Portal | Arena con la barra lateral azul del portal y el Engranaje | azul medio y arena | Engranaje |

Personajes: solo las poses vectoriales de `dossiers/marca/personajes/` (la brocha-d queda en raster, `brands/handyx/assets/personajes/`).
Nunca Canilla ni Gota, ni en capturas.

## Componentes (en `plantilla/base.css`)

- **Tapa** (`.tapa`, `.fondo-tapa`, `.tapa-serie`, `.tapa-titulo`, `.tapa-bajada`, `.tapa-pie`): logo, «Colección
  Handyx · Dossier 0N de 04», filete amarillo, numeral, título con una palabra marcada, bajada, pie con edición y corte.
- **Página** (`.pagina > .lamina > .cabecera + .caja + .folio`): ceja con el número de sección, `h1`, bajada.
- **Estados** (`.estado.construido|en-pruebas|disenado|concepto`) con ícono y texto; `.leyenda-estados`.
- **Rótulos de imagen** (`.rotulo.diseno|prueba|muestra|concepto`) arriba de cada figura (`figure.con-rotulo`).
- **Fuente** (`.fuente`) y **tipo de dato** (`.tipo-dato`) en cada cifra.
- **Dispositivos:** `.celular` (proporción 390 × 844, marco navy), `.escritorio` (barra mínima), `.cuadro`.
- **Datos:** `.tabla`, `.tarjeta` (`.remaches`, `.acento`), `.cifra`, `.flujo` (necesidad → acción → qué hace Handyx →
  resultado), `.paso`, `.nodo` y `.conector` para diagramas, `.idea`, `.indice`, `.contacto`, `.qr`.
- **Tríptico:** `.paneles.exterior|interior`, `.panel` con `.fondo` a sangre.

## Capturas

- Del lienzo: PNG a 3x (celulares) o 2x (resto), pasadas a WebP sin pérdida con `herramientas/preparar-imagenes.py`
  (manifiesto `imagenes.json` en cada pieza). Recortes para sacar personajes no permitidos o datos sensibles.
- Rótulos: «Diseño propuesto» (lienzo), «Pantalla de la PWA · datos de prueba», «Pantalla del portal v2 · datos de
  muestra», «Muestra · datos ficticios», «Concepto».
- Resolución en el papel: mínimo 150 ppp, ideal 220 o más (el exportador avisa y corta).

## Imprenta

- `node dossiers/herramientas/exportar-pieza.cjs <pieza.html> <salida> <nombre>` genera el PDF de imprenta (con 3 mm
  de sangrado, TrimBox y BleedBox), el PDF digital liviano con enlaces y una PNG por página; corta si hay desbordes,
  texto chico, imágenes con poca resolución o fuentes ajenas.
- Recomendación: dossiers con grapa a caballete (20 y 16 páginas), interior en ilustración mate de 150 g y tapa de
  250–300 g; tríptico en ilustración mate de 170 g, plegado envolvente. Color: RGB (imprentas digitales); pedir prueba
  de color antes de una tirada grande.
