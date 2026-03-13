
const featureSlugs = {
  'generacion-ia': 'generacion-ia',
  'seo-local': 'seo-local',
  'edicion-asistida': 'edicion-asistida',
  'formularios-contacto': 'formularios-contacto',
  'hosting-dominio': 'hosting-dominio',
} as const

const alternativeSlugs = {
  facebook: 'facebook',
  instagram: 'instagram',
  'google-my-business': 'google-my-business',
  wordpress: 'wordpress',
  wix: 'wix',
  squarespace: 'squarespace',
} as const

const legalSlugs = {
  'aviso-legal': 'aviso-legal',
  'politica-privacidad': 'politica-privacidad',
  'politica-cookies': 'politica-cookies',
} as const

type FeatureId = keyof typeof featureSlugs
type AlternativeId = keyof typeof alternativeSlugs
type LegalId = keyof typeof legalSlugs

function reverseMap<T extends Record<string, string>>(
  source: T
): Record<string, keyof T> {
  return Object.fromEntries(
    Object.entries(source).map(([id, slug]) => [slug, id])
  ) as Record<string, keyof T>
}

const featureIdBySlug = reverseMap(featureSlugs)
const alternativeIdBySlug = reverseMap(alternativeSlugs)
const legalIdBySlug = reverseMap(legalSlugs)

export function getFeatureSlug(id: string): string {
  return featureSlugs[id as FeatureId] ?? id
}

export function getAlternativeSlug(id: string): string {
  return alternativeSlugs[id as AlternativeId] ?? id
}

export function getLegalSlug(id: string): string {
  return legalSlugs[id as LegalId] ?? id
}

export function resolveFeatureIdFromSlug(slug: string): string | null {
  return (featureIdBySlug[slug] as string | undefined) ?? null
}

export function resolveAlternativeIdFromSlug(slug: string): string | null {
  return (alternativeIdBySlug[slug] as string | undefined) ?? null
}

export function resolveLegalIdFromSlug(slug: string): string | null {
  return (legalIdBySlug[slug] as string | undefined) ?? null
}
