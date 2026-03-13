import { notFound } from 'next/navigation'
import CalendarManager from '../_components/CalendarManager'
import { getBusinessBySlug, getCalendarEvents } from '@/lib/supabase/actions'

export default async function BusinessCalendarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const events = await getCalendarEvents(business.id)

  return (
    <CalendarManager businessId={business.id} events={events} locale="es" />
  )
}
