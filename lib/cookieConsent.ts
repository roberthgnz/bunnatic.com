export const COOKIE_CONSENT_NAME = 'bunnatic_cookie_consent'
export const COOKIE_CONSENT_EVENT = 'cookie-consent:updated'
export const COOKIE_PREFERENCES_EVENT = 'cookie-consent:preferences'
export const COOKIE_CONSENT_VERSION = 1
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 180

export type CookieConsentState = {
  analytics: boolean
  updatedAt: string
  version: number
}

function parseConsentValue(rawValue: string | null): CookieConsentState | null {
  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(
      decodeURIComponent(rawValue)
    ) as Partial<CookieConsentState>

    if (
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.updatedAt !== 'string' ||
      typeof parsed.version !== 'number'
    ) {
      return null
    }

    return {
      analytics: parsed.analytics,
      updatedAt: parsed.updatedAt,
      version: parsed.version,
    }
  } catch {
    return null
  }
}

export function readCookieValue(
  name: string,
  cookieSource?: string
): string | null {
  const source =
    cookieSource ?? (typeof document !== 'undefined' ? document.cookie : '')

  if (!source) {
    return null
  }

  const prefix = `${name}=`
  const match = source.split('; ').find((entry) => entry.startsWith(prefix))

  return match ? match.slice(prefix.length) : null
}

export function getCookieConsent(
  cookieSource?: string
): CookieConsentState | null {
  return parseConsentValue(readCookieValue(COOKIE_CONSENT_NAME, cookieSource))
}

export function hasAnalyticsConsent(cookieSource?: string): boolean {
  return getCookieConsent(cookieSource)?.analytics === true
}

function dispatchConsentUpdate(state: CookieConsentState) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: state }))
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

export function clearAnalyticsCookies() {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie.split('; ').forEach((entry) => {
    const [name] = entry.split('=')

    if (name === '_gid' || name === '_gat' || name.startsWith('_ga')) {
      deleteCookie(name)
    }
  })
}

export function saveCookieConsent(
  analytics: boolean
): CookieConsentState | null {
  if (typeof document === 'undefined') {
    return null
  }

  const state: CookieConsentState = {
    analytics,
    updatedAt: new Date().toISOString(),
    version: COOKIE_CONSENT_VERSION,
  }

  document.cookie = [
    `${COOKIE_CONSENT_NAME}=${encodeURIComponent(JSON.stringify(state))}`,
    'path=/',
    `max-age=${COOKIE_CONSENT_MAX_AGE}`,
    'SameSite=Lax',
  ].join('; ')

  if (!analytics) {
    clearAnalyticsCookies()
  }

  dispatchConsentUpdate(state)
  return state
}

export function openCookiePreferences() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(COOKIE_PREFERENCES_EVENT))
}
