import { notFound } from 'next/navigation'
import HoursManager from '../_components/HoursManager'
import { getBusinessBySlug, getWorkingHours } from '@/lib/supabase/actions'

export default async function BusinessHoursPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const hours = await getWorkingHours(business.id)

  return (
    <HoursManager
      businessId={business.id}
      initialHours={hours}
      
    />
  )
}
