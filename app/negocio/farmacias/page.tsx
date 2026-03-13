import BusinessLanding from '../_components/BusinessLanding'

export default function NegocioFarmaciasPage() {
  return (
    <BusinessLanding
      slug="farmacias"
      copy={{
        es: {
          badge: 'Genera confianza antes de la visita',
          title: 'Web para farmacias que mejora visibilidad y atención',
          subtitle:
            'Informa horarios, guardias, servicios y contacto en una web clara para que el cliente encuentre respuesta inmediata.',
          urgencyText:
            'Cuando la información no está clara, el cliente llama a otra farmacia.',
          trustLine:
            'Credibilidad digital con contenido útil y canal directo de contacto.',
          benefitsTitle: 'Qué aporta a tu farmacia',
          benefits: [
            'Horarios y guardias visibles en todo momento.',
            'Mayor confianza con servicios explicados claramente.',
            'Más consultas y pedidos desde canal propio.',
          ],
          processTitle: 'Implementación en 3 pasos',
          process: [
            {
              title: 'Publica servicios clave',
              description: 'Destaca lo que más buscan tus clientes en tu zona.',
            },
            {
              title: 'Ordena la información',
              description: 'Horarios, ubicación y contacto sin fricción.',
            },
            {
              title: 'Actualiza campañas',
              description: 'Novedades y promociones editadas en minutos.',
            },
          ],
          proofTitle: 'Farmacias que ya lo aplican',
          testimonials: [
            {
              quote:
                'Reducimos llamadas repetidas al dejar guardias y horarios claros.',
              author: 'Sonia L.',
              role: 'Farmacia de barrio',
            },
            {
              quote: 'Ahora recibimos más consultas útiles por WhatsApp.',
              author: 'Gabriel C.',
              role: 'Farmacia comunitaria',
            },
          ],
          planTitle: 'Plan recomendado para farmacias',
          planPrice: '19€/mes',
          planItems: [
            'Edición instantánea de horarios',
            'Contacto directo integrado',
            'SEO local para búsquedas urgentes',
          ],
          finalTitle: 'Haz que te encuentren y te contacten más rápido',
          finalSubtitle:
            'Crea tu cuenta y publica una web útil para tus clientes.',
          ctaPrimary: 'Crear cuenta gratis',
          ctaSecondary: 'Publicar mi web',
        },
        ca: {
          badge: 'Genera confiança abans de la visita',
          title: 'Web per a farmàcies que millora visibilitat i atenció',
          subtitle:
            'Informa horaris, guàrdies, serveis i contacte en una web clara perquè el client trobi resposta immediata.',
          urgencyText:
            'Quan la informació no és clara, el client truca a una altra farmàcia.',
          trustLine:
            'Credibilitat digital amb contingut útil i canal directe de contacte.',
          benefitsTitle: 'Què aporta a la teva farmàcia',
          benefits: [
            'Horaris i guàrdies visibles en tot moment.',
            'Més confiança amb serveis explicats clarament.',
            'Més consultes i comandes des de canal propi.',
          ],
          processTitle: 'Implementació en 3 passos',
          process: [
            {
              title: 'Publica serveis clau',
              description:
                'Destaca el que més busquen els teus clients a la zona.',
            },
            {
              title: 'Ordena la informació',
              description: 'Horaris, ubicació i contacte sense fricció.',
            },
            {
              title: 'Actualitza campanyes',
              description: 'Novetats i promocions editades en minuts.',
            },
          ],
          proofTitle: 'Farmàcies que ja ho apliquen',
          testimonials: [
            {
              quote:
                'Vam reduir trucades repetides deixant guàrdies i horaris clars.',
              author: 'Sonia L.',
              role: 'Farmàcia de barri',
            },
            {
              quote: 'Ara rebem més consultes útils per WhatsApp.',
              author: 'Gabriel C.',
              role: 'Farmàcia comunitària',
            },
          ],
          planTitle: 'Pla recomanat per a farmàcies',
          planPrice: '19€/mes',
          planItems: [
            "Edició instantània d'horaris",
            'Contacte directe integrat',
            'SEO local per cerques urgents',
          ],
          finalTitle: 'Fes que et trobin i et contactin més ràpid',
          finalSubtitle:
            'Crea el teu compte i publica una web útil per als teus clients.',
          ctaPrimary: 'Crear compte gratis',
          ctaSecondary: 'Publicar la meva web',
        },
      }}
    />
  )
}
