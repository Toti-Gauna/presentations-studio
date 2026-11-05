# Marketing físico, digital y growth (lote 5.2)

Separación obligatoria: **estrategia prevista** (todo lo de abajo) · **experimento en ejecución** (ninguno al 31/10) ·
**resultado medido** (ninguno al 31/10). Antes del 10/11 el material comunica lista de espera / próximo lanzamiento, no servicio disponible.

## Físico
- **Volante A5 doble faz**: frente foco/usuario ("¿Se rompió algo en casa?"), dorso llave/especialista ("Tus herramientas. Tu precio."). Un QR por audiencia **y por barrio/lugar** (`?utm_content=<barrio>-<pieza>-v1`).
- **Piezas rectangulares en comercios que acepten** (ferreterías, pinturerías, casas de electricidad). Solo se llama "aliado" a quien aceptó por escrito.
- **A4 con dos QR** (usuarios / especialistas) donde esté permitido.
- **Visitas** a comercios y captación directa de especialistas (Operations), con registro de quién visitó qué y cuándo.

## Digital
- Landing diferenciada por público (`/registro/?tipo=usuario|especialista`).
- Contenido corto de problemas concretos con los personajes (pérdida, enchufe, aire que no enfría).
- Campaña estacional de aire acondicionado = **hipótesis** (verano), solo con oferta verificada en ese rubro.
- Grupos y redes locales con permiso del administrador; búsqueda local; anuncios por zona/rubro solo con oferta y presupuesto.
- Contacto y seguimiento con consentimiento (aviso LEG-04 vigente); nada de envíos automáticos.

## Bucles de crecimiento
1. Trabajo satisfactorio → reseña o recomendación → nuevo pedido en la zona → más valor para especialistas de esa zona.
2. Comercio colaborador → pedido trazable (QR del comercio) → resolución → nuevas recomendaciones del comercio.
Incentivos (p. ej. bonificación por recomendación) = propuesta con costo, reglas y control de abuso; no prometidos.

## Backlog de 6 experimentos (umbrales PROPUESTOS antes de ver datos)

| id | Tipo | Hipótesis | Segmento | Variante | Métrica principal | Costo máx. | Duración | Mínimo de observación | Seguir si / cortar si | Efecto esperado en trabajos |
|---|---|---|---|---|---|---|---|---|---|---|
| F1 | Físico | Un volante por barrio genera registros de vecinos con necesidad real | Hogares de 2 barrios con oferta de plomería/electricidad | A5 con QR por barrio (A: problema / B: precio a la vista) | registros por 100 volantes | $ 60.000 | 2 semanas | 1.000 volantes por variante | ≥ 1 registro/100 · < 0,3 corta | primeros pedidos en esos barrios |
| F2 | Físico | Un comercio del hogar deriva pedidos que no resuelve | 5 comercios que acepten | Cartel + QR del comercio | pedidos trazables por comercio | $ 30.000 | 3 semanas | 5 comercios × 3 semanas | ≥ 2 pedidos/comercio · 0 corta el canal | pedidos con alta intención |
| D1 | Digital | Videos cortos con personajes bajan el costo por registro | Redes locales, 25–55 años, MDP | 2 piezas (pérdida / enchufe) | registros por $ 10.000 | $ 80.000 | 2 semanas | 1.000 impresiones por pieza | ≥ 3 registros/$ 10.000 · < 1 corta | registros → primer pedido |
| D2 | Digital | Búsqueda local capta pedidos urgentes | "plomero/electricista mar del plata" | Ficha local + landing por rubro | pedidos por semana | $ 50.000 | 3 semanas | 3 semanas | ≥ 2/semana desde la 3.ª · 0 revisa zona/palabras | pedidos de alta intención |
| A1 | Activación | Un mensaje de bienvenida con un pedido de ejemplo acelera el primer pedido | Registrados en lista de espera | Mensaje con ejemplo vs. sin ejemplo (con consentimiento) | % de registrados que piden en 14 días | $ 0 | 4 semanas | 50 registrados por grupo | ≥ 20 % · < 8 % cambia onboarding | más primeros trabajos |
| R1 | Recomendación | Pedir la reseña justo al cerrar el trabajo aumenta recomendaciones | Usuarios con trabajo completado | Pedido inmediato vs. a las 24 h | % trabajos con reseña o recomendación | $ 0 | 4 semanas | 20 trabajos por grupo | ≥ 30 % · < 10 % cambia el momento | repetición y nuevos pedidos |

Con muestras chicas se informan aprendizajes, no "ganadores estadísticos".

## Medición mínima (por audiencia, por separado)
Visita por canal → registro por rol → contacto → verificación → disponibilidad → solicitud → propuesta → aceptación → trabajo
completado → pago acreditado → bonificación → repetición → recomendación. Atribución limitada (último QR/UTM), deduplicación
por WhatsApp normalizado (ya implementada en el BE), consentimiento registrado. Escaneos ≠ personas. Ningún dato personal en el pitch.
