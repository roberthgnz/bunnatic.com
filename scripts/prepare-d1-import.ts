import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

type Row = Record<string, unknown>
const tables = [
  'profiles',
  'businesses',
  'services',
  'working_hours',
  'business_sections',
  'team_members',
  'leads',
  'calendar_events',
  'analytics_events',
  'audit_logs',
  'subscriptions',
  'business_domains',
  'business_generation_usage',
]
const quote = (value: unknown): string => {
  if (value == null) return 'NULL'
  if (typeof value === 'boolean') return value ? '1' : '0'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Invalid numeric value')
    return String(value)
  }
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value)
  if (text.includes('\0')) throw new Error('NUL bytes are not supported')
  return `'${text.replaceAll("'", "''")}'`
}
const identifier = (value: string) => {
  if (!/^[a-z_][a-z_0-9]*$/i.test(value)) throw new Error('Invalid column')
  return `"${value}"`
}
function insert(table: string, row: Row) {
  if (!row.id) throw new Error(`Missing ID in ${table}`)
  const columns = Object.keys(row).filter((key) => row[key] !== undefined)
  const updates = columns.filter((key) => key !== 'id')
  return `INSERT INTO ${identifier(table)} (${columns.map(identifier).join(',')}) VALUES (${columns.map((key) => quote(row[key])).join(',')}) ON CONFLICT(id) DO ${updates.length ? `UPDATE SET ${updates.map((key) => `${identifier(key)}=excluded.${identifier(key)}`).join(',')}` : 'NOTHING'};`
}
const rows = (value: unknown): Row[] => {
  if (value == null) return []
  if (
    !Array.isArray(value) ||
    value.some((row) => !row || typeof row !== 'object' || Array.isArray(row))
  )
    throw new Error('Expected an array of records')
  return value
}

export function prepareImport(data: Row): string {
  const output = [
    '-- Private Locavo D1 import. Apply only after the D1 schema migrations.',
  ]
  for (const user of rows(data.users)) {
    if (typeof user.email !== 'string' || !user.email)
      throw new Error('Every imported user needs an email')
    const metadata =
      user.raw_user_meta_data && typeof user.raw_user_meta_data === 'object'
        ? (user.raw_user_meta_data as Row)
        : {}
    output.push(
      insert('users', {
        id: user.id,
        email: user.email.toLowerCase(),
        name: metadata.full_name ?? metadata.name ?? null,
        image: metadata.avatar_url ?? metadata.picture ?? null,
        emailVerified: user.email_confirmed_at ?? null,
        password_hash: user.encrypted_password || null,
      })
    )
  }
  for (const identity of rows(data.identities)) {
    if (identity.provider !== 'google') continue
    const profile = identity.identity_data as Row | undefined
    if (!profile?.sub || !identity.user_id)
      throw new Error('Missing Google identity subject or user ID')
    output.push(
      insert('accounts', {
        id: crypto.randomUUID(),
        userId: identity.user_id,
        type: 'oidc',
        provider: 'google',
        providerAccountId: profile.sub,
      })
    )
  }
  for (const table of tables)
    for (const original of rows(data[table])) {
      const row = { ...original }
      // Normalize PostgreSQL timestamps to the ISO representation used by D1 queries.
      for (const [key, value] of Object.entries(row))
        if (typeof value === 'string' && /(_at|_end)$/.test(key)) {
          const date = new Date(value)
          if (!Number.isNaN(date.getTime())) row[key] = date.toISOString()
        }
      if (table === 'profiles' && row.updated_at == null) delete row.updated_at
      output.push(insert(table, row))
    }
  return output.join('\n') + '\n'
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [, , input, output] = process.argv
  if (!input || !output)
    throw new Error(
      'Usage: tsx scripts/prepare-d1-import.ts private-migration/export.json private-migration/import.sql'
    )
  // Sensitive backups and password hashes must stay in the ignored private directory.
  const privateDirectory = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    'private-migration'
  )
  for (const path of [input, output])
    if (
      !resolve(path).startsWith(
        privateDirectory + (process.platform === 'win32' ? '\\' : '/')
      )
    )
      throw new Error('Use private-migration/ for both files')
  writeFileSync(
    output,
    prepareImport(JSON.parse(readFileSync(input, 'utf8')) as Row),
    { mode: 0o600 }
  )
  console.log(
    'Private import SQL prepared. Review and test locally before any remote import.'
  )
}
