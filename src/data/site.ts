// El contenido editable vive en src/content/*.json y se administra desde el panel /keystatic.
// Acá lo importamos y lo re-exportamos con los mismos nombres: los componentes no cambian.
import siteData from '../content/site/index.json';
import teamData from '../content/team/index.json';
import faqData from '../content/faq/index.json';
import testimonialsData from '../content/testimonials/index.json';
import industriesData from '../content/industries/index.json';
import differentialsData from '../content/differentials/index.json';

export const SITE = siteData;

export const waLink = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

/** Link de WhatsApp con mensaje personalizado (ej: prellenado por servicio) */
export const waLinkFor = (message: string) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;

export interface Client {
  name: string;
  /** Ruta al logo real cuando esté disponible (ej: /clients/icbc.svg). Vacío = se muestra el nombre como wordmark. */
  logo?: string;
  /** Override de alto del logo en el marquee. Los logos cuadrados/apilados (ej. emblemas) necesitan más alto
   *  para tener presencia pareja junto a los wordmarks anchos. Default: 'h-10 w-auto'. */
  imgClass?: string;
}

/** Clientes / empresas que confían en el estudio — se muestran en el marquee de la home.
 *  Para usar logos reales: dejar el archivo en public/clients/ y completar `logo` (ej: '/clients/icbc.svg'). */
// El sufijo -v2 de los archivos rompe la cache: public/ se sirve con max-age de 7 dias,
// y sin cambiarle el nombre al archivo quien ya visito el sitio se queda una semana con
// la version vieja y mas pesada. Si se vuelve a optimizar un logo, subirle el numero.
export const CLIENTS: Client[] = [
  { name: 'Tandanor', logo: '/clients/tandanor-v2.png', imgClass: 'h-14 w-auto' },
  { name: 'OCA', logo: '/clients/oca-v2.svg' },
  { name: 'ICBC', logo: '/clients/icbc-v2.svg' },
  { name: 'Ocutech', logo: '/clients/ocutech-v2.png' },
  // Cambre es un logo apilado (emblema arriba + palabra): con h-10 la palabra queda
  // la mitad de alta que los wordmarks de al lado, así que va con h-14 como Tandanor.
  { name: 'Cambre', logo: '/clients/cambre-v2.png', imgClass: 'h-14 w-auto' },
  { name: 'Lentax', logo: '/clients/lentax-v2.svg' },
];

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
  bio: string;
  credentials: string[];
  /** Ruta a la foto real cuando esté disponible (ej: /team/mariano.jpg) */
  photo?: string;
}

export const TEAM: TeamMember[] = (teamData.members as any[]).map((m) => ({
  ...m,
  // Keystatic guarda solo el nombre de archivo de la foto; le anteponemos la ruta pública.
  photo: m.photo ? `/team/${m.photo}` : undefined,
}));

/** Cómo trabajamos — pasos del embudo que bajan la fricción de contactar */
export const PROCESS = [
  {
    step: '01',
    icon: 'chat',
    title: 'Nos escribís',
    text: 'Por WhatsApp o el formulario. Contanos qué necesitás resolver.',
  },
  {
    step: '02',
    icon: 'clipboard',
    title: 'Vemos tu situación',
    text: 'Revisamos tu caso y te decimos por dónde conviene empezar.',
  },
  {
    step: '03',
    icon: 'doc',
    title: 'Propuesta a medida',
    text: 'Esquema de trabajo y honorarios claros, según tu empresa.',
  },
  {
    step: '04',
    icon: 'handshake',
    title: 'Te acompañamos',
    text: 'Un interlocutor directo todo el año, que conoce tu empresa.',
  },
];

/** Preguntas frecuentes, testimonios, industrias y diferenciales — editables desde /keystatic */
export const FAQ = faqData.items;

export const TESTIMONIALS = testimonialsData.items;

export const INDUSTRIES = industriesData.items;

export const DIFFERENTIALS = differentialsData.items;
