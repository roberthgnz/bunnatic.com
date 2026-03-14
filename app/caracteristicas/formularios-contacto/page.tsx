import type { Metadata } from 'next'
import FeatureLanding from '../_components/FeatureLanding'
import { getFeatureSlug } from '@/lib/pageSlugs'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Formularios de Contacto y WhatsApp - Capta Clientes | Bunnatic',
    description:
      'Convierte visitas en clientes con formularios optimizados, botón de WhatsApp y llamadas a la acción estratégicas. Recibe leads cualificados al instante.',
    esPath: `/caracteristicas/${getFeatureSlug('formularios-contacto')}`,
    caPath: `/caracteristicas/${getFeatureSlug('formularios-contacto')}`,
    keywords: [
      'formularios de contacto',
      'captación de clientes',
      'botón whatsapp web',
      'generación de leads',
      'formulario presupuesto',
      'conversión web',
    ],
  })
}

export default function FormulariosContactoPage() {
  return (
    <FeatureLanding
      slug="formularios-contacto"
      icon="Users"
      copy={{
        badge: 'Convierte visitas en oportunidades reales',
        title: 'Captación de clientes con formularios que sí se envían',
        subtitle:
          'Diseñamos puntos de contacto claros para que cada visita tenga una siguiente acción: pedir cita, solicitar presupuesto o hablar por WhatsApp.',
        urgencyText:
          'Sin un flujo de captura claro, el tráfico no se convierte en ventas.',
        trustLine:
          'Formularios visibles, CTAs directos y notificaciones instantáneas para respuesta rápida.',
        outcomesTitle: 'Qué mejora en tu funnel',
        outcomes: [
          'Más leads cualificados sin aumentar inversión en tráfico.',
          'Menos abandono gracias a formularios simples y accionables.',
          'Mejor tasa de respuesta con alertas en tiempo real.',
        ],
        processTitle: 'Flujo de conversión que implementamos',
        process: [
          {
            title: 'Definimos puntos de intención',
            description:
              'Ubicamos llamadas a la acción donde el usuario ya está listo para contactar.',
          },
          {
            title: 'Reducimos fricción',
            description:
              'Simplificamos formularios para capturar datos clave sin bloquear la decisión.',
          },
          {
            title: 'Activamos respuesta rápida',
            description:
              'Recibes cada lead al momento para contestar cuando el interés está caliente.',
          },
        ],
        objectionsTitle: 'Objeciones comunes',
        objections: [
          {
            q: '¿Y si recibo contactos de baja calidad?',
            a: 'Ajustamos campos y copy para filtrar mejor sin perder volumen de oportunidades.',
          },
          {
            q: '¿Necesito integrar herramientas externas?',
            a: 'No para empezar. El flujo base ya queda operativo para captar y responder.',
          },
        ],
        proofTitle: 'Impacto en negocios como el tuyo',
        testimonials: [
          {
            quote:
              'Duplicamos solicitudes de presupuesto solo mejorando el flujo de contacto.',
            author: 'Raúl S.',
            role: 'Instalaciones',
          },
          {
            quote:
              'Ahora recibimos leads de calidad y respondemos desde el móvil al instante.',
            author: 'Núria A.',
            role: 'Clínica estética',
          },
        ],
        planTitle: 'Plan recomendado para captación',
        planPrice: '19€/mes',
        planItems: [
          'Formulario de contacto integrado',
          'Botón de WhatsApp y llamada directa',
          'Optimización de bloques de conversión',
        ],
        finalTitle: 'Convierte más visitas desde esta semana',
        finalSubtitle:
          'Crea tu cuenta y activa un flujo de captación listo para generar registros y ventas.',
        ctaPrimary: 'Empezar gratis',
        ctaSecondary: 'Crear mi demo',
      }}
    />
  )
}
