import 'server-only'
import { cache } from 'react'
import { requireBackofficeSession } from './session'
import { BackofficeError, throwDataError } from './errors'
import { actionError } from './errors'
import {
  hasBusinessPermission,
  resolveBusinessRole,
  type BusinessPermission,
} from './policy'

const findBusinessAccess = cache(
  async (field: 'id' | 'slug', value: string) => {
    const session = await requireBackofficeSession()
    const { data: business, error } = await session.db
      .from('businesses')
      .select('*')
      .eq(field, value)
      .maybeSingle()
    if (error) throwDataError(error)
    if (!business) return null
    let membership = null
    if (business.user_id !== session.user.id) {
      const result = await session.db
        .from('team_members')
        .select('business_id, user_id, role, status')
        .eq('business_id', business.id)
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .maybeSingle()
      if (result.error) throwDataError(result.error)
      membership = result.data
    }
    const role = resolveBusinessRole(session.user.id, business, membership)
    return role ? { ...session, business, role } : null
  }
)

export const findBusinessAccessBySlug = (slug: string) =>
  findBusinessAccess('slug', slug)

export async function requireBusinessAccess(
  businessId: string,
  permission: BusinessPermission = 'read'
) {
  const access = await findBusinessAccess('id', businessId)
  if (!access)
    throw new BackofficeError(
      'NOT_FOUND',
      'El negocio no existe o no tienes acceso.'
    )
  if (!hasBusinessPermission(access.role, permission))
    throw new BackofficeError(
      'FORBIDDEN',
      'Tu rol no permite realizar este cambio en el negocio.'
    )
  return access
}

/** Adapter for legacy actions while modules migrate to the structured result contract. */
export async function authorizeBusinessMutation(
  businessId: string,
  permission: BusinessPermission
) {
  try {
    return { access: await requireBusinessAccess(businessId, permission) }
  } catch (error) {
    return {
      error: actionError(error).error ?? 'No se pudo comprobar el acceso.',
    }
  }
}
