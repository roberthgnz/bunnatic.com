import { NextResponse } from 'next/server'
import { env } from 'cloudflare:workers'
import { hashToken } from '@/lib/auth/password'
import { normalizeInternalRedirect } from '@/lib/authRedirect'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token = searchParams.get('token')
  const next = normalizeInternalRedirect(searchParams.get('next'))

  if (token) {
    const tokenHash = await hashToken(token)
    const [result] = await env.DB.batch([
      env.DB.prepare("UPDATE users SET emailVerified = ? WHERE id = (SELECT user_id FROM auth_tokens WHERE token_hash = ? AND purpose = 'verify' AND expires_at > ?)").bind(new Date().toISOString(), tokenHash, Date.now()),
      env.DB.prepare("DELETE FROM auth_tokens WHERE token_hash = ? AND purpose = 'verify'").bind(tokenHash),
    ])
    if (result.meta.changes) return NextResponse.redirect(new URL(`/signin?verified=1&next=${encodeURIComponent(next)}`, origin))
  }

  return NextResponse.redirect(
    `${origin}/signin?error=auth_confirmation_failed`
  )
}
