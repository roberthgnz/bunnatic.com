'use server'

import { requireBusinessAccess } from '../access'
import { actionError, throwDataError, type ActionResult } from '../errors'
import { calendarEventSchema } from '../schemas'
import { revalidateBusiness } from '../revalidate'

export async function createCalendarEvent(
  businessId: string,
  title: string,
  start: Date,
  end: Date,
  type: string
): Promise<ActionResult> {
  try {
    const { supabase, business, user } = await requireBusinessAccess(
      businessId,
      'calendar.write'
    )
    const parsed = calendarEventSchema.safeParse({
      title,
      start,
      end,
      type: type || 'general',
    })
    if (!parsed.success)
      return {
        error:
          'Revisa el título y las fechas del evento. El fin debe ser posterior al inicio.',
      }
    const event = parsed.data
    const { error } = await supabase.from('calendar_events').insert({
      business_id: businessId,
      title: event.title,
      start_time: event.start.toISOString(),
      end_time: event.end.toISOString(),
      type: event.type,
      created_by: user.id,
    })
    if (error) throwDataError(error)
    revalidateBusiness(business.slug)
    return { success: true }
  } catch (error) {
    return actionError(error)
  }
}
