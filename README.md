# GG-WEB — Sitio institucional Ghirardotti & Ghirardotti

Sitio estático del estudio (reemplazo de ggasoc.com), hecho con **Astro 5 + Tailwind CSS 4** y deployado en **Vercel**.

## Comandos

```bash
npm run dev       # servidor local en http://localhost:4321
npm run build     # build de producción en dist/
npm run preview   # previsualizar el build
```

## Cómo editar el contenido

| Qué | Dónde |
|---|---|
| Teléfono, WhatsApp, email, dirección, LinkedIn | `src/data/site.ts` |
| Equipo (socios, bios) | `src/data/site.ts` → `TEAM` |
| Industrias y diferenciales | `src/data/site.ts` |
| Textos y listas de los 5 servicios | `src/data/services.ts` |
| Home | `src/pages/index.astro` |
| Quiénes somos / Contacto | `src/pages/quienes-somos.astro` / `contacto.astro` |

## Cómo agregar una novedad

Crear un archivo `.md` en `src/content/novedades/`, por ejemplo `mi-nota.md`:

```markdown
---
title: 'Título de la nota'
date: 2026-06-12
source: 'Clarín'            # opcional: medio donde salió
excerpt: 'Resumen de una línea que aparece en el listado.'
externalUrl: 'https://...'  # opcional: link a la nota original
---

Texto de la nota en markdown.
```

Con eso solo, la nota aparece en `/novedades` y en la home. (Lo más fácil: pedírselo a Claude Code.)

## Formulario de contacto (pendiente de habilitar)

El formulario usa [Web3Forms](https://web3forms.com) (gratis hasta 250 envíos/mes):

1. Entrar a https://web3forms.com y crear una Access Key con el email `info@ggasoc.com` (la key llega a ese correo).
2. Pegar la key en `src/data/site.ts` → `web3formsKey`.
3. Hacer commit y push (Vercel redeploya solo).

Mientras la key esté vacía, el formulario muestra un aviso que deriva a WhatsApp/email.

## Dominio

El sitio está pensado para colgar de un dominio propio cuando se recupere `ggasoc.com` (o se compre otro). Al cambiarlo, actualizar:

- `site` en `astro.config.mjs`
- `url` en `src/data/site.ts`
- `Sitemap:` en `public/robots.txt`
