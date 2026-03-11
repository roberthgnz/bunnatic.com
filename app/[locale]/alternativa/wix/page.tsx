import type { Metadata } from "next";
import AlternativeLanding from "../_components/AlternativeLanding";
import { getAlternativeSlug } from "@/lib/pageSlugs";
import { buildPageMetadata, type SeoLocale } from "@/lib/seo";

type AlternativePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AlternativePageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: SeoLocale = locale === "ca" ? "ca" : "es";

  return buildPageMetadata({
    locale: safeLocale,
    title:
      safeLocale === "ca"
        ? "Alternativa a Wix per publicar més ràpid | Bunnatic"
        : "Alternativa a Wix para publicar más rápido | Bunnatic",
    description:
      safeLocale === "ca"
        ? "Deixa de construir des de zero i activa una web que converteix en minuts."
        : "Deja de construir desde cero y activa una web que convierte en minutos.",
    esPath: `/alternativa/${getAlternativeSlug("wix", "es")}`,
    caPath: `/alternativa/${getAlternativeSlug("wix", "ca")}`,
  });
}

export default function AlternativeWixPage() {
  return (
    <AlternativeLanding
      slug="wix"
      copy={{
        es: {
          badge: "Evita empezar desde cero",
          title: "La alternativa a Wix para lanzar más rápido y convertir mejor",
          subtitle:
            "Con Wix sueles invertir tiempo montando bloques y copiando textos. Con Bunnatic partes de una propuesta completa pensada para captar clientes.",
          urgencyText: "Si tardas en publicar, también tardas en generar oportunidades.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Probar demo",
          trustLine: "IA + estructura comercial para pasar de idea a web operativa en minutos.",
          competitorCardTitle: "Con Wix",
          competitorItems: [
            "Necesitas construir gran parte de la página manualmente.",
            "La calidad del copy depende de tu tiempo y experiencia.",
            "Más fricción para iterar rápido en campañas.",
          ],
          novaCardTitle: "Con Bunnatic",
          novaItems: [
            "La IA genera textos y estructura orientados a conversión.",
            "Publicas rápido sin curva de diseño ni maquetación.",
            "Actualizas promociones y servicios con el editor visual en segundos.",
          ],
          switchTitle: "Cómo acelerar tu salida a mercado",
          switchSteps: [
            {
              title: "Define negocio y objetivo",
              description: "Indicamos tipo de cliente y acción que quieres priorizar.",
            },
            {
              title: "Genera y ajusta propuesta",
              description: "Partes de una base sólida y haces ajustes mínimos para publicar.",
            },
            {
              title: "Activa captación",
              description: "Empiezas a recibir contactos con formularios y CTAs listos.",
            },
          ],
          proofTitle: "Resultados al simplificar el proceso",
          testimonials: [
            {
              quote:
                "Con Wix nunca terminábamos. Aquí publicamos el mismo día y empezamos a captar.",
              author: "Eva T.",
              role: "Nutrición deportiva",
            },
            {
              quote:
                "La diferencia fue tener copy comercial desde el minuto uno.",
              author: "Carlos F.",
              role: "Servicios de pintura",
            },
          ],
          planTitle: "Plan recomendado para salir rápido",
          planPrice: "19€/mes",
          planItems: [
            "Generación IA de textos y estructura",
            "Editor visual sin fricción",
            "Captación integrada y SEO local",
          ],
          finalTitle: "Publica antes, vende antes",
          finalSubtitle:
            "Regístrate y deja de construir desde cero cada vez que quieras mejorar tu web.",
        },
        ca: {
          badge: "Evita començar des de zero",
          title: "L'alternativa a Wix per llançar més ràpid i convertir millor",
          subtitle:
            "Amb Wix sovint inverteixes temps muntant blocs i copiant textos. Amb Bunnatic parteixes d'una proposta completa pensada per captar clients.",
          urgencyText: "Si trigues a publicar, també trigues a generar oportunitats.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Provar demo ara",
          trustLine: "IA + estructura comercial per passar d'idea a web operativa en minuts.",
          competitorCardTitle: "Amb Wix",
          competitorItems: [
            "Has de construir gran part de la pàgina manualment.",
            "La qualitat del copy depèn del teu temps i experiència.",
            "Més fricció per iterar ràpid en campanyes.",
          ],
          novaCardTitle: "Amb Bunnatic",
          novaItems: [
            "La IA genera textos i estructura orientats a conversió.",
            "Publiques ràpid sense corba de disseny ni maquetació.",
            "Actualitzes promocions i serveis amb l'editor visual en segons.",
          ],
          switchTitle: "Com accelerar la teva sortida a mercat",
          switchSteps: [
            {
              title: "Defineix negoci i objectiu",
              description: "Indiquem tipus de client i acció que vols prioritzar.",
            },
            {
              title: "Genera i ajusta proposta",
              description: "Parteixes d'una base sòlida i fas ajustos mínims per publicar.",
            },
            {
              title: "Activa captació",
              description: "Comences a rebre contactes amb formularis i CTAs llestos.",
            },
          ],
          proofTitle: "Resultats en simplificar el procés",
          testimonials: [
            {
              quote:
                "Amb Wix no acabàvem mai. Aquí vam publicar el mateix dia i vam començar a captar.",
              author: "Eva T.",
              role: "Nutrició esportiva",
            },
            {
              quote:
                "La diferència va ser tenir copy comercial des del minut u.",
              author: "Carlos F.",
              role: "Serveis de pintura",
            },
          ],
          planTitle: "Pla recomanat per sortir ràpid",
          planPrice: "19€/mes",
          planItems: [
            "Generació IA de textos i estructura",
            "Editor visual sense fricció",
            "Captació integrada i SEO local",
          ],
          finalTitle: "Publica abans, ven abans",
          finalSubtitle:
            "Registra't i deixa de construir des de zero cada cop que vulguis millorar la teva web.",
        },
      }}
    />
  );
}
