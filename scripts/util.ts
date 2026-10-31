// Utilidades de scripts: Playwright preinstalado (fuera del proyecto) y servidor estático temporal.
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';
import { crearApp } from '../server/app.ts';

// Playwright viene preinstalado en el entorno (no es dependencia del proyecto): se tipa de forma laxa a propósito.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Pw = { chromium: { launch: (o?: object) => Promise<any> } };
export function playwright(): Pw {
  const req = createRequire(import.meta.url);
  try {
    return req('playwright');
  } catch {
    const raiz = process.env['NODE_PATH']?.split(':')[0] ?? '/usr/local/lib/node_modules';
    return req(`${raiz}/playwright`);
  }
}

/** Sirve dist/ con el mismo servidor de sesiones en un puerto libre de localhost. */
export async function servirDist(): Promise<{ url: string; cerrar: () => Promise<void> }> {
  const app = crearApp({ puerto: 0, origenes: [], estaticos: 'dist', redirecciones: [], version: 'export', confiarProxy: false });
  await new Promise<void>((ok) => app.servidor.listen(0, '127.0.0.1', ok));
  const { port } = app.servidor.address() as AddressInfo;
  return { url: `http://127.0.0.1:${port}`, cerrar: app.cerrar };
}

export function args(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
    if (m) out[m[1] as string] = m[2] ?? 'true';
  }
  return out;
}
