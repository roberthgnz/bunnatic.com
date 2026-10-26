'use server'

import { requireBusinessAccess } from '../access'
import { requireBackofficeSession } from '../session'
import {
  actionError,
  BackofficeError,
  throwDataError,
  type ActionResult,
} from '../errors'
import { revalidateBusiness } from '../revalidate'

export async function removeTeamMember(
  memberId: string
): Promise<ActionResult> {
  try {
    const { supabase } = await requireBackofficeSession()
    const member = await supabase
      .from('team_members')
      .select('id, role, business_id')
      .eq('id', memberId)
      .maybeSingle()
    if (member.error) throwDataError(member.error)
    if (!member.data)
      throw new BackofficeError(
        'NOT_FOUND',
        'El miembro no existe o no tienes acceso.'
      )
    const { business } = await requireBusinessAccess(
      member.data.business_id,
      'team.manage'
    )
    if (member.data.role === 'owner')
      return { error: 'No se puede eliminar al propietario del negocio.' }
    const result = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId)
      .eq('business_id', business.id)
      .select('id')
      .maybeSingle()
    if (result.error) throwDataError(result.error)
    if (!result.data)
      throw new BackofficeError(
        'NOT_FOUND',
        'El miembro ya no está disponible.'
      )
    revalidateBusiness(business.slug)
    return { success: true }
  } catch (error) {
    return actionError(error)
  }
}
