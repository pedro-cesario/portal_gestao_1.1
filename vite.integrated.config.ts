/**
 * E2E-only Vite dev server. API requests are sent to a pre-provisioned genuine
 * PAR2357 FastAPI listening on a fixed loopback address, never to GLPI.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, '.') } },
  server: {
    host: '127.0.0.1',
    port: 4174,
    strictPort: true,
    proxy: {
      '/v1': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: false,
      },
      '/health': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: false,
      },
    },
  },
});
