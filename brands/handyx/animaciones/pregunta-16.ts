// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 16,
  "total": 20,
  "pregunta": "¿Van a invertir la plata de los inversores en cripto?",
  "respuesta": "No. La inversión va al plan: marketing, operaciones y tecnología. La tesorería trabaja solo con excedentes, después de guardar {{POL-CAJA-MESES}} meses de costos, y con cripto como máximo el {{POL-CRIPTO-MAX}}.",
  "puntos": [],
  "quien": "brocha",
  "viz": {
    "tipo": "lista",
    "items": [
      {
        "ic": "escudo-ok",
        "txt": "**La inversión:** al plan"
      },
      {
        "ic": "alcancia",
        "txt": "**Solo excedentes**"
      },
      {
        "ic": "balanza",
        "txt": "**Cripto:** máximo {{POL-CRIPTO-MAX}}"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
