// Plantilla de las respuestas al jurado: tres golpes (la pregunta, la respuesta con su dato armándose, los puntos clave).
// Los textos pueden llevar {{ID}}: se reemplazan con la cifra de la afirmación (nunca números escritos a mano).
import { COLOR, escena, pose, type Kit, type Personaje } from './kit.ts';

export type Viz =
  | { tipo: 'cifras'; items: Array<{ id: string; txt: string; contar?: { antes?: string; despues?: string } }> }
  | { tipo: 'cuenta'; items: Array<{ id?: string; txt: string; op?: string }> }
  | { tipo: 'barras'; total?: string; items: Array<{ id: string; txt: string }> }
  | { tipo: 'flujo'; items: Array<{ ic: string; titulo: string; txt: string }> }
  | { tipo: 'lista'; items: Array<{ ic: string; txt: string }> };

export interface DefRespuesta {
  n: number;
  total: number;
  pregunta: string;
  respuesta: string;
  puntos: Array<{ ic: string; txt: string }>;
  quien: Personaje;
  viz: Viz;
}

const md = (t: string) => t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
function rellenar(t: string, c: Kit): string {
  return md(t.replace(/\{\{([A-Z][A-Z0-9-]{1,40})\}\}/g, (_, id: string) => c.cifra(id)));
}

function vizHtml(v: Viz, c: Kit): string {
  switch (v.tipo) {
    case 'cifras':
      return `<div class="v-cifras">${v.items.map((it, i) => `<div class="v-cifra tarjeta ${i === v.items.length - 1 ? 'clave' : ''}"><div class="num t" data-i="${i}">${c.cifra(it.id)}</div><div class="lbl">${rellenar(it.txt, c)}</div></div>`).join('')}</div>`;
    case 'cuenta':
      return `<div class="v-cuenta">${v.items.map((it, i) => `${it.op ? `<div class="op t">${it.op}</div>` : ''}<div class="v-bloque tarjeta ${i === v.items.length - 1 ? 'clave' : ''}">${it.id ? `<div class="num t">${c.cifra(it.id)}</div>` : ''}<div class="lbl">${rellenar(it.txt, c)}</div></div>`).join('')}</div>`;
    case 'barras': {
      const vals = v.items.map((it) => Math.max(0, c.valor(it.id) ?? 0));
      const suma = vals.reduce((a, b) => a + b, 0) || 1;
      const colores = [COLOR.amarillo, COLOR.azul, '#3B6FC9', COLOR.azulOscuro, COLOR.naranja];
      return `<div class="v-barras">${v.total ? `<div class="tot t">${c.cifra(v.total)}</div>` : ''}<div class="barra">${v.items.map((it, i) => `<div class="seg" style="flex-grow:${(vals[i] ?? 0) / suma};background:${colores[i % colores.length]};color:${i === 0 ? COLOR.noche : '#fff'}"><b>${c.cifra(it.id)}</b><span>${rellenar(it.txt, c)}</span></div>`).join('')}</div></div>`;
    }
    case 'flujo':
      return `<div class="v-flujo">${v.items.map((it, i) => `${i ? '<div class="flecha"></div>' : ''}<div class="v-nodo tarjeta ${i === v.items.length - 1 ? 'clave' : ''}">${c.icono(it.ic)}<b>${rellenar(it.titulo, c)}</b><span>${rellenar(it.txt, c)}</span></div>`).join('')}</div>`;
    case 'lista':
      return `<div class="v-lista">${v.items.map((it) => `<div class="v-item tarjeta">${c.icono(it.ic)}<span>${rellenar(it.txt, c)}</span></div>`).join('')}</div>`;
  }
}

export function respuesta(d: DefRespuesta) {
  return escena({
    marcas: [0, 2.6, 6.4, 9.2],
    cara: [
      { desde: 0, x: 1690, y: 210, d: 250 },
      { desde: 1, x: 1700, y: 190, d: 230 },
    ],
    css: `
      .fondo { position: absolute; inset: 0; background: ${COLOR.hueso}; }
      .aro { position: absolute; border-radius: 50%; border: 60px solid rgba(31,87,168,.05); }
      .preg { position: absolute; left: 140px; top: 300px; width: 1300px; }
      .comilla { position: absolute; left: -96px; top: -40px; font-size: 220px; line-height: 1; color: ${COLOR.amarillo}; }
      .k { font-weight: 800; font-size: 24px; letter-spacing: .08em; text-transform: uppercase; color: ${COLOR.azul}; }
      .q { margin-top: 14px; font-size: 76px; line-height: 1.04; transform-origin: 0 0; }
      .q .w { display: inline-block; }
      .quien { position: absolute; left: 1560px; top: 560px; }
      .globo { position: absolute; left: 1470px; top: 470px; width: 110px; height: 80px; border-radius: 40px; background: #fff; box-shadow: 0 10px 24px rgba(14,29,54,.15); display: grid; place-items: center; font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-size: 46px; color: ${COLOR.azul}; }
      .resp { position: absolute; left: 96px; top: 230px; width: 1420px; }
      .resp .chip { box-shadow: none; border: 3px solid ${COLOR.azulOscuro}; color: ${COLOR.azulOscuro}; font-size: 20px; padding: 6px 16px; letter-spacing: .06em; text-transform: uppercase; }
      .resp .txt { margin-top: 16px; font-size: 34px; line-height: 1.32; font-weight: 600; color: ${COLOR.noche}; }
      .resp .txt .w { display: inline-block; }
      .resp b { color: ${COLOR.azul}; }
      .viz { position: absolute; left: 96px; top: 520px; width: 1500px; }
      .num { font-size: 64px; color: ${COLOR.azul}; line-height: 1; white-space: nowrap; }
      .lbl { margin-top: 10px; font-size: 22px; line-height: 1.3; color: ${COLOR.texto}; }
      .clave { background: ${COLOR.amarillo}; } .clave .num { color: ${COLOR.noche}; }
      .v-cifras { display: flex; gap: 26px; } .v-cifra { flex: 1; padding: 28px 30px; }
      .v-cuenta { display: flex; align-items: center; gap: 16px; } .v-bloque { flex: 1; padding: 22px 22px; } .v-bloque .num { font-size: 44px; }
      .op { font-size: 52px; color: ${COLOR.azul}; }
      .v-barras .tot { font-size: 58px; color: ${COLOR.azul}; margin-bottom: 14px; }
      .barra { display: flex; height: 170px; border-radius: 22px; overflow: hidden; box-shadow: 0 14px 30px rgba(14,29,54,.16); }
      .seg { display: flex; flex-direction: column; justify-content: center; padding: 0 18px; overflow: hidden; transform-origin: 0 50%; flex-basis: 0; min-width: 215px; }
      .seg b { font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-size: 32px; white-space: nowrap; }
      .seg span { font-size: 19px; line-height: 1.25; margin-top: 6px; }
      .v-flujo { display: flex; align-items: stretch; gap: 0; } .v-nodo { flex: 1; padding: 22px 24px; display: flex; flex-direction: column; gap: 8px; }
      .v-nodo b { font-family: var(--fuente-titulos, sans-serif); font-weight: 900; font-size: 32px; color: ${COLOR.azulOscuro}; } .v-nodo span { font-size: 21px; color: ${COLOR.texto}; line-height: 1.3; }
      .v-nodo .icono { width: 44px; height: 44px; }
      .flecha { width: 60px; align-self: center; height: 8px; background: ${COLOR.amarillo}; border-radius: 4px; margin: 0 6px; position: relative; }
      .flecha::after { content: ''; position: absolute; right: -6px; top: -9px; border: 13px solid transparent; border-left: 18px solid ${COLOR.amarillo}; }
      .v-lista { display: flex; gap: 22px; } .v-item { flex: 1; display: flex; align-items: center; gap: 16px; padding: 26px 24px; font-size: 26px; font-weight: 700; }
      .v-item .icono { width: 48px; height: 48px; flex: none; }
      .puntos { position: absolute; left: 96px; top: 800px; display: flex; gap: 22px; }
      .punto { display: flex; align-items: center; gap: 14px; padding: 18px 26px; font-size: 25px; font-weight: 700; }
      .punto .icono { width: 40px; height: 40px; }
    `,
    html: (c) => `
      <div class="fondo"></div>
      <div class="aro" style="left:1340px;top:-260px;width:820px;height:820px"></div>
      <div class="aro" style="left:-300px;top:640px;width:700px;height:700px"></div>
      <div class="preg"><div class="comilla t">“</div><div class="k">Posible pregunta del jurado · ${d.n} de ${d.total}</div>
        <div class="q t">${d.pregunta.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ')}</div></div>
      <div class="mov quien">${c.pj(d.quien, '', 270)}</div>
      <div class="globo">?</div>
      <div class="resp"><span class="chip">Nuestra respuesta</span><div class="txt">${rellenar(d.respuesta, c).split(/(<b>.*?<\/b>| )/).filter((w) => w && w !== ' ').map((w) => `<span class="w">${w}</span>`).join(' ')}</div></div>
      <div class="viz">${vizHtml(d.viz, c)}</div>
      <div class="puntos">${d.puntos.map((p) => `<div class="punto tarjeta">${c.icono(p.ic)}<span>${rellenar(p.txt, c)}</span></div>`).join('')}</div>
    `,
    armar(tl, $, c) {
      const ws = $.all('.q .w');
      tl.fromTo($('.k'), { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.1);
      tl.fromTo($('.comilla'), { autoAlpha: 0, scale: 0.4, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.4)' }, 0.15);
      tl.fromTo(ws, { autoAlpha: 0, y: 50, rotation: 4 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.05 }, 0.3);
      tl.fromTo($('.quien'), { autoAlpha: 0, x: 220 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'back.out(1.5)' }, 0.4);
      tl.fromTo($('.globo'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(3)' }, 1.0);
      // 1 · la pregunta sube y entra la respuesta
      tl.to($('.preg'), { x: -44, y: -250, scale: 0.6, transformOrigin: '0 0', duration: 0.7, ease: 'power3.inOut' }, 2.65);
      tl.to([$('.globo'), $('.comilla')], { autoAlpha: 0, scale: 0.5, duration: 0.3 }, 2.65);
      tl.to($('.quien'), { x: 120, y: 80, scale: 0.8, duration: 0.7, ease: 'power3.inOut' }, 2.65);
      tl.fromTo($('.resp .chip'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out' }, 3.1);
      tl.fromTo($.all('.resp .txt .w'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.025 }, 3.25);
      const bloques = $.all('.v-cifra, .v-bloque, .op, .v-nodo, .flecha, .v-item');
      if (bloques.length) tl.fromTo(bloques, { autoAlpha: 0, y: 50, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.18 }, 4.0);
      const tot = $.all('.v-barras .tot, .barra');
      if (tot.length) tl.fromTo(tot, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 3.9);
      const segs = $.all('.seg');
      if (segs.length) tl.fromTo(segs, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.55, ease: 'power3.out', stagger: 0.22 }, 4.1);
      // Conteos de las cifras numéricas
      if (d.viz.tipo === 'cifras')
        d.viz.items.forEach((it, i) => {
          const v = c.valor(it.id);
          const el = $(`.num[data-i="${i}"]`);
          if (v !== null && it.contar) c.contador(el, { t0: 4.0 + i * 0.18, dur: 1.2, hasta: v, antes: it.contar.antes ?? '', despues: it.contar.despues ?? '' });
        });
      // 2 · los puntos clave y el personaje festeja
      tl.fromTo($.all('.punto'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.9)', stagger: 0.16 }, 6.5);
      c.pintor((t) => pose($('.quien .pj'), t >= 6.6 ? 'c' : t >= 0.5 && t < 2.6 ? 'b' : 'a'));
    },
    ambiente(t, $) {
      $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${1 + Math.sin(t * 2.4 + i) * 0.02})`));
      $.all('.aro').forEach((a, i) => (a.style.transform = `rotate(${t * (i ? -6 : 8)}deg)`));
    },
  });
}
