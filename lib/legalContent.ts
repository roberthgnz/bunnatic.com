export type LegalLocale = 'es' | 'ca'
export type LegalPageKey =
  | 'aviso-legal'
  | 'politica-privacidad'
  | 'politica-cookies'

type LegalSection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

type LegalPageContent = {
  title: string
  lastUpdatedLabel: string
  lastUpdatedDate: string
  intro: string
  sections: LegalSection[]
}

export const legalContent: Record<
  LegalLocale,
  Record<LegalPageKey, LegalPageContent>
> = {
  es: {
    'aviso-legal': {
      title: 'Aviso legal',
      lastUpdatedLabel: 'Última actualización',
      lastUpdatedDate: '10 de marzo de 2026',
      intro:
        'Este sitio web pertenece a Locavo y regula el acceso y uso de nuestra plataforma para crear páginas web con ayuda de inteligencia artificial.',
      sections: [
        {
          title: '1. Titular del sitio',
          paragraphs: [
            'Titular: Locavo.',
            'Sitio web: locavo.com.',
            'Contacto general: hello@locavo.com.',
          ],
        },
        {
          title: '2. Objeto',
          paragraphs: [
            'El presente aviso legal regula el acceso, navegación y uso de este sitio web, así como las responsabilidades derivadas de la utilización de sus contenidos y servicios.',
          ],
        },
        {
          title: '3. Condiciones de uso',
          paragraphs: [
            'El usuario se compromete a utilizar el sitio de forma lícita, diligente y respetuosa con la normativa vigente.',
            'Queda prohibido usar los servicios para actividades fraudulentas, suplantación de identidad o cualquier uso que pueda dañar a terceros o a Locavo.',
          ],
        },
        {
          title: '4. Propiedad intelectual e industrial',
          paragraphs: [
            'Los textos, diseños, logotipos, código, interfaces, imágenes y demás elementos del sitio son titularidad de Locavo o de terceros autorizados.',
            'No se permite su reproducción, distribución o transformación sin autorización previa y expresa.',
          ],
        },
        {
          title: '5. Responsabilidad',
          paragraphs: [
            'Locavo trabaja para mantener el servicio actualizado y disponible, pero no garantiza la ausencia total de interrupciones o errores técnicos.',
            'El usuario es responsable del uso que haga de la información publicada y de los contenidos que cree o publique mediante la plataforma.',
          ],
        },
        {
          title: '6. Enlaces externos',
          paragraphs: [
            'Este sitio puede incluir enlaces a servicios de terceros. Locavo no controla ni asume responsabilidad sobre sus contenidos, políticas o disponibilidad.',
          ],
        },
        {
          title: '7. Legislación y jurisdicción',
          paragraphs: [
            'Este aviso legal se rige por la legislación española.',
            'Para cualquier conflicto, las partes se someterán a los juzgados y tribunales de Barcelona, salvo que la normativa de consumidores establezca otro fuero obligatorio.',
          ],
        },
      ],
    },
    'politica-privacidad': {
      title: 'Política de privacidad',
      lastUpdatedLabel: 'Última actualización',
      lastUpdatedDate: '10 de marzo de 2026',
      intro:
        'En Locavo tratamos los datos personales de forma transparente y conforme al Reglamento (UE) 2016/679 (RGPD) y la normativa aplicable.',
      sections: [
        {
          title: '1. Datos que tratamos',
          paragraphs: [
            'Podemos tratar los siguientes datos cuando usas Locavo:',
          ],
          bullets: [
            'Datos de registro: nombre, correo electrónico y credenciales de acceso.',
            'Datos de negocio: nombre comercial, dirección, teléfono, horarios, categoría y contenido que el usuario aporte o confirme.',
            'Datos técnicos: IP, dispositivo, navegador, logs básicos y métricas de uso.',
          ],
        },
        {
          title: '2. Finalidades del tratamiento',
          paragraphs: ['Usamos los datos para:'],
          bullets: [
            'Prestar el servicio de creación y edición web con IA.',
            'Gestionar la cuenta del usuario y la autenticación.',
            'Enviar comunicaciones operativas relacionadas con el servicio.',
            'Mejorar calidad, seguridad y rendimiento de la plataforma.',
          ],
        },
        {
          title: '3. Base jurídica',
          paragraphs: [
            'La base legal del tratamiento es la ejecución del contrato de servicio, el cumplimiento de obligaciones legales y, cuando proceda, el consentimiento del usuario.',
          ],
        },
        {
          title: '4. Conservación',
          paragraphs: [
            'Conservamos los datos mientras exista relación contractual y durante los plazos legales exigibles para atender obligaciones administrativas, fiscales o de seguridad.',
          ],
        },
        {
          title: '5. Destinatarios y encargados',
          paragraphs: [
            'Podemos trabajar con proveedores tecnológicos (hosting, analítica, correo, pagos o infraestructura) bajo contratos que garantizan confidencialidad y cumplimiento normativo.',
            'No vendemos datos personales a terceros.',
          ],
        },
        {
          title: '6. Derechos del usuario',
          paragraphs: [
            'Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando una solicitud a privacy@locavo.com.',
            'Si consideras que tus derechos no se han atendido correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).',
          ],
        },
        {
          title: '7. Seguridad',
          paragraphs: [
            'Aplicamos medidas técnicas y organizativas razonables para proteger la confidencialidad, integridad y disponibilidad de la información.',
          ],
        },
      ],
    },
    'politica-cookies': {
      title: 'Política de cookies',
      lastUpdatedLabel: 'Última actualización',
      lastUpdatedDate: '11 de marzo de 2026',
      intro:
        'Esta política explica qué cookies utiliza Locavo, con qué finalidad y cómo puedes aceptar, rechazar o revocar su uso.',
      sections: [
        {
          title: '1. Qué son las cookies',
          paragraphs: [
            'Las cookies son pequeños archivos que se almacenan en tu dispositivo cuando visitas una web y que permiten recordar información sobre tu navegación.',
          ],
        },
        {
          title: '2. Tipos de cookies que utilizamos',
          paragraphs: [
            'Actualmente en Locavo utilizamos o podemos utilizar las siguientes categorías de cookies:',
          ],
          bullets: [
            'Cookies técnicas o estrictamente necesarias: permiten funciones esenciales como la navegación, la seguridad, el acceso a áreas autenticadas y el funcionamiento básico del sitio.',
            'Cookies de preferencias: recuerdan determinadas elecciones del usuario, como el idioma o algunos ajustes de interfaz.',
            'Cookies de consentimiento: guardan tu decisión sobre el uso de cookies para no volver a mostrarte el banner en cada visita.',
            'Cookies analíticas: solo se activan si las aceptas y nos ayudan a medir el uso del sitio para mejorarlo.',
          ],
        },
        {
          title: '3. Base legal',
          paragraphs: [
            'Las cookies técnicas y las cookies necesarias para recordar tu decisión sobre el consentimiento se utilizan porque son necesarias para prestar el servicio y gestionar el cumplimiento normativo.',
            'Las cookies analíticas y cualquier otra cookie no necesaria solo se activarán si prestas tu consentimiento previo, libre, específico e informado.',
          ],
        },
        {
          title: '4. Cookies analíticas de terceros',
          paragraphs: [
            'Si aceptas las cookies analíticas, Locavo puede utilizar Google Analytics, un servicio prestado por Google, para obtener estadísticas agregadas sobre navegación, uso de páginas y rendimiento del sitio.',
            'Estas cookies pueden recoger información como páginas visitadas, tiempo de permanencia, navegador, dispositivo y direcciones IP tratadas conforme a la configuración aplicada por el servicio.',
          ],
        },
        {
          title: '5. Conservación',
          paragraphs: [
            'La cookie que recuerda tu elección de consentimiento se conserva durante un plazo limitado, actualmente de hasta 180 días, salvo que la elimines antes desde tu navegador.',
            'La duración concreta de las cookies de terceros, como las de Google Analytics, depende de la configuración del proveedor y puede variar con el tiempo.',
          ],
        },
        {
          title: '6. Configuración y revocación',
          paragraphs: [
            'Puedes aceptar, rechazar o configurar el uso de cookies desde el banner de consentimiento del sitio. También puedes volver a cambiar tu decisión en cualquier momento desde la opción de configuración de cookies disponible en la web.',
            'Además, puedes eliminar cookies o bloquearlas desde la configuración de tu navegador. La desactivación de cookies técnicas puede afectar al correcto funcionamiento de determinadas funcionalidades.',
          ],
        },
        {
          title: '7. Más información y contacto',
          paragraphs: [
            'Si tienes dudas sobre esta política, puedes escribir a privacy@locavo.com.',
            'Para obtener más información sobre el tratamiento de datos personales relacionado con el uso de cookies, puedes consultar también nuestra Política de Privacidad.',
          ],
        },
      ],
    },
  },
  ca: {
    'aviso-legal': {
      title: 'Avis legal',
      lastUpdatedLabel: 'Ultima actualitzacio',
      lastUpdatedDate: '10 de marc de 2026',
      intro:
        "Aquest lloc web pertany a Locavo i regula l'acces i us de la nostra plataforma per crear pagines web amb ajuda d'intelligencia artificial.",
      sections: [
        {
          title: '1. Titular del lloc',
          paragraphs: [
            'Titular: Locavo.',
            'Lloc web: locavo.com.',
            'Contacte general: hello@locavo.com.',
          ],
        },
        {
          title: '2. Objecte',
          paragraphs: [
            "Aquest avis legal regula l'acces, la navegacio i l'us d'aquest lloc web, aixi com les responsabilitats derivades de la utilitzacio dels seus continguts i serveis.",
          ],
        },
        {
          title: "3. Condicions d'us",
          paragraphs: [
            "L'usuari es compromet a utilitzar el lloc de forma licita, diligent i respectuosa amb la normativa vigent.",
            "Queda prohibit utilitzar els serveis per a activitats fraudulentes, suplantacio d'identitat o qualsevol us que pugui perjudicar tercers o Locavo.",
          ],
        },
        {
          title: '4. Propietat intellectual i industrial',
          paragraphs: [
            "Els textos, dissenys, logotips, codi, interficies, imatges i la resta d'elements del lloc son titularitat de Locavo o de tercers autoritzats.",
            'No es permet la reproduccio, distribucio o transformacio sense autoritzacio previa i expressa.',
          ],
        },
        {
          title: '5. Responsabilitat',
          paragraphs: [
            "Locavo treballa per mantenir el servei actualitzat i disponible, pero no garanteix l'absencia total d'interrupcions o errors tecnics.",
            "L'usuari es responsable de l'us que faci de la informacio publicada i dels continguts que crei o publiqui mitjancant la plataforma.",
          ],
        },
        {
          title: '6. Enllacos externs',
          paragraphs: [
            'Aquest lloc pot incloure enllacos a serveis de tercers. Locavo no controla ni assumeix responsabilitat sobre els seus continguts, politiques o disponibilitat.',
          ],
        },
        {
          title: '7. Legislacio i jurisdiccio',
          paragraphs: [
            'Aquest avis legal es regeix per la legislacio espanyola.',
            'Per a qualsevol conflicte, les parts se sotmetran als jutjats i tribunals de Barcelona, excepte si la normativa de consumidors estableix un altre fur obligatori.',
          ],
        },
      ],
    },
    'politica-privacidad': {
      title: 'Politica de privacitat',
      lastUpdatedLabel: 'Ultima actualitzacio',
      lastUpdatedDate: '10 de marc de 2026',
      intro:
        "A Locavo tractem les dades personals de manera transparent i d'acord amb el Reglament (UE) 2016/679 (RGPD) i la normativa aplicable.",
      sections: [
        {
          title: '1. Dades que tractem',
          paragraphs: [
            'Podem tractar les dades seguents quan utilitzes Locavo:',
          ],
          bullets: [
            "Dades de registre: nom, correu electronic i credencials d'acces.",
            "Dades del negoci: nom comercial, adreca, telefon, horaris, categoria i contingut que l'usuari aporti o confirmi.",
            "Dades tecniques: IP, dispositiu, navegador, logs basics i metriques d'us.",
          ],
        },
        {
          title: '2. Finalitats del tractament',
          paragraphs: ['Fem servir les dades per a:'],
          bullets: [
            'Prestar el servei de creacio i edicio web amb IA.',
            "Gestionar el compte de l'usuari i l'autenticacio.",
            'Enviar comunicacions operatives relacionades amb el servei.',
            'Millorar la qualitat, la seguretat i el rendiment de la plataforma.',
          ],
        },
        {
          title: '3. Base juridica',
          paragraphs: [
            "La base legal del tractament es l'execucio del contracte de servei, el compliment d'obligacions legals i, quan sigui procedent, el consentiment de l'usuari.",
          ],
        },
        {
          title: '4. Conservacio',
          paragraphs: [
            'Conservem les dades mentre existeixi relacio contractual i durant els terminis legals exigibles per atendre obligacions administratives, fiscals o de seguretat.',
          ],
        },
        {
          title: '5. Destinataris i encarregats',
          paragraphs: [
            'Podem treballar amb proveidors tecnologics (hosting, analitica, correu, pagaments o infraestructura) sota contractes que garanteixen confidencialitat i compliment normatiu.',
            'No venem dades personals a tercers.',
          ],
        },
        {
          title: "6. Drets de l'usuari",
          paragraphs: [
            "Pots exercir els teus drets d'acces, rectificacio, supressio, oposicio, limitacio i portabilitat enviant una sollicitud a privacy@locavo.com.",
            "Si consideres que els teus drets no s'han ates correctament, pots presentar una reclamacio davant l'Agencia Espanyola de Proteccio de Dades (AEPD).",
          ],
        },
        {
          title: '7. Seguretat',
          paragraphs: [
            'Apliquem mesures tecniques i organitzatives raonables per protegir la confidencialitat, integritat i disponibilitat de la informacio.',
          ],
        },
      ],
    },
    'politica-cookies': {
      title: 'Politica de cookies',
      lastUpdatedLabel: 'Ultima actualitzacio',
      lastUpdatedDate: '11 de marc de 2026',
      intro:
        "Aquesta politica explica quines cookies utilitza Locavo, amb quina finalitat i com pots acceptar-ne, rebutjar-ne o revocar-ne l'us.",
      sections: [
        {
          title: '1. Que son les cookies',
          paragraphs: [
            "Les cookies son petits fitxers que s'emmagatzemen al teu dispositiu quan visites una web i que permeten recordar informacio sobre la teva navegacio.",
          ],
        },
        {
          title: '2. Tipus de cookies que utilitzem',
          paragraphs: [
            'Actualment a Locavo utilitzem o podem utilitzar les categories de cookies seguents:',
          ],
          bullets: [
            "Cookies tecniques o estrictament necessaries: permeten funcions essencials com la navegacio, la seguretat, l'acces a arees autenticades i el funcionament basic del lloc.",
            "Cookies de preferences: recorden determinades eleccions de l'usuari, com ara l'idioma o alguns ajustos d'interficie.",
            "Cookies de consentiment: desen la teva decisio sobre l'us de cookies per no tornar-te a mostrar el banner a cada visita.",
            "Cookies analitiques: nomes s'activen si les acceptes i ens ajuden a mesurar l'us del lloc per millorar-lo.",
          ],
        },
        {
          title: '3. Base legal',
          paragraphs: [
            "Les cookies tecniques i les cookies necessaries per recordar la teva decisio sobre el consentiment s'utilitzen perque son necessaries per prestar el servei i gestionar el compliment normatiu.",
            "Les cookies analitiques i qualsevol altra cookie no necessaria nomes s'activaran si dones el teu consentiment previ, lliure, especific i informat.",
          ],
        },
        {
          title: '4. Cookies analitiques de tercers',
          paragraphs: [
            'Si acceptes les cookies analitiques, Locavo pot utilitzar Google Analytics, un servei prestat per Google, per obtenir estadistiques agregades sobre navegacio, us de pagines i rendiment del lloc.',
            "Aquestes cookies poden recollir informacio com les pagines visitades, el temps de permanencia, el navegador, el dispositiu i adreces IP tractades d'acord amb la configuracio aplicada pel servei.",
          ],
        },
        {
          title: '5. Conservacio',
          paragraphs: [
            "La cookie que recorda la teva eleccio de consentiment es conserva durant un termini limitat, actualment de fins a 180 dies, llevat que l'eliminis abans des del navegador.",
            'La durada concreta de les cookies de tercers, com ara les de Google Analytics, depen de la configuracio del proveidor i pot variar amb el temps.',
          ],
        },
        {
          title: '6. Configuracio i revocacio',
          paragraphs: [
            "Pots acceptar, rebutjar o configurar l'us de cookies des del banner de consentiment del lloc. Tambe pots tornar a canviar la teva decisio en qualsevol moment des de l'opcio de configuracio de cookies disponible al web.",
            'A mes, pots eliminar cookies o bloquejar-les des de la configuracio del navegador. La desactivacio de cookies tecniques pot afectar el funcionament correcte de determinades funcionalitats.',
          ],
        },
        {
          title: '7. Mes informacio i contacte',
          paragraphs: [
            'Si tens dubtes sobre aquesta politica, pots escriure a privacy@locavo.com.',
            "Per obtenir mes informacio sobre el tractament de dades personals relacionat amb l'us de cookies, pots consultar tambe la nostra Politica de Privacitat.",
          ],
        },
      ],
    },
  },
}
