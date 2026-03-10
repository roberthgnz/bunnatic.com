export const content = {
  es: {
    navbar: {
      logo: "Nova Web",
      languages: "ES | CA",
      platformLabel: "Plataform",
      coreFeaturesLabel: "Características",
      coreFeatures: [
        { id: "generacion-ia", label: "Generación con IA" },
        { id: "seo-local", label: "SEO local" },
        { id: "edicion-asistida", label: "Edición visual + IA" }
      ],
      cta: "Crear mi web gratis →",
    },
    hero: {
      badge: "✦ Más de 1,000 negocios ya confían en nosotros",
      titleLine1: "Tu negocio merece una",
      titleLine2: "web profesional.",
      titleLine3: "La tienes lista en 5 minutos.",
      subtitle: "La IA crea tu web usando los datos de tu negocio. Gratis para empezar.",
      cta: "Crear mi web gratis →",
      trustText: "Sin tarjeta · Sin técnicos · Cancela cuando quieras",
    },
    ticker: {
      businesses: [
        "💇 Peluquerías", "🍽 Restaurantes", "🏋 Gimnasios", "💊 Farmacias",
        "💅 Estéticas", "🐶 Veterinarios", "🦷 Dentistas", "📷 Fotógrafos",
        "🏘 Inmobiliarias", "🔧 Talleres"
      ],
      text1: "Más de 1,200 negocios ya tienen su web con novaweb",
      text2: "Hostal El Pueblo · Carlos R Apuntería · Anni R Veterinaria · Jose · Librería · Joana · Ofimac · Loli D Ofimac",
    },
    howItWorks: {
      title: "Así de fácil funciona",
      subtitle: "Sin técnicos. Sin complicaciones. En 3 pasos tienes tu web lista.",
      steps: [
        {
          number: "1",
          title: "Busca tu negocio",
          description: "El nombre de tu negocio y la IA lo encontrará en Google. Tus datos se rellenan solos.",
          mockup: {
            input: "Peluquería Rosa – Madrid",
            result: "Peluquería Rosa · Calle Gran Vía, 42"
          }
        },
        {
          number: "2",
          title: "La IA crea tu web",
          description: "En menos de 5 minutos, la IA diseña una web completa con tus textos, servicios y fotos.",
          mockup: {
            title: "Crea tu web",
            items: [
              "Textos generados",
              "Servicios añadidos",
              "Cargando Imágenes..."
            ]
          }
        },
        {
          number: "3",
          title: "Publícala y recibe clientes",
          description: "Tu web aparece en Google para tus clientes locales y los contactos llegarán directamente.",
          mockup: {
            tag: "Web publicada",
            chat: "Hola, ¿tienen cita disponible para el sábado?"
          }
        }
      ]
    },
    features: [
      {
        id: "generacion-ia",
        title: "Generación con Inteligencia Artificial",
        description: "Crea una web completa en segundos usando solo el nombre de tu negocio.",
        icon: "Sparkles",
        benefits: [
          "Textos persuasivos generados automáticamente",
          "Selección de imágenes relevantes para tu sector",
          "Estructura optimizada para conversión",
          "Diseño adaptado a tu identidad visual"
        ]
      },
      {
        id: "seo-local",
        title: "Optimización SEO Local",
        description: "Aparece en los primeros resultados cuando los clientes busquen tus servicios en tu zona.",
        icon: "MapPin",
        benefits: [
          "Metadatos optimizados automáticamente",
          "Estructura de URLs amigable",
          "Velocidad de carga ultrarrápida",
          "Integración con Google My Business"
        ]
      },
      {
        id: "edicion-asistida",
          title: "Edición visual con ayuda de IA",
        description: "Edita tu web con un editor visual intuitivo y usa la IA para recibir recomendaciones de contenido.",
        icon: "MessageSquare",
        benefits: [
          "Cambios en tiempo real",
          "Sin conocimientos técnicos requeridos",
          "Actualización de horarios y servicios al instante",
          "Sugerencias de mejora continuas"
        ]
      },
      {
        id: "formularios-contacto",
        title: "Captación de Clientes",
        description: "Convierte visitantes en clientes con formularios optimizados y llamadas a la acción claras.",
        icon: "Users",
        benefits: [
          "Formularios de contacto integrados",
          "Notificaciones instantáneas por email",
          "Botones de WhatsApp y llamada directa",
          "Diseño orientado a la conversión"
        ]
      },
      {
        id: "hosting-dominio",
        title: "Hosting y Dominio Incluidos",
        description: "Nos encargamos de toda la parte técnica para que tú te centres en tu negocio.",
        icon: "Globe",
        benefits: [
          "Certificado SSL gratuito (HTTPS)",
          "Servidores ultrarrápidos y seguros",
          "Dominio personalizado disponible",
          "Copias de seguridad automáticas"
        ]
      }
    ],
    competitors: [
      {
        id: "facebook",
        name: "Facebook Pages",
        description: "Una página de Facebook es útil para redes sociales, pero no sustituye a una web profesional. El algoritmo decide quién te ve y no apareces bien en Google.",
        comparison: {
          competitor: {
            title: "Con Facebook Pages",
            items: [
              "El algoritmo limita tu alcance orgánico",
              "No apareces en las búsquedas de Google",
              "Diseño rígido igual al de tu competencia",
              "Tus clientes se distraen con otras publicaciones"
            ]
          },
          novaweb: {
            title: "Con Nova Web",
            items: [
              "Eres dueño de tu presencia online",
              "SEO local para aparecer en Google",
              "Diseño profesional y único para ti",
              "Sin distracciones, enfocado en vender"
            ]
          }
        }
      },
      {
        id: "instagram",
        name: "Instagram",
        description: "Instagram es genial para fotos, pero pésimo para dar información clara (horarios, servicios, precios) o captar clientes a través de Google.",
        comparison: {
          competitor: {
            title: "Con Instagram",
            items: [
              "Solo puedes poner un enlace en la biografía",
              "Difícil encontrar información específica",
              "No indexa en Google para búsquedas locales",
              "Dependes de una red social de terceros"
            ]
          },
          novaweb: {
            title: "Con Nova Web",
            items: [
              "Toda tu información estructurada y clara",
              "Formularios de contacto directos",
              "Apareces cuando buscan tus servicios en Google",
              "Tu propia marca, tus propias reglas"
            ]
          }
        }
      },
      {
        id: "google-my-business",
        name: "Google My Business",
        description: "Tener una ficha en Google es imprescindible, pero no es suficiente. Una web propia te da credibilidad y te permite explicar por qué eres la mejor opción.",
        comparison: {
          competitor: {
            title: "Solo con Google My Business",
            items: [
              "Espacio muy limitado para explicar tus servicios",
              "Diseño básico y sin personalidad de marca",
              "La competencia aparece sugerida en tu propia ficha",
              "No puedes tener un formulario de contacto propio"
            ]
          },
          novaweb: {
            title: "Con Nova Web (+ Google)",
            items: [
              "Muestras tu propuesta de valor completa",
              "Diseño que transmite confianza y profesionalidad",
              "El cliente se enfoca solo en ti",
              "Captas leads directamente a tu email"
            ]
          }
        }
      },
      {
        id: "wordpress",
        name: "WordPress",
        description: "WordPress es potente pero complejo. Requiere mantenimiento constante, plugins, actualizaciones y conocimientos técnicos.",
        comparison: {
          competitor: {
            title: "Con WordPress",
            items: [
              "Curva de aprendizaje alta",
              "Mantenimiento y actualizaciones constantes",
              "Riesgos de seguridad si no se actualiza",
              "Necesitas buscar hosting y dominio aparte"
            ]
          },
          novaweb: {
            title: "Con Nova Web",
            items: [
              "Lista en 5 minutos con IA",
              "Cero mantenimiento técnico",
              "Seguridad y hosting incluidos",
              "Editor visual fácil de usar"
            ]
          }
        }
      },
      {
        id: "wix",
        name: "Wix",
        description: "Wix te hace empezar desde cero con plantillas genéricas. Nova Web genera tu web con IA usando los datos reales de tu negocio.",
        comparison: {
          competitor: {
            title: "Con Wix",
            items: [
              "Empiezas con un lienzo en blanco",
              "Tienes que escribir todos los textos tú mismo",
              "Editor complejo de arrastrar y soltar",
              "Precios que suben al renovar"
            ]
          },
          novaweb: {
            title: "Con Nova Web",
            items: [
              "La IA escribe los textos por ti",
              "Diseño automático optimizado",
              "Edición simple como enviar un mensaje",
              "Precio único y transparente"
            ]
          }
        }
      },
      {
        id: "squarespace",
        name: "Squarespace",
        description: "Squarespace es bonito pero caro y pensado para diseñadores. Nova Web está pensado para dueños de negocios locales.",
        comparison: {
          competitor: {
            title: "Con Squarespace",
            items: [
              "Planes mensuales costosos",
              "Pensado para portfolios y diseñadores",
              "Curva de aprendizaje para que quede bien",
              "Soporte técnico en inglés"
            ]
          },
          novaweb: {
            title: "Con Nova Web",
            items: [
              "Precio accesible para negocios locales",
              "Enfocado en conseguir clientes",
              "No necesitas saber de diseño",
              "Soporte cercano"
            ]
          }
        }
      }
    ],
    pricing: {
      title: "Precios",
      subtitle: "Simple, flexible y asequible para negocios de cualquier tamaño.",
      billingLabel: "Facturación anual",
      saveLabel: "ahorra hasta un 22%",
      billedAnnuallyLabel: "Facturado anualmente",
      previousPriceLabel: "Antes",
      addonsTitle: "Complementos",
      includesTitle: "También incluye",
      tiers: [
        {
          name: "Esencial",
          id: "tier-starter",
          priceMonthly: "9€",
          priceYearly: "7€",
          annualTotal: "84€/año",
          period: "/mes",
          description: "Para publicar de forma puntual y validar tu presencia local.",
          cta: "Prueba 14 días",
          features: [
            { title: "1 Web activa", detail: "Hasta 10 secciones en la web." },
            { title: "15 ediciones/mes", detail: "Incluye cambios de texto e imagen." },
            { title: "1 usuario", detail: "Acceso para propietario del negocio." }
          ],
          addons: ["Sección extra 3€/mes", "Usuario extra 4€/mes"],
          includes: ["Dominio incluido", "SSL seguro", "Analítica básica"]
        },
        {
          name: "Impulso",
          id: "tier-pro",
          priceMonthly: "15€",
          priceYearly: "12€",
          annualTotal: "144€/año",
          period: "/mes",
          description: "Para equipos pequeños que publican y mejoran su web cada semana.",
          cta: "Prueba 14 días",
          features: [
            { title: "3 Webs activas", detail: "Hasta 15 secciones por cada web." },
            { title: "Ediciones ilimitadas", detail: "Asistente de contenido IA sin límites mensuales." },
            { title: "3 usuarios", detail: "Colabora con tu equipo de marketing." }
          ],
          addons: ["Sección extra 3€/mes", "Usuario extra 4€/mes"],
          includes: ["Todo Esencial", "SEO local", "Soporte prioritario"]
        },
        {
          name: "Equipo",
          id: "tier-agency",
          priceMonthly: "29€",
          priceYearly: "24€",
          annualTotal: "288€/año",
          period: "/mes",
          description: "Para negocios con varias líneas de servicio o varias sedes.",
          cta: "Prueba 14 días",
          secondaryCta: "Solicitar demo",
          features: [
            { title: "8 Webs activas", detail: "Control centralizado por marca o sede." },
            { title: "Ediciones ilimitadas", detail: "Flujo asistido con IA para equipos." },
            { title: "8 usuarios", detail: "Permisos por rol y revisiones internas." }
          ],
          addons: ["Web extra 5€/mes", "Usuario extra 4€/mes"],
          includes: ["Todo Impulso", "Reportes personalizados", "Calendario compartido"]
        },
        {
          name: "Expansión",
          id: "tier-scale",
          priceMonthly: "49€",
          priceYearly: "39€",
          annualTotal: "468€/año",
          period: "/mes",
          description: "Para negocios en crecimiento que quieren operar con más autonomía.",
          cta: "Prueba 14 días",
          secondaryCta: "Solicitar demo",
          features: [
            { title: "15 Webs activas", detail: "Gestión multi-sede y multi-marca." },
            { title: "Ediciones ilimitadas", detail: "Automatizaciones y flujos avanzados." },
            { title: "15 usuarios", detail: "Gobernanza y auditoría de cambios." }
          ],
          addons: ["Web extra 4€/mes", "Usuario extra 3€/mes"],
          includes: ["Todo Equipo", "Analítica avanzada", "Soporte dedicado"]
        }
      ]
    },
    comparison: {
      title: "Tu página de Facebook está bien. Pero\nGoogle no la muestra cuando alguien busca\ntu negocio.",
      cards: {
        facebook: {
          title: "Con solo Facebook",
          items: [
            "El algoritmo decide si te ve",
            "No apareces en Google Maps correctamente",
            "No tienes formulario de contacto tuyo",
            "Dependes de una red social que puede cambiar las reglas"
          ]
        },
        novaweb: {
          title: "Con tu web en novaweb",
          items: [
            "Apareces en Google cuando te buscan",
            "Recibes contactos directos en tu email",
            "Tu web te dura para siempre",
            "SEO optimizado automáticamente"
          ]
        }
      },
      caption: "Facebook es útil. (¡úsalo!) pero lo que convierte visitas en clientes."
    },
    aiDemo: {
      title: "¿Necesitas mejorar un texto o una oferta?\nLa IA te recomienda cambios para aplicarlos en tu editor visual.",
      assistantName: "Asistente de contenido IA",
      onlineStatus: "En línea",
      chat: [
        { type: "user", text: "Quiero destacar la promo de julio en portada" },
        { type: "system", text: "Recomendación: añade un bloque de oferta con CTA a WhatsApp." },
        { type: "user", text: "¿Qué titular me recomiendas para convertir más?" },
        { type: "system", text: "Propuesta: \"Promo de julio: reserva hoy y ahorra un 20%\"." },
        { type: "user", text: "¿Dónde lo coloco en la página?" },
        { type: "system", text: "Sugerencia: justo debajo del bloque de servicios para aumentar clics." }
      ],
      caption: "Editas tu web con un editor visual y usas la IA para optimizar textos, ofertas y estructura."
    },
    faq: {
      title: "Preguntas frecuentes",
      questions: [
        { q: "¿Necesito saber de informática?", a: "No, nuestra IA se encarga de todo el proceso técnico por ti." },
        { q: "¿Qué pasa si el cliente cancela?", a: "Puedes cancelar tu suscripción en cualquier momento sin penalizaciones." },
        { q: "¿Mi web aparecerá en Google?", a: "Sí, todas nuestras webs están optimizadas para SEO y aparecerán en los resultados de búsqueda." },
        { q: "¿Puedo usar mi propio dominio (.com)?", a: "Sí, puedes conectar tu propio dominio personalizado fácilmente." },
        { q: "¿Qué pasa si no me gusta cómo queda?", a: "Puedes regenerar el diseño tantas veces como quieras hasta que estés satisfecho." },
        { q: "¿Funciona para mi tipo de negocio?", a: "Nova Web está diseñado para adaptarse a cualquier tipo de negocio local, desde restaurantes hasta clínicas." }
      ]
    },
    finalCta: {
      title: "Tu web profesional te espera.",
      subtitle: "Créala ahora, gratis.",
      cta: "Empezar gratis →",
      trustText: "Sin tarjeta · Sin técnicos · Cancela cuando quieras"
    },
    footer: {
      logo: "Nova Web",
      links: ["Aviso legal", "Política de privacidad", "Política de cookies"],
      copyright: "© 2025 novaweb.es · Hecho con ♥ en Barcelona"
    }
  },
  ca: {
    navbar: {
      logo: "Nova Web",
      languages: "ES | CA",
      platformLabel: "Plataform",
      coreFeaturesLabel: "Característiques",
      coreFeatures: [
        { id: "generacion-ia", label: "Generació amb IA" },
        { id: "seo-local", label: "SEO local" },
        { id: "edicion-asistida", label: "Edició visual + IA" }
      ],
      cta: "Crear la meva web gratis →",
    },
    hero: {
      badge: "✦ Més de 1.000 negocis ja confien en nosaltres",
      titleLine1: "El teu negoci mereix una",
      titleLine2: "web professional.",
      titleLine3: "La tens llesta en 5 minuts.",
      subtitle: "La IA crea la teva web utilitzant les dades del teu negoci. Gratis per començar.",
      cta: "Crear la meva web gratis →",
      trustText: "Sense targeta · Sense tècnics · Cancel·la quan vulguis",
    },
    ticker: {
      businesses: [
        "💇 Perruqueries", "🍽 Restaurants", "🏋 Gimnasos", "💊 Farmàcies",
        "💅 Estètiques", "🐶 Veterinaris", "🦷 Dentistes", "📷 Fotògrafs",
        "🏘 Immobiliàries", "🔧 Tallers"
      ],
      text1: "Més de 1.200 negocis ja tenen la seva web amb novaweb",
      text2: "Hostal El Poble · Carles R Apunteria · Anni R Veterinària · Josep · Llibreria · Joana · Ofimac · Loli D Ofimac",
    },
    howItWorks: {
      title: "Així de fàcil funciona",
      subtitle: "Sense tècnics. Sense complicacions. En 3 passos tens la teva web llesta.",
      steps: [
        {
          number: "1",
          title: "Busca el teu negoci",
          description: "El nom del teu negoci i la IA el trobarà a Google. Les teves dades s'omplen soles.",
          mockup: {
            input: "Perruqueria Rosa – Barcelona",
            result: "Perruqueria Rosa · Carrer Gran Via, 42"
          }
        },
        {
          number: "2",
          title: "La IA crea la teva web",
          description: "En menys de 5 minuts, la IA dissenya una web completa amb els teus textos, serveis i fotos.",
          mockup: {
            title: "Crea la teva web",
            items: [
              "Textos generats",
              "Serveis afegits",
              "Imatges carregades..."
            ]
          }
        },
        {
          number: "3",
          title: "Publica-la i rep clients",
          description: "La teva web apareix a Google per als teus clients locals i els contactes arribaran directament.",
          mockup: {
            tag: "Web publicada",
            chat: "Hola, teniu cita disponible per dissabte?"
          }
        }
      ]
    },
    features: [
      {
        id: "generacion-ia",
        title: "Generació amb Intel·ligència Artificial",
        description: "Crea una web completa en segons utilitzant només el nom del teu negoci.",
        icon: "Sparkles",
        benefits: [
          "Textos persuasius generats automàticament",
          "Selecció d'imatges rellevants per al teu sector",
          "Estructura optimitzada per a conversió",
          "Disseny adaptat a la teva identitat visual"
        ]
      },
      {
        id: "seo-local",
        title: "Optimització SEO Local",
        description: "Apareix en els primers resultats quan els clients busquin els teus serveis a la teva zona.",
        icon: "MapPin",
        benefits: [
          "Metadades optimitzades automàticament",
          "Estructura d'URLs amigable",
          "Velocitat de càrrega ultraràpida",
          "Integració amb Google My Business"
        ]
      },
      {
        id: "edicion-asistida",
        title: "Edició visual amb ajuda de IA",
        description: "Edita la teva web amb un editor visual intuïtiu i usa la IA per rebre recomanacions de contingut.",
        icon: "MessageSquare",
        benefits: [
          "Canvis en temps real",
          "Sense coneixements tècnics requerits",
          "Actualització d'horaris i serveis a l'instant",
          "Suggeriments de millora continus"
        ]
      },
      {
        id: "formularios-contacto",
        title: "Captació de Clients",
        description: "Converteix visitants en clients amb formularis optimitzats i crides a l'acció clares.",
        icon: "Users",
        benefits: [
          "Formularis de contacte integrats",
          "Notificacions instantànies per email",
          "Botons de WhatsApp i trucada directa",
          "Disseny orientat a la conversió"
        ]
      },
      {
        id: "hosting-dominio",
        title: "Hàsting i Domini Inclosos",
        description: "Ens encarreguem de tota la part tècnica perquè tu et centris en el teu negoci.",
        icon: "Globe",
        benefits: [
          "Certificat SSL gratuït (HTTPS)",
          "Servidors ultraràpids i segurs",
          "Domini personalitzat disponible",
          "Còpies de seguretat automàtiques"
        ]
      }
    ],
    competitors: [
      {
        id: "facebook",
        name: "Facebook Pages",
        description: "Una pàgina de Facebook és útil per a xarxes socials, però no substitueix una web professional. L'algoritme decideix qui et veu i no apareixes bé a Google.",
        comparison: {
          competitor: {
            title: "Amb Facebook Pages",
            items: [
              "L'algoritme limita el teu abast orgànic",
              "No apareixes a les cerques de Google",
              "Disseny rígid igual al de la teva competència",
              "Els teus clients es distreuen amb altres publicacions"
            ]
          },
          novaweb: {
            title: "Amb Nova Web",
            items: [
              "Ets propietari de la teva presència online",
              "SEO local per aparèixer a Google",
              "Disseny professional i únic per a tu",
              "Sense distraccions, enfocat a vendre"
            ]
          }
        }
      },
      {
        id: "instagram",
        name: "Instagram",
        description: "Instagram és genial per a fotos, però pèssim per donar informació clara (horaris, serveis, preus) o captar clients a través de Google.",
        comparison: {
          competitor: {
            title: "Amb Instagram",
            items: [
              "Només pots posar un enllaç a la biografia",
              "Difícil trobar informació específica",
              "No indexa a Google per a cerques locals",
              "Depens d'una xarxa social de tercers"
            ]
          },
          novaweb: {
            title: "Amb Nova Web",
            items: [
              "Tota la teva informació estructurada i clara",
              "Formularis de contacte directes",
              "Apareixes quan busquen els teus serveis a Google",
              "La teva pròpia marca, les teves pròpies regles"
            ]
          }
        }
      },
      {
        id: "google-my-business",
        name: "Google My Business",
        description: "Tenir una fitxa a Google és imprescindible, però no és suficient. Una web pròpia et dóna credibilitat i et permet explicar per què ets la millor opció.",
        comparison: {
          competitor: {
            title: "Només amb Google My Business",
            items: [
              "Espai molt limitat per explicar els teus serveis",
              "Disseny bàsic i sense personalitat de marca",
              "La competència apareix suggerida a la teva pròpia fitxa",
              "No pots tenir un formulari de contacte propi"
            ]
          },
          novaweb: {
            title: "Amb Nova Web (+ Google)",
            items: [
              "Mostres la teva proposta de valor completa",
              "Disseny que transmet confiança i professionalitat",
              "El client s'enfoca només en tu",
              "Captes leads directament al teu email"
            ]
          }
        }
      },
      {
        id: "wordpress",
        name: "WordPress",
        description: "WordPress és potent però complex. Requereix manteniment constant, plugins, actualitzacions i coneixements tècnics.",
        comparison: {
          competitor: {
            title: "Amb WordPress",
            items: [
              "Corba d'aprenentatge alta",
              "Manteniment i actualitzacions constants",
              "Riscos de seguretat si no s'actualitza",
              "Necessites buscar hosting i domini a part"
            ]
          },
          novaweb: {
            title: "Amb Nova Web",
            items: [
              "Llesta en 5 minuts amb IA",
              "Zero manteniment tècnic",
              "Seguretat i hosting inclosos",
              "Editor visual fàcil d'usar"
            ]
          }
        }
      },
      {
        id: "wix",
        name: "Wix",
        description: "Wix et fa començar des de zero amb plantilles genèriques. Nova Web genera la teva web amb IA utilitzant les dades reals del teu negoci.",
        comparison: {
          competitor: {
            title: "Amb Wix",
            items: [
              "Comences amb un llenç en blanc",
              "Has d'escriure tots els textos tu mateix",
              "Editor complex d'arrossegar i deixar anar",
              "Preus que pugen en renovar"
            ]
          },
          novaweb: {
            title: "Amb Nova Web",
            items: [
              "La IA escriu els textos per tu",
              "Disseny automàtic optimitzat",
              "Edició simple com enviar un missatge",
              "Preu únic i transparent"
            ]
          }
        }
      },
      {
        id: "squarespace",
        name: "Squarespace",
        description: "Squarespace és bonic però car i pensat per a dissenyadors. Nova Web està pensat per a propietaris de negocis locals.",
        comparison: {
          competitor: {
            title: "Amb Squarespace",
            items: [
              "Plans mensuals costosos",
              "Pensat per a portfolios i dissenyadors",
              "Corba d'aprenentatge perquè quedi bé",
              "Suport tècnic en anglès"
            ]
          },
          novaweb: {
            title: "Amb Nova Web",
            items: [
              "Preu accessible per a negocis locals",
              "Enfocat a aconseguir clients",
              "No necessites saber de disseny",
              "Suport proper"
            ]
          }
        }
      }
    ],
    pricing: {
      title: "Preus",
      subtitle: "Simple, flexible i assequible per a negocis de qualsevol mida.",
      billingLabel: "Facturació anual",
      saveLabel: "estalvia fins a un 22%",
      billedAnnuallyLabel: "Facturat anualment",
      previousPriceLabel: "Abans",
      addonsTitle: "Complements",
      includesTitle: "També inclou",
      tiers: [
        {
          name: "Essencial",
          id: "tier-starter",
          priceMonthly: "9€",
          priceYearly: "7€",
          annualTotal: "84€/any",
          period: "/mes",
          description: "Per publicar de manera puntual i validar la teva presencia local.",
          cta: "Prova 14 dies",
          features: [
            { title: "1 Web activa", detail: "Fins a 10 seccions a la web." },
            { title: "15 edicions/mes", detail: "Inclou canvis de text i imatge." },
            { title: "1 usuari", detail: "Accés per al propietari del negoci." }
          ],
          addons: ["Secció extra 3€/mes", "Usuari extra 4€/mes"],
          includes: ["Domini inclòs", "SSL segur", "Analítica bàsica"]
        },
        {
          name: "Impuls",
          id: "tier-pro",
          priceMonthly: "15€",
          priceYearly: "12€",
          annualTotal: "144€/any",
          period: "/mes",
          description: "Per a equips petits que publiquen i milloren la web cada setmana.",
          cta: "Prova 14 dies",
          features: [
            { title: "3 Webs actives", detail: "Fins a 15 seccions per cada web." },
            { title: "Edicions il·limitades", detail: "Assistent de contingut IA sense límits mensuals." },
            { title: "3 usuaris", detail: "Col·labora amb l'equip de màrqueting." }
          ],
          addons: ["Secció extra 3€/mes", "Usuari extra 4€/mes"],
          includes: ["Tot Essencial", "SEO local", "Suport prioritari"]
        },
        {
          name: "Equip",
          id: "tier-agency",
          priceMonthly: "29€",
          priceYearly: "24€",
          annualTotal: "288€/any",
          period: "/mes",
          description: "Per a negocis amb diverses línies de servei o diverses seus.",
          cta: "Prova 14 dies",
          secondaryCta: "Sol·licitar demo",
          features: [
            { title: "8 Webs actives", detail: "Control centralitzat per marca o seu." },
            { title: "Edicions il·limitades", detail: "Flux assistit amb IA per equips." },
            { title: "8 usuaris", detail: "Permisos per rol i revisions internes." }
          ],
          addons: ["Web extra 5€/mes", "Usuari extra 4€/mes"],
          includes: ["Tot Impuls", "Informes personalitzats", "Calendari compartit"]
        },
        {
          name: "Expansió",
          id: "tier-scale",
          priceMonthly: "49€",
          priceYearly: "39€",
          annualTotal: "468€/any",
          period: "/mes",
          description: "Per a negocis en creixement que volen operar amb més autonomia.",
          cta: "Prova 14 dies",
          secondaryCta: "Sol·licitar demo",
          features: [
            { title: "15 Webs actives", detail: "Gestió multi-seu i multi-marca." },
            { title: "Edicions il·limitades", detail: "Automatitzacions i fluxos avançats." },
            { title: "15 usuaris", detail: "Governança i auditoria de canvis." }
          ],
          addons: ["Web extra 4€/mes", "Usuari extra 3€/mes"],
          includes: ["Tot Equip", "Analítica avançada", "Suport dedicat"]
        }
      ]
    },
    comparison: {
      title: "La teva pàgina de Facebook està bé. Però\nGoogle no la mostra quan algú busca\nel teu negoci.",
      cards: {
        facebook: {
          title: "Només amb Facebook",
          items: [
            "L'algoritme decideix si et veu",
            "No apareixes a Google Maps correctament",
            "No tens formulari de contacte teu",
            "Depens d'una xarxa social que pot canviar les regles"
          ]
        },
        novaweb: {
          title: "Amb la teva web a novaweb",
          items: [
            "Apareixes a Google quan et busquen",
            "Reps contactes directes al teu email",
            "La teva web et dura per sempre",
            "SEO optimitzat automàticament"
          ]
        }
      },
      caption: "Facebook és útil. (fes-lo servir!) però el que converteix visites en clients és una web."
    },
    aiDemo: {
      title: "Necessites millorar un text o una oferta?\nLa IA et recomana canvis per aplicar-los al teu editor visual.",
      assistantName: "Assistent de contingut IA",
      onlineStatus: "En línia",
      chat: [
        { type: "user", text: "Vull destacar la promo de juliol a portada" },
        { type: "system", text: "Recomanació: afegeix un bloc d'oferta amb CTA a WhatsApp." },
        { type: "user", text: "Quin titular em recomanes per convertir més?" },
        { type: "system", text: "Proposta: \"Promo de juliol: reserva avui i estalvia un 20%\"." },
        { type: "user", text: "On ho col·loco a la pàgina?" },
        { type: "system", text: "Suggeriment: just sota el bloc de serveis per augmentar clics." }
      ],
      caption: "Edits la teva web amb un editor visual i uses la IA per optimitzar textos, ofertes i estructura."
    },
    faq: {
      title: "Preguntes freqüents",
      questions: [
        { q: "Necessito saber d'informàtica?", a: "No, la nostra IA s'encarrega de tot el procés tècnic per tu." },
        { q: "Què passa si el client cancel·la?", a: "Pots cancel·lar la teva subscripció en qualsevol moment sense penalitzacions." },
        { q: "La meva web apareixerà a Google?", a: "Sí, totes les nostres webs estan optimitzades per a SEO i apareixeran als resultats de cerca." },
        { q: "Puc utilitzar el meu propi domini (.com)?", a: "Sí, pots connectar el teu propi domini personalitzat fàcilment." },
        { q: "Què passa si no m'agrada com queda?", a: "Pots regenerar el disseny tantes vegades com vulguis fins que estiguis satisfet." },
        { q: "Funciona per al meu tipus de negoci?", a: "Nova Web està dissenyat per adaptar-se a qualsevol tipus de negoci local, des de restaurants fins a clíniques." }
      ]
    },
    finalCta: {
      title: "La teva web professional t'espera.",
      subtitle: "Crea-la ara, gratis.",
      cta: "Començar gratis →",
      trustText: "Sense targeta · Sense tècnics · Cancel·la quan vulguis"
    },
    footer: {
      logo: "Nova Web",
      links: ["Avís legal", "Política de privacitat", "Política de cookies"],
      copyright: "© 2025 novaweb.es · Fet amb ♥ a Barcelona"
    }
  }
};
