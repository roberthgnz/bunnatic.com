// Static, typed editorial content: Workers does not need filesystem access or an MDX runtime.
export type GuideSection = {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}
export type Guide = {
  slug: string
  title: string
  description: string
  category: string
  publishedAt: string
  updatedAt: string
  answer: string
  sections: GuideSection[]
  table: {
    caption: string
    headers: [string, string, string]
    rows: [string, string, string][]
  }
  evidence: { text: string; source: string; url: string; limitation: string }
  links: { label: string; href: string }[]
}

const ineUrl = 'https://ine.es/dyngs/Prensa/ETICCE20251T2026.htm'
const date = '2026-10-27'

export const guides: Guide[] = [
  {
    slug: 'como-crear-web-negocio-local',
    title:
      'Cómo crear una web para tu negocio local: del contenido a la publicación',
    description:
      'Prepara los datos de tu negocio, elige una estructura y revisa tu web antes de publicarla. Guía con una lista práctica para empezar.',
    category: 'Crear tu web',
    publishedAt: date,
    updatedAt: date,
    answer:
      'Para crear una web de un negocio local, define primero qué ofreces, dónde atiendes y cómo puede contactar un cliente. Después organiza esa información en páginas claras, revisa la versión móvil y publica con una dirección estable. Locavo permite preparar una propuesta con IA y gestionar el contenido; los datos y las promesas comerciales deben revisarse antes de publicar.',
    evidence: {
      text: 'El INE sitúa en el 36,2 % la proporción con web entre las empresas de menos de diez empleados con conexión a Internet en el primer trimestre de 2026.',
      source:
        'INE, Encuesta de uso de TIC y comercio electrónico, publicada el 22 de octubre de 2026',
      url: ineUrl,
      limitation:
        'Es un dato nacional de los sectores cubiertos por la encuesta; no mide los resultados de Locavo ni la demanda de tu municipio.',
    },
    sections: [
      {
        id: 'objetivo',
        title: '1. Decide qué debe poder hacer un cliente',
        paragraphs: [
          'Una web de un taller puede ayudar a solicitar una revisión. La de un restaurante puede explicar la carta, el horario y cómo reservar. Elegir una acción principal evita que cada bloque compita por la atención del visitante.',
          'Escribe una frase con tu servicio, el público y la zona que atiendes. Por ejemplo: reparación de bicicletas para particulares en tu barrio. Es un ejercicio de claridad; no hace falta repetir la ciudad en cada párrafo.',
        ],
      },
      {
        id: 'materiales',
        title: '2. Reúne información que puedas comprobar',
        paragraphs: [
          'Prepara el nombre comercial, el teléfono, el horario habitual y especial, la dirección o el área de servicio. Añade descripciones concretas de tus servicios y fotografías propias o con permiso. Si publicas precios, aclara a qué incluyen y cuándo se aplican.',
          'No conviertas una reseña anónima en un testimonio con nombre. En negocios de salud, no encargues a la IA la validación de tratamientos, titulaciones o afirmaciones clínicas. Esa revisión corresponde a la persona responsable del negocio.',
        ],
        bullets: [
          'Una imagen real del local o del servicio.',
          'Los servicios que puedes prestar hoy y sus condiciones.',
          'Un canal de contacto que alguien atienda.',
          'Los datos legales y de privacidad que correspondan a tu actividad.',
        ],
      },
      {
        id: 'estructura',
        title: '3. Elige una estructura que puedas mantener',
        paragraphs: [
          'Para una oferta sencilla, una página bien organizada puede servir de punto de partida. Si prestas servicios distintos que requieren explicaciones propias, considera páginas separadas. Añade una sección de ubicación y una forma de volver al inicio desde cualquier página.',
          'No abras una página por cada barrio con el mismo texto. Una página de zona necesita información que realmente cambie: cobertura, condiciones de desplazamiento o un trabajo documentado con permiso. Si no hay diferencias útiles, concentra el contenido.',
        ],
      },
      {
        id: 'revision',
        title: '4. Revisa la propuesta y prueba el contacto',
        paragraphs: [
          'La IA puede ayudarte con una primera versión, pero no conoce por sí sola las condiciones de tu negocio. En Locavo, revisa los textos propuestos y los datos importados antes de compartir la dirección pública. Una integración externa debe estar configurada para que la función asociada pueda usarse.',
          'Abre la web desde un móvil, pulsa el teléfono y comprueba el destino de WhatsApp. Si utilizas un formulario, envía una consulta de prueba y confirma su recepción. Distingue siempre una solicitud de cita de una reserva confirmada: un botón no implica que exista una agenda sincronizada.',
        ],
      },
      {
        id: 'despues',
        title: '5. Publica y establece una rutina de revisión',
        paragraphs: [
          'Utiliza una dirección que puedas conservar y enlázala desde los canales que ya gestionas. Revisa los horarios antes de festivos y cambia una promoción cuando termine. Es preferible un catálogo pequeño y vigente a una web extensa que prometa servicios retirados.',
          'Comprueba por separado si la página está publicada, si Google la ha indexado y si llegan consultas útiles. Son tres hechos distintos. Empieza registrando qué solicitudes recibes y por qué canal; evita atribuir una venta a la web sin una forma de comprobarlo.',
        ],
      },
    ],
    table: {
      caption: 'Revisión antes de compartir la web de tu negocio',
      headers: ['Elemento', 'Qué comprobar', 'Cuándo está listo'],
      rows: [
        [
          'Oferta',
          'Servicio, zona y condiciones comprensibles',
          'Una persona ajena al negocio entiende qué puede pedir',
        ],
        [
          'Contacto',
          'Teléfono, enlace de mensajería y formulario si existe',
          'Las pruebas llegan al destino correcto',
        ],
        [
          'Móvil',
          'Textos legibles, navegación y botones',
          'Puedes completar la acción principal sin ampliar la pantalla',
        ],
        [
          'Confianza',
          'Fotos, datos del negocio y afirmaciones',
          'Tienes permiso y respaldo para lo publicado',
        ],
        [
          'Mantenimiento',
          'Responsable y próxima revisión',
          'Alguien sabe quién actualizará los cambios',
        ],
      ],
    },
    links: [
      { label: 'Ver ejemplos por sector', href: '/negocio' },
      {
        label: 'Preparar una propuesta de web',
        href: '/crear-pagina-web-negocio',
      },
    ],
  },
  {
    slug: 'seo-local-para-negocios',
    title: 'SEO local para negocios: qué revisar en tu web y en Google',
    description:
      'Una guía práctica para revisar información, servicios, ubicación y contacto. Diferencia el SEO de tu web del Perfil de Empresa en Google.',
    category: 'Visibilidad local',
    publishedAt: date,
    updatedAt: date,
    answer:
      'El SEO local consiste en facilitar que una persona encuentre y entienda un negocio que atiende en una zona. Combina una web accesible, información comercial precisa y la gestión del Perfil de Empresa en Google cuando corresponda. Locavo ayuda a organizar la parte web; la posición en los resultados también depende de factores externos y no se puede garantizar.',
    evidence: {
      text: 'En el primer trimestre de 2026, el 36,2 % de las empresas de menos de diez empleados con Internet tenía web, según el INE.',
      source: 'INE, Encuesta de uso de TIC y comercio electrónico 2025–2026',
      url: ineUrl,
      limitation:
        'Tener web no equivale a estar bien posicionado. La encuesta no mide posiciones en búsquedas locales.',
    },
    sections: [
      {
        id: 'web-y-perfil',
        title: 'La web y el Perfil de Empresa tienen funciones distintas',
        paragraphs: [
          'Tu web puede explicar cada servicio con detalle y ofrecer una dirección estable para compartir. El Perfil de Empresa presenta información del negocio dentro de los servicios de Google. Crear una web no equivale a verificar un perfil ni concede acceso a editarlo.',
          'Si mantienes ambos, comprueba que nombre, teléfono, ubicación y horarios no se contradigan. Un negocio que se desplaza al domicilio debe explicar su área real de servicio; no debe presentar una dirección de atención al público que no exista.',
        ],
      },
      {
        id: 'contenido',
        title: 'Escribe para resolver la consulta del cliente',
        paragraphs: [
          'Una página de servicio debe explicar qué haces, para quién, en qué condiciones y cuál es el siguiente paso. En lugar de acumular variantes de una palabra clave, responde a las dudas que recibes por teléfono: qué incluye, cuánto tarda si puedes estimarlo y cómo se solicita.',
          'Añade contexto local cuando sea útil: cómo llegar, acceso desde transporte público o límites de cobertura. No generes decenas de páginas idénticas cambiando el nombre del municipio. Una ubicación solo necesita otra página cuando aporta información específica y real.',
        ],
      },
      {
        id: 'prioridades',
        title: 'Separa los factores que puedes revisar',
        paragraphs: [
          'Puedes corregir datos erróneos, mejorar una descripción o reparar un enlace roto. No puedes cambiar la distancia física de tu local respecto a cada búsqueda ni comprar una posición local. Evalúa cada tarea por el problema que resuelve para el cliente.',
          'La documentación oficial de Google resume los resultados locales alrededor de relevancia, distancia y prominencia. Usa esa explicación como contexto para priorizar, sin convertirla en una fórmula de puntuación ni en una promesa de resultados.',
        ],
      },
      {
        id: 'tecnica',
        title: 'Comprueba el acceso y la versión publicada',
        paragraphs: [
          'Abre la URL sin iniciar sesión y revisa que muestre la información correcta. Comprueba que los enlaces importantes funcionen y que la dirección preferida de cada página sea coherente. Evita publicar varias versiones del mismo contenido como si fueran servicios distintos.',
          'En una revisión con herramientas de búsqueda, distingue una página que no existe de otra que existe pero no está indexada. Un sitemap ayuda a descubrir URLs; no obliga a incluirlas en resultados. Los cambios editoriales y los técnicos deben comprobarse en la versión pública.',
        ],
      },
      {
        id: 'medicion',
        title: 'Mide consultas y solicitudes con un contexto claro',
        paragraphs: [
          'Con una propiedad verificada en Search Console puedes revisar consultas y páginas que reciben impresiones o clics. Anota el periodo y los cambios realizados antes de comparar. Una búsqueda manual desde tu móvil no representa todos los resultados que ve tu clientela.',
          'Relaciona la visibilidad con solicitudes que puedas atender. Si aumentan las visitas pero las llamadas no llegan, revisa primero la claridad de la oferta y el funcionamiento del contacto. No atribuyas un cambio a una sola tarea cuando has modificado varios elementos a la vez.',
        ],
      },
    ],
    table: {
      caption: 'Lista de revisión de presencia local',
      headers: ['Área', 'Acción práctica', 'Evidencia de revisión'],
      rows: [
        [
          'Información',
          'Contrastar nombre, teléfono y horarios',
          'Web y canales gestionados muestran los datos vigentes',
        ],
        [
          'Servicio',
          'Explicar alcance, condiciones y zona',
          'La página resuelve una consulta concreta sin repetir municipios',
        ],
        [
          'Contacto',
          'Probar enlaces desde un móvil',
          'El mensaje o la llamada llegan al negocio',
        ],
        [
          'Acceso',
          'Abrir la página pública sin sesión',
          'La URL responde y muestra el contenido previsto',
        ],
        [
          'Medición',
          'Comparar periodos y registrar cambios',
          'Los datos conservan fecha, fuente y contexto',
        ],
      ],
    },
    links: [
      {
        label: 'Cómo funciona el SEO local en Locavo',
        href: '/caracteristicas/seo-local',
      },
      {
        label: 'Crear la web de tu negocio',
        href: '/blog/como-crear-web-negocio-local',
      },
    ],
  },
  {
    slug: 'web-o-redes-sociales-negocio',
    title: 'Web o redes sociales para tu negocio: qué papel tiene cada canal',
    description:
      'Compara una web, las redes sociales y el Perfil de Empresa para decidir dónde explicar tu oferta, publicar novedades y atender consultas.',
    category: 'Estrategia digital',
    publishedAt: date,
    updatedAt: date,
    answer:
      'Una web y las redes sociales resuelven necesidades diferentes de un negocio local. La web organiza información estable, como servicios, ubicación y condiciones; las redes sirven para compartir novedades y conversar con una comunidad. El Perfil de Empresa añade otra vía de descubrimiento en Google. Locavo puede ayudarte con la web, mientras tú decides qué canales puedes mantener actualizados.',
    evidence: {
      text: 'Entre las empresas de menos de diez empleados con Internet, el INE registró un 36,2 % con web y un 32,1 % que usaba medios sociales en el primer trimestre de 2026.',
      source: 'INE, Encuesta de uso de TIC y comercio electrónico 2025–2026',
      url: ineUrl,
      limitation:
        'Las categorías pueden solaparse: no son alternativas excluyentes. El dato no identifica qué canal genera más clientes.',
    },
    sections: [
      {
        id: 'informacion',
        title: 'Dónde colocar la información que no debería perderse',
        paragraphs: [
          'Un cliente que quiere saber qué incluye un servicio necesita una respuesta que puedas enlazar directamente. En una web puedes reservar una página para esa información y actualizarla sin publicar una nueva entrada cada vez. La dirección de esa página facilita compartir la explicación por distintos canales.',
          'Una publicación social es útil para comunicar una novedad, pero conviene revisar dónde queda la información cuando la campaña termina. Si tienes que explicar condiciones complejas en mensajes privados, una página de servicio puede evitar respuestas incompletas o contradictorias.',
        ],
      },
      {
        id: 'frecuencia',
        title: 'Elige una frecuencia que puedas sostener',
        paragraphs: [
          'Publicar a menudo solo tiene sentido si hay algo útil que contar y alguien que pueda atender las respuestas. Un comercio con novedades semanales puede encontrar valor en mostrarlas; un servicio estable puede priorizar una ficha clara y una vía de contacto atendida.',
          'Haz un inventario de canales y anota quién los gestiona. Si una persona se marcha, revisa accesos y responsabilidades. Conserva copias de tus textos e imágenes y comprueba que los permisos de las cuentas del negocio no dependan de un único teléfono personal.',
        ],
      },
      {
        id: 'busqueda',
        title: 'Qué aporta el Perfil de Empresa en Google',
        paragraphs: [
          'El Perfil de Empresa permite gestionar información comercial en los servicios de Google para negocios que cumplan sus requisitos. No sustituye por completo una página donde explicar condiciones o servicios. Tampoco una web crea, verifica o mantiene el perfil automáticamente.',
          'Cuando enlaces la web desde un perfil que administras, comprueba que el destino responda a la intención: información general, un servicio o una forma de contacto. Revisa los horarios especiales en todos los canales antes de festivos para reducir confusiones.',
        ],
      },
      {
        id: 'priorizar',
        title: 'Cómo decidir por dónde empezar',
        paragraphs: [
          'Si no tienes una página con información básica estable, prepara primero esa base. Si ya existe y está vigente, identifica qué falta: mostrar trabajos recientes, aclarar servicios o responder consultas. El siguiente canal debe cubrir una necesidad concreta, no una obligación de estar en todas partes.',
          'Locavo está pensado para preparar y gestionar la parte web. La estrategia comercial, la atención de mensajes y la revisión de los datos siguen correspondiendo al negocio. Antes de activar una herramienta de terceros, confirma su disponibilidad y sus condiciones.',
        ],
        bullets: [
          'Elige una acción principal que puedas atender.',
          'Reutiliza una explicación clara sin copiar publicaciones fuera de contexto.',
          'Enlaza los canales y prueba su recorrido desde un móvil.',
          'Revisa de dónde vienen las consultas antes de ampliar el esfuerzo.',
        ],
      },
      {
        id: 'costes',
        title: 'Compara el esfuerzo total, no solo la cuota',
        paragraphs: [
          'Anota el coste de dominio, alojamiento o herramienta, el tiempo de actualizar contenidos y la atención de consultas. En redes, contempla también el trabajo de producir publicaciones. Esta lista no presupone que necesites publicidad ni que un canal vaya a recuperar su coste.',
          'Evalúa el conjunto con un periodo y un objetivo definidos: mantener información correcta, reducir dudas repetidas o recibir solicitudes atendibles. Si todavía no tienes medición fiable, empieza registrando las consultas sin inventar porcentajes de conversión.',
        ],
      },
    ],
    table: {
      caption: 'Qué información priorizar en cada canal',
      headers: ['Canal', 'Uso práctico', 'Trabajo que requiere'],
      rows: [
        [
          'Web del negocio',
          'Servicios, condiciones y datos estables enlazables',
          'Revisar contenido, dirección pública y contacto',
        ],
        [
          'Redes sociales',
          'Novedades, trabajos recientes y conversación',
          'Preparar publicaciones y atender interacciones',
        ],
        [
          'Perfil de Empresa',
          'Información comercial dentro de Google',
          'Mantener los datos del perfil y revisar sus requisitos',
        ],
        [
          'Atención directa',
          'Resolver una solicitud concreta',
          'Asignar una persona y un plazo de respuesta realista',
        ],
      ],
    },
    links: [
      {
        label: 'Planificar una web paso a paso',
        href: '/blog/como-crear-web-negocio-local',
      },
      { label: 'Explorar webs por sector', href: '/negocio' },
    ],
  },
]

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug)
}
export function formatGuideDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}
