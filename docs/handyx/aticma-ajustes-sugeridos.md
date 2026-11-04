# Pitch ATICMA 2026 · ajustes sugeridos (no aplicados)

El guion de las notas es **literal** (prompt maestro del 04/11). Estas son propuestas para decidir con Ignacio después del primer
ensayo cronometrado; ninguna está aplicada en el deck.

## 1. Tiempo

400 palabras en 180 s piden ≈ 133 palabras por minuto, sin pausas. A ritmo cómodo de pitch (≈ 140 ppm) entra en 2:51; a 125 ppm
pasa a 3:12. Si el primer ensayo da más de 3:00, recortes que no cambian la voz ni el arco (≈ 30 palabras, ≈ 13 s):

| Diapositiva | Frase | Ahorro | Por qué |
|---|---|---|---|
| 1 | «Buscamos más que conectar: una experiencia fluida, cómoda y con control para ambos.» | 14 palabras | La idea vuelve en el cierre («No queremos solamente conectar personas»). |
| 7 | «No queremos solamente conectar personas. Queremos ayudar a los profesionales a trabajar cada vez mejor.» | 15 palabras | El cierre queda «Hoy empezamos… Mañana queremos arreglar el mundo. Y con ellos…» → cambiar «con ellos» por «juntos». |

## 2. Reparto del tiempo por diapositiva

Los tiempos objetivo del prompt (25/30/22/21/26/26/30) no siguen la cantidad de palabras: la 1 y la 7 quedan apuradas (161 y 176 ppm)
y la 3 holgada (76 ppm). Proporcional a las palabras sería **30 / 28 / 13 / 16 / 27 / 26 / 40 s**. El deck mantiene los del prompt; si
se prefiere el reparto proporcional, se cambia en `versiones[].duraciones` de `decks/handyx-aticma/deck.json` (no toca el guion).

## 3. Precisión (menores)

| Frase | Sugerencia | Motivo |
|---|---|---|
| «General Pueyrredón» | «General Pueyrredon» | Nombre oficial del partido, sin tilde (la pantalla ya lo usa así). Al hablar no cambia nada. |
| «un partido de casi 260 mil hogares» | igual | La pantalla dice 259.623 hogares (Censo 2022). Falta confirmar que la fuente los cuente como **hogares** y no como viviendas ocupadas. |
| «generar cien mil dólares de ingresos brutos» | «…de ingresos brutos propios» | Evita que se confunda con la facturación de los profesionales y con la inversión de USD 100.000. |
| «Algunas plataformas cobran comisión al profesional» | igual | Es exacto y no generaliza (Muovi anuncia comisión cero temporal). |
| «Desarrollé agentes de inteligencia artificial que superviso» | igual | Ya deja claro que hay supervisión humana. |
