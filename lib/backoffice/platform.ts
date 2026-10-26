import 'server-only'

export function getPlatformHost() {
  const configured = process.env.PLATFORM_ROOT_DOMAIN?.trim().toLowerCase()
  if (configured) return configured
  try {
    return new URL(process.env.APP_URL || '').host
  } catch {
    return 'bunnatic.com'
  }
}
