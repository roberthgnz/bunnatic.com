import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BusinessLanding from '../_components/BusinessLanding'
import {
  getBusinessLandingBySlug,
  getBusinessSlugByLocale,
} from '@/lib/businessLandingData'
import { buildPageMetadata } from '@/lib/seo'

type BusinessParams = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: BusinessParams): Promise<Metadata> {
  const { slug } = await params
  const entry = getBusinessLandingBySlug(slug)

  if (!entry) {
    return buildPageMetadata({
      locale: 'es',
      title: 'Web para Negocios Locales con IA | Bunnatic',
      description:
        'Crea una web optimizada para tu tipo de negocio y empieza a captar clientes locales con IA.',
      esPath: '/negocio',
      caPath: '/negocio',
      noindex: true,
    })
  }

  const localizedCopy = entry.copy

  return buildPageMetadata({
    locale: 'es',
    title: `${localizedCopy.title} | Bunnatic`,
    description: localizedCopy.subtitle,
    esPath: `/negocio/${getBusinessSlugByLocale(entry, 'es')}`,
    caPath: `/negocio/${getBusinessSlugByLocale(entry, 'es')}`,
    keywords: [
      'web para negocios locales',
      'seo local',
      'captación de clientes',
      localizedCopy.title.toLowerCase(),
      entry.legacySlug,
    ],
  })
}

export default async function NegocioLandingPage({ params }: BusinessParams) {
  const { slug } = await params
  const entry = getBusinessLandingBySlug(slug)

  if (!entry) {
    notFound()
  }

  const localizedSlug = getBusinessSlugByLocale(entry, 'es')

  return <BusinessLanding slug={localizedSlug} copy={{ es: entry.copy }} />
}
