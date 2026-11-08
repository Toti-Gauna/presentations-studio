# Pantallas de la demo de la landing (landing.handyc.com/demo)

Capturas de la **demo interactiva** de `Handy-landing-page-fe` (referencia visual de la app, datos ficticios), elegidas
para el pitch ATICMA porque la app todavía se está puliendo. Se descartan las pantallas que muestran la tarifa anterior
(presupuestos, precio, caja, trabajo terminado, cuenta con cupones).

Cómo se regeneran (con la landing compilada: `npm ci && npm run build` en `Handy-landing-page-fe`):

```sh
# pantallas estáticas (414 × 896 a 2x, con barra de estado 9:41)
node scripts/trailers/exportar-pantallas.ts /tmp/pantallas            # en Handy-landing-page-fe
node scripts/landing/render-pantallas.mjs /tmp/pantallas/pantallas-demo.js /tmp/salida u-inicio u-describir u-turnos e-turnos e-mensajes e-pedido-programado
# HandIA en uso (modo app, conversación real de la demo): con `npx vite preview --port 5191` corriendo en la landing
ALTO=852 node scripts/landing/handia.cjs /tmp/salida   # paso3.png debajo de la barra de estado (88 px a 2x) de u-handia
```

| Archivo | Pantalla de la demo |
|---|---|
| usuario-inicio.webp | `u-inicio` · elegir el oficio, acceso a HandIA |
| usuario-describir.webp | `u-describir` · contar qué pasó, fotos, pedir presupuestos |
| usuario-handia.webp | `u-handia` después de «Se tapó la pileta de la cocina» + «Mandar una foto» |
| usuario-agenda.webp | `u-turnos` · agenda del usuario |
| especialista-agenda.webp | `e-turnos` · agenda del profesional |
| especialista-mensajes.webp | `e-mensajes` · clientes y chats |
| especialista-pedido.webp | `e-pedido-programado` · pedido nuevo, «El precio lo ponés vos» |
