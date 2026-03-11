// Upstash Redis rate limiter for demo endpoints
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redis) return redis;
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    console.warn('Upstash Redis credentials not found. Rate limiting will not work.');
    return null;
  }
  
  redis = new Redis({
    url,
    token,
  });
  
  return redis;
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export async function checkRateLimit(
  ip: string, 
  limit: number = 5, 
  windowMs: number = 48 * 60 * 60 * 1000
): Promise<RateLimitResult> {
  const client = getRedisClient();
  
  // Fallback if Redis is not configured
  if (!client) {
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: Date.now() + windowMs,
    };
  }

  const now = Date.now();
  const key = `ratelimit:demo:${ip}`;
  
  try {
    // Get current count and reset time
    const data = await client.get<{ count: number; resetAt: number }>(key);
    
    // No entry or expired entry
    if (!data || now > data.resetAt) {
      const resetAt = now + windowMs;
      const ttlSeconds = Math.ceil(windowMs / 1000);
      
      await client.set(key, { count: 1, resetAt }, { ex: ttlSeconds });
      
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt,
      };
    }
    
    // Entry exists and not expired
    if (data.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.resetAt,
      };
    }
    
    // Increment count
    const newCount = data.count + 1;
    const ttlSeconds = Math.ceil((data.resetAt - now) / 1000);
    
    await client.set(key, { count: newCount, resetAt: data.resetAt }, { ex: ttlSeconds });
    
    return {
      allowed: true,
      remaining: limit - newCount,
      resetAt: data.resetAt,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow the request if Redis fails
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
    };
  }
}

export function getClientIp(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default (in development)
  return 'unknown';
}
