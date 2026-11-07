# Ola 5 · Revisión integral · consigna del revisor (independiente)

Revisás la colección completa —tríptico y cuatro dossiers— **como un inversor que la recibe por primera vez** y, a la
vez, como editor y como imprenta. No produjiste ninguna pieza: tu mirada tiene que ser fresca y exigente. No corregís
vos: devolvés hallazgos precisos para que se apliquen.

`S` = `/tmp/claude-0/-home-user/10ab011c-6752-54be-831e-b3c4da2461d0/scratchpad` · repo `/home/user/presentations-studio`

## Material

- PDF y PNG por página de cada pieza: `salida/dossiers/<pieza>/` (después de `python3 -I dossiers/herramientas/empaquetar.py`).
- Fuente de cada pieza: `dossiers/piezas/<pieza>/index.html` (+ `NOTAS.md`).
- Reglas y decisiones: `docs/handyx/pedido-dossiers.md` (§14 reglas, §13 fase 5), `docs/handyx/plan-dossiers.md`
  (decisiones 1–8), `dossiers/diagnostico.md`, `dossiers/arquitectura.md`, `dossiers/direccion-de-arte.md`.
- Para verificar cifras y estados: `decks/handyx-aticma/afirmaciones.json` y `dossiers/auditoria/*.json`.

## Qué mirar

1. **Las preguntas del inversor** (pedido §13, fase 5), pieza por pieza y en conjunto: ¿entiendo qué es Handyx, qué
   problema resuelve, cómo funciona, la oportunidad, cómo gana dinero, qué está hecho y qué falta, para qué necesita
   inversión, y tengo razones para pedir una reunión? Puntaje de 1 a 5 por pregunta, con el porqué.
2. **Verdad:** toda cifra con tipo, fuente y corte, y presente en las fuentes; ningún estado subido respecto de la
   auditoría; nada presentado como existente si es diseño o concepto; ingreso bruto nunca como ganancia; tarifa solo la
   decidida; tracción rotulada «dato informado por el fundador · sin auditar»; nada de IPO, cripto, Silicon Valley ni
   «arreglar el mundo» en el Business.
3. **Coherencia entre piezas:** mismos datos, mismas palabras para las mismas cosas, sin repetir páginas enteras;
   índice, «Cómo leer» y contratapa idénticos salvo lo propio de cada pieza.
4. **Lenguaje:** ortografía, tildes, voseo consistente, palabras prohibidas («matriculados», «despachamos»,
   «inmediato», «al instante», «en minutos»), «Handy» suelto, anglicismos innecesarios, títulos con una palabra sola en
   la última línea.
5. **Seguridad y privacidad:** ninguna pantalla de acceso o configuración, ningún detalle técnico de seguridad, ningún
   nombre real mezclado con muestras, ningún incidente de ejemplo alarmante, rótulo de muestra donde haga falta.
6. **Imprenta:** márgenes y zona segura, nada importante a menos de 5 mm del corte ni de los pliegues del tríptico,
   contraste de texto (sobre todo en amarillo y arena), tamaño mínimo, resolución de imágenes, personajes solo de la
   lista, páginas en múltiplos de 4, tapa y contratapa correctas, QR legible (probalo con `jsqr` sobre la PNG: tiene que
   decodificar `https://landing.handyc.com/handyx/`).
7. **Calidad editorial:** páginas desbalanceadas o vacías, paredes de texto, jerarquía, alineaciones, imágenes
   ilegibles, diagramas confusos. ¿Se siente premium y no una plantilla?

## Entrega

`dossiers/revision/informe.md` y `dossiers/revision/hallazgos.json` con esta forma:

```json
{ "puntaje_inversor": { "<pieza o conjunto>": { "<pregunta>": { "puntaje": 1, "porque": "…" } } },
  "hallazgos": [{ "id": "R-001", "pieza": "01-business", "pagina": 8, "severidad": "bloqueante | importante | menor",
    "tipo": "verdad | coherencia | lenguaje | seguridad | imprenta | editorial",
    "que": "…", "donde": "texto o elemento exacto", "arreglo": "cambio concreto propuesto" }] }
```

Bloqueante = no se puede imprimir así (dato falso o sin fuente, estado subido, algo sensible, error de imprenta).
Respuesta final de 20 líneas como máximo: puntajes, cantidad de hallazgos por severidad y los cinco más importantes.
