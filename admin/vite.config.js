import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const previewHost = process.env.PREVIEW_PUBLIC_HOST;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ssmi/functions': path.resolve(repoRoot, 'functions/src/index.js'),
      '@ssmi/flutter-assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    host: '127.0.0.1',
    allowedHosts: previewHost ? [previewHost] : [],
    fs: {
      allow: [repoRoot],
    },
    hmr: previewHost
      ? {
          protocol: 'wss',
          host: previewHost,
          clientPort: 443,
        }
      : undefined,
  },
});
