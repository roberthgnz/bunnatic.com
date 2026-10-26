'use server'

import { env } from 'cloudflare:workers'
import { headers } from 'next/headers'
import { z } from 'zod'
import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/auth'
import { getCurrentUser } from './session'
import { hashPassword, hashToken } from './password'
import { normalizeInternalRedirect } from '@/lib/authRedirect'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

const passwordSchema = z
  .string()
  .min(8)
  .max(256)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)
  .regex(/[0-9]/)
async function limited(action: string, limit = 5) {
  const request = new Request('https://internal.invalid', {
    headers: await headers(),
  })
  return !(
    await checkRateLimit(
      `${action}:${getClientIp(request)}`,
      limit,
      60 * 60 * 1000
    )
  ).allowed
}
async function sendToken(
  userId: string,
  email: string,
  purpose: 'verify' | 'reset',
  destination = '/dashboard'
) {
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.SENDER_EMAIL ||
    !process.env.APP_URL
  )
    throw new Error('Email service is not configured')
  const token = crypto.randomUUID() + crypto.randomUUID()
  const tokenHash = await hashToken(token)
  await env.DB.batch([
    env.DB.prepare(
      'DELETE FROM auth_tokens WHERE user_id = ? AND purpose = ?'
    ).bind(userId, purpose),
    env.DB.prepare(
      'INSERT INTO auth_tokens(token_hash, user_id, purpose, expires_at) VALUES(?,?,?,?)'
    ).bind(tokenHash, userId, purpose, Date.now() + 60 * 60 * 1000),
  ])
  const url = new URL(
    purpose === 'verify' ? '/auth/confirm' : '/auth/update-password',
    process.env.APP_URL
  )
  url.searchParams.set('token', token)
  url.searchParams.set('next', normalizeInternalRedirect(destination))
  const label =
    purpose === 'verify'
      ? 'Confirma tu cuenta en Locavo'
      : 'Restablece tu contraseña de Locavo'
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `auth-${tokenHash}`,
    },
    body: JSON.stringify({
      from: process.env.SENDER_EMAIL,
      to: [email],
      subject: label,
      text: `${label}\n\n${url}\n\nEste enlace caduca en una hora. Si no lo has solicitado, ignora este correo.`,
    }),
  })
  if (!result.ok) throw new Error('Email delivery failed')
}

export async function signup(form: FormData) {
  const parsed = z
    .object({
      email: z
        .string()
        .trim()
        .email()
        .transform((v) => v.toLowerCase()),
      name: z.string().trim().min(2).max(80),
      password: passwordSchema,
    })
    .safeParse(Object.fromEntries(form))
  if (!parsed.success)
    return {
      error: 'Revisa el nombre, el correo y los requisitos de la contraseña.',
    }
  if (await limited('signup'))
    return { error: 'Demasiados intentos. Espera unos minutos.' }
  try {
    const existing = await env.DB.prepare(
      'SELECT id, emailVerified FROM users WHERE email = ?'
    )
      .bind(parsed.data.email)
      .first<{ id: string; emailVerified: string | null }>()
    if (existing?.emailVerified) return { success: true }
    const id = existing?.id ?? crypto.randomUUID()
    const passwordHash = await hashPassword(parsed.data.password)
    if (!existing)
      await env.DB.prepare(
        'INSERT INTO users(id, email, name, password_hash) VALUES(?,?,?,?)'
      )
        .bind(id, parsed.data.email, parsed.data.name, passwordHash)
        .run()
    else
      await env.DB.batch([
        env.DB.prepare(
          'UPDATE users SET password_hash = ?, name = ? WHERE id = ? AND emailVerified IS NULL'
        ).bind(passwordHash, parsed.data.name, id),
        env.DB.prepare('UPDATE profiles SET full_name = ? WHERE id = ?').bind(
          parsed.data.name,
          id
        ),
      ])
    await sendToken(
      id,
      parsed.data.email,
      'verify',
      normalizeInternalRedirect(
        form.get('redirect'),
        '/onboarding?step=checkout'
      )
    )
    return { success: true }
  } catch {
    return { error: 'No se pudo enviar la confirmación. Inténtalo de nuevo.' }
  }
}

export async function login(form: FormData) {
  try {
    await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError)
      return {
        error:
          'Correo o contraseña incorrectos, o cuenta pendiente de confirmar.',
      }
    throw error
  }
}
export async function logout() {
  await signOut({ redirect: false })
}

export async function requestPasswordReset(email: string) {
  const parsed = z
    .string()
    .trim()
    .email()
    .transform((v) => v.toLowerCase())
    .safeParse(email)
  if (!parsed.success) return { error: 'Correo no válido.', status: 400 }
  if (await limited('reset', 3))
    return { error: 'Demasiados intentos.', status: 429 }
  try {
    const user = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
      .bind(parsed.data)
      .first<{ id: string }>()
    if (user) await sendToken(user.id, parsed.data, 'reset')
  } catch {
    console.error('[auth] Password reset email failed')
  }
  return { success: true }
}
export async function canUpdatePassword(token: string | null) {
  if (!token) return Boolean(await getCurrentUser())
  return Boolean(
    await env.DB.prepare(
      "SELECT 1 FROM auth_tokens WHERE token_hash = ? AND purpose = 'reset' AND expires_at > ?"
    )
      .bind(await hashToken(token), Date.now())
      .first()
  )
}
export async function updatePassword(password: string, token: string | null) {
  if (!passwordSchema.safeParse(password).success)
    return { error: 'La contraseña no cumple los requisitos.' }
  if (await limited('update-password', 10))
    return { error: 'Demasiados intentos.' }
  const hash = await hashPassword(password)
  if (token) {
    const tokenHash = await hashToken(token)
    const [result] = await env.DB.batch([
      env.DB.prepare(
        "UPDATE users SET password_hash = ?, session_version = session_version + 1, emailVerified = COALESCE(emailVerified, ?) WHERE id = (SELECT user_id FROM auth_tokens WHERE token_hash = ? AND purpose = 'reset' AND expires_at > ?)"
      ).bind(hash, new Date().toISOString(), tokenHash, Date.now()),
      env.DB.prepare(
        'DELETE FROM auth_tokens WHERE user_id = (SELECT user_id FROM auth_tokens WHERE token_hash = ?)'
      ).bind(tokenHash),
    ])
    if (!result.meta.changes)
      return { error: 'El enlace ha caducado o ya se ha usado.' }
  } else {
    const user = await getCurrentUser()
    if (!user) return { error: 'Debes iniciar sesión.' }
    await env.DB.batch([
      env.DB.prepare(
        'UPDATE users SET password_hash = ?, session_version = session_version + 1 WHERE id = ?'
      ).bind(hash, user.id),
      env.DB.prepare('DELETE FROM auth_tokens WHERE user_id = ?').bind(user.id),
    ])
  }
  await signOut({ redirect: false })
  return { success: true }
}
