import assert from 'node:assert/strict'
import {
  getEmailRedirectPath,
  normalizeInternalRedirect,
} from '../lib/authRedirect'

const destination =
  '/onboarding?step=checkout&plan=pro&billing=yearly&draftId=draft-123'

assert.equal(normalizeInternalRedirect(destination), destination)
assert.equal(
  getEmailRedirectPath(`https://www.bunnatic.com${destination}`),
  destination
)
assert.equal(getEmailRedirectPath(destination), destination)
assert.equal(getEmailRedirectPath(undefined), null)
assert.equal(getEmailRedirectPath('javascript:alert(1)'), null)
assert.equal(normalizeInternalRedirect(null), '/dashboard')
assert.equal(
  normalizeInternalRedirect('/dashboard#negocios'),
  '/dashboard#negocios'
)

for (const unsafe of [
  'https://example.com',
  '//example.com',
  '/\\example.com',
  '/\n/example.com',
  '/path/..//example.com',
  '/path/%2e%2e//example.com',
  'javascript:alert(1)',
]) {
  assert.equal(normalizeInternalRedirect(unsafe), '/dashboard')
  assert.equal(normalizeInternalRedirect(unsafe, '/onboarding'), '/onboarding')
}

const confirmation = new URL('https://www.bunnatic.com/auth/confirm')
confirmation.searchParams.set(
  'next',
  getEmailRedirectPath(`https://www.bunnatic.com${destination}`)!
)
assert.equal(
  normalizeInternalRedirect(confirmation.searchParams.get('next')),
  destination
)

console.log(
  'Auth redirects: query context preserved; external and malformed destinations rejected.'
)
