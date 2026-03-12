import { notFound } from 'next/navigation'
import ServicesManager from '../_components/ServicesManager'
import { getBusinessBySlug, getServices } from '@/lib/supabase/actions'

export default async function BusinessServicesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const services = await getServices(business.id)

  return <ServicesManager businessId={business.id} initialServices={services} locale={locale} />
}
