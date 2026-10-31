import { describe, expect, it } from 'vitest';
import { ErrorSesion, MAX_INTENTOS_EMPAREJAR, Sesiones, TTL_CODIGO_MS } from '../server/sesiones.ts';

const datos = { deck: 'demo', version: 'corta', huella: 'a'.repeat(16), forma: { pasos: [2, 1, 1] }, notas: [1, 2, 3].map((n) => ({ titulo: `E${n}`, notas: 'privada', guion: '', duracion: 10, medios: [] })) };

function preparar() {
  let ahora = 1_000_000;
  const s = new Sesiones(() => ahora);
  const cred = s.crear(datos);
  return { s, cred, avanzar: (ms: number) => (ahora += ms) };
}
function emparejar(s: Sesiones, sesion: string, token: string) {
  const { codigo } = s.nuevoCodigo(sesion, token);
  const sol = s.solicitar(sesion, codigo, 'Mi teléfono');
  return s.resolver(s.obtener(sesion), sol.solicitud, true)!;
}
const err = (f: () => unknown) => {
  try {
    f();
  } catch (e) {
    return (e as ErrorSesion).codigo;
  }
  return 'sin-error';
};

describe('autorización por rol', () => {
  it('el id de sesión solo no autoriza; cada token tiene su rol', () => {
    const { s, cred } = preparar();
    expect(err(() => s.autenticar(cred.sesion, '', 'anfitrion'))).toBe('no-autorizado');
    expect(err(() => s.autenticar(cred.sesion, cred.tokenPublico, 'anfitrion'))).toBe('no-autorizado');
    expect(err(() => s.autenticar(cred.sesion, cred.tokenPublico, 'control'))).toBe('no-autorizado');
    expect(s.autenticar(cred.sesion, cred.tokenPublico, 'publico').sesion.id).toBe(cred.sesion);
  });
  it('solo el anfitrión genera códigos', () => {
    const { s, cred } = preparar();
    expect(err(() => s.nuevoCodigo(cred.sesion, cred.tokenPublico))).toBe('no-autorizado');
  });
});

describe('emparejamiento', () => {
  it('código de un solo uso: una foto del QR no sirve después', () => {
    const { s, cred } = preparar();
    const { codigo } = s.nuevoCodigo(cred.sesion, cred.tokenAnfitrion);
    s.solicitar(cred.sesion, codigo, 'A');
    expect(err(() => s.solicitar(cred.sesion, codigo, 'B'))).toBe('codigo-invalido');
  });
  it('el código vence', () => {
    const { s, cred, avanzar } = preparar();
    const { codigo } = s.nuevoCodigo(cred.sesion, cred.tokenAnfitrion);
    avanzar(TTL_CODIGO_MS + 1);
    expect(err(() => s.solicitar(cred.sesion, codigo, 'A'))).toBe('codigo-invalido');
  });
  it('sin aprobación no hay control; rechazar no entrega token', () => {
    const { s, cred } = preparar();
    const { codigo } = s.nuevoCodigo(cred.sesion, cred.tokenAnfitrion);
    const sol = s.solicitar(cred.sesion, codigo, 'A');
    expect(s.autenticar(cred.sesion, sol.tokenEspera, 'espera').solicitud).toBe(sol.solicitud);
    expect(err(() => s.autenticar(cred.sesion, sol.tokenEspera, 'control'))).toBe('no-autorizado');
    expect(s.resolver(s.obtener(cred.sesion), sol.solicitud, false)).toBeNull();
    expect(s.resolver(s.obtener(cred.sesion), sol.solicitud, true)).toBeNull();
  });
  it('limita intentos por ventana', () => {
    const { s, cred } = preparar();
    for (let i = 0; i < MAX_INTENTOS_EMPAREJAR; i++) expect(err(() => s.solicitar(cred.sesion, 'x'.repeat(24), 'A'))).toBe('codigo-invalido');
    expect(err(() => s.solicitar(cred.sesion, 'x'.repeat(24), 'A'))).toBe('demasiados-intentos');
  });
  it('revocar invalida el token del teléfono', () => {
    const { s, cred } = preparar();
    const r = emparejar(s, cred.sesion, cred.tokenAnfitrion);
    expect(s.autenticar(cred.sesion, r.tokenControl, 'control').dispositivo).toBe(r.dispositivo);
    s.revocar(s.obtener(cred.sesion));
    expect(err(() => s.autenticar(cred.sesion, r.tokenControl, 'control'))).toBe('no-autorizado');
    expect(err(() => s.autenticarDispositivo(s.obtener(cred.sesion), r.dispositivo))).toBe('no-autorizado');
  });
  it('la sesión vence', () => {
    const { s, cred, avanzar } = preparar();
    avanzar(9 * 3600_000);
    expect(err(() => s.obtener(cred.sesion))).toBe('no-existe');
  });
});

describe('comandos sin doble avance', () => {
  it('un reintento con el mismo id no se aplica dos veces', () => {
    const { s, cred } = preparar();
    const ses = s.obtener(cred.sesion);
    expect(s.comando(ses, 'cmd-00000001', 0, { tipo: 'siguiente' }).resultado).toBe('aplicado');
    expect(s.comando(ses, 'cmd-00000001', 0, { tipo: 'siguiente' }).resultado).toBe('duplicado');
    expect([ses.estado.escena, ses.estado.paso]).toEqual([0, 1]);
  });
  it('doble toque con la misma revisión base: el segundo queda obsoleto', () => {
    const { s, cred } = preparar();
    const ses = s.obtener(cred.sesion);
    s.comando(ses, 'toque-000001', 0, { tipo: 'siguiente' });
    expect(s.comando(ses, 'toque-000002', 0, { tipo: 'siguiente' }).resultado).toBe('obsoleto');
    expect(ses.estado.revision).toBe(1);
  });
  it('los saltos absolutos se aplican aunque la base sea vieja', () => {
    const { s, cred } = preparar();
    const ses = s.obtener(cred.sesion);
    s.comando(ses, 'a-00000001', 0, { tipo: 'siguiente' });
    expect(s.comando(ses, 'a-00000002', 0, { tipo: 'ir', escena: 2 }).resultado).toBe('aplicado');
  });
  it('comandos inválidos no cambian nada', () => {
    const { s, cred } = preparar();
    const ses = s.obtener(cred.sesion);
    expect(s.comando(ses, 'corto', 0, { tipo: 'siguiente' }).resultado).toBe('invalido');
    expect(s.comando(ses, 'b-00000001', 0, { tipo: 'ir', escena: 9 }).resultado).toBe('invalido');
    expect(ses.estado.revision).toBe(0);
  });
  it('el anfitrión que siguió sin red impone su estado al reconectar', () => {
    const { s, cred } = preparar();
    const ses = s.obtener(cred.sesion);
    s.comando(ses, 'c-00000001', 0, { tipo: 'siguiente' });
    expect(s.sincronizar(ses, { ...ses.estado, escena: 2, paso: 0, revision: 0 })).toBe(true);
    expect(ses.estado).toMatchObject({ escena: 2, paso: 0, revision: 2 });
    expect(s.sincronizar(ses, { ...ses.estado, escena: 1, paso: 5 })).toBe(false);
  });
});
