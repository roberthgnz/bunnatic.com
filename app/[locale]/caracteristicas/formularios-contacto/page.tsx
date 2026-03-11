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
        ? "Formularis de contacte per captar clients | Bunnatic"
        : "Formularios de contacto para captar clientes | Bunnatic",
    description:
      safeLocale === "ca"
        ? "Converteix visites en oportunitats amb formularis, WhatsApp i crides a l'acció optimitzades."
        : "Convierte visitas en oportunidades con formularios, WhatsApp y llamadas a la acción optimizadas.",
    esPath: `/caracteristicas/${getFeatureSlug("formularios-contacto", "es")}`,
    caPath: `/caracteristicas/${getFeatureSlug("formularios-contacto", "ca")}`,
  });
}

export default function FormulariosContactoPage() {
  return (
    <FeatureLanding
      slug="formularios-contacto"
      icon="Users"
      copy={{
        es: {
          badge: "Convierte visitas en oportunidades reales",
          title: "Captación de clientes con formularios que sí se envían",
          subtitle:
            "Diseñamos puntos de contacto claros para que cada visita tenga una siguiente acción: pedir cita, solicitar presupuesto o hablar por WhatsApp.",
          urgencyText: "Sin un flujo de captura claro, el tráfico no se convierte en ventas.",
          trustLine: "Formularios visibles, CTAs directos y notificaciones instantáneas para respuesta rápida.",
          outcomesTitle: "Qué mejora en tu funnel",
          outcomes: [
            "Más leads cualificados sin aumentar inversión en tráfico.",
            "Menos abandono gracias a formularios simples y accionables.",
            "Mejor tasa de respuesta con alertas en tiempo real.",
          ],
          processTitle: "Flujo de conversión que implementamos",
          process: [
            {
              title: "Definimos puntos de intención",
              description:
                "Ubicamos llamadas a la acción donde el usuario ya está listo para contactar.",
            },
            {
              title: "Reducimos fricción",
              description:
                "Simplificamos formularios para capturar datos clave sin bloquear la decisión.",
            },
            {
              title: "Activamos respuesta rápida",
              description:
                "Recibes cada lead al momento para contestar cuando el interés está caliente.",
            },
          ],
          objectionsTitle: "Objeciones comunes",
          objections: [
            {
              q: "¿Y si recibo contactos de baja calidad?",
              a: "Ajustamos campos y copy para filtrar mejor sin perder volumen de oportunidades.",
            },
            {
              q: "¿Necesito integrar herramientas externas?",
              a: "No para empezar. El flujo base ya queda operativo para captar y responder.",
            },
          ],
          proofTitle: "Impacto en negocios como el tuyo",
          testimonials: [
            {
              quote:
                "Duplicamos solicitudes de presupuesto solo mejorando el flujo de contacto.",
              author: "Raúl S.",
              role: "Instalaciones",
            },
            {
              quote:
                "Ahora recibimos leads de calidad y respondemos desde el móvil al instante.",
              author: "Núria A.",
              role: "Clínica estética",
            },
          ],
          planTitle: "Plan recomendado para captación",
          planPrice: "19€/mes",
          planItems: [
            "Formulario de contacto integrado",
            "Botón de WhatsApp y llamada directa",
            "Optimización de bloques de conversión",
          ],
          finalTitle: "Convierte más visitas desde esta semana",
          finalSubtitle:
            "Crea tu cuenta y activa un flujo de captación listo para generar registros y ventas.",
          ctaPrimary: "Empezar gratis",
          ctaSecondary: "Crear mi demo",
        },
        ca: {
          badge: "Converteix visites en oportunitats reals",
          title: "Captació de clients amb formularis que sí s'envien",
          subtitle:
            "Dissenyem punts de contacte clars perquè cada visita tingui una acció següent: demanar cita, sol·licitar pressupost o parlar per WhatsApp.",
          urgencyText: "Sense un flux de captura clar, el trànsit no es converteix en vendes.",
          trustLine: "Formularis visibles, CTAs directes i notificacions instantànies per resposta ràpida.",
          outcomesTitle: "Què millora al teu funnel",
          outcomes: [
            "Més leads qualificats sense augmentar inversió en trànsit.",
            "Menys abandonament amb formularis simples i accionables.",
            "Millor taxa de resposta amb alertes en temps real.",
          ],
          processTitle: "Flux de conversió que implementem",
          process: [
            {
              title: "Definim punts d'intenció",
              description:
                "Ubíquem crides a l'acció on l'usuari ja està llest per contactar.",
            },
            {
              title: "Reduïm fricció",
              description:
                "Simplifiquem formularis per capturar dades clau sense bloquejar la decisió.",
            },
            {
              title: "Activem resposta ràpida",
              description:
                "Reps cada lead al moment per contestar quan l'interès està calent.",
            },
          ],
          objectionsTitle: "Objeccions comunes",
          objections: [
            {
              q: "I si rebo contactes de baixa qualitat?",
              a: "Ajustem camps i copy per filtrar millor sense perdre volum d'oportunitats.",
            },
            {
              q: "Necessito integrar eines externes?",
              a: "No per començar. El flux base ja queda operatiu per captar i respondre.",
            },
          ],
          proofTitle: "Impacte en negocis com el teu",
          testimonials: [
            {
              quote:
                "Vam duplicar sol·licituds de pressupost només millorant el flux de contacte.",
              author: "Raúl S.",
              role: "Instal·lacions",
            },
            {
              quote:
                "Ara rebem leads de qualitat i responem des del mòbil a l'instant.",
              author: "Núria A.",
              role: "Clínica estètica",
            },
          ],
          planTitle: "Pla recomanat per captació",
          planPrice: "19€/mes",
          planItems: [
            "Formulari de contacte integrat",
            "Botó de WhatsApp i trucada directa",
            "Optimització de blocs de conversió",
          ],
          finalTitle: "Converteix més visites des d'aquesta setmana",
          finalSubtitle:
            "Crea el teu compte i activa un flux de captació llest per generar registres i vendes.",
          ctaPrimary: "Començar gratis",
          ctaSecondary: "Crear la meva demo",
        },
      }}
    />
  );
}
