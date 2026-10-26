import assert from 'node:assert/strict'
import { getPlatformProxy } from 'wrangler'
import { Query } from '../lib/db/query'
import type { Tables } from '../lib/db/schema'
import { hashPassword, verifyPassword, hashToken } from '../lib/auth/password'
import { hash as bcryptHash } from 'bcryptjs'
import { consumeRateLimit } from '../lib/cloudflare/rate-limit'
import { prepareImport } from './prepare-d1-import'

// Only local Miniflare storage, with synthetic users. Never calls a remote database.
const { env, dispose } = await getPlatformProxy<Cloudflare.Env>({
  configPath: 'wrangler.jsonc',
})
const db = env.DB
const prefix = `test-${crypto.randomUUID()}`
const owner = `${prefix}-owner`
const stranger = `${prefix}-stranger`
const editor = `${prefix}-editor`
const viewer = `${prefix}-viewer`
const businessId = `${prefix}-business`
const query = <K extends keyof Tables>(table: K, user: string | null = owner) =>
  new Query(db, table, user)
const password = 'Test-Locavo-123!'
try {
  const hash = await hashPassword(password)
  assert(await verifyPassword(password, hash))
  assert.equal(await verifyPassword('Wrong-Password1', hash), false)
  assert(await verifyPassword(password, await bcryptHash(password, 4)))
  const attempts = await Promise.all(
    Array.from({ length: 10 }, () => consumeRateLimit(db, prefix, 3, 60000))
  )
  assert.equal(attempts.filter((attempt) => attempt.allowed).length, 3)
  await db
    .prepare('UPDATE rate_limits SET reset_at = 0 WHERE key = ?')
    .bind(prefix)
    .run()
  assert.equal((await consumeRateLimit(db, prefix, 3, 60000)).allowed, true)
  for (const id of [owner, stranger, editor, viewer])
    await db
      .prepare(
        'INSERT INTO users(id,email,name,password_hash,emailVerified) VALUES(?,?,?,?,?)'
      )
      .bind(id, `${id}@example.invalid`, id, hash, new Date().toISOString())
      .run()
  assert((await query('profiles').eq('id', owner).single()).data.trial_ends_at)
  assert.equal(
    (
      await query('businesses')
        .insert({
          id: businessId,
          user_id: owner,
          slug: prefix,
          name: 'Local test',
          social_links: { instagram: 'test' },
        })
        .single()
    ).error,
    null
  )
  await db.batch(
    [editor, viewer].map((user) =>
      db
        .prepare(
          "INSERT INTO team_members(id,business_id,user_id,role,status) VALUES(?,?,?,?,'active')"
        )
        .bind(
          crypto.randomUUID(),
          businessId,
          user,
          user === editor ? 'editor' : 'viewer'
        )
    )
  )
  const service = await query('services')
    .insert({ business_id: businessId, name: 'Service' })
    .single()
  assert.equal(service.error, null)
  const denied = await query('services', stranger)
    .update({ name: 'Hijacked' })
    .eq('id', service.data.id)
  assert.deepEqual(denied.data, [])
  assert.equal(
    (
      await query('services', editor).insert({
        business_id: businessId,
        name: 'Denied',
      })
    ).error?.message,
    'Forbidden business'
  )
  assert.equal(
    (await query('profiles', stranger).eq('id', owner).maybeSingle()).data,
    null
  )
  assert(
    (
      await query('profiles')
        .update({ stripe_price_id: 'forged' })
        .eq('id', owner)
    ).error
  )
  assert(
    (
      await query('businesses', stranger)
        .update({ user_id: stranger })
        .eq('id', businessId)
    ).error
  )
  assert.equal(
    (await query('services', null).eq('id', service.data.id).single()).data
      .name,
    'Service'
  )
  assert.equal(
    (
      await query('business_sections')
        .insert({
          business_id: businessId,
          type: 'team',
          content: { members: [] },
        })
        .single()
    ).data.content.members instanceof Array,
    true
  )
  assert.equal(
    (await query('business_sections', stranger).eq('business_id', businessId))
      .data.length,
    0
  )
  const hour = { business_id: businessId, day_of_week: 1, is_closed: true }
  assert.equal(
    (
      await query('working_hours').upsert(hour, {
        onConflict: 'business_id, day_of_week',
      })
    ).error,
    null
  )
  assert.equal(
    (
      await query('working_hours').upsert(
        { ...hour, is_closed: false },
        { onConflict: 'business_id, day_of_week' }
      )
    ).error,
    null
  )
  assert.equal(
    (await query('working_hours').eq('business_id', businessId).single()).data
      .is_closed,
    false
  )
  assert(
    (
      await query('working_hours', stranger).upsert(
        { ...hour, is_closed: true },
        { onConflict: 'business_id,day_of_week' }
      )
    ).error
  )
  const calendar = {
    business_id: businessId,
    title: 'Event',
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    created_by: editor,
  }
  assert.equal(
    (await query('calendar_events', editor).insert(calendar)).error,
    null
  )
  assert((await query('calendar_events', viewer).insert(calendar)).error)
  await query('leads', null).insert({
    business_id: businessId,
    name: 'Contact',
    email: 'contact@example.invalid',
  })
  assert.equal(
    (await query('leads', editor).eq('business_id', businessId)).data.length,
    0
  )
  assert.equal(
    (await query('leads').eq('business_id', businessId)).data.length,
    1
  )
  const joined = await query('team_members', editor)
    .select('*, businesses!inner (*)')
    .eq('user_id', editor)
  assert.equal(joined.data[0].businesses?.id, businessId)
  const summaries = await query('team_members', editor)
    .select('*, businesses!inner (id, user_id, name, slug)')
    .eq('user_id', editor)
  assert.equal(summaries.data[0].businesses?.id, businessId)
  assert.equal('place_data' in summaries.data[0].businesses!, false)
  const before = await query('services')
    .eq('business_id', businessId)
    .select('id', { head: true, count: 'exact' })
  assert(
    (
      await query('services').insert([
        { business_id: businessId, name: 'rollback' },
        { business_id: businessId },
      ])
    ).error
  )
  const after = await query('services')
    .eq('business_id', businessId)
    .select('id', { head: true, count: 'exact' })
  assert.equal(before.count, after.count)
  await db
    .prepare(
      "INSERT INTO business_domains(id,business_id,hostname,status) VALUES(?,?,?,'active')"
    )
    .bind(crypto.randomUUID(), businessId, `${prefix}.example.invalid`)
    .run()
  assert.equal(
    (await query('business_domains', stranger).eq('business_id', businessId))
      .data.length,
    1
  )
  const imported = prepareImport({
    users: [
      {
        id: `${prefix}-imported`,
        email: `${prefix}-imported@example.invalid`,
        encrypted_password: hash,
        raw_user_meta_data: { full_name: "Import O'Neil" },
      },
    ],
    profiles: [
      {
        id: `${prefix}-imported`,
        full_name: "Import O'Neil",
        onboarding_completed: true,
        updated_at: null,
      },
    ],
    businesses: [],
  })
  await db.exec(
    imported
      .split('\n')
      .filter((line) => !line.startsWith('--') && line.trim())
      .join('\n')
  )
  assert.equal(
    (
      await db
        .prepare('SELECT full_name FROM profiles WHERE id = ?')
        .bind(`${prefix}-imported`)
        .first<{ full_name: string }>()
    )?.full_name,
    "Import O'Neil"
  )
  await db
    .prepare('DELETE FROM users WHERE id = ?')
    .bind(`${prefix}-imported`)
    .run()
  console.log(
    'D1: tenant isolation, roles, public reads, JSON/booleans, protected billing, upserts, joins and batch rollback passed. Passwords: PBKDF2 and legacy bcrypt passed.'
  )

  // Optional complete session flow against the locally running Worker.
  const testBaseUrl = process.env.TEST_BASE_URL ?? process.argv[2]
  if (testBaseUrl) {
    const base = testBaseUrl
    assert(
      ['localhost', '127.0.0.1'].includes(new URL(base).hostname),
      'Local server only'
    )
    const cookies = new Map<string, string>()
    async function request(path: string, init: RequestInit = {}) {
      const response = await fetch(`${base}${path}`, {
        ...init,
        redirect: 'manual',
        headers: {
          ...Object.fromEntries(new Headers(init.headers)),
          cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join('; '),
        },
      })
      for (const cookie of response.headers.getSetCookie()) {
        const [key, value] = cookie.split(';')[0].split('=')
        cookies.set(key, value)
      }
      return response
    }
    assert.equal((await request('/api/profile')).status, 401)
    assert.equal((await request('/dashboard')).status, 307)
    const csrf = (await (await request('/api/auth/csrf')).json()) as {
      csrfToken: string
    }
    const login = await request('/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Auth-Return-Redirect': '1',
      },
      body: new URLSearchParams({
        email: `${owner}@example.invalid`,
        password,
        csrfToken: csrf.csrfToken,
        callbackUrl: `${base}/dashboard`,
      }),
    })
    const loginBody = (await login.json()) as { url: string }
    assert(!loginBody.url.includes('error='), loginBody.url)
    assert.equal((await request('/api/profile')).status, 200)
    const session = (await (await request('/api/auth/session')).json()) as {
      user: { id: string }
    }
    assert.equal(session.user.id, owner)
    const profile = (await (await request('/api/profile')).json()) as {
      email: string
    }
    assert.equal(profile.email, `${owner}@example.invalid`)
    const businesses = (await (await request('/api/businesses')).json()) as {
      id: string
    }[]
    assert(businesses.some((row) => row.id === businessId))
    const verifyToken = crypto.randomUUID()
    await db
      .prepare(
        "INSERT INTO auth_tokens(token_hash,user_id,purpose,expires_at) VALUES(?,?,'verify',?)"
      )
      .bind(await hashToken(verifyToken), stranger, Date.now() + 60000)
      .run()
    const confirmed = await request(
      `/auth/confirm?token=${verifyToken}&next=${encodeURIComponent('/onboarding?step=checkout&plan=pro')}`
    )
    assert(confirmed.headers.get('location')?.includes('verified=1'))
    assert(
      (await request(`/auth/confirm?token=${verifyToken}`)).headers
        .get('location')
        ?.includes('auth_confirmation_failed')
    )
    const state = { sourceType: 'google', googleQuery: 'Local test' }
    assert.equal(
      (
        await request('/api/generation-state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        })
      ).status,
      200
    )
    assert.equal(
      (await request('/api/generation-state', { method: 'DELETE' })).status,
      200
    )
    await db
      .prepare(
        'UPDATE users SET session_version = session_version + 1 WHERE id = ?'
      )
      .bind(owner)
      .run()
    assert.equal((await request('/api/profile')).status, 401)
    console.log(
      'Worker HTTP: guest protection, credentials login, NextAuth session, profile/business reads, single-use email confirmation, KV write/delete and session revocation passed.'
    )
  }
} finally {
  await db.prepare('DELETE FROM businesses WHERE id = ?').bind(businessId).run()
  for (const id of [owner, stranger, editor, viewer])
    await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
  await db.prepare('DELETE FROM rate_limits WHERE key = ?').bind(prefix).run()
  await dispose()
}
