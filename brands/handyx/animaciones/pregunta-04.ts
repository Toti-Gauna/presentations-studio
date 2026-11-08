// Generado por scripts/generar-respuestas.py desde decks/handyx-aticma/preguntas.json (no editar a mano).
import { respuesta } from './comun/respuesta.ts';

export default respuesta({
  "n": 4,
  "total": 20,
  "pregunta": "¿Cuántos trabajos tienen cobrados?",
  "respuesta": "{{TRABAJOS-INFORMADOS}} trabajos con comisión cobrada, con ayuda de porteros: {{PRUEBA-MONTO}} en trabajos y **{{PRUEBA-INGRESO-HANDYX}} de ingresos para Handyx** con el plan original ({{PRUEBA-COM-USUARIO}} al usuario + {{PRUEBA-COM-PROFESIONAL}} al profesional). Además, {{ESP-REGISTRADOS}} especialistas registrados (todavía no activos ni verificados).",
  "puntos": [
    {
      "ic": "tilde-circulo",
      "txt": "**{{TRABAJOS-INFORMADOS}}** trabajos cobrados"
    },
    {
      "ic": "usuarios",
      "txt": "**{{ESP-REGISTRADOS}}** registrados"
    },
    {
      "ic": "bandera",
      "txt": "**Próximo:** {{META-TRABAJOS}} y {{META-REPETIDORES}} que vuelven"
    }
  ],
  "quien": "engranaje",
  "viz": {
    "tipo": "cifras",
    "items": [
      {
        "id": "TRABAJOS-INFORMADOS",
        "txt": "trabajos con comisión cobrada",
        "contar": {}
      },
      {
        "id": "PRUEBA-MONTO",
        "txt": "en trabajos, con porteros"
      },
      {
        "id": "PRUEBA-INGRESO-HANDYX",
        "txt": "ingresos de Handyx (plan {{PRUEBA-COM-USUARIO}} + {{PRUEBA-COM-PROFESIONAL}})"
      }
    ]
  }
} as Parameters<typeof respuesta>[0]);
