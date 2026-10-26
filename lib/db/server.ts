import 'server-only'
import { env } from 'cloudflare:workers'
import { getCurrentUser } from '@/lib/auth/session'
import { Query } from './query'
import type { Tables } from './schema'

export async function createClient() {
  const user = await getCurrentUser()
  return {
    from: <K extends keyof Tables>(table: K) =>
      new Query(env.DB, table, user?.id ?? null),
  }
}

/** Only trusted server integrations (e.g. verified Stripe webhooks) may bypass tenant scope. */
export function createAdminClient() {
  return {
    from: <K extends keyof Tables>(table: K) =>
      new Query(env.DB, table, null, true),
  }
}
