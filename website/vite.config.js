import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const previewHost = process.env.PREVIEW_PUBLIC_HOST;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    allowedHosts: previewHost ? [previewHost, 'localhost'] : true,
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
