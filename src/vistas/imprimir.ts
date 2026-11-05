// Exportación estática: todas las escenas en su último paso (PDF de respaldo) o, con
// ?modo=lectura, un documento autónomo con texto de lectura y fuentes por escena.
// No conserva animaciones: es un respaldo legible, no una copia del vivo.
import { estadoInicial } from '../core/estado.ts';
import { formatear, ROTULOS } from '../core/afirmaciones.ts';
import { Reproductor } from '../render/reproductor.ts';
import { h, marcado } from '../render/dom.ts';
import { iniciar, pantallaError, precargar } from './comun.ts';
import '../estilos/imprimir.css';

const raiz = document.getElementById('app') as HTMLElement;
const s = iniciar();
const lectura = new URLSearchParams(location.search).get('modo') === 'lectura';
const conAnexos = new URLSearchParams(location.search).get('anexos') !== 'no';
if ('error' in s) pantallaError(raiz, s.error, false);
else {
  document.body.classList.add(lectura ? 'modo-lectura' : 'modo-diapositivas');
  const escenas = conAnexos ? s.escenas : s.escenas.slice(0, s.principales);
  const corte = s.paquete.deck.corte.split('-').reverse().join('/');
  if (lectura)
    raiz.append(
      h('section', { class: 'hoja portada-lectura' },
        h('h1', {}, s.paquete.deck.titulo),
        h('p', {}, `${s.version.titulo} · documento de lectura para después de la reunión`),
        h('p', {}, `Corte de datos: ${corte} · versión ${s.cargado.publicada ?? 'de trabajo'} (${s.cargado.huella.slice(0, 8)})`),
        h('p', { class: 'nota' }, 'Cada cifra indica si es un dato observado, informado, supuesto, proyección u objetivo. Las proyecciones no son resultados.'),
      ),
    );
  const usadas = new Set<string>();
  escenas.forEach((e, i) => {
    // Si algo sale de escena en un paso, el último paso no muestra todo: en diapositivas se imprime una página por paso.
    // Las animaciones también: cada paso muestra un momento distinto de la escena.
    const conSalidas = !lectura && e.elementos.some((x) => x.sale !== undefined || x.tipo === 'animacion');
    const pasos = conSalidas ? Array.from({ length: e.pasos }, (_, k) => k) : [e.pasos - 1];
    let hoja = h('section', { class: 'hoja' });
    for (const paso of pasos) {
      const marco = h('div', { class: 'marco' });
      hoja = h('section', { class: 'hoja', 'data-escena': e.id, 'data-paso': String(paso) }, marco);
      raiz.append(hoja);
      const rep = new Reproductor(marco, escenas, s.paquete.tema, s.ctx, { modo: 'reducido', escalar: lectura, pie: true });
      rep.mostrar({ ...estadoInicial(), escena: i, paso });
    }
    for (const r of e.referencias) usadas.add(r);
    for (const m of JSON.stringify(e.elementos).matchAll(/\{\{([A-Z][A-Z0-9-]+)\}\}|"afirmacion":"([A-Z][A-Z0-9-]+)"/g)) usadas.add((m[1] ?? m[2]) as string);
    if (lectura) {
      const texto = h('div', { class: 'lectura' }, h('h2', {}, `${i + 1}. ${e.titulo}${i >= s.principales ? ' (anexo)' : ''}`));
      const cuerpo = h('div');
      cuerpo.innerHTML = (e.lectura || e.guion).split(/\n\n+/).map((p) => `<p>${marcado(p)}</p>`).join('');
      texto.append(cuerpo);
      const refs = e.referencias.map((r) => s.ctx.afirmaciones.get(r)).filter(Boolean);
      if (refs.length) texto.append(h('p', { class: 'refs' }, 'Datos: ' + refs.map((a) => `${a?.descripcion} (${a ? ROTULOS[a.tipo] : ''}; fuente: ${a?.fuente})`).join(' · ')));
      hoja.append(texto);
    }
  });
  if (lectura) {
    const filas = [...usadas].map((id) => s.ctx.afirmaciones.get(id)).filter((a): a is NonNullable<typeof a> => Boolean(a));
    raiz.append(
      h('section', { class: 'hoja fuentes' },
        h('h2', {}, 'Fuentes, supuestos y estado de verificación'),
        h('table', {},
          h('thead', {}, h('tr', {}, ...['Dato', 'Valor', 'Tipo', 'Fuente', 'Corte', 'Verificación'].map((c) => h('th', {}, c)))),
          h('tbody', {}, ...filas.map((a) => h('tr', {}, h('td', {}, a.descripcion), h('td', {}, `${formatear(a)} ${a.unidad}`), h('td', {}, ROTULOS[a.tipo]), h('td', {}, `${a.fuente}${a.pagina ? ` (p. ${a.pagina})` : ''}`), h('td', {}, a.corte), h('td', {}, a.verificacion)))),
        ),
      ),
    );
  }
  void precargar(raiz).then(() => (document.body.dataset['listo'] = '1'));
}
