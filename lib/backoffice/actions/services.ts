'use server'

import { requireBusinessAccess } from '../access'
import { requireBackofficeSession } from '../session'
import {
  actionError,
  BackofficeError,
  throwDataError,
  type ActionResult,
} from '../errors'
import { serviceFromForm, servicesBatchSchema } from '../schemas'
import { revalidateBusiness } from '../revalidate'
import type { ServiceInput } from '../types'

export async function createService(
  businessId: string,
  form: FormData
): Promise<ActionResult> {
  try {
    const { db, business } = await requireBusinessAccess(
      businessId,
      'content.write'
    )
    const parsed = serviceFromForm(form)
    if (!parsed.success)
      return {
        error: 'Revisa el nombre, el precio y la duración del servicio.',
      }
    const { error } = await db
      .from('services')
      .insert({ business_id: businessId, ...parsed.data })
    if (error) throwDataError(error)
    revalidateBusiness(business.slug)
    return { success: true }
  } catch (error) {
    return actionError(error)
  }
}

export async function createServicesBatch(
  businessId: string,
  services: ServiceInput[]
): Promise<ActionResult> {
  try {
    const { db, business } = await requireBusinessAccess(
      businessId,
      'content.write'
    )
    const parsed = servicesBatchSchema.safeParse(services)
    if (!parsed.success)
      return {
        error:
          'Los servicios contienen datos inválidos o superan el límite de 100 por operación.',
      }
    const { error } = await db
      .from('services')
      .insert(
        parsed.data.map((service) => ({ business_id: businessId, ...service }))
      )
    if (error) throwDataError(error)
    revalidateBusiness(business.slug)
    return { success: true }
  } catch (error) {
    return actionError(error)
  }
}

export async function updateService(
  serviceId: string,
  form: FormData
): Promise<ActionResult> {
  try {
    const parsed = serviceFromForm(form)
    if (!parsed.success)
      return {
        error: 'Revisa el nombre, el precio y la duración del servicio.',
      }
    const { db } = await requireBackofficeSession()
    const result = await db
      .from('services')
      .select('id, business_id')
      .eq('id', serviceId)
      .maybeSingle()
    if (result.error) throwDataError(result.error)
    if (!result.data)
      throw new BackofficeError(
        'NOT_FOUND',
        'El servicio no existe o no tienes acceso.'
      )
    const { business } = await requireBusinessAccess(
      result.data.business_id,
      'content.write'
    )
    const updated = await db
      .from('services')
      .update({
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        price: parsed.data.price ?? null,
        duration: parsed.data.duration ?? null,
      })
      .eq('id', serviceId)
      .eq('business_id', business.id)
      .select('id')
      .maybeSingle()
    if (updated.error) throwDataError(updated.error)
    if (!updated.data)
      throw new BackofficeError(
        'NOT_FOUND',
        'El servicio ya no está disponible.'
      )
    revalidateBusiness(business.slug)
    return { success: true }
  } catch (error) {
    return actionError(error)
  }
}

export async function deleteService(serviceId: string): Promise<ActionResult> {
  try {
    const { db } = await requireBackofficeSession()
    const result = await db
      .from('services')
      .select('id, business_id')
      .eq('id', serviceId)
      .maybeSingle()
    if (result.error) throwDataError(result.error)
    if (!result.data)
      throw new BackofficeError(
        'NOT_FOUND',
        'El servicio no existe o no tienes acceso.'
      )
    const { business } = await requireBusinessAccess(
      result.data.business_id,
      'content.write'
    )
    const removed = await db
      .from('services')
      .delete()
      .eq('id', serviceId)
      .eq('business_id', business.id)
      .select('id')
      .maybeSingle()
    if (removed.error) throwDataError(removed.error)
    if (!removed.data)
      throw new BackofficeError(
        'NOT_FOUND',
        'El servicio ya no está disponible.'
      )
    revalidateBusiness(business.slug)
    return { success: true }
  } catch (error) {
    return actionError(error)
  }
}
