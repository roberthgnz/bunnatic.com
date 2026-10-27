import type { MetadataRoute } from 'next'
import { content } from '@/lib/content'
import { getBaseUrl } from '@/lib/seo'
import { getAlternativeSlug, getFeatureSlug } from '@/lib/pageSlugs'
import { businessLandingEntries } from '@/lib/businessLandingData'
import { guides } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  const routes = [
    '',
    '/crear-pagina-web-negocio',
    '/blog',
    '/negocio',
    '/sobre-locavo',
  ]

  // Add feature pages
  content.features.forEach((feature) => {
    routes.push(`/caracteristicas/${getFeatureSlug(feature.id, 'es')}`)
  })

  // Add alternative pages
  content.competitors.forEach((competitor) => {
    routes.push(`/alternativa/${getAlternativeSlug(competitor.id, 'es')}`)
  })

  // Add business landing pages
  businessLandingEntries.forEach((entry) => {
    routes.push(`/negocio/${entry.legacySlug}`)
  })

  return [
    ...Array.from(new Set(routes)).map((route) => ({
      url: new URL(route || '/', baseUrl).toString(),
    })),
    ...guides.map((guide) => ({
      url: `${baseUrl}/blog/${guide.slug}`,
      lastModified: guide.updatedAt,
    })),
  ]
}
