// Configurador de deploy en Hostinger por consola. Pregunta lo necesario y genera, en salida/deploy/:
//  · github-secretos.txt y github-variables.txt (para pegar en GitHub → Settings → Secrets and variables → Actions)
//  · cargar-en-github.sh (lo mismo con `gh`, si tenés la CLI logueada, por ejemplo en Codespaces)
//  · VPS con Docker: docker-compose.yml, Caddyfile, .env y preparar-vps.sh (para pegar una vez en la consola del VPS)
//  · Hosting compartido: .htaccess y pasos
//  · LEEME.md con los pasos en orden
// Nada de esto se versiona (salida/ está en .gitignore). Uso: npm run configurar   ·   o con Docker: ./configurar.sh
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { generateKeyPairSync } from 'node:crypto';

// Cola de líneas: funciona igual tecleando que con respuestas pegadas o redirigidas (ej. en pruebas).
const rl = createInterface({ input: stdin, terminal: stdin.isTTY });
const cola: string[] = [];
let espera: ((l: string | null) => void) | null = null;
let cerrado = false;
rl.on('line', (l) => (espera ? (espera(l), (espera = null)) : cola.push(l)));
rl.on('close', () => {
  cerrado = true;
  espera?.(null);
});
const linea = () => new Promise<string | null>((ok) => (cola.length ? ok(cola.shift() as string) : cerrado ? ok(null) : (espera = ok)));
async function preguntar(texto: string, porDefecto = '', validar?: (v: string) => string | null): Promise<string> {
  for (;;) {
    stdout.write(`${texto}${porDefecto ? ` [${porDefecto}]` : ''}: `);
    const l = await linea();
    if (l === null) throw new Error('Se cortó la entrada antes de completar los datos.');
    if (!stdin.isTTY) stdout.write('\n');
    const r = l.trim() || porDefecto;
    const error = validar?.(r) ?? (r ? null : 'Este dato es obligatorio.');
    if (!error) return r;
    console.log(`  ✗ ${error}`);
  }
}
const dominioValido = (v: string) => (/^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(v) ? null : 'Escribí solo el dominio, sin https:// (ej. pitch.handyc.com).');
const puertoValido = (v: string) => (/^\d{1,5}$/.test(v) && Number(v) > 0 && Number(v) < 65536 ? null : 'Puerto inválido.');
const rutaValida = (v: string) => (/^[\w./~-]+$/.test(v) && !v.includes('..') ? null : 'Ruta inválida (sin espacios ni "..").');
const emailValido = (v: string) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : 'Email inválido.');

function clavesSsh(dir: string): { privada: string; publica: string } {
  const priv = `${dir}/clave-deploy`;
  rmSync(priv, { force: true });
  rmSync(`${priv}.pub`, { force: true });
  try {
    execFileSync('ssh-keygen', ['-t', 'ed25519', '-N', '', '-C', 'deploy-presentaciones', '-f', priv], { stdio: 'ignore' });
  } catch {
    // Sin ssh-keygen: RSA 4096 generada con Node (formato PEM que OpenSSH acepta).
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 4096 });
    writeFileSync(priv, privateKey.export({ type: 'pkcs1', format: 'pem' }) as string);
    const jwk = publicKey.export({ format: 'jwk' }) as { n: string; e: string };
    const mpint = (b64: string) => {
      let b = Buffer.from(b64, 'base64url');
      if (b[0]! & 0x80) b = Buffer.concat([Buffer.from([0]), b]);
      return b;
    };
    const parte = (b: Buffer) => Buffer.concat([Buffer.from([0, 0, 0, 0].map((_, i) => (b.length >> (24 - i * 8)) & 255)), b]);
    const blob = Buffer.concat([parte(Buffer.from('ssh-rsa')), parte(mpint(jwk.e)), parte(mpint(jwk.n))]);
    writeFileSync(`${priv}.pub`, `ssh-rsa ${blob.toString('base64')} deploy-presentaciones\n`);
  }
  chmodSync(priv, 0o600);
  return { privada: readFileSync(priv, 'utf8'), publica: readFileSync(`${priv}.pub`, 'utf8').trim() };
}

console.log('\nConfigurador de deploy · Presentations Studio → Hostinger\n');
console.log('1) VPS de Hostinger con Docker  → presentación + control desde el celular (recomendado)');
console.log('2) Hosting compartido de Hostinger → solo la presentación (teclado/clicker; el celular necesita un servidor aparte)\n');
const modo = (await preguntar('¿Dónde publicás? (1 o 2)', '1', (v) => (['1', '2'].includes(v) ? null : 'Elegí 1 o 2.'))) === '1' ? 'vps' : 'compartido';
const dominio = (await preguntar('Dominio de la presentación', 'pitch.handyc.com', dominioValido)).toLowerCase();
const repo = await preguntar('Repositorio de GitHub (dueño/nombre)', 'Toti-Gauna/presentations-studio', (v) => (/^[\w.-]+\/[\w.-]+$/.test(v) ? null : 'Formato dueño/nombre.'));
const rama = await preguntar('Rama que publica al hacer push', 'main', (v) => (/^[\w./-]+$/.test(v) ? null : 'Rama inválida.'));
const deck = await preguntar('Presentación por defecto', 'handyx-pitch', (v) => (/^[a-z0-9-]+$/.test(v) ? null : 'Usá el id del deck (minúsculas y guiones).'));

let host: string, usuario: string, puerto: string, carpeta: string, email = '', servidorControl = '';
if (modo === 'vps') {
  console.log('\nDatos del VPS (hPanel → VPS → Información general / Acceso SSH):');
  host = await preguntar('IP del VPS', '', (v) => (/^[\w.:-]+$/.test(v) ? null : 'IP o host inválido.'));
  usuario = await preguntar('Usuario SSH', 'root', (v) => (/^[a-z_][\w-]*$/i.test(v) ? null : 'Usuario inválido.'));
  puerto = await preguntar('Puerto SSH', '22', puertoValido);
  carpeta = await preguntar('Carpeta de la app en el VPS', '/opt/presentaciones', rutaValida);
  email = await preguntar('Email para el certificado HTTPS (Let’s Encrypt)', '', emailValido);
} else {
  console.log('\nDatos del hosting compartido (hPanel → Avanzado → Acceso SSH; Hostinger usa el puerto 65002):');
  host = await preguntar('Host o IP SSH', '', (v) => (/^[\w.:-]+$/.test(v) ? null : 'Host inválido.'));
  usuario = await preguntar('Usuario SSH (ej. u123456789)', '', (v) => (/^[\w-]+$/.test(v) ? null : 'Usuario inválido.'));
  puerto = await preguntar('Puerto SSH', '65002', puertoValido);
  carpeta = await preguntar('Carpeta del sitio', `domains/${dominio}/public_html`, rutaValida);
  servidorControl = await preguntar('URL del servidor de control para el celular (vacío = sin control remoto)', '-', (v) =>
    v === '-' || /^https:\/\/[\w.-]+(:\d+)?$/.test(v) ? null : 'Usá https://dominio (sin barra final) o "-".');
  if (servidorControl === '-') servidorControl = '';
}
const generar = (await preguntar('¿Genero una clave SSH nueva solo para el deploy? (s/n)', 's', (v) => (/^[sn]$/i.test(v) ? null : 's o n'))).toLowerCase() === 's';
rl.close();

const dir = 'salida/deploy';
mkdirSync(dir, { recursive: true });
let claves: { privada: string; publica: string } | null = null;
if (generar) claves = clavesSsh(dir);

const variables: Record<string, string> = {
  DEPLOY_HOSTINGER: 'true',
  DEPLOY_MODO: modo,
  DEPLOY_PUERTO: puerto,
  DEPLOY_CARPETA: carpeta,
  DEPLOY_RAMA: rama,
  DOMINIO: dominio,
  VITE_DECK: deck,
  ...(modo === 'compartido' ? { SERVIDOR_CONTROL: servidorControl } : {}),
};
const secretos: Record<string, string> = {
  DEPLOY_HOST: host,
  DEPLOY_USUARIO: usuario,
  DEPLOY_SSH_KEY: claves?.privada ?? '(pegá acá el contenido de tu clave privada SSH)',
};
const bloque = (t: Record<string, string>) => Object.entries(t).map(([k, v]) => `── ${k} ──\n${v}\n`).join('\n');
writeFileSync(`${dir}/github-variables.txt`, `GitHub → ${repo} → Settings → Secrets and variables → Actions → pestaña "Variables" → New repository variable\n\n${bloque(variables)}`);
writeFileSync(`${dir}/github-secretos.txt`, `GitHub → ${repo} → Settings → Secrets and variables → Actions → pestaña "Secrets" → New repository secret\nNO compartas este archivo. Borralo cuando termines.\n\n${bloque(secretos)}`);
chmodSync(`${dir}/github-secretos.txt`, 0o600);
writeFileSync(
  `${dir}/cargar-en-github.sh`,
  `#!/usr/bin/env bash
# Carga variables y secretos con la CLI de GitHub (en Codespaces ya está logueada). Uso: bash ${dir}/cargar-en-github.sh
set -euo pipefail
R=${repo}
${Object.entries(variables).map(([k, v]) => `gh variable set ${k} --repo "$R" --body ${JSON.stringify(v)}`).join('\n')}
gh secret set DEPLOY_HOST --repo "$R" --body ${JSON.stringify(host)}
gh secret set DEPLOY_USUARIO --repo "$R" --body ${JSON.stringify(usuario)}
${claves ? `gh secret set DEPLOY_SSH_KEY --repo "$R" < "${dir}/clave-deploy"` : '# DEPLOY_SSH_KEY: cargala a mano con tu clave privada'}
echo "Listo: variables y secretos cargados en $R"
`,
);
chmodSync(`${dir}/cargar-en-github.sh`, 0o700);

const pasos: string[] = [`# Deploy en Hostinger · ${dominio} (${modo === 'vps' ? 'VPS con Docker' : 'hosting compartido'})`, ''];
if (modo === 'vps') {
  writeFileSync(
    `${dir}/docker-compose.yml`,
    `# ${carpeta}/docker-compose.yml en el VPS. La imagen la carga el workflow de GitHub (presentaciones:actual).
services:
  app:
    image: presentaciones:actual
    restart: unless-stopped
    env_file: .env
    expose: ["8787"]
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443", "443:443/udp"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_datos:/data
      - caddy_config:/config
    depends_on: [app]
volumes:
  caddy_datos:
  caddy_config:
`,
  );
  writeFileSync(`${dir}/Caddyfile`, `{\n\temail ${email}\n}\n\n${dominio} {\n\tencode gzip\n\treverse_proxy app:8787\n}\n`);
  writeFileSync(`${dir}/.env`, `PORT=8787\nHOST=0.0.0.0\nSERVIR_ESTATICOS=dist\nMISMO_ORIGEN=true\nCONFIAR_PROXY=true\nQR_REDIRECCIONES=decks/handyx/qr.json\nALLOWED_ORIGINS=https://${dominio}\n`);
  const archivos = ['docker-compose.yml', 'Caddyfile', '.env'].map((f) => `cat > ${carpeta}/${f} <<'FIN_${f.replace(/\W/g, '')}'\n${readFileSync(`${dir}/${f}`, 'utf8')}FIN_${f.replace(/\W/g, '')}`).join('\n');
  writeFileSync(
    `${dir}/preparar-vps.sh`,
    `#!/usr/bin/env bash
# Pegalo UNA VEZ en la consola del VPS (hPanel → VPS → Terminal del navegador, o ssh ${usuario}@${host} -p ${puerto}).
set -euo pipefail
command -v docker >/dev/null || curl -fsSL https://get.docker.com | sh
mkdir -p ${carpeta} ~/.ssh && chmod 700 ~/.ssh
${claves ? `grep -qF "${claves.publica}" ~/.ssh/authorized_keys 2>/dev/null || echo "${claves.publica}" >> ~/.ssh/authorized_keys\nchmod 600 ~/.ssh/authorized_keys` : '# Agregá tu clave pública a ~/.ssh/authorized_keys'}
${archivos}
command -v ufw >/dev/null && ufw allow 80/tcp && ufw allow 443/tcp || true
echo "VPS listo. Ahora: GitHub → Actions → 'Deploy Hostinger' → Run workflow (o push a ${rama})."
`,
  );
  chmodSync(`${dir}/preparar-vps.sh`, 0o700);
  pasos.push(
    `1. **DNS:** en hPanel → Dominios → DNS de ${dominio.split('.').slice(-2).join('.')}: registro **A** \`${dominio.split('.')[0]}\` → \`${host}\`.`,
    `2. **VPS:** abrí la terminal del VPS y pegá el contenido de \`preparar-vps.sh\` (instala Docker si falta, autoriza la clave de deploy, crea ${carpeta} con docker-compose.yml, Caddyfile y .env).`,
    `3. **GitHub:** cargá variables y secretos: \`bash ${dir}/cargar-en-github.sh\` (Codespaces) o a mano con \`github-variables.txt\` y \`github-secretos.txt\`.`,
    `4. **Publicar:** GitHub → Actions → **Deploy Hostinger** → Run workflow (o push a \`${rama}\`). El workflow prueba, construye la imagen, la sube al VPS y la levanta; Caddy saca el certificado HTTPS solo.`,
    `5. **Probar:** https://${dominio}/salud → \`{"ok":true…}\` y https://${dominio}/ → hub.`,
  );
} else {
  writeFileSync(`${dir}/.htaccess`, `# Va dentro de ${carpeta} (el workflow lo sube junto al sitio)\nOptions -Indexes\nAddType application/manifest+json .webmanifest\n<IfModule mod_headers.c>\n  <FilesMatch "\\.(js|css|webp|png|jpg|svg|woff2|mp4)$">\n    Header set Cache-Control "public, max-age=31536000, immutable"\n  </FilesMatch>\n  <FilesMatch "\\.html$">\n    Header set Cache-Control "no-cache"\n  </FilesMatch>\n  Header set X-Content-Type-Options "nosniff"\n  Header set Referrer-Policy "no-referrer"\n</IfModule>\n`);
  pasos.push(
    `1. **SSH:** hPanel → Avanzado → Acceso SSH → activalo${claves ? ' y en "Claves SSH" pegá esta clave pública:\n\n   \`' + claves.publica + '\`' : ''}.`,
    `2. **GitHub:** \`bash ${dir}/cargar-en-github.sh\` o a mano con \`github-variables.txt\` y \`github-secretos.txt\`.`,
    `3. **Publicar:** GitHub → Actions → **Deploy Hostinger** → Run workflow. Sube el sitio estático a \`${carpeta}\`.`,
    servidorControl ? `4. El control del celular usa ${servidorControl} (tiene que permitir el origen https://${dominio}).` : '4. Sin servidor de control: la presentación anda con teclado/clicker; el celular no.',
  );
}
pasos.push('', '**Seguridad:** `github-secretos.txt` y `clave-deploy` son privados: no los subas a ningún lado; borralos cuando termines.');
writeFileSync(`${dir}/LEEME.md`, pasos.join('\n') + '\n');
console.log(`\n✓ Listo. Archivos en ${dir}/ — empezá por ${dir}/LEEME.md\n`);
for (const f of ['LEEME.md', 'github-variables.txt', 'github-secretos.txt', 'cargar-en-github.sh', ...(modo === 'vps' ? ['preparar-vps.sh', 'docker-compose.yml', 'Caddyfile', '.env'] : ['.htaccess']), ...(claves ? ['clave-deploy', 'clave-deploy.pub'] : [])])
  if (existsSync(`${dir}/${f}`)) console.log(`   · ${dir}/${f}`);
