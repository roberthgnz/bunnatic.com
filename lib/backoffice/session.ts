import 'server-only'
import { getCurrentUser } from '@/lib/auth/session'
import { cache } from 'react'
import { createClient } from '@/lib/db/server'
import { BackofficeError, throwDataError } from './errors'

/** React cache is scoped to one server render, never shared between users. */
export const getBackofficeSession = cache(async () => {
  const db = await createClient()
  const user = await getCurrentUser()
  return { db, user }
})

export async function requireBackofficeSession() {
  const session = await getBackofficeSession()
  if (!session.user)
    throw new BackofficeError(
      'UNAUTHENTICATED',
      'Debes iniciar sesión para continuar.'
    )
  return { db: session.db, user: session.user }
}

export const getBackofficeProfile = cache(async () => {
  const { db, user } = await getBackofficeSession()
  if (!user) return null
  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  if (error) throwDataError(error)
  return {
    ...data,
    id: user.id,
    email: user.email,
    full_name: data?.full_name || user.name || null,
  }
})
