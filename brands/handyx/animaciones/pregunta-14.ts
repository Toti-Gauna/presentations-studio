// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 14,
  "total": 20,
  "pregunta": "¿Hasta dónde puede crecer Handyx?",
  "respuesta": "Con 72 profesiones y Handyx for Business, aspiramos a {{META-5M}} de ingresos a fines de 2027: ≈ USD 3,5 M de personas y ≈ USD 1,56 M de comercios que contratan personal por turnos.",
  "puntos": [
    {
      "ic": "usuarios",
      "txt": "**For People** · {{P-INGRESOS}}"
    },
    {
      "ic": "tienda",
      "txt": "**For Business** · {{B-INGRESOS}}"
    },
    {
      "ic": "ia",
      "txt": "**Con IA:** apps para cada comercio"
    }
  ],
  "quien": "medidor_gas",
  "viz": {
    "tipo": "barras",
    "total": "TOTAL-5M",
    "items": [
      {
        "id": "P-INGRESOS-N",
        "txt": "Handyx for People · 72 profesiones"
      },
      {
        "id": "B-INGRESOS-N",
        "txt": "Handyx for Business · turnos"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
