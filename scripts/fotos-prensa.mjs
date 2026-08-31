/**
 * Baja la foto de portada de cada nota de prensa y la deja optimizada en
 * src/assets/prensa/<slug>.webp
 *
 * De dónde sale la foto: del <meta property="og:image"> de la nota. Es la imagen que el
 * propio medio publica PARA que los terceros la muestren al enlazar la nota — es el uso
 * para el que existe Open Graph. La tarjeta enlaza siempre a la nota original y acredita
 * al medio con su nombre como elemento más grande.
 *
 * Ojo con las URLs: vienen dentro de un atributo HTML, así que los & llegan como &amp;.
 * Si no se decodifican, los medios sobre Arc (Infobae, La Nación, El Cronista) devuelven
 * 400 y parece que estuvieran bloqueando. No bloquean: la URL estaba rota.
 *
 * Uso:
 *   node scripts/fotos-prensa.mjs          -> solo las que faltan
 *   node scripts/fotos-prensa.mjs --force  -> rehace todas
 *
 * No corre en el build a propósito: el build tiene que poder compilar sin red y sin
 * depender de que los sitios de los medios estén arriba. Se corre a mano al agregar una
 * nota y las imágenes quedan versionadas.
 */
import { readdir, readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const NOTAS = 'src/content/novedades';
const SALIDA = 'src/assets/prensa';
const FORCE = process.argv.includes('--force');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

/** Los & de un atributo HTML llegan como &amp;. Sin esto, las URLs con token se rompen. */
const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#38;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const existe = (p) =>
  access(p).then(
    () => true,
    () => false
  );

async function ogImage(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`la nota respondió ${res.status}`);
  const html = await res.text();
  // og:image puede venir con property o name, y en cualquier orden de atributos
  const m =
    html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']og:image["']/i);
  if (!m) throw new Error('la nota no publica og:image');
  return new URL(decodeEntities(m[1]), url).toString();
}

async function main() {
  await mkdir(SALIDA, { recursive: true });
  const archivos = (await readdir(NOTAS)).filter((f) => f.endsWith('.md'));
  let bajadas = 0,
    saltadas = 0,
    sinFoto = 0;

  for (const archivo of archivos) {
    const slug = archivo.replace(/\.md$/, '');
    const destino = join(SALIDA, `${slug}.webp`);

    if (!FORCE && (await existe(destino))) {
      saltadas++;
      continue;
    }

    const md = await readFile(join(NOTAS, archivo), 'utf8');
    const url = md.match(/^externalUrl:\s*'([^']+)'/m)?.[1];
    if (!url) {
      console.log(`—  ${slug}: sin link externo`);
      sinFoto++;
      continue;
    }

    try {
      const img = await ogImage(url);
      const res = await fetch(img, { headers: { 'user-agent': UA }, redirect: 'follow' });
      if (!res.ok) throw new Error(`la imagen respondió ${res.status}`);
      const original = Buffer.from(await res.arrayBuffer());

      // La tarjeta muestra la foto a 16:9 y como máximo ~350px de ancho, así que 760
      // alcanza de sobra hasta 2x. Es lo que convierte los 2,4 MB de El Economista en
      // unos pocos KB.
      const salida = await sharp(original)
        .resize(760, 428, { fit: 'cover', position: 'attention' })
        .webp({ quality: 74, effort: 6 })
        .toBuffer();

      await writeFile(destino, salida);
      const kb = (n) => `${Math.round(n / 1024)} KB`;
      console.log(`ok ${slug}: ${kb(original.length)} -> ${kb(salida.length)}`);
      bajadas++;
    } catch (err) {
      console.log(`!  ${slug}: ${err.message}`);
      sinFoto++;
    }
  }

  console.log(`\n${bajadas} bajadas · ${saltadas} ya estaban · ${sinFoto} sin foto`);
}

main();
