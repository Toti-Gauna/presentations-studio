# Ola 1 · Auditoría y capturas · consigna común (07/11/2026)

Cuatro auditorías en paralelo —**usuario**, **especialista**, **portal** y **negocio y repos**— que alimentan el diagnóstico
(ola 2) y después las cinco piezas: tríptico + dossiers 01 Business & Investment, 02 Customer App, 03 Professional App y
04 Operations Portal. **Esta ola no redacta los dossiers**: releva qué existe, en qué estado, con qué evidencia y con qué
imágenes se puede mostrar.

Leé antes de empezar: `docs/handyx/pedido-dossiers.md` (pedido textual de Ignacio: secciones 1–3, la del dossier de tu
superficie y la 14 «Reglas innegociables») y `docs/handyx/plan-dossiers.md` (plan por olas y decisiones de Ignacio).

## Fuentes (todo en disco; solo lectura)

`S` = `/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad`

| Qué | Dónde |
|---|---|
| Lienzos de diseño (copias locales de los Artifacts) | `S/artifacts/{usuario,especialista,portal}/project/` (`canvas.json` + un `.dc.html` por tablero). No leas el HTML crudo salvo una duda puntual: usá los textos. |
| Capturas ya hechas (no hace falta volver a capturar) | `S/capturas/<lienzo>/<tablero>.png` (celulares a 3x, el resto a 2x) · `<tablero>.txt` (texto visible) · `textos.md` (todos los textos en el orden del lienzo, con tamaño y página) · `indice.json` · `hojas/hoja-NN.jpg` (hojas de contacto numeradas, 12 por hoja) |
| Pitch ATICMA (217 imágenes en el orden del PPT) | `S/capturas/pitch/NNN.png` (1920×1080) · `indice.json` (escena y paso) · `hojas/hoja-NN.jpg` (15 por hoja) |
| Personajes que usa cada tablero | `dossiers/inventario/personajes-lienzos.json` (detecta imágenes subidas; si ves un personaje dibujado de otra forma, anotalo) |
| Inventario del material del pitch | `dossiers/inventario/material.md` y `.json` |
| Capturas reales de las PWA (servidor simulado, datos de prueba) | `brands/handyx/assets/capturas/` + `capturas.json` |
| Afirmaciones con fuente, tipo y corte | `decks/handyx-aticma/afirmaciones.json` |
| Repos de producto | `/home/user/<repo>` con `git fetch` del 07/11 a las 19:05. Copia exportada de `origin/main`: `S/repos/<repo>/`. **Mucho trabajo está en ramas sin mergear**: `git -C /home/user/<repo> for-each-ref --sort=-committerdate refs/remotes`, `git log --all`, `git show <rama>:<ruta>`, `git grep <patrón> <rama> -- <ruta>`, `git diff origin/main...<rama> --stat`. Para tener el árbol de una rama: `git -C /home/user/<repo> archive <rama> \| tar -x -C S/repos/<repo>@<rama-con-guiones>`. |

Repos: `Handy-landing-page-fe` (landing + demo + apps por rol), `Handy-landing-page-be` (captura de preregistros y CRM),
`handy-internal-portal` (portal interno), `handyx-client-fe` / `handyx-client-be` (PWA y API del usuario; el BE del usuario
es dueño del contrato compartido), `handyx-specialist-fe` / `handyx-specialist-be` (PWA y API del especialista).
La red a los dominios de Handyx está bloqueada desde este entorno: el estado de publicación sale de los workflows y los
`handoff` de cada repo («sin verificar» si no alcanza).

## Prohibido

- Tocar los repos de producto: nada de `checkout`, `switch`, `commit`, `push`, `worktree`, `stash`, `reset`, `pull` ni
  editar archivos. Solo comandos de lectura (`log`, `show`, `grep`, `diff`, `ls-tree`, `archive` hacia `S/`).
- Publicar, modificar o borrar Artifacts; escribir en GitHub o en Notion.
- Copiar a los informes datos personales reales, credenciales, secretos, valores de variables de entorno, hashes,
  nombres de cookies o encabezados de seguridad, rutas de endpoints administrativos o detalles de autenticación. Se
  describe la función («acceso solo para el equipo, con permisos por tarea»), nunca el mecanismo.
- Inventar. Lo que no está en una fuente va a `faltantes` como pregunta.
- Elegir una versión cuando dos fuentes se contradicen: van las dos a `contradicciones`, con su fuente y fecha.
- Escribir fuera de `dossiers/auditoria/` (y de `S/` para archivos de trabajo). **No hagas commit**: lo hago yo al final.

## Estados (uno por función, siempre con evidencia)

| Estado | Cuándo |
|---|---|
| **Construido** | El código está en `origin/main` del repo y funciona contra el backend real (o es una pieza pública que no lo necesita). Se señala archivo y commit. Si además está publicado, `publicado` lleva la evidencia (workflow, handoff); si no se puede confirmar, `"sin verificar"`. |
| **En pruebas** | Hay código (pantalla y lógica) pero corre con el servidor simulado o datos de prueba, o vive en una rama sin mergear, o depende de un backend que no está en `main`. Todavía no lo usa gente real. |
| **Diseñado** | Está dibujado en el lienzo (pantallas o recorrido) y no hay código. |
| **Concepto** | Idea rotulada como futura («después del deploy», «borrador», «propuesta», exploración descartada) o que solo aparece en el pitch o en un plan, sin diseño completo. |

Si una función tiene partes en estados distintos, va en filas separadas. `horizonte`: «lanzamiento 10/11», «posterior al
lanzamiento», «sin fecha» o «sin dato», solo según lo que diga la fuente.

## Reglas para todo lo que escribas

- Español rioplatense con voseo. Nombre público **Handyx**; a quienes trabajan, «especialistas» (o «profesionales» en el
  lenguaje del pedido); los Handys son los personajes.
- «Verificado» solo con un dato real que lo respalde; nunca «matriculados», «despachamos», «inmediato», «al instante» ni
  «en minutos». Montos con el formato `$ 45.000`.
- Personajes permitidos en las piezas: **Foco, Engranaje (la tuerca), Llave y Brocha** (y sus versiones «rotas» de los
  errores). Canilla, Gota, el grupo y cualquier otro: se marcan como riesgo en la captura que los muestre.
- Cifras que aparecen en pantallas de muestra (métricas, precios, nombres de personas) son **ficticias**: cada captura que
  las muestre lleva el riesgo «cifra/nombre de muestra que puede leerse como real».
- Diseños de producto: no se modifican; se documentan tal cual y, si algo conviene mejorar, va como recomendación.

## Qué entregar

1. `dossiers/auditoria/<superficie>.md` — informe legible (resumen, mapa de módulos, tabla de funciones por estado,
   recorridos de punta a punta, contradicciones, faltantes, capturas recomendadas, riesgos). Directo, sin relleno.
2. `dossiers/auditoria/<superficie>.json` — los mismos datos con esta forma (las superficies de producto):

```json
{
  "superficie": "usuario | especialista | portal",
  "corte": "2026-11-07",
  "fuentes": [{ "id": "client-fe@ca04340", "tipo": "lienzo | repo | pitch | notion | doc", "ref": "…", "fecha": "AAAA-MM-DD" }],
  "modulos": [{ "id": "P", "nombre": "Pedir", "tableros": ["P-….dc.html"], "resumen": "una oración" }],
  "funciones": [{
    "id": "U-P-01", "modulo": "P", "nombre": "…", "que_hace": "una oración, en lenguaje de la persona",
    "estado": "Construido | En pruebas | Diseñado | Concepto", "horizonte": "…", "publicado": "sí: <evidencia> | no | sin verificar",
    "evidencia": [{ "fuente": "lienzo | repo | pitch | doc", "ref": "archivo o repo@sha:ruta", "dice": "cita corta" }],
    "tableros": ["…"], "notas": "…"
  }],
  "recorridos": [{
    "id": "U-R-01", "titulo": "…", "necesidad": "qué necesita la persona", "accion": "qué hace en la app",
    "que_hace_handyx": "qué pasa dentro de Handyx", "resultado": "qué obtiene",
    "pasos": [{ "n": 1, "tablero": "RC-….dc.html", "pantalla": "….dc.html", "texto": "…" }],
    "estado": "…", "captura_principal": "…png"
  }],
  "indice_dossier": [{ "seccion": "5. Registro y onboarding", "cubre": ["U-A-01"], "capturas": ["…png"], "huecos": "…" }],
  "contradicciones": [{ "tema": "…", "a": { "dice": "…", "fuente": "…", "fecha": "…" }, "b": { "dice": "…", "fuente": "…", "fecha": "…" }, "impacto": "…", "pregunta": "…" }],
  "faltantes": [{ "dato": "…", "para": "dossier NN · sección", "pregunta": "…" }],
  "capturas_recomendadas": [{
    "png": "S/capturas/…/….png", "tablero": "…", "uso": "dossier NN · sección", "rotulo": "Diseño propuesto | Pantalla de la PWA · datos de prueba | Muestra · datos ficticios | Concepto",
    "recorte": null, "px": "ancho×alto", "personajes": ["foco"], "riesgos": ["…"], "motivo": "por qué es la mejor para eso"
  }],
  "riesgos_de_publicacion": [{ "que": "…", "donde": "…", "recomendacion": "…" }]
}
```

`indice_dossier` recorre **todas** las secciones del dossier de tu superficie tal como las lista el pedido (sección 6, 7
u 8) y dice qué funciones y capturas la cubren y qué falta. Recortes: si una pieza conviene recortada (un celular de un
recorrido), dejá las coordenadas en `recorte` (`x,y,ancho,alto` en píxeles de la PNG) o generá el PNG en
`S/capturas/<lienzo>/recortes/` con PIL.

## Cómo trabajar

- Empezá por `textos.md` y las hojas de contacto; abrí una captura individual solo para confirmar o para elegirla.
- Cruzá cada módulo con el código: rutas y pantallas reales, mocks, contratos, `docs/handoff.md`, planes y ramas activas.
- Priorizá cobertura completa con evidencia breve antes que prosa larga.
- Al terminar respondé con un resumen corto (25 líneas como máximo): funciones por estado, los hallazgos más
  importantes, contradicciones, faltantes críticos y rutas de los archivos.
