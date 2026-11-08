// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 17,
  "total": 20,
  "pregunta": "¿Piensan en una salida? ¿Una IPO?",
  "respuesta": "Sí, como visión de largo plazo: de pre-seed a seed, serie A y escala con rentabilidad, auditoría y directorio independiente, hasta cotizar en bolsa como MercadoLibre y Globant.",
  "puntos": [
    {
      "ic": "cohete",
      "txt": "**Hoy:** pre-seed"
    },
    {
      "ic": "balanza",
      "txt": "**Escala:** rentabilidad y gobierno"
    },
    {
      "ic": "banco",
      "txt": "**Visión:** IPO"
    }
  ],
  "quien": "bombilla",
  "viz": {
    "tipo": "flujo",
    "items": [
      {
        "ic": "cohete",
        "titulo": "Hoy",
        "txt": "pre-seed en Mar del Plata"
      },
      {
        "ic": "balanza",
        "titulo": "Escala",
        "txt": "rentabilidad, auditoría y directorio"
      },
      {
        "ic": "banco",
        "titulo": "Visión",
        "txt": "IPO, como MercadoLibre y Globant"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
