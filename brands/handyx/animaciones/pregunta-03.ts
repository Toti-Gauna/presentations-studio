// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 3,
  "total": 20,
  "pregunta": "¿De dónde salen el 25 % y los USD 100.000?",
  "respuesta": "{{MDP-HOGARES}} hogares × 1 arreglo por año × {{SUP-TICKET-USD}}: {{MERCADO-USD}} por año. El 25 % de un trimestre son {{Q1-TRABAJOS}} trabajos. Con el ticket promedio de nuestros 5 trabajos ({{PRUEBA-TICKET}} ≈ USD 45) dejan {{Q1-TARIFAS-REAL}} de tarifas.",
  "puntos": [
    {
      "ic": "casa",
      "txt": "**{{MERCADO-USD}}** por año"
    },
    {
      "ic": "objetivo",
      "txt": "**{{Q1-TRABAJOS}}** trabajos"
    },
    {
      "ic": "dolar",
      "txt": "**{{Q1-TARIFAS-REAL}}** con nuestro ticket"
    }
  ],
  "quien": "grifo",
  "viz": {
    "tipo": "cuenta",
    "items": [
      {
        "id": "MDP-HOGARES",
        "txt": "hogares · 1 arreglo por año"
      },
      {
        "op": "→",
        "id": "MERCADO-TRIM-N",
        "txt": "arreglos por trimestre"
      },
      {
        "op": "×",
        "id": "Q1-TRABAJOS",
        "txt": "trabajos ({{META-CUOTA-LOCAL}} del trimestre)"
      },
      {
        "op": "→",
        "id": "Q1-TARIFAS-REAL",
        "txt": "de tarifas (ticket {{PRUEBA-TICKET-USD}} × {{TARIFA-USUARIO}})"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
