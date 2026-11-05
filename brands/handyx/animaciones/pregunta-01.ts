// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 1,
  "total": 20,
  "pregunta": "¿Cuál es tu CAC?",
  "respuesta": "Hoy, ≈ {{CAC-ESTIMADO}} por cliente con {{COSTO-MARKETING}} de marketing por mes (supuesto: {{SUP-CLIENTES-MES}} clientes nuevos). El techo es {{CAC-MAXIMO}}: se recupera con el primer trabajo.",
  "puntos": [
    {
      "ic": "cliente-nuevo",
      "txt": "**CAC ≈ {{CAC-ESTIMADO}}**"
    },
    {
      "ic": "alcancia",
      "txt": "**LTV ≈ {{LTV-ESTIMADO}}**"
    },
    {
      "ic": "balanza",
      "txt": "**LTV / CAC ≈ {{LTV-CAC}}**"
    }
  ],
  "quien": "bombilla",
  "viz": {
    "tipo": "cifras",
    "items": [
      {
        "id": "CAC-ESTIMADO",
        "txt": "**CAC** estimado por cliente",
        "contar": {
          "antes": "USD "
        }
      },
      {
        "id": "LTV-ESTIMADO",
        "txt": "**LTV**: lo que deja en 3 años",
        "contar": {
          "antes": "USD "
        }
      },
      {
        "id": "LTV-CAC",
        "txt": "veces: **LTV / CAC**",
        "contar": {}
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
