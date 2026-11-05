// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 6,
  "total": 20,
  "pregunta": "¿Qué los diferencia de Clickie y el resto?",
  "respuesta": "El recorrido completo: foto, HandIA arma el pedido, precio visible antes de contratar y {{FEE-ESPECIALISTA}} al profesional. Clickie cobra {{COMP-CLICKIE-PRO}} al profesional; otros, por contacto o suscripción.",
  "puntos": [],
  "quien": "medidor_gas",
  "viz": {
    "tipo": "lista",
    "items": [
      {
        "ic": "porcentaje",
        "txt": "**{{FEE-ESPECIALISTA}}** al profesional"
      },
      {
        "ic": "herramienta",
        "txt": "**Herramientas** por oficio"
      },
      {
        "ic": "repetir",
        "txt": "**Clientes** que vuelven"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
