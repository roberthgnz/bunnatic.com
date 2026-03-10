import FeatureLanding from "../_components/FeatureLanding";

export default function GeneracionIAPage() {
  return (
    <FeatureLanding
      slug="generacion-ia"
      icon="Sparkles"
      copy={{
        es: {
          badge: "Tu web puede estar activa hoy",
          title: "Generación con IA que convierte visitas en clientes",
          subtitle:
            "La IA construye una web completa con textos de venta, estructura enfocada a lead y diseño optimizado para móvil en minutos.",
          urgencyText: "Cada día sin web son búsquedas locales que acaban en la competencia.",
          trustLine: "Sin equipo técnico. Sin bloqueo de permanencia. Configuración inicial en menos de 10 minutos.",
          outcomesTitle: "Qué desbloqueas desde el primer día",
          outcomes: [
            "Mensaje comercial claro para que te contacten sin dudar.",
            "Estructura pensada para que el usuario haga clic en llamar o escribir.",
            "Diseño listo para publicar sin depender de un diseñador.",
          ],
          processTitle: "Cómo se traduce en más registros y ventas",
          process: [
            {
              title: "Leemos tu negocio",
              description:
                "Tomamos datos públicos y contexto de tu sector para no partir de cero.",
            },
            {
              title: "Generamos propuesta comercial",
              description:
                "Creamos titulares, bloques y CTAs que empujan al registro y al contacto.",
            },
            {
              title: "Publicas y activas captación",
              description:
                "Tu sitio queda listo para recibir tráfico y convertir visitas desde el primer día.",
            },
          ],
          objectionsTitle: "Objeciones habituales (resueltas)",
          objections: [
            {
              q: "¿Y si no me gusta el texto generado?",
              a: "Puedes regenerarlo y ajustarlo en el editor visual en segundos hasta que encaje con tu negocio.",
            },
            {
              q: "¿Necesito saber diseño o código?",
              a: "No. La IA y el editor guiado cubren todo el proceso sin curva técnica.",
            },
          ],
          proofTitle: "Resultados que ya estamos viendo",
          testimonials: [
            {
              quote:
                "Pasamos de no tener web a recibir contactos por formulario en la primera semana.",
              author: "Marta C.",
              role: "Centro de estética",
            },
            {
              quote:
                "La IA dejó la estructura lista. Solo revisé dos textos y publiqué.",
              author: "Pol R.",
              role: "Taller mecánico",
            },
          ],
          planTitle: "Plan recomendado para captar clientes",
          planPrice: "19€/mes",
          planItems: [
            "Edición visual con ayuda de IA para textos y ofertas",
            "Formulario de contacto y botón de WhatsApp",
            "SEO local y soporte prioritario",
          ],
          finalTitle: "Empieza hoy con una web que sí vende",
          finalSubtitle:
            "Crea tu cuenta, genera tu web y empieza a captar registros sin depender de terceros.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Probar demo ahora",
        },
        ca: {
          badge: "La teva web pot estar activa avui",
          title: "Generació amb IA que converteix visites en clients",
          subtitle:
            "La IA construeix una web completa amb textos de venda, estructura orientada a lead i disseny optimitzat per mòbil en minuts.",
          urgencyText: "Cada dia sense web són cerques locals que acaben a la competència.",
          trustLine: "Sense equip tècnic. Sense permanència. Configuració inicial en menys de 10 minuts.",
          outcomesTitle: "Què actives des del primer dia",
          outcomes: [
            "Missatge comercial clar perquè et contactin sense dubtes.",
            "Estructura pensada perquè l'usuari faci clic a trucar o escriure.",
            "Disseny llest per publicar sense dependre d'un dissenyador.",
          ],
          processTitle: "Com es tradueix en més registres i vendes",
          process: [
            {
              title: "Llegim el teu negoci",
              description:
                "Agafem dades públiques i context del teu sector per no començar de zero.",
            },
            {
              title: "Generem proposta comercial",
              description:
                "Creem titulars, blocs i CTAs que empenyen al registre i al contacte.",
            },
            {
              title: "Publiques i actives captació",
              description:
                "El teu web queda llest per rebre trànsit i convertir visites des del primer dia.",
            },
          ],
          objectionsTitle: "Objeccions habituals (resoltes)",
          objections: [
            {
              q: "I si no m'agrada el text generat?",
              a: "El pots regenerar i ajustar a l'editor visual en segons fins que encaixi amb el teu negoci.",
            },
            {
              q: "Necessito saber disseny o codi?",
              a: "No. La IA i l'editor guiat cobreixen tot el procés sense corba tècnica.",
            },
          ],
          proofTitle: "Resultats que ja estem veient",
          testimonials: [
            {
              quote:
                "Vam passar de no tenir web a rebre contactes per formulari la primera setmana.",
              author: "Marta C.",
              role: "Centre d'estètica",
            },
            {
              quote:
                "La IA va deixar l'estructura llesta. Només vaig revisar dos textos i publicar.",
              author: "Pol R.",
              role: "Taller mecànic",
            },
          ],
          planTitle: "Pla recomanat per captar clients",
          planPrice: "19€/mes",
          planItems: [
            "Editor visual il·limitat amb suport d'IA",
            "Formulari de contacte i botó de WhatsApp",
            "SEO local i suport prioritari",
          ],
          finalTitle: "Comença avui amb una web que sí ven",
          finalSubtitle:
            "Crea el teu compte, genera la teva web i comença a captar registres sense dependre de tercers.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Provar demo ara",
        },
      }}
    />
  );
}
