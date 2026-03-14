import type { Metadata } from 'next'
import { buildPageMetadata, type SeoLocale } from '@/lib/seo'

type CreateLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}

export async function generateMetadata({
  params,
}: CreateLayoutProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams?.locale || 'es'
  const safeLocale: SeoLocale = locale === 'ca' ? 'ca' : 'es'

  return buildPageMetadata({
    locale: safeLocale,
    title:
      safeLocale === 'ca'
        ? 'Crear Web amb IA per al Teu Negoci | Bunnatic'
        : 'Crear Web con IA para tu Negocio Local | Bunnatic',
    description:
      safeLocale === 'ca'
        ? "Troba el teu negoci a Google i publica una web professional en minuts amb IA. Sense tècnics, sense complicacions. Optimitzada per SEO local i captació de clients."
        : 'Encuentra tu negocio en Google y publica una web profesional en minutos con IA. Sin técnicos, sin complicaciones. Optimizada para SEO local y captación de clientes.',
    esPath: '/crear-pagina-web-negocio',
    caPath: '/crear-pagina-web-negocio',
    keywords:
      safeLocale === 'ca'
        ? [
          'crear web amb IA',
          'web per negocis locals',
          'generador web automàtic',
          'disseny web intel·ligent',
        ]
        : [
          'crear web con IA',
          'web para negocios locales',
          'generador web automático',
          'diseño web inteligente',
          'web en 5 minutos',
        ],
  })
}

export default function CreateLayout({ children }: CreateLayoutProps) {
  return children
}
