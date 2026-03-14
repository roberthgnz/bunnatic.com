import type { Metadata } from 'next'
import FeatureLanding from '../_components/FeatureLanding'
import { getFeatureSlug } from '@/lib/pageSlugs'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Generación Web con IA - Crea tu Sitio en Minutos | Bunnatic',
    description:
      'La IA genera una web completa con textos de venta, estructura optimizada y diseño profesional en minutos. Sin programadores, sin diseñadores. Empieza a captar clientes hoy.',
    esPath: `/caracteristicas/${getFeatureSlug('generacion-ia')}`,
    caPath: `/caracteristicas/${getFeatureSlug('generacion-ia')}`,
    keywords: [
      'generación web con IA',
      'crear web automática',
      'inteligencia artificial web',
      'web en minutos',
      'generador web IA',
      'diseño web automático',
    ],
  })
}

export default function GeneracionIAPage() {
  return (
    <FeatureLanding
      slug="generacion-ia"
      icon="Sparkles"
      copy={{
        badge: 'Tu web puede estar activa hoy',
        title: 'Generación con IA que convierte visitas en clientes',
        subtitle:
          'La IA construye una web completa con textos de venta, estructura enfocada a lead y diseño optimizado para móvil en minutos.',
        urgencyText:
          'Cada día sin web son búsquedas locales que acaban en la competencia.',
        trustLine:
          'Sin equipo técnico. Sin bloqueo de permanencia. Configuración inicial en menos de 10 minutos.',
        outcomesTitle: 'Qué desbloqueas desde el primer día',
        outcomes: [
          'Mensaje comercial claro para que te contacten sin dudar.',
          'Estructura pensada para que el usuario haga clic en llamar o escribir.',
          'Diseño listo para publicar sin depender de un diseñador.',
        ],
        processTitle: 'Cómo se traduce en más registros y ventas',
        process: [
          {
            title: 'Leemos tu negocio',
            description:
              'Tomamos datos públicos y contexto de tu sector para no partir de cero.',
          },
          {
            title: 'Generamos propuesta comercial',
            description:
              'Creamos titulares, bloques y CTAs que empujan al registro y al contacto.',
          },
          {
            title: 'Publicas y activas captación',
            description:
              'Tu sitio queda listo para recibir tráfico y convertir visitas desde el primer día.',
          },
        ],
        objectionsTitle: 'Objeciones habituales (resueltas)',
        objections: [
          {
            q: '¿Y si no me gusta el texto generado?',
            a: 'Puedes regenerarlo y ajustarlo en el editor visual en segundos hasta que encaje con tu negocio.',
          },
          {
            q: '¿Necesito saber diseño o código?',
            a: 'No. La IA y el editor guiado cubren todo el proceso sin curva técnica.',
          },
        ],
        proofTitle: 'Resultados que ya estamos viendo',
        testimonials: [
          {
            quote:
              'Pasamos de no tener web a recibir contactos por formulario en la primera semana.',
            author: 'Marta C.',
            role: 'Centro de estética',
          },
          {
            quote:
              'La IA dejó la estructura lista. Solo revisé dos textos y publiqué.',
            author: 'Pol R.',
            role: 'Taller mecánico',
          },
        ],
        planTitle: 'Plan recomendado para captar clientes',
        planPrice: '19€/mes',
        planItems: [
          'Edición visual con ayuda de IA para textos y ofertas',
          'Formulario de contacto y botón de WhatsApp',
          'SEO local y soporte prioritario',
        ],
        finalTitle: 'Empieza hoy con una web que sí vende',
        finalSubtitle:
          'Crea tu cuenta, genera tu web y empieza a captar registros sin depender de terceros.',
        ctaPrimary: 'Crear cuenta gratis',
        ctaSecondary: 'Probar demo',
      }}
    />
  )
}
