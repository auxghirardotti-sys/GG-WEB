/**
 * Color de cada medio para las tarjetas de prensa.
 *
 * De dónde salen: los tomé del CSS y del favicon de cada sitio, no de memoria.
 * Varios están apenas más oscuros que el original de marca, y eso es a propósito:
 * el nombre se muestra sobre blanco a 22-28px en peso 800, o sea "texto grande"
 * para WCAG, que pide 3:1 como mínimo. Los naranjas de Infobae (#f68e01, 2,39:1) e
 * iProfesional (#ef7300, 2,95:1) y el cian de El Economista (#10a3c9, 2,96:1) no
 * llegaban, así que van bajados hasta 3,2:1 —lo justo para que se lean sin dejar de
 * ser su color—. Forzarlos hasta 4,5:1 los convertía en marrón y dejaban de
 * reconocerse.
 *
 * Es uso nominativo: el nombre escrito en NUESTRA tipografía y en su color. Nunca
 * el logotipo del medio ni su lettering. El filete dry-brush y el isotipo de agua
 * de la tarjeta siguen en el rojo del estudio: son el hilo que mantiene las 14
 * tarjetas como una serie de G&G.
 *
 * Un medio que no esté acá cae en el rojo del estudio, que es lo correcto para los
 * que no son diarios (AAEF es la asociación donde Mariano dio un curso).
 */
export const COLOR_MEDIO: Record<string, string> = {
  Infobae: '#d37a01', // marca #f68e01
  'El Cronista': '#ed1a3b',
  'La Nación': '#0250c9',
  iProfesional: '#e56e00', // marca #ef7300
  'El Economista': '#0f9cc0', // marca #10a3c9
  Clarín: '#cc001b',
  Chequeado: '#f72d54',
};

/** El color del medio, o el rojo del estudio si no lo tenemos. */
export const colorDeMedio = (source?: string): string =>
  (source && COLOR_MEDIO[source]) || 'var(--color-brand)';
