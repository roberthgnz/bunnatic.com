import type * as Workers from '@cloudflare/workers-types'
declare global {
  type D1Database = Workers.D1Database
  type KVNamespace = Workers.KVNamespace
}
