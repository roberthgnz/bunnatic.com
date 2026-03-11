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
        ? "Alternativa a dependre només de Google My Business | Bunnatic"
        : "Alternativa a depender solo de Google My Business | Bunnatic",
    description:
      safeLocale === "ca"
        ? "Combina visibilitat a Google Maps amb una web que converteix en contactes i vendes."
        : "Combina visibilidad en Google Maps con una web que convierte en contactos y ventas.",
    esPath: `/alternativa/${getAlternativeSlug("google-my-business", "es")}`,
    caPath: `/alternativa/${getAlternativeSlug("google-my-business", "ca")}`,
  });
}

export default function AlternativeGoogleMyBusinessPage() {
  return (
    <AlternativeLanding
      slug="google-my-business"
      copy={{
        es: {
          badge: "Ficha en Google + web que cierre ventas",
          title: "La alternativa a depender solo de Google My Business",
          subtitle:
            "Tu ficha es clave para visibilidad, pero la decisión final se gana con una web que explique servicios, diferenciales y llamada a la acción.",
          urgencyText: "Sin web propia, compites en precio y reseñas sin controlar el mensaje.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Publicar mi web",
          trustLine: "Combina visibilidad en Maps con una página diseñada para convertir.",
          competitorCardTitle: "Solo con Google My Business",
          competitorItems: [
            "Espacio limitado para explicar por qué elegirte.",
            "La competencia aparece alrededor de tu ficha.",
            "Poca capacidad de captación con formulario propio.",
          ],
          novaCardTitle: "Con Bunnatic + Google",
          novaItems: [
            "Controlas tu narrativa comercial y propuesta de valor.",
            "Conduces el tráfico de la ficha a una landing de conversión.",
            "Captas leads directamente sin depender de plataformas.",
          ],
          switchTitle: "Implementación práctica en 3 pasos",
          switchSteps: [
            {
              title: "Genera web alineada a tu ficha",
              description: "Partimos de la información existente para acelerar salida a mercado.",
            },
            {
              title: "Añade ofertas y diferenciales",
              description: "Incluyes argumentos comerciales que no caben bien en la ficha.",
            },
            {
              title: "Conecta CTA de captación",
              description: "Recibes contactos en tu canal con más contexto y mejor calidad.",
            },
          ],
          proofTitle: "Qué ocurre cuando sumas web propia",
          testimonials: [
            {
              quote:
                "Con la ficha sola teníamos clics, pero no tantos leads. La web cambió eso.",
              author: "Óscar B.",
              role: "Reformas del hogar",
            },
            {
              quote:
                "Ahora explicamos procesos y precios en una página clara antes del contacto.",
              author: "Mireia S.",
              role: "Nutrición",
            },
          ],
          planTitle: "Plan recomendado para ficha + web",
          planPrice: "19€/mes",
          planItems: [
            "Web optimizada para SEO local",
            "Formularios y botones de contacto directo",
            "Edición ágil para campañas y novedades",
          ],
          finalTitle: "No te quedes solo en aparecer: empieza a convertir",
          finalSubtitle:
            "Activa tu cuenta y transforma visitas de Google en registros y ventas reales.",
        },
        ca: {
          badge: "Fitxa a Google + web que tanqui vendes",
          title: "L'alternativa a dependre només de Google My Business",
          subtitle:
            "La teva fitxa és clau per visibilitat, però la decisió final es guanya amb una web que expliqui serveis, diferencials i crida a l'acció.",
          urgencyText: "Sense web pròpia, competeixes en preu i ressenyes sense controlar el missatge.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Publicar la meva web",
          trustLine: "Combina visibilitat a Maps amb una pàgina dissenyada per convertir.",
          competitorCardTitle: "Només amb Google My Business",
          competitorItems: [
            "Espai limitat per explicar per què triar-te.",
            "La competència apareix al voltant de la teva fitxa.",
            "Poca capacitat de captació amb formulari propi.",
          ],
          novaCardTitle: "Amb Bunnatic + Google",
          novaItems: [
            "Controles la teva narrativa comercial i proposta de valor.",
            "Condueixes el trànsit de la fitxa a una landing de conversió.",
            "Captes leads directament sense dependre de plataformes.",
          ],
          switchTitle: "Implementació pràctica en 3 passos",
          switchSteps: [
            {
              title: "Genera web alineada a la fitxa",
              description: "Partim de la informació existent per accelerar sortida a mercat.",
            },
            {
              title: "Afegeix ofertes i diferencials",
              description: "Inclous arguments comercials que no hi caben bé a la fitxa.",
            },
            {
              title: "Connecta CTA de captació",
              description: "Reps contactes al teu canal amb més context i millor qualitat.",
            },
          ],
          proofTitle: "Què passa quan hi sumes web pròpia",
          testimonials: [
            {
              quote:
                "Amb la fitxa sola teníem clics, però no tants leads. La web va canviar això.",
              author: "Óscar B.",
              role: "Reformes de la llar",
            },
            {
              quote:
                "Ara expliquem processos i preus en una pàgina clara abans del contacte.",
              author: "Mireia S.",
              role: "Nutrició",
            },
          ],
          planTitle: "Pla recomanat per fitxa + web",
          planPrice: "19€/mes",
          planItems: [
            "Web optimitzada per SEO local",
            "Formularis i botons de contacte directe",
            "Edició àgil per campanyes i novetats",
          ],
          finalTitle: "No et quedis només en aparèixer: comença a convertir",
          finalSubtitle:
            "Activa el teu compte i transforma visites de Google en registres i vendes reals.",
        },
      }}
    />
  );
}
