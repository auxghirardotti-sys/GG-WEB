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
    title: 'Diagnóstico sin cargo',
    text: 'Un socio revisa tu situación y te dice cómo ayudarte. Gratis.',
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
    text: 'Un socio como interlocutor directo todo el año, no solo en vencimientos.',
  },
];

/** Preguntas frecuentes, testimonios, industrias y diferenciales — editables desde /keystatic */
export const FAQ = faqData.items;

export const TESTIMONIALS = testimonialsData.items;

export const INDUSTRIES = industriesData.items;

export const DIFFERENTIALS = differentialsData.items;
