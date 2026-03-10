import BusinessLanding from "../_components/BusinessLanding";

export default function NegocioGimnasiosPage() {
  return (
    <BusinessLanding
      slug="gimnasios"
      copy={{
        es: {
          badge: "Convierte interés en nuevas altas",
          title: "Web para gimnasios enfocada en registros y pruebas",
          subtitle:
            "Presenta planes, horarios y clases con una estructura que empuja a pedir prueba o apuntarse hoy.",
          urgencyText: "Sin una oferta clara online, el lead se enfría en minutos.",
          trustLine: "Más altas con CTAs de prueba, contacto inmediato y propuesta de valor visible.",
          benefitsTitle: "Resultados que puedes activar rápido",
          benefits: [
            "Más solicitudes de prueba desde móvil.",
            "Planes y precios explicados para reducir fricción.",
            "Captación de leads para seguimiento comercial.",
          ],
          processTitle: "Cómo activar captación de socios",
          process: [
            { title: "Define planes y promesas", description: "Mostramos qué consigue cada tipo de cliente contigo." },
            { title: "Configura lead magnet", description: "Prueba gratis o sesión inicial como CTA principal." },
            { title: "Mide y mejora", description: "Itera mensajes según qué plan convierte más." },
          ],
          proofTitle: "Experiencias del sector fitness",
          testimonials: [
            { quote: "Duplicamos pruebas semanales con una landing clara por objetivos.", author: "Ruth M.", role: "Box de entrenamiento" },
            { quote: "La web nos filtra mejor y llegan leads más decididos.", author: "Héctor A.", role: "Gimnasio de barrio" },
          ],
          planTitle: "Plan recomendado para gimnasios",
          planPrice: "19€/mes",
          planItems: ["Formularios orientados a prueba", "Editor visual para campañas", "SEO local por zona"],
          finalTitle: "Empieza a captar más socios desde esta semana",
          finalSubtitle: "Crea tu cuenta y transforma visitas en altas.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Ver demo",
        },
        ca: {
          badge: "Converteix interès en noves altes",
          title: "Web per a gimnasos enfocada en registres i proves",
          subtitle:
            "Presenta plans, horaris i classes amb una estructura que empeny a demanar prova o apuntar-se avui.",
          urgencyText: "Sense una oferta clara online, el lead es refreda en minuts.",
          trustLine: "Més altes amb CTAs de prova, contacte immediat i proposta de valor visible.",
          benefitsTitle: "Resultats que pots activar ràpid",
          benefits: [
            "Més sol·licituds de prova des de mòbil.",
            "Plans i preus explicats per reduir fricció.",
            "Captació de leads per seguiment comercial.",
          ],
          processTitle: "Com activar captació de socis",
          process: [
            { title: "Defineix plans i promeses", description: "Mostrem què aconsegueix cada tipus de client amb tu." },
            { title: "Configura lead magnet", description: "Prova gratis o sessió inicial com a CTA principal." },
            { title: "Mesura i millora", description: "Itera missatges segons quin pla converteix més." },
          ],
          proofTitle: "Experiències del sector fitness",
          testimonials: [
            { quote: "Vam duplicar proves setmanals amb una landing clara per objectius.", author: "Ruth M.", role: "Box d'entrenament" },
            { quote: "La web ens filtra millor i arriben leads més decidits.", author: "Héctor A.", role: "Gimnàs de barri" },
          ],
          planTitle: "Pla recomanat per a gimnasos",
          planPrice: "19€/mes",
          planItems: ["Formularis orientats a prova", "Editor visual per campanyes", "SEO local per zona"],
          finalTitle: "Comença a captar més socis des d'aquesta setmana",
          finalSubtitle: "Crea el teu compte i transforma visites en altes.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Veure demo",
        },
      }}
    />
  );
}
