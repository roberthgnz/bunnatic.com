#!/usr/bin/env tsx
/**
 * Script de utilidad para gestionar el rate limiting de Upstash
 *
 * Uso:
 *   pnpm tsx scripts/manage-ratelimit.ts check <ip>
 *   pnpm tsx scripts/manage-ratelimit.ts reset <ip>
 *   pnpm tsx scripts/manage-ratelimit.ts list
 */

import { Redis } from '@upstash/redis'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

if (!url || !token) {
  console.error(
    '❌ Error: UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN deben estar configurados'
  )
  process.exit(1)
}

const redis = new Redis({ url, token })

async function checkRateLimit(ip: string) {
  const key = `ratelimit:demo:${ip}`
  const data = await redis.get<{ count: number; resetAt: number }>(key)

  if (!data) {
    console.log(`✅ IP ${ip}: Sin límite activo`)
    return
  }

  const remaining = Math.max(0, 5 - data.count)
  const resetDate = new Date(data.resetAt)
  const hoursUntilReset = Math.ceil(
    (data.resetAt - Date.now()) / (1000 * 60 * 60)
  )

  console.log(`📊 IP ${ip}:`)
  console.log(`   Usos: ${data.count}/5`)
  console.log(`   Restantes: ${remaining}`)
  console.log(
    `   Reset: ${resetDate.toLocaleString()} (en ${hoursUntilReset}h)`
  )

  if (remaining === 0) {
    console.log(`   ⚠️  LÍMITE ALCANZADO`)
  }
}

async function resetRateLimit(ip: string) {
  const key = `ratelimit:demo:${ip}`
  await redis.del(key)
  console.log(`✅ Rate limit reseteado para IP ${ip}`)
}

async function listRateLimits() {
  console.log('🔍 Buscando rate limits activos...\n')

  // Nota: SCAN es más eficiente que KEYS en producción
  const keys = await redis.keys('ratelimit:demo:*')

  if (keys.length === 0) {
    console.log('No hay rate limits activos')
    return
  }

  console.log(`Encontrados ${keys.length} rate limits activos:\n`)

  for (const key of keys) {
    const ip = key.replace('ratelimit:demo:', '')
    await checkRateLimit(ip)
    console.log('')
  }
}

async function main() {
  const [command, arg] = process.argv.slice(2)

  if (!command) {
    console.log('Uso:')
    console.log('  pnpm tsx scripts/manage-ratelimit.ts check <ip>')
    console.log('  pnpm tsx scripts/manage-ratelimit.ts reset <ip>')
    console.log('  pnpm tsx scripts/manage-ratelimit.ts list')
    process.exit(1)
  }

  try {
    switch (command) {
      case 'check':
        if (!arg) {
          console.error('❌ Error: Debes proporcionar una IP')
          process.exit(1)
        }
        await checkRateLimit(arg)
        break

      case 'reset':
        if (!arg) {
          console.error('❌ Error: Debes proporcionar una IP')
          process.exit(1)
        }
        await resetRateLimit(arg)
        break

      case 'list':
        await listRateLimits()
        break

      default:
        console.error(`❌ Error: Comando desconocido "${command}"`)
        process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
