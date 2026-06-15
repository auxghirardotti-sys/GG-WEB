// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// site: URL pública del sitio. Hoy apunta a Vercel; cambiar cuando se conecte un dominio propio.
// Adapter Vercel + react/keystatic: las páginas siguen siendo estáticas; solo el panel /keystatic
// y su API se renderizan on-demand (panel de edición de contenido).
export default defineConfig({
  site: 'https://gg-web.vercel.app',
  integrations: [sitemap(), react(), keystatic()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
