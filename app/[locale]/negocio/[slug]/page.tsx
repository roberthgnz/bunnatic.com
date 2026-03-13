import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BusinessLanding from '../_components/BusinessLanding'
import {
  getBusinessLandingBySlug,
  getBusinessSlugByLocale,
} from '@/lib/businessLandingData'
import type { Locale } from '@/lib/pageSlugs'
import { buildPageMetadata } from '@/lib/seo'

type BusinessParams = {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: BusinessParams): Promise<Metadata> {
  const { locale, slug } = await params
  const safeLocale: Locale = locale === 'ca' ? 'ca' : 'es'
  const entry = getBusinessLandingBySlug(slug)

  if (!entry) {
    return buildPageMetadata({
      locale: safeLocale,
      title:
        safeLocale === 'ca'
          ? 'Web per negocis locals | Bunnatic'
          : 'Web para negocios locales | Bunnatic',
      description:
        safeLocale === 'ca'
          ? 'Crea una web optimitzada per captar clients locals.'
          : 'Crea una web optimizada para captar clientes locales.',
      esPath: '/negocio',
      caPath: '/negocio',
      noindex: true,
    })
  }

  const localizedCopy = entry.copy[safeLocale]

  return buildPageMetadata({
    locale: safeLocale,
    title: `${localizedCopy.title} | Bunnatic`,
    description: localizedCopy.subtitle,
    esPath: `/negocio/${getBusinessSlugByLocale(entry, 'es')}`,
    caPath: `/negocio/${getBusinessSlugByLocale(entry, 'ca')}`,
    keywords:
      safeLocale === 'ca'
        ? ['web per negocis locals', 'seo local', 'captació de clients']
        : ['web para negocios locales', 'seo local', 'captación de clientes'],
  })
}

export default async function NegocioLandingPage({ params }: BusinessParams) {
  const { locale, slug } = await params
  const entry = getBusinessLandingBySlug(slug)

  if (!entry) {
    notFound()
  }

  const safeLocale: Locale = locale === 'ca' ? 'ca' : 'es'
  const localizedSlug = getBusinessSlugByLocale(entry, safeLocale)

  return <BusinessLanding slug={localizedSlug} copy={entry.copy} />
}
