# Ola 7 · Pulido premium de los cuatro dossiers (08/11/2026)

Pedido de Ignacio, textual en lo esencial:

> «Los dossiers están bien, pero tienen que ser más estéticos: que a la vista te digan "wow, mirá lo que es esta
> aplicación, mirá los diseños que tiene". Que se sientan súper premium. Que un inversor lo vea y diga "está
> buenísimo, qué ganas de invertir". Podés crear SVGs premium y mejorar la colorimetría, manteniendo la de Handyx. En
> vez de mostrar las imágenes del panel de admin así como están, mostrá SVGs de qué se hace con cada cosa: cómo
> conectamos a dos personas, etc. Que se sienta menos *AI slop*.»

No es rehacer el contenido: **la estructura, los textos revisados, los estados, los rótulos y las reglas de
`consigna-ola-6.md` siguen valiendo** (y sin personajes Handys). Es una pasada de dirección de arte página por página.

## Qué cambia

1. **Escenas ilustradas** (`plantilla/escenas.js`, nuevo): `<div data-escena="conectar|propuestas|verificar|pago|obra|barrios|reclamo|camino|equipo|agenda" data-tono="claro|oscuro"></div>`
   (viewBox 400 × 240, ancho libre; `data-fondo="no"` saca el círculo de fondo). Personas sin cara, planos de color de la
   marca, un acento amarillo. Mirá `plantilla/prueba-escenas.html` renderizada. Usalas en aperturas de capítulo, en las
   páginas que explican un concepto (cómo conectamos, cómo se paga, cómo validamos, una obra, el camino, los reclamos,
   el mapa por barrio) y para reemplazar capturas que no aportan. Si una escena que necesitás no existe, podés dibujar
   una nueva en tu `<style>`/`<script>` con el mismo lenguaje (no edites `escenas.js`; anotalo en el informe).
2. **UI despiezada** (la mayor fuente de «wow»): en vez de muchas pantallas chicas iguales, elegí en cada capítulo 1–2
   pantallas y mostralas **despiezadas**: el teléfono grande y, flotando alrededor, recortes reales ampliados de sus
   componentes (la tarjeta de propuesta, el precio orientativo, el sello, el chat, el resumen de la obra) con sombra
   suave sobre un fondo de color (`.despiece`, `.flota` en `premium.css`). Los recortes salen de las capturas
   (`S/capturas/...` a 1170 px de ancho para el celular: recortá con Pillow y guardá en tu `img/`, lossless o q 94).
   Para explicar partes, usá `.guia` (etiqueta con línea guía) en lugar de muchos números.
3. **Dossier 04 (portal)**: Ignacio pidió explícitamente no mostrar el panel «así como está». Dejá **una** notebook
   protagonista (tapa o apertura) y reemplazá el resto de las notebooks por escenas (`barrios`, `reclamo`, `equipo`,
   `conectar`, `verificar`, `agenda`) o por despieces de un componente puntual (una tarjeta de reclamo, un indicador)
   ampliado y legible. Cada módulo: qué hace, para quién, en una escena + 2 líneas.
4. **Ritmo editorial**: menos elementos por página y más aire. Alterná páginas de imagen grande (una escena o un despiece
   a página completa con un titular) con páginas de lectura. Máximo un bloque de chips de estado por página; los estados
   pueden ir como texto chico («En pruebas») junto al título de la función.
5. **Color**: misma paleta (azul #1F57A8, profundo #143E7E, medio #2C66B8, navy #0E1D36, amarillo #F5F59A, cielo #E9EFF9,
   hueso #F7F6F1, arena #F3F0E8). Fondos llenos: podés sumar la clase `.grano` (grano de papel sutil) a una capa de fondo
   para que no se vea plano. Nada de degradés de colores fuera de la paleta.
6. Los puntos `.toque` ya cambiaron de estilo (navy chico con aro blanco); revisá que sigan cayendo justo.

## Cómo trabajar

- Pieza: `dossiers/piezas/<tu pieza>/index.html` (+ `img/`, `NOTAS.md`). Agregá `<script src="../../plantilla/escenas.js"></script>` antes de `pieza.js`.
- Mismas páginas que hoy (01 = 24, 02 = 24, 03 = 28, 04 = 20) salvo que una página sobre o falte: siempre múltiplo de 4.
- Revisá cada página renderizada (`node dossiers/herramientas/vista-rapida.cjs …`) y exportá al final con **0 errores**:
  `node dossiers/herramientas/exportar-pieza.cjs dossiers/piezas/<pieza>/index.html S/ola7/<pieza> <Nombre>`.
- No hagas commit ni push. No edites `plantilla/`. Informe corto: qué cambiaste por página, escenas usadas, despieces
  hechos y cualquier duda.
