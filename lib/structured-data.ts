import { getBaseUrl } from './seo'

export type OrganizationSchema = {
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
        name: 'Bunnatic',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
            'https://twitter.com/bunnatic',
            'https://www.linkedin.com/company/bunnatic',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
        },
    }
}

export function getWebSiteSchema(): WebSiteSchema {
    const baseUrl = getBaseUrl()

    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Bunnatic',
        url: baseUrl,
        description:
            'Crea una web profesional para tu negocio local con IA en minutos. Optimizada para SEO local y captación de clientes.',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/crear-pagina-web-negocio?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
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
