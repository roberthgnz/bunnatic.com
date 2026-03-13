import type { MetadataRoute } from 'next'
import { content } from '@/lib/content'
import { getBaseUrl } from '@/lib/seo'
import {
  getAlternativeSlug,
  getFeatureSlug,
  getLegalSlug,
} from '@/lib/pageSlugs'
import { businessLandingEntries } from '@/lib/businessLandingData'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bunnatic.com'
  const lastModified = new Date()

  const routes = [
    '',
    '/crear-pagina-web-negocio',
    '/signin',
    '/signup',
    '/aviso-legal',
    '/politica-privacidad',
    '/politica-cookies',
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
    routes.push(`/negocio/${entry.slug}`)
  })

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
