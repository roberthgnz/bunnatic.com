import { findBusinessAccessBySlug } from '@/lib/backoffice/access'
import { hasBusinessPermission } from '@/lib/backoffice/policy'
import { notFound } from 'next/navigation'
import HoursManager from '../_components/HoursManager'
import { getWorkingHours } from '@/lib/backoffice/queries'

export default async function BusinessHoursPage({
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

  const hours = await getWorkingHours(business.id)

  return (
    <HoursManager
      readOnly={!hasBusinessPermission(access.role, 'content.write')}
      businessId={business.id}
      initialHours={hours}
    />
  )
}
