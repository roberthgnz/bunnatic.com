import BusinessLanding from '../_components/BusinessLanding'

export default function NegocioFotografosPage() {
  return (
    <BusinessLanding
      slug="fotografos"
      copy={{
        es: {
          badge: 'Muestra portfolio y cierra más sesiones',
          title: 'Web para fotógrafos orientada a solicitudes de presupuesto',
          subtitle:
            'Presenta tu estilo, packs y disponibilidad en una landing pensada para que te escriban con intención de contratar.',
          urgencyText:
            'Sin un portfolio bien estructurado, el lead compara y se enfría.',
          trustLine:
            'Portfolio + propuesta + formulario en un flujo simple de conversión.',
          benefitsTitle: 'Qué desbloquea para tu estudio',
          benefits: [
            'Más solicitudes cualificadas por tipo de sesión.',
            'Mejor percepción de valor y posicionamiento.',
            'Proceso de contacto más ordenado y medible.',
          ],
          processTitle: 'Activación rápida para captar mejor',
          process: [
            {
              title: 'Estructura tu oferta',
              description:
                'Bodas, retrato, eventos o marca personal por separado.',
            },
            {
              title: 'Guía la decisión',
              description:
                'Incluye pruebas visuales y argumentos de confianza.',
            },
            {
              title: 'Captura el lead',
              description: 'Formulario con datos clave para cerrar rápido.',
            },
          ],
          proofTitle: 'Fotógrafos que ya mejoraron conversión',
          testimonials: [
            {
              quote:
                'Con la nueva página recibimos presupuestos mejor definidos.',
              author: 'Laia C.',
              role: 'Fotografía de bodas',
            },
            {
              quote: 'Ahora filtra por tipo de sesión y perdemos menos tiempo.',
              author: 'Sergi B.',
              role: 'Estudio de retrato',
            },
          ],
          planTitle: 'Plan recomendado para fotógrafos',
          planPrice: '19€/mes',
          planItems: [
            'Landing optimizada para portfolio',
            'Formularios por tipo de servicio',
            'Editor visual para campañas estacionales',
          ],
          finalTitle: 'Convierte tu portfolio en un canal de ventas',
          finalSubtitle:
            'Crea tu cuenta y empieza a recibir mejores solicitudes.',
          ctaPrimary: 'Crear cuenta gratis',
          ctaSecondary: 'Ver demo',
        },
        ca: {
          badge: 'Mostra portfolio i tanca més sessions',
          title: 'Web per a fotògrafs orientada a sol·licituds de pressupost',
          subtitle:
            "Presenta el teu estil, packs i disponibilitat en una landing pensada perquè t'escriguin amb intenció de contractar.",
          urgencyText:
            'Sense un portfolio ben estructurat, el lead compara i es refreda.',
          trustLine:
            'Portfolio + proposta + formulari en un flux simple de conversió.',
          benefitsTitle: 'Què desbloqueja per al teu estudi',
          benefits: [
            'Més sol·licituds qualificades per tipus de sessió.',
            'Millor percepció de valor i posicionament.',
            'Procés de contacte més ordenat i mesurable.',
          ],
          processTitle: 'Activació ràpida per captar millor',
          process: [
            {
              title: 'Estructura la teva oferta',
              description:
                'Bodes, retrat, esdeveniments o marca personal per separat.',
            },
            {
              title: 'Guia la decisió',
              description: 'Inclou proves visuals i arguments de confiança.',
            },
            {
              title: 'Captura el lead',
              description: 'Formulari amb dades clau per tancar ràpid.',
            },
          ],
          proofTitle: 'Fotògrafs que ja han millorat conversió',
          testimonials: [
            {
              quote: 'Amb la nova pàgina rebem pressupostos millor definits.',
              author: 'Laia C.',
              role: 'Fotografia de casaments',
            },
            {
              quote: 'Ara filtra per tipus de sessió i perdem menys temps.',
              author: 'Sergi B.',
              role: 'Estudi de retrat',
            },
          ],
          planTitle: 'Pla recomanat per a fotògrafs',
          planPrice: '19€/mes',
          planItems: [
            'Landing optimitzada per portfolio',
            'Formularis per tipus de servei',
            'Editor visual per campanyes estacionals',
          ],
          finalTitle: 'Converteix el teu portfolio en un canal de vendes',
          finalSubtitle:
            'Crea el teu compte i comença a rebre millors sol·licituds.',
          ctaPrimary: 'Crear compte gratis',
          ctaSecondary: 'Veure demo',
        },
      }}
    />
  )
}
