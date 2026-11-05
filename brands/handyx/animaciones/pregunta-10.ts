// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 10,
  "total": 20,
  "pregunta": "¿Qué hacen si los clientes no vuelven?",
  "respuesta": "Es nuestra prueba más importante. Antes de escalar, revisamos precio visible, calidad y seguimiento del trabajo: preferimos aprender con pocos casos que crecer sin retención.",
  "puntos": [],
  "quien": "gota",
  "viz": {
    "tipo": "lista",
    "items": [
      {
        "ic": "pregunta",
        "txt": "**Preguntamos** por qué"
      },
      {
        "ic": "calculadora",
        "txt": "**Ajustamos** precio y calidad"
      },
      {
        "ic": "repetir",
        "txt": "**Medimos** de nuevo"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
