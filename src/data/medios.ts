/**
 * Color de cada medio para el filete de las tarjetas de prensa.
 *
 * De dónde salen: los saqué del CSS y del favicon de cada sitio, no de memoria. Son los
 * colores de marca tal cual, sin retocar.
 *
 * Antes estaban oscurecidos porque el nombre del medio iba escrito en su color y algunos
 * (los naranjas de Infobae e iProfesional, el cian de El Economista) no llegaban al
 * contraste que pide el texto. Ahora el nombre va en tinta y el color quedó solo en el
 * filete, que es decorativo: el dato lo da el nombre escrito justo encima, así que no hay
 * umbral de contraste que cumplir y podemos usar el color real.
 *
 * Es uso nominativo: el nombre en NUESTRA tipografía y un filete de su color. Nunca el
 * logotipo del medio ni su lettering.
 *
 * Un medio que no esté acá cae en el rojo del estudio, que es lo correcto para los que no
 * son diarios (AAEF es la asociación donde Mariano dio un curso).
 */
export const COLOR_MEDIO: Record<string, string> = {
  Infobae: '#f68e01',
  'El Cronista': '#ed1a3b',
  'La Nación': '#0250c9',
  iProfesional: '#ef7300',
  'El Economista': '#10a3c9',
  Clarín: '#cc001b',
  Chequeado: '#f72d54',
};

/** El color del medio, o el rojo del estudio si no lo tenemos. */
export const colorDeMedio = (source?: string): string =>
  (source && COLOR_MEDIO[source]) || 'var(--color-brand)';
