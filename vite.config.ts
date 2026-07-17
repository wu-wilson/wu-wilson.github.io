import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site is served from the apex custom domain (wilsonwu.io) on GitHub Pages, so the
// base path stays at the root '/'. Only a project-page deploy (user.github.io/repo) would
// need a base override.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
