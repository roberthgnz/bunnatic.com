import BusinessLanding from "../_components/BusinessLanding";

export default function NegocioVeterinariosPage() {
  return (
    <BusinessLanding
      slug="veterinarios"
      copy={{
        es: {
          badge: "Más citas y urgencias bien atendidas",
          title: "Web para clínicas veterinarias enfocada en contacto inmediato",
          subtitle:
            "Facilita que los dueños encuentren servicios, horarios y canales de urgencia para convertir búsquedas en citas reales.",
          urgencyText: "En veterinaria, cada minuto sin información clara puede costar una visita.",
          trustLine: "Canal directo para primera cita, revisiones y atención urgente.",
          benefitsTitle: "Qué mejora en tu clínica",
          benefits: [
            "Más citas programadas desde móvil.",
            "Menos llamadas repetidas por información básica.",
            "Mejor experiencia para dueños en situación urgente.",
          ],
          processTitle: "Flujo de captación recomendado",
          process: [
            { title: "Organiza servicios y especialidades", description: "Vacunas, revisiones y urgencias bien visibles." },
            { title: "Destaca contacto urgente", description: "Botones directos para responder rápido." },
            { title: "Optimiza por zona", description: "Aparece en búsquedas locales de alta intención." },
          ],
          proofTitle: "Veterinarios que ya optimizaron su captación",
          testimonials: [
            { quote: "Mejoramos respuesta en urgencias al centralizar contacto en la web.", author: "Elena D.", role: "Clínica veterinaria" },
            { quote: "Subieron citas de revisión con una oferta más clara.", author: "Toni M.", role: "Hospital veterinario local" },
          ],
          planTitle: "Plan recomendado para veterinarios",
          planPrice: "19€/mes",
          planItems: ["WhatsApp y llamada directa", "Edición ágil de horarios", "SEO local para servicios veterinarios"],
          finalTitle: "Haz que te encuentren cuando más te necesitan",
          finalSubtitle: "Crea tu cuenta y activa una web clara para captar más citas.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Ver demo",
        },
        ca: {
          badge: "Més cites i urgències ben ateses",
          title: "Web per a clíniques veterinàries enfocada en contacte immediat",
          subtitle:
            "Facilita que els propietaris trobin serveis, horaris i canals d'urgència per convertir cerques en cites reals.",
          urgencyText: "En veterinària, cada minut sense informació clara pot costar una visita.",
          trustLine: "Canal directe per primera cita, revisions i atenció urgent.",
          benefitsTitle: "Què millora a la teva clínica",
          benefits: [
            "Més cites programades des de mòbil.",
            "Menys trucades repetides per informació bàsica.",
            "Millor experiència per als propietaris en situació urgent.",
          ],
          processTitle: "Flux de captació recomanat",
          process: [
            { title: "Organitza serveis i especialitats", description: "Vacunes, revisions i urgències ben visibles." },
            { title: "Destaca contacte urgent", description: "Botons directes per respondre ràpid." },
            { title: "Optimitza per zona", description: "Apareix en cerques locals d'alta intenció." },
          ],
          proofTitle: "Veterinaris que ja han optimitzat captació",
          testimonials: [
            { quote: "Vam millorar resposta en urgències centralitzant contacte a la web.", author: "Elena D.", role: "Clínica veterinària" },
            { quote: "Van pujar cites de revisió amb una oferta més clara.", author: "Toni M.", role: "Hospital veterinari local" },
          ],
          planTitle: "Pla recomanat per veterinaris",
          planPrice: "19€/mes",
          planItems: ["WhatsApp i trucada directa", "Edició àgil d'horaris", "SEO local per serveis veterinaris"],
          finalTitle: "Fes que et trobin quan més et necessiten",
          finalSubtitle: "Crea el teu compte i activa una web clara per captar més cites.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Veure demo",
        },
      }}
    />
  );
}
