// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 6,
  "total": 20,
  "pregunta": "¿Qué los diferencia de la competencia?",
  "respuesta": "El recorrido completo: foto, HandIA arma el pedido, precio visible antes de contratar y **{{FEE-ESPECIALISTA}} al profesional**. Clickie le cobra al profesional hasta {{COMP-CLICKIE-PRO}}, Home Solution por contacto y Muovi anuncia comisión cero por tiempo limitado.",
  "puntos": [
    {
      "ic": "cohete",
      "txt": "**Nuestro océano azul:** {{DESARROLLOS-PLAN}} desarrollos en el plan"
    },
    {
      "ic": "escudo-ok",
      "txt": "**Clickie, Home Solution, Muovi:** el profesional paga"
    }
  ],
  "quien": "medidor_gas",
  "viz": {
    "tipo": "flujo",
    "items": [
      {
        "ic": "porcentaje",
        "titulo": "{{FEE-ESPECIALISTA}}",
        "txt": "de comisión: el profesional cobra su presupuesto completo"
      },
      {
        "ic": "recibo",
        "titulo": "Precio visible",
        "txt": "la tarifa la paga el usuario, antes de contratar"
      },
      {
        "ic": "ia",
        "titulo": "Lo que suma",
        "txt": "HandIA, herramientas por oficio y clientes que vuelven"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
