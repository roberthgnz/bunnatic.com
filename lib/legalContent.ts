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
      lastUpdatedLabel: 'Ultima actualizacion',
      lastUpdatedDate: '10 de marzo de 2026',
      intro:
        'Este sitio web pertenece a Bunnatic y regula el acceso y uso de nuestra plataforma para crear paginas web con ayuda de inteligencia artificial.',
      sections: [
        {
          title: '1. Titular del sitio',
          paragraphs: [
            'Titular: Bunnatic.',
            'Sitio web: bunnatic.com.',
            'Contacto general: hello@bunnatic.com.',
          ],
        },
        {
          title: '2. Objeto',
          paragraphs: [
            'El presente aviso legal regula el acceso, navegacion y uso de este sitio web, asi como las responsabilidades derivadas de la utilizacion de sus contenidos y servicios.',
          ],
        },
        {
          title: '3. Condiciones de uso',
          paragraphs: [
            'El usuario se compromete a utilizar el sitio de forma licita, diligente y respetuosa con la normativa vigente.',
            'Queda prohibido usar los servicios para actividades fraudulentas, suplantacion de identidad o cualquier uso que pueda dañar a terceros o a Bunnatic.',
          ],
        },
        {
          title: '4. Propiedad intelectual e industrial',
          paragraphs: [
            'Los textos, diseños, logotipos, codigo, interfaces, imagenes y demas elementos del sitio son titularidad de Bunnatic o de terceros autorizados.',
            'No se permite su reproduccion, distribucion o transformacion sin autorizacion previa y expresa.',
          ],
        },
        {
          title: '5. Responsabilidad',
          paragraphs: [
            'Bunnatic trabaja para mantener el servicio actualizado y disponible, pero no garantiza la ausencia total de interrupciones o errores tecnicos.',
            'El usuario es responsable del uso que haga de la informacion publicada y de los contenidos que cree o publique mediante la plataforma.',
          ],
        },
        {
          title: '6. Enlaces externos',
          paragraphs: [
            'Este sitio puede incluir enlaces a servicios de terceros. Bunnatic no controla ni asume responsabilidad sobre sus contenidos, politicas o disponibilidad.',
          ],
        },
        {
          title: '7. Legislacion y jurisdiccion',
          paragraphs: [
            'Este aviso legal se rige por la legislacion española.',
            'Para cualquier conflicto, las partes se someteran a los juzgados y tribunales de Barcelona, salvo que la normativa de consumidores establezca otro fuero obligatorio.',
          ],
        },
      ],
    },
    'politica-privacidad': {
      title: 'Politica de privacidad',
      lastUpdatedLabel: 'Ultima actualizacion',
      lastUpdatedDate: '10 de marzo de 2026',
      intro:
        'En Bunnatic tratamos los datos personales de forma transparente y conforme al Reglamento (UE) 2016/679 (RGPD) y la normativa aplicable.',
      sections: [
        {
          title: '1. Datos que tratamos',
          paragraphs: [
            'Podemos tratar los siguientes datos cuando usas Bunnatic:',
          ],
          bullets: [
            'Datos de registro: nombre, correo electronico y credenciales de acceso.',
            'Datos de negocio: nombre comercial, direccion, telefono, horarios, categoria y contenido que el usuario aporte o confirme.',
            'Datos tecnicos: IP, dispositivo, navegador, logs basicos y metricas de uso.',
          ],
        },
        {
          title: '2. Finalidades del tratamiento',
          paragraphs: ['Usamos los datos para:'],
          bullets: [
            'Prestar el servicio de creacion y edicion web con IA.',
            'Gestionar la cuenta del usuario y la autenticacion.',
            'Enviar comunicaciones operativas relacionadas con el servicio.',
            'Mejorar calidad, seguridad y rendimiento de la plataforma.',
          ],
        },
        {
          title: '3. Base juridica',
          paragraphs: [
            'La base legal del tratamiento es la ejecucion del contrato de servicio, el cumplimiento de obligaciones legales y, cuando proceda, el consentimiento del usuario.',
          ],
        },
        {
          title: '4. Conservacion',
          paragraphs: [
            'Conservamos los datos mientras exista relacion contractual y durante los plazos legales exigibles para atender obligaciones administrativas, fiscales o de seguridad.',
          ],
        },
        {
          title: '5. Destinatarios y encargados',
          paragraphs: [
            'Podemos trabajar con proveedores tecnologicos (hosting, analitica, correo, pagos o infraestructura) bajo contratos que garantizan confidencialidad y cumplimiento normativo.',
            'No vendemos datos personales a terceros.',
          ],
        },
        {
          title: '6. Derechos del usuario',
          paragraphs: [
            'Puedes ejercer tus derechos de acceso, rectificacion, supresion, oposicion, limitacion y portabilidad enviando una solicitud a privacy@bunnatic.com.',
            'Si consideras que tus derechos no se han atendido correctamente, puedes presentar una reclamacion ante la Agencia Española de Proteccion de Datos (AEPD).',
          ],
        },
        {
          title: '7. Seguridad',
          paragraphs: [
            'Aplicamos medidas tecnicas y organizativas razonables para proteger la confidencialidad, integridad y disponibilidad de la informacion.',
          ],
        },
      ],
    },
    'politica-cookies': {
      title: 'Politica de cookies',
      lastUpdatedLabel: 'Ultima actualizacion',
      lastUpdatedDate: '11 de marzo de 2026',
      intro:
        'Esta politica explica que cookies utiliza Bunnatic, con que finalidad y como puedes aceptar, rechazar o revocar su uso.',
      sections: [
        {
          title: '1. Que son las cookies',
          paragraphs: [
            'Las cookies son pequeños archivos que se almacenan en tu dispositivo cuando visitas una web y que permiten recordar informacion sobre tu navegacion.',
          ],
        },
        {
          title: '2. Tipos de cookies que utilizamos',
          paragraphs: [
            'Actualmente en Bunnatic utilizamos o podemos utilizar las siguientes categorias de cookies:',
          ],
          bullets: [
            'Cookies tecnicas o estrictamente necesarias: permiten funciones esenciales como la navegacion, la seguridad, el acceso a areas autenticadas y el funcionamiento basico del sitio.',
            'Cookies de preferencias: recuerdan determinadas elecciones del usuario, como el idioma o algunos ajustes de interfaz.',
            'Cookies de consentimiento: guardan tu decision sobre el uso de cookies para no volver a mostrarte el banner en cada visita.',
            'Cookies analiticas: solo se activan si las aceptas y nos ayudan a medir el uso del sitio para mejorarlo.',
          ],
        },
        {
          title: '3. Base legal',
          paragraphs: [
            'Las cookies tecnicas y las cookies necesarias para recordar tu decision sobre el consentimiento se utilizan porque son necesarias para prestar el servicio y gestionar el cumplimiento normativo.',
            'Las cookies analiticas y cualquier otra cookie no necesaria solo se activaran si prestas tu consentimiento previo, libre, especifico e informado.',
          ],
        },
        {
          title: '4. Cookies analiticas de terceros',
          paragraphs: [
            'Si aceptas las cookies analiticas, Bunnatic puede utilizar Google Analytics, un servicio prestado por Google, para obtener estadisticas agregadas sobre navegacion, uso de paginas y rendimiento del sitio.',
            'Estas cookies pueden recoger informacion como paginas visitadas, tiempo de permanencia, navegador, dispositivo y direcciones IP tratadas conforme a la configuracion aplicada por el servicio.',
          ],
        },
        {
          title: '5. Conservacion',
          paragraphs: [
            'La cookie que recuerda tu eleccion de consentimiento se conserva durante un plazo limitado, actualmente de hasta 180 dias, salvo que la elimines antes desde tu navegador.',
            'La duracion concreta de las cookies de terceros, como las de Google Analytics, depende de la configuracion del proveedor y puede variar con el tiempo.',
          ],
        },
        {
          title: '6. Configuracion y revocacion',
          paragraphs: [
            'Puedes aceptar, rechazar o configurar el uso de cookies desde el banner de consentimiento del sitio. Tambien puedes volver a cambiar tu decision en cualquier momento desde la opcion de configuracion de cookies disponible en la web.',
            'Ademas, puedes eliminar cookies o bloquearlas desde la configuracion de tu navegador. La desactivacion de cookies tecnicas puede afectar al correcto funcionamiento de determinadas funcionalidades.',
          ],
        },
        {
          title: '7. Mas informacion y contacto',
          paragraphs: [
            'Si tienes dudas sobre esta politica, puedes escribir a privacy@bunnatic.com.',
            'Para obtener mas informacion sobre el tratamiento de datos personales relacionado con el uso de cookies, puedes consultar tambien nuestra Politica de Privacidad.',
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
        "Aquest lloc web pertany a Bunnatic i regula l'acces i us de la nostra plataforma per crear pagines web amb ajuda d'intelligencia artificial.",
      sections: [
        {
          title: '1. Titular del lloc',
          paragraphs: [
            'Titular: Bunnatic.',
            'Lloc web: bunnatic.com.',
            'Contacte general: hello@bunnatic.com.',
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
            "Queda prohibit utilitzar els serveis per a activitats fraudulentes, suplantacio d'identitat o qualsevol us que pugui perjudicar tercers o Bunnatic.",
          ],
        },
        {
          title: '4. Propietat intellectual i industrial',
          paragraphs: [
            "Els textos, dissenys, logotips, codi, interficies, imatges i la resta d'elements del lloc son titularitat de Bunnatic o de tercers autoritzats.",
            'No es permet la reproduccio, distribucio o transformacio sense autoritzacio previa i expressa.',
          ],
        },
        {
          title: '5. Responsabilitat',
          paragraphs: [
            "Bunnatic treballa per mantenir el servei actualitzat i disponible, pero no garanteix l'absencia total d'interrupcions o errors tecnics.",
            "L'usuari es responsable de l'us que faci de la informacio publicada i dels continguts que crei o publiqui mitjancant la plataforma.",
          ],
        },
        {
          title: '6. Enllacos externs',
          paragraphs: [
            'Aquest lloc pot incloure enllacos a serveis de tercers. Bunnatic no controla ni assumeix responsabilitat sobre els seus continguts, politiques o disponibilitat.',
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
        "A Bunnatic tractem les dades personals de manera transparent i d'acord amb el Reglament (UE) 2016/679 (RGPD) i la normativa aplicable.",
      sections: [
        {
          title: '1. Dades que tractem',
          paragraphs: [
            'Podem tractar les dades seguents quan utilitzes Bunnatic:',
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
            "Pots exercir els teus drets d'acces, rectificacio, supressio, oposicio, limitacio i portabilitat enviant una sollicitud a privacy@bunnatic.com.",
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
        "Aquesta politica explica quines cookies utilitza Bunnatic, amb quina finalitat i com pots acceptar-ne, rebutjar-ne o revocar-ne l'us.",
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
            'Actualment a Bunnatic utilitzem o podem utilitzar les categories de cookies seguents:',
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
            'Si acceptes les cookies analitiques, Bunnatic pot utilitzar Google Analytics, un servei prestat per Google, per obtenir estadistiques agregades sobre navegacio, us de pagines i rendiment del lloc.',
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
            'Si tens dubtes sobre aquesta politica, pots escriure a privacy@bunnatic.com.',
            "Per obtenir mes informacio sobre el tractament de dades personals relacionat amb l'us de cookies, pots consultar tambe la nostra Politica de Privacitat.",
          ],
        },
      ],
    },
  },
}
