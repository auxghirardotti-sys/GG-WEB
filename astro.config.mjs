// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// site: URL pública del sitio. Hoy apunta a Vercel; cambiar cuando se conecte un dominio propio.
export default defineConfig({
  site: 'https://gg-web.vercel.app',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
