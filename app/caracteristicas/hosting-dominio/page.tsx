import type { Metadata } from 'next'
import FeatureLanding from '../_components/FeatureLanding'
import { getFeatureSlug } from '@/lib/pageSlugs'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Hosting y Dominio Incluido - Web Rápida y Segura | Bunnatic',
    description:
      'Hosting profesional con SSL, dominio personalizado y velocidad optimizada incluidos. Infraestructura segura y estable para que tu web esté siempre disponible.',
    esPath: `/caracteristicas/${getFeatureSlug('hosting-dominio')}`,
    caPath: `/caracteristicas/${getFeatureSlug('hosting-dominio')}`,
    keywords: [
      'hosting incluido',
      'dominio web',
      'hosting rápido',
      'ssl gratis',
      'alojamiento web',
      'hosting seguro',
    ],
  })
}

export default function HostingDominioPage() {
  return (
    <FeatureLanding
      slug="hosting-dominio"
      icon="Globe"
      copy={{
        badge: 'Todo técnico resuelto desde el inicio',
        title: 'Hosting y dominio incluidos para vender sin fricción',
        subtitle:
          'Tu web se publica con infraestructura segura y rápida para que no pierdas clientes por caídas, lentitud o problemas de configuración.',
        urgencyText:
          'Cada fallo técnico afecta confianza, posicionamiento y conversiones.',
        trustLine:
          'SSL, rendimiento y disponibilidad listos para que te centres en negocio.',
        outcomesTitle: 'Beneficios reales para tu facturación',
        outcomes: [
          'Web estable para no perder oportunidades en horas clave.',
          'Carga rápida que mejora experiencia y tasa de contacto.',
          'Configuración simple con dominio listo para marca profesional.',
        ],
        processTitle: 'Cómo lo dejamos operativo',
        process: [
          {
            title: 'Provisionamos tu entorno',
            description:
              'Configuramos hosting y seguridad base sin pasos técnicos por tu parte.',
          },
          {
            title: 'Conectamos dominio',
            description:
              'Publicamos tu web en una dirección profesional para generar confianza.',
          },
          {
            title: 'Monitorizamos estabilidad',
            description:
              'Mantenemos un entorno robusto para que tu web esté disponible cuando te buscan.',
          },
        ],
        objectionsTitle: 'Preguntas típicas antes de decidir',
        objections: [
          {
            q: '¿Qué pasa si no tengo dominio?',
            a: 'Te ayudamos a activarlo dentro del proceso para que salgas publicado sin bloqueos.',
          },
          {
            q: '¿Y si ya tengo dominio propio?',
            a: 'También puedes conectarlo para mantener tu marca sin empezar de cero.',
          },
        ],
        proofTitle: 'Qué valoran los clientes',
        testimonials: [
          {
            quote:
              'Nos quitamos el problema técnico de encima y la web siempre responde rápido.',
            author: 'Cristina D.',
            role: 'Clínica fisioterapia',
          },
          {
            quote:
              'Pasamos de una web lenta a una estable. Subieron los contactos en móvil.',
            author: 'Marc L.',
            role: 'Reparación de electrodomésticos',
          },
        ],
        planTitle: 'Plan recomendado para operar sin fricción',
        planPrice: '19€/mes',
        planItems: [
          'Hosting seguro con SSL incluido',
          'Dominio listo para publicar',
          'Base técnica optimizada per velocidad',
        ],
        finalTitle: 'Lanza una web fiable desde hoy',
        finalSubtitle:
          'Regístrate y publica con infraestructura profesional, sin depender de soporte técnico externo.',
        ctaPrimary: 'Crear cuenta gratis',
        ctaSecondary: 'Publicar mi web',
      }}
    />
  )
}
