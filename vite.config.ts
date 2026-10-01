import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Builds everything (code, fonts, PDF reader) into one HTML file you can double-click.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist', assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 10_000 },
});
