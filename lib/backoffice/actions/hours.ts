'use server'

import { requireBusinessAccess } from '../access'
import { actionError, throwDataError, type ActionResult } from '../errors'
import { workingHoursSchema } from '../schemas'
import { revalidateBusiness } from '../revalidate'
import type { WorkingHoursInput } from '../types'

export async function saveWorkingHours(
  businessId: string,
  hours: WorkingHoursInput[]
): Promise<ActionResult> {
  try {
    const { db, business } = await requireBusinessAccess(
      businessId,
      'content.write'
    )
    const parsed = workingHoursSchema.safeParse(hours)
    if (!parsed.success)
      return { error: 'Revisa los días y las horas de apertura y cierre.' }
    const { error } = await db.from('working_hours').upsert(
      parsed.data.map((hour) => ({
        business_id: businessId,
        day_of_week: hour.day_of_week,
        is_closed: hour.is_closed,
        open_time: hour.is_closed ? null : hour.open_time,
        close_time: hour.is_closed ? null : hour.close_time,
      })),
      { onConflict: 'business_id, day_of_week' }
    )
    if (error) throwDataError(error)
    revalidateBusiness(business.slug)
    return { success: true }
  } catch (error) {
    return actionError(error)
  }
}
