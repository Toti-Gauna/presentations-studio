// Vista del presentador (anfitrión): escena actual y siguiente, notas, guion, reloj, índice,
// pantalla negra, audio, recuperación, ensayo y emparejamiento del celular por QR privado.
import { aplicar, tiempoReloj, type Comando, type Estado } from '../core/estado.ts';
import { svg } from '../core/qr.ts';
import { Reproductor } from '../render/reproductor.ts';
import { h, marcado } from '../render/dom.ts';
import { Anfitrion, type EstadoRemoto } from '../transporte/anfitrion.ts';
import { servidorPermitido } from '../transporte/remoto.ts';
import { iniciar, mmss, pantallaError, precargar, teclas, type Sesion } from './comun.ts';
import '../estilos/presentador.css';

const raiz = document.getElementById('app') as HTMLElement;
const s = iniciar();
if ('error' in s) pantallaError(raiz, s.error, false);
else montar(s);

function montar(s: Sesion) {
  document.title = `Presentador · ${s.paquete.deck.titulo}`;
  const anf = new Anfitrion(s.forma, s.paquete.deck.id, s.version.id);
  const ejecutar = (c: Comando) => anf.ejecutar(c);
  const urlPublica = new URL(`../presentar/${location.search}`, location.href).toString();

  const $ = <K extends keyof HTMLElementTagNameMap>(tag: K, clase: string, ...hijos: Array<Node | string>) => h(tag, { class: clase }, ...hijos);
  const boton = (texto: string, accion: () => void, clase = '', titulo?: string) => {
    const b = h('button', { type: 'button', class: `btn ${clase}`, title: titulo }, texto);
    b.addEventListener('click', accion);
    return b;
  };

  // ── Estructura ──
  const indicador = $('span', 'conexion', 'Local');
  const reloj = $('span', 'reloj', '0:00');
  const restante = $('span', 'restante', '');
  const huella = $('span', 'huella', `v ${s.cargado.publicada ?? 'trabajo'} · ${s.cargado.huella.slice(0, 8)} · corte ${s.paquete.deck.corte.split('-').reverse().join('/')}`);
  const recursos = $('span', 'recursos', 'Precargando…');
  const btnNegro = boton('Pantalla negra (B)', () => ejecutar({ tipo: 'negro', valor: !anf.estado.negro }), 'secundario');
  const barra = $(
    'header',
    'barra',
    $('div', 'barra-titulo', h('strong', {}, s.paquete.deck.titulo), h('span', {}, ` · ${s.version.titulo}`), huella),
    $('div', 'barra-tiempo', reloj, restante),
    $('div', 'barra-acciones',
      boton('Abrir pantalla pública', abrirPublica, 'primario'),
      boton('Activar audio', () => (actual.desbloquearAudio(), alert('Audio habilitado en esta computadora. La pantalla pública también necesita un clic propio si está en otra ventana.')), 'secundario'),
      btnNegro,
      boton('Recuperar', () => anf.recuperar(), 'secundario', 'Reenvía el estado de esta computadora a todas las pantallas'),
      boton('▶ Reloj', () => ejecutar({ tipo: 'reloj', accion: anf.estado.reloj.corriendo ? 'pausar' : 'iniciar' }), 'secundario'),
      boton('⟲', () => ejecutar({ tipo: 'reloj', accion: 'reiniciar' }), 'secundario', 'Reiniciar reloj'),
      indicador, recursos),
  );
  const vistaActual = $('div', 'monitor monitor-actual');
  const vistaSiguiente = $('div', 'monitor monitor-siguiente');
  const etiquetaSiguiente = $('div', 'etiqueta-monitor', 'Siguiente');
  const notas = $('div', 'notas');
  const guion = $('div', 'guion');
  const indice = $('ol', 'indice');
  const tiempos = $('div', 'tiempos');
  const panelRemoto = $('section', 'remoto');
  const manual = $('p', 'manual', 'Si el navegador bloquea la ventana: abrí ', h('a', { href: urlPublica, target: '_blank', rel: 'noopener' }, 'la pantalla pública'), ' y arrastrala al proyector (F = pantalla completa).');
  const controles = $('div', 'controles',
    boton('◀ Anterior', () => ejecutar({ tipo: 'anterior' }), 'grande'),
    boton('Siguiente ▶', () => ejecutar({ tipo: 'siguiente' }), 'grande primario'),
    boton('⏮ Escena', () => ejecutar({ tipo: 'escenaAnterior' })),
    boton('Escena ⏭', () => ejecutar({ tipo: 'escenaSiguiente' })),
  );
  const medios = $('div', 'medios');
  raiz.append(barra, $('main', 'tablero',
    $('section', 'col-escenas', $('div', 'etiqueta-monitor', 'En pantalla'), vistaActual, controles, medios, etiquetaSiguiente, vistaSiguiente, manual),
    $('section', 'col-notas', h('h2', {}, 'Notas privadas'), notas, h('h2', {}, 'Guion'), guion, h('h2', {}, 'Ensayo'), tiempos),
    $('section', 'col-indice', h('h2', {}, 'Escenas'), indice, panelRemoto),
  ));

  const actual = new Reproductor(vistaActual, s.escenas, s.paquete.tema, s.ctx, { pie: true });
  const siguiente = new Reproductor(vistaSiguiente, s.escenas, s.paquete.tema, s.ctx, { modo: 'reducido', pie: false });
  void precargar(actual.escenario, (a, b) => (recursos.textContent = a >= b ? `Recursos listos ${a}/${b}` : `Precargando ${a}/${b}`));

  s.escenas.forEach((e, i) => {
    const li = h('li', { class: i >= s.principales ? 'anexo' : '' });
    const b = boton(`${i + 1}. ${e.titulo}`, () => ejecutar({ tipo: 'ir', escena: i }), 'item');
    li.append(b, h('span', { class: 'dur' }, `${e.duracion}s`));
    indice.append(li);
  });

  // ── Ensayo: tiempo real por escena vs. previsto ──
  const enEscena = new Map<number, number>();
  let entrada = { escena: 0, t: Date.now() };
  function registrarEscena(e: Estado) {
    if (e.escena === entrada.escena) return;
    enEscena.set(entrada.escena, (enEscena.get(entrada.escena) ?? 0) + (Date.now() - entrada.t));
    entrada = { escena: e.escena, t: Date.now() };
  }
  function pintarTiempos() {
    const filas = s.escenas.slice(0, s.principales).map((e, i) => {
      const real = (enEscena.get(i) ?? 0) + (i === entrada.escena ? Date.now() - entrada.t : 0);
      const pasado = real > e.duracion * 1000 * 1.15;
      return h('tr', { class: pasado ? 'excedido' : '' }, h('td', {}, `${i + 1}`), h('td', {}, e.titulo), h('td', {}, `${e.duracion}s`), h('td', {}, real ? `${Math.round(real / 1000)}s${pasado ? ' · excedida' : ''}` : '—'));
    });
    tiempos.replaceChildren(h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, '#'), h('th', {}, 'Escena'), h('th', {}, 'Prevista'), h('th', {}, 'Real'))), h('tbody', {}, ...filas)));
  }

  let escenaAnterior = -1;
  function pintar(e: Estado) {
    // Video con "auto": al entrar a la escena se ordena reproducir (pasa por el estado, así todas las pantallas quedan sincronizadas).
    if (e.escena !== escenaAnterior) {
      escenaAnterior = e.escena;
      const auto = s.escenas[e.escena]?.elementos.find((x) => x.tipo === 'video' && x.auto && x.paso === 0) as { recurso: string } | undefined;
      if (auto && e.reproduccion.medio !== auto.recurso) return queueMicrotask(() => ejecutar({ tipo: 'reproducir', medio: auto.recurso }));
    }
    actual.mostrar(e);
    const sig = aplicar(e, { tipo: 'siguiente' }, s.forma, Date.now());
    siguiente.mostrar({ ...sig, negro: false });
    etiquetaSiguiente.textContent = sig === e ? 'Fin del recorrido' : sig.escena === e.escena ? `Siguiente: paso ${sig.paso + 1}/${s.forma.pasos[e.escena]}` : `Siguiente: ${s.escenas[sig.escena]?.titulo}`;
    const esc = s.escenas[e.escena];
    if (esc) {
      notas.innerHTML = marcado(esc.notas || '—').replace(/\n/g, '<br>');
      guion.innerHTML = `<p class="objetivo"><strong>Objetivo:</strong> ${marcado(esc.objetivo)}</p><p>${marcado(esc.guion).replace(/\n/g, '<br>')}</p>${esc.preguntas ? `<p class="preguntas"><strong>Si preguntan:</strong> ${marcado(esc.preguntas)}</p>` : ''}`;
      medios.replaceChildren(...esc.elementos.filter((x) => x.tipo === 'video').map((v) => boton(e.reproduccion.medio === (v as { recurso: string }).recurso && e.reproduccion.reproduciendo ? `⏸ Pausar ${v.id}` : `▶ Reproducir ${v.id}`, () => ejecutar(e.reproduccion.reproduciendo && e.reproduccion.medio === (v as { recurso: string }).recurso ? { tipo: 'pausar' } : { tipo: 'reproducir', medio: (v as { recurso: string }).recurso }))));
    }
    indice.querySelectorAll('li').forEach((li, i) => li.classList.toggle('actual', i === e.escena));
    btnNegro.classList.toggle('activo', e.negro);
    registrarEscena(e);
  }
  anf.on('estado', pintar);
  pintar(anf.estado);

  window.setInterval(() => {
    const t = tiempoReloj(anf.estado.reloj, Date.now());
    reloj.textContent = mmss(t);
    const queda = s.version.duracionObjetivo * 1000 - t;
    restante.textContent = ` / ${mmss(s.version.duracionObjetivo * 1000)} · quedan ${mmss(queda)}`;
    restante.classList.toggle('alerta', queda < 30_000);
    const lat = anf.latencia();
    if (anf.remotoEstado === 'conectado' && lat !== null) indicador.textContent = `Remoto conectado · ${lat} ms`;
    pintarTiempos();
  }, 500);

  teclas(ejecutar, {
    b: () => ejecutar({ tipo: 'negro', valor: !anf.estado.negro }),
    '.': () => ejecutar({ tipo: 'negro', valor: !anf.estado.negro }),
    r: () => ejecutar({ tipo: 'reloj', accion: anf.estado.reloj.corriendo ? 'pausar' : 'iniciar' }),
  });

  function abrirPublica() {
    const w = window.open(urlPublica, 'pantalla-publica', 'popup=yes,width=1280,height=720');
    if (!w) manual.classList.add('resaltar');
  }

  // ── Control remoto ──
  const textos: Record<EstadoRemoto, string> = { apagado: 'Solo local (teclado)', conectando: 'Conectando…', conectado: 'Remoto conectado', reconectando: 'Reconectando… (sigue local)', cerrado: 'Remoto cerrado · sigue local', 'sin-confirmar': 'Sin confirmación del servidor · sigue local' };
  anf.on('remoto', (e) => {
    indicador.textContent = textos[e];
    indicador.dataset['estado'] = e;
  });
  const qr = $('div', 'qr-privado');
  const solicitudes = $('ul', 'solicitudes');
  const dispositivos = $('ul', 'dispositivos');
  const servidorDefecto = servidorPermitido(new URLSearchParams(location.search).get('servidor')) ?? servidorPermitido(null);
  const campo = h('input', { type: 'url', value: servidorDefecto ?? '', placeholder: 'https://servidor-de-sesiones', 'aria-label': 'Servidor de sesiones' });
  let vence: number | undefined;
  async function mostrarCodigo() {
    try {
      const { url, expira } = await anf.codigoControl();
      qr.innerHTML = svg(url, { titulo: 'QR privado de control' });
      qr.dataset['url'] = url; // solo en esta ventana privada; permite "Copiar enlace" si la cámara falla
      qr.append(h('p', { class: 'aviso' }, 'QR PRIVADO: no lo proyectes. Un solo uso, vence en 3 min.'));
      window.clearTimeout(vence);
      vence = window.setTimeout(() => (qr.innerHTML = '<p>Código vencido.</p>'), expira - Date.now());
    } catch {
      qr.textContent = 'No se pudo generar el código.';
    }
  }
  panelRemoto.append(
    h('h2', {}, 'Control por celular'),
    h('p', { class: 'ayuda' }, 'El teclado y el clicker siempre funcionan. El celular necesita red y el servidor de sesiones.'),
    campo,
    boton('Conectar control remoto', async () => {
      const elegido = servidorPermitido(campo.value.trim());
      if (!elegido) return alert('Servidor no permitido: debe ser el configurado en el build o el mismo origen.');
      try {
        await anf.conectar(elegido, { deck: s.paquete.deck.id, version: s.version.id, huella: s.cargado.huella.slice(0, 16), notas: s.notas });
        await mostrarCodigo();
      } catch {
        indicador.textContent = 'No se pudo conectar · sigue local';
      }
    }, 'primario'),
    boton('Nuevo QR de emparejamiento', () => void mostrarCodigo(), 'secundario'),
    boton('Copiar enlace de control', () => qr.dataset['url'] && void navigator.clipboard.writeText(qr.dataset['url']), 'secundario', 'Para abrirlo en el celular si la cámara no lee el QR (enviarlo por un canal privado)'),
    qr,
    h('h3', {}, 'Solicitudes'),
    solicitudes,
    h('h3', {}, 'Celulares autorizados'),
    dispositivos,
    boton('Revocar todos', () => anf.revocar(), 'peligro'),
    boton('Copiar enlace de pantalla pública remota', () => {
      const u = anf.urlPublicaRemota(urlPublica);
      if (u) void navigator.clipboard.writeText(u);
    }, 'secundario', 'Para proyectar desde OTRA computadora (solo lectura, sin notas)'),
    boton('Terminar sesión remota', () => void anf.terminar(), 'secundario'),
  );
  anf.on('solicitud', (sol) => {
    const li = h('li', {}, h('span', {}, `${sol.dispositivo} quiere controlar`));
    li.append(
      boton('Aprobar', () => (anf.aprobar(sol.solicitud, true), li.remove(), void mostrarCodigo()), 'primario'),
      boton('Rechazar', () => (anf.aprobar(sol.solicitud, false), li.remove()), 'peligro'),
    );
    solicitudes.append(li);
    window.setTimeout(() => li.remove(), sol.expira - Date.now());
  });
  anf.on('dispositivos', (lista) => {
    dispositivos.replaceChildren(...lista.map((d) => h('li', {}, h('span', {}, `${d.nombre} · ${d.conectado ? 'conectado' : 'desconectado'}`), boton('Revocar', () => anf.revocar(d.id), 'peligro'))));
  });
  window.addEventListener('beforeunload', () => void anf.terminar());
}
