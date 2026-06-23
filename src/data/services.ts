export interface Service {
  slug: string;
  nav: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSub: string;
  /** Foto de fondo del hero (opcional, rescatada del sitio anterior) */
  heroImage?: string;
  icon: 'contable' | 'impositivo' | 'agropecuario' | 'sociedades' | 'outsourcing' | 'shield';
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
    title: 'Asesoramiento impositivo y planificación fiscal',
    metaDescription:
      'Asesoramiento impositivo y planificación fiscal nacional e internacional para empresas y grupos: impuestos nacionales y provinciales, defensa tributaria, precios de transferencia y operaciones internacionales.',
    heroTitle: 'Asesoramiento impositivo y planificación fiscal nacional e internacional',
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
    title: 'Planificación fiscal agropecuaria',
    metaDescription:
      'Especialistas en el agro: planificación fiscal agropecuaria, impuestos del sector, costos de producción, inventarios de hacienda y granos, y rentabilidad por actividad.',
    heroTitle: 'Planificación fiscal agropecuaria',
    heroSub:
      'El agro tiene sus propios ciclos, sus riesgos y su régimen fiscal. Lo conocemos de adentro: también somos productores.',
    heroImage: '/img/agro-a.jpg',
    icon: 'agropecuario',
    card: 'Impuestos del agro, costos y rentabilidad. Somos productores.',
    cardImage: '/img/agro-a.jpg',
    intro: [
      'La contabilidad agropecuaria no es una contabilidad más: ciclos biológicos, estacionalidad, clima, retenciones y regímenes especiales hacen que las recetas genéricas queden cortas.',
      'En el agro no alcanza con saber de impuestos: hay que conocer la campaña, el clima y el riesgo. Lo conocemos desde el campo y desde los números, y eso nos permite asesorar a empresas agrícolas y ganaderas con criterio real, no solo de escritorio.',
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
    slug: 'patrimonial',
    nav: 'Patrimonial',
    title: 'Planificación patrimonial y sucesoria',
    metaDescription:
      'Planificación patrimonial y sucesoria con mirada legal, fiscal y jurídica: protección del patrimonio, estructuras familiares, sucesiones y transmisión ordenada entre generaciones.',
    heroTitle: 'Planificación patrimonial y sucesoria',
    heroSub:
      'Ordenar, proteger y transmitir el patrimonio familiar y empresario desde la óptica legal, fiscal y jurídica, para que cada generación reciba claridad y no conflictos.',
    heroImage: '/img/campo-atardecer.jpg',
    icon: 'shield',
    card: 'Protegé y transmití tu patrimonio. Mirada legal, fiscal y jurídica.',
    cardImage: '/img/campo-atardecer.jpg',
    intro: [
      'El patrimonio que se construye a lo largo de una vida —empresas, inmuebles, inversiones— necesita una estrategia para protegerse y transmitirse en orden. Sin planificación, la sucesión suele terminar en impuestos evitables, trámites largos y conflictos entre herederos.',
      'Abordamos la planificación patrimonial y sucesoria de forma integral, combinando la óptica legal, fiscal y jurídica: diseñamos la estructura que protege los activos, ordena la relación familiar y prepara la transmisión entre generaciones con la menor carga impositiva posible.',
    ],
    itemsTitle: 'Cómo planificamos tu patrimonio y tu sucesión',
    items: [
      'Diagnóstico patrimonial y de la estructura familiar',
      'Planificación sucesoria y testamentaria',
      'Protección y reorganización de activos',
      'Estructuras societarias y fideicomisos para la familia empresaria',
      'Optimización de la carga fiscal en la transmisión',
      'Protocolos de empresa familiar',
      'Acompañamiento en sucesiones y procesos hereditarios',
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
