'use server'

import { requireBusinessAccess } from '../access'
import { requireBackofficeSession } from '../session'
import {
  actionError,
  BackofficeError,
  throwDataError,
  type ActionResult,
} from '../errors'
import { sectionStatusSchema } from '../schemas'
import { revalidateBusiness } from '../revalidate'

export async function updateSectionStatus(
  sectionId: string,
  status: string
): Promise<ActionResult> {
  try {
    const { db, user } = await requireBackofficeSession()
    const parsed = sectionStatusSchema.safeParse(status)
    if (!parsed.success) return { error: 'Estado de publicación no válido.' }
    const section = await db
      .from('business_sections')
      .select('id, business_id')
      .eq('id', sectionId)
      .maybeSingle()
    if (section.error) throwDataError(section.error)
    if (!section.data)
      throw new BackofficeError(
        'NOT_FOUND',
        'La sección no existe o no tienes acceso.'
      )
    const { business } = await requireBusinessAccess(
      section.data.business_id,
      'content.write'
    )
    const result = await db
      .from('business_sections')
      .update({ status: parsed.data, last_edited_by: user.id })
      .eq('id', sectionId)
      .eq('business_id', business.id)
      .select('id')
      .maybeSingle()
    if (result.error) throwDataError(result.error)
    if (!result.data)
      throw new BackofficeError(
        'NOT_FOUND',
        'La sección ya no está disponible.'
      )
    revalidateBusiness(business.slug)
    return { success: true }
  } catch (error) {
    return actionError(error)
  }
}
