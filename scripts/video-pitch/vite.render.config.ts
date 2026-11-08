// Servidor para renderizar videos cuadro a cuadro (npx vite --config scripts/video-pitch/vite.render.config.ts):
// sin HMR ni vigilancia de archivos, así una edición en paralelo no recarga la página en medio de un render.
import base from '../../vite.config.ts';

export default { ...base, server: { port: 5191, strictPort: true, host: '127.0.0.1', hmr: false, watch: { ignored: ['**/*'] } } };
