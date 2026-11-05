// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 20,
  "total": 20,
  "pregunta": "¿Qué logran en los próximos 3 meses?",
  "respuesta": "Mes 1: HandIA premium y {{PROF-POR-MES}} profesiones nuevas con sus herramientas. Mes 2: HandIA para profesionales y otras {{PROF-POR-MES}}. Mes 3: toda Buenos Aires, con {{PROF-Q1}} profesiones y el piloto de Handyx for Business.",
  "puntos": [
    {
      "ic": "chispas",
      "txt": "**Mes 1:** HandIA"
    },
    {
      "ic": "herramienta",
      "txt": "**Mes 2:** herramientas"
    },
    {
      "ic": "tienda",
      "txt": "**Mes 3:** negocios"
    }
  ],
  "quien": "engranaje",
  "viz": {
    "tipo": "flujo",
    "items": [
      {
        "ic": "chispas",
        "titulo": "Mes 1",
        "txt": "HandIA premium · +{{PROF-POR-MES}} profesiones"
      },
      {
        "ic": "ia",
        "titulo": "Mes 2",
        "txt": "HandIA para profesionales · +{{PROF-POR-MES}} profesiones"
      },
      {
        "ic": "ubicacion",
        "titulo": "Mes 3",
        "txt": "toda Buenos Aires · {{PROF-Q1}} profesiones"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
