# Crear y modificar presentaciones con Claude (sin editor)

Flujo repetible: **brief → cambio de archivos → validación → vista previa → publicación versionada**.

| Paso | Qué se hace | Comando / archivo | Criterio de salida |
|---|---|---|---|
| 1. Brief | El cliente completa `docs/claude/brief.md` (objetivo, audiencia, duración, marca, datos con fuente, QR) | brief | Datos con fuente y fecha; lo desconocido = `null` |
| 2. Cambio | Claude edita **solo** `brands/<marca>/` y `decks/<deck>/` con el prompt de creación o modificación | `prompt-crear.md` / `prompt-modificar.md` | Núcleo (`src/`, `server/`) intacto |
| 3. Validación | Esquema, referencias, superposición, duraciones, QR provisorios | `npm run verify` | 0 errores |
| 4. Vista previa | Lanzador, capturas, PDF | `npm run dev` → `/`; `npm run exportar:pdf` | Revisión del cliente |
| 5. Publicación | Congelar la versión con huella; build congelado | `npm run publicar -- --deck=… --etiqueta=…`; `VITE_PUBLICADA=… npm run build` | Huella visible en el presentador |

Contrato de contenidos: `docs/esquema.md`.
