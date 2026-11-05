// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 13,
  "total": 20,
  "pregunta": "¿Cómo van a conseguir tracción?",
  "respuesta": "En los dos lados: porteros, ads por barrio y los Handys, que los chicos reconocen y cuentan en casa; para los profesionales, {{FEE-ESPECIALISTA}} de comisión, ferreterías y formación.",
  "puntos": [],
  "quien": "llave",
  "viz": {
    "tipo": "lista",
    "items": [
      {
        "ic": "edificio",
        "txt": "**Porteros** y administradores"
      },
      {
        "ic": "usuarios",
        "txt": "**Handys** que se recuerdan"
      },
      {
        "ic": "tienda",
        "txt": "**Ferreterías** y corralones"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
