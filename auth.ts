import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { D1Adapter } from '@auth/d1-adapter'
import { env } from 'cloudflare:workers'
import { z } from 'zod'
import { verifyPassword, hashPassword } from '@/lib/auth/password'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: D1Adapter(env.DB),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/signin', error: '/signin' },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    Credentials({
      credentials: { email: {}, password: { type: 'password' } },
      async authorize(credentials, request) {
        const parsed = z
          .object({
            email: z
              .string()
              .trim()
              .email()
              .transform((v) => v.toLowerCase()),
            password: z.string().min(1).max(256),
          })
          .safeParse(credentials)
        if (!parsed.success) return null
        const rate = await checkRateLimit(
          `login:${getClientIp(request)}`,
          10,
          15 * 60 * 1000
        )
        if (!rate.allowed) return null
        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
          .bind(parsed.data.email)
          .first<{
            id: string
            email: string
            name: string | null
            image: string | null
            emailVerified: string | null
            password_hash: string | null
          }>()
        if (
          !user?.password_hash ||
          !user.emailVerified ||
          !(await verifyPassword(parsed.data.password, user.password_hash))
        )
          return null
        if (user.password_hash.startsWith('$2'))
          await env.DB.prepare(
            'UPDATE users SET password_hash = ? WHERE id = ?'
          )
            .bind(await hashPassword(parsed.data.password), user.id)
            .run()
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      return account?.provider !== 'google' || profile?.email_verified === true
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id
        const record = await env.DB.prepare(
          'SELECT session_version FROM users WHERE id = ?'
        )
          .bind(user.id)
          .first<{ session_version: number }>()
        token.sessionVersion = record?.session_version ?? 0
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub
      session.sessionVersion = Number(token.sessionVersion ?? 0)
      return session
    },
  },
}))
