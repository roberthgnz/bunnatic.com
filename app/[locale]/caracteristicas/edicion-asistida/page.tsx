import FeatureLanding from "../_components/FeatureLanding";

export default function EdicionAsistidaPage() {
  return (
    <FeatureLanding
      slug="edicion-asistida"
      icon="MessageSquare"
      copy={{
        es: {
          badge: "Edita en segundos, sin depender de nadie",
          title: "Editor visual para vender más cada semana",
          subtitle:
            "Actualiza horarios, servicios y promociones con el editor visual para que tu web siempre esté alineada con lo que estás vendiendo hoy.",
          urgencyText: "Web desactualizada = clientes que dudan y no contactan.",
          trustLine: "Cambios inmediatos, sin tickets técnicos y sin romper el diseño.",
          outcomesTitle: "Ventajas de negocio inmediatas",
          outcomes: [
            "Publicas ofertas y cambios de precio en minutos.",
            "Mantienes la información clave siempre actualizada.",
            "Mejoras conversiones al reducir fricción y dudas del cliente.",
          ],
          processTitle: "Cómo funciona en el día a día",
          process: [
            {
              title: "Actualizas con el editor visual",
              description:
                "Editas bloques, textos e imágenes directamente en un flujo visual muy simple.",
            },
            {
              title: "La IA recomienda y optimiza",
              description:
                "Actualiza texto y estructura manteniendo una redacción enfocada a venta.",
            },
            {
              title: "Publicas al instante",
              description:
                "Los cambios quedan visibles en pocos segundos para no perder oportunidades.",
            },
          ],
          objectionsTitle: "Dudas frecuentes",
          objections: [
            {
              q: "¿Puedo romper algo al editar?",
              a: "No. El sistema mantiene estructura y estilos consistentes para evitar errores de maquetación.",
            },
            {
              q: "¿La IA entiende cambios específicos?",
              a: "Sí. Puedes indicar detalles concretos como fechas, servicios, precios y llamadas a la acción.",
            },
          ],
          proofTitle: "Qué nos dicen los negocios",
          testimonials: [
            {
              quote:
                "Antes tardábamos días en cambiar promos. Ahora lo hacemos en 2 minutos.",
              author: "Helena G.",
              role: "Peluquería",
            },
            {
              quote:
                "El editor visual nos quitó el cuello de botella del técnico externo.",
              author: "Iván T.",
              role: "Centro deportivo",
            },
          ],
          planTitle: "Plan recomendado para edición continua",
          planPrice: "19€/mes",
          planItems: [
            "Editor visual con recomendaciones de IA ilimitadas",
            "Bloques y textos optimizados para conversión",
            "Soporte prioritario cuando lo necesites",
          ],
          finalTitle: "Haz cambios cuando tu negocio lo necesite",
          finalSubtitle:
            "Regístrate ahora y mantén tu web vendiendo todos los días, no solo cuando te da tiempo.",
          ctaPrimary: "Crear cuenta ahora",
          ctaSecondary: "Probar editor visual",
        },
        ca: {
          badge: "Edita en segons, sense dependre de ningú",
          title: "Editor visual per vendre més cada setmana",
          subtitle:
            "Actualitza horaris, serveis i promocions amb l'editor visual perquè la teva web sempre estigui alineada amb el que vens avui.",
          urgencyText: "Web desactualitzada = clients que dubten i no contacten.",
          trustLine: "Canvis immediats, sense tickets tècnics i sense trencar el disseny.",
          outcomesTitle: "Avantatges de negoci immediates",
          outcomes: [
            "Publiques ofertes i canvis de preu en minuts.",
            "Mantens la informació clau sempre actualitzada.",
            "Millores conversions reduint fricció i dubtes del client.",
          ],
          processTitle: "Com funciona al dia a dia",
          process: [
            {
              title: "Actualitzes amb l'editor visual",
              description:
                "Edits blocs, textos i imatges directament en un flux visual molt simple.",
            },
            {
              title: "La IA recomana i optimitza",
              description:
                "Actualitza text i estructura mantenint redacció enfocada a venda.",
            },
            {
              title: "Publiques a l'instant",
              description:
                "Els canvis queden visibles en pocs segons per no perdre oportunitats.",
            },
          ],
          objectionsTitle: "Dubtes freqüents",
          objections: [
            {
              q: "Puc trencar alguna cosa en editar?",
              a: "No. El sistema manté estructura i estils consistents per evitar errors de maquetació.",
            },
            {
              q: "La IA entén canvis específics?",
              a: "Sí. Pots indicar detalls concrets com dates, serveis, preus i crides a l'acció.",
            },
          ],
          proofTitle: "Què ens diuen els negocis",
          testimonials: [
            {
              quote:
                "Abans trigàvem dies a canviar promos. Ara ho fem en 2 minuts.",
              author: "Helena G.",
              role: "Perruqueria",
            },
            {
              quote:
                "L'editor visual ens va treure el coll d'ampolla del tècnic extern.",
              author: "Iván T.",
              role: "Centre esportiu",
            },
          ],
          planTitle: "Pla recomanat per edició contínua",
          planPrice: "19€/mes",
          planItems: [
            "Editor visual amb recomanacions d'IA il·limitades",
            "Blocs i textos optimitzats per conversió",
            "Suport prioritari quan el necessitis",
          ],
          finalTitle: "Fes canvis quan el teu negoci ho necessiti",
          finalSubtitle:
            "Registra't ara i mantén la teva web venent cada dia, no només quan tens temps.",
          ctaPrimary: "Crear compte ara",
          ctaSecondary: "Provar editor visual",
        },
      }}
    />
  );
}
