# ADR-0001 · Arquitectura del motor de presentaciones

Fecha: 31/10/2026 · Estado: aceptada · Lote 0.2

## Contexto
Repo vacío; 5 días a la semifinal; hay que servir a Handyx ya y venderse después como Eclipse sin reescribir.
Infraestructura existente declarada: Hostinger (estático), Render y VPS (procesos persistentes). El stack de la casa es
Vite + TypeScript estricto (landing) y Node 22 con TypeScript nativo (PWA especialista).

## Decisión
- **Cliente:** Vite + TypeScript sin framework (como la landing), GSAP para movimiento, `uqr` para QR locales, Zod para validar.
  Multi-página estática: `/presentar/`, `/presentador/`, `/control/`, `/imprimir/`, `/`. Base relativa: el mismo build sirve en
  Hostinger, en una subcarpeta o desde el paquete local.
- **Servidor de sesiones:** Node 22 (`node server/main.ts`, tipos borrables) + `ws`. Un solo proceso, estado en memoria,
  sin base de datos (no hay datos que justifiquen Neon). Puede servir también el build (VPS o ensayo en red local).
- **Capas:** `src/core` (esquema, estado, afirmaciones, QR, protocolo, validación: sin DOM y sin marca) ·
  `src/render` (DOM y movimiento, sin marca) · `src/transporte` (local/remoto) · `src/vistas` · `brands/<marca>` (tema y
  arte) · `decks/<deck>` (contenido, afirmaciones, QR, escenarios). Lo comercial de Handyx vive solo en `brands/handyx` y `decks/handyx`.
- **Autoridad del estado:** la computadora (anfitrión) aplica siempre en local; el servidor ordena comandos cuando hay
  conexión (revisión base + id único → sin doble avance); si el servidor no confirma, el anfitrión sigue local y al volver
  impone su estado (`sincronizar`). El teclado/clicker nunca depende de la red.
- **Seguridad del control:** token del anfitrión, token público de solo lectura, código de emparejamiento de un solo uso
  (3 min) en el QR privado, aprobación explícita, máximo 3 teléfonos, revocación, límite de intentos, orígenes exactos,
  mensajes acotados, notas solo a roles privados, secretos en el fragmento `#` (no viajan en logs ni Referer).
- **Contenido:** JSON validado; cifras solo vía `{{AFIRMACION}}` con rótulo automático por tipo; versión congelada con huella.

## Consecuencias
- Reiniciar el servidor pierde sesiones (el anfitrión sigue local; se vuelve a emparejar). Aceptable para una charla; persistir
  en archivo es una mejora P1 si el VPS lo requiere.
- Render en plan gratuito puede dormir el proceso: conectar el remoto 10 min antes y verificar `/salud`.
- Sin editor visual: los cambios se hacen con Claude sobre los JSON (ver `docs/claude/`).
