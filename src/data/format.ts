/** Las fechas del frontmatter se parsean como UTC; formatear también en UTC
 *  para que no se corran un día hacia atrás en husos negativos como Argentina. */
export const fmtDate = (d: Date) =>
  d.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
