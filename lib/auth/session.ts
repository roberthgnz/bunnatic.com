import 'server-only'
import { auth } from '@/auth'
import { env } from 'cloudflare:workers'
export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  const user = await env.DB.prepare(
    'SELECT id, email, name, image, session_version FROM users WHERE id = ?'
  )
    .bind(session.user.id)
    .first<{
      id: string
      email: string
      name: string | null
      image: string | null
      session_version: number
    }>()
  if (!user || user.session_version !== session.sessionVersion) return null
  return { id: user.id, email: user.email, name: user.name, image: user.image }
}
