// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 11,
  "total": 20,
  "pregunta": "¿Por qué invertirían USD 100.000 en Handyx?",
  "respuesta": "Porque el marketing y la IA pueden mover USD 1 millón en trabajos: {{M1-MES}} trabajos por mes, {{M1-CUOTA}} de los arreglos del partido. Es nuestra aspiración, con la cuenta a la vista.",
  "puntos": [
    {
      "ic": "dolar",
      "txt": "**{{META-1M}}** en trabajos"
    },
    {
      "ic": "objetivo",
      "txt": "**{{M1-MES}}** por mes"
    },
    {
      "ic": "crecimiento",
      "txt": "**{{M1-TARIFAS}}** de tarifas"
    }
  ],
  "quien": "grifo",
  "viz": {
    "tipo": "cifras",
    "items": [
      {
        "id": "META-1M",
        "txt": "en trabajos en 12 meses (aspiración)"
      },
      {
        "id": "M1-MES",
        "txt": "trabajos por mes"
      },
      {
        "id": "M1-TARIFAS",
        "txt": "de tarifas para Handyx"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
