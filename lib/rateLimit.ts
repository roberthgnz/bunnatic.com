import { env } from 'cloudflare:workers'
import { consumeRateLimit, type RateLimitResult } from './cloudflare/rate-limit'
export type { RateLimitResult } from './cloudflare/rate-limit'

/** Atomic D1 counters: KV does not support atomic increments. */
export async function checkRateLimit(ip: string, limit = 5, windowMs = 48 * 60 * 60 * 1000): Promise<RateLimitResult> {
  return consumeRateLimit(env.DB, ip, limit, windowMs)
}
export function getClientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') || (process.env.NODE_ENV === 'development' ? 'localhost' : 'unknown')
}
