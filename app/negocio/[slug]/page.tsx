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
      title: 'Web para negocios locales | Bunnatic',
      description: 'Crea una web optimizada para captar clientes locales.',
      esPath: '/negocio',
      caPath: '/negocio',
      noindex: true,
    })
  }

  const localizedCopy = entry.copy['es']

  return buildPageMetadata({
    locale: 'es',
    title: `${localizedCopy.title} | Bunnatic`,
    description: localizedCopy.subtitle,
    esPath: `/negocio/${getBusinessSlugByLocale(entry, 'es')}`,
    caPath: `/negocio/${getBusinessSlugByLocale(entry, 'es')}`, // Fallback to es
    keywords: ['web para negocios locales', 'seo local', 'captación de clientes'],
  })
}

export default async function NegocioLandingPage({ params }: BusinessParams) {
  const { slug } = await params
  const entry = getBusinessLandingBySlug(slug)

  if (!entry) {
    notFound()
  }

  const localizedSlug = getBusinessSlugByLocale(entry, 'es')

  return <BusinessLanding slug={localizedSlug} copy={entry.copy} />
}
