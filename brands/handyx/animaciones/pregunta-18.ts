// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 18,
  "total": 20,
  "pregunta": "¿Cómo consiguen los materiales los profesionales?",
  "respuesta": "Hoy cada profesional los compra por su cuenta. Queremos conectar Handyx con las ferreterías y los corralones del barrio: el profesional ve qué materiales necesita y dónde hay stock cerca, los reserva y los retira camino al trabajo. Es una visión a explorar, sin alianzas firmadas.",
  "puntos": [
    {
      "ic": "tienda",
      "txt": "**Stock** en ferreterías cercanas"
    },
    {
      "ic": "ruta",
      "txt": "**Retira** camino al trabajo"
    },
    {
      "ic": "crecimiento",
      "txt": "**Otra fuente** de ingresos"
    }
  ],
  "quien": "gota",
  "viz": {
    "tipo": "flujo",
    "items": [
      {
        "ic": "tienda",
        "titulo": "Stock",
        "txt": "en ferreterías cercanas"
      },
      {
        "ic": "ruta",
        "titulo": "Retira",
        "txt": "camino al trabajo"
      },
      {
        "ic": "crecimiento",
        "titulo": "Otra fuente",
        "txt": "de ingresos, a explorar"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
