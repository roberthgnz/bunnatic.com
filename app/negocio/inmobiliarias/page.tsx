import BusinessLanding from '../_components/BusinessLanding'

export default function NegocioInmobiliariasPage() {
  return (
    <BusinessLanding
      slug="inmobiliarias"
      copy={{
        es: {
          badge: 'Capta compradores y propietarios con mejor filtro',
          title: 'Web para inmobiliarias enfocada a leads de calidad',
          subtitle:
            'Publica servicios y propuesta comercial con una estructura que convierte visitas en solicitudes claras.',
          urgencyText:
            'Sin web optimizada, pierdes leads frente a portales y competencia local.',
          trustLine:
            'Canal propio para captar, filtrar y dar seguimiento a oportunidades.',
          benefitsTitle: 'Qué mejora en tu inmobiliaria',
          benefits: [
            'Más solicitudes de venta y captación de inmuebles.',
            'Leads con mejor información inicial.',
            'Imagen profesional para cerrar más reuniones.',
          ],
          processTitle: 'Cómo activarlo en pocos días',
          process: [
            {
              title: 'Define servicios y zonas',
              description: 'Compra, venta y alquiler con foco por área.',
            },
            {
              title: 'Activa formularios específicos',
              description:
                'Captación de propietarios y compradores por separado.',
            },
            {
              title: 'Optimiza mensajes',
              description:
                'Ajusta propuesta según tipo de lead que más cierra.',
            },
          ],
          proofTitle: 'Inmobiliarias que ya escalaron captación',
          testimonials: [
            {
              quote:
                'Subimos contactos de propietarios al aclarar propuesta y proceso.',
              author: 'Bea F.',
              role: 'Agencia inmobiliaria',
            },
            {
              quote:
                'Llegan leads mejor filtrados para compradores e inversores.',
              author: 'Álex T.',
              role: 'Broker local',
            },
          ],
          planTitle: 'Plan recomendado para inmobiliarias',
          planPrice: '19€/mes',
          planItems: [
            'Formularios segmentados por lead',
            'SEO local por zona',
            'Editor visual para nuevas campañas',
          ],
          finalTitle: 'Convierte tu web en máquina de captación',
          finalSubtitle:
            'Regístrate y empieza a generar leads más cualificados.',
          ctaPrimary: 'Crear cuenta gratis',
          ctaSecondary: 'Ver en acción',
        },
        ca: {
          badge: 'Capta compradors i propietaris amb millor filtre',
          title: 'Web per a immobiliàries enfocada a leads de qualitat',
          subtitle:
            'Publica serveis i proposta comercial amb una estructura que converteix visites en sol·licituds clares.',
          urgencyText:
            'Sense web optimitzada, perds leads davant portals i competència local.',
          trustLine:
            "Canal propi per captar, filtrar i fer seguiment d'oportunitats.",
          benefitsTitle: 'Què millora a la teva immobiliària',
          benefits: [
            "Més sol·licituds de venda i captació d'immobles.",
            'Leads amb millor informació inicial.',
            'Imatge professional per tancar més reunions.',
          ],
          processTitle: 'Com activar-ho en pocs dies',
          process: [
            {
              title: 'Defineix serveis i zones',
              description: 'Compra, venda i lloguer amb focus per àrea.',
            },
            {
              title: 'Activa formularis específics',
              description: 'Captació de propietaris i compradors per separat.',
            },
            {
              title: 'Optimitza missatges',
              description:
                'Ajusta proposta segons tipus de lead que més tanca.',
            },
          ],
          proofTitle: 'Immobiliàries que ja han escalat captació',
          testimonials: [
            {
              quote:
                'Vam pujar contactes de propietaris aclarint proposta i procés.',
              author: 'Bea F.',
              role: 'Agència immobiliària',
            },
            {
              quote:
                'Arriben leads millor filtrats per a compradors i inversors.',
              author: 'Álex T.',
              role: 'Broker local',
            },
          ],
          planTitle: 'Pla recomanat per immobiliàries',
          planPrice: '19€/mes',
          planItems: [
            'Formularis segmentats per lead',
            'SEO local per zona',
            'Editor visual per noves campanyes',
          ],
          finalTitle: 'Converteix la teva web en màquina de captació',
          finalSubtitle:
            "Registra't i comença a generar leads més qualificats.",
          ctaPrimary: 'Crear compte gratis',
          ctaSecondary: 'Provar demo',
        },
      }}
    />
  )
}
