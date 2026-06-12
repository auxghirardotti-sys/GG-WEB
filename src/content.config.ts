import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const novedades = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/novedades' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** Medio o institución donde salió la nota (El Economista, Clarín, AAEF...) */
    source: z.string().optional(),
    excerpt: z.string(),
    /** Link a la nota original si está disponible */
    externalUrl: z.string().url().optional(),
  }),
});

export const collections = { novedades };
