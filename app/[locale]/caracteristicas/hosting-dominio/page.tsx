import type { Metadata } from "next";
import FeatureLanding from "../_components/FeatureLanding";
import { getFeatureSlug } from "@/lib/pageSlugs";
import { buildPageMetadata, type SeoLocale } from "@/lib/seo";

type FeaturePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: SeoLocale = locale === "ca" ? "ca" : "es";

  return buildPageMetadata({
    locale: safeLocale,
    title:
      safeLocale === "ca"
        ? "Hosting i domini inclosos | Wibloz"
        : "Hosting y dominio incluidos | Wibloz",
    description:
      safeLocale === "ca"
        ? "Publica la teva web amb infraestructura segura, ràpida i preparada per captar clients."
        : "Publica tu web con infraestructura segura, rápida y preparada para captar clientes.",
    esPath: `/caracteristicas/${getFeatureSlug("hosting-dominio", "es")}`,
    caPath: `/caracteristicas/${getFeatureSlug("hosting-dominio", "ca")}`,
  });
}

export default function HostingDominioPage() {
  return (
    <FeatureLanding
      slug="hosting-dominio"
      icon="Globe"
      copy={{
        es: {
          badge: "Todo técnico resuelto desde el inicio",
          title: "Hosting y dominio incluidos para vender sin fricción",
          subtitle:
            "Tu web se publica con infraestructura segura y rápida para que no pierdas clientes por caídas, lentitud o problemas de configuración.",
          urgencyText: "Cada fallo técnico afecta confianza, posicionamiento y conversiones.",
          trustLine: "SSL, rendimiento y disponibilidad listos para que te centres en negocio.",
          outcomesTitle: "Beneficios reales para tu facturación",
          outcomes: [
            "Web estable para no perder oportunidades en horas clave.",
            "Carga rápida que mejora experiencia y tasa de contacto.",
            "Configuración simple con dominio listo para marca profesional.",
          ],
          processTitle: "Cómo lo dejamos operativo",
          process: [
            {
              title: "Provisionamos tu entorno",
              description:
                "Configuramos hosting y seguridad base sin pasos técnicos por tu parte.",
            },
            {
              title: "Conectamos dominio",
              description:
                "Publicamos tu web en una dirección profesional para generar confianza.",
            },
            {
              title: "Monitorizamos estabilidad",
              description:
                "Mantenemos un entorno robusto para que tu web esté disponible cuando te buscan.",
            },
          ],
          objectionsTitle: "Preguntas típicas antes de decidir",
          objections: [
            {
              q: "¿Qué pasa si no tengo dominio?",
              a: "Te ayudamos a activarlo dentro del proceso para que salgas publicado sin bloqueos.",
            },
            {
              q: "¿Y si ya tengo dominio propio?",
              a: "También puedes conectarlo para mantener tu marca sin empezar de cero.",
            },
          ],
          proofTitle: "Qué valoran los clientes",
          testimonials: [
            {
              quote:
                "Nos quitamos el problema técnico de encima y la web siempre responde rápido.",
              author: "Cristina D.",
              role: "Clínica fisioterapia",
            },
            {
              quote:
                "Pasamos de una web lenta a una estable. Subieron los contactos en móvil.",
              author: "Marc L.",
              role: "Reparación de electrodomésticos",
            },
          ],
          planTitle: "Plan recomendado para operar sin fricción",
          planPrice: "19€/mes",
          planItems: [
            "Hosting seguro con SSL incluido",
            "Dominio listo para publicar",
            "Base técnica optimizada para velocidad",
          ],
          finalTitle: "Lanza una web fiable desde hoy",
          finalSubtitle:
            "Regístrate y publica con infraestructura profesional, sin depender de soporte técnico externo.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Publicar mi web",
        },
        ca: {
          badge: "Tot tècnic resolt des de l'inici",
          title: "Hosting i domini inclosos per vendre sense fricció",
          subtitle:
            "La teva web es publica amb infraestructura segura i ràpida perquè no perdis clients per caigudes, lentitud o problemes de configuració.",
          urgencyText: "Cada fallada tècnica afecta confiança, posicionament i conversions.",
          trustLine: "SSL, rendiment i disponibilitat llestos perquè et centris en negoci.",
          outcomesTitle: "Beneficis reals per a la teva facturació",
          outcomes: [
            "Web estable per no perdre oportunitats en hores clau.",
            "Càrrega ràpida que millora experiència i taxa de contacte.",
            "Configuració simple amb domini llest per marca professional.",
          ],
          processTitle: "Com ho deixem operatiu",
          process: [
            {
              title: "Provisionem el teu entorn",
              description:
                "Configurem hosting i seguretat base sense passos tècnics per part teva.",
            },
            {
              title: "Connectem domini",
              description:
                "Publiquem la teva web en una adreça professional per generar confiança.",
            },
            {
              title: "Monitoritzem estabilitat",
              description:
                "Mantenim un entorn robust perquè la teva web estigui disponible quan et busquen.",
            },
          ],
          objectionsTitle: "Preguntes típiques abans de decidir",
          objections: [
            {
              q: "Què passa si no tinc domini?",
              a: "T'ajudem a activar-lo dins del procés perquè surtis publicat sense bloquejos.",
            },
            {
              q: "I si ja tinc domini propi?",
              a: "També el pots connectar per mantenir la teva marca sense començar de zero.",
            },
          ],
          proofTitle: "Què valoren els clients",
          testimonials: [
            {
              quote:
                "Ens vam treure el problema tècnic de sobre i la web sempre respon ràpid.",
              author: "Cristina D.",
              role: "Clínica fisioteràpia",
            },
            {
              quote:
                "Vam passar d'una web lenta a una d'estable. Van pujar els contactes en mòbil.",
              author: "Marc L.",
              role: "Reparació d'electrodomèstics",
            },
          ],
          planTitle: "Pla recomanat per operar sense fricció",
          planPrice: "19€/mes",
          planItems: [
            "Hosting segur amb SSL inclòs",
            "Domini llest per publicar",
            "Base tècnica optimitzada per velocitat",
          ],
          finalTitle: "Llança una web fiable des d'avui",
          finalSubtitle:
            "Registra't i publica amb infraestructura professional, sense dependre de suport tècnic extern.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Publicar la meva web",
        },
      }}
    />
  );
}
