import { findBusinessAccessBySlug } from '@/lib/backoffice/access'
import { hasBusinessPermission } from '@/lib/backoffice/policy'
import { notFound } from 'next/navigation'
import CalendarManager from '../_components/CalendarManager'
import { getCalendarEvents } from '@/lib/backoffice/queries'

export default async function BusinessCalendarPage({
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

  const events = await getCalendarEvents(business.id)

  return (
    <CalendarManager
      readOnly={!hasBusinessPermission(access.role, 'calendar.write')}
      businessId={business.id}
      events={events}
      locale="es"
    />
  )
}
