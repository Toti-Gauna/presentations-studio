// Pantalla pública: solo el escenario. Sin notas, sin controles de sesión, sin datos privados.
// Modos: seguidor del presentador (misma computadora), autónoma con teclado, o remota (otra
// computadora, por servidor con token público de solo lectura).
import { aplicar, estadoInicial, type Comando, type Estado } from '../core/estado.ts';
import { Reproductor } from '../render/reproductor.ts';
import { CanalLocal } from '../transporte/local.ts';
import { ConexionRemota, servidorPermitido, wsDesde } from '../transporte/remoto.ts';
import { iniciar, pantallaError, precargar, teclas } from './comun.ts';
import { desbloquear, habilitarSonido } from '../render/sonido.ts';

const raiz = document.getElementById('app') as HTMLElement;
const s = iniciar();
if ('error' in s) pantallaError(raiz, s.error, true);
else {
  document.title = s.paquete.deck.titulo;
  const rep = new Reproductor(raiz, s.escenas, s.paquete.tema, s.ctx);
  // Solo la pantalla pública suena. El navegador exige un gesto en ESTA ventana: el primer clic o tecla lo habilita.
  const sinSonido = new URLSearchParams(location.search).get('sonido') === 'no';
  habilitarSonido(!sinSonido);
  const gesto = () => {
    desbloquear();
    rep.desbloquearAudio();
  };
  window.addEventListener('pointerdown', gesto, { once: true });
  window.addEventListener('keydown', gesto, { once: true });
  let estado: Estado = estadoInicial();
  rep.mostrar(estado);
  const canal = new CanalLocal(s.paquete.deck.id, s.version.id);
  let ultimoLatido = 0;
  const conAnfitrion = () => Date.now() - ultimoLatido < 2500;

  const frag = new URLSearchParams(location.hash.slice(1));
  const remoto = frag.get('s') && frag.get('v') ? servidorPermitido(frag.get('srv')) : null;
  if (remoto) {
    history.replaceState(null, '', location.pathname + location.search); // el token no queda en la barra
    const sesion = frag.get('s') as string;
    const token = frag.get('v') as string;
    new ConexionRemota(wsDesde(remoto), () => ({ t: 'hola', sesion, token, rol: 'publico' }), (m) => {
      if (m.t === 'bienvenida' || m.t === 'estado') {
        estado = m.estado;
        rep.mostrar(estado);
      }
    }, () => undefined);
  } else {
    canal.escuchar((m) => {
      if (m.t === 'latido') ultimoLatido = Date.now();
      if (m.t === 'estado') {
        ultimoLatido = Date.now();
        estado = m.estado;
        rep.mostrar(estado);
      }
    });
    canal.enviar({ t: 'pedir', de: canal.yo });
    const ejecutar = (c: Comando) => {
      if (conAnfitrion()) return canal.enviar({ t: 'comando', comando: c, de: canal.yo });
      const nuevo = aplicar(estado, c, s.forma, Date.now());
      if (nuevo !== estado) rep.mostrar((estado = nuevo));
    };
    teclas(ejecutar, {
      f: () => void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()),
      b: () => ejecutar({ tipo: 'negro', valor: !estado.negro }),
      '.': () => ejecutar({ tipo: 'negro', valor: !estado.negro }),
    });
  }
  void precargar(rep.escenario);
  let quieto: number | undefined;
  window.addEventListener('mousemove', () => {
    document.body.classList.remove('sin-cursor');
    window.clearTimeout(quieto);
    quieto = window.setTimeout(() => document.body.classList.add('sin-cursor'), 2000);
  });
}
