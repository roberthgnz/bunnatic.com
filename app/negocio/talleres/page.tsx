import BusinessLanding from '../_components/BusinessLanding'

export default function NegocioTalleresPage() {
  return (
    <BusinessLanding
      slug="talleres"
      copy={{
        es: {
          badge: 'Más entradas al taller desde búsquedas locales',
          title: 'Web para talleres con foco en llamadas y citas',
          subtitle:
            'Haz que te encuentren rápido, entiendan tus servicios y pidan cita con un clic desde móvil.',
          urgencyText:
            'Si no apareces claro en Google, el cliente llama al primer competidor.',
          trustLine:
            'Canal directo para reparaciones, revisiones y urgencias mecánicas.',
          benefitsTitle: 'Qué resultados puedes esperar',
          benefits: [
            'Más llamadas de clientes cercanos.',
            'Servicios y especialidades mejor explicados.',
            'Menor pérdida de leads por falta de información.',
          ],
          processTitle: 'Activación sin complejidad técnica',
          process: [
            {
              title: 'Publica servicios clave',
              description: 'Revisión, neumáticos, frenos, diagnosis y más.',
            },
            {
              title: 'Optimiza contacto inmediato',
              description:
                'Botón de llamada y WhatsApp con máxima visibilidad.',
            },
            {
              title: 'Ajusta por temporada',
              description:
                'Campañas para ITV, vacaciones o mantenimiento preventivo.',
            },
          ],
          proofTitle: 'Talleres que ya mejoraron captación',
          testimonials: [
            {
              quote:
                'Subieron llamadas en la primera semana con la nueva página.',
              author: 'Rubén G.',
              role: 'Taller multimarca',
            },
            {
              quote: 'Ahora los clientes entienden servicios antes de llamar.',
              author: 'Nico P.',
              role: 'Taller de barrio',
            },
          ],
          planTitle: 'Plan recomendado para talleres',
          planPrice: '19€/mes',
          planItems: [
            'CTA de llamada directa',
            'SEO local técnico',
            'Editor visual para campañas por temporada',
          ],
          finalTitle: 'Convierte búsquedas en citas de taller',
          finalSubtitle: 'Crea tu cuenta y activa una web que te trae trabajo.',
          ctaPrimary: 'Crear cuenta gratis',
          ctaSecondary: 'Publicar mi web',
        },
        ca: {
          badge: 'Més entrades al taller des de cerques locals',
          title: 'Web per a tallers amb focus en trucades i cites',
          subtitle:
            'Fes que et trobin ràpid, entenguin els teus serveis i demanin cita amb un clic des de mòbil.',
          urgencyText:
            'Si no apareixes clar a Google, el client truca al primer competidor.',
          trustLine:
            'Canal directe per reparacions, revisions i urgències mecàniques.',
          benefitsTitle: 'Quins resultats pots esperar',
          benefits: [
            'Més trucades de clients propers.',
            'Serveis i especialitats millor explicats.',
            "Menys pèrdua de leads per manca d'informació.",
          ],
          processTitle: 'Activació sense complexitat tècnica',
          process: [
            {
              title: 'Publica serveis clau',
              description: 'Revisió, pneumàtics, frens, diagnosis i més.',
            },
            {
              title: 'Optimitza contacte immediat',
              description: 'Botó de trucada i WhatsApp amb màxima visibilitat.',
            },
            {
              title: 'Ajusta per temporada',
              description:
                'Campanyes per ITV, vacances o manteniment preventiu.',
            },
          ],
          proofTitle: 'Tallers que ja han millorat captació',
          testimonials: [
            {
              quote:
                'Van pujar trucades la primera setmana amb la nova pàgina.',
              author: 'Rubén G.',
              role: 'Taller multimarca',
            },
            {
              quote: 'Ara els clients entenen serveis abans de trucar.',
              author: 'Nico P.',
              role: 'Taller de barri',
            },
          ],
          planTitle: 'Pla recomanat per tallers',
          planPrice: '19€/mes',
          planItems: [
            'CTA de trucada directa',
            'SEO local tècnic',
            'Editor visual per campanyes de temporada',
          ],
          finalTitle: 'Converteix cerques en cites de taller',
          finalSubtitle:
            'Crea el teu compte i activa una web que et porta feina.',
          ctaPrimary: 'Crear compte gratis',
          ctaSecondary: 'Publicar la meva web',
        },
      }}
    />
  )
}
