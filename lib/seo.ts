import type { Metadata } from 'next'

export type SeoLocale = 'es' | 'ca'

const DEFAULT_BASE_URL = 'http://localhost:3000'

function normalizeBaseUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null
    }

    // Remove trailing slash to avoid double slashes
    return url.toString().replace(/\/$/, '')
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

function withLocalePath(pathname: string, locale: SeoLocale): string {
  if (locale === 'es') {
    return pathname
  }

  return pathname === '/' ? '/ca' : `/ca${pathname}`
}

function absoluteUrl(pathname: string, locale: SeoLocale): string {
  return new URL(withLocalePath(pathname, locale), getBaseUrl()).toString()
}

type BuildPageMetadataInput = {
  locale: SeoLocale
  title: string
  description: string
  esPath: string
  caPath: string
  keywords?: string[]
  noindex?: boolean
  image?: string
  imageAlt?: string
}

export function buildPageMetadata({
  locale,
  title,
  description,
  esPath,
  caPath,
  keywords,
  noindex = false,
  image,
  imageAlt,
}: BuildPageMetadataInput): Metadata {
  const canonicalPath = locale === 'ca' ? caPath : esPath
  const canonicalUrl = absoluteUrl(canonicalPath, locale)
  const baseUrl = getBaseUrl()

  // Default OG image if not provided
  const ogImage = image || `${baseUrl}/og-image.png`
  const ogImageAlt = imageAlt || 'Bunnatic - Crea tu web con IA para captar clientes locales'

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    authors: [{ name: 'Bunnatic' }],
    creator: 'Bunnatic',
    publisher: 'Bunnatic',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: absoluteUrl(esPath, 'es'),
        ca: absoluteUrl(caPath, 'ca'),
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Bunnatic',
      locale: locale === 'ca' ? 'ca_ES' : 'es_ES',
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
      title,
      description,
      images: [ogImage],
      creator: '@bunnatic',
      site: '@bunnatic',
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
