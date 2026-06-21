import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ssmi/functions': path.resolve(repoRoot, 'functions/src/index.js'),
    },
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
