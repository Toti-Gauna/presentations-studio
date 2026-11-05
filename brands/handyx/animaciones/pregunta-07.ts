// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 7,
  "total": 20,
  "pregunta": "¿Cómo cobran el 15 %?",
  "respuesta": "La tarifa se muestra antes de contratar y la paga el usuario. El circuito de cobro está en implementación; en las pruebas lo coordinamos a mano.",
  "puntos": [
    {
      "ic": "recibo",
      "txt": "**Visible** antes de contratar"
    },
    {
      "ic": "billetera",
      "txt": "**El profesional** cobra su presupuesto"
    },
    {
      "ic": "escudo-ok",
      "txt": "**Sin** comisión al profesional"
    }
  ],
  "quien": "aire",
  "viz": {
    "tipo": "flujo",
    "items": [
      {
        "ic": "billetera",
        "titulo": "{{EJ-T}}",
        "txt": "paga el usuario, visible antes de contratar"
      },
      {
        "ic": "porcentaje",
        "titulo": "{{EJ-F}}",
        "txt": "tarifa Handyx ({{TARIFA-USUARIO}})"
      },
      {
        "ic": "casa",
        "titulo": "{{EJ-P}}",
        "txt": "llega completo al profesional ({{FEE-ESPECIALISTA}} de comisión)"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
