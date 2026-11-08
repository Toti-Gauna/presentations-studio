# Control remoto: protocolo y seguridad

Servidor: `server/app.ts` (HTTP + WebSocket `/ws`). Estado y reductor compartidos: `src/core/estado.ts`.

## Roles y credenciales
| Rol | Credencial | Puede |
|---|---|---|
| anfitrión (computadora) | `tokenAnfitrion` (en memoria de la pestaña) | comandos, sincronizar, generar código, aprobar/rechazar, revocar, terminar |
| control (celular aprobado) | `tokenControl` (sessionStorage de la pestaña) | comandos; recibe notas |
| público remoto (otra computadora) | `tokenPublico` (fragmento `#`) | solo recibir estado; **nunca** notas |
| espera (celular sin aprobar) | `tokenEspera` | esperar aprobación |

El id de sesión solo no autoriza nada. Tokens de 256 bits, guardados como SHA-256, comparación en tiempo constante.

## Emparejamiento
1. El anfitrión crea la sesión (`POST /api/sesiones`, límite 30 por IP cada 10 min) y pide un código (`POST /api/sesiones/:id/codigo`).
2. El QR privado codifica `/control/#s=<sesion>&c=<codigo>&srv=<servidor>` (código de 144 bits, **un solo uso**, vence en 3 min).
3. El celular presenta el código (`POST …/emparejar`, máx. 8 intentos/min por sesión) y queda **pendiente**.
4. El presentador aprueba o rechaza; recién ahí el celular recibe su token. Máx. 3 celulares; revocación individual o total.
Una foto de la pantalla pública no sirve: el QR privado solo se muestra en la vista del presentador y caduca al usarse.

## Comandos sin doble avance
Cada comando lleva `id` único y `base` (revisión que veía el emisor). El servidor: id repetido → `duplicado` (no reaplica);
comando relativo con `base` vieja → `obsoleto`; absoluto (ir, negro, medio, reloj) se aplica. El celular reintenta con el **mismo**
id al reconectar (≤ 5 s) e ignora toques relativos a menos de 450 ms. La computadora aplica en local al instante; si el servidor
no confirma en 1,5 s, sigue local y al reconectar impone su estado (`sincronizar`).

## Límites
Mensajes ≤ 64 KiB, ≤ 30 mensajes/s por conexión, latido 15 s (servidor) y 4 s (cliente), sesiones de 8 h, orígenes exactos
(`ALLOWED_ORIGINS`) para HTTP y WS, logs sin tokens, códigos, notas ni cuerpos. Redirecciones `/r/<id>`: destino definido en `qr.json`, nunca por parámetro del visitante.
