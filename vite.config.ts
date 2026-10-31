import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Base relativa: el mismo build sirve en Hostinger (subcarpeta o raíz) y en el paquete local.
export default defineConfig({
  base: process.env['VITE_BASE'] ?? './',
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        inicio: resolve(import.meta.dirname, 'index.html'),
        presentar: resolve(import.meta.dirname, 'presentar/index.html'),
        presentador: resolve(import.meta.dirname, 'presentador/index.html'),
        control: resolve(import.meta.dirname, 'control/index.html'),
        imprimir: resolve(import.meta.dirname, 'imprimir/index.html'),
      },
    },
  },
  server: { port: 5173, host: true },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
} as never);
