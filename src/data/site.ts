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

export const TEAM = [
  {
    name: 'Armando Ghirardotti',
    role: 'Socio Fundador',
    initials: 'AG',
    bio: 'Contador Público. Fundador del estudio, con más de 40 años liderando la firma en auditoría, asesoramiento impositivo, societario y contable.',
  },
  {
    name: 'Mariano Ghirardotti',
    role: 'Socio Director',
    initials: 'MG',
    bio: 'Contador Público (1993) y Especialista en Tributación (UBA, 2004). Más de veinte años dedicado a la planificación tributaria. Miembro activo de la Asociación Argentina de Estudios Fiscales y docente en el MBA de la Universidad de San Andrés.',
  },
  {
    name: 'Florencia Ghirardotti',
    role: 'Asociada · Departamento de Sociedades',
    initials: 'FG',
    bio: 'Abogada (UCA, 2001, diploma de honor). Doce años como Abogada Senior en Brichou, Fernández Madero & Lombard. Especializada en asesoramiento corporativo y reorganizaciones societarias.',
  },
  {
    name: 'Gisela Franceschina',
    role: 'Socia COO',
    initials: 'GF',
    bio: 'Contadora Pública, cursando el MBA de la Universidad de San Andrés. Especializada en impuestos agropecuarios y productora agropecuaria.',
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
