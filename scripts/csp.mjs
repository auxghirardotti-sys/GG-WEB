/**
 * Genera y VERIFICA la Content-Security-Policy que vive en vercel.json.
 *
 * Por que existe este script y no una CSP escrita a mano:
 *
 * El sitio tiene scripts en linea que no se pueden empaquetar. El mas importante es el
 * guardia de <head> que agrega la clase "js" y arma la red de seguridad del revelado:
 * va en linea justamente porque tiene que correr ANTES que nada, y es lo que evita que
 * la pagina quede en blanco. Para permitirlos sin abrir la mano con 'unsafe-inline' hay
 * que listar el hash sha256 de cada uno.
 *
 * El problema de los hashes: si alguien toca uno de esos scripts, el hash de vercel.json
 * deja de coincidir, el navegador BLOQUEA el script y el sitio vuelve a quedarse en
 * blanco. Sin error de build, sin aviso: roto en produccion y nadie se entera.
 *
 * Por eso el build corre este script en modo verificacion. Si los hashes no coinciden,
 * el build FALLA con el detalle. Para actualizarlos:
 *
 *     node scripts/csp.mjs --write
 *
 * Los <script type="application/ld+json"> (los datos estructurados de SEO) quedan afuera
 * a proposito: el navegador no los ejecuta, asi que script-src no los alcanza.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const DIST = 'dist/client';
const VERCEL_JSON = 'vercel.json';

/** Origenes externos que el sitio necesita de verdad. Medidos sobre el build, no supuestos:
 *  todo lo demas (scripts, estilos, fuentes, imagenes) se sirve desde el propio dominio. */
const EXTERNOS = {
  // El iframe del mapa en /contacto. google.com va tambien porque el embed redirige ahi.
  frame: ['https://maps.google.com', 'https://www.google.com'],
  // A donde postea el formulario de contacto cuando se active la clave de Web3Forms.
  form: ['https://api.web3forms.com'],
};

function hashesDelBuild() {
  const archivos = execSync(`find ${DIST} -name "*.html"`, { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean);
  if (!archivos.length) throw new Error(`no encontre HTML en ${DIST}: corre "astro build" primero`);

  const hashes = new Map(); // hash -> en cuantas paginas aparece
  for (const f of archivos) {
    const html = readFileSync(f, 'utf8');
    const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
    let m;
    while ((m = re.exec(html))) {
      const [, attrs, cuerpo] = m;
      if (/\bsrc=/.test(attrs)) continue;                                   // externo
      if (!cuerpo.trim()) continue;
      if (/type\s*=\s*["']application\/(ld\+json|json)["']/.test(attrs)) continue; // datos, no se ejecuta
      const h = `sha256-${createHash('sha256').update(cuerpo, 'utf8').digest('base64')}`;
      hashes.set(h, (hashes.get(h) || 0) + 1);
    }
  }
  return { hashes: [...hashes.keys()].sort(), paginas: archivos.length };
}

function armarCSP(hashes) {
  return [
    `default-src 'self'`,
    // 'self' cubre los bundles de Astro; los hashes, los scripts en linea.
    `script-src 'self' ${hashes.map((h) => `'${h}'`).join(' ')}`,
    // 'unsafe-inline' hace falta por los atributos style= del markup (unos 70). Los hashes
    // NO sirven para atributos de estilo: eso pide 'unsafe-hashes', que casi ningun
    // navegador implementa bien. Es el compromiso habitual y el vector mas debil de los dos.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src 'self' ${EXTERNOS.form.join(' ')}`,
    `frame-src ${EXTERNOS.frame.join(' ')}`,
    `form-action 'self' ${EXTERNOS.form.join(' ')}`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');
}

function leerVercel() { return JSON.parse(readFileSync(VERCEL_JSON, 'utf8')); }

function cspGuardada(cfg) {
  const bloque = cfg.headers?.find((h) => h.source === '/(.*)');
  return bloque?.headers?.find((h) => h.key === 'Content-Security-Policy')?.value ?? null;
}

const { hashes, paginas } = hashesDelBuild();
const esperada = armarCSP(hashes);
const cfg = leerVercel();
const guardada = cspGuardada(cfg);
const escribir = process.argv.includes('--write');

if (escribir) {
  const bloque = cfg.headers.find((h) => h.source === '/(.*)');
  if (!bloque) throw new Error('no encuentro el bloque de cabeceras "/(.*)"' + ' en vercel.json');
  const existente = bloque.headers.find((h) => h.key === 'Content-Security-Policy');
  if (existente) existente.value = esperada;
  else bloque.headers.push({ key: 'Content-Security-Policy', value: esperada });
  writeFileSync(VERCEL_JSON, JSON.stringify(cfg, null, 2) + '\n');
  console.log(`[csp] vercel.json actualizado con ${hashes.length} hashes (${paginas} paginas).`);
  process.exit(0);
}

if (guardada === esperada) {
  console.log(`[csp] ok: ${hashes.length} hashes coinciden (${paginas} paginas).`);
  process.exit(0);
}

console.error('\n[csp] LA CSP DE vercel.json NO COINCIDE CON EL BUILD.');
console.error('      Si se despliega asi, el navegador bloquea los scripts en linea que');
console.error('      no figuren, y uno de ellos es el que evita la pagina en blanco.\n');
if (!guardada) {
  console.error('      vercel.json no tiene ninguna Content-Security-Policy.');
} else {
  const g = new Set(guardada.match(/'sha256-[^']+'/g) || []);
  const e = new Set(esperada.match(/'sha256-[^']+'/g) || []);
  const faltan = [...e].filter((h) => !g.has(h));
  const sobran = [...g].filter((h) => !e.has(h));
  if (faltan.length) console.error(`      faltan ${faltan.length}: ${faltan.join(' ')}`);
  if (sobran.length) console.error(`      sobran ${sobran.length}: ${sobran.join(' ')}`);
  if (!faltan.length && !sobran.length) console.error('      cambio alguna directiva que no es un hash.');
}
console.error('\n      Arreglalo con:  node scripts/csp.mjs --write\n');
process.exit(1);
