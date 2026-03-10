import BusinessLanding from "../_components/BusinessLanding";

export default function NegocioPeluqueriasPage() {
  return (
    <BusinessLanding
      slug="peluquerias"
      copy={{
        es: {
          badge: "Capta más citas sin depender de Instagram",
          title: "Web para peluquerías que convierte visitas en reservas",
          subtitle:
            "Muestra cortes, precios y disponibilidad en una página pensada para que te escriban o reserven en el momento.",
          urgencyText: "Cada cliente que no encuentra precio u horario claro se va con otra peluquería.",
          trustLine: "Web móvil + WhatsApp + formulario para llenar agenda con menos fricción.",
          benefitsTitle: "Qué mejora en tu peluquería",
          benefits: [
            "Más citas desde Google y redes en una sola página.",
            "Servicios y tarifas visibles para reducir preguntas repetidas.",
            "Promociones y packs actualizables en minutos.",
          ],
          processTitle: "Cómo lo activas esta semana",
          process: [
            { title: "Configura tus servicios", description: "Cortes, color y tratamientos con enfoque comercial." },
            { title: "Publica CTAs directos", description: "Botones claros de llamada, WhatsApp y reserva." },
            { title: "Ajusta según demanda", description: "Edita ofertas por temporada sin depender de terceros." },
          ],
          proofTitle: "Casos de peluquerías locales",
          testimonials: [
            { quote: "Subimos reservas de color al explicar mejor los packs en la web.", author: "Clara V.", role: "Peluquería unisex" },
            { quote: "Con un solo enlace pasamos de mensajes sueltos a citas claras.", author: "Marc R.", role: "Barbería" },
          ],
          planTitle: "Plan recomendado para peluquerías",
          planPrice: "19€/mes",
          planItems: ["Editor visual ilimitado", "Formulario + WhatsApp", "SEO local para búsquedas cercanas"],
          finalTitle: "Llena agenda con una web que sí convierte",
          finalSubtitle: "Crea tu cuenta y empieza a captar citas desde hoy.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Probar demo",
        },
        ca: {
          badge: "Capta més cites sense dependre d'Instagram",
          title: "Web per a perruqueries que converteix visites en reserves",
          subtitle:
            "Mostra talls, preus i disponibilitat en una pàgina pensada perquè t'escriguin o reservin al moment.",
          urgencyText: "Cada client que no troba preu o horari clar marxa a una altra perruqueria.",
          trustLine: "Web mòbil + WhatsApp + formulari per omplir agenda amb menys fricció.",
          benefitsTitle: "Què millora a la teva perruqueria",
          benefits: [
            "Més cites des de Google i xarxes en una sola pàgina.",
            "Serveis i tarifes visibles per reduir preguntes repetides.",
            "Promocions i packs actualitzables en minuts.",
          ],
          processTitle: "Com ho actives aquesta setmana",
          process: [
            { title: "Configura els teus serveis", description: "Talls, color i tractaments amb enfocament comercial." },
            { title: "Publica CTAs directes", description: "Botons clars de trucada, WhatsApp i reserva." },
            { title: "Ajusta segons demanda", description: "Edita ofertes per temporada sense dependre de tercers." },
          ],
          proofTitle: "Casos de perruqueries locals",
          testimonials: [
            { quote: "Vam pujar reserves de color explicant millor els packs a la web.", author: "Clara V.", role: "Perruqueria unisex" },
            { quote: "Amb un sol enllaç vam passar de missatges solts a cites clares.", author: "Marc R.", role: "Barberia" },
          ],
          planTitle: "Pla recomanat per a perruqueries",
          planPrice: "19€/mes",
          planItems: ["Editor visual il·limitat", "Formulari + WhatsApp", "SEO local per cerques properes"],
          finalTitle: "Omple agenda amb una web que sí converteix",
          finalSubtitle: "Crea el teu compte i comença a captar cites des d'avui.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Provar demo",
        },
      }}
    />
  );
}
