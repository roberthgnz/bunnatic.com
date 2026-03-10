import BusinessLanding from "../_components/BusinessLanding";

export default function NegocioEsteticasPage() {
  return (
    <BusinessLanding
      slug="esteticas"
      copy={{
        es: {
          badge: "Más tratamientos reservados",
          title: "Web para centros de estética enfocada a reservas",
          subtitle:
            "Convierte visitas en citas mostrando tratamientos, resultados y promociones en una experiencia clara y profesional.",
          urgencyText: "Sin una oferta bien presentada, pierdes citas frente a competencia mejor posicionada.",
          trustLine: "Diseño premium + prueba social + CTA directo a reserva.",
          benefitsTitle: "Lo que ganas en tu centro",
          benefits: [
            "Más reservas de tratamientos de mayor ticket.",
            "Mejor percepción de marca y confianza.",
            "Promociones activables en tiempo real.",
          ],
          processTitle: "Cómo arrancar sin complicaciones",
          process: [
            { title: "Define tratamientos clave", description: "Destacamos servicios con mayor conversión y margen." },
            { title: "Activa mensajes de confianza", description: "Incluye testimonios y argumentos que cierran objeciones." },
            { title: "Capta contactos al instante", description: "Formulario y WhatsApp para reservar en caliente." },
          ],
          proofTitle: "Resultados en estética local",
          testimonials: [
            { quote: "Con una página mejor estructurada subieron las reservas de bono.", author: "Paula S.", role: "Centro estético" },
            { quote: "Ahora los clientes llegan con el tratamiento decidido.", author: "Andrea N.", role: "Clínica dermoestética" },
          ],
          planTitle: "Plan recomendado para estética",
          planPrice: "19€/mes",
          planItems: ["Páginas de servicio optimizadas", "Contacto directo y rápido", "Editor visual para campañas estacionales"],
          finalTitle: "Haz crecer tus reservas desde la web",
          finalSubtitle: "Regístrate y publica una página pensada para vender tratamientos.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Probar demo",
        },
        ca: {
          badge: "Més tractaments reservats",
          title: "Web per a centres d'estètica enfocada a reserves",
          subtitle:
            "Converteix visites en cites mostrant tractaments, resultats i promocions en una experiència clara i professional.",
          urgencyText: "Sense una oferta ben presentada, perds cites davant competència millor posicionada.",
          trustLine: "Disseny premium + prova social + CTA directe a reserva.",
          benefitsTitle: "El que guanyes al teu centre",
          benefits: [
            "Més reserves de tractaments de tiquet més alt.",
            "Millor percepció de marca i confiança.",
            "Promocions activables en temps real.",
          ],
          processTitle: "Com arrencar sense complicacions",
          process: [
            { title: "Defineix tractaments clau", description: "Destaquem serveis amb més conversió i marge." },
            { title: "Activa missatges de confiança", description: "Inclou testimonis i arguments que tanquen objeccions." },
            { title: "Capta contactes a l'instant", description: "Formulari i WhatsApp per reservar en calent." },
          ],
          proofTitle: "Resultats en estètica local",
          testimonials: [
            { quote: "Amb una pàgina millor estructurada van pujar les reserves de bo.", author: "Paula S.", role: "Centre estètic" },
            { quote: "Ara els clients arriben amb el tractament decidit.", author: "Andrea N.", role: "Clínica dermoestètica" },
          ],
          planTitle: "Pla recomanat per estètica",
          planPrice: "19€/mes",
          planItems: ["Pàgines de servei optimitzades", "Contacte directe i ràpid", "Editor visual per campanyes estacionals"],
          finalTitle: "Fes créixer les teves reserves des de la web",
          finalSubtitle: "Registra't i publica una pàgina pensada per vendre tractaments.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Provar demo",
        },
      }}
    />
  );
}
