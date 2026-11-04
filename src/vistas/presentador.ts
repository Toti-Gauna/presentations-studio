// Vista del presentador (anfitrión): escena actual y siguiente, notas, guion, reloj, índice,
// pantalla negra, audio, recuperación, ensayo y emparejamiento del celular por QR privado.
import { aplicar, tiempoReloj, type Comando, type Estado } from '../core/estado.ts';
import { svg } from '../core/qr.ts';
import { modoMovimiento, Reproductor } from '../render/reproductor.ts';
import { h, marcado } from '../render/dom.ts';
import { Anfitrion, type EstadoRemoto } from '../transporte/anfitrion.ts';
import { servidorPermitido } from '../transporte/remoto.ts';
import { iniciar, mmss, pantallaError, precargar, teclas, type Sesion } from './comun.ts';
import '../estilos/presentador.css';

const raiz = document.getElementById('app') as HTMLElement;
/** Atajos de anexos: Mayús + letra (e.key llega en mayúscula; la b minúscula sigue siendo pantalla negra). */
const LETRAS = 'ABCDEFGHIJ';
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
  const progresoBarra = $('span', 'progreso-barra');
  const progreso = h('div', { class: 'progreso', role: 'progressbar', 'aria-label': 'Tiempo usado del objetivo', 'aria-valuemin': '0', 'aria-valuemax': String(s.version.duracionObjetivo) }, progresoBarra);
  const btnNotas = boton('Ocultar notas (N)', () => alternarNotas(), 'secundario', 'Ensayar sin ayuda: oculta notas y guion');
  const btnNegro = boton('Pantalla negra (B)', () => ejecutar({ tipo: 'negro', valor: !anf.estado.negro }), 'secundario');
  const barra = $(
    'header',
    'barra',
    $('div', 'barra-titulo', h('strong', {}, s.paquete.deck.titulo), h('span', {}, ` · ${s.version.titulo}`), huella),
    $('div', 'barra-tiempo', reloj, restante, progreso),
    $('div', 'barra-acciones',
      boton('Abrir pantalla pública', abrirPublica, 'primario'),
      boton('Activar audio', () => (actual.desbloquearAudio(), alert('Audio habilitado en esta computadora. La pantalla pública también necesita un clic propio si está en otra ventana.')), 'secundario'),
      btnNegro,
      boton('Recuperar', () => anf.recuperar(), 'secundario', 'Reenvía el estado de esta computadora a todas las pantallas'),
      boton('▶ Reloj', () => ejecutar({ tipo: 'reloj', accion: anf.estado.reloj.corriendo ? 'pausar' : 'iniciar' }), 'secundario'),
      boton('⟲', () => ejecutar({ tipo: 'reloj', accion: 'reiniciar' }), 'secundario', 'Reiniciar reloj'),
      boton('■ Finalizar', () => finalizarEnsayo(), 'secundario', 'Detiene el reloj y registra el tiempo del ensayo'),
      boton('Nuevo ensayo', () => nuevoEnsayo(), 'secundario', 'Vuelve a la primera diapositiva y pone el reloj y los tiempos en cero (sin recargar)'),
      btnNotas,
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

  const actual = new Reproductor(vistaActual, s.escenas, s.paquete.tema, s.ctx, { pie: true, modo: modoMovimiento(s.version.movimiento) });
  const siguiente = new Reproductor(vistaSiguiente, s.escenas, s.paquete.tema, s.ctx, { modo: 'reducido', pie: false });
  void precargar(actual.escenario, (a, b) => (recursos.textContent = a >= b ? `Recursos listos ${a}/${b}` : `Precargando ${a}/${b}`));

  s.escenas.forEach((e, i) => {
    const li = h('li', { class: i >= s.principales ? 'anexo' : '' });
    if (i === s.principales) indice.append(h('li', { class: 'separador-anexos' }, `Anexos (fuera del recorrido) · Mayús + ${LETRAS.slice(0, s.escenas.length - s.principales).split('').join('/')} · volver: 0`));
    const b = boton(`${i + 1}. ${e.titulo}`, () => ejecutar({ tipo: 'ir', escena: i }), 'item');
    li.append(b, h('span', { class: 'dur' }, `${e.duracion}s`));
    indice.append(li);
  });

  // ── Ensayo: tiempo por escena medido con el reloj (si el reloj está en pausa, no suma) ──
  const objetivoMs = s.version.duracionObjetivo * 1000;
  const enEscena = new Map<number, number>();
  const ahoraReloj = () => tiempoReloj(anf.estado.reloj, Date.now());
  let entrada = { escena: anf.estado.escena, t: ahoraReloj() };
  const intentos: Array<{ total: number; porEscena: number[] }> = [];
  const claveIntentos = `ensayos:${s.paquete.deck.id}:${s.version.id}`;
  try {
    intentos.push(...(JSON.parse(sessionStorage.getItem(claveIntentos) ?? '[]') as typeof intentos));
  } catch {
    /* sin registro previo */
  }
  const inicioDe = (i: number) => s.escenas.slice(0, i).reduce((a, e) => a + e.duracion, 0);
  function registrarEscena(e: Estado) {
    const t = ahoraReloj();
    if (t < entrada.t) entrada = { escena: entrada.escena, t }; // reloj reiniciado
    if (e.escena === entrada.escena) return;
    enEscena.set(entrada.escena, (enEscena.get(entrada.escena) ?? 0) + (t - entrada.t));
    entrada = { escena: e.escena, t };
  }
  const realDe = (i: number) => (enEscena.get(i) ?? 0) + (i === entrada.escena ? Math.max(0, ahoraReloj() - entrada.t) : 0);
  function pintarTiempos() {
    const filas = s.escenas.slice(0, s.principales).map((e, i) => {
      const real = realDe(i);
      const pasado = real > e.duracion * 1000 * 1.15;
      return h('tr', { class: `${pasado ? 'excedido' : ''} ${i === anf.estado.escena ? 'actual' : ''}` }, h('td', {}, `${i + 1}`), h('td', {}, e.titulo), h('td', {}, `${mmss(inicioDe(i) * 1000)}–${mmss(inicioDe(i + 1) * 1000)}`), h('td', {}, `${e.duracion}s`), h('td', {}, real >= 500 ? `${Math.round(real / 1000)}s${pasado ? ' · excedida' : ''}` : '—'));
    });
    const lista = intentos.map((x, k) => h('li', { class: x.total <= objetivoMs ? 'dentro' : 'fuera' }, `Ensayo ${k + 1}: ${mmss(x.total)} · ${x.total <= objetivoMs ? `dentro de ${mmss(objetivoMs)} ✓` : `excedido por ${mmss(x.total - objetivoMs)}`}`));
    tiempos.replaceChildren(
      h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, '#'), h('th', {}, 'Diapositiva'), h('th', {}, 'Tramo'), h('th', {}, 'Objetivo'), h('th', {}, 'Real'))), h('tbody', {}, ...filas)),
      ...(intentos.length ? [h('ol', { class: 'intentos' }, ...lista)] : [h('p', { class: 'ayuda-ensayo' }, '▶ Reloj (R) para empezar · ■ Finalizar registra el tiempo · Nuevo ensayo vuelve a cero sin recargar.')]),
    );
  }
  function finalizarEnsayo() {
    if (anf.estado.reloj.corriendo) ejecutar({ tipo: 'reloj', accion: 'pausar' });
    registrarEscena({ ...anf.estado, escena: -1 });
    const total = ahoraReloj();
    if (total < 1000) return;
    intentos.push({ total, porEscena: s.escenas.slice(0, s.principales).map((_, i) => enEscena.get(i) ?? 0) });
    try {
      sessionStorage.setItem(claveIntentos, JSON.stringify(intentos.slice(-20)));
    } catch {
      /* el registro queda en esta pestaña */
    }
    pintarTiempos();
  }
  function nuevoEnsayo() {
    ejecutar({ tipo: 'reloj', accion: 'reiniciar' });
    ejecutar({ tipo: 'reiniciar' });
    enEscena.clear();
    entrada = { escena: 0, t: 0 };
    pintarTiempos();
  }
  function alternarNotas() {
    const oculto = document.body.classList.toggle('sin-notas');
    btnNotas.textContent = oculto ? 'Mostrar notas (N)' : 'Ocultar notas (N)';
  }
  const primeraOracion = (t: string) => (t.split(/(?<=[.!?…»])\s+/)[0] ?? '').trim();

  let escenaAnterior = -1;
  function pintar(e: Estado) {
    // Video con "auto": al entrar a la escena se ordena reproducir (pasa por el estado, así todas las pantallas quedan sincronizadas).
    const clave = e.escena * 1000 + e.paso;
    if (clave !== escenaAnterior) {
      const primera = escenaAnterior === -1;
      escenaAnterior = clave;
      if (primera) return actual.mostrar(e), void pintarResto(e);
      const auto = s.escenas[e.escena]?.elementos.find((x) => x.tipo === 'video' && x.auto && x.paso === e.paso) as { recurso: string } | undefined;
      if (auto && e.reproduccion.medio !== auto.recurso) queueMicrotask(() => ejecutar({ tipo: 'reproducir', medio: auto.recurso }));
    }
    actual.mostrar(e);
    pintarResto(e);
  }
  function pintarResto(e: Estado) {
    const sig = aplicar(e, { tipo: 'siguiente' }, s.forma, Date.now());
    siguiente.mostrar({ ...sig, negro: false, reproduccion: { medio: null, reproduciendo: false, posicion: 0, desde: null } });
    etiquetaSiguiente.textContent = sig === e ? 'Fin del recorrido' : sig.escena === e.escena ? `Siguiente: paso ${sig.paso + 1}/${s.forma.pasos[e.escena]}` : `Siguiente: ${s.escenas[sig.escena]?.titulo}`;
    const esc = s.escenas[e.escena];
    if (esc) {
      notas.innerHTML = marcado(esc.notas || '—').replace(/\n/g, '<br>');
      const prox = e.escena + 1 < s.principales ? s.escenas[e.escena + 1] : undefined;
      const tramo = e.escena < s.principales ? `<p class="tramo"><strong>Diapositiva ${e.escena + 1} de ${s.principales}</strong> · tramo ${mmss(inicioDe(e.escena) * 1000)}–${mmss(inicioDe(e.escena + 1) * 1000)} (${esc.duracion} s)</p>` : '<p class="tramo"><strong>Anexo</strong> · fuera del cronómetro</p>';
      const transicion = prox ? `<p class="transicion"><strong>Próxima transición:</strong> «${marcado(primeraOracion(prox.guion))}»</p>` : '';
      guion.innerHTML = `${tramo}<p class="objetivo"><strong>Objetivo:</strong> ${marcado(esc.objetivo)}</p><p class="texto-guion">${marcado(esc.guion).replace(/\n/g, '<br>')}</p>${transicion}${esc.preguntas ? `<p class="preguntas"><strong>Si preguntan:</strong> ${marcado(esc.preguntas)}</p>` : ''}`;
      medios.replaceChildren(...esc.elementos.filter((x) => x.tipo === 'video').map((v) => boton(e.reproduccion.medio === (v as { recurso: string }).recurso && e.reproduccion.reproduciendo ? `⏸ Pausar ${v.id}` : `▶ Reproducir ${v.id}`, () => ejecutar(e.reproduccion.reproduciendo && e.reproduccion.medio === (v as { recurso: string }).recurso ? { tipo: 'pausar' } : { tipo: 'reproducir', medio: (v as { recurso: string }).recurso }))));
    }
    indice.querySelectorAll('li:not(.separador-anexos)').forEach((li, i) => li.classList.toggle('actual', i === e.escena));
    btnNegro.classList.toggle('activo', e.negro);
    registrarEscena(e);
  }
  anf.on('estado', pintar);
  pintar(anf.estado);

  // Un refresco accidental no vuelve a la primera pantalla: la posición se recuerda en esta pestaña.
  const claveRecuerdo = `presentador:${s.paquete.deck.id}:${s.version.id}`;
  let ultimaPrincipal = 0;
  // Anfitrion admite un solo oyente por evento: se reemplaza por uno que pinta y además recuerda.
  anf.on('estado', (e) => {
    pintar(e);
    if (e.escena < s.principales) ultimaPrincipal = e.escena;
    try {
      sessionStorage.setItem(claveRecuerdo, JSON.stringify({ escena: e.escena, paso: e.paso }));
    } catch {
      /* sin almacenamiento: no se recuerda */
    }
  });
  try {
    const previo = JSON.parse(sessionStorage.getItem(claveRecuerdo) ?? 'null') as { escena?: number; paso?: number } | null;
    if (previo && Number.isInteger(previo.escena) && (previo.escena ?? 0) > 0) ejecutar({ tipo: 'ir', escena: previo.escena as number, paso: previo.paso ?? 0 });
  } catch {
    /* arranca en la primera */
  }
  const anexos: Record<string, () => void> = { '0': () => ejecutar({ tipo: 'ir', escena: ultimaPrincipal, paso: (s.forma.pasos[ultimaPrincipal] ?? 1) - 1 }) };
  for (let k = 0; k < s.escenas.length - s.principales && k < LETRAS.length; k++) anexos[LETRAS[k] as string] = () => ejecutar({ tipo: 'ir', escena: s.principales + k });

  window.setInterval(() => {
    const t = tiempoReloj(anf.estado.reloj, Date.now());
    reloj.textContent = mmss(t);
    const queda = s.version.duracionObjetivo * 1000 - t;
    restante.textContent = ` / ${mmss(s.version.duracionObjetivo * 1000)} · quedan ${mmss(queda)}`;
    restante.classList.toggle('alerta', queda < 30_000);
    progresoBarra.style.width = `${Math.min(100, (t / objetivoMs) * 100)}%`;
    progreso.classList.toggle('excedido', t > objetivoMs);
    progreso.setAttribute('aria-valuenow', String(Math.round(t / 1000)));
    const lat = anf.latencia();
    if (anf.remotoEstado === 'conectado' && lat !== null) indicador.textContent = `Remoto conectado · ${lat} ms`;
    pintarTiempos();
  }, 500);

  teclas(ejecutar, {
    b: () => ejecutar({ tipo: 'negro', valor: !anf.estado.negro }),
    '.': () => ejecutar({ tipo: 'negro', valor: !anf.estado.negro }),
    r: () => ejecutar({ tipo: 'reloj', accion: anf.estado.reloj.corriendo ? 'pausar' : 'iniciar' }),
    n: () => alternarNotas(),
    f: () => void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()),
    ...anexos,
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
  // ¿Hay servidor de control? En una publicación solo estática (hosting compartido) no: se avisa y el teclado sigue.
  // En el plan gratis de Render el servidor duerme tras 15 min sin tráfico y tarda ~1 min en despertar: se espera hasta
  // 90 s avisando, y mientras esta pestaña esté abierta se lo consulta cada 4 min para que no se duerma en medio del pitch.
  if (servidorDefecto) {
    const ayuda = panelRemoto.querySelector('.ayuda')!;
    const textoAyuda = ayuda.textContent;
    const salud = async (espera: number): Promise<boolean> => {
      const ctl = new AbortController();
      const corte = window.setTimeout(() => ctl.abort(), espera);
      try {
        const r = await fetch(`${servidorDefecto}/salud`, { signal: ctl.signal, credentials: 'omit', cache: 'no-store' });
        return r.ok && ((await r.json()) as { ok?: boolean }).ok === true;
      } catch {
        return false;
      } finally {
        window.clearTimeout(corte);
      }
    };
    void (async () => {
      if (!(await salud(2500))) {
        ayuda.textContent = 'Despertando el servidor de control (puede tardar hasta un minuto)… El teclado y el clicker ya funcionan.';
        const hasta = Date.now() + 90_000;
        let listo = false;
        while (!listo && Date.now() < hasta) listo = await salud(Math.max(1000, Math.min(30_000, hasta - Date.now())));
        if (!listo) {
          ayuda.textContent = 'No hay servidor de control: el celular no está disponible. El teclado y el clicker funcionan igual.';
          panelRemoto.classList.add('sin-servidor');
          return;
        }
        ayuda.textContent = textoAyuda;
      }
      window.setInterval(() => void salud(30_000), 4 * 60_000);
    })();
  }
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
