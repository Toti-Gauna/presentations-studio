// Diapositiva 2 · HandIA te orienta. Un golpe por frase del guion:
// 0 «se les rompió algo y no saben a quién llamar» → Foco frente a la pileta que pierde, con la duda; llega el celular con HandIA ·
// 1 «mandar una foto, describir el problema» → la cámara saca la foto de la pileta y el mensaje se escribe solo ·
// 2 «qué especialista necesitan y un costo aproximado para comparar presupuestos» → HandIA detecta Plomería y da un rango;
//   salen del celular tres presupuestos que se comparan ·
// 3 «el presupuesto final lo fija el profesional» → Llave sella el precio en el presupuesto elegido ·
// 4 «si ya saben a quién llamar, eligen el oficio y comparan presupuestos» → Camino 2: grilla de rubros, Gas, pedido publicado
//   y presupuestos que llegan.
// La franja y 880–950 queda libre (leyenda del kit) y la de y > 960 también (subtítulos del video).
import { COLOR, entraTitulo, escena, pose, type Kit } from './comun/kit.ts';

const PRES = ['EJ-PRES-1', 'EJ-PRES-2', 'EJ-PRES-3'] as const;
const ESTRELLAS = [5, 5, 4];
const OFICIOS = [
  { ic: 'electricidad', txt: 'Electricidad' },
  { ic: 'plomeria', txt: 'Plomería' },
  { ic: 'gas', txt: 'Gas' },
  { ic: 'cerrajeria', txt: 'Cerrajería' },
  { ic: 'albanileria', txt: 'Albañilería' },
  { ic: 'aire', txt: 'Aire acondicionado' },
];
const MOSAICOS = [
  { x: 1600, y: 96, d: 92, ic: 'herramienta' },
  { x: 1738, y: 196, d: 80, ic: 'llave-inglesa' },
  { x: 1612, y: 252, d: 64, ic: 'martillo' },
  { x: 1520, y: 452, d: 86, ic: 'plomeria' },
  { x: 1736, y: 540, d: 98, ic: 'electricidad' },
  { x: 1560, y: 680, d: 76, ic: 'gas' },
  { x: 1724, y: 764, d: 84, ic: 'cerrajeria' },
];
const MOSAICOS_DE_PASO = [3, 4, 5]; // los del medio se corren cuando llegan los avisos (paso 4)
const TEXTO = 'Se tapó la pileta de la cocina y pierde agua';
const PRES_X = [120, 420, 720]; // tarjetas de 276 px con 24 px de aire
const PRES_W = 276;
const PRES_Y = 350;
const PRES_H = 214;
const SELLO_Y = PRES_Y + PRES_H + 22; // centro del sello: apoya en el borde de la tarjeta sin tapar el monto

/** Presupuesto que se destaca: el más cercano al medio del rango de HandIA (a igual distancia, el más bajo). */
function elegida(c: Kit): number {
  const v = PRES.map((id) => c.valor(id) ?? 0);
  const medio = ((c.valor('HANDIA-EJ-MIN') ?? 0) + (c.valor('HANDIA-EJ-MAX') ?? 0)) / 2;
  let mejor = 0;
  v.forEach((x, i) => {
    const d = Math.abs(x - medio);
    const dm = Math.abs((v[mejor] ?? 0) - medio);
    if (d < dm || (d === dm && x < (v[mejor] ?? 0))) mejor = i;
  });
  return mejor;
}

/** La cocina con la pileta tapada que pierde (se usa en la escena, en el visor de la cámara y en la foto del chat). */
const cocina = (clase: string) => `
  <div class="cocina ${clase}">
    <div class="k-pared"><i class="k-repisa"></i><i class="k-frasco f1"></i><i class="k-frasco f2"></i></div>
    <div class="k-canilla"><i class="k-cano"></i><i class="k-pico"></i><i class="k-boca"></i><i class="k-mando"></i><i class="k-gota" data-d="40" style="left:347px;top:206px"></i></div>
    <div class="k-mesada"></div>
    <div class="k-bacha"><i class="k-burb" style="left:64px"></i><i class="k-burb" style="left:150px"></i><i class="k-burb" style="left:108px"></i></div>
    <div class="k-mueble">
      <div class="k-hueco"><i class="k-desague"></i><i class="k-sifon"></i><i class="k-salida"></i><i class="k-pozo"></i><i class="k-gota" data-d="60" style="left:186px;top:102px"></i></div>
      <div class="k-puerta"></div>
    </div>
    <i class="k-abierta"></i>
    <div class="k-charco"><i></i></div>
  </div>`;

const estrellas = (n: number) => `<span class="estrellas">${[0, 1, 2, 3, 4].map((i) => `<i class="${i < n ? '' : 'no'}"></i>`).join('')}</span>`;

export default escena({
  marcas: [0, 3.0, 6.6, 10.4, 13.2, 16.8],
  cara: [
    { desde: 0, x: 1680, y: 215, d: 250 },
    { desde: 1, x: 1680, y: 215, d: 250 },
    { desde: 2, x: 1680, y: 215, d: 250 },
    { desde: 3, x: 1680, y: 215, d: 250 },
    { desde: 4, x: 1680, y: 215, d: 250 },
  ],
  css: `
    .fondo { position: absolute; inset: 0; background: #ECECEC; }
    .piso { position: absolute; left: 96px; top: 868px; width: 960px; height: 8px; border-radius: 4px; background: rgba(14,29,54,.07); }
    .mw { position: absolute; }
    .mos { width: 100%; height: 100%; display: grid; place-items: center; border-radius: 26%; background: #F5F5F3; box-shadow: 0 6px 0 #D8D8D5; }
    .mos .icono { width: 46%; height: 46%; opacity: .5; }
    .encabezado { position: absolute; left: 96px; top: 56px; }
    .encabezado .titulo { margin-top: 10px; font-size: 62px; }
    .camino { position: absolute; left: 120px; top: 272px; }
    .camino .chip { font-size: 22px; }
    .ejemplo { position: absolute; right: 924px; top: 282px; padding: 6px 16px; border-radius: 999px; background: rgba(255,255,255,.75); font-size: 20px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }

    /* Cocina (600 × 520) */
    .cocina { position: absolute; left: 0; top: 0; width: 600px; height: 520px; }
    .cocina i { position: absolute; display: block; }
    .k-escena { left: 120px; top: 352px; }
    .k-pared { position: absolute; left: 20px; top: 0; width: 560px; height: 252px; border-radius: 22px 22px 0 0; background-color: #FBFBF9; background-image: linear-gradient(90deg, rgba(14,29,54,.07) 2px, transparent 2px), linear-gradient(rgba(14,29,54,.07) 2px, transparent 2px); background-size: 50px 50px; background-position: -1px -1px; transform-origin: 50% 100%; }
    .k-repisa { left: 372px; top: 92px; width: 148px; height: 12px; border-radius: 6px; background: #C3CAD6; }
    .k-frasco { border-radius: 9px 9px 6px 6px; }
    .k-frasco.f1 { left: 392px; top: 46px; width: 38px; height: 46px; background: ${COLOR.naranja}; box-shadow: inset 0 8px 0 rgba(255,255,255,.35); }
    .k-frasco.f2 { left: 444px; top: 58px; width: 32px; height: 34px; background: ${COLOR.azul}; box-shadow: inset 0 7px 0 rgba(255,255,255,.3); }
    .k-canilla { position: absolute; inset: 0; }
    .k-cano { left: 272px; top: 126px; width: 18px; height: 126px; border-radius: 9px 9px 0 0; background: #C3CAD6; box-shadow: inset -5px 0 0 #A9B2C2; }
    .k-pico { left: 272px; top: 118px; width: 90px; height: 80px; border: 18px solid #C3CAD6; border-left: 0; border-bottom: 0; border-radius: 0 50px 0 0; }
    .k-boca { left: 340px; top: 194px; width: 26px; height: 12px; border-radius: 4px; background: #9AA4B5; }
    .k-mando { left: 256px; top: 230px; width: 50px; height: 12px; border-radius: 6px; background: #9AA4B5; }
    .k-gota { width: 12px; height: 16px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: #6FA3EA; }
    .k-mesada { position: absolute; left: 0; top: 248px; width: 600px; height: 36px; border-radius: 10px; background: #9AA4B5; box-shadow: inset 0 13px 0 #C3CAD6; }
    .k-bacha { position: absolute; left: 220px; top: 240px; width: 250px; height: 28px; border-radius: 50%; background: #6FA3EA; box-shadow: 0 0 0 7px #E6EAF0, inset 0 5px 0 #9CC3F5; }
    .k-burb { top: -4px; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #9CC3F5; background: rgba(255,255,255,.5); }
    .k-mueble { position: absolute; left: 26px; top: 284px; width: 548px; height: 206px; background: #fff; border-radius: 0 0 14px 14px; box-shadow: inset 0 0 0 3px #E3E8F2; }
    .k-hueco { position: absolute; left: 12px; top: 12px; width: 258px; height: 182px; border-radius: 8px; background: #2E3D5C; overflow: hidden; }
    .k-desague { left: 150px; top: 0; width: 18px; height: 56px; background: #C3CAD6; }
    .k-sifon { left: 150px; top: 44px; width: 84px; height: 60px; border: 18px solid #C3CAD6; border-top: 0; border-radius: 0 0 42px 42px; }
    .k-salida { left: 216px; top: 26px; width: 60px; height: 18px; background: #C3CAD6; }
    .k-pozo { left: 70px; top: 168px; width: 170px; height: 12px; border-radius: 6px; background: #6FA3EA; }
    .k-puerta { position: absolute; left: 282px; top: 12px; width: 254px; height: 182px; border-radius: 8px; box-shadow: inset 0 0 0 3px #E3E8F2; }
    .k-puerta::after { content: ''; position: absolute; left: 18px; top: 70px; width: 10px; height: 42px; border-radius: 5px; background: #C3CAD6; }
    .k-abierta { left: -4px; top: 292px; width: 40px; height: 190px; border-radius: 6px; background: #fff; box-shadow: inset 0 0 0 3px #E3E8F2; transform: skewY(-14deg); }
    .k-charco { position: absolute; left: 40px; top: 488px; width: 480px; height: 28px; border-radius: 50%; background: #8DB6F2; }
    .k-charco i { left: 20%; top: 7px; width: 26%; height: 6px; border-radius: 3px; background: rgba(255,255,255,.6); }
    .flash-k { position: absolute; left: 100px; top: 330px; width: 940px; height: 548px; border-radius: 30px; background: #fff; }

    /* Cocina a gas del camino 2 (600 × 520, mismo lugar que la pileta) */
    .estufa { position: absolute; left: 120px; top: 352px; width: 600px; height: 520px; }
    .estufa i { position: absolute; display: block; }
    .e-pared { position: absolute; left: 40px; top: 38px; width: 520px; height: 234px; border-radius: 22px 22px 0 0; background-color: #FBFBF9; background-image: linear-gradient(90deg, rgba(14,29,54,.07) 2px, transparent 2px), linear-gradient(rgba(14,29,54,.07) 2px, transparent 2px); background-size: 50px 50px; background-position: -1px -1px; transform-origin: 50% 100%; }
    .e-cuerpo { position: absolute; left: 170px; top: 264px; width: 260px; height: 252px; border-radius: 6px 6px 12px 12px; background: #fff; box-shadow: inset 0 0 0 3px ${COLOR.borde}, 0 10px 24px rgba(14,29,54,.08); }
    .e-perilla { top: 16px; width: 22px; height: 22px; border-radius: 50%; background: #C3CAD6; }
    .e-perilla::after { content: ''; position: absolute; left: 9px; top: 3px; width: 4px; height: 8px; border-radius: 2px; background: ${COLOR.suave}; }
    .e-puerta { position: absolute; left: 18px; top: 52px; width: 224px; height: 184px; border-radius: 8px; box-shadow: inset 0 0 0 3px ${COLOR.borde}; }
    .e-manija { left: 22px; top: 14px; width: 180px; height: 10px; border-radius: 5px; background: #C3CAD6; }
    .e-vidrio { left: 22px; top: 42px; width: 180px; height: 116px; border-radius: 10px; background: #2E3D5C; }
    .e-tapa { position: absolute; left: 158px; top: 246px; width: 284px; height: 20px; border-radius: 6px; background: #3A4660; }
    .e-hornalla { top: -9px; width: 86px; height: 10px; border-radius: 4px 4px 0 0; background: ${COLOR.texto}; }
    .e-olla { position: absolute; left: 172px; top: 166px; width: 120px; height: 72px; }
    .o-cuerpo { left: 12px; top: 16px; width: 96px; height: 56px; border-radius: 6px 6px 18px 18px; background: ${COLOR.azul}; box-shadow: inset 0 -8px 0 rgba(0,0,0,.14); }
    .o-tapa { left: 6px; top: 6px; width: 108px; height: 12px; border-radius: 6px; background: ${COLOR.azulOscuro}; }
    .o-pomo { left: 50px; top: -4px; width: 20px; height: 12px; border-radius: 6px 6px 2px 2px; background: ${COLOR.azulOscuro}; }
    .o-asa { top: 24px; width: 16px; height: 10px; border-radius: 5px; background: ${COLOR.azulOscuro}; }
    .e-chispas { position: absolute; left: 336px; top: 196px; width: 54px; height: 40px; }
    .e-chispas i { width: 5px; height: 16px; border-radius: 3px; background: ${COLOR.amarillo}; }
    .e-alerta { position: absolute; left: 404px; top: 150px; width: 54px; height: 54px; border-radius: 50%; background: ${COLOR.naranja}; color: #fff; display: grid; place-items: center; font-size: 34px; font-weight: 900; box-shadow: 0 10px 22px rgba(14,29,54,.2); }

    /* Foco, la duda y la idea */
    .mov { position: absolute; }
    .pj { transform-origin: 50% 100%; }
    .foco { left: 760px; top: 600px; width: 270px; height: 270px; }
    .rayos { position: absolute; left: 745px; top: 570px; width: 300px; height: 300px; }
    .rayos i { position: absolute; inset: 0; border-radius: 50%; background: repeating-conic-gradient(rgba(255,201,60,.38) 0 9deg, transparent 9deg 22deg); -webkit-mask-image: radial-gradient(circle, #000 25%, transparent 70%); mask-image: radial-gradient(circle, #000 25%, transparent 70%); }
    .pensar { position: absolute; left: 790px; top: 330px; width: 200px; height: 270px; }
    .pensar .bur { position: absolute; border-radius: 50%; background: #fff; box-shadow: 0 10px 24px rgba(14,29,54,.14); }
    .pensar .p1 { left: 92px; top: 198px; width: 26px; height: 26px; }
    .pensar .p2 { left: 106px; top: 234px; width: 16px; height: 16px; }
    .pensar .nube-w { position: absolute; left: 10px; top: 0; width: 180px; height: 180px; }
    .pensar .nube { width: 100%; height: 100%; display: grid; place-items: center; }
    .pensar .nube > * { grid-area: 1 / 1; }
    .pensar .q { font-size: 132px; color: ${COLOR.azul}; line-height: 1; }
    .pensar .r .icono { width: 92px; height: 92px; }

    /* Presupuestos */
    .pres { position: absolute; top: ${PRES_Y}px; width: ${PRES_W}px; height: ${PRES_H}px; padding: 22px; }
    .pres .cab { display: flex; align-items: center; gap: 12px; }
    .pres .ini { flex: none; width: 56px; height: 56px; border-radius: 50%; background: #1D2C4A; color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 22px; }
    .pres .nom { font-size: 22px; font-weight: 800; white-space: nowrap; }
    .estrellas { display: flex; gap: 3px; margin-top: 5px; }
    .estrellas i { width: 20px; height: 20px; background: ${COLOR.naranja}; clip-path: polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
    .estrellas i.no { background: #D6D9E0; }
    .pres .lbl { margin-top: 18px; font-size: 20px; font-weight: 600; color: ${COLOR.suave}; }
    .pres .monto { margin-top: 2px; font-size: 44px; }
    .marco { position: absolute; inset: -10px; border-radius: 34px; border: 6px solid ${COLOR.amarillo}; }
    .eleccion { position: absolute; left: 0; right: 0; top: -24px; text-align: center; }
    .eleccion .chip { padding: 6px 16px; font-size: 20px; }
    .sellito { position: absolute; top: ${SELLO_Y - 39}px; width: 360px; text-align: center; }
    .sellito .sello { display: inline-block; font-size: 24px; line-height: 1.1; padding: 12px 22px; white-space: nowrap; text-align: center; box-shadow: 0 8px 0 ${COLOR.azulOscuro}, 0 18px 36px rgba(14,29,54,.25), inset 0 0 0 3px rgba(255,255,255,.35); }
    .golpe { position: absolute; top: ${SELLO_Y - 90}px; width: 180px; height: 180px; border-radius: 50%; border: 6px solid ${COLOR.amarillo}; }
    .llave { top: 660px; width: 210px; height: 210px; }
    .sugiere { position: absolute; left: 120px; top: 664px; width: 300px; font-size: 26px; font-weight: 800; line-height: 1.25; color: ${COLOR.noche}; }
    .sugiere small { display: block; margin-bottom: 6px; font-size: 20px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: ${COLOR.azul}; }

    /* Avisos del camino 2 */
    .aviso { position: absolute; left: 1490px; width: 370px; display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 24px; background: #fff; box-shadow: 0 14px 30px rgba(14,29,54,.16), 0 3px 0 ${COLOR.borde}; }
    .aviso .ic { flex: none; width: 56px; height: 56px; border-radius: 16px; background: ${COLOR.azul}; display: grid; place-items: center; box-shadow: 0 4px 0 ${COLOR.azulOscuro}; }
    .aviso .ic .icono { width: 32px; height: 32px; }
    .aviso b { display: block; font-size: 22px; font-weight: 800; }
    .aviso small { display: block; font-size: 20px; color: ${COLOR.suave}; }

    /* Celular */
    .tel { position: absolute; left: 1092px; top: 96px; width: 356px; height: 772px; }
    .tel .cel { width: 356px; height: 772px; border-radius: 52px; }
    .tel .cel .pantalla { border-radius: 40px; }
    .demo { position: absolute; left: -60px; right: -60px; top: -40px; display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 20px; font-weight: 700; color: ${COLOR.suave}; white-space: nowrap; }
    .demo .icono { width: 24px; height: 24px; }
    .anillo { position: absolute; left: 4px; top: 514px; width: 324px; height: 99px; border-radius: 28px; border: 5px solid ${COLOR.amarillo}; }
    .anillo i { position: absolute; inset: -5px; border-radius: 28px; border: 5px solid ${COLOR.amarillo}; }
    .toque { position: absolute; left: 250px; top: 521px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,.75); }
    .scr { position: absolute; left: 0; right: 0; top: 38px; bottom: 0; overflow: hidden; }
    .scr-chat { background: #F4F6FA; }
    .chat-cab { position: absolute; left: 0; right: 0; top: 0; height: 76px; display: flex; align-items: center; gap: 10px; padding: 0 14px; background: #fff; box-shadow: 0 2px 10px rgba(14,29,54,.08); z-index: 2; }
    .atras { flex: none; width: 14px; height: 14px; margin: 0 2px 0 6px; border-left: 3px solid ${COLOR.azul}; border-bottom: 3px solid ${COLOR.azul}; border-radius: 2px; transform: rotate(45deg); }
    .av { flex: none; width: 48px; height: 48px; border-radius: 50%; background: #F5F59A; overflow: hidden; display: grid; place-items: end center; }
    .av img { height: 44px; display: block; }
    .chat-cab b { display: block; font-size: 22px; font-weight: 800; line-height: 1.1; }
    .chat-cab small { display: block; font-size: 20px; color: ${COLOR.suave}; line-height: 1.15; white-space: nowrap; }
    .lista { position: absolute; left: 0; right: 0; top: 90px; padding: 0 10px; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
    .msg { max-width: 280px; padding: 11px 16px; border-radius: 22px 22px 22px 8px; background: ${COLOR.azul}; color: #fff; font-size: 20px; line-height: 1.3; font-weight: 600; box-shadow: 0 6px 14px rgba(14,29,54,.12); }
    .msg.yo { align-self: flex-end; border-radius: 22px 22px 8px 22px; background: #fff; color: ${COLOR.noche}; }
    .m-foto { padding: 8px; }
    .mini { position: relative; width: 170px; height: 112px; border-radius: 14px; overflow: hidden; background: #E9EDF3; }
    .mini .cocina { left: -5px; top: -30px; transform: scale(.3); transform-origin: 0 0; }
    .m-foto span { display: block; padding: 6px 6px 0; font-weight: 700; }
    .m-texto { position: relative; }
    .m-texto .fantasma { visibility: hidden; }
    .m-texto .vivo { position: absolute; left: 16px; top: 11px; right: 16px; }
    .caret { display: inline-block; width: 2px; height: 22px; margin-left: 2px; vertical-align: -4px; background: ${COLOR.azul}; }
    .m-resp { position: relative; align-self: stretch; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
    .m-puntos { position: absolute; left: 0; top: 0; display: flex; gap: 7px; padding: 17px 18px; border-radius: 22px 22px 22px 8px; background: ${COLOR.azul}; }
    .m-puntos i { width: 10px; height: 10px; border-radius: 50%; background: #fff; }
    .m-rubro { align-self: center; display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 999px; background: #F5F59A; box-shadow: 0 3px 0 #D8D86A; font-size: 20px; font-weight: 800; white-space: nowrap; }
    .m-rubro .icono { width: 24px; height: 24px; }
    .m-rango { max-width: none; }
    .m-rango span { display: block; color: #DCE7FA; }
    .m-rango b { display: block; margin-top: 2px; font-size: 24px; white-space: nowrap; }
    .entrada { position: absolute; left: 0; right: 0; bottom: 0; height: 82px; padding: 0 14px 16px; display: flex; align-items: center; gap: 10px; background: #fff; box-shadow: 0 -2px 10px rgba(14,29,54,.06); }
    .b-cam { flex: none; width: 44px; height: 44px; border-radius: 50%; background: ${COLOR.celeste}; display: grid; place-items: center; }
    .b-cam .icono { width: 24px; height: 24px; }
    .campo { flex: 1; height: 44px; border-radius: 22px; background: #F4F6FA; display: flex; align-items: center; padding: 0 16px; font-size: 20px; color: #8A94A8; white-space: nowrap; overflow: hidden; }
    .b-env { flex: none; width: 44px; height: 44px; border-radius: 50%; background: ${COLOR.azul}; box-shadow: 0 4px 0 ${COLOR.azulOscuro}; display: grid; place-items: center; }
    .b-env::after { content: ''; width: 18px; height: 18px; margin-left: 4px; background: #fff; clip-path: polygon(0 0, 100% 50%, 0 100%, 22% 50%); }
    .camara { position: absolute; left: 0; right: 0; top: 38px; bottom: 0; background: #0A1528; z-index: 5; transform-origin: 36px 670px; }
    .cam-modo { position: absolute; left: 0; right: 0; top: 18px; text-align: center; font-size: 20px; font-weight: 800; letter-spacing: .12em; color: ${COLOR.amarillo}; }
    .visor { position: absolute; left: 16px; right: 16px; top: 62px; height: 380px; border-radius: 20px; overflow: hidden; background: #E9EDF3; }
    .visor .cocina { left: 0; top: 60px; transform: scale(.5); transform-origin: 0 0; }
    .esq { position: absolute; width: 36px; height: 36px; border: 0 solid #fff; }
    .esq.a { left: 14px; top: 14px; border-width: 4px 0 0 4px; border-radius: 10px 0 0 0; }
    .esq.b { right: 14px; top: 14px; border-width: 4px 4px 0 0; border-radius: 0 10px 0 0; }
    .esq.c { left: 14px; bottom: 14px; border-width: 0 0 4px 4px; border-radius: 0 0 0 10px; }
    .esq.d { right: 14px; bottom: 14px; border-width: 0 4px 4px 0; border-radius: 0 0 10px 0; }
    .enfoque { position: absolute; left: 112px; top: 126px; width: 120px; height: 120px; border-radius: 12px; border: 3px solid ${COLOR.amarillo}; }
    .disparador { position: absolute; left: 50%; bottom: 52px; width: 74px; height: 74px; margin-left: -37px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 6px #0A1528, 0 0 0 10px #fff; }
    .flash { position: absolute; inset: 0; background: #fff; z-index: 6; }
    .scr-of { background: #fff; z-index: 7; }
    .of-tit { position: absolute; left: 16px; right: 10px; top: 20px; font-size: 25px; font-stretch: 104%; white-space: nowrap; }
    .grilla { position: absolute; left: 14px; right: 14px; top: 74px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .ofi { position: relative; height: 108px; border-radius: 18px; background: #ECECEC; box-shadow: 0 5px 0 #D2D2D2; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 0 6px; font-size: 20px; font-weight: 700; color: #1D2C4A; text-align: center; line-height: 1.05; }
    .ofi .icono { width: 40px; height: 40px; }
    .ofi .sel { position: absolute; inset: 0; border-radius: 18px; background: ${COLOR.azul}; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 5px 0 ${COLOR.azulOscuro}; }
    .toque2 { position: absolute; left: 50%; top: 50%; width: 90px; height: 90px; margin: -45px 0 0 -45px; border-radius: 50%; background: rgba(255,255,255,.7); }
    .hoja { position: absolute; left: 0; right: 0; bottom: 0; height: 196px; padding: 14px 22px 0; border-radius: 28px 28px 0 0; background: ${COLOR.azul}; color: #fff; z-index: 3; }
    .manija { width: 56px; height: 6px; border-radius: 3px; background: rgba(255,255,255,.5); margin: 0 auto 18px; }
    .hoja .ok { display: flex; align-items: center; gap: 10px; font-size: 26px; font-weight: 800; }
    .hoja .ok .icono { width: 36px; height: 36px; }
    .hoja p { margin-top: 10px; font-size: 20px; color: #DCE7FA; }
  `,
  html: (c) => {
    const e = elegida(c);
    const cx = (PRES_X[e] ?? 0) + PRES_W / 2;
    return `
    <div class="fondo"></div>
    ${MOSAICOS.map((m, i) => `<div class="mw m${i}" style="left:${m.x}px;top:${m.y}px;width:${m.d}px;height:${m.d}px"><div class="mos">${c.icono(m.ic)}</div></div>`).join('')}
    <div class="piso"></div>
    <div class="encabezado"><div class="kicker">La experiencia del usuario</div><div class="titulo t"><span class="l"><span>No sabés a quién llamar.</span></span><span class="l"><span><mark>HandIA te orienta.</mark></span></span></div></div>
    <div class="camino c1"><span class="chip azul">${c.icono('ia', 'blanco')}Camino 1 · no sabés el oficio</span></div>
    <div class="camino c2"><span class="chip azul">${c.icono('herramienta', 'blanco')}Camino 2 · ya sabés el oficio</span></div>
    <div class="ejemplo">Ejemplo ilustrativo</div>
    ${cocina('k-escena')}
    <div class="flash-k"></div>
    <div class="estufa">
      <div class="e-pared"></div>
      <div class="e-cuerpo">${[34, 92, 150, 208].map((x) => `<i class="e-perilla" style="left:${x}px"></i>`).join('')}<div class="e-puerta"><i class="e-manija"></i><i class="e-vidrio"></i></div></div>
      <div class="e-tapa"><i class="e-hornalla" style="left:30px"></i><i class="e-hornalla" style="left:166px"></i></div>
      <div class="e-olla"><i class="o-asa" style="left:0"></i><i class="o-asa" style="left:104px"></i><i class="o-cuerpo"></i><i class="o-tapa"></i><i class="o-pomo"></i></div>
      <div class="e-chispas"><i style="left:4px;top:10px;transform:rotate(-28deg)"></i><i style="left:24px;top:0"></i><i style="left:44px;top:10px;transform:rotate(28deg)"></i></div>
      <div class="e-alerta">!</div>
    </div>
    <div class="rayos"><i></i></div>
    <div class="mov foco">${c.pj('bombilla', '', 270)}<div class="sombra-pj"></div></div>
    <div class="pensar duda"><i class="bur p2"></i><i class="bur p1"></i><div class="nube-w"><div class="nube bur"><span class="q t">?</span><span class="r">${c.icono('plomeria')}</span></div></div></div>
    <div class="pensar sabe"><i class="bur p2"></i><i class="bur p1"></i><div class="nube-w"><div class="nube bur"><span class="r">${c.icono('gas')}</span></div></div></div>
    ${PRES.map((id, i) => `<div class="pres tarjeta p${i}" style="left:${PRES_X[i]}px">
      ${i === e ? `<div class="marco"></div><div class="eleccion"><span class="chip amarillo">Tu elección</span></div>` : ''}
      <div class="cab"><b class="ini">E${i + 1}</b><div><div class="nom">Especialista ${i + 1}</div>${estrellas(ESTRELLAS[i] ?? 5)}</div></div>
      <div class="lbl">Presupuesto</div><div class="monto t">${c.cifra(id)}</div></div>`).join('')}
    <div class="mov llave" style="left:${cx - 105}px">${c.pj('llave', '', 210)}<div class="sombra-pj"></div></div>
    <div class="golpe" style="left:${cx - 90}px"></div>
    <div class="sellito" style="left:${cx - 180}px"><span class="sello">El precio lo pone<br>el profesional</span></div>
    <div class="sugiere"><small>Precio final</small>Handyx sugiere,<br>nunca impone.</div>
    ${[0, 1, 2].map((i) => `<div class="aviso a${i}" style="top:${404 + i * 112}px"><span class="ic">${c.icono('gas', 'blanco')}</span><span><b>Nuevo presupuesto</b><small>Gas · Especialista ${i + 1}</small></span></div>`).join('')}
    <div class="tel">
      <div class="demo">${c.icono('ia')}Demo · HandIA en desarrollo</div>
      ${c.celular(`
        ${c.img('demo-landing/usuario-inicio.webp', 'captura', 'Inicio de la app de Handyx en la demo')}
        <div class="anillo"><i></i></div><div class="toque"></div>
        <div class="scr scr-chat">
          <div class="chat-cab"><i class="atras"></i><span class="av">${c.img('personajes/bombilla-a.webp')}</span><span><b>HandIA</b><small>Asistente de Handyx</small></span></div>
          <div class="lista">
            <div class="msg m-hola">¡Hola! Soy HandIA. Contame qué pasó en tu casa.</div>
            <div class="msg yo m-foto"><div class="mini">${cocina('k-foto')}</div><span>Así está</span></div>
            <div class="msg yo m-texto"><span class="fantasma">${TEXTO}</span><span class="vivo"><span class="txt"></span><i class="caret"></i></span></div>
            <div class="m-resp">
              <div class="m-rubro">${c.icono('plomeria')}Rubro detectado: Plomería</div>
              <div class="msg m-rango"><span>Costo aproximado:</span><b class="t">${c.cifra('HANDIA-EJ-MIN')} a ${c.cifra('HANDIA-EJ-MAX')}</b></div>
              <div class="m-puntos"><i></i><i></i><i></i></div>
            </div>
          </div>
          <div class="entrada"><span class="b-cam">${c.icono('camara')}</span><span class="campo">Escribí acá…</span><span class="b-env"></span></div>
          <div class="camara"><div class="cam-modo">FOTO</div><div class="visor">${cocina('k-visor')}<i class="esq a"></i><i class="esq b"></i><i class="esq c"></i><i class="esq d"></i><i class="enfoque"></i></div><i class="disparador"></i></div>
        </div>
        <div class="scr scr-of">
          <div class="of-tit t">¿Qué necesitás <mark>hoy</mark>?</div>
          <div class="grilla">${OFICIOS.map((o) => `<div class="ofi o-${o.ic}">${c.icono(o.ic)}<span>${o.txt}</span>${o.ic === 'gas' ? `<div class="sel">${c.icono(o.ic, 'blanco')}<span>${o.txt}</span></div><i class="toque2"></i>` : ''}</div>`).join('')}</div>
          <div class="hoja"><div class="manija"></div><div class="ok">${c.icono('tilde-circulo', 'blanco')}Pedido publicado</div><p>Gas · ya pueden mandarte presupuestos</p></div>
        </div>
        <div class="flash"></div>
      `)}
    </div>
  `;
  },
  armar(tl, $, c) {
    const e = elegida(c);
    const tarjetas = $.all('.pres');
    const otras = tarjetas.filter((_, i) => i !== e);
    const elegidaEl = tarjetas[e] as HTMLElement;
    const k = (s: string) => $(`.k-escena ${s}`);
    // 0 · se rompió algo: la cocina, Foco con la duda y el celular que llega con HandIA
    tl.fromTo($.all('.mw'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.07 }, 0);
    tl.fromTo($('.encabezado .kicker'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05);
    entraTitulo(tl, $.all('.encabezado .l > span'), 0.15);
    tl.fromTo(k('.k-pared'), { autoAlpha: 0, scaleY: 0.2 }, { autoAlpha: 1, scaleY: 1, duration: 0.55, ease: 'back.out(1.4)' }, 0.25);
    tl.fromTo([k('.k-mesada'), k('.k-mueble'), k('.k-abierta')], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06 }, 0.4);
    tl.fromTo(k('.k-canilla'), { autoAlpha: 0, y: -50 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'bounce.out' }, 0.62);
    tl.fromTo(k('.k-bacha'), { autoAlpha: 0, scaleX: 0.3 }, { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: 'back.out(2)' }, 0.7);
    tl.fromTo($('.foco'), { autoAlpha: 0, x: 140 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 0.85);
    tl.fromTo(k('.k-charco'), { autoAlpha: 0, scaleX: 0.05, scaleY: 0.4 }, { autoAlpha: 1, scaleX: 1, scaleY: 1, duration: 1.6, ease: 'power1.out' }, 1.05);
    tl.fromTo([$('.duda .p2'), $('.duda .p1'), $('.duda .nube-w')], { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)', stagger: 0.1 }, 1.4);
    tl.fromTo($('.tel'), { autoAlpha: 0, x: 520, rotation: 10 }, { autoAlpha: 1, x: 0, rotation: 0, duration: 0.8, ease: 'power3.out' }, 1.85);
    tl.fromTo($('.demo'), { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 2.3);
    tl.fromTo($('.anillo'), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, 2.55);
    // 1 · la foto y la descripción
    tl.fromTo($('.toque'), { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 0.9, scale: 0.6, duration: 0.08 }, 3.0);
    tl.to($('.toque'), { autoAlpha: 0, scale: 2.2, duration: 0.45, ease: 'power2.out' }, 3.08);
    tl.to($('.anillo'), { autoAlpha: 0, duration: 0.2 }, 3.05);
    tl.fromTo($('.scr-chat'), { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power3.inOut' }, 3.25);
    tl.fromTo($('.c1'), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'back.out(1.8)' }, 3.45);
    tl.fromTo($('.m-hola'), { autoAlpha: 0, y: 14, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.6)' }, 3.65);
    tl.fromTo($('.camara'), { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power3.out' }, 4.0);
    tl.fromTo($('.enfoque'), { autoAlpha: 0, scale: 1.5 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 4.35);
    tl.fromTo($('.disparador'), { scale: 1 }, { scale: 0.84, duration: 0.1 }, 4.7);
    tl.to($('.disparador'), { scale: 1, duration: 0.15 }, 4.8);
    tl.fromTo([$('.flash'), $('.flash-k')], { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.05 }, 4.74);
    tl.to([$('.flash'), $('.flash-k')], { autoAlpha: 0, duration: 0.45 }, 4.79);
    tl.to($('.camara'), { autoAlpha: 0, duration: 0.25 }, 5.0);
    tl.fromTo($('.m-foto'), { autoAlpha: 0, y: -180, scale: 1.4 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }, 5.0);
    tl.fromTo($('.m-texto'), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(1.6)' }, 5.45);
    c.escribir($('.m-texto .txt'), TEXTO, 5.55, 0.9);
    // 2 · HandIA orienta: rubro y costo aproximado; llegan tres presupuestos
    tl.fromTo($('.m-puntos'), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.2 }, 6.65);
    tl.to($('.m-puntos'), { autoAlpha: 0, duration: 0.12 }, 7.3);
    tl.fromTo($('.m-rubro'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 7.3);
    tl.fromTo($('.m-rango'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, 7.55);
    tl.to($('.duda .q'), { autoAlpha: 0, rotationY: 90, duration: 0.18, ease: 'power2.in' }, 7.55);
    tl.fromTo($('.duda .r'), { autoAlpha: 0, rotationY: -90 }, { autoAlpha: 1, rotationY: 0, duration: 0.25, ease: 'back.out(2)' }, 7.72);
    tl.fromTo($('.rayos'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 7.6);
    tl.to([$('.duda .nube-w'), $('.duda .p1'), $('.duda .p2')], { autoAlpha: 0, scale: 0.3, duration: 0.3, ease: 'power2.in', stagger: 0.04 }, 8.35);
    tl.to($('.k-escena'), { autoAlpha: 0, y: 50, duration: 0.45, ease: 'power2.in' }, 8.35);
    tarjetas.forEach((t, i) => tl.fromTo(t, { autoAlpha: 0, x: 1110 - (PRES_X[i] ?? 0), rotation: 8, scale: 0.7 }, { autoAlpha: 1, x: 0, rotation: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, 8.7 + i * 0.16));
    tl.fromTo($('.marco'), { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, 9.62);
    tl.fromTo($('.eleccion .chip'), { autoAlpha: 0, y: 12, scale: 0.6 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2.2)' }, 9.7);
    tl.fromTo($('.ejemplo'), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 9.75);
    // 3 · el precio final lo pone el profesional
    tl.to(otras, { autoAlpha: 0.45, duration: 0.35 }, 10.42);
    tl.fromTo($('.llave'), { autoAlpha: 0, y: 140 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.7)' }, 10.45);
    tl.to($('.llave'), { y: -46, duration: 0.16, ease: 'power2.out' }, 10.98);
    tl.to($('.llave'), { y: 0, duration: 0.2, ease: 'power2.in' }, 11.14);
    tl.fromTo($('.sellito'), { autoAlpha: 0, scale: 2.3, rotation: -18 }, { autoAlpha: 1, scale: 1, rotation: -6, duration: 0.26, ease: 'power4.in' }, 11.06);
    tl.to(elegidaEl, { x: 6, duration: 0.05 }, 11.32);
    tl.to(elegidaEl, { x: -5, duration: 0.06 }, 11.37);
    tl.to(elegidaEl, { x: 0, duration: 0.08 }, 11.43);
    tl.fromTo($('.golpe'), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 0.9, scale: 0.7, duration: 0.04 }, 11.32);
    tl.to($('.golpe'), { autoAlpha: 0, scale: 1.7, duration: 0.45, ease: 'power2.out' }, 11.36);
    tl.fromTo($('.sugiere'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 11.75);
    // 4 · camino 2: ya sabés el oficio
    tl.to([...tarjetas, $('.sellito'), $('.sugiere'), $('.ejemplo'), $('.llave')], { autoAlpha: 0, y: '+=40', duration: 0.4, ease: 'power2.in', stagger: 0.03 }, 13.2);
    tl.to($('.c1'), { autoAlpha: 0, rotationX: 90, transformPerspective: 600, duration: 0.25, ease: 'power2.in' }, 13.25);
    tl.fromTo($('.c2'), { autoAlpha: 0, rotationX: -90, transformPerspective: 600 }, { autoAlpha: 1, rotationX: 0, duration: 0.35, ease: 'back.out(1.6)' }, 13.45);
    tl.fromTo($('.scr-of'), { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power3.inOut' }, 13.4);
    tl.fromTo($('.e-pared'), { autoAlpha: 0, scaleY: 0.2 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'back.out(1.4)' }, 13.45);
    tl.fromTo([$('.e-cuerpo'), $('.e-tapa')], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05 }, 13.55);
    tl.fromTo($('.e-olla'), { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'bounce.out' }, 13.8);
    tl.fromTo($('.e-chispas'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 14.0);
    tl.fromTo($('.e-alerta'), { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 14.05);
    tl.fromTo([$('.sabe .p2'), $('.sabe .p1'), $('.sabe .nube-w')], { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.4)', stagger: 0.1 }, 13.7);
    tl.fromTo($('.toque2'), { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 0.8, scale: 0.5, duration: 0.06 }, 14.35);
    tl.to($('.toque2'), { autoAlpha: 0, scale: 2, duration: 0.45, ease: 'power2.out' }, 14.41);
    tl.to($('.o-gas'), { y: 4, duration: 0.08 }, 14.35);
    tl.to($('.o-gas'), { y: 0, duration: 0.14 }, 14.43);
    tl.fromTo($('.o-gas .sel'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 14.4);
    tl.fromTo($('.hoja'), { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: 'power3.out' }, 14.8);
    tl.fromTo($('.hoja .ok .icono'), { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, 15.05);
    tl.to(MOSAICOS_DE_PASO.map((i) => $(`.m${i}`)), { autoAlpha: 0, scale: 0.6, duration: 0.3, stagger: 0.05 }, 14.95);
    $.all('.aviso').forEach((a, i) => tl.fromTo(a, { autoAlpha: 0, x: -420, scale: 0.8 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.55, ease: 'power3.out' }, 15.2 + i * 0.3));
    // Poses (pintor: valen también en los saltos)
    const foco = $('.foco .pj');
    const llave = $('.llave .pj');
    c.pintor((t) => {
      pose(foco, t >= 16.0 ? 'c' : t >= 7.6 ? 'b' : t >= 0.85 && t < 1.4 ? 'd' : 'a');
      pose(llave, t >= 11.3 ? 'c' : t >= 10.98 ? 'd' : 'b');
    });
  },
  ambiente(t, $, tl) {
    // Gotas que caen (canilla y sifón) y burbujas en la pileta tapada
    for (const g of $.all('.k-gota')) {
      const d = Number(g.dataset['d'] ?? 40);
      const per = 0.9 + (d % 7) * 0.08;
      const k = (t % per) / per;
      g.style.transform = `translateY(${k * d}px) scale(${1 - k * 0.25})`;
      g.style.opacity = k < 0.85 ? '1' : '0';
    }
    $.all('.k-burb').forEach((b, i) => {
      const k = (t * 0.8 + i * 0.37) % 1;
      b.style.transform = `translateY(${-k * 22}px) scale(${0.6 + k * 0.5})`;
      b.style.opacity = String(1 - k);
    });
    for (const ch of $.all('.k-charco i')) ch.style.transform = `scaleX(${1 + Math.sin(t * 2.2) * 0.12})`;
    // La hornalla que no prende: solo chispas
    $.all('.e-chispas i').forEach((ch, i) => (ch.style.opacity = Math.floor(t * 7 + i * 2) % 3 === 0 ? '0.15' : '1'));
    // Nubes de pensamiento que flotan; anillo que late sobre «Contale a HandIA»
    $.all('.nube').forEach((n, i) => (n.style.transform = `translateY(${Math.sin(t * 1.6 + i) * 6}px) rotate(${Math.sin(t * 1.1 + i) * 4}deg)`));
    const kp = (t % 1.1) / 1.1;
    const pulso = $('.anillo i');
    pulso.style.transform = `scale(${1 + kp * 0.08}, ${1 + kp * 0.3})`;
    pulso.style.opacity = String(1 - kp);
    // HandIA escribe; el cursor titila mientras se escribe el mensaje
    $.all('.m-puntos i').forEach((d, i) => (d.style.transform = `translateY(${-Math.max(0, Math.sin(t * 9 - i * 0.9)) * 7}px)`));
    $('.caret').style.opacity = tl >= 5.45 && tl < 6.6 && Math.floor(t * 3) % 2 === 0 ? '1' : '0';
    // Respiración de los personajes (dueño: el ambiente; las entradas mueven el contenedor .mov)
    $.all('.mov .pj').forEach((p, i) => (p.style.transform = `scaleY(${1 + Math.sin(t * 2.4 + i) * 0.018})`));
    $('.rayos i').style.transform = `rotate(${t * 12}deg)`;
    $.all('.mos').forEach((m, i) => (m.style.transform = `translateY(${Math.sin(t * 0.9 + i * 1.3) * 8}px) rotate(${Math.sin(t * 0.6 + i) * 3}deg)`));
  },
});
