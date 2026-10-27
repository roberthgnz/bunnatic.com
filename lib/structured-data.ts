import { getBaseUrl } from './seo'

export type OrganizationSchema = {
  '@id'?: string
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
  sameAs?: string[]
  contactPoint?: {
    '@type': 'ContactPoint'
    contactType: string
    email?: string
  }
}

export type WebSiteSchema = {
  '@id'?: string
  publisher?: { '@id': string }
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description?: string
  potentialAction?: {
    '@type': 'SearchAction'
    target: string
    'query-input': string
  }
}

export type LocalBusinessSchema = {
  '@context': 'https://schema.org'
  '@type': 'LocalBusiness'
  name: string
  description?: string
  url: string
  telephone?: string
  address?: {
    '@type': 'PostalAddress'
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  geo?: {
    '@type': 'GeoCoordinates'
    latitude: number
    longitude: number
  }
  openingHoursSpecification?: Array<{
    '@type': 'OpeningHoursSpecification'
    dayOfWeek: string[]
    opens: string
    closes: string
  }>
}

export function getOrganizationSchema(): OrganizationSchema {
  const baseUrl = getBaseUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Locavo',
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
  }
}

export function getWebSiteSchema(): WebSiteSchema {
  const baseUrl = getBaseUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: 'Locavo',
    url: baseUrl,
    description:
      'Crea una web profesional para tu negocio local con IA en minutos. Optimizada para SEO local y captación de clientes.',
    publisher: { '@id': `${baseUrl}/#organization` },
  }
}

export function getProductSchema(): Record<string, unknown> {
  const baseUrl = getBaseUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${baseUrl}/#application`,
    name: 'Locavo',
    url: baseUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: 'es',
    description:
      'Herramienta para crear y gestionar páginas web de negocios locales con asistencia de inteligencia artificial.',
    publisher: { '@id': `${baseUrl}/#organization` },
  }
}

export function getBreadcrumbSchema(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, getBaseUrl()).toString(),
    })),
  }
}

export function getLocalBusinessSchema(business: {
  name: string
  description?: string
  url: string
  phone?: string
  address?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
  latitude?: number
  longitude?: number
}): LocalBusinessSchema {
  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    url: business.url,
    telephone: business.phone,
  }

  if (business.address || business.city) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.region,
      postalCode: business.postalCode,
      addressCountry: business.country || 'ES',
    }
  }

  if (business.latitude && business.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    }
  }

  return schema
}
