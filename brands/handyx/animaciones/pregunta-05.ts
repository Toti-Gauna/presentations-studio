// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 5,
  "total": 20,
  "pregunta": "¿HandIA funciona hoy?",
  "respuesta": "Está en desarrollo: lo que mostramos es la demo, que ya detecta el oficio y arma el pedido. La referencia de costo viene después. El precio final siempre lo fija el profesional.",
  "puntos": [
    {
      "ic": "camara",
      "txt": "**Foto** del problema"
    },
    {
      "ic": "chispas",
      "txt": "**Detecta** el oficio"
    },
    {
      "ic": "lista",
      "txt": "**Arma** el pedido"
    }
  ],
  "quien": "llave",
  "viz": {
    "tipo": "flujo",
    "items": [
      {
        "ic": "camara",
        "titulo": "Foto",
        "txt": "del problema"
      },
      {
        "ic": "ia",
        "titulo": "Detecta",
        "txt": "el oficio que hace falta"
      },
      {
        "ic": "lista",
        "titulo": "Arma",
        "txt": "el pedido para el especialista"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
