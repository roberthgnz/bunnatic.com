import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {
  getBusinessLandingBySlug,
  getBusinessSlugByLocale,
  legacyBusinessSlugToSlugs,
} from '@/lib/businessLandingData';
import {
  getAlternativeSlug,
  getFeatureSlug,
  getLegalSlug,
  resolveAlternativeIdFromSlug,
  resolveFeatureIdFromSlug,
  resolveLegalIdFromSlug,
  type Locale,
} from '@/lib/pageSlugs';
import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function getLocaleFromPath(pathname: string): Locale {
  if (pathname === '/ca' || pathname.startsWith('/ca/')) {
    return 'ca';
  }

  return 'es';
}

function getLocalePrefix(pathname: string): string {
  return pathname === '/ca' || pathname.startsWith('/ca/') ? '/ca' : '';
}

function getCanonicalBusinessRedirectPath(pathname: string) {
  const match = pathname.match(/^\/(?:(es|ca)\/)?negocio\/([^/]+)\/?$/);
  if (!match) {
    return null;
  }

  const locale = getLocaleFromPath(pathname);
  const localePrefix = getLocalePrefix(pathname);
  const legacySlug = match[2];
  const legacyEntry = legacyBusinessSlugToSlugs[legacySlug];

  if (legacyEntry) {
    return `${localePrefix}/negocio/${legacyEntry[locale]}`;
  }

  const entry = getBusinessLandingBySlug(legacySlug);
  if (!entry) {
    return null;
  }

  const localizedSlug = getBusinessSlugByLocale(entry, locale);
  if (legacySlug === localizedSlug) {
    return null;
  }

  return `${localePrefix}/negocio/${localizedSlug}`;
}

function getLocalizedStaticRewritePath(pathname: string) {
  const locale = getLocaleFromPath(pathname);
  const localePrefix = getLocalePrefix(pathname);

  const featureMatch = pathname.match(/^\/(?:(es|ca)\/)?caracteristicas\/([^/]+)\/?$/);
  if (featureMatch) {
    const inputSlug = featureMatch[2];
    const featureId = resolveFeatureIdFromSlug(inputSlug, locale);
    if (!featureId) {
      return null;
    }

    const fsSlug = getFeatureSlug(featureId, 'es');
    if (inputSlug === fsSlug) {
      return null;
    }

    return `${localePrefix}/caracteristicas/${fsSlug}`;
  }

  const alternativeMatch = pathname.match(/^\/(?:(es|ca)\/)?alternativa\/([^/]+)\/?$/);
  if (alternativeMatch) {
    const inputSlug = alternativeMatch[2];
    const alternativeId = resolveAlternativeIdFromSlug(inputSlug, locale);
    if (!alternativeId) {
      return null;
    }

    const fsSlug = getAlternativeSlug(alternativeId, 'es');
    if (inputSlug === fsSlug) {
      return null;
    }

    return `${localePrefix}/alternativa/${fsSlug}`;
  }

  const legalMatch = pathname.match(/^\/(?:(es|ca)\/)?([^/]+)\/?$/);
  if (!legalMatch) {
    return null;
  }

  const inputSlug = legalMatch[2];
  const legalId = resolveLegalIdFromSlug(inputSlug, locale);
  if (!legalId) {
    return null;
  }

  const fsSlug = getLegalSlug(legalId, 'es');
  if (inputSlug === fsSlug) {
    return null;
  }

  return `${localePrefix}/${fsSlug}`;
}

export default function middleware(request: NextRequest) {
  const {pathname} = new URL(request.url);
  const redirectPath = getCanonicalBusinessRedirectPath(pathname);

  if (redirectPath) {
    const url = new URL(request.url);
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  const rewritePath = getLocalizedStaticRewritePath(pathname);
  if (rewritePath) {
    const url = new URL(request.url);
    url.pathname = rewritePath;
    return NextResponse.rewrite(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
