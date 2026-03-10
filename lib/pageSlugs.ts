export type Locale = "es" | "ca";

const featureSlugByLocale = {
  es: {
    "generacion-ia": "generacion-ia",
    "seo-local": "seo-local",
    "edicion-asistida": "edicion-asistida",
    "formularios-contacto": "formularios-contacto",
    "hosting-dominio": "hosting-dominio",
  },
  ca: {
    "generacion-ia": "generacio-ia",
    "seo-local": "seo-local",
    "edicion-asistida": "edicio-assistida",
    "formularios-contacto": "formularis-contacte",
    "hosting-dominio": "hosting-domini",
  },
} as const;

const alternativeSlugByLocale = {
  es: {
    facebook: "facebook",
    instagram: "instagram",
    "google-my-business": "google-my-business",
    wordpress: "wordpress",
    wix: "wix",
    squarespace: "squarespace",
  },
  ca: {
    facebook: "facebook",
    instagram: "instagram",
    "google-my-business": "google-my-business",
    wordpress: "wordpress",
    wix: "wix",
    squarespace: "squarespace",
  },
} as const;

const legalSlugByLocale = {
  es: {
    "aviso-legal": "aviso-legal",
    "politica-privacidad": "politica-privacidad",
    "politica-cookies": "politica-cookies",
  },
  ca: {
    "aviso-legal": "avis-legal",
    "politica-privacidad": "politica-privacitat",
    "politica-cookies": "politica-cookies",
  },
} as const;

type FeatureId = keyof (typeof featureSlugByLocale)["es"];
type AlternativeId = keyof (typeof alternativeSlugByLocale)["es"];
type LegalId = keyof (typeof legalSlugByLocale)["es"];

function reverseMap<T extends Record<string, string>>(source: T): Record<string, keyof T> {
  return Object.fromEntries(Object.entries(source).map(([id, slug]) => [slug, id])) as Record<
    string,
    keyof T
  >;
}

const featureIdBySlugByLocale = {
  es: reverseMap(featureSlugByLocale.es),
  ca: reverseMap(featureSlugByLocale.ca),
};

const alternativeIdBySlugByLocale = {
  es: reverseMap(alternativeSlugByLocale.es),
  ca: reverseMap(alternativeSlugByLocale.ca),
};

const legalIdBySlugByLocale = {
  es: reverseMap(legalSlugByLocale.es),
  ca: reverseMap(legalSlugByLocale.ca),
};

export function getFeatureSlug(id: string, locale: Locale): string {
  return (
    featureSlugByLocale[locale][id as FeatureId] ??
    featureSlugByLocale.es[id as FeatureId] ??
    id
  );
}

export function getAlternativeSlug(id: string, locale: Locale): string {
  return (
    alternativeSlugByLocale[locale][id as AlternativeId] ??
    alternativeSlugByLocale.es[id as AlternativeId] ??
    id
  );
}

export function getLegalSlug(id: string, locale: Locale): string {
  return legalSlugByLocale[locale][id as LegalId] ?? legalSlugByLocale.es[id as LegalId] ?? id;
}

export function resolveFeatureIdFromSlug(slug: string, locale: Locale): string | null {
  return (
    (featureIdBySlugByLocale[locale][slug] as string | undefined) ??
    (featureIdBySlugByLocale.es[slug] as string | undefined) ??
    null
  );
}

export function resolveAlternativeIdFromSlug(slug: string, locale: Locale): string | null {
  return (
    (alternativeIdBySlugByLocale[locale][slug] as string | undefined) ??
    (alternativeIdBySlugByLocale.es[slug] as string | undefined) ??
    null
  );
}

export function resolveLegalIdFromSlug(slug: string, locale: Locale): string | null {
  return (
    (legalIdBySlugByLocale[locale][slug] as string | undefined) ??
    (legalIdBySlugByLocale.es[slug] as string | undefined) ??
    null
  );
}
