export type LegalLocale = "es" | "ca";
export type LegalPageKey = "aviso-legal" | "politica-privacidad" | "politica-cookies";

type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageContent = {
  title: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  intro: string;
  sections: LegalSection[];
};

export const legalContent: Record<LegalLocale, Record<LegalPageKey, LegalPageContent>> = {
  es: {
    "aviso-legal": {
      title: "Aviso legal",
      lastUpdatedLabel: "Última actualización",
      lastUpdatedDate: "10 de marzo de 2026",
      intro:
        "Este sitio web pertenece a Wibloz y regula el acceso y uso de nuestra plataforma para crear páginas web con ayuda de inteligencia artificial.",
      sections: [
        {
          title: "1. Titular del sitio",
          paragraphs: [
            "Titular: Wibloz.",
            "Sitio web: wibloz.com.",
            "Contacto general: hola@wibloz.com.",
          ],
        },
        {
          title: "2. Objeto",
          paragraphs: [
            "El presente aviso legal regula el acceso, navegación y uso de este sitio web, así como las responsabilidades derivadas de la utilización de sus contenidos y servicios.",
          ],
        },
        {
          title: "3. Condiciones de uso",
          paragraphs: [
            "El usuario se compromete a utilizar el sitio de forma lícita, diligente y respetuosa con la normativa vigente.",
            "Queda prohibido usar los servicios para actividades fraudulentas, suplantación de identidad o cualquier uso que pueda dañar a terceros o a Wibloz.",
          ],
        },
        {
          title: "4. Propiedad intelectual e industrial",
          paragraphs: [
            "Los textos, diseños, logotipos, código, interfaces, imágenes y demás elementos del sitio son titularidad de Wibloz o de terceros autorizados.",
            "No se permite su reproducción, distribución o transformación sin autorización previa y expresa.",
          ],
        },
        {
          title: "5. Responsabilidad",
          paragraphs: [
            "Wibloz trabaja para mantener el servicio actualizado y disponible, pero no garantiza la ausencia total de interrupciones o errores técnicos.",
            "El usuario es responsable del uso que haga de la información publicada y de los contenidos que cree o publique mediante la plataforma.",
          ],
        },
        {
          title: "6. Enlaces externos",
          paragraphs: [
            "Este sitio puede incluir enlaces a servicios de terceros. Wibloz no controla ni asume responsabilidad sobre sus contenidos, políticas o disponibilidad.",
          ],
        },
        {
          title: "7. Legislación y jurisdicción",
          paragraphs: [
            "Este aviso legal se rige por la legislación española.",
            "Para cualquier conflicto, las partes se someterán a los juzgados y tribunales de Barcelona, salvo que la normativa de consumidores establezca otro fuero obligatorio.",
          ],
        },
      ],
    },
    "politica-privacidad": {
      title: "Política de privacidad",
      lastUpdatedLabel: "Última actualización",
      lastUpdatedDate: "10 de marzo de 2026",
      intro:
        "En Wibloz tratamos los datos personales de forma transparente y conforme al Reglamento (UE) 2016/679 (RGPD) y la normativa aplicable.",
      sections: [
        {
          title: "1. Datos que tratamos",
          paragraphs: ["Podemos tratar los siguientes datos cuando usas Wibloz:"],
          bullets: [
            "Datos de registro: nombre, correo electrónico y credenciales de acceso.",
            "Datos de negocio: nombre comercial, dirección, teléfono, horarios, categoría y contenido que el usuario aporte o confirme.",
            "Datos técnicos: IP, dispositivo, navegador, logs básicos y métricas de uso.",
          ],
        },
        {
          title: "2. Finalidades del tratamiento",
          paragraphs: ["Usamos los datos para:"],
          bullets: [
            "Prestar el servicio de creación y edición web con IA.",
            "Gestionar la cuenta del usuario y la autenticación.",
            "Enviar comunicaciones operativas relacionadas con el servicio.",
            "Mejorar calidad, seguridad y rendimiento de la plataforma.",
          ],
        },
        {
          title: "3. Base jurídica",
          paragraphs: [
            "La base legal del tratamiento es la ejecución del contrato de servicio, el cumplimiento de obligaciones legales y, cuando proceda, el consentimiento del usuario.",
          ],
        },
        {
          title: "4. Conservación",
          paragraphs: [
            "Conservamos los datos mientras exista relación contractual y durante los plazos legales exigibles para atender obligaciones administrativas, fiscales o de seguridad.",
          ],
        },
        {
          title: "5. Destinatarios y encargados",
          paragraphs: [
            "Podemos trabajar con proveedores tecnológicos (hosting, analítica, correo, pagos o infraestructura) bajo contratos que garantizan confidencialidad y cumplimiento normativo.",
            "No vendemos datos personales a terceros.",
          ],
        },
        {
          title: "6. Derechos del usuario",
          paragraphs: [
            "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando una solicitud a privacidad@wibloz.com.",
            "Si consideras que tus derechos no se han atendido correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).",
          ],
        },
        {
          title: "7. Seguridad",
          paragraphs: [
            "Aplicamos medidas técnicas y organizativas razonables para proteger la confidencialidad, integridad y disponibilidad de la información.",
          ],
        },
      ],
    },
    "politica-cookies": {
      title: "Política de cookies",
      lastUpdatedLabel: "Última actualización",
      lastUpdatedDate: "10 de marzo de 2026",
      intro:
        "Esta política explica qué son las cookies, qué tipos usa Wibloz y cómo puedes gestionarlas.",
      sections: [
        {
          title: "1. Qué son las cookies",
          paragraphs: [
            "Las cookies son pequeños archivos que se almacenan en tu dispositivo cuando visitas una web y que permiten recordar información sobre tu navegación.",
          ],
        },
        {
          title: "2. Tipos de cookies que utilizamos",
          paragraphs: ["En Wibloz podemos utilizar:"],
          bullets: [
            "Cookies técnicas: necesarias para el funcionamiento básico del sitio y el acceso seguro.",
            "Cookies de preferencias: guardan opciones como idioma o ajustes de interfaz.",
            "Cookies analíticas: ayudan a entender el uso del servicio para mejorarlo.",
          ],
        },
        {
          title: "3. Base legal",
          paragraphs: [
            "Las cookies técnicas se utilizan por interés legítimo para prestar el servicio. Las cookies no necesarias se activan únicamente con tu consentimiento, cuando corresponda.",
          ],
        },
        {
          title: "4. Configuración y revocación",
          paragraphs: [
            "Puedes aceptar, rechazar o configurar el uso de cookies desde el banner de consentimiento y también desde la configuración de tu navegador.",
            "La desactivación de algunas cookies puede afectar al correcto funcionamiento de ciertas funcionalidades.",
          ],
        },
        {
          title: "5. Cookies de terceros",
          paragraphs: [
            "Determinados servicios integrados pueden instalar cookies de terceros (por ejemplo, analítica o herramientas de soporte). Recomendamos revisar también sus políticas específicas.",
          ],
        },
        {
          title: "6. Contacto",
          paragraphs: [
            "Si tienes dudas sobre esta política, puedes escribir a privacidad@wibloz.com.",
          ],
        },
      ],
    },
  },
  ca: {
    "aviso-legal": {
      title: "Avís legal",
      lastUpdatedLabel: "Última actualització",
      lastUpdatedDate: "10 de març de 2026",
      intro:
        "Aquest lloc web pertany a Wibloz i regula l'accés i ús de la nostra plataforma per crear pàgines web amb ajuda d'intel·ligència artificial.",
      sections: [
        {
          title: "1. Titular del lloc",
          paragraphs: [
            "Titular: Wibloz.",
            "Lloc web: wibloz.com.",
            "Contacte general: hola@wibloz.com.",
          ],
        },
        {
          title: "2. Objecte",
          paragraphs: [
            "Aquest avís legal regula l'accés, la navegació i l'ús d'aquest lloc web, així com les responsabilitats derivades de la utilització dels seus continguts i serveis.",
          ],
        },
        {
          title: "3. Condicions d'ús",
          paragraphs: [
            "L'usuari es compromet a utilitzar el lloc de forma lícita, diligent i respectuosa amb la normativa vigent.",
            "Queda prohibit utilitzar els serveis per a activitats fraudulentes, suplantació d'identitat o qualsevol ús que pugui perjudicar tercers o Wibloz.",
          ],
        },
        {
          title: "4. Propietat intel·lectual i industrial",
          paragraphs: [
            "Els textos, dissenys, logotips, codi, interfícies, imatges i la resta d'elements del lloc són titularitat de Wibloz o de tercers autoritzats.",
            "No es permet la reproducció, distribució o transformació sense autorització prèvia i expressa.",
          ],
        },
        {
          title: "5. Responsabilitat",
          paragraphs: [
            "Wibloz treballa per mantenir el servei actualitzat i disponible, però no garanteix l'absència total d'interrupcions o errors tècnics.",
            "L'usuari és responsable de l'ús que faci de la informació publicada i dels continguts que creï o publiqui mitjançant la plataforma.",
          ],
        },
        {
          title: "6. Enllaços externs",
          paragraphs: [
            "Aquest lloc pot incloure enllaços a serveis de tercers. Wibloz no controla ni assumeix responsabilitat sobre els seus continguts, polítiques o disponibilitat.",
          ],
        },
        {
          title: "7. Legislació i jurisdicció",
          paragraphs: [
            "Aquest avís legal es regeix per la legislació espanyola.",
            "Per a qualsevol conflicte, les parts se sotmetran als jutjats i tribunals de Barcelona, excepte si la normativa de consumidors estableix un altre fur obligatori.",
          ],
        },
      ],
    },
    "politica-privacidad": {
      title: "Política de privacitat",
      lastUpdatedLabel: "Última actualització",
      lastUpdatedDate: "10 de març de 2026",
      intro:
        "A Wibloz tractem les dades personals de manera transparent i d'acord amb el Reglament (UE) 2016/679 (RGPD) i la normativa aplicable.",
      sections: [
        {
          title: "1. Dades que tractem",
          paragraphs: ["Podem tractar les dades següents quan utilitzes Wibloz:"],
          bullets: [
            "Dades de registre: nom, correu electrònic i credencials d'accés.",
            "Dades del negoci: nom comercial, adreça, telèfon, horaris, categoria i contingut que l'usuari aporti o confirmi.",
            "Dades tècniques: IP, dispositiu, navegador, logs bàsics i mètriques d'ús.",
          ],
        },
        {
          title: "2. Finalitats del tractament",
          paragraphs: ["Fem servir les dades per a:"],
          bullets: [
            "Prestar el servei de creació i edició web amb IA.",
            "Gestionar el compte de l'usuari i l'autenticació.",
            "Enviar comunicacions operatives relacionades amb el servei.",
            "Millorar la qualitat, la seguretat i el rendiment de la plataforma.",
          ],
        },
        {
          title: "3. Base jurídica",
          paragraphs: [
            "La base legal del tractament és l'execució del contracte de servei, el compliment d'obligacions legals i, quan sigui procedent, el consentiment de l'usuari.",
          ],
        },
        {
          title: "4. Conservació",
          paragraphs: [
            "Conservem les dades mentre existeixi relació contractual i durant els terminis legals exigibles per atendre obligacions administratives, fiscals o de seguretat.",
          ],
        },
        {
          title: "5. Destinataris i encarregats",
          paragraphs: [
            "Podem treballar amb proveïdors tecnològics (hosting, analítica, correu, pagaments o infraestructura) sota contractes que garanteixen confidencialitat i compliment normatiu.",
            "No venem dades personals a tercers.",
          ],
        },
        {
          title: "6. Drets de l'usuari",
          paragraphs: [
            "Pots exercir els teus drets d'accés, rectificació, supressió, oposició, limitació i portabilitat enviant una sol·licitud a privacitat@wibloz.com.",
            "Si consideres que els teus drets no s'han atès correctament, pots presentar una reclamació davant l'Agència Espanyola de Protecció de Dades (AEPD).",
          ],
        },
        {
          title: "7. Seguretat",
          paragraphs: [
            "Apliquem mesures tècniques i organitzatives raonables per protegir la confidencialitat, integritat i disponibilitat de la informació.",
          ],
        },
      ],
    },
    "politica-cookies": {
      title: "Política de cookies",
      lastUpdatedLabel: "Última actualització",
      lastUpdatedDate: "10 de març de 2026",
      intro:
        "Aquesta política explica què són les cookies, quins tipus utilitza Wibloz i com les pots gestionar.",
      sections: [
        {
          title: "1. Què són les cookies",
          paragraphs: [
            "Les cookies són petits fitxers que s'emmagatzemen al teu dispositiu quan visites una web i que permeten recordar informació sobre la teva navegació.",
          ],
        },
        {
          title: "2. Tipus de cookies que utilitzem",
          paragraphs: ["A Wibloz podem utilitzar:"],
          bullets: [
            "Cookies tècniques: necessàries per al funcionament bàsic del lloc i l'accés segur.",
            "Cookies de preferències: guarden opcions com idioma o ajustos d'interfície.",
            "Cookies analítiques: ajuden a entendre l'ús del servei per millorar-lo.",
          ],
        },
        {
          title: "3. Base legal",
          paragraphs: [
            "Les cookies tècniques s'utilitzen per interès legítim per prestar el servei. Les cookies no necessàries s'activen únicament amb el teu consentiment, quan correspongui.",
          ],
        },
        {
          title: "4. Configuració i revocació",
          paragraphs: [
            "Pots acceptar, rebutjar o configurar l'ús de cookies des del banner de consentiment i també des de la configuració del teu navegador.",
            "La desactivació d'algunes cookies pot afectar el funcionament correcte de determinades funcionalitats.",
          ],
        },
        {
          title: "5. Cookies de tercers",
          paragraphs: [
            "Determinats serveis integrats poden instal·lar cookies de tercers (per exemple, analítica o eines de suport). Recomanem revisar també les seves polítiques específiques.",
          ],
        },
        {
          title: "6. Contacte",
          paragraphs: [
            "Si tens dubtes sobre aquesta política, pots escriure a privacitat@wibloz.com.",
          ],
        },
      ],
    },
  },
};
