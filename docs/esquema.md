# Contrato de contenidos (versión de esquema 1)

Fuente: `src/core/esquema.ts` (Zod) + validación cruzada `src/core/validar.ts`. Cambios incompatibles suben `versionEsquema`
y requieren migración.

- **Deck** `decks/<id>/deck.json`: `versionEsquema`, `id`, `titulo`, `tema`, `corte`, `estado` (`borrador` admite QR provisorios; `final` no),
  `versiones[]` (`escenas`, `anexos`, `duracionObjetivo`, `tolerancia`, `duraciones` por escena, `movimiento` por defecto:
  `completo|ligero|reducido`; `reducido` = modo evento estático, `?movimiento=` lo reemplaza), `recursos[]` (procedencia, licencia,
  estado `final|temporal|faltante`), `escenas[]`.
- **Escena**: `id`, `titulo`, `disposicion` (`centro|dividido|izquierda|grilla|cierre`), `paleta`, `duracion`, `pasos`, `elementos[]`,
  `transicion` (`corte|fundido|deslizar|continuidad`), `clasificacion`, `objetivo`, `guion`, `notas` (privadas), `lectura` (PDF autónomo),
  `referencias`, `respaldo`, `preguntas`.
- **Elemento** (`tipo`): `titulo`, `texto`, `etiqueta`, `cifra` (una afirmación), `lista`, `flujo`, `grafico` (barras), `tabla`, `qr`,
  `personaje` (acciones por paso, continuidad), `imagen`, `video`. Comunes: `id`, `paso` de aparición, `area`
  (`arriba|centro|abajo|izquierda|derecha|fondo|libre`+`pos`), `entrada` (`ninguna|fundido|subir|escala|mascara|palabras|contar`).
  Texto: `==resaltado==`, `**fuerte**`, `{{AFIRMACION}}`.
- **Afirmación** `afirmaciones.json`: `id`, `descripcion`, `valor` (null = desconocido), `unidad`, `periodo`, `tipo`
  (`observado|informado|supuesto|proyeccion|meta`), `fuente`, `pagina`, `url`, `corte`, `verificacion`, `formula`, `dependencias`, `uso` (`publico|anexo|notas`), `formato`.
- **QR público** `qr.json`: `id`, `etiqueta`, `modo` (`directo` | `estable` + `urlEstable`), `destinos` {A, B}, `activo`, `campania` (UTM), `textoCorto`, `definitivo`.
- **Tema** `brands/<id>/tema.json`: fuentes, colores, `paletas` (debe existir `neutro`; `marcador`, `marcadorTinta` opcionales), radios, `personajes` (4 poses), `pie`.

Reglas que el validador hace cumplir: ids únicos, paletas/personajes/recursos/QR existentes, pasos dentro de rango, una pieza por área,
afirmaciones de notas o sin valor no salen en pantalla, cero observado requiere verificación, duración ≤ objetivo + tolerancia.

Navegación con anexos: el estado recibe `forma.principales` (cantidad de escenas del recorrido). Avanzar (siguiente, escena siguiente,
clicker, celular) nunca entra a los anexos; solo `ir` (índice, menú del celular, Mayús + letra en el presentador). Retroceder sí puede
volver desde un anexo. El servidor conserva `principales` al crear la sesión.
