import type { Metadata } from 'next'
import FeatureLanding from '../_components/FeatureLanding'
import { getFeatureSlug } from '@/lib/pageSlugs'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'SEO Local para Negocios - Atrae Clientes de tu Zona | Bunnatic',
    description:
      'Mejora tu visibilidad en Google para búsquedas locales. Optimización SEO técnica y contenido orientado a conversión para que tu negocio aparezca cuando te buscan en tu ciudad.',
    esPath: `/caracteristicas/${getFeatureSlug('seo-local')}`,
    caPath: `/caracteristicas/${getFeatureSlug('seo-local')}`,
    keywords: [
      'seo local',
      'posicionamiento local',
      'aparecer en google maps',
      'seo para negocios locales',
      'optimización búsquedas locales',
      'google my business',
    ],
  })
}

export default function SeoLocalPage() {
  return (
    <FeatureLanding
      slug="seo-local"
      icon="MapPin"
      copy={{
        badge: 'Aparece cuando te están buscando',
        title: 'SEO local para atraer clientes listos para comprar',
        subtitle:
          'Optimizamos tu web para búsquedas de intención alta en tu zona, para que lleguen contactos de personas que ya quieren contratar.',
        urgencyText:
          'Si no sales en búsquedas locales, tus competidores se quedan con esos clientes.',
        trustLine:
          'SEO técnico + estructura comercial + velocidad de carga para mejorar conversión.',
        outcomesTitle: 'Impacto directo en el embudo',
        outcomes: [
          'Más visibilidad en búsquedas locales con intención de compra.',
          'Más clics a tu web gracias a títulos y contenido orientado a servicio.',
          'Más contactos por formulario y WhatsApp desde tráfico orgánico.',
        ],
        processTitle: 'Qué hacemos para mejorar tus resultados',
        process: [
          {
            title: 'Arquitectura local',
            description:
              'Definimos estructura y metadatos para tu ciudad y servicios principales.',
          },
          {
            title: 'Contenido orientado a conversión',
            description:
              'Creamos páginas que responden dudas y cierran objeciones de tu cliente ideal.',
          },
          {
            title: 'Publicación y seguimiento',
            description:
              'Publicamos con base técnica sólida y dejamos todo listo para escalar tráfico.',
          },
        ],
        objectionsTitle: 'Lo que suele frenar la decisión',
        objections: [
          {
            q: '¿El SEO tarda demasiado?',
            a: 'El posicionamiento es progresivo, pero desde el inicio mejoras visibilidad y calidad del tráfico.',
          },
          {
            q: '¿Tengo que escribir contenido yo?',
            a: 'No. La IA genera base optimizada y tú solo validas que refleje tu negocio.',
          },
        ],
        proofTitle: 'Prueba social de negocio local',
        testimonials: [
          {
            quote:
              "Empezamos a recibir llamadas de búsquedas tipo 'cerca de mí' tras publicar.",
            author: 'Jordi P.',
            role: 'Clínica dental',
          },
          {
            quote:
              'La web quedó enfocada a servicios y ahora nos encuentran por barrio.',
            author: 'Laura M.',
            role: 'Reformas',
          },
        ],
        planTitle: 'Plan recomendado para SEO local',
        planPrice: '19€/mes',
        planItems: [
          'Optimización SEO local incluida',
          'Actualización sencilla de servicios y horarios',
          'Soporte para escalar páginas clave',
        ],
        finalTitle: 'Empieza a captar búsquedas que ya existen',
        finalSubtitle:
          'Activa tu web optimizada hoy y convierte búsquedas locales en nuevos registros.',
        ctaPrimary: 'Registrarme gratis',
        ctaSecondary: 'Ver cómo funciona',
      }}
    />
  )
}
