// Control móvil: se abre desde el QR privado. Pide emparejar, espera la aprobación del
// presentador y después manda comandos con id único y revisión base. Muestra si cada toque
// quedó confirmado. Reintenta con el MISMO id tras una reconexión (el servidor deduplica).
import '@fontsource-variable/dm-sans/wght.css';
import '../estilos/base.css';
import '../estilos/control.css';
import type { Comando, Estado, Forma } from '../core/estado.ts';
import type { MensajeServidor, NotaEscena } from '../core/protocolo.ts';
import { h, marcado } from '../render/dom.ts';
import { ConexionRemota, idComando, servidorPermitido, wsDesde, type EstadoConexion } from '../transporte/remoto.ts';

const raiz = document.getElementById('app') as HTMLElement;
const frag = new URLSearchParams(location.hash.slice(1));
history.replaceState(null, '', location.pathname); // el código no queda en la barra ni en el historial
const servidor = servidorPermitido(frag.get('srv'));
const sesion = frag.get('s');
const codigo = frag.get('c');
const CLAVE = `ps-control:${sesion}`;

const aviso = h('p', { class: 'aviso', role: 'status' });
function mensaje(t: string) {
  aviso.textContent = t;
}
raiz.append(h('h1', {}, 'Control de la presentación'), aviso);

if (!servidor || !sesion) {
  mensaje('Este enlace no es válido. Escaneá el QR privado que muestra la vista del presentador.');
} else {
  // El token de control vive en la pestaña (sessionStorage) para sobrevivir a una recarga
  // accidental; muere al cerrarla. Nunca va en la URL.
  const guardado = sessionStorage.getItem(CLAVE);
  if (guardado) controlar(servidor, sesion, guardado);
  else if (codigo) void emparejar(servidor, sesion, codigo);
  else mensaje('Escaneá de nuevo el QR privado del presentador.');
}

async function emparejar(srv: string, ses: string, cod: string) {
  mensaje('Pidiendo permiso al presentador…');
  const nombre = /iPhone|iPad/.test(navigator.userAgent) ? 'iPhone' : /Android/.test(navigator.userAgent) ? 'Android' : 'Teléfono';
  const r = await fetch(`${srv}/api/sesiones/${ses}/emparejar`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ codigo: cod, nombre }), credentials: 'omit' }).catch(() => null);
  if (!r || !r.ok) return mensaje(r?.status === 429 ? 'Demasiados intentos. Esperá un minuto.' : 'El QR ya se usó o venció. Pedí uno nuevo en la vista del presentador.');
  const { tokenEspera } = (await r.json()) as { tokenEspera: string };
  mensaje('Esperando que el presentador apruebe este teléfono…');
  const espera = new ConexionRemota(wsDesde(srv), () => ({ t: 'hola', sesion: ses, token: tokenEspera, rol: 'espera' }), (m) => {
    if (m.t === 'aprobado') {
      espera.cerrar();
      sessionStorage.setItem(CLAVE, m.tokenControl);
      controlar(srv, ses, m.tokenControl);
    }
    if (m.t === 'rechazado') {
      espera.cerrar();
      mensaje('El presentador rechazó este teléfono.');
    }
  }, () => undefined);
}

function controlar(srv: string, ses: string, token: string) {
  let estado: Estado | null = null;
  let forma: Forma = { pasos: [] };
  let notas: NotaEscena[] = [];
  let pendiente: { id: string; base: number; comando: Comando; desde: number } | null = null;
  const conexion = h('span', { class: 'conexion' }, 'Conectando…');
  const pos = h('div', { class: 'posicion' }, '—');
  const confirmacion = h('div', { class: 'confirmacion', role: 'status', 'aria-live': 'polite' }, '');
  const notasEl = h('div', { class: 'notas' });
  const lista = h('ol', { class: 'lista-escenas' });
  const boton = (texto: string, c: () => Comando, clase: string) => {
    const b = h('button', { type: 'button', class: `btn ${clase}` }, texto);
    b.addEventListener('click', () => enviar(c()));
    return b;
  };
  const btnNegro = boton('Negro', () => ({ tipo: 'negro', valor: !(estado?.negro ?? false) }), 'chico');
  raiz.replaceChildren(
    h('header', { class: 'cabecera' }, pos, conexion),
    confirmacion,
    h('div', { class: 'botonera' }, boton('◀', () => ({ tipo: 'anterior' }), 'atras'), boton('Siguiente ▶', () => ({ tipo: 'siguiente' }), 'adelante')),
    h('div', { class: 'secundarios' }, boton('⏮ Escena', () => ({ tipo: 'escenaAnterior' }), 'chico'), boton('Escena ⏭', () => ({ tipo: 'escenaSiguiente' }), 'chico'), btnNegro, boton('⏯ Medio', () => (estado?.reproduccion.reproduciendo || !medioDeEscena() ? { tipo: 'pausar' } : { tipo: 'reproducir', medio: medioDeEscena() as string }), 'chico')),
    h('details', { open: '' }, h('summary', {}, 'Notas privadas'), notasEl),
    h('details', {}, h('summary', {}, 'Saltar a escena'), lista),
  );

  function medioDeEscena(): string | null {
    return estado ? (notas[estado.escena]?.medios[0] ?? null) : null;
  }

  function pintar() {
    if (!estado) return;
    const n = notas[estado.escena];
    pos.textContent = `Escena ${estado.escena + 1}/${forma.pasos.length} · paso ${estado.paso + 1}/${forma.pasos[estado.escena] ?? 1}${estado.negro ? ' · NEGRO' : ''}`;
    notasEl.innerHTML = n ? `<strong>${marcado(n.titulo)}</strong><p>${marcado(n.notas || '—').replace(/\n/g, '<br>')}</p>` : '';
    btnNegro.classList.toggle('activo', estado.negro);
    lista.querySelectorAll('li').forEach((li, i) => li.classList.toggle('actual', i === estado?.escena));
    if (navigator.vibrate) navigator.vibrate(15);
  }

  const c = new ConexionRemota(wsDesde(srv), () => ({ t: 'hola', sesion: ses, token, rol: 'control' }), (m: MensajeServidor) => {
    switch (m.t) {
      case 'bienvenida':
        estado = m.estado;
        forma = m.forma;
        notas = m.notas ?? [];
        lista.replaceChildren(...notas.map((x, i) => {
          const li = h('li');
          const b = h('button', { type: 'button', class: 'btn item' }, `${i + 1}. ${x.titulo}`);
          b.addEventListener('click', () => enviar({ tipo: 'ir', escena: i }));
          li.append(b);
          return li;
        }));
        // Reintento del comando que quedó sin confirmar durante el corte (mismo id).
        if (pendiente && Date.now() - pendiente.desde < 5000) c.enviar({ t: 'comando', id: pendiente.id, base: pendiente.base, comando: pendiente.comando });
        else pendiente = null;
        pintar();
        break;
      case 'estado':
        estado = m.estado;
        pintar();
        break;
      case 'ack':
        if (pendiente?.id === m.id) pendiente = null;
        estado = m.estado;
        confirmacion.textContent = { aplicado: '✓ Confirmado', 'sin-cambio': '✓ Sin cambios (ya estaba ahí)', duplicado: '✓ Confirmado', obsoleto: '⚠ La presentación ya había cambiado: revisá y tocá de nuevo', invalido: '⚠ Comando no válido', prohibido: '⚠ Sin permiso' }[m.resultado];
        confirmacion.dataset['resultado'] = m.resultado;
        pintar();
        break;
      case 'revocado':
        sessionStorage.removeItem(CLAVE);
        raiz.replaceChildren(h('h1', {}, 'Control revocado'), h('p', {}, 'El presentador quitó el permiso de este teléfono.'));
        c.cerrar();
        break;
      case 'error':
        if (m.codigo === 'no-existe' || m.codigo === 'no-autorizado') {
          sessionStorage.removeItem(CLAVE);
          raiz.replaceChildren(h('h1', {}, 'Sesión terminada'), h('p', {}, 'Escaneá un QR nuevo desde la vista del presentador.'));
        }
        break;
    }
  }, (e: EstadoConexion) => {
    conexion.textContent = { conectando: 'Conectando…', conectado: 'Conectado', reconectando: 'Sin conexión · reintentando', cerrado: 'Desconectado' }[e];
    conexion.dataset['estado'] = e;
  });

  let ultimoToque = 0;
  function enviar(comando: Comando) {
    if (!estado) return;
    // Doble toque accidental: los comandos relativos dentro de 450 ms se ignoran aunque el primero ya esté confirmado.
    const relativo = comando.tipo === 'siguiente' || comando.tipo === 'anterior' || comando.tipo === 'escenaSiguiente' || comando.tipo === 'escenaAnterior';
    if (relativo && Date.now() - ultimoToque < 450) {
      confirmacion.textContent = '· toque doble ignorado';
      return;
    }
    if (relativo) ultimoToque = Date.now();
    if (pendiente && Date.now() - pendiente.desde < 1500) {
      confirmacion.textContent = '… esperando confirmación del toque anterior';
      return;
    }
    pendiente = { id: idComando(), base: estado.revision, comando, desde: Date.now() };
    confirmacion.textContent = '… enviando';
    confirmacion.dataset['resultado'] = 'pendiente';
    if (!c.enviar({ t: 'comando', id: pendiente.id, base: pendiente.base, comando })) confirmacion.textContent = '⚠ Sin conexión: se reintentará al reconectar (5 s máx.)';
  }
}
