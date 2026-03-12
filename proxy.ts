import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { getDefaultLocale, isPlatformHost } from '@/lib/domains/config';
import { normalizeHostname } from '@/lib/domains/hostname';
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
  if (pathname === '/es' || pathname.startsWith('/es/')) {
    return 'es';
  }

  if (pathname === '/ca' || pathname.startsWith('/ca/')) {
    return 'ca';
  }

  return getDefaultLocale() === 'ca' ? 'ca' : 'es';
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

function getRequestHost(request: NextRequest) {
  const xForwardedHost = request.headers.get('x-forwarded-host');
  const hostHeader = (xForwardedHost || request.headers.get('host') || '').trim().toLowerCase();
  if (!hostHeader) {
    return null;
  }

  const normalized = hostHeader.split(',')[0]?.trim().replace(/:\d+$/, '') || '';
  const safeHost = normalizeHostname(normalized);
  return safeHost;
}

function getCustomDomainRewritePath(request: NextRequest, pathname: string) {
  const host = getRequestHost(request);
  if (!host || isPlatformHost(host)) {
    return null;
  }

  if (/^\/(?:(es|ca)\/)?w\/domain\/[^/]+\/?$/.test(pathname)) {
    return null;
  }

  const locale = getLocaleFromPath(pathname);
  const localePrefix = locale === 'ca' ? '/ca' : '';
  return `${localePrefix}/w/domain/${host}`;
}

export default async function middleware(request: NextRequest) {
  const {pathname} = new URL(request.url);
  const customDomainRewritePath = getCustomDomainRewritePath(request, pathname);
  if (customDomainRewritePath) {
    const rewriteUrl = new URL(request.url);
    rewriteUrl.pathname = customDomainRewritePath;
    return NextResponse.rewrite(rewriteUrl);
  }

  // First, update the Supabase session
  const { response: supabaseResponse, user, onboardingCompleted } = await updateSession(request);

  const localePrefix = getLocalePrefix(pathname);

  const guestOnlyAuthPagesMatch = pathname.match(/^\/(?:(es|ca)\/)?(signin|signup)(?:\/|$)/);
  if (guestOnlyAuthPagesMatch && user) {
    const url = new URL(request.url);
    if (onboardingCompleted) {
      url.pathname = `${localePrefix}/dashboard`;
      url.search = '';
    } else {
      url.pathname = `${localePrefix}/onboarding`;
      url.search = '?step=checkout';
    }
    const response = NextResponse.redirect(url);
    copyResponseCookies(supabaseResponse, response);
    return response;
  }

  const onboardingOrCheckoutMatch = pathname.match(/^\/(?:(es|ca)\/)?(onboarding|checkout)(?:\/|$)/);
  if (onboardingOrCheckoutMatch && user && onboardingCompleted) {
    const url = new URL(request.url);
    url.pathname = `${localePrefix}/dashboard`;
    const response = NextResponse.redirect(url);
    copyResponseCookies(supabaseResponse, response);
    return response;
  }

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
