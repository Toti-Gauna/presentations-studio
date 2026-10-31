# Biblia visual y de motion (lotes 3.1 y 6.2)

## Identidad (de la landing, sin inventar)
Tokens: azul #1F57A8, amarillo marcador #F5F59A, noche #1D2C4A, tinta #0E1D36, hueso #F7F6F1, mosaico #ECECEC, naranja #F6A623.
Tipografía: Archivo 900 ensanchado (títulos), DM Sans (texto), empaquetadas localmente. `==texto==` = marcador.
Lenguaje: mosaicos grises, botones con base, sin gradientes ni vidrio. Copy aprobado: "Soluciones, no problemas".

## Paletas por acto (tema `brands/handyx/tema.json`)
problema (noche, acento naranja) → encuentro (azul, marcador amarillo) → solución (amarillo, marcador blanco) →
evidencia (blanco) → neutro (hueso) → cierre (tinta). El fondo cambia por CSS (600 ms); nunca lo anima GSAP.

## Personajes
Fuente: `handyx_laminas_individuales_HD.zip` (8 láminas 2×2 sobre verde, 29/10). Recorte: `scripts/recortar_personajes.py`
(chroma key + despill, recorte con margen, WebP con alfa). Poses por lámina: a = reposo · b = saludo · c = festejo · d = acción.

| Personaje | Rol narrativo | Uso en el pitch | Pose d |
|---|---|---|---|
| Foco (bombilla) | Usuario / vecino | apertura → encuentro (continuidad) → cierre | caminar |
| Llave | Especialista | alternativas (reacciona), encuentro (entra y saluda), cierre | esfuerzo |
| Grifo | El problema (pérdida) | apertura | gotea / alarma |
| Gota, engranaje, aire, medidor, brocha | Rubros / plataforma | disponibles; sin función narrativa en el corte ATICMA | — |

Reglas: proporciones y colores de la lámina, sin extremidades nuevas ni deformaciones; actuación por **cambio de pose + transform
moderado** (caminar con rebote, saludo con balanceo ±5°, festejo con salto y sombra). El personaje no se mueve permanentemente: solo
"respira" (1,8 % de escala vertical) en modo completo y se apaga en modo ligero/reducido. Pie apoyado: el origen de transformación es la base.

Acciones disponibles (`accion` por paso): reposo, entrar, salir, saludar, festejar, caminar, mirar, señalar, reaccionar, satisfacción.

## Propiedad de cada propiedad animada
| Elemento | Dueño | Propiedades |
|---|---|---|
| `.escenario` | CSS | fondo, color, escala |
| piezas `[data-paso]` | GSAP (línea de la escena) | opacity/visibility, transform, clip-path |
| `.pj-mov` | GSAP (acciones) | transform |
| `.pj-cuerpo` | CSS (respiración) | transform |
| `.pose` | GSAP (`set`) | opacity |
| contenedor de escena | GSAP (transición) | opacity, x |

## Prueba de personaje (8–12 s) y transición
Apertura (grifo reacciona, foco entra caminando) → encuentro (foco viaja con continuidad, llave entra y ambos saludan).
Comprobado en Chromium: identidad, bordes limpios sobre fondo oscuro y azul, sombra, ida y vuelta sin acumular transformaciones.
Pendiente: revisión en proyector y criterio de la diseñadora.

## Tomas externas (si se producen con Higgsfield u otra herramienta) — paquete por toma
El motor **no depende** de estas tomas: si no llegan, quedan las poses actuales.

| Toma | Referencia | Prompt base | Duración | Encuadre / movimiento | Inicio → fin | Salida | Fallback |
|---|---|---|---|---|---|---|---|
| T1 Foco preocupado | `bombilla-a.webp` | "El personaje foco de la referencia, mismo diseño y colores, mira hacia un grifo que gotea, gesto de preocupación sutil, fondo verde croma plano" | 3 s | plano medio fijo | reposo → preocupado | 1920×1080, fondo verde, 24 fps | pose reposo |
| T2 Encuentro | `bombilla-b` + `llave-b` | "Foco y llave de la referencia se encuentran y se saludan, sin cambiar diseño, fondo verde croma" | 3 s | plano conjunto fijo | separados → saludo | ídem | poses saludo |
| T3 Festejo de cierre | `bombilla-c` + `llave-c` | "Ambos festejan con un salto corto, mismo diseño" | 2 s | fijo | reposo → festejo → reposo | ídem | poses festejo |

Recorte: mismo script de chroma (o MP4 con fondo de la paleta + póster). Safari: siempre MP4 H.264 + póster; no depender de alfa en video.
