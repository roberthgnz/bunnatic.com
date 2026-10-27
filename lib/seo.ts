import type { Metadata } from 'next'

export type SeoLocale = 'es' | 'ca'

const DEFAULT_BASE_URL = 'http://localhost:3000'

function normalizeBaseUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null
    }

    return url.origin
  } catch {
    return null
  }
}

export function getBaseUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
  ]

  for (const candidate of candidates) {
    if (!candidate) {
      continue
    }

    const normalized = normalizeBaseUrl(candidate)
    if (normalized) {
      return normalized
    }
  }

  return DEFAULT_BASE_URL
}

type BuildPageMetadataInput = {
  locale: SeoLocale
  title: string
  description: string
  esPath: string
  caPath?: string
  keywords?: string[]
  noindex?: boolean
  image?: string
  imageAlt?: string
}

export function buildPageMetadata({
  title,
  description,
  esPath,
  keywords,
  noindex = false,
  image,
  imageAlt,
}: BuildPageMetadataInput): Metadata {
  // Only Spanish routes are published. Do not advertise nonexistent translations.
  const canonicalUrl = new URL(esPath, getBaseUrl()).toString()
  const baseUrl = getBaseUrl()
  const brandedTitle = `${title.replace(/^Locavo\s*[|–—-]\s*/i, '').replace(/(?:\s*[|–—-]\s*Locavo)+$/i, '')} | Locavo`

  // Default OG image if not provided
  const ogImage = image || `${baseUrl}/social/locavo.png`
  const ogImageAlt =
    imageAlt || 'Locavo - Crea tu web con IA para captar clientes locales'

  return {
    metadataBase: new URL(baseUrl),
    title: { absolute: brandedTitle },
    description,
    keywords,
    authors: [{ name: 'Locavo', url: `${baseUrl}/sobre-locavo` }],
    creator: 'Locavo',
    publisher: 'Locavo',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: brandedTitle,
      description,
      url: canonicalUrl,
      siteName: 'Locavo',
      locale: 'es_ES',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }
}
