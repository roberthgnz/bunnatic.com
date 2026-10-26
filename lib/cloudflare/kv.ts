import { env } from 'cloudflare:workers'
export function getGenerationStore() {
  return {
    get: <T>(key: string) => env.GENERATION_STATE.get<T>(key, 'json'),
    set: (key: string, value: unknown, options: { ex: number }) =>
      env.GENERATION_STATE.put(key, JSON.stringify(value), {
        expirationTtl: options.ex,
      }),
    del: (key: string) => env.GENERATION_STATE.delete(key),
  }
}
