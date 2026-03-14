import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getServices, getWorkingHours } from '@/lib/supabase/actions'
import { getPublicBusinessBySlug } from '@/lib/supabase/public'
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
      title: 'Negocio no encontrado | Bunnatic',
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
      business.city || '',
      'negocio local',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Bunnatic',
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
    getServices(business.id),
    getWorkingHours(business.id),
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
