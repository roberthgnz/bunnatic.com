function parseHostFromUrl(url: string | undefined) {
  if (!url) {
    return null
  }

  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return null
  }
}

function splitCsv(value: string | undefined) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export function getPlatformHosts() {
  const configuredHosts = splitCsv(process.env.PLATFORM_HOSTS)
  const appHost = parseHostFromUrl(process.env.APP_URL)
  const appPublicHost = parseHostFromUrl(process.env.NEXT_PUBLIC_APP_URL)
  const rootDomain = process.env.PLATFORM_ROOT_DOMAIN?.trim().toLowerCase() || null

  const hosts = new Set<string>([
    'localhost',
    '127.0.0.1',
    ...configuredHosts,
  ])

  if (appHost) hosts.add(appHost)
  if (appPublicHost) hosts.add(appPublicHost)

  if (rootDomain) {
    hosts.add(rootDomain)
    hosts.add(`www.${rootDomain}`)
  }

  return hosts
}

export function isPlatformHost(hostname: string) {
  const normalized = hostname.toLowerCase()
  const platformHosts = getPlatformHosts()

  if (platformHosts.has(normalized)) {
    return true
  }

  const rootDomain = process.env.PLATFORM_ROOT_DOMAIN?.trim().toLowerCase()
  if (rootDomain && normalized.endsWith(`.${rootDomain}`)) {
    return true
  }

  // Preview deployments
  if (normalized.endsWith('.vercel.app')) {
    return true
  }

  return false
}

export function getDefaultLocale() {
  const locale = process.env.PLATFORM_DEFAULT_LOCALE?.trim().toLowerCase()
  return locale === 'ca' ? 'ca' : 'es'
}

export function getCloudflareCnameTarget() {
  return process.env.CLOUDFLARE_SAAS_CNAME_TARGET?.trim().toLowerCase() || null
}

export function getCloudflareSslMethod() {
  const method = process.env.CLOUDFLARE_CUSTOM_HOSTNAME_SSL_METHOD?.trim().toLowerCase()
  return method === 'http' ? 'http' : 'txt'
}

export function getCloudflareCustomOriginServer() {
  const value = process.env.CLOUDFLARE_CUSTOM_ORIGIN_SERVER?.trim().toLowerCase()
  return value || null
}
