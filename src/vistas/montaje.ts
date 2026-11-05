// Vista de trabajo (solo en desarrollo): video cuadro a cuadro con escenas animadas sincronizadas con la voz, la cara del
// presentador en el lugar que cada escena deja libre, subtítulos integrados y un cierre en cuadros ya renderizados.
// El script de render inyecta el plan con window.cargar(plan) y pide cada cuadro con window.ir(t).
import { iniciar } from './comun.ts';
import { contextoAnimacion, type Animacion } from '../render/animacion.ts';
import { paleta, variablesTema } from '../render/reproductor.ts';
import { Elemento } from '../core/esquema.ts';

interface PlanEscena { modulo: string; afirmaciones: string[]; paleta: string; desde: number; hasta: number; tiempos: number[]; pasos: Array<{ t: number; k: number }> }
interface Plan {
  dur: number;
  cruce: number;
  escenas: PlanEscena[];
  camara: { url: string; fps: number; edl: Array<[number, number, number]>; hasta: number };
  subtitulos: Array<{ t0: number; t1: number; palabras: Array<{ t0: number; t1: number; w: string }> }>;
  final: { desde: number; url: string; fps: number; desdeCuadro: number };
}
declare global {
  interface Window { cargar?: (plan: Plan) => Promise<void>; ir?: (t: number) => Promise<void> }
}
const raiz = document.getElementById('app') as HTMLElement;
const s = iniciar();
const CSS = `
.lienzo{position:relative;width:1920px;height:1080px;overflow:hidden;background:#0E1D36}
.esc{position:absolute;inset:0;opacity:0}
.cara{position:absolute;left:0;top:0;border-radius:50%;overflow:hidden;box-shadow:0 0 0 8px #FFC93C,0 18px 44px rgba(0,0,0,.4);opacity:0}
.cara img{width:100%;height:100%;object-fit:cover;display:block}
.subs{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);max-width:1500px;padding:12px 28px;border-radius:20px;background:rgba(14,29,54,.78);color:#fff;font:600 36px/1.3 'DM Sans Variable','DM Sans',sans-serif;text-align:center;opacity:0}
.subs b{color:#FFC93C;font-weight:800}
.final{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0}
`;
const pausa = (ms: number) => new Promise((r) => setTimeout(r, ms));
const facil = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
if (!('error' in s)) {
  const lienzo = document.createElement('div');
  lienzo.className = 'lienzo';
  lienzo.setAttribute('style', variablesTema(s.paquete.tema));
  const estilo = document.createElement('style');
  estilo.textContent = CSS;
  raiz.append(estilo, lienzo);
  let plan: Plan | null = null;
  const montadas: Array<{ def: PlanEscena; host: HTMLElement; anim: Animacion }> = [];
  const cara = Object.assign(document.createElement('div'), { className: 'cara' });
  const caraImg = document.createElement('img');
  cara.append(caraImg);
  const subs = Object.assign(document.createElement('div'), { className: 'subs' });
  const final = Object.assign(document.createElement('img'), { className: 'final' });
  window.cargar = async (p: Plan) => {
    plan = p;
    for (const def of p.escenas) {
      const host = document.createElement('div');
      host.className = 'esc';
      host.setAttribute('style', paleta(s.paquete.tema, def.paleta));
      lienzo.append(host);
      const el = Elemento.parse({ id: 'anim', tipo: 'animacion', modulo: def.modulo, alt: def.modulo, tiempos: def.tiempos, afirmaciones: def.afirmaciones, area: 'fondo', entrada: 'ninguna' });
      if (el.tipo !== 'animacion') continue;
      const crear = await s.ctx.cargarAnimacion?.(def.modulo);
      if (!crear) throw new Error(`no existe la animación ${def.modulo}`);
      const anim = await crear(host.attachShadow({ mode: 'open' }), contextoAnimacion(el, { ...s.ctx, reducido: true }));
      montadas.push({ def, host, anim });
    }
    lienzo.append(cara, final, subs);
    await document.fonts.ready;
  };
  const pDe = (def: PlanEscena, t: number) => {
    let p = 0;
    for (const { t: tk, k } of def.pasos) if (t >= tk) p = k + Math.min(1, (t - tk) / (def.tiempos[k] ?? 1));
    return p;
  };
  const lugar = (t: number) => {
    const m = montadas.find((x) => t >= x.def.desde && t < x.def.hasta) ?? montadas[montadas.length - 1];
    return m?.anim.cara?.(pDe(m.def, t)) ?? null;
  };
  const fuente = (t: number) => {
    for (const [desde, src, dur] of plan?.camara.edl ?? []) if (t >= desde && t < desde + dur) return src + (t - desde);
    return 0;
  };
  window.ir = async (t: number) => {
    if (!plan) return;
    const cr = plan.cruce;
    const esperas: Array<Promise<unknown>> = [];
    for (const m of montadas) {
      const { desde, hasta } = m.def;
      const op = Math.min(facil(Math.min(1, Math.max(0, (t - desde + cr / 2) / cr))), facil(Math.min(1, Math.max(0, (hasta + cr / 2 - t) / cr))));
      m.host.style.opacity = String(op);
      m.host.style.visibility = op > 0 ? 'visible' : 'hidden';
      if (op > 0) {
        m.anim.reloj?.(t - desde);
        m.anim.ir(pDe(m.def, t));
      }
    }
    // Cara: en el lugar libre de la escena; cuando el lugar cambia, viaja suave durante 0,7 s.
    const ahora = lugar(t);
    let x = ahora?.x ?? 1700, y = ahora?.y ?? 200, d = ahora?.d ?? 250;
    for (let atras = 0.1; atras <= 0.7; atras += 0.1) {
      const antes = lugar(t - atras);
      if (antes && ahora && (antes.x !== ahora.x || antes.y !== ahora.y || antes.d !== ahora.d)) {
        const k = facil(1 - atras / 0.7);
        x = antes.x + (ahora.x - antes.x) * k; y = antes.y + (ahora.y - antes.y) * k; d = antes.d + (ahora.d - antes.d) * k;
        break;
      }
    }
    const fueraCara = Math.max(0, Math.min(1, (plan.camara.hasta - t) / 0.5));
    cara.style.opacity = String(Math.min(fueraCara, Math.max(0, Math.min(1, t / 0.3))));
    cara.style.width = cara.style.height = `${d}px`;
    cara.style.transform = `translate(${x - d / 2}px, ${y - d / 2}px)`;
    const n = Math.round(fuente(t) * plan.camara.fps) + 1;
    const src = plan.camara.url.replace('{n}', String(n).padStart(5, '0'));
    if (fueraCara > 0 && caraImg.getAttribute('src') !== src) { caraImg.src = src; esperas.push(caraImg.decode().catch(() => null)); }
    // Subtítulos: la frase actual, con la palabra dicha resaltada.
    const frase = plan.subtitulos.find((f) => t >= f.t0 - 0.1 && t <= f.t1 + 0.35);
    if (frase && t < plan.final.desde) {
      subs.style.opacity = '1';
      subs.innerHTML = frase.palabras.map((w) => (t >= w.t0 && t < w.t1 + 0.12 ? `<b>${w.w}</b>` : w.w)).join(' ');
    } else subs.style.opacity = '0';
    // Cierre: cuadros ya renderizados del mundo.
    if (t >= plan.final.desde - 0.4) {
      final.style.opacity = String(Math.min(1, (t - plan.final.desde + 0.4) / 0.4));
      const nf = plan.final.desdeCuadro + Math.max(0, Math.round((t - plan.final.desde) * plan.final.fps));
      const fsrc = plan.final.url.replace('{n}', String(nf).padStart(5, '0'));
      if (final.getAttribute('src') !== fsrc) { final.src = fsrc; esperas.push(final.decode().catch(() => null)); }
    } else final.style.opacity = '0';
    await Promise.all(esperas);
    await pausa(0);
  };
}
