// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 19,
  "total": 20,
  "pregunta": "¿Qué suma HandIA con la inversión?",
  "respuesta": "Con la inversión, HandIA te va a poder hablar con una voz natural (ElevenLabs): te pregunta qué pasó, te pide una foto, arma el pedido y te muestra especialistas cerca. Hablás en vez de escribir: más fácil para todos y pedidos más claros para el especialista.",
  "puntos": [
    {
      "ic": "chat",
      "txt": "**Hablás**, no escribís"
    },
    {
      "ic": "camara",
      "txt": "**Pedido claro** con foto"
    },
    {
      "ic": "ia",
      "txt": "**Te guía** en cada paso"
    }
  ],
  "quien": "grifo",
  "viz": {
    "tipo": "flujo",
    "items": [
      {
        "ic": "chat",
        "titulo": "Hablás",
        "txt": "en vez de escribir"
      },
      {
        "ic": "camara",
        "titulo": "Pedido claro",
        "txt": "con foto y descripción"
      },
      {
        "ic": "ia",
        "titulo": "Te guía",
        "txt": "antes, durante y después"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
