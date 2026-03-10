const locales = ["es", "ca"] as const;
type Locale = (typeof locales)[number];

type Step = {
  title: string;
  description: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

type BusinessCopy = {
  badge: string;
  title: string;
  subtitle: string;
  urgencyText: string;
  trustLine: string;
  benefitsTitle: string;
  benefits: string[];
  processTitle: string;
  process: Step[];
  proofTitle: string;
  testimonials: Testimonial[];
  planTitle: string;
  planPrice: string;
  planItems: string[];
  finalTitle: string;
  finalSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type BusinessLandingEntry = {
  legacySlug: string;
  slug: string;
  copy: Record<Locale, BusinessCopy>;
};

const rawBusinessLandingEntries: Array<Omit<BusinessLandingEntry, "slug">> = [
  {
    legacySlug: "dentistas",
    copy: {
      es: {
        badge: "Más primeras visitas y tratamientos cerrados",
        title: "Web para clínicas dentales con enfoque de conversión",
        subtitle:
          "Explica tratamientos, financiación y confianza clínica para que el paciente avance del interés a la cita.",
        urgencyText: "Sin una propuesta clara, los pacientes comparan solo por precio.",
        trustLine: "Web profesional con pruebas de confianza y contacto inmediato.",
        benefitsTitle: "Qué aporta a tu clínica dental",
        benefits: [
          "Más solicitudes de primera visita.",
          "Mayor claridad de tratamientos y opciones.",
          "Captación de pacientes desde búsquedas locales.",
        ],
        processTitle: "Cómo activarlo paso a paso",
        process: [
          { title: "Ordena tu oferta clínica", description: "Implantes, ortodoncia y estética con mensajes claros." },
          { title: "Activa credenciales y confianza", description: "Reseñas y argumentos que reducen objeciones." },
          { title: "Optimiza el contacto", description: "CTA directo para agendar visita inicial." },
        ],
        proofTitle: "Clínicas dentales que lo están usando",
        testimonials: [
          { quote: "Mejoramos ratio de consulta a cita tras reorganizar tratamientos en la web.", author: "Marta H.", role: "Clínica dental" },
          { quote: "Recibimos más contactos cualificados desde Google local.", author: "Javier L.", role: "Centro odontológico" },
        ],
        planTitle: "Plan recomendado para dentistas",
        planPrice: "19€/mes",
        planItems: [
          "Contenido orientado a confianza",
          "Contacto directo para primera visita",
          "Editor visual de promociones y campañas",
        ],
        finalTitle: "Convierte búsquedas en pacientes reales",
        finalSubtitle: "Regístrate y activa tu web dental enfocada a captación.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Probar demo",
      },
      ca: {
        badge: "Més primeres visites i tractaments tancats",
        title: "Web per a clíniques dentals amb enfocament de conversió",
        subtitle:
          "Explica tractaments, finançament i confiança clínica perquè el pacient passi de l'interès a la cita.",
        urgencyText: "Sense una proposta clara, els pacients comparen només per preu.",
        trustLine: "Web professional amb proves de confiança i contacte immediat.",
        benefitsTitle: "Què aporta a la teva clínica dental",
        benefits: [
          "Més sol·licituds de primera visita.",
          "Més claredat de tractaments i opcions.",
          "Captació de pacients des de cerques locals.",
        ],
        processTitle: "Com activar-ho pas a pas",
        process: [
          { title: "Ordena la teva oferta clínica", description: "Implants, ortodòncia i estètica amb missatges clars." },
          { title: "Activa credencials i confiança", description: "Ressenyes i arguments que redueixen objeccions." },
          { title: "Optimitza el contacte", description: "CTA directe per agendar visita inicial." },
        ],
        proofTitle: "Clíniques dentals que ja ho fan servir",
        testimonials: [
          { quote: "Vam millorar ràtio de consulta a cita després de reorganitzar tractaments a la web.", author: "Marta H.", role: "Clínica dental" },
          { quote: "Rebem més contactes qualificats des de Google local.", author: "Javier L.", role: "Centre odontològic" },
        ],
        planTitle: "Pla recomanat per dentistes",
        planPrice: "19€/mes",
        planItems: [
          "Contingut orientat a confiança",
          "Contacte directe per primera visita",
          "Editor visual de promocions i campanyes",
        ],
        finalTitle: "Converteix cerques en pacients reals",
        finalSubtitle: "Registra't i activa la teva web dental enfocada a captació.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Provar demo",
      },
    },
  },
  {
    legacySlug: "esteticas",
    copy: {
      es: {
        badge: "Más tratamientos reservados",
        title: "Web para centros de estética enfocada a reservas",
        subtitle:
          "Convierte visitas en citas mostrando tratamientos, resultados y promociones en una experiencia clara y profesional.",
        urgencyText: "Sin una oferta bien presentada, pierdes citas frente a competencia mejor posicionada.",
        trustLine: "Diseño premium + prueba social + CTA directo a reserva.",
        benefitsTitle: "Lo que ganas en tu centro",
        benefits: [
          "Más reservas de tratamientos de mayor ticket.",
          "Mejor percepción de marca y confianza.",
          "Promociones activables en tiempo real.",
        ],
        processTitle: "Cómo arrancar sin complicaciones",
        process: [
          { title: "Define tratamientos clave", description: "Destacamos servicios con mayor conversión y margen." },
          { title: "Activa mensajes de confianza", description: "Incluye testimonios y argumentos que cierran objeciones." },
          { title: "Capta contactos al instante", description: "Formulario y WhatsApp para reservar en caliente." },
        ],
        proofTitle: "Resultados en estética local",
        testimonials: [
          { quote: "Con una página mejor estructurada subieron las reservas de bono.", author: "Paula S.", role: "Centro estético" },
          { quote: "Ahora los clientes llegan con el tratamiento decidido.", author: "Andrea N.", role: "Clínica dermoestética" },
        ],
        planTitle: "Plan recomendado para estética",
        planPrice: "19€/mes",
        planItems: [
          "Páginas de servicio optimizadas",
          "Contacto directo y rápido",
          "Editor visual para campañas estacionales",
        ],
        finalTitle: "Haz crecer tus reservas desde la web",
        finalSubtitle: "Regístrate y publica una página pensada para vender tratamientos.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Probar demo",
      },
      ca: {
        badge: "Més tractaments reservats",
        title: "Web per a centres d'estètica enfocada a reserves",
        subtitle:
          "Converteix visites en cites mostrant tractaments, resultats i promocions en una experiència clara i professional.",
        urgencyText: "Sense una oferta ben presentada, perds cites davant competència millor posicionada.",
        trustLine: "Disseny premium + prova social + CTA directe a reserva.",
        benefitsTitle: "El que guanyes al teu centre",
        benefits: [
          "Més reserves de tractaments de tiquet més alt.",
          "Millor percepció de marca i confiança.",
          "Promocions activables en temps real.",
        ],
        processTitle: "Com arrencar sense complicacions",
        process: [
          { title: "Defineix tractaments clau", description: "Destaquem serveis amb més conversió i marge." },
          { title: "Activa missatges de confiança", description: "Inclou testimonis i arguments que tanquen objeccions." },
          { title: "Capta contactes a l'instant", description: "Formulari i WhatsApp per reservar en calent." },
        ],
        proofTitle: "Resultats en estètica local",
        testimonials: [
          { quote: "Amb una pàgina millor estructurada van pujar les reserves de bo.", author: "Paula S.", role: "Centre estètic" },
          { quote: "Ara els clients arriben amb el tractament decidit.", author: "Andrea N.", role: "Clínica dermoestètica" },
        ],
        planTitle: "Pla recomanat per estètica",
        planPrice: "19€/mes",
        planItems: [
          "Pàgines de servei optimitzades",
          "Contacte directe i ràpid",
          "Editor visual per campanyes estacionals",
        ],
        finalTitle: "Fes créixer les teves reserves des de la web",
        finalSubtitle: "Registra't i publica una pàgina pensada per vendre tractaments.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Provar demo",
      },
    },
  },
  {
    legacySlug: "farmacias",
    copy: {
      es: {
        badge: "Genera confianza antes de la visita",
        title: "Web para farmacias que mejora visibilidad y atención",
        subtitle:
          "Informa horarios, guardias, servicios y contacto en una web clara para que el cliente encuentre respuesta inmediata.",
        urgencyText: "Cuando la información no está clara, el cliente llama a otra farmacia.",
        trustLine: "Credibilidad digital con contenido útil y canal directo de contacto.",
        benefitsTitle: "Qué aporta a tu farmacia",
        benefits: [
          "Horarios y guardias visibles en todo momento.",
          "Mayor confianza con servicios explicados claramente.",
          "Más consultas y pedidos desde canal propio.",
        ],
        processTitle: "Implementación en 3 pasos",
        process: [
          { title: "Publica servicios clave", description: "Destaca lo que más buscan tus clientes en tu zona." },
          { title: "Ordena la información", description: "Horarios, ubicación y contacto sin fricción." },
          { title: "Actualiza campañas", description: "Novedades y promociones editadas en minutos." },
        ],
        proofTitle: "Farmacias que ya lo aplican",
        testimonials: [
          { quote: "Reducimos llamadas repetidas al dejar guardias y horarios claros.", author: "Sonia L.", role: "Farmacia de barrio" },
          { quote: "Ahora recibimos más consultas útiles por WhatsApp.", author: "Gabriel C.", role: "Farmacia comunitaria" },
        ],
        planTitle: "Plan recomendado para farmacias",
        planPrice: "19€/mes",
        planItems: [
          "Edición instantánea de horarios",
          "Contacto directo integrado",
          "SEO local para búsquedas urgentes",
        ],
        finalTitle: "Haz que te encuentren y te contacten más rápido",
        finalSubtitle: "Crea tu cuenta y publica una web útil para tus clientes.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Publicar mi web",
      },
      ca: {
        badge: "Genera confiança abans de la visita",
        title: "Web per a farmàcies que millora visibilitat i atenció",
        subtitle:
          "Informa horaris, guàrdies, serveis i contacte en una web clara perquè el client trobi resposta immediata.",
        urgencyText: "Quan la informació no és clara, el client truca a una altra farmàcia.",
        trustLine: "Credibilitat digital amb contingut útil i canal directe de contacte.",
        benefitsTitle: "Què aporta a la teva farmàcia",
        benefits: [
          "Horaris i guàrdies visibles en tot moment.",
          "Més confiança amb serveis explicats clarament.",
          "Més consultes i comandes des de canal propi.",
        ],
        processTitle: "Implementació en 3 passos",
        process: [
          { title: "Publica serveis clau", description: "Destaca el que més busquen els teus clients a la zona." },
          { title: "Ordena la informació", description: "Horaris, ubicació i contacte sense fricció." },
          { title: "Actualitza campanyes", description: "Novetats i promocions editades en minuts." },
        ],
        proofTitle: "Farmàcies que ja ho apliquen",
        testimonials: [
          { quote: "Vam reduir trucades repetides deixant guàrdies i horaris clars.", author: "Sonia L.", role: "Farmàcia de barri" },
          { quote: "Ara rebem més consultes útils per WhatsApp.", author: "Gabriel C.", role: "Farmàcia comunitària" },
        ],
        planTitle: "Pla recomanat per a farmàcies",
        planPrice: "19€/mes",
        planItems: [
          "Edició instantània d'horaris",
          "Contacte directe integrat",
          "SEO local per cerques urgents",
        ],
        finalTitle: "Fes que et trobin i et contactin més ràpid",
        finalSubtitle: "Crea el teu compte i publica una web útil per als teus clients.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Publicar la meva web",
      },
    },
  },
  {
    legacySlug: "fotografos",
    copy: {
      es: {
        badge: "Muestra portfolio y cierra más sesiones",
        title: "Web para fotógrafos orientada a solicitudes de presupuesto",
        subtitle:
          "Presenta tu estilo, packs y disponibilidad en una landing pensada para que te escriban con intención de contratar.",
        urgencyText: "Sin un portfolio bien estructurado, el lead compara y se enfría.",
        trustLine: "Portfolio + propuesta + formulario en un flujo simple de conversión.",
        benefitsTitle: "Qué desbloquea para tu estudio",
        benefits: [
          "Más solicitudes cualificadas por tipo de sesión.",
          "Mejor percepción de valor y posicionamiento.",
          "Proceso de contacto más ordenado y medible.",
        ],
        processTitle: "Activación rápida para captar mejor",
        process: [
          { title: "Estructura tu oferta", description: "Bodas, retrato, eventos o marca personal por separado." },
          { title: "Guía la decisión", description: "Incluye pruebas visuales y argumentos de confianza." },
          { title: "Captura el lead", description: "Formulario con datos clave para cerrar rápido." },
        ],
        proofTitle: "Fotógrafos que ya mejoraron conversión",
        testimonials: [
          { quote: "Con la nueva página recibimos presupuestos mejor definidos.", author: "Laia C.", role: "Fotografía de bodas" },
          { quote: "Ahora filtra por tipo de sesión y perdemos menos tiempo.", author: "Sergi B.", role: "Estudio de retrato" },
        ],
        planTitle: "Plan recomendado para fotógrafos",
        planPrice: "19€/mes",
        planItems: [
          "Landing optimizada para portfolio",
          "Formularios por tipo de servicio",
          "Editor visual para campañas estacionales",
        ],
        finalTitle: "Convierte tu portfolio en un canal de ventas",
        finalSubtitle: "Crea tu cuenta y empieza a recibir mejores solicitudes.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Ver demo",
      },
      ca: {
        badge: "Mostra portfolio i tanca més sessions",
        title: "Web per a fotògrafs orientada a sol·licituds de pressupost",
        subtitle:
          "Presenta el teu estil, packs i disponibilitat en una landing pensada perquè t'escriguin amb intenció de contractar.",
        urgencyText: "Sense un portfolio ben estructurat, el lead compara i es refreda.",
        trustLine: "Portfolio + proposta + formulari en un flux simple de conversió.",
        benefitsTitle: "Què desbloqueja per al teu estudi",
        benefits: [
          "Més sol·licituds qualificades per tipus de sessió.",
          "Millor percepció de valor i posicionament.",
          "Procés de contacte més ordenat i mesurable.",
        ],
        processTitle: "Activació ràpida per captar millor",
        process: [
          { title: "Estructura la teva oferta", description: "Bodes, retrat, esdeveniments o marca personal per separat." },
          { title: "Guia la decisió", description: "Inclou proves visuals i arguments de confiança." },
          { title: "Captura el lead", description: "Formulari amb dades clau per tancar ràpid." },
        ],
        proofTitle: "Fotògrafs que ja han millorat conversió",
        testimonials: [
          { quote: "Amb la nova pàgina rebem pressupostos millor definits.", author: "Laia C.", role: "Fotografia de casaments" },
          { quote: "Ara filtra per tipus de sessió i perdem menys temps.", author: "Sergi B.", role: "Estudi de retrat" },
        ],
        planTitle: "Pla recomanat per a fotògrafs",
        planPrice: "19€/mes",
        planItems: [
          "Landing optimitzada per portfolio",
          "Formularis per tipus de servei",
          "Editor visual per campanyes estacionals",
        ],
        finalTitle: "Converteix el teu portfolio en un canal de vendes",
        finalSubtitle: "Crea el teu compte i comença a rebre millors sol·licituds.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Veure demo",
      },
    },
  },
  {
    legacySlug: "gimnasios",
    copy: {
      es: {
        badge: "Convierte interés en nuevas altas",
        title: "Web para gimnasios enfocada en registros y pruebas",
        subtitle:
          "Presenta planes, horarios y clases con una estructura que empuja a pedir prueba o apuntarse hoy.",
        urgencyText: "Sin una oferta clara online, el lead se enfría en minutos.",
        trustLine: "Más altas con CTAs de prueba, contacto inmediato y propuesta de valor visible.",
        benefitsTitle: "Resultados que puedes activar rápido",
        benefits: [
          "Más solicitudes de prueba desde móvil.",
          "Planes y precios explicados para reducir fricción.",
          "Captación de leads para seguimiento comercial.",
        ],
        processTitle: "Cómo activar captación de socios",
        process: [
          { title: "Define planes y promesas", description: "Mostramos qué consigue cada tipo de cliente contigo." },
          { title: "Configura lead magnet", description: "Prueba gratis o sesión inicial como CTA principal." },
          { title: "Mide y mejora", description: "Itera mensajes según qué plan convierte más." },
        ],
        proofTitle: "Experiencias del sector fitness",
        testimonials: [
          { quote: "Duplicamos pruebas semanales con una landing clara por objetivos.", author: "Ruth M.", role: "Box de entrenamiento" },
          { quote: "La web nos filtra mejor y llegan leads más decididos.", author: "Héctor A.", role: "Gimnasio de barrio" },
        ],
        planTitle: "Plan recomendado para gimnasios",
        planPrice: "19€/mes",
        planItems: [
          "Formularios orientados a prueba",
          "Editor visual para campañas",
          "SEO local por zona",
        ],
        finalTitle: "Empieza a captar más socios desde esta semana",
        finalSubtitle: "Crea tu cuenta y transforma visitas en altas.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Ver demo",
      },
      ca: {
        badge: "Converteix interès en noves altes",
        title: "Web per a gimnasos enfocada en registres i proves",
        subtitle:
          "Presenta plans, horaris i classes amb una estructura que empeny a demanar prova o apuntar-se avui.",
        urgencyText: "Sense una oferta clara online, el lead es refreda en minuts.",
        trustLine: "Més altes amb CTAs de prova, contacte immediat i proposta de valor visible.",
        benefitsTitle: "Resultats que pots activar ràpid",
        benefits: [
          "Més sol·licituds de prova des de mòbil.",
          "Plans i preus explicats per reduir fricció.",
          "Captació de leads per seguiment comercial.",
        ],
        processTitle: "Com activar captació de socis",
        process: [
          { title: "Defineix plans i promeses", description: "Mostrem què aconsegueix cada tipus de client amb tu." },
          { title: "Configura lead magnet", description: "Prova gratis o sessió inicial com a CTA principal." },
          { title: "Mesura i millora", description: "Itera missatges segons quin pla converteix més." },
        ],
        proofTitle: "Experiències del sector fitness",
        testimonials: [
          { quote: "Vam duplicar proves setmanals amb una landing clara per objectius.", author: "Ruth M.", role: "Box d'entrenament" },
          { quote: "La web ens filtra millor i arriben leads més decidits.", author: "Héctor A.", role: "Gimnàs de barri" },
        ],
        planTitle: "Pla recomanat per a gimnasos",
        planPrice: "19€/mes",
        planItems: [
          "Formularis orientats a prova",
          "Editor visual per campanyes",
          "SEO local per zona",
        ],
        finalTitle: "Comença a captar més socis des d'aquesta setmana",
        finalSubtitle: "Crea el teu compte i transforma visites en altes.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Veure demo",
      },
    },
  },
  {
    legacySlug: "inmobiliarias",
    copy: {
      es: {
        badge: "Capta compradores y propietarios con mejor filtro",
        title: "Web para inmobiliarias enfocada a leads de calidad",
        subtitle:
          "Publica servicios y propuesta comercial con una estructura que convierte visitas en solicitudes claras.",
        urgencyText: "Sin web optimizada, pierdes leads frente a portales y competencia local.",
        trustLine: "Canal propio para captar, filtrar y dar seguimiento a oportunidades.",
        benefitsTitle: "Qué mejora en tu inmobiliaria",
        benefits: [
          "Más solicitudes de venta y captación de inmuebles.",
          "Leads con mejor información inicial.",
          "Imagen profesional para cerrar más reuniones.",
        ],
        processTitle: "Cómo activarlo en pocos días",
        process: [
          { title: "Define servicios y zonas", description: "Compra, venta y alquiler con foco por área." },
          { title: "Activa formularios específicos", description: "Captación de propietarios y compradores por separado." },
          { title: "Optimiza mensajes", description: "Ajusta propuesta según tipo de lead que más cierra." },
        ],
        proofTitle: "Inmobiliarias que ya escalaron captación",
        testimonials: [
          { quote: "Subimos contactos de propietarios al aclarar propuesta y proceso.", author: "Bea F.", role: "Agencia inmobiliaria" },
          { quote: "Llegan leads mejor filtrados para compradores e inversores.", author: "Álex T.", role: "Broker local" },
        ],
        planTitle: "Plan recomendado para inmobiliarias",
        planPrice: "19€/mes",
        planItems: [
          "Formularios segmentados por lead",
          "SEO local por zona",
          "Editor visual para nuevas campañas",
        ],
        finalTitle: "Convierte tu web en máquina de captación",
        finalSubtitle: "Regístrate y empieza a generar leads más cualificados.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Probar demo",
      },
      ca: {
        badge: "Capta compradors i propietaris amb millor filtre",
        title: "Web per a immobiliàries enfocada a leads de qualitat",
        subtitle:
          "Publica serveis i proposta comercial amb una estructura que converteix visites en sol·licituds clares.",
        urgencyText: "Sense web optimitzada, perds leads davant portals i competència local.",
        trustLine: "Canal propi per captar, filtrar i fer seguiment d'oportunitats.",
        benefitsTitle: "Què millora a la teva immobiliària",
        benefits: [
          "Més sol·licituds de venda i captació d'immobles.",
          "Leads amb millor informació inicial.",
          "Imatge professional per tancar més reunions.",
        ],
        processTitle: "Com activar-ho en pocs dies",
        process: [
          { title: "Defineix serveis i zones", description: "Compra, venda i lloguer amb focus per àrea." },
          { title: "Activa formularis específics", description: "Captació de propietaris i compradors per separat." },
          { title: "Optimitza missatges", description: "Ajusta proposta segons tipus de lead que més tanca." },
        ],
        proofTitle: "Immobiliàries que ja han escalat captació",
        testimonials: [
          { quote: "Vam pujar contactes de propietaris aclarint proposta i procés.", author: "Bea F.", role: "Agència immobiliària" },
          { quote: "Arriben leads millor filtrats per a compradors i inversors.", author: "Álex T.", role: "Broker local" },
        ],
        planTitle: "Pla recomanat per immobiliàries",
        planPrice: "19€/mes",
        planItems: [
          "Formularis segmentats per lead",
          "SEO local per zona",
          "Editor visual per noves campanyes",
        ],
        finalTitle: "Converteix la teva web en màquina de captació",
        finalSubtitle: "Registra't i comença a generar leads més qualificats.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Provar demo",
      },
    },
  },
  {
    legacySlug: "peluquerias",
    copy: {
      es: {
        badge: "Capta más citas sin depender de Instagram",
        title: "Web para peluquerías que convierte visitas en reservas",
        subtitle:
          "Muestra cortes, precios y disponibilidad en una página pensada para que te escriban o reserven en el momento.",
        urgencyText: "Cada cliente que no encuentra precio u horario claro se va con otra peluquería.",
        trustLine: "Web móvil + WhatsApp + formulario para llenar agenda con menos fricción.",
        benefitsTitle: "Qué mejora en tu peluquería",
        benefits: [
          "Más citas desde Google y redes en una sola página.",
          "Servicios y tarifas visibles para reducir preguntas repetidas.",
          "Promociones y packs actualizables en minutos.",
        ],
        processTitle: "Cómo lo activas esta semana",
        process: [
          { title: "Configura tus servicios", description: "Cortes, color y tratamientos con enfoque comercial." },
          { title: "Publica CTAs directos", description: "Botones claros de llamada, WhatsApp y reserva." },
          { title: "Ajusta según demanda", description: "Edita ofertas por temporada sin depender de terceros." },
        ],
        proofTitle: "Casos de peluquerías locales",
        testimonials: [
          { quote: "Subimos reservas de color al explicar mejor los packs en la web.", author: "Clara V.", role: "Peluquería unisex" },
          { quote: "Con un solo enlace pasamos de mensajes sueltos a citas claras.", author: "Marc R.", role: "Barbería" },
        ],
        planTitle: "Plan recomendado para peluquerías",
        planPrice: "19€/mes",
        planItems: [
          "Editor visual ilimitado",
          "Formulario + WhatsApp",
          "SEO local para búsquedas cercanas",
        ],
        finalTitle: "Llena agenda con una web que sí convierte",
        finalSubtitle: "Crea tu cuenta y empieza a captar citas desde hoy.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Probar demo",
      },
      ca: {
        badge: "Capta més cites sense dependre d'Instagram",
        title: "Web per a perruqueries que converteix visites en reserves",
        subtitle:
          "Mostra talls, preus i disponibilitat en una pàgina pensada perquè t'escriguin o reservin al moment.",
        urgencyText: "Cada client que no troba preu o horari clar marxa a una altra perruqueria.",
        trustLine: "Web mòbil + WhatsApp + formulari per omplir agenda amb menys fricció.",
        benefitsTitle: "Què millora a la teva perruqueria",
        benefits: [
          "Més cites des de Google i xarxes en una sola pàgina.",
          "Serveis i tarifes visibles per reduir preguntes repetides.",
          "Promocions i packs actualitzables en minuts.",
        ],
        processTitle: "Com ho actives aquesta setmana",
        process: [
          { title: "Configura els teus serveis", description: "Talls, color i tractaments amb enfocament comercial." },
          { title: "Publica CTAs directes", description: "Botons clars de trucada, WhatsApp i reserva." },
          { title: "Ajusta segons demanda", description: "Edita ofertes per temporada sense dependre de tercers." },
        ],
        proofTitle: "Casos de perruqueries locals",
        testimonials: [
          { quote: "Vam pujar reserves de color explicant millor els packs a la web.", author: "Clara V.", role: "Perruqueria unisex" },
          { quote: "Amb un sol enllaç vam passar de missatges solts a cites clares.", author: "Marc R.", role: "Barberia" },
        ],
        planTitle: "Pla recomanat per a perruqueries",
        planPrice: "19€/mes",
        planItems: [
          "Editor visual il·limitat",
          "Formulari + WhatsApp",
          "SEO local per cerques properes",
        ],
        finalTitle: "Omple agenda amb una web que sí converteix",
        finalSubtitle: "Crea el teu compte i comença a captar cites des d'avui.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Provar demo",
      },
    },
  },
  {
    legacySlug: "restaurantes",
    copy: {
      es: {
        badge: "Más mesas con menos llamadas perdidas",
        title: "Web para restaurantes orientada a reservas y pedidos",
        subtitle:
          "Carta, horarios, ubicación y reservas en un flujo simple para que el cliente decida rápido y contacte sin fricción.",
        urgencyText: "Si el cliente no encuentra menú o disponibilidad en segundos, abandona.",
        trustLine: "Tu web como canal de captación propio, más allá de apps de terceros.",
        benefitsTitle: "Impacto directo en el negocio",
        benefits: [
          "Más reservas directas sin intermediarios.",
          "Información de menú y horarios siempre actualizada.",
          "Mejor conversión de tráfico desde Google Maps.",
        ],
        processTitle: "Implementación rápida",
        process: [
          { title: "Sube menú y propuesta", description: "Destacamos platos estrella y diferenciales del local." },
          { title: "Activa reservas/contacto", description: "Botones visibles para reservar o pedir información." },
          { title: "Optimiza por servicio", description: "Ajusta campañas para mediodía, cenas o eventos." },
        ],
        proofTitle: "Lo que reportan restaurantes",
        testimonials: [
          { quote: "Pasamos tráfico de Google a reservas directas con mejor margen.", author: "Nerea T.", role: "Restaurante mediterráneo" },
          { quote: "La gente llega más informada y con menos dudas sobre carta y horarios.", author: "Joan P.", role: "Brasería local" },
        ],
        planTitle: "Plan recomendado para restaurantes",
        planPrice: "19€/mes",
        planItems: [
          "Web optimizada para móvil",
          "CTA a reserva y WhatsApp",
          "Editor visual para menú y promos",
        ],
        finalTitle: "Convierte búsquedas en mesas ocupadas",
        finalSubtitle: "Activa tu web y empieza a captar reservas directas.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Publicar mi web",
      },
      ca: {
        badge: "Més taules amb menys trucades perdudes",
        title: "Web per a restaurants orientada a reserves i comandes",
        subtitle:
          "Carta, horaris, ubicació i reserves en un flux simple perquè el client decideixi ràpid i contacti sense fricció.",
        urgencyText: "Si el client no troba menú o disponibilitat en segons, abandona.",
        trustLine: "La teva web com a canal de captació propi, més enllà d'apps de tercers.",
        benefitsTitle: "Impacte directe al negoci",
        benefits: [
          "Més reserves directes sense intermediaris.",
          "Informació de menú i horaris sempre actualitzada.",
          "Millor conversió de trànsit des de Google Maps.",
        ],
        processTitle: "Implementació ràpida",
        process: [
          { title: "Puja menú i proposta", description: "Destaquem plats estrella i diferencials del local." },
          { title: "Activa reserves/contacte", description: "Botons visibles per reservar o demanar informació." },
          { title: "Optimitza per servei", description: "Ajusta campanyes per migdia, nits o esdeveniments." },
        ],
        proofTitle: "El que reporten restaurants",
        testimonials: [
          { quote: "Vam passar trànsit de Google a reserves directes amb millor marge.", author: "Nerea T.", role: "Restaurant mediterrani" },
          { quote: "La gent arriba més informada i amb menys dubtes sobre carta i horaris.", author: "Joan P.", role: "Braseria local" },
        ],
        planTitle: "Pla recomanat per a restaurants",
        planPrice: "19€/mes",
        planItems: [
          "Web optimitzada per mòbil",
          "CTA a reserva i WhatsApp",
          "Editor visual per menú i promos",
        ],
        finalTitle: "Converteix cerques en taules ocupades",
        finalSubtitle: "Activa la teva web i comença a captar reserves directes.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Publicar la meva web",
      },
    },
  },
  {
    legacySlug: "talleres",
    copy: {
      es: {
        badge: "Más entradas al taller desde búsquedas locales",
        title: "Web para talleres con foco en llamadas y citas",
        subtitle:
          "Haz que te encuentren rápido, entiendan tus servicios y pidan cita con un clic desde móvil.",
        urgencyText: "Si no apareces claro en Google, el cliente llama al primer competidor.",
        trustLine: "Canal directo para reparaciones, revisiones y urgencias mecánicas.",
        benefitsTitle: "Qué resultados puedes esperar",
        benefits: [
          "Más llamadas de clientes cercanos.",
          "Servicios y especialidades mejor explicados.",
          "Menor pérdida de leads por falta de información.",
        ],
        processTitle: "Activación sin complejidad técnica",
        process: [
          { title: "Publica servicios clave", description: "Revisión, neumáticos, frenos, diagnosis y más." },
          { title: "Optimiza contacto inmediato", description: "Botón de llamada y WhatsApp con máxima visibilidad." },
          { title: "Ajusta por temporada", description: "Campañas para ITV, vacaciones o mantenimiento preventivo." },
        ],
        proofTitle: "Talleres que ya mejoraron captación",
        testimonials: [
          { quote: "Subieron llamadas en la primera semana con la nueva página.", author: "Rubén G.", role: "Taller multimarca" },
          { quote: "Ahora los clientes entienden servicios antes de llamar.", author: "Nico P.", role: "Taller de barrio" },
        ],
        planTitle: "Plan recomendado para talleres",
        planPrice: "19€/mes",
        planItems: [
          "CTA de llamada directa",
          "SEO local técnico",
          "Editor visual para campañas por temporada",
        ],
        finalTitle: "Convierte búsquedas en citas de taller",
        finalSubtitle: "Crea tu cuenta y activa una web que te trae trabajo.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Publicar mi web",
      },
      ca: {
        badge: "Més entrades al taller des de cerques locals",
        title: "Web per a tallers amb focus en trucades i cites",
        subtitle:
          "Fes que et trobin ràpid, entenguin els teus serveis i demanin cita amb un clic des de mòbil.",
        urgencyText: "Si no apareixes clar a Google, el client truca al primer competidor.",
        trustLine: "Canal directe per reparacions, revisions i urgències mecàniques.",
        benefitsTitle: "Quins resultats pots esperar",
        benefits: [
          "Més trucades de clients propers.",
          "Serveis i especialitats millor explicats.",
          "Menys pèrdua de leads per manca d'informació.",
        ],
        processTitle: "Activació sense complexitat tècnica",
        process: [
          { title: "Publica serveis clau", description: "Revisió, pneumàtics, frens, diagnosis i més." },
          { title: "Optimitza contacte immediat", description: "Botó de trucada i WhatsApp amb màxima visibilitat." },
          { title: "Ajusta per temporada", description: "Campanyes per ITV, vacances o manteniment preventiu." },
        ],
        proofTitle: "Tallers que ja han millorat captació",
        testimonials: [
          { quote: "Van pujar trucades la primera setmana amb la nova pàgina.", author: "Rubén G.", role: "Taller multimarca" },
          { quote: "Ara els clients entenen serveis abans de trucar.", author: "Nico P.", role: "Taller de barri" },
        ],
        planTitle: "Pla recomanat per tallers",
        planPrice: "19€/mes",
        planItems: [
          "CTA de trucada directa",
          "SEO local tècnic",
          "Editor visual per campanyes de temporada",
        ],
        finalTitle: "Converteix cerques en cites de taller",
        finalSubtitle: "Crea el teu compte i activa una web que et porta feina.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Publicar la meva web",
      },
    },
  },
  {
    legacySlug: "veterinarios",
    copy: {
      es: {
        badge: "Más citas y urgencias bien atendidas",
        title: "Web para clínicas veterinarias enfocada en contacto inmediato",
        subtitle:
          "Facilita que los dueños encuentren servicios, horarios y canales de urgencia para convertir búsquedas en citas reales.",
        urgencyText: "En veterinaria, cada minuto sin información clara puede costar una visita.",
        trustLine: "Canal directo para primera cita, revisiones y atención urgente.",
        benefitsTitle: "Qué mejora en tu clínica",
        benefits: [
          "Más citas programadas desde móvil.",
          "Menos llamadas repetidas por información básica.",
          "Mejor experiencia para dueños en situación urgente.",
        ],
        processTitle: "Flujo de captación recomendado",
        process: [
          { title: "Organiza servicios y especialidades", description: "Vacunas, revisiones y urgencias bien visibles." },
          { title: "Destaca contacto urgente", description: "Botones directos para responder rápido." },
          { title: "Optimiza por zona", description: "Aparece en búsquedas locales de alta intención." },
        ],
        proofTitle: "Veterinarios que ya optimizaron su captación",
        testimonials: [
          { quote: "Mejoramos respuesta en urgencias al centralizar contacto en la web.", author: "Elena D.", role: "Clínica veterinaria" },
          { quote: "Subieron citas de revisión con una oferta más clara.", author: "Toni M.", role: "Hospital veterinario local" },
        ],
        planTitle: "Plan recomendado para veterinarios",
        planPrice: "19€/mes",
        planItems: [
          "WhatsApp y llamada directa",
          "Edición ágil de horarios",
          "SEO local para servicios veterinarios",
        ],
        finalTitle: "Haz que te encuentren cuando más te necesitan",
        finalSubtitle: "Crea tu cuenta y activa una web clara para captar más citas.",
        ctaPrimary: "Crear cuenta gratis",
        ctaSecondary: "Ver demo",
      },
      ca: {
        badge: "Més cites i urgències ben ateses",
        title: "Web per a clíniques veterinàries enfocada en contacte immediat",
        subtitle:
          "Facilita que els propietaris trobin serveis, horaris i canals d'urgència per convertir cerques en cites reals.",
        urgencyText: "En veterinària, cada minut sense informació clara pot costar una visita.",
        trustLine: "Canal directe per primera cita, revisions i atenció urgent.",
        benefitsTitle: "Què millora a la teva clínica",
        benefits: [
          "Més cites programades des de mòbil.",
          "Menys trucades repetides per informació bàsica.",
          "Millor experiència per als propietaris en situació urgent.",
        ],
        processTitle: "Flux de captació recomanat",
        process: [
          { title: "Organitza serveis i especialitats", description: "Vacunes, revisions i urgències ben visibles." },
          { title: "Destaca contacte urgent", description: "Botons directes per respondre ràpid." },
          { title: "Optimitza per zona", description: "Apareix en cerques locals d'alta intenció." },
        ],
        proofTitle: "Veterinaris que ja han optimitzat captació",
        testimonials: [
          { quote: "Vam millorar resposta en urgències centralitzant contacte a la web.", author: "Elena D.", role: "Clínica veterinària" },
          { quote: "Van pujar cites de revisió amb una oferta més clara.", author: "Toni M.", role: "Hospital veterinari local" },
        ],
        planTitle: "Pla recomanat per veterinaris",
        planPrice: "19€/mes",
        planItems: [
          "WhatsApp i trucada directa",
          "Edició àgil d'horaris",
          "SEO local per serveis veterinaris",
        ],
        finalTitle: "Fes que et trobin quan més et necessiten",
        finalSubtitle: "Crea el teu compte i activa una web clara per captar més cites.",
        ctaPrimary: "Crear compte gratis",
        ctaSecondary: "Veure demo",
      },
    },
  },
];

export function slugifyBusinessTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const businessLandingEntries: BusinessLandingEntry[] = rawBusinessLandingEntries.map((entry) => ({
  ...entry,
  slug: slugifyBusinessTitle(entry.copy.es.title),
}));

export const legacyBusinessSlugToSlug = Object.fromEntries(
  businessLandingEntries.map(({ legacySlug, slug }) => [legacySlug, slug])
);

export const businessLandingEntriesBySlug = businessLandingEntries;

export function getBusinessLandingBySlug(slug: string): BusinessLandingEntry | undefined {
  return businessLandingEntries.find((entry) => entry.slug === slug);
}
