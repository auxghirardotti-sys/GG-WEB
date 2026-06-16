import type { ImageMetadata } from 'astro';

// Resuelve una ruta tipo "/img/foo.jpg" (o "foo.jpg") al ImageMetadata importado
// desde src/assets/img, para optimizar con <Image> (WebP + tamaños responsivos).
const mods = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.{jpg,jpeg,png}', {
  eager: true,
});

const byName: Record<string, ImageMetadata> = {};
for (const path in mods) {
  const name = path.split('/').pop()!;
  byName[name] = mods[path].default;
}

/** Devuelve el ImageMetadata optimizable para una ruta/nombre de imagen. */
export function img(pathOrName: string): ImageMetadata {
  const name = pathOrName.split('/').pop()!;
  const found = byName[name];
  if (!found) throw new Error(`Imagen no encontrada en src/assets/img: ${name}`);
  return found;
}
