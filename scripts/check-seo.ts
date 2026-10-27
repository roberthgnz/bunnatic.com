import assert from 'node:assert/strict'
import { guides } from '../lib/blog'
import { businessLandingEntries } from '../lib/businessLandingData'

const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const expectedOrigin = new URL(process.env.SEO_CANONICAL_ORIGIN || base).origin
const request = (path: string) =>
  fetch(new URL(path, base), {
    redirect: 'manual',
    signal: AbortSignal.timeout(30000),
  })
const schemas = (html: string): Record<string, unknown>[] =>
  [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    ),
  ].map((match) => JSON.parse(match[1]))
const pageHtml = new Map<string, string>()

const sitemap = await request('/sitemap.xml')
assert.equal(sitemap.status, 200)
const xml = await sitemap.text()
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
assert(
  urls.length > 20,
  'Sitemap includes public commercial and editorial pages'
)
assert.equal(new Set(urls).size, urls.length, 'No duplicate sitemap URLs')
assert(
  !urls.some((url) =>
    /\/(signin|signup|dashboard|onboarding|checkout)(?:\/|$)/.test(
      new URL(url).pathname
    )
  )
)
const titles = new Set<string>()
const failures: Error[] = []
for (const url of urls) {
  try {
    assert.equal(
      new URL(url).origin,
      expectedOrigin,
      'Canonical sitemap origin'
    )
    const path = new URL(url).pathname
    const response = await request(path)
    assert.equal(response.status, 200, `Public page ${path}`)
    const html = await response.text()
    pageHtml.set(path, html)
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || ''
    assert(title.length > 10, `Title exists: ${path}`)
    assert.equal(
      (title.match(/Locavo/g) || []).length,
      1,
      `Brand once: ${path}`
    )
    assert(!titles.has(title), `Unique title: ${path}`)
    titles.add(title)
    const canonical = html.match(
      /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/
    )?.[1]
    assert(canonical, `Canonical exists: ${path}`)
    assert.equal(
      new URL(canonical).href,
      new URL(url).href,
      `Self-canonical: ${path}`
    )
    assert(!/hreflang="ca"/i.test(html), `No nonexistent translation: ${path}`)
    assert.equal(
      [...html.matchAll(/<h1[\s>]/g)].length,
      1,
      `One main heading: ${path}`
    )
    assert(
      !/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html),
      `Indexable: ${path}`
    )
    assert(
      !response.headers.get('x-robots-tag')?.includes('noindex'),
      `No private indexing header: ${path}`
    )
    const data = schemas(html)
    assert(
      data.some((item) => item['@type'] === 'Organization'),
      `Organization: ${path}`
    )
    assert(
      !data.some((item) => item.sameAs),
      `No unverified social identities: ${path}`
    )
    assert(!html.includes('<blockquote'), `No unverified testimonial: ${path}`)
  } catch (error) {
    failures.push(error as Error)
  }
}

for (const guide of guides) {
  const path = `/blog/${guide.slug}`
  const html = pageHtml.get(path)
  assert(html, `Guide in sitemap: ${path}`)
  const count = guide.answer.trim().split(/\s+/).length
  assert(
    count >= 40 && count <= 80,
    `Opening capsule length: ${path} (${count})`
  )
  for (const tag of [
    '<table',
    '<caption',
    '<thead',
    '<tbody',
    'scope="col"',
    'scope="row"',
  ])
    assert(html.includes(tag), `Semantic table ${tag}: ${path}`)
  assert(html.includes(guide.evidence.url), `Source visible: ${path}`)
  const article = schemas(html).find((item) => item['@type'] === 'BlogPosting')
  assert(article, `Article schema: ${path}`)
  assert.equal(article.dateModified, `${guide.updatedAt}T00:00:00Z`)
  assert.equal(
    (article.author as Record<string, unknown>)['@type'],
    'Organization'
  )
  assert(
    xml.includes(`<lastmod>${guide.updatedAt}</lastmod>`) ||
      xml.includes(`<lastmod>${guide.updatedAt}T`),
    'Editorial dates in sitemap'
  )
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '')
  assert(
    visible.includes(guide.sections.at(-1)!.title),
    `Full guide in server HTML: ${path}`
  )
}

for (const entry of businessLandingEntries) {
  if (entry.slug === entry.legacySlug) continue
  const response = await request(`/negocio/${entry.slug}`)
  assert.equal(
    response.status,
    308,
    `Duplicate sector redirects: ${entry.slug}`
  )
  assert.equal(
    new URL(response.headers.get('location')!, base).pathname,
    `/negocio/${entry.legacySlug}`
  )
}

for (const path of [
  '/signin',
  '/signup',
  '/onboarding',
  '/checkout',
  '/dashboard',
  '/forgot-password',
  '/auth/update-password',
]) {
  const response = await request(path)
  assert(
    [200, 307, 302].includes(response.status),
    `Private route works: ${path}`
  )
  assert(
    response.headers.get('x-robots-tag')?.includes('noindex'),
    `Private noindex header: ${path}`
  )
}
const unknown = await request('/blog/no-existe')
assert.equal(unknown.status, 404)
const alias = await request('/crear?q=Cafeter%C3%ADa&source=seo-check')
assert.equal(alias.status, 308)
const aliasTarget = new URL(alias.headers.get('location')!, base)
assert.equal(aliasTarget.pathname, '/crear-pagina-web-negocio')
assert.equal(aliasTarget.searchParams.get('q'), 'Cafetería')
assert.equal(aliasTarget.searchParams.get('source'), 'seo-check')
const tool = await (
  await request('/crear-pagina-web-negocio?q=Cafeter%C3%ADa')
).text()
assert(
  tool.includes('value="Cafetería"'),
  'Search query rendered in server form'
)
const home = pageHtml.get('/')!
assert(schemas(home).some((item) => item['@type'] === 'WebApplication'))
assert(
  home
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .includes('La indexación y la posición final dependen de Google'),
  'FAQ answer in initial HTML'
)
const robots = await (await request('/robots.txt')).text()
assert(robots.includes(`${expectedOrigin}/sitemap.xml`))
assert(!robots.includes('Disallow: /_next/'), 'Rendering assets crawlable')
const image = await request('/social/locavo.png')
assert.equal(image.status, 200)
assert(image.headers.get('content-type')?.includes('image/png'))
if (failures.length)
  throw new AggregateError(failures, 'Sitemap page checks failed')
console.log(
  `SEO checks passed: ${urls.length} sitemap URLs, ${guides.length} complete guides, ${businessLandingEntries.length} sector redirects, private noindex, JSON-LD and social image.`
)
