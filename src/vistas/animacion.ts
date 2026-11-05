// Vista de trabajo (solo en desarrollo): monta una animación de un deck a 1920 × 1080 y la deja en un punto p.
// Uso: /animacion/?deck=<deck>&escena=<id>&p=1.5 · window.irA(p) para capturas · window.listo cuando cargó.
import { iniciar } from './comun.ts';
import { contextoAnimacion, type Animacion } from '../render/animacion.ts';
import { paleta, variablesTema } from '../render/reproductor.ts';
import { Elemento } from '../core/esquema.ts';

const raiz = document.getElementById('app') as HTMLElement;
const s = iniciar();
const q = new URLSearchParams(location.search);
declare global {
  interface Window {
    irA?: (p: number) => void;
    listo?: Promise<void>;
  }
}
if ('error' in s) raiz.textContent = s.error.join(' · ');
else {
  // ?modulo=<nombre>&afirmaciones=ID,ID&paleta=<paleta> prueba un módulo nuevo sin tocar el deck.
  const directo = q.get('modulo');
  const escena = directo
    ? { paleta: q.get('paleta') ?? 'neutro', elementos: [Elemento.parse({ id: 'anim', tipo: 'animacion', modulo: directo, alt: directo, tiempos: [1], afirmaciones: (q.get('afirmaciones') ?? '').split(',').filter(Boolean), area: 'fondo', entrada: 'ninguna' })] }
    : s.paquete.deck.escenas.find((e) => e.id === q.get('escena'));
  const el = escena?.elementos.find((x) => x.tipo === 'animacion');
  if (!escena || !el || el.tipo !== 'animacion') raiz.textContent = 'Escena sin animación';
  else {
    const escenario = document.createElement('div');
    escenario.setAttribute('style', `${variablesTema(s.paquete.tema)};${paleta(s.paquete.tema, escena.paleta)};position:relative;width:1920px;height:1080px;overflow:hidden;background:var(--fondo)`);
    const host = document.createElement('div');
    host.setAttribute('style', 'position:absolute;inset:0');
    escenario.append(host);
    raiz.append(escenario);
    const sombra = host.attachShadow({ mode: 'open' });
    const reducido = q.get('reducido') === '1';
    window.listo = (async () => {
      const crear = await s.ctx.cargarAnimacion?.(el.modulo);
      if (!crear) throw new Error(`no existe la animación ${el.modulo}`);
      const anim: Animacion = await crear(sombra, contextoAnimacion(el, { ...s.ctx, reducido }));
      anim.congelar(q.get('congelar') !== '0');
      window.irA = (p) => anim.ir(p);
      anim.ir(Number(q.get('p') ?? 0));
    })();
  }
}
