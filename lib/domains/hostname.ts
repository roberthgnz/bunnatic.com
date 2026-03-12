const HOSTNAME_REGEX = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

function stripPort(host: string) {
  const parts = host.split(':')
  if (parts.length <= 1) {
    return host
  }

  const maybePort = parts[parts.length - 1]
  if (/^\d+$/.test(maybePort)) {
    return parts.slice(0, -1).join(':')
  }

  return host
}

export function normalizeHostname(input: string): string | null {
  const raw = input.trim().toLowerCase()
  if (!raw) {
    return null
  }

  let hostname = raw

  try {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      hostname = new URL(raw).hostname
    } else if (raw.includes('/')) {
      hostname = new URL(`https://${raw}`).hostname
    } else {
      hostname = stripPort(raw)
    }
  } catch {
    return null
  }

  hostname = hostname.replace(/\.$/, '')

  if (!hostname || hostname.startsWith('*.')) {
    return null
  }

  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
    return null
  }

  if (!HOSTNAME_REGEX.test(hostname)) {
    return null
  }

  return hostname
}
