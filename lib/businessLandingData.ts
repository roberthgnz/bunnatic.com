
type Step = {
  title: string
  description: string
}

type Testimonial = {
  quote: string
  author: string
  role: string
}

type BusinessCopy = {
  badge: string
  title: string
  subtitle: string
  urgencyText: string
  trustLine: string
  benefitsTitle: string
  benefits: string[]
  processTitle: string
  process: Step[]
  proofTitle: string
  testimonials: Testimonial[]
  planTitle: string
  planPrice: string
  planItems: string[]
  finalTitle: string
  finalSubtitle: string
  ctaPrimary: string
  ctaSecondary: string
}

export type BusinessLandingEntry = {
  legacySlug: string
  slug: string
  copy: BusinessCopy
}

const rawBusinessLandingEntries: Array<
  Omit<BusinessLandingEntry, 'slug'>
> = [
  {
    legacySlug: 'dentistas',
    copy: {
      badge: 'Más primeras visitas y tratamientos cerrados',
      title: 'Web para clínicas dentales con enfoque de conversión',
      subtitle:
        'Explica tratamientos, financiación y confianza clínica para que el paciente avance del interés a la cita.',
      urgencyText:
        'Sin una propuesta clara, los pacientes comparan solo por precio.',
      trustLine:
        'Web profesional con pruebas de confianza y contacto inmediato.',
      benefitsTitle: 'Qué aporta a tu clínica dental',
      benefits: [
        'Más solicitudes de primera visita.',
        'Mayor claridad de tratamientos y opciones.',
        'Captación de pacientes desde búsquedas locales.',
      ],
      processTitle: 'Cómo activarlo paso a paso',
      process: [
        {
          title: 'Ordena tu oferta clínica',
          description:
            'Implantes, ortodoncia y estética con mensajes claros.',
        },
        {
          title: 'Activa credenciales y confianza',
          description: 'Reseñas y argumentos que reducen objeciones.',
        },
        {
          title: 'Optimiza el contacto',
          description: 'CTA directo para agendar visita inicial.',
        },
      ],
      proofTitle: 'Clínicas dentales que lo están usando',
      testimonials: [
        {
          quote:
            'Mejoramos ratio de consulta a cita tras reorganizar tratamientos en la web.',
          author: 'Marta H.',
          role: 'Clínica dental',
        },
        {
          quote: 'Recibimos más contactos cualificados desde Google local.',
          author: 'Javier L.',
          role: 'Centro odontológico',
        },
      ],
      planTitle: 'Plan recomendado para dentistas',
      planPrice: '19€/mes',
      planItems: [
        'Contenido orientado a confianza',
        'Contacto directo para primera visita',
        'Editor visual de promociones y campañas',
      ],
      finalTitle: 'Convierte búsquedas en pacientes reales',
      finalSubtitle:
        'Regístrate y activa tu web dental enfocada a captación.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Ver en acción',
    },
  },
  {
    legacySlug: 'esteticas',
    copy: {
      badge: 'Más tratamientos reservados',
      title: 'Web para centros de estética enfocada a reservas',
      subtitle:
        'Convierte visitas en citas mostrando tratamientos, resultados y promociones en una experiencia clara y profesional.',
      urgencyText:
        'Sin una oferta bien presentada, pierdes citas frente a competencia mejor posicionada.',
      trustLine: 'Diseño premium + prueba social + CTA directo a reserva.',
      benefitsTitle: 'Lo que ganas en tu centro',
      benefits: [
        'Más reservas de tratamientos de mayor ticket.',
        'Mejor percepción de marca y confianza.',
        'Promociones activables en tiempo real.',
      ],
      processTitle: 'Cómo arrancar sin complicaciones',
      process: [
        {
          title: 'Define tratamientos clave',
          description: 'Destacamos servicios con mayor conversión y margen.',
        },
        {
          title: 'Activa mensajes de confianza',
          description:
            'Incluye testimonios y argumentos que cierran objeciones.',
        },
        {
          title: 'Capta contactos al instante',
          description: 'Formulario y WhatsApp para reservar en caliente.',
        },
      ],
      proofTitle: 'Resultados en estética local',
      testimonials: [
        {
          quote:
            'Con una página mejor estructurada subieron las reservas de bono.',
          author: 'Paula S.',
          role: 'Centro estético',
        },
        {
          quote: 'Ahora los clientes llegan con el tratamiento decidido.',
          author: 'Andrea N.',
          role: 'Clínica dermoestética',
        },
      ],
      planTitle: 'Plan recomendado para estética',
      planPrice: '19€/mes',
      planItems: [
        'Páginas de servicio optimizadas',
        'Contacto directo y rápido',
        'Editor visual para campañas estacionales',
      ],
      finalTitle: 'Haz crecer tus reservas desde la web',
      finalSubtitle:
        'Regístrate y publica una página pensada para vender tratamientos.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Ver en acción',
    },
  },
  {
    legacySlug: 'farmacias',
    copy: {
      badge: 'Genera confianza antes de la visita',
      title: 'Web para farmacias que mejora visibilidad y atención',
      subtitle:
        'Informa horarios, guardias, servicios y contacto en una web clara para que el cliente encuentre respuesta inmediata.',
      urgencyText:
        'Cuando la información no está clara, el cliente llama a otra farmacia.',
      trustLine:
        'Credibilidad digital con contenido útil y canal directo de contacto.',
      benefitsTitle: 'Qué aporta a tu farmacia',
      benefits: [
        'Horarios y guardias visibles en todo momento.',
        'Mayor confianza con servicios explicados claramente.',
        'Más consultas y pedidos desde canal propio.',
      ],
      processTitle: 'Implementación en 3 pasos',
      process: [
        {
          title: 'Publica servicios clave',
          description: 'Destaca lo que más buscan tus clientes en tu zona.',
        },
        {
          title: 'Ordena la información',
          description: 'Horarios, ubicación y contacto sin fricción.',
        },
        {
          title: 'Actualiza campañas',
          description: 'Novedades y promociones editadas en minutos.',
        },
      ],
      proofTitle: 'Farmacias que ya lo aplican',
      testimonials: [
        {
          quote:
            'Reducimos llamadas repetidas al dejar guardias y horarios claros.',
          author: 'Sonia L.',
          role: 'Farmacia de barrio',
        },
        {
          quote: 'Ahora recibimos más consultas útiles por WhatsApp.',
          author: 'Gabriel C.',
          role: 'Farmacia comunitaria',
        },
      ],
      planTitle: 'Plan recomendado para farmacias',
      planPrice: '19€/mes',
      planItems: [
        'Edición instantánea de horarios',
        'Contacto directo integrado',
        'SEO local para búsquedas urgentes',
      ],
      finalTitle: 'Haz que te encuentren y te contacten más rápido',
      finalSubtitle:
        'Crea tu cuenta y publica una web útil para tus clientes.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Publicar mi web',
    },
  },
  {
    legacySlug: 'fotografos',
    copy: {
      badge: 'Muestra portfolio y cierra más sesiones',
      title: 'Web para fotógrafos orientada a solicitudes de presupuesto',
      subtitle:
        'Presenta tu estilo, packs y disponibilidad en una landing pensada para que te escriban con intención de contratar.',
      urgencyText:
        'Sin un portfolio bien estructurado, el lead compara y se enfría.',
      trustLine:
        'Portfolio + propuesta + formulario en un flujo simple de conversión.',
      benefitsTitle: 'Qué desbloquea para tu estudio',
      benefits: [
        'Más solicitudes cualificadas por tipo de sesión.',
        'Mejor percepción de valor y posicionamiento.',
        'Proceso de contacto más ordenado y medible.',
      ],
      processTitle: 'Activación rápida para captar mejor',
      process: [
        {
          title: 'Estructura tu oferta',
          description:
            'Bodas, retrato, eventos o marca personal por separado.',
        },
        {
          title: 'Guía la decisión',
          description: 'Incluye pruebas visuales y argumentos de confianza.',
        },
        {
          title: 'Captura el lead',
          description: 'Formulario con datos clave para cerrar rápido.',
        },
      ],
      proofTitle: 'Fotógrafos que ya mejoraron conversión',
      testimonials: [
        {
          quote:
            'Con la nueva página recibimos presupuestos mejor definidos.',
          author: 'Laia C.',
          role: 'Fotografía de bodas',
        },
        {
          quote: 'Ahora filtra por tipo de sesión y perdemos menos tiempo.',
          author: 'Sergi B.',
          role: 'Estudio de retrato',
        },
      ],
      planTitle: 'Plan recomendado para fotógrafos',
      planPrice: '19€/mes',
      planItems: [
        'Landing optimizada para portfolio',
        'Formularios por tipo de servicio',
        'Editor visual para campañas estacionales',
      ],
      finalTitle: 'Convierte tu portfolio en un canal de ventas',
      finalSubtitle:
        'Crea tu cuenta y empieza a recibir mejores solicitudes.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Ver demo',
    },
  },
  {
    legacySlug: 'gimnasios',
    copy: {
      badge: 'Convierte interés en nuevas altas',
      title: 'Web para gimnasios enfocada en registros y pruebas',
      subtitle:
        'Presenta planes, horarios y clases con una estructura que empuja a pedir prueba o apuntarse hoy.',
      urgencyText:
        'Sin una oferta clara online, el lead se enfría en minutos.',
      trustLine:
        'Más altas con CTAs de prueba, contacto inmediato y propuesta de valor visible.',
      benefitsTitle: 'Resultados que puedes activar rápido',
      benefits: [
        'Más solicitudes de prueba desde móvil.',
        'Planes y precios explicados para reducir fricción.',
        'Captación de leads para seguimiento comercial.',
      ],
      processTitle: 'Cómo activar captación de socios',
      process: [
        {
          title: 'Define planes y promesas',
          description: 'Mostramos qué consigue cada tipo de cliente contigo.',
        },
        {
          title: 'Configura lead magnet',
          description: 'Prueba gratis o sesión inicial como CTA principal.',
        },
        {
          title: 'Mide y mejora',
          description: 'Itera mensajes según qué plan convierte más.',
        },
      ],
      proofTitle: 'Experiencias del sector fitness',
      testimonials: [
        {
          quote:
            'Duplicamos pruebas semanales con una landing clara por objetivos.',
          author: 'Ruth M.',
          role: 'Box de entrenamiento',
        },
        {
          quote: 'La web nos filtra mejor y llegan leads más decididos.',
          author: 'Héctor A.',
          role: 'Gimnasio de barrio',
        },
      ],
      planTitle: 'Plan recomendado para gimnasios',
      planPrice: '19€/mes',
      planItems: [
        'Formularios orientados a prueba',
        'Editor visual para campañas',
        'SEO local por zona',
      ],
      finalTitle: 'Empieza a captar más socios desde esta semana',
      finalSubtitle: 'Crea tu cuenta y transforma visitas en altas.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Ver demo',
    },
  },
  {
    legacySlug: 'inmobiliarias',
    copy: {
      badge: 'Capta compradores y propietarios con mejor filtro',
      title: 'Web para inmobiliarias enfocada a leads de calidad',
      subtitle:
        'Publica servicios y propuesta comercial con una estructura que convierte visitas en solicitudes claras.',
      urgencyText:
        'Sin web optimizada, pierdes leads frente a portales y competencia local.',
      trustLine:
        'Canal propio para captar, filtrar y dar seguimiento a oportunidades.',
      benefitsTitle: 'Qué mejora en tu inmobiliaria',
      benefits: [
        'Más solicitudes de venta y captación de inmuebles.',
        'Leads con mejor información inicial.',
        'Imagen profesional para cerrar más reuniones.',
      ],
      processTitle: 'Cómo activarlo en pocos días',
      process: [
        {
          title: 'Define servicios y zonas',
          description: 'Compra, venta y alquiler con foco por área.',
        },
        {
          title: 'Activa formularios específicos',
          description:
            'Captación de propietarios y compradores por separado.',
        },
        {
          title: 'Optimiza mensajes',
          description: 'Ajusta propuesta según tipo de lead que más cierra.',
        },
      ],
      proofTitle: 'Inmobiliarias que ya escalaron captación',
      testimonials: [
        {
          quote:
            'Subimos contactos de propietarios al aclarar propuesta y proceso.',
          author: 'Bea F.',
          role: 'Agencia inmobiliaria',
        },
        {
          quote:
            'Llegan leads mejor filtrados para compradores e inversores.',
          author: 'Álex T.',
          role: 'Broker local',
        },
      ],
      planTitle: 'Plan recomendado para inmobiliarias',
      planPrice: '19€/mes',
      planItems: [
        'Formularios segmentados por lead',
        'SEO local por zona',
        'Editor visual para nuevas campañas',
      ],
      finalTitle: 'Convierte tu web en máquina de captación',
      finalSubtitle: 'Regístrate y empieza a generar leads más cualificados.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Ver en acción',
    },
  },
  {
    legacySlug: 'peluquerias',
    copy: {
      badge: 'Capta más citas sin depender de Instagram',
      title: 'Web para peluquerías que convierte visitas en reservas',
      subtitle:
        'Muestra cortes, precios y disponibilidad en una página pensada para que te escriban o reserven en el momento.',
      urgencyText:
        'Cada cliente que no encuentra precio u horario claro se va con otra peluquería.',
      trustLine:
        'Web móvil + WhatsApp + formulario para llenar agenda con menos fricción.',
      benefitsTitle: 'Qué mejora en tu peluquería',
      benefits: [
        'Más citas desde Google y redes en una sola página.',
        'Servicios y tarifas visibles para reducir preguntas repetidas.',
        'Promociones y packs actualizables en minutos.',
      ],
      processTitle: 'Cómo lo activas esta semana',
      process: [
        {
          title: 'Configura tus servicios',
          description: 'Cortes, color y tratamientos con enfoque comercial.',
        },
        {
          title: 'Publica CTAs directos',
          description: 'Botones claros de llamada, WhatsApp y reserva.',
        },
        {
          title: 'Ajusta según demanda',
          description:
            'Edita ofertas por temporada sin depender de terceros.',
        },
      ],
      proofTitle: 'Casos de peluquerías locales',
      testimonials: [
        {
          quote:
            'Subimos reservas de color al explicar mejor los packs en la web.',
          author: 'Clara V.',
          role: 'Peluquería unisex',
        },
        {
          quote:
            'Con un solo enlace pasamos de mensajes sueltos a citas claras.',
          author: 'Marc R.',
          role: 'Barbería',
        },
      ],
      planTitle: 'Plan recomendado para peluquerías',
      planPrice: '19€/mes',
      planItems: [
        'Editor visual ilimitado',
        'Formulario + WhatsApp',
        'SEO local para búsquedas cercanas',
      ],
      finalTitle: 'Llena agenda con una web que sí convierte',
      finalSubtitle: 'Crea tu cuenta y empieza a captar citas desde hoy.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Ver en acción',
    },
  },
  {
    legacySlug: 'restaurantes',
    copy: {
      badge: 'Más mesas con menos llamadas perdidas',
      title: 'Web para restaurantes orientada a reservas y pedidos',
      subtitle:
        'Carta, horarios, ubicación y reservas en un flujo simple para que el cliente decida rápido y contacte sin fricción.',
      urgencyText:
        'Si el cliente no encuentra menú o disponibilidad en segundos, abandona.',
      trustLine:
        'Tu web como canal de captación propio, más allá de apps de terceros.',
      benefitsTitle: 'Impacto directo en el negocio',
      benefits: [
        'Más reservas directas sin intermediarios.',
        'Información de menú y horarios siempre actualizada.',
        'Mejor conversión de tráfico desde Google Maps.',
      ],
      processTitle: 'Implementación rápida',
      process: [
        {
          title: 'Sube menú y propuesta',
          description:
            'Destacamos platos estrella y diferenciales del local.',
        },
        {
          title: 'Activa reservas/contacto',
          description: 'Botones visibles para reservar o pedir información.',
        },
        {
          title: 'Optimiza por servicio',
          description: 'Ajusta campañas para mediodía, cenas o eventos.',
        },
      ],
      proofTitle: 'Lo que reportan restaurantes',
      testimonials: [
        {
          quote:
            'Pasamos tráfico de Google a reservas directas con mejor margen.',
          author: 'Nerea T.',
          role: 'Restaurante mediterráneo',
        },
        {
          quote:
            'La gente llega más informada y con menos dudas sobre carta y horarios.',
          author: 'Joan P.',
          role: 'Brasería local',
        },
      ],
      planTitle: 'Plan recomendado para restaurantes',
      planPrice: '19€/mes',
      planItems: [
        'Web optimizada para móvil',
        'CTA a reserva y WhatsApp',
        'Editor visual para menú y promos',
      ],
      finalTitle: 'Convierte búsquedas en mesas ocupadas',
      finalSubtitle: 'Activa tu web y empieza a captar reservas directas.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Publicar mi web',
    },
  },
  {
    legacySlug: 'talleres',
    copy: {
      badge: 'Más entradas al taller desde búsquedas locales',
      title: 'Web para talleres con foco en llamadas y citas',
      subtitle:
        'Haz que te encuentren rápido, entiendan tus servicios y pidan cita con un clic desde móvil.',
      urgencyText:
        'Si no apareces claro en Google, el cliente llama al primer competidor.',
      trustLine:
        'Canal directo para reparaciones, revisiones y urgencias mecánicas.',
      benefitsTitle: 'Qué resultados puedes esperar',
      benefits: [
        'Más llamadas de clientes cercanos.',
        'Servicios y especialidades mejor explicados.',
        'Menor pérdida de leads por falta de información.',
      ],
      processTitle: 'Activación sin complejidad técnica',
      process: [
        {
          title: 'Publica servicios clave',
          description: 'Revisión, neumáticos, frenos, diagnosis y más.',
        },
        {
          title: 'Optimiza contacto inmediato',
          description: 'Botón de llamada y WhatsApp con máxima visibilidad.',
        },
        {
          title: 'Ajusta por temporada',
          description:
            'Campañas para ITV, vacaciones o mantenimiento preventivo.',
        },
      ],
      proofTitle: 'Talleres que ya mejoraron captación',
      testimonials: [
        {
          quote:
            'Subieron llamadas en la primera semana con la nueva página.',
          author: 'Rubén G.',
          role: 'Taller multimarca',
        },
        {
          quote: 'Ahora los clientes entienden servicios antes de llamar.',
          author: 'Nico P.',
          role: 'Taller de barrio',
        },
      ],
      planTitle: 'Plan recomendado para talleres',
      planPrice: '19€/mes',
      planItems: [
        'CTA de llamada directa',
        'SEO local técnico',
        'Editor visual para campañas por temporada',
      ],
      finalTitle: 'Convierte búsquedas en citas de taller',
      finalSubtitle: 'Crea tu cuenta y activa una web que te trae trabajo.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Publicar mi web',
    },
  },
  {
    legacySlug: 'veterinarios',
    copy: {
      badge: 'Más citas y urgencias bien atendidas',
      title: 'Web para clínicas veterinarias enfocada en contacto inmediato',
      subtitle:
        'Facilita que los dueños encuentren servicios, horarios y canales de urgencia para convertir búsquedas en citas reales.',
      urgencyText:
        'En veterinaria, cada minuto sin información clara puede costar una visita.',
      trustLine:
        'Canal directo para primera cita, revisiones y atención urgente.',
      benefitsTitle: 'Qué mejora en tu clínica',
      benefits: [
        'Más citas programadas desde móvil.',
        'Menos llamadas repetidas por información básica.',
        'Mejor experiencia para dueños en situación urgente.',
      ],
      processTitle: 'Flujo de captación recomendado',
      process: [
        {
          title: 'Organiza servicios y especialidades',
          description: 'Vacunas, revisiones y urgencias bien visibles.',
        },
        {
          title: 'Destaca contacto urgente',
          description: 'Botones directos para responder rápido.',
        },
        {
          title: 'Optimiza por zona',
          description: 'Aparece en búsquedas locales de alta intención.',
        },
      ],
      proofTitle: 'Veterinarios que ya optimizaron su captación',
      testimonials: [
        {
          quote:
            'Mejoramos respuesta en urgencias al centralizar contacto en la web.',
          author: 'Elena D.',
          role: 'Clínica veterinaria',
        },
        {
          quote: 'Subieron citas de revisión con una oferta más clara.',
          author: 'Toni M.',
          role: 'Hospital veterinario local',
        },
      ],
      planTitle: 'Plan recomendado para veterinarios',
      planPrice: '19€/mes',
      planItems: [
        'WhatsApp y llamada directa',
        'Edición ágil de horarios',
        'SEO local para servicios veterinarios',
      ],
      finalTitle: 'Haz que te encuentren cuando más te necesitan',
      finalSubtitle:
        'Crea tu cuenta y activa una web clara para captar más citas.',
      ctaPrimary: 'Crear cuenta gratis',
      ctaSecondary: 'Ver demo',
    },
  },
]

export function slugifyBusinessTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const businessLandingEntries: BusinessLandingEntry[] =
  rawBusinessLandingEntries.map((entry) => {
    const slug = slugifyBusinessTitle(entry.copy.title)
    return {
      legacySlug: entry.legacySlug,
      slug,
      copy: entry.copy,
    }
  })

export const legacyBusinessSlugToSlug = Object.fromEntries(
  businessLandingEntries.map(({ legacySlug, slug }) => [legacySlug, slug])
)

export const businessLandingEntriesBySlug = businessLandingEntries

export function getBusinessLandingBySlug(
  slug: string
): BusinessLandingEntry | undefined {
  return businessLandingEntries.find(
    (entry) =>
      entry.slug === slug ||
      entry.legacySlug === slug
  )
}
