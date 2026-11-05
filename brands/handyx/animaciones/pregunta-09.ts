// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 9,
  "total": 20,
  "pregunta": "¿En qué usarían los USD 100.000?",
  "respuesta": "Sobre todo en que más personas adopten Handyx: {{INV-MARKETING}} en marketing, {{INV-OPERACIONES}} en operaciones (formar y acompañar a los profesionales), {{INV-TECNOLOGIA}} en tecnología y {{INV-LEGAL}} en legal y reserva.",
  "puntos": [
    {
      "ic": "megafono",
      "txt": "**Marketing** · {{INV-MARKETING}}"
    },
    {
      "ic": "escuela",
      "txt": "**Operaciones** · {{INV-OPERACIONES}}"
    },
    {
      "ic": "ia",
      "txt": "**Tecnología** · {{INV-TECNOLOGIA}}"
    }
  ],
  "quien": "bombilla",
  "viz": {
    "tipo": "barras",
    "total": "INV-TOTAL",
    "items": [
      {
        "id": "INV-MARKETING",
        "txt": "marketing: más vecinos y profesionales"
      },
      {
        "id": "INV-OPERACIONES",
        "txt": "operaciones: formar y acompañar"
      },
      {
        "id": "INV-TECNOLOGIA",
        "txt": "tecnología: HandIA y herramientas"
      },
      {
        "id": "INV-LEGAL",
        "txt": "legal y reserva"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
