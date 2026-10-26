import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPublicBusinessBySlug,
  getPublicServices,
  getPublicWorkingHours,
} from '@/lib/db/public'
import PublicBusinessSite from '../_components/PublicBusinessSite'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const business = await getPublicBusinessBySlug(slug)

  if (!business) {
    return {
      title: 'Negocio no encontrado | Locavo',
      description: 'El negocio que buscas no está disponible.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `${business.name} - ${business.category}`
  const description =
    business.description ||
    `Descubre ${business.name}, ${business.category}. ${business.address || 'Negocio local'}.`

  return {
    title,
    description,
    keywords: [
      business.name,
      business.category,
      'negocio local',
    ].filter((keyword): keyword is string => Boolean(keyword)),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Locavo',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function PublicBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getPublicBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const [services, hours] = await Promise.all([
    getPublicServices(business.id),
    getPublicWorkingHours(business.id),
  ])

  return (
    <PublicBusinessSite
      business={business}
      locale="es"
      services={services}
      hours={hours}
    />
  )
}
