export interface Service {
  slug: string;
  nav: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSub: string;
  /** Foto de fondo del hero (opcional, rescatada del sitio anterior) */
  heroImage?: string;
  icon: 'contable' | 'impositivo' | 'agropecuario' | 'sociedades' | 'outsourcing';
  card: string;
  /** Imagen temática para la card (tratada con glass + duotono rojo) */
  cardImage: string;
  intro: string[];
  itemsTitle: string;
  items: string[];
}

export const SERVICES: Service[] = [
  {
    slug: 'impositivo',
    nav: 'Impositivo',
    title: 'Asesoramiento Impositivo',
    metaDescription:
      'Asesoramiento impositivo y planificación fiscal para empresas en Argentina: impuestos nacionales y provinciales, defensa tributaria, precios de transferencia y planificación internacional.',
    heroTitle: 'Asesoramiento impositivo',
    heroSub:
      'Planificación fiscal y reducción de riesgos: que los impuestos dejen de ser un problema y pasen a ser una variable más, bajo control.',
    heroImage: '/img/hero-impositivo.jpg',
    icon: 'impositivo',
    card: 'Que los impuestos dejen de ser un problema. Bajo control.',
    cardImage: '/img/svc-impositivo.jpg',
    intro: [
      'Los impuestos son, para la mayoría de las empresas, uno de sus mayores costos. Nuestro trabajo es que ese costo esté planificado, optimizado y bajo control, con una mirada estratégica que va mucho más allá de presentar declaraciones juradas a tiempo.',
      'Trabajamos con la dirección de cada empresa para entender su negocio y diseñar la estructura fiscal que mejor le quede: desde la operación diaria hasta reorganizaciones, sucesiones y operaciones internacionales.',
    ],
    itemsTitle: 'Qué resolvemos en materia impositiva',
    items: [
      'Asesoramiento tributario integral',
      'Estrategias de planificación fiscal',
      'Reorganizaciones empresarias',
      'Planificación hereditaria y protección patrimonial',
      'Tercerización del departamento de impuestos',
      'Determinación de impuestos nacionales, provinciales y municipales',
      'Auditorías de compra / due diligence',
      'Planificación fiscal internacional',
      'Defensa y procedimiento tributario',
      'Precios de transferencia',
    ],
  },
  {
    slug: 'contable',
    nav: 'Contable',
    title: 'Asesoramiento Contable y Auditoría',
    metaDescription:
      'Auditoría externa de estados contables en normas locales e IFRS, auditoría interna y de fraudes, control interno y due diligence para empresas de todos los sectores.',
    heroTitle: 'Asesoramiento contable y auditoría',
    heroSub:
      'Estados contables confiables y procesos sólidos, para que los números reflejen la realidad del negocio y sirvan para decidir.',
    icon: 'contable',
    card: 'Números confiables para decidir créditos, inversiones y operaciones.',
    cardImage: '/img/svc-contable.jpg',
    intro: [
      'Unos estados contables bien armados no son un trámite: son la base sobre la que se deciden créditos, inversiones, ventas de empresas y relaciones con socios. Por eso los tratamos con el rigor que merecen.',
      'Nuestro equipo audita y analiza estados contables bajo normas locales e IFRS, y trabaja sobre los procesos y controles internos que están detrás de esos números, en empresas de los más variados sectores e industrias.',
    ],
    itemsTitle: 'Servicios contables y de auditoría',
    items: [
      'Auditoría externa de estados contables en normas locales',
      'Auditoría externa de estados contables en IFRS',
      'Auditoría interna',
      'Auditoría operativa',
      'Auditoría de fraudes',
      'Análisis de estados contables',
      'Consultoría en control interno',
      'Consultoría en desarrollo de procesos',
      'Due diligence',
    ],
  },
  {
    slug: 'agropecuario',
    nav: 'Agropecuario',
    title: 'Contabilidad Agropecuaria',
    metaDescription:
      'Estudio contable especializado en el agro: impuestos agropecuarios, costos de producción, inventarios de hacienda y granos, y rentabilidad por actividad.',
    heroTitle: 'Contabilidad agropecuaria',
    heroSub:
      'El agro tiene sus propios ciclos, sus riesgos y su régimen fiscal. Lo conocemos de adentro: también somos productores.',
    heroImage: '/img/agro-a.jpg',
    icon: 'agropecuario',
    card: 'Impuestos del agro, costos y rentabilidad. Somos productores.',
    cardImage: '/img/agro-a.jpg',
    intro: [
      'La contabilidad agropecuaria no es una contabilidad más: ciclos biológicos, estacionalidad, clima, retenciones y regímenes especiales hacen que las recetas genéricas queden cortas.',
      'Nuestra socia a cargo del área es especialista en impuestos agropecuarios y productora agropecuaria: conocemos el negocio desde el campo y desde los números. Eso nos permite asesorar a empresas agrícolas y ganaderas con criterio real, no solo normativo.',
    ],
    itemsTitle: 'Cómo acompañamos a las empresas del agro',
    items: [
      'Registro y análisis de las finanzas agropecuarias',
      'Control fiscal y asesoramiento impositivo del agro',
      'Evaluación de costos de producción',
      'Gestión de inventarios: hacienda, sementeras y granos',
      'Análisis de rentabilidad por actividad',
      'Elaboración de estados contables',
      'Auditoría contable y financiera',
      'Cumplimiento normativo y regímenes especiales',
    ],
  },
  {
    slug: 'sociedades',
    nav: 'Sociedades',
    title: 'Asesoramiento Societario',
    metaDescription:
      'Asesoramiento societario para empresas: constitución y estructuras, convenios de accionistas, fusiones y adquisiciones, inspecciones ante IGJ y Justicia.',
    heroTitle: 'Asesoramiento societario',
    heroSub:
      'La estructura legal correcta para cada negocio: desde la constitución de una sociedad hasta fusiones, adquisiciones y convenios entre socios.',
    icon: 'sociedades',
    card: 'La estructura legal correcta para crecer, asociarte o vender.',
    cardImage: '/img/svc-sociedades.jpg',
    intro: [
      'Detrás de todo negocio sólido hay una estructura societaria pensada: protege el patrimonio, ordena la relación entre socios y prepara a la empresa para crecer, asociarse o venderse bien.',
      'Ya sea que estés por iniciar una empresa, quieras optimizar la estructura existente o estés frente a una fusión o adquisición, nuestro departamento de sociedades —liderado por una abogada con larga trayectoria corporativa— diseña la solución a medida.',
    ],
    itemsTitle: 'Gestiones y servicios societarios',
    items: [
      'Asesoramiento societario general',
      'Desarrollo de negocios y planeamiento de estructuras',
      'Redacción de convenios de accionistas',
      'Fusiones, adquisiciones y transformaciones',
      'Coordinación de inspecciones ante la Justicia y organismos de contralor',
    ],
  },
  {
    slug: 'outsourcing',
    nav: 'Outsourcing',
    title: 'Outsourcing Contable e Impositivo',
    metaDescription:
      'Tercerización contable e impositiva para empresas: contabilización de operaciones, declaraciones juradas nacionales y provinciales, libros y soluciones a medida.',
    heroTitle: 'Outsourcing contable e impositivo',
    heroSub:
      'Tu administración contable e impositiva, en manos de un equipo profesional: vos te dedicás al negocio, nosotros a los números.',
    icon: 'outsourcing',
    card: 'Vos al negocio, nosotros a tus números. Sin departamento propio.',
    cardImage: '/img/svc-outsourcing.jpg',
    intro: [
      'Mantener un departamento contable propio es caro y, en muchas empresas, innecesario. Tercerizar la contabilidad y los impuestos en un estudio con trayectoria reduce costos, errores y contingencias.',
      'Armamos esquemas de outsourcing a medida: desde la contabilización de operaciones hasta la presentación de todas las declaraciones juradas, con la información siempre disponible para la dirección.',
    ],
    itemsTitle: 'Qué incluye nuestro outsourcing',
    items: [
      'Contabilización de operaciones',
      'Confección y presentación de declaraciones juradas de impuestos nacionales y provinciales',
      'Copiado de libros contables y societarios',
      'Reportes de gestión para la dirección',
      'Soluciones customizadas según el tamaño y la industria de cada empresa',
    ],
  },
];
