// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// site: URL publica del sitio. Es el dominio CANONICO: ggasoc.com sin www redirige
// 308 a www, asi que va con www. De aca salen canonical, og:url, og:image y el
// sitemap. Quedo apuntando a gg-web.vercel.app mucho despues de conectar el dominio
// propio, y eso dejaba el og:image en 404: todo link compartido salia sin imagen.
// Adapter Vercel + react/keystatic: las páginas siguen siendo estáticas; solo el panel /keystatic
// y su API se renderizan on-demand (panel de edición de contenido).
export default defineConfig({
  site: 'https://www.ggasoc.com',
  integrations: [sitemap(), react(), keystatic()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
