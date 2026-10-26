export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

export async function consumeRateLimit(
  database: D1Database,
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now()
  const result = await database
    .prepare(
      `
    INSERT INTO rate_limits(key, count, reset_at) VALUES(?, 1, ?)
    ON CONFLICT(key) DO UPDATE SET
      count = CASE WHEN reset_at <= ? THEN 1 ELSE count + 1 END,
      reset_at = CASE WHEN reset_at <= ? THEN excluded.reset_at ELSE reset_at END
    RETURNING count, reset_at
  `
    )
    .bind(key, now + windowMs, now, now)
    .first<{ count: number; reset_at: number }>()
  if (!result) throw new Error('Rate limiter unavailable')
  return {
    allowed: result.count <= limit,
    remaining: Math.max(0, limit - result.count),
    resetAt: result.reset_at,
  }
}
