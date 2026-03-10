import AlternativeLanding from "../_components/AlternativeLanding";

export default function AlternativeWordpressPage() {
  return (
    <AlternativeLanding
      slug="wordpress"
      copy={{
        es: {
          badge: "Menos mantenimiento, más ventas",
          title: "La alternativa a WordPress para negocios sin equipo técnico",
          subtitle:
            "WordPress es potente, pero en muchos negocios locales acaba frenando por tiempo, plugins y mantenimiento. Aquí te enfocas en captar clientes.",
          urgencyText: "Cada hora en tareas técnicas es una hora menos vendiendo.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Ver demo guiada",
          trustLine: "Publica rápido con IA y gestiona cambios sin tocar plugins ni código.",
          competitorCardTitle: "Con WordPress tradicional",
          competitorItems: [
            "Dependencia de plugins y actualizaciones frecuentes.",
            "Riesgo técnico si algo rompe tras una actualización.",
            "Necesidad de proveedor externo para cambios rápidos.",
          ],
          novaCardTitle: "Con Wibloz",
          novaItems: [
            "Configuración inicial en minutos y sin curva técnica.",
            "Editor visual con recomendaciones de IA para mejorar textos y secciones comerciales al instante.",
            "Infraestructura lista sin mantenimiento complejo.",
          ],
          switchTitle: "Migrar sin fricción operativa",
          switchSteps: [
            {
              title: "Define oferta y objetivos",
              description: "Priorizamos páginas que generan contacto y no solo presencia.",
            },
            {
              title: "Genera estructura de captación",
              description: "La IA crea textos y bloques pensados para conversión desde el inicio.",
            },
            {
              title: "Publica y optimiza",
              description: "Lanzas rápido y ajustas mensajes según respuesta del mercado.",
            },
          ],
          proofTitle: "Lo que notan los equipos pequeños",
          testimonials: [
            {
              quote:
                "Antes todo dependía del freelance de WordPress. Ahora actualizamos nosotros en minutos.",
              author: "Anna M.",
              role: "Academia local",
            },
            {
              quote:
                "Reducimos tiempo técnico y mejoramos el volumen de formularios.",
              author: "Pablo L.",
              role: "Clínica podología",
            },
          ],
          planTitle: "Plan recomendado para migrar de WordPress",
          planPrice: "19€/mes",
          planItems: [
            "Editor visual ilimitado y simple",
            "SEO local y estructura orientada a lead",
            "Hosting seguro incluido",
          ],
          finalTitle: "Recupera tiempo y céntrate en vender",
          finalSubtitle:
            "Regístrate y pasa de mantener una web a usar una web que te trae clientes.",
        },
        ca: {
          badge: "Menys manteniment, més vendes",
          title: "L'alternativa a WordPress per negocis sense equip tècnic",
          subtitle:
            "WordPress és potent, però en molts negocis locals acaba frenant per temps, plugins i manteniment. Aquí t'enfoques a captar clients.",
          urgencyText: "Cada hora en tasques tècniques és una hora menys venent.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Veure demo guiada",
          trustLine: "Publica ràpid amb IA i gestiona canvis sense tocar plugins ni codi.",
          competitorCardTitle: "Amb WordPress tradicional",
          competitorItems: [
            "Dependència de plugins i actualitzacions freqüents.",
            "Risc tècnic si alguna cosa es trenca després d'actualitzar.",
            "Necessitat de proveïdor extern per canvis ràpids.",
          ],
          novaCardTitle: "Amb Wibloz",
          novaItems: [
            "Configuració inicial en minuts i sense corba tècnica.",
            "Editor visual amb recomanacions d'IA per millorar textos i seccions comercials a l'instant.",
            "Infraestructura llesta sense manteniment complex.",
          ],
          switchTitle: "Migrar sense fricció operativa",
          switchSteps: [
            {
              title: "Defineix oferta i objectius",
              description: "Prioritzem pàgines que generen contacte i no només presència.",
            },
            {
              title: "Genera estructura de captació",
              description: "La IA crea textos i blocs pensats per conversió des de l'inici.",
            },
            {
              title: "Publica i optimitza",
              description: "Llança ràpid i ajusta missatges segons resposta del mercat.",
            },
          ],
          proofTitle: "El que noten els equips petits",
          testimonials: [
            {
              quote:
                "Abans tot depenia del freelance de WordPress. Ara actualitzem nosaltres en minuts.",
              author: "Anna M.",
              role: "Acadèmia local",
            },
            {
              quote:
                "Vam reduir temps tècnic i vam millorar el volum de formularis.",
              author: "Pablo L.",
              role: "Clínica podologia",
            },
          ],
          planTitle: "Pla recomanat per migrar de WordPress",
          planPrice: "19€/mes",
          planItems: [
            "Editor visual il·limitat i simple",
            "SEO local i estructura orientada a lead",
            "Hosting segur inclòs",
          ],
          finalTitle: "Recupera temps i centra't a vendre",
          finalSubtitle:
            "Registra't i passa de mantenir una web a fer servir una web que et porta clients.",
        },
      }}
    />
  );
}
