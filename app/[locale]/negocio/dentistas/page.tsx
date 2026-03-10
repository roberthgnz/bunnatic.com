import BusinessLanding from "../_components/BusinessLanding";

export default function NegocioDentistasPage() {
  return (
    <BusinessLanding
      slug="dentistas"
      copy={{
        es: {
          badge: "Más primeras visitas y tratamientos cerrados",
          title: "Web para clínicas dentales con enfoque de conversión",
          subtitle:
            "Explica tratamientos, financiación y confianza clínica para que el paciente avance del interés a la cita.",
          urgencyText: "Sin una propuesta clara, los pacientes comparan solo por precio.",
          trustLine: "Web profesional con pruebas de confianza y contacto inmediato.",
          benefitsTitle: "Qué aporta a tu clínica dental",
          benefits: [
            "Más solicitudes de primera visita.",
            "Mayor claridad de tratamientos y opciones.",
            "Captación de pacientes desde búsquedas locales.",
          ],
          processTitle: "Cómo activarlo paso a paso",
          process: [
            { title: "Ordena tu oferta clínica", description: "Implantes, ortodoncia y estética con mensajes claros." },
            { title: "Activa credenciales y confianza", description: "Reseñas y argumentos que reducen objeciones." },
            { title: "Optimiza el contacto", description: "CTA directo para agendar visita inicial." },
          ],
          proofTitle: "Clínicas dentales que lo están usando",
          testimonials: [
            { quote: "Mejoramos ratio de consulta a cita tras reorganizar tratamientos en la web.", author: "Marta H.", role: "Clínica dental" },
            { quote: "Recibimos más contactos cualificados desde Google local.", author: "Javier L.", role: "Centro odontológico" },
          ],
          planTitle: "Plan recomendado para dentistas",
          planPrice: "19€/mes",
          planItems: ["Contenido orientado a confianza", "Contacto directo para primera visita", "Editor visual de promociones y campañas"],
          finalTitle: "Convierte búsquedas en pacientes reales",
          finalSubtitle: "Regístrate y activa tu web dental enfocada a captación.",
          ctaPrimary: "Crear cuenta gratis",
          ctaSecondary: "Probar demo",
        },
        ca: {
          badge: "Més primeres visites i tractaments tancats",
          title: "Web per a clíniques dentals amb enfocament de conversió",
          subtitle:
            "Explica tractaments, finançament i confiança clínica perquè el pacient passi de l'interès a la cita.",
          urgencyText: "Sense una proposta clara, els pacients comparen només per preu.",
          trustLine: "Web professional amb proves de confiança i contacte immediat.",
          benefitsTitle: "Què aporta a la teva clínica dental",
          benefits: [
            "Més sol·licituds de primera visita.",
            "Més claredat de tractaments i opcions.",
            "Captació de pacients des de cerques locals.",
          ],
          processTitle: "Com activar-ho pas a pas",
          process: [
            { title: "Ordena la teva oferta clínica", description: "Implants, ortodòncia i estètica amb missatges clars." },
            { title: "Activa credencials i confiança", description: "Ressenyes i arguments que redueixen objeccions." },
            { title: "Optimitza el contacte", description: "CTA directe per agendar visita inicial." },
          ],
          proofTitle: "Clíniques dentals que ja ho fan servir",
          testimonials: [
            { quote: "Vam millorar ràtio de consulta a cita després de reorganitzar tractaments a la web.", author: "Marta H.", role: "Clínica dental" },
            { quote: "Rebem més contactes qualificats des de Google local.", author: "Javier L.", role: "Centre odontològic" },
          ],
          planTitle: "Pla recomanat per dentistes",
          planPrice: "19€/mes",
          planItems: ["Contingut orientat a confiança", "Contacte directe per primera visita", "Editor visual de promocions i campanyes"],
          finalTitle: "Converteix cerques en pacients reals",
          finalSubtitle: "Registra't i activa la teva web dental enfocada a captació.",
          ctaPrimary: "Crear compte gratis",
          ctaSecondary: "Provar demo",
        },
      }}
    />
  );
}
