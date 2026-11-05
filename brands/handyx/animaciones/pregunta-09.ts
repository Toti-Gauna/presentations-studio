// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 9,
  "total": 20,
  "pregunta": "¿En qué usarían los USD 100.000?",
  "respuesta": "Sobre todo en que más personas adopten Handyx: {{INV-MARKETING}} en marketing (publicidades hechas con IA con Seedance 2.5, redes, postes, volantes y remeras con los Handys), {{INV-OPERACIONES}} en operaciones y {{INV-TECNOLOGIA}} en tecnología.",
  "puntos": [
    {
      "ic": "megafono",
      "txt": "**Marketing** · {{INV-MARKETING}}: IA, redes y calle"
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
        "txt": "marketing: publicidades con IA, redes y calle"
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
