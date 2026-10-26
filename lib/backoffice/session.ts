import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { BackofficeError, throwDataError } from './errors'

/** React cache is scoped to one server render, never shared between users. */
export const getBackofficeSession = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (
    error &&
    error.name !== 'AuthSessionMissingError' &&
    ![400, 401, 403].includes(error.status ?? 0)
  )
    throwDataError(error)
  return { supabase, user }
})

export async function requireBackofficeSession() {
  const session = await getBackofficeSession()
  if (!session.user)
    throw new BackofficeError(
      'UNAUTHENTICATED',
      'Debes iniciar sesión para continuar.'
    )
  return { supabase: session.supabase, user: session.user }
}

export const getBackofficeProfile = cache(async () => {
  const { supabase, user } = await getBackofficeSession()
  if (!user) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  if (error) throwDataError(error)
  return {
    ...data,
    id: user.id,
    email: user.email,
    full_name: data?.full_name || user.user_metadata?.full_name || null,
  }
})
