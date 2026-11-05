# Escenas animadas (diapositivas premium)

Cada diapositiva premium es una **escena animada en código**: un módulo en `brands/<marca>/animaciones/<modulo>.ts` que el
motor monta en un Shadow DOM de 1920 × 1080 y maneja con un número `p` medido en pasos. El paso k de la diapositiva reproduce
el tramo k (de `marcas[k]` a `marcas[k+1]`); saltar a un paso lleva la escena al final de ese tramo. En vivo, cada clic del
presentador dispara el tramo siguiente (un golpe por frase del guion); en el video se dispara con la transcripción; en el
PDF/PPTX cada paso es una página.

- Contrato del motor: `src/render/animacion.ts` (sin marca). Elemento del deck: `{ tipo: 'animacion', modulo, alt, tiempos, afirmaciones }`
  (`tiempos` = duración de cada tramo; el generador del deck la lee de `marcas`).
- Kit de Handyx: `brands/handyx/animaciones/comun/kit.ts` (colores, tipografías, celular, burbujas, tarjetas, sellos,
  personajes con poses, `contador`, `escribir`, `pintor`, `entraTitulo`, `tramo`, `pose`). Mapa: `comun/argentina.ts`.
- Referencia de calidad: `brands/handyx/animaciones/odisea.ts` (diapositiva 1).

## Cómo se escribe una escena

```ts
import { COLOR, entraTitulo, escena, pose, tramo } from './comun/kit.ts';
export default escena({
  marcas: [0, 2.8, 6.0, 9.4],                 // n + 1 marcas → n pasos (tramos de 2,4 a 4 s)
  cara: [{ desde: 0, x: 1690, y: 200, d: 250 }], // lugar libre para la cara en el video (solo decorado debajo)
  css: `...`,                                  // estilos propios (aislados en el Shadow DOM)
  html: (c) => `...`,                          // c.pj('llave', clase, alto) · c.icono('casa') · c.logo() · c.img('demo-landing/x.webp') · c.celular(html)
  armar(tl, $, c) { ... },                     // coreografía en la línea pausada (tl.fromTo con tiempos absolutos)
  ambiente(t, $, tLinea) { ... },              // movimiento continuo (nubes, respiración, órbitas); en exportación t = tLinea
});
```

## Reglas

1. **Cifras solo por afirmaciones**: `c.cifra('ID')` (texto formateado) o `c.valor('ID')` (número, para `c.contador`). Nunca un número
   escrito a mano en pantalla (años y nombres de meses del plan, sí). Las afirmaciones que usa la escena se declaran en el deck.
2. **Rótulos honestos** en pantalla cuando corresponde: «Demo · datos ficticios», «Diseño propuesto», «HandIA en desarrollo»,
   «Visión · con la inversión», «Plan propuesto · a validar». 56 son especialistas **registrados** (preregistro), nunca «activos» ni «verificados».
3. **Un solo dueño por propiedad**: lo que mueve la línea de tiempo no lo mueve el ambiente (usar un contenedor `.mov` para entrar y el
   `.pj` de adentro para respirar). Textos que cambian y poses: con `c.pintor` (valen también en los saltos).
4. **Determinista**: nada de `Math.random` (usar `c.azar`), nada que dependa de la hora.
5. **Se explica sola**: cada paso lleva su leyenda (`leyendas: ['', 'En casa: **algo se rompió**', …]`, una por tramo, `''` = sin
   leyenda): una pastilla numerada que dice qué está pasando. Va abajo al centro por defecto (`lugarLeyenda` la mueve) y nunca en la
   franja de subtítulos.
6. **Legible y limpio**: texto ≥ 20 px, títulos con `.kicker` + `.titulo` (marcador amarillo con `<mark>`), sin superposiciones, un foco
   claro por paso. La franja de abajo (y > 960) queda libre de texto importante (subtítulos del video y rótulos al pie).
7. **Español rioplatense con voseo**; pesos con `$ 45.000`; «verificados» solo con dato real; sin «inmediato» ni «al instante».
8. Personajes de la marca: Foco (`bombilla`) es el vecino/usuario, Llave (`llave`) el especialista; poses a reposo, b saludo,
   c festejo, d acción. Sin fotos de personas reales ni logos de terceros.

## Ver una escena

Con el servidor de desarrollo (`npx vite --port 5190`):
`node scripts/video-pitch/vista-animacion.cjs <modulo> 0.99,1.99,2.99 salida.png ID1,ID2 <paleta>` arma una hoja con la escena
al final de cada paso (sin movimiento ambiente). `npx tsc --noEmit -p .` tiene que pasar.
