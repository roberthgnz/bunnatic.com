import type { Metadata } from 'next'

export type SeoLocale = 'es' | 'ca'

const DEFAULT_BASE_URL = 'http://localhost:3000'

function normalizeBaseUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null
    }

    return url.toString().endsWith('/') ? url.toString() : `${url.toString()}/`
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

  return `${DEFAULT_BASE_URL}/`
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
}

export function buildPageMetadata({
  locale,
  title,
  description,
  esPath,
  caPath,
  keywords,
  noindex = false,
}: BuildPageMetadataInput): Metadata {
  const canonicalPath = locale === 'ca' ? caPath : esPath
  const canonicalUrl = absoluteUrl(canonicalPath, locale)

  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    description,
    keywords,
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
  }
}
