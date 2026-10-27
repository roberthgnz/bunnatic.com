import assert from 'node:assert/strict'

const base = new URL(process.argv[2] || 'https://locavo.reliutg.workers.dev')
  .origin
const checked = []
async function get(path, status = 200) {
  const response = await fetch(new URL(path, base), { redirect: 'manual' })
  assert.equal(response.status, status, `${path}: unexpected HTTP status`)
  checked.push({ path, status: response.status })
  return response
}
const home = await (await get('/')).text()
assert(home.includes('Locavo'), 'Missing Locavo branding')
const canonical = home.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)
assert(
  canonical && new URL(canonical[1]).origin === base,
  'Incorrect canonical origin'
)
for (const path of ['/signin', '/signup'])
  assert((await (await get(path)).text()).includes('Locavo'))
const session = await (await get('/api/auth/session')).json()
assert(!session?.user, 'Guest request unexpectedly authenticated')
const providers = await (await get('/api/auth/providers')).json()
assert(providers.credentials, 'Credentials provider missing')
const csrfResponse = await get('/api/auth/csrf')
assert((await csrfResponse.json()).csrfToken, 'CSRF token unavailable')
assert(
  csrfResponse.headers
    .getSetCookie()
    .some((cookie) => /HttpOnly/i.test(cookie) && /Secure/i.test(cookie)),
  'Secure authentication cookie missing'
)
await get('/api/profile', 401)
const dashboard = await get('/dashboard', 307)
const dashboardTarget = new URL(dashboard.headers.get('location') || '/', base)
assert(
  dashboardTarget.origin === base && dashboardTarget.pathname === '/signin',
  'Incorrect dashboard protection'
)
const css = home.match(/<link[^>]*href="([^"]+\.css(?:\?[^"]*)?)"/)
if (css) await get(css[1])
console.log(
  JSON.stringify(
    { base, checks: checked, googleConfigured: Boolean(providers.google) },
    null,
    2
  )
)
