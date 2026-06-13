import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tanstackRouter(), tailwindcss()],
    optimizeDeps: {
      include: ['ag-grid-community', 'ag-grid-react'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom', 'ag-grid-community', 'ag-grid-react'],
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(env.PORT ?? '5173'),
      allowedHosts: env.ALLOWED_HOST ? [env.ALLOWED_HOST] : [],
      watch: {
        ignored: ['!**/node_modules/@57eme-regiment/**'],
      },
    },
  };
});
