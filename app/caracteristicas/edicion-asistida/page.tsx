import type { Metadata } from 'next'
import FeatureLanding from '../_components/FeatureLanding'
import { getFeatureSlug } from '@/lib/pageSlugs'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Edición asistida para tu web | Bunnatic',
    description:
      'Actualiza servicios, horarios y promociones sin depender de programadores.',
    esPath: `/caracteristicas/${getFeatureSlug('edicion-asistida')}`,
    caPath: `/caracteristicas/${getFeatureSlug('edicion-asistida')}`,
  })
}

export default function EdicionAsistidaPage() {
  return (
    <FeatureLanding
      slug="edicion-asistida"
      icon="MessageSquare"
      copy={{
        badge: 'Tu web siempre al día sin esfuerzo',
        title: 'Edición asistida para que no dependas de nadie',
        subtitle:
          'Cambia textos, ofertas y horarios en segundos desde un panel visual, sin tocar código ni esperar a un técnico.',
        urgencyText:
          'Una web desactualizada transmite abandono y pierde clientes.',
        trustLine:
          'Interfaz simple para dueños de negocio, no para informáticos.',
        outcomesTitle: 'Qué ganas con el control total',
        outcomes: [
          'Agilidad para lanzar ofertas de temporada al momento.',
          'Corrección de errores sin coste ni espera.',
          'Imagen profesional siempre actualizada.',
        ],
        processTitle: 'Cómo funciona la edición',
        process: [
          {
            title: 'Entras al editor',
            description:
              'Panel visual donde ves tu web tal cual es, listo para cambiar.',
          },
          {
            title: 'Modificas contenido',
            description:
              'Escribes directamente sobre el texto o subes nueva foto.',
          },
          {
            title: 'Publicas cambios',
            description:
              'Se actualiza al instante para todos tus visitantes.',
          },
        ],
        objectionsTitle: 'Dudas frecuentes',
        objections: [
          {
            q: '¿Puedo romper la web si toco algo?',
            a: 'No. El editor protege la estructura para que el diseño siempre se vea bien.',
          },
          {
            q: '¿Necesito ordenador potente?',
            a: 'Funciona desde cualquier navegador, incluso puedes hacer cambios rápidos desde el móvil.',
          },
        ],
        proofTitle: 'Lo que dicen quienes lo usan',
        testimonials: [
          {
            quote:
              'Antes tardaba días en cambiar un precio. Ahora lo hago en el momento.',
            author: 'Carlos R.',
            role: 'Tienda local',
          },
          {
            quote:
              'Puedo probar ofertas diferentes cada semana sin llamar al webmaster.',
            author: 'Ana B.',
            role: 'Gimnasio',
          },
        ],
        planTitle: 'Plan recomendado para gestión ágil',
        planPrice: '19€/mes',
        planItems: [
          'Editor visual ilimitado',
          'Cambios publicados al instante',
          'Soporte si tienes dudas',
        ],
        finalTitle: 'Toma el control de tu presencia online',
        finalSubtitle:
          'Regístrate y gestiona tu web con la misma facilidad que tus redes sociales.',
        ctaPrimary: 'Probar editor gratis',
        ctaSecondary: 'Ver demo',
      }}
    />
  )
}
