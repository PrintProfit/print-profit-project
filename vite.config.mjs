import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
  plugins: [react(), imagetools()],
});
