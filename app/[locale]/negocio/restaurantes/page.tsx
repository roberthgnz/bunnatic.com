import BusinessLanding from "../_components/BusinessLanding";

export default function NegocioRestaurantesPage() {
  return (
    <BusinessLanding
      slug="restaurantes"
      copy={{
        es: {
          badge: "Más mesas con menos llamadas perdidas",
          title: "Web para restaurantes orientada a reservas y pedidos",
          subtitle:
            "Carta, horarios, ubicación y reservas en un flujo simple para que el cliente decida rápido y contacte sin fricción.",
          urgencyText: "Si el cliente no encuentra menú o disponibilidad en segundos, abandona.",
          trustLine: "Tu web como canal de captación propio, más allá de apps de terceros.",
          benefitsTitle: "Impacto directo en el negocio",
          benefits: [
            "Más reservas directas sin intermediarios.",
            "Información de menú y horarios siempre actualizada.",
            "Mejor conversión de tráfico desde Google Maps.",
          ],
          processTitle: "Implementación rápida",
          process: [
            { title: "Sube menú y propuesta", description: "Destacamos platos estrella y diferenciales del local." },
            { title: "Activa reservas/contacto", description: "Botones visibles para reservar o pedir información." },
            { title: "Optimiza por servicio", description: "Ajusta campañas para mediodía, cenas o eventos." },
          ],
          proofTitle: "Lo que reportan restaurantes",
          testimonials: [
            { quote: "Pasamos tráfico de Google a reservas directas con mejor margen.", author: "Nerea T.", role: "Restaurante mediterráneo" },
            { quote: "La gente llega más informada y con menos dudas sobre carta y horarios.", author: "Joan P.", role: "Brasería local" },
          ],
          planTitle: "Plan recomendado para restaurantes",
          planPrice: "19€/mes",
          planItems: ["Web optimizada para móvil", "CTA a reserva y WhatsApp", "Editor visual para menú y promos"],
          finalTitle: "Convierte búsquedas en mesas ocupadas",
          finalSubtitle: "Activa tu web y empieza a captar reservas directas.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Publicar mi web",
        },
        ca: {
          badge: "Més taules amb menys trucades perdudes",
          title: "Web per a restaurants orientada a reserves i comandes",
          subtitle:
            "Carta, horaris, ubicació i reserves en un flux simple perquè el client decideixi ràpid i contacti sense fricció.",
          urgencyText: "Si el client no troba menú o disponibilitat en segons, abandona.",
          trustLine: "La teva web com a canal de captació propi, més enllà d'apps de tercers.",
          benefitsTitle: "Impacte directe al negoci",
          benefits: [
            "Més reserves directes sense intermediaris.",
            "Informació de menú i horaris sempre actualitzada.",
            "Millor conversió de trànsit des de Google Maps.",
          ],
          processTitle: "Implementació ràpida",
          process: [
            { title: "Puja menú i proposta", description: "Destaquem plats estrella i diferencials del local." },
            { title: "Activa reserves/contacte", description: "Botons visibles per reservar o demanar informació." },
            { title: "Optimitza per servei", description: "Ajusta campanyes per migdia, nits o esdeveniments." },
          ],
          proofTitle: "El que reporten restaurants",
          testimonials: [
            { quote: "Vam passar trànsit de Google a reserves directes amb millor marge.", author: "Nerea T.", role: "Restaurant mediterrani" },
            { quote: "La gent arriba més informada i amb menys dubtes sobre carta i horaris.", author: "Joan P.", role: "Braseria local" },
          ],
          planTitle: "Pla recomanat per a restaurants",
          planPrice: "19€/mes",
          planItems: ["Web optimitzada per mòbil", "CTA a reserva i WhatsApp", "Editor visual per menú i promos"],
          finalTitle: "Converteix cerques en taules ocupades",
          finalSubtitle: "Activa la teva web i comença a captar reserves directes.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Publicar la meva web",
        },
      }}
    />
  );
}
