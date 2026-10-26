'use server'

import { z } from 'zod'
import { findBusinessAccessBySlug, requireBusinessAccess } from '../access'
import {
  actionError,
  BackofficeError,
  throwDataError,
  type ActionResult,
} from '../errors'
import { revalidateBusiness } from '../revalidate'

const settingsSchema = z.object({
  name: z.string().trim().min(2).max(200),
  category: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).nullable(),
})

export async function updateBusiness(
  slug: string,
  form: FormData
): Promise<ActionResult> {
  try {
    const found = await findBusinessAccessBySlug(slug)
    if (!found)
      throw new BackofficeError(
        'NOT_FOUND',
        'El negocio no existe o no tienes acceso.'
      )
    const { db, business, user } = await requireBusinessAccess(
      found.business.id,
      'settings.write'
    )
    const parsed = settingsSchema.safeParse({
      name: form.get('name'),
      category: form.get('category'),
      description: form.get('description'),
    })
    if (!parsed.success)
      return {
        error:
          'Revisa el nombre, la categoría y la descripción (máximo 500 caracteres).',
      }
    const result = await db
      .from('businesses')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', business.id)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle()
    if (result.error) throwDataError(result.error)
    if (!result.data)
      throw new BackofficeError(
        'NOT_FOUND',
        'No se ha podido actualizar este negocio.'
      )
    revalidateBusiness(business.slug)
    return { success: true }
  } catch (error) {
    return actionError(error)
  }
}
