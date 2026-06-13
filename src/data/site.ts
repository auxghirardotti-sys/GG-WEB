export const SITE = {
  name: 'Ghirardotti & Ghirardotti',
  legalName: 'Ghirardotti & Ghirardotti S.C.',
  tagline: 'Asesoría contable orientada a soluciones',
  description:
    'Estudio contable e impositivo en San Isidro, Buenos Aires. Más de 40 años asesorando empresas en impuestos, auditoría, sociedades, agro y outsourcing contable.',
  url: 'https://gg-web.vercel.app',

  email: 'info@ggasoc.com',
  phoneDisplay: '+54 9 11 3511-6890',
  phoneHref: 'tel:+5491135116890',

  whatsappNumber: '5491135116890',
  whatsappMessage:
    'Hola, los contacto desde la web del estudio G&G. Quisiera hacer una consulta.',

  address: 'Chacabuco 511 P.B., San Isidro',
  addressFull: 'Chacabuco 511 P.B., San Isidro (CP 1642), Buenos Aires, Argentina',
  mapsLink:
    'https://maps.google.com/?q=Chacabuco+511,+San+Isidro,+Buenos+Aires,+Argentina',
  mapsEmbed:
    'https://maps.google.com/maps?q=Chacabuco+511,+San+Isidro,+Buenos+Aires,+Argentina&z=16&output=embed',

  linkedin: 'https://www.linkedin.com/company/ghirardotti-&-ghirardotti-sc/',

  // Access key de Web3Forms para el formulario de contacto (ver README.md).
  // Mientras esté vacía, el formulario sugiere escribir por WhatsApp o email.
  web3formsKey: '',
};

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

export const TEAM: TeamMember[] = [
  {
    name: 'Armando Ghirardotti',
    role: 'Socio Fundador',
    initials: 'AG',
    bio: 'Fundador del estudio, con más de 40 años liderando la firma en auditoría, asesoramiento impositivo, societario y contable.',
    credentials: ['Contador Público', '+40 años de ejercicio'],
  },
  {
    name: 'Mariano Ghirardotti',
    role: 'Socio Director',
    initials: 'MG',
    bio: 'Más de veinte años dedicado a la planificación tributaria. Lleva la estrategia fiscal de las empresas del estudio.',
    credentials: [
      'Contador Público (1993)',
      'Especialista en Tributación (UBA)',
      'Docente MBA · Universidad de San Andrés',
      'Miembro de la AAEF',
    ],
  },
  {
    name: 'Florencia Ghirardotti',
    role: 'Asociada · Sociedades',
    initials: 'FG',
    bio: 'Doce años como Abogada Senior en Brichou, Fernández Madero & Lombard. Lidera el asesoramiento corporativo y las reorganizaciones societarias.',
    credentials: ['Abogada (UCA, diploma de honor)', 'Asesoramiento corporativo'],
  },
  {
    name: 'Gisela Franceschina',
    role: 'Socia COO',
    initials: 'GF',
    bio: 'Especializada en impuestos agropecuarios. Productora agropecuaria: conoce el negocio del agro desde el campo y desde los números.',
    credentials: ['Contadora Pública', 'MBA en curso · Universidad de San Andrés', 'Productora agropecuaria'],
  },
];

/** Cómo trabajamos — pasos del embudo que bajan la fricción de contactar */
export const PROCESS = [
  {
    step: '01',
    title: 'Nos escribís',
    text: 'Por WhatsApp o el formulario. Nos contás qué empresa tenés y qué necesitás resolver.',
  },
  {
    step: '02',
    title: 'Diagnóstico sin cargo',
    text: 'Un socio revisa tu situación y te dice con franqueza cómo podemos ayudarte. La primera charla no tiene costo.',
  },
  {
    step: '03',
    title: 'Propuesta a medida',
    text: 'Armamos un esquema de trabajo y honorarios claro, adaptado al tamaño y la industria de tu empresa.',
  },
  {
    step: '04',
    title: 'Te acompañamos',
    text: 'Quedás con un socio como interlocutor directo durante todo el año, no solo en los vencimientos.',
  },
];

/** Preguntas frecuentes que bajan objeciones antes del CTA */
export const FAQ = [
  {
    q: '¿Atienden empresas chicas o solo grandes?',
    a: 'Trabajamos con empresas de todos los tamaños: desde emprendimientos y PyMEs familiares hasta grupos consolidados. El esquema de trabajo y los honorarios se adaptan a cada caso.',
  },
  {
    q: '¿Trabajan con clientes de otras provincias o de forma remota?',
    a: 'Sí. Buena parte de nuestros clientes opera fuera de Buenos Aires. La operatoria es digital y la atención del socio es la misma, estés donde estés.',
  },
  {
    q: '¿Cómo es el cambio desde mi contador actual?',
    a: 'Nos ocupamos de la transición de punta a punta: pedimos la información al profesional anterior, ordenamos la situación y te avisamos si encontramos algo para corregir. Para vos es transparente.',
  },
  {
    q: '¿Cómo cobran los honorarios?',
    a: 'Definimos un honorario claro antes de empezar, según el alcance del trabajo y la complejidad de tu empresa. Sin sorpresas: sabés qué pagás y por qué.',
  },
];

/** Prueba social. Anonimizada por industria hasta tener testimonios atribuibles. */
export const TESTIMONIALS = [
  {
    quote:
      'Pasamos de correr atrás de los vencimientos a tener todo planificado. Hablamos directo con un socio cuando lo necesitamos.',
    who: 'PyME agroexportadora · Pergamino',
  },
  {
    quote:
      'Nos acompañaron en una reorganización societaria compleja con criterio y sin vueltas. Se nota la trayectoria.',
    who: 'Grupo familiar · Industria metalmecánica',
  },
  {
    quote:
      'Tercerizamos toda la administración contable e impositiva y nos sacamos un peso de encima. Cumplen y responden.',
    who: 'Empresa de software · CABA',
  },
];

export const INDUSTRIES = [
  'Agropecuario',
  'Software y tecnología',
  'Construcción',
  'Desarrollos inmobiliarios',
  'Energía',
  'Minería',
  'Industria metalmecánica',
  'Industria eléctrica',
  'Importadores',
  'Agencias de publicidad',
  'Estudios de abogados',
  'Hotelería',
];

export const DIFFERENTIALS = [
  {
    title: 'Atención directa de los socios',
    text: 'Cada cliente trabaja con un socio del estudio, no con un call center. Soluciones personalizadas para cada negocio e industria.',
    icon: 'people',
  },
  {
    title: 'Más de 40 años de trayectoria',
    text: 'Tres generaciones de contadores al frente de la firma, protegiendo la utilidad y los activos de las empresas que confían en nosotros.',
    icon: 'shield',
  },
  {
    title: 'Equipo multidisciplinario',
    text: 'Contadores públicos y abogados trabajando juntos: la mirada tributaria, societaria y de auditoría en un mismo lugar.',
    icon: 'team',
  },
  {
    title: 'Alcance internacional',
    text: 'Miembro independiente de BOKS International, una red global de firmas profesionales que nos permite acompañar operaciones más allá de Argentina.',
    icon: 'globe',
  },
];
