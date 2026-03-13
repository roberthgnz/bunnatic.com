import type { Metadata } from 'next'
import { buildPageMetadata, type SeoLocale } from '@/lib/seo'

type CreateLayoutProps = {
  children: React.ReactNode
  params: Promise<any>
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
        ? 'Crear web amb IA | Bunnatic'
        : 'Crear web con IA | Bunnatic',
    description:
      safeLocale === 'ca'
        ? 'Troba el teu negoci a Google i publica una web professional en minuts amb IA.'
        : 'Encuentra tu negocio en Google y publica una web profesional en minutos con IA.',
    esPath: '/crear-pagina-web-negocio',
    caPath: '/crear-pagina-web-negocio',
  })
}

export default function CreateLayout({ children }: CreateLayoutProps) {
  return children
}
