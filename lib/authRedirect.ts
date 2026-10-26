/** Keep auth destinations on this application, including their query context. */
export function normalizeInternalRedirect(
  value: unknown,
  fallback = '/dashboard'
): string {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    /[\\\u0000-\u0020]/.test(value)
  ) {
    return fallback
  }

  try {
    const target = new URL(value, 'https://internal.invalid')
    if (
      target.origin !== 'https://internal.invalid' ||
      target.pathname.startsWith('//')
    )
      return fallback
    return `${target.pathname}${target.search}${target.hash}`
  } catch {
    return fallback
  }
}

export function getEmailRedirectPath(redirectTo?: string): string | null {
  if (!redirectTo) return null
  try {
    const target = new URL(redirectTo)
    if (!['http:', 'https:'].includes(target.protocol)) return null
    return normalizeInternalRedirect(
      `${target.pathname}${target.search}${target.hash}`
    )
  } catch {
    return normalizeInternalRedirect(redirectTo)
  }
}
