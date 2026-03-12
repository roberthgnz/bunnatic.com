import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
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

function copyResponseCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach(cookie => {
    target.cookies.set(cookie.name, cookie.value, {
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expires,
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
      secure: cookie.secure,
    });
  });
}

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

function getLegacyCreateRedirectPath(pathname: string) {
  const legacyCreateMatch = pathname.match(/^\/(?:(es|ca)\/)?crear\/?$/);
  if (!legacyCreateMatch) {
    return null;
  }

  const localePrefix = getLocalePrefix(pathname);
  return `${localePrefix}/crear-pagina-web-negocio`;
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

export default async function middleware(request: NextRequest) {
  // First, update the Supabase session
  const supabaseResponse = await updateSession(request);

  const {pathname} = new URL(request.url);
  const legacyCreateRedirectPath = getLegacyCreateRedirectPath(pathname);
  if (legacyCreateRedirectPath) {
    const url = new URL(request.url);
    url.pathname = legacyCreateRedirectPath;
    const response = NextResponse.redirect(url, 308);
    copyResponseCookies(supabaseResponse, response);
    return response;
  }

  const redirectPath = getCanonicalBusinessRedirectPath(pathname);

  if (redirectPath) {
    const url = new URL(request.url);
    url.pathname = redirectPath;
    const response = NextResponse.redirect(url);
    copyResponseCookies(supabaseResponse, response);
    return response;
  }

  const rewritePath = getLocalizedStaticRewritePath(pathname);
  if (rewritePath) {
    const url = new URL(request.url);
    url.pathname = rewritePath;
    const response = NextResponse.rewrite(url);
    copyResponseCookies(supabaseResponse, response);
    return response;
  }

  // Handle intl middleware
  const response = intlMiddleware(request);
  copyResponseCookies(supabaseResponse, response);
  return response;
}

export const config = {
  matcher: ['/((?!api|auth|_next|_vercel|.*\\..*).*)'],
};
