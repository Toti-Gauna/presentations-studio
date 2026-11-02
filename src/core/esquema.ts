// Esquema de contenidos del motor (versión 1). Núcleo sin marca: nada de ninguna marca acá.
// Todo deck, tema, QR y afirmación se valida con estos esquemas antes de mostrarse.
import { z } from 'zod';

export const VERSION_ESQUEMA = 1 as const;

const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,62}$/, 'id: minúsculas, números y guiones');

/** Solo esquemas web. `http:` se admite únicamente para localhost (ensayos). */
export const urlPublica = z
  .string()
  .url()
  .refine((u) => {
    const url = new URL(u);
    if (url.username || url.password) return false;
    if (url.protocol === 'https:') return true;
    return url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
  }, 'URL pública: solo https (o http://localhost en ensayo), sin credenciales');

// ── Afirmaciones (claims) ────────────────────────────────────────────────────
export const TipoAfirmacion = z.enum(['observado', 'informado', 'supuesto', 'proyeccion', 'meta', 'ejemplo']);
export const Afirmacion = z
  .object({
    id: z.string().regex(/^[A-Z][A-Z0-9-]{1,40}$/, 'id de afirmación: MAYÚSCULAS-Y-GUIONES'),
    descripcion: z.string().min(3),
    valor: z.union([z.number(), z.string(), z.null()]),
    unidad: z.string().default(''),
    periodo: z.string().default(''),
    tipo: TipoAfirmacion,
    fuente: z.string().min(3),
    pagina: z.string().optional(),
    url: z.string().url().optional(),
    corte: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    verificacion: z.enum(['verificado', 'sin-verificar', 'pendiente']),
    formula: z.string().optional(),
    dependencias: z.array(z.string()).default([]),
    uso: z.enum(['publico', 'anexo', 'notas']),
    formato: z.enum(['entero', 'ars', 'millones', 'porcentaje', 'texto', 'fecha']).default('texto'),
  })
  .strict();
export type Afirmacion = z.infer<typeof Afirmacion>;

// ── QR públicos ──────────────────────────────────────────────────────────────
const Campania = z
  .object({ source: z.string(), medium: z.string(), campaign: z.string(), content: z.string().optional() })
  .strict();
export const QrPublico = z
  .object({
    id,
    etiqueta: z.string().min(2),
    /** directo: el QR codifica la URL final. estable: codifica una ruta fija que redirige al destino activo. */
    modo: z.enum(['directo', 'estable']),
    destinos: z.object({ A: urlPublica, B: urlPublica.optional() }).strict(),
    activo: z.enum(['A', 'B']).default('A'),
    /** Ruta estable bajo un dominio controlado, ej. https://go.ejemplo.com/r/registro */
    urlEstable: urlPublica.optional(),
    campania: Campania.optional(),
    /** Texto corto legible de respaldo bajo el QR (sin https://). */
    textoCorto: z.string().min(3),
    /** false = destino provisorio: el validador impide publicar una versión final con él. */
    definitivo: z.boolean(),
  })
  .strict()
  .superRefine((q, ctx) => {
    if (q.modo === 'estable' && !q.urlEstable) ctx.addIssue({ code: 'custom', message: `QR ${q.id}: modo estable sin urlEstable` });
    if (q.activo === 'B' && !q.destinos.B) ctx.addIssue({ code: 'custom', message: `QR ${q.id}: activo B sin destino B` });
  });
export type QrPublico = z.infer<typeof QrPublico>;

// ── Elementos de escena ──────────────────────────────────────────────────────
const base = {
  id,
  /** Paso desde el que aparece (0 = al entrar a la escena). */
  paso: z.number().int().min(0).default(0),
  area: z.enum(['centro', 'arriba', 'abajo', 'izquierda', 'derecha', 'fondo', 'libre']).default('centro'),
  /** Posición libre en % del escenario (solo con area=libre). */
  pos: z.object({ x: z.number(), y: z.number(), w: z.number().optional() }).strict().optional(),
  entrada: z.enum(['ninguna', 'fundido', 'subir', 'escala', 'mascara', 'palabras', 'contar', 'traer', 'golpe']).default('fundido'),
  /** Con entrada "traer": id del elemento personaje que trae esta pieza a escena. */
  traidoPor: id.optional(),
  /** Lado desde el que llega lo traído (si el personaje entra en el mismo paso). */
  desde: z.enum(['izq', 'der']).default('izq'),
  enfasis: z.boolean().default(false),
  /** Caja estilo lámina alrededor del elemento. */
  caja: z.enum(['blanca', 'azul', 'amarilla', 'gris', 'navy']).optional(),
  /** Paso en el que el elemento sale de escena (opcional). */
  sale: z.number().int().min(1).optional(),
};
const Accion = z.enum(['reposo', 'entrar', 'salir', 'saludar', 'festejar', 'caminar', 'mirar', 'senalar', 'reaccionar', 'satisfaccion']);
export type Accion = z.infer<typeof Accion>;

export const Elemento = z.discriminatedUnion('tipo', [
  z.object({ ...base, tipo: z.literal('titulo'), texto: z.string(), nivel: z.number().int().min(1).max(3).default(1), kicker: z.string().optional() }).strict(),
  z.object({ ...base, tipo: z.literal('texto'), texto: z.string(), tamano: z.enum(['xs', 's', 'm', 'l']).default('m') }).strict(),
  z.object({ ...base, tipo: z.literal('etiqueta'), texto: z.string(), tono: z.enum(['neutro', 'aviso', 'demo', 'proyeccion', 'meta', 'kicker']).default('neutro') }).strict(),
  z
    .object({ ...base, tipo: z.literal('cifra'), afirmacion: z.string(), leyenda: z.string(), detalle: z.string().optional() })
    .strict(),
  z
    .object({
      ...base,
      tipo: z.literal('lista'),
      items: z.array(z.object({ texto: z.string(), paso: z.number().int().min(0).optional(), icono: z.string().optional() }).strict()).min(1),
      estilo: z.enum(['vinetas', 'numerada', 'mosaicos', 'contraste', 'escalera']).default('vinetas'),
      encabezado: z.string().optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      tipo: z.literal('flujo'),
      nodos: z.array(z.object({ texto: z.string(), detalle: z.string().optional(), paso: z.number().int().min(0).optional() }).strict()).min(2),
    })
    .strict(),
  z
    .object({
      ...base,
      tipo: z.literal('grafico'),
      forma: z.enum(['barras', 'embudo']),
      titulo: z.string(),
      series: z.array(z.object({ etiqueta: z.string(), afirmacion: z.string().optional(), valor: z.number().nullable().optional() }).strict()).min(1),
      unidad: z.string().default(''),
      rotulo: z.string(),
    })
    .strict(),
  z
    .object({
      ...base,
      tipo: z.literal('tabla'),
      columnas: z.array(z.string()).min(2),
      filas: z.array(z.array(z.string())).min(1),
      /** Índice (desde 0) de la fila destacada, ej. la propia marca en una comparación. */
      destacar: z.number().int().min(0).optional(),
      /** Paso en que se revela la fila destacada (si difiere del elemento). */
      pasoDestacada: z.number().int().min(0).optional(),
    })
    .strict(),
  z.object({ ...base, tipo: z.literal('qr'), qr: id }).strict(),
  z
    .object({
      ...base,
      tipo: z.literal('personaje'),
      personaje: z.string(),
      tamano: z.number().min(5).max(80).default(28),
      acciones: z.array(z.object({ paso: z.number().int().min(0), accion: Accion, hacia: z.enum(['izq', 'der']).optional(), distancia: z.number().min(0).max(1900).optional() }).strict()).default([]),
      continuidad: z.boolean().default(false),
    })
    .strict(),
  z.object({ ...base, tipo: z.literal('imagen'), recurso: z.string(), alt: z.string(), forma: z.enum(['normal', 'circulo']).default('normal') }).strict(),
  z
    .object({
      ...base,
      tipo: z.literal('oceano'),
      /** Pasos relativos: 0 mar rojo con competidores · 1 la marca toma lo mejor de cada uno · 2 océano azul. */
      competidores: z.array(z.object({ nombre: z.string(), nota: z.string(), mejor: z.string() }).strict()).min(2).max(8),
      marca: z.string(),
      pasoToma: z.number().int().min(0),
      pasoAzul: z.number().int().min(0),
    })
    .strict(),
  z
    .object({
      ...base,
      tipo: z.literal('reparto'),
      total: z.string(),
      leyendaTotal: z.string(),
      partes: z.array(z.object({ afirmacion: z.string(), etiqueta: z.string(), tono: z.enum(['azul', 'amarilla', 'gris']) }).strict()).min(2).max(4),
      pasoPartes: z.number().int().min(0),
    })
    .strict(),
  z
    .object({
      ...base,
      tipo: z.literal('circulos'),
      capas: z.array(z.object({ etiqueta: z.string(), paso: z.number().int().min(0).default(0) }).strict()).min(2).max(4),
    })
    .strict(),
  z
    .object({
      ...base,
      tipo: z.literal('telefono'),
      /** Pantallas reales (recursos de imagen) que se suceden por paso dentro de un marco de celular 9:19,5. */
      pantallas: z.array(z.object({ recurso: z.string(), paso: z.number().int().min(0).default(0), alt: z.string() }).strict()).min(1),
      leyenda: z.string().optional(),
      alto: z.number().min(20).max(95).default(78),
    })
    .strict(),
  z
    .object({ ...base, tipo: z.literal('video'), recurso: z.string(), poster: z.string(), alt: z.string(), sonido: z.boolean().default(false), auto: z.boolean().default(false), cubrir: z.boolean().default(false) })
    .strict(),
]);
export type Elemento = z.infer<typeof Elemento>;

export const Clasificacion = z.enum(['hecho', 'informado', 'demo', 'supuesto', 'proyeccion', 'meta', 'plan', 'mixto']);

export const Escena = z
  .object({
    id,
    titulo: z.string(),
    disposicion: z.enum(['centro', 'dividido', 'izquierda', 'grilla', 'cierre']).default('centro'),
    paleta: z.string().default('neutro'),
    duracion: z.number().int().min(3).max(900),
    pasos: z.number().int().min(1).max(20),
    elementos: z.array(Elemento).min(1),
    transicion: z.enum(['corte', 'fundido', 'deslizar', 'continuidad']).default('fundido'),
    clasificacion: Clasificacion,
    objetivo: z.string(),
    guion: z.string(),
    notas: z.string().default(''),
    lectura: z.string().default(''),
    referencias: z.array(z.string()).default([]),
    sonido: z.string().optional(),
    respaldo: z.string().default(''),
    preguntas: z.string().default(''),
  })
  .strict()
  .superRefine((e, ctx) => {
    const ids = new Set<string>();
    for (const el of e.elementos) {
      if (ids.has(el.id)) ctx.addIssue({ code: 'custom', message: `escena ${e.id}: elemento repetido ${el.id}` });
      ids.add(el.id);
      const pasos = [el.paso, ...('items' in el ? el.items.map((i) => i.paso ?? 0) : []), ...('nodos' in el ? el.nodos.map((n) => n.paso ?? 0) : []), ...('acciones' in el ? el.acciones.map((a) => a.paso) : []), ...('pantallas' in el ? el.pantallas.map((p) => p.paso) : []), ...('capas' in el ? el.capas.map((c) => c.paso) : []), ...(el.tipo === 'oceano' ? [el.pasoToma, el.pasoAzul] : []), ...(el.tipo === 'reparto' ? [el.pasoPartes] : []), ...(el.sale !== undefined ? [el.sale] : [])];
      for (const p of pasos) if (p >= e.pasos) ctx.addIssue({ code: 'custom', message: `escena ${e.id}: ${el.id} usa paso ${p} pero la escena tiene ${e.pasos}` });
      if (el.area === 'libre' && !el.pos) ctx.addIssue({ code: 'custom', message: `escena ${e.id}: ${el.id} area libre sin pos` });
      if (el.entrada === 'traer') {
        const pj = e.elementos.find((x) => x.id === el.traidoPor);
        if (!pj || pj.tipo !== 'personaje') ctx.addIssue({ code: 'custom', message: `escena ${e.id}: ${el.id} se trae pero "traidoPor" no es un personaje de la escena` });
        else if (pj.paso > el.paso) ctx.addIssue({ code: 'custom', message: `escena ${e.id}: ${el.id} se trae en el paso ${el.paso} pero ${pj.id} aparece en el ${pj.paso}` });
      }
    }
  });
export type Escena = z.infer<typeof Escena>;

export const VersionDeck = z
  .object({
    id,
    titulo: z.string(),
    audiencia: z.string(),
    duracionObjetivo: z.number().int().min(30),
    /** Tolerancia: la suma de duraciones no puede superar objetivo + tolerancia. */
    tolerancia: z.number().int().min(0).default(0),
    escenas: z.array(id).min(1),
    anexos: z.array(id).default([]),
    /** Duración de escena propia de esta versión (segundos); si falta, se usa la de la escena. */
    duraciones: z.record(z.string(), z.number().int().min(3).max(900)).default({}),
  })
  .strict();

export const Recurso = z
  .object({
    id,
    tipo: z.enum(['imagen', 'video', 'audio', 'fuente']),
    archivo: z.string(),
    procedencia: z.string(),
    licencia: z.string(),
    estado: z.enum(['final', 'temporal', 'faltante']),
    respaldo: z.string().optional(),
  })
  .strict();
export type Recurso = z.infer<typeof Recurso>;

export const Deck = z
  .object({
    versionEsquema: z.literal(VERSION_ESQUEMA),
    id,
    titulo: z.string(),
    idioma: z.string().default('es-AR'),
    tema: id,
    /** Deck del que se toman afirmaciones y QR (misma base factual para varias presentaciones). */
    datosDe: id.optional(),
    /** Cómo aparece en el hub de presentaciones. */
    hub: z
      .object({ grupo: z.string(), descripcion: z.string(), orden: z.number().int().default(50), estilo: z.string().optional(), visible: z.boolean().default(true) })
      .strict()
      .optional(),
    corte: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** borrador: admite QR provisorios. final: el validador exige destinos definitivos. */
    estado: z.enum(['borrador', 'final']),
    versiones: z.array(VersionDeck).min(1),
    escenas: z.array(Escena).min(1),
    recursos: z.array(Recurso).default([]),
  })
  .strict();
export type Deck = z.infer<typeof Deck>;
export type VersionDeck = z.infer<typeof VersionDeck>;

// ── Tema de marca ────────────────────────────────────────────────────────────
const Paleta = z.object({ fondo: z.string(), tinta: z.string(), acento: z.string(), suave: z.string(), superficie: z.string(), marcador: z.string().optional(), marcadorTinta: z.string().optional(), tintaSuperficie: z.string().optional() }).strict();
export const Personaje = z
  .object({
    nombre: z.string(),
    rol: z.string(),
    poses: z.object({ reposo: z.string(), saludo: z.string(), festejo: z.string(), accion: z.string() }).strict(),
    /** Fila de la lámina de origen; documenta procedencia. */
    origen: z.string(),
  })
  .strict();
export const Tema = z
  .object({
    id,
    nombre: z.string(),
    logo: z.string().optional(),
    fuentes: z.object({ titulos: z.string(), texto: z.string() }).strict(),
    colores: z.record(z.string(), z.string()),
    paletas: z.record(z.string(), Paleta),
    radios: z.object({ chico: z.string(), medio: z.string(), grande: z.string() }).strict(),
    personajes: z.record(z.string(), Personaje).default({}),
    pie: z.string().default(''),
    /** Tema que comparte los archivos de otra marca (personajes, video, capturas). */
    assetsDe: id.optional(),
    titulos: z.object({ peso: z.number().int().min(400).max(900), ancho: z.string() }).strict().optional(),
  })
  .strict()
  .refine((t) => 'neutro' in t.paletas, 'el tema necesita una paleta "neutro"');
export type Tema = z.infer<typeof Tema>;

// ── Versión publicada (congelada) ───────────────────────────────────────────
export const VersionPublicada = z
  .object({
    deck: id,
    etiqueta: z.string(),
    huella: z.string().regex(/^[a-f0-9]{16,64}$/),
    publicada: z.string(),
    corte: z.string(),
  })
  .strict();
export type VersionPublicada = z.infer<typeof VersionPublicada>;
