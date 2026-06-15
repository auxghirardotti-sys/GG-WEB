import { config, fields, singleton } from '@keystatic/core';

// Panel de edición (Keystatic). En local edita archivos directos; en producción (Vercel)
// guarda los cambios en GitHub -> Vercel republica solo. El contenido vive en src/content/*
// como JSON y lo lee src/data/site.ts (las páginas no cambian de forma).
export default config({
  // Cloud en producción (login sin claves, vía Keystatic Cloud); local en desarrollo.
  storage:
    process.env.NODE_ENV === 'production'
      ? { kind: 'cloud' }
      : { kind: 'local' },
  cloud: { project: 'ghirardotti-web/ghirardotti-web' },
  ui: {
    brand: { name: 'Ghirardotti & Ghirardotti' },
  },
  singletons: {
    site: singleton({
      label: 'Datos del estudio',
      path: 'src/content/site/',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Nombre' }),
        legalName: fields.text({ label: 'Razón social' }),
        tagline: fields.text({ label: 'Tagline' }),
        description: fields.text({ label: 'Descripción (SEO)', multiline: true }),
        url: fields.url({ label: 'URL del sitio' }),
        email: fields.text({ label: 'Email' }),
        phoneDisplay: fields.text({ label: 'Teléfono (visible)' }),
        phoneHref: fields.text({ label: 'Teléfono (link, ej: tel:+5491135116890)' }),
        whatsappNumber: fields.text({ label: 'WhatsApp (solo números)' }),
        whatsappMessage: fields.text({ label: 'Mensaje inicial de WhatsApp', multiline: true }),
        address: fields.text({ label: 'Dirección (corta)' }),
        addressFull: fields.text({ label: 'Dirección (completa)' }),
        mapsLink: fields.text({ label: 'Link a Google Maps' }),
        mapsEmbed: fields.text({ label: 'URL embebida de Google Maps' }),
        linkedin: fields.text({ label: 'LinkedIn' }),
        web3formsKey: fields.text({
          label: 'Clave Web3Forms (activa el formulario de contacto)',
          description: 'Pegá la access key de Web3Forms para que funcione el formulario. Vacío = se sugiere WhatsApp/email.',
        }),
      },
    }),

    team: singleton({
      label: 'Equipo',
      path: 'src/content/team/',
      format: { data: 'json' },
      schema: {
        members: fields.array(
          fields.object({
            name: fields.text({ label: 'Nombre' }),
            role: fields.text({ label: 'Cargo' }),
            initials: fields.text({ label: 'Iniciales (monograma)' }),
            bio: fields.text({ label: 'Bio', multiline: true }),
            credentials: fields.array(fields.text({ label: 'Credencial' }), {
              label: 'Credenciales',
              itemLabel: (props) => props.value,
            }),
            photo: fields.image({
              label: 'Foto (opcional)',
              directory: 'public/team',
              publicPath: '/team/',
            }),
          }),
          { label: 'Integrantes', itemLabel: (props) => props.fields.name.value }
        ),
      },
    }),

    faq: singleton({
      label: 'Preguntas frecuentes',
      path: 'src/content/faq/',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            q: fields.text({ label: 'Pregunta' }),
            a: fields.text({ label: 'Respuesta', multiline: true }),
          }),
          { label: 'Preguntas', itemLabel: (props) => props.fields.q.value }
        ),
      },
    }),

    testimonials: singleton({
      label: 'Testimonios',
      path: 'src/content/testimonials/',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            quote: fields.text({ label: 'Testimonio', multiline: true }),
            who: fields.text({ label: 'Quién (industria / lugar)' }),
            icon: fields.text({ label: 'Ícono', description: 'agropecuario, factory, code, sociedades, globe, brain, team...' }),
          }),
          { label: 'Testimonios', itemLabel: (props) => props.fields.who.value }
        ),
      },
    }),

    industries: singleton({
      label: 'Industrias',
      path: 'src/content/industries/',
      format: { data: 'json' },
      schema: {
        items: fields.array(fields.text({ label: 'Industria' }), {
          label: 'Industrias',
          itemLabel: (props) => props.value,
        }),
      },
    }),

    differentials: singleton({
      label: 'Diferenciales (Por qué G&G)',
      path: 'src/content/differentials/',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: 'Título' }),
            text: fields.text({ label: 'Texto', multiline: true }),
            icon: fields.text({ label: 'Ícono', description: 'people, shield, team, globe, brain...' }),
          }),
          { label: 'Diferenciales', itemLabel: (props) => props.fields.title.value }
        ),
      },
    }),
  },
});
