# Ola 3 · Producción de los dossiers · consigna común (07/11/2026)

Cada agente produce **un dossier completo, listo para imprenta**, sobre la plantilla común. Ignacio aprobó la muestra
visual: la dirección de arte no se discute, se aplica con oficio. Nivel buscado: material de una startup que se prepara
en serio para buscar inversión, no un PDF de plantilla.

`S` = `/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad` · repo: `/home/user/presentations-studio`

## Leé primero (en este orden)

1. `docs/handyx/pedido-dossiers.md`: la sección de tu dossier, §11 (requisitos editoriales) y §14 (reglas innegociables).
2. `docs/handyx/plan-dossiers.md`: decisiones de Ignacio 1–8 (tarifa, QR, tracción, tono). Mandan sobre cualquier fuente.
3. `dossiers/diagnostico.md` y `dossiers/arquitectura.md` (tu tabla, página por página).
4. `dossiers/direccion-de-arte.md`, `dossiers/plantilla/base.css`, `dossiers/plantilla/paginas-comunes.html` (p. 2 y
   contratapa) y las muestras de las cinco piezas en `dossiers/piezas/*/index.html` (para que la tuya sea parte de la misma
   colección).
5. Tu auditoría: `dossiers/auditoria/<superficie>.json` (funciones con estado y evidencia, recorridos, capturas
   recomendadas con riesgos) y su `.md`.

## Dónde trabajás

- **Solo** dentro de `dossiers/piezas/<tu-pieza>/`: `index.html`, `img/`, `imagenes.json` y `NOTAS.md`. No toques
  `plantilla/`, `marca/`, `herramientas/`, `auditoria/`, las otras piezas ni nada fuera de esa carpeta. Si necesitás un
  componente nuevo, va en el `<style>` de tu pieza y lo anotás en `NOTAS.md`.
- Partís del `index.html` de tu pieza (tapa y doble página de muestra): esas páginas se quedan (podés pulirlas sin
  cambiar su dirección) y agregás todas las demás en el orden de la arquitectura. Al final, sacá los `data-folio`: la
  numeración automática tiene que coincidir con la posición.
- No hagas commit: lo hago yo.

## Imágenes

- Capturas de los lienzos: `S/capturas/<lienzo>/<tablero>.png` (celulares a 3x, el resto a 2x), con texto en
  `<tablero>.txt` y hojas de contacto en `hojas/`. Recortes ya hechos en `S/capturas/<lienzo>/recortes/`.
- Capturas reales de las apps (vista de prueba): `brands/handyx/assets/capturas/*.webp` (`capturas.json` las describe).
  Portal v2 en código: `S/repos/portal-capturas-v2/docs/capturas-v2/MOCK-*.jpg`.
- Para usar una imagen: sumala a tu `imagenes.json` (con `recorte` si hace falta) y corré
  `python3 -I dossiers/herramientas/preparar-imagenes.py dossiers/piezas/<p>/imagenes.json S/capturas dossiers/piezas/<p>/img`.
- Personajes: solo `dossiers/marca/personajes/*.svg` (Foco = bombilla, Engranaje, Llave, Brocha) según tu pieza. Ninguna
  captura con Canilla, Gota o el grupo (`dossiers/inventario/personajes-lienzos.json`): usá los recortes o las
  alternativas de tu auditoría. Logo: `dossiers/marca/logo-handyx(-blanco).svg`. QR: `dossiers/marca/qr-hub.svg`.

## Reglas de contenido (sin excepciones)

- **Estado de cada función tal como lo dice tu auditoría.** Nunca se sube un estado. Si una página mezcla, cada fila o
  figura lleva el suyo.
- **Cada imagen con rótulo** (`figure.con-rotulo` + `.rotulo`): «Diseño propuesto», «Pantalla de la PWA · datos de
  prueba», «Pantalla del portal v2 · datos de muestra», «Muestra · datos ficticios», «Concepto». Si una captura muestra
  nombres o cifras que pueden leerse como reales, el rótulo lo dice.
- **Cada cifra con tipo, fuente y corte** (`.tipo-dato` + `.fuente`). Solo cifras de `decks/handyx-aticma/afirmaciones.json`,
  de tu auditoría o del diagnóstico. Ingreso siempre «bruto, antes de costos». Lo que falta: «[a definir]».
- **Tarifa:** especialista sin comisión; usuario 0 % hasta el 10/12/2026 y después 15 % «en evaluación». Ninguna otra.
- **Contradicciones:** no se imprimen como tales; se usa la versión decidida o una redacción neutra que no afirme lo que
  está en duda (p. ej. «verificación de identidad y antecedentes a cargo del equipo», sin el medio).
- **Nunca:** pantallas de acceso o seguridad (Login, RC-Acceso, D6-TOTP, D6-Login2FA), mecanismos de autenticación,
  permisos técnicos, variables, endpoints, nombres reales mezclados con muestras, incidentes de ejemplo alarmantes
  («pérdida de gas sin resolver»), «Handy» como nombre de la app en texto propio.
- **Lenguaje:** español rioplatense; voseo cuando le hablás a quien lee en los dossiers de producto («contás qué pasa»);
  el Business, en primera persona del plural o impersonal. «Especialistas»; nunca «matriculados», «despachamos»,
  «inmediato», «al instante», «en minutos»; «verificado» solo como proceso, no como logro. Montos `$ 45.000`; USD solo
  en el Business y rotulado.

## Reglas de forma

- **Páginas exactas** de la arquitectura (20 · 20 · 20 · 16). p. 1 tapa (ya está), p. 2 índice y «Cómo leer» (copia de
  `paginas-comunes.html`, con tus secciones en `<a data-ir="id">`), anteúltima cierre, última contratapa (copia de
  `paginas-comunes.html`: fondo del color de tu tapa —`tapa-clara` si es claro—, tu personaje y tu pieza `.actual`).
- **Cada página de contenido:** ceja con el número de sección del pedido, `h1` con **una** palabra marcada, bajada,
  evidencia (capturas, tabla de funciones con estado, diagrama o cifras) y línea `.fuente` al pie con «Estado al
  07/11/2026» y las fuentes. Cabecera y folio en todas menos tapa y contratapa.
- **Equilibrio:** ninguna página con más de un tercio vacío ni con paredes de texto (unas 220 palabras corridas como
  máximo, sin contar tablas). Las páginas enfrentadas (par | impar) se componen como doble página, en espejo.
- **Diagramas:** HTML/CSS (`.nodo`, `.conector`, `.flujo`, `.tabla`, `.paso`) o SVG en línea con la paleta (trazos
  navy de 0,35–0,45 mm, rellenos azul, acentos amarillos) y texto DM Sans de 6,5 pt o más. Nada de capturas 16:9 del pitch.
- **Recorridos de punta a punta** (necesidad → acción → qué hace Handyx → resultado) con `.flujo` donde la arquitectura
  los pide.

## Control de calidad (obligatorio antes de terminar)

1. `node dossiers/herramientas/exportar-pieza.cjs dossiers/piezas/<p>/index.html S/produccion/<p> <p>` hasta **0
   errores** (los avisos de ppp por encima de 200 se aceptan).
2. Revisá **todas** las páginas: hoja de contacto con
   `montage S/produccion/<p>/<p>-paginas/pagina-*.png -tile 4x -geometry 560x792+8+8 -background '#4d5568' S/produccion/<p>/hoja.jpg`
   y abrila; después abrí a tamaño completo cada página que dude (como mínimo, tres). Corregí superposiciones,
   huecos, alineaciones, títulos con una palabra sola en la última línea, imágenes chicas o ilegibles.
3. Leé el texto completo una vez buscando: cifras sin rótulo, estados mal puestos, palabras prohibidas, tuteo,
   «Handy» suelto, nombres de muestra sin rótulo, repeticiones entre páginas.

## Entrega

`index.html` completo, `img/`, `imagenes.json` y `NOTAS.md` (lista de páginas con su sección; fuentes; pendientes
«[a definir]»; desvíos de la arquitectura con su razón; componentes nuevos). Respuesta final de 20 líneas como máximo:
páginas, estado del control, pendientes y decisiones que tomaste.
