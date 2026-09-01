/**
 * Color de cada medio. El nombre del diario se escribe EN este color, sobre el fondo
 * blanco de la tarjeta (NovedadCard), asi que cada uno tiene que cumplir contraste.
 *
 * De donde salen: del CSS y del favicon de cada sitio, no de memoria.
 *
 * OJO ANTES DE TOCARLOS. El nombre va a 19px en font-display, que es weight 800: por
 * encima de los 18,66px que WCAG pide para tratarlo como texto grande, y por eso el
 * umbral que aplica es 3:1 y no 4,5:1. Si alguien vuelve a achicar ese texto por debajo
 * de 18,66px, el umbral salta a 4,5:1 y estos tres dejan de pasar. Medidos sobre blanco:
 *
 *   Infobae        #db7e01  3,00   (era #f68e01, daba 2,39)
 *   iProfesional   #ec7200  3,01   (era #ef7300, daba 2,95)
 *   El Economista  #10a1c7  3,02   (era #10a3c9, daba 2,96)
 *   Chequeado      #f72d54  3,85   sin tocar
 *   El Cronista    #ed1a3b  4,36   sin tocar
 *   Clarin         #cc001b  5,86   sin tocar
 *   La Nacion      #0250c9  7,02   sin tocar
 *
 * Se oscurecieron en HSL bajando SOLO la luminosidad, para no correr el tono: siguen
 * siendo el color del diario. Se descarto llevarlos a 4,5:1 porque a ese nivel el naranja
 * de Infobae cae a #ae6501, que ya se lee marron y deja de ser su color.
 *
 * Es uso nominativo: el nombre en NUESTRA tipografia y su color. Nunca el logotipo del
 * medio ni su lettering.
 *
 * Un medio que no este aca cae en el rojo del estudio, que es lo correcto para los que no
 * son diarios (AAEF es la asociacion donde Mariano dio un curso).
 */
export const COLOR_MEDIO: Record<string, string> = {
  Infobae: '#db7e01',
  'El Cronista': '#ed1a3b',
  'La Nación': '#0250c9',
  iProfesional: '#ec7200',
  'El Economista': '#10a1c7',
  Clarín: '#cc001b',
  Chequeado: '#f72d54',
};

/** El color del medio, o el rojo del estudio si no lo tenemos. */
export const colorDeMedio = (source?: string): string =>
  (source && COLOR_MEDIO[source]) || 'var(--color-brand)';
