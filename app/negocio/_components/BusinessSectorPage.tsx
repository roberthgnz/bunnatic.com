import { notFound } from 'next/navigation'
import { getBusinessLandingBySlug } from '@/lib/businessLandingData'
import { buildPageMetadata } from '@/lib/seo'
import BusinessLanding from './BusinessLanding'

export function businessMetadata(slug: string) {
  const entry = getBusinessLandingBySlug(slug)
  if (!entry) notFound()
  return buildPageMetadata({
    locale: 'es',
    title: entry.copy.title,
    description: entry.copy.subtitle,
    esPath: `/negocio/${entry.legacySlug}`,
  })
}

export default function BusinessSectorPage({ slug }: { slug: string }) {
  const entry = getBusinessLandingBySlug(slug)
  if (!entry) notFound()
  return <BusinessLanding slug={entry.legacySlug} copy={{ es: entry.copy }} />
}
