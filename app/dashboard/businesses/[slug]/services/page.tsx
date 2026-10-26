import { findBusinessAccessBySlug } from '@/lib/backoffice/access'
import { hasBusinessPermission } from '@/lib/backoffice/policy'
import { notFound } from 'next/navigation'
import ServicesManager from '../_components/ServicesManager'
import { getServices } from '@/lib/backoffice/queries'

export default async function BusinessServicesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const access = await findBusinessAccessBySlug(slug)
  const business = access?.business

  if (!business || !access) {
    notFound()
  }

  const services = await getServices(business.id)

  return (
    <ServicesManager
      readOnly={!hasBusinessPermission(access.role, 'content.write')}
      businessId={business.id}
      initialServices={services}
    />
  )
}
