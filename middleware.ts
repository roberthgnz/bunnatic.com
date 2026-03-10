import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {legacyBusinessSlugToSlug} from '@/lib/businessLandingData';
import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function getLegacyBusinessRedirectPath(pathname: string) {
  const match = pathname.match(/^\/(?:(es|ca)\/)?negocio\/([^/]+)\/?$/);
  if (!match) {
    return null;
  }

  const localePrefix = match[1] ? `/${match[1]}` : '';
  const legacySlug = match[2];
  const newSlug = legacyBusinessSlugToSlug[legacySlug];

  if (!newSlug) {
    return null;
  }

  return `${localePrefix}/negocio/${newSlug}`;
}

export default function middleware(request: NextRequest) {
  const {pathname} = new URL(request.url);
  const redirectPath = getLegacyBusinessRedirectPath(pathname);

  if (redirectPath) {
    const url = new URL(request.url);
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
