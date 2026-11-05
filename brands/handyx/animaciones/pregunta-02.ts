// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 2,
  "total": 20,
  "pregunta": "¿Cuánto cuesta mantener Handyx?",
  "respuesta": "Hoy ≈ {{COSTOS-MES}} por mes. Con {{INGRESO-POR-TRABAJO}} de tarifa por trabajo, {{EQUILIBRIO-TRABAJOS}} trabajos por mes cubren esos costos.",
  "puntos": [
    {
      "ic": "servidor",
      "txt": "**Servidores** · {{COSTO-SERVIDORES}}"
    },
    {
      "ic": "codigo",
      "txt": "**Desarrollo** · {{COSTO-DESARROLLO}}"
    },
    {
      "ic": "megafono",
      "txt": "**Marketing** · {{COSTO-MARKETING}}"
    }
  ],
  "quien": "gota",
  "viz": {
    "tipo": "barras",
    "total": "COSTOS-MES",
    "items": [
      {
        "id": "COSTO-DESARROLLO",
        "txt": "desarrollo"
      },
      {
        "id": "COSTO-SERVIDORES",
        "txt": "servidores e IA"
      },
      {
        "id": "COSTO-MARKETING",
        "txt": "marketing"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
