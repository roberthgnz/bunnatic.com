import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getServices, getWorkingHours } from '@/lib/supabase/actions'
import { getPublicBusinessByHostname } from '@/lib/supabase/public'
import PublicBusinessSite from '../../_components/PublicBusinessSite'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; hostname: string }>
}): Promise<Metadata> {
  const { hostname } = await params
  const business = await getPublicBusinessByHostname(hostname)

  if (!business) {
    return {
      title: 'Negocio no encontrado',
    }
  }

  return {
    title: `${business.name} | ${business.category}`,
    description: business.description || `Bienvenido a la web de ${business.name}, ${business.category}.`,
  }
}

export default async function PublicBusinessDomainPage({
  params,
}: {
  params: Promise<{ locale: string; hostname: string }>
}) {
  const { locale, hostname } = await params
  const business = await getPublicBusinessByHostname(hostname)

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
      locale={locale}
      services={services}
      hours={hours}
    />
  )
}
