import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { isPlatformHost } from '@/lib/domains/config'
import { normalizeHostname } from '@/lib/domains/hostname'

function copyResponseCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value, {
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expires,
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
      secure: cookie.secure,
    })
  })
}

function getRequestHost(request: NextRequest) {
  const xForwardedHost = request.headers.get('x-forwarded-host')
  const hostHeader = (xForwardedHost || request.headers.get('host') || '')
    .trim()
    .toLowerCase()
  if (!hostHeader) {
    return null
  }

  const normalized = hostHeader.split(',')[0]?.trim().replace(/:\d+$/, '') || ''
  const safeHost = normalizeHostname(normalized)
  return safeHost
}

function getCustomDomainRewritePath(request: NextRequest, pathname: string) {
  const host = getRequestHost(request)
  if (!host || isPlatformHost(host)) {
    return null
  }

  if (/^\/w\/domain\/[^/]+\/?$/.test(pathname)) {
    return null
  }

  return `/w/domain/${host}`
}

export default async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)
  const customDomainRewritePath = getCustomDomainRewritePath(request, pathname)
  if (customDomainRewritePath) {
    const rewriteUrl = new URL(request.url)
    rewriteUrl.pathname = customDomainRewritePath
    return NextResponse.rewrite(rewriteUrl)
  }

  // First, update the Supabase session
  const {
    response: supabaseResponse,
    user,
    onboardingCompleted,
  } = await updateSession(request)

  const guestOnlyAuthPagesMatch = pathname.match(
    /^\/(signin|signup)(?:\/|$)/
  )
  if (guestOnlyAuthPagesMatch && user) {
    const url = new URL(request.url)
    if (onboardingCompleted) {
      url.pathname = `/dashboard`
      url.search = ''
    } else {
      url.pathname = `/onboarding`
      url.search = '?step=checkout'
    }
    const response = NextResponse.redirect(url)
    copyResponseCookies(supabaseResponse, response)
    return response
  }

  const onboardingOrCheckoutMatch = pathname.match(
    /^\/(onboarding|checkout)(?:\/|$)/
  )
  if (onboardingOrCheckoutMatch && user && onboardingCompleted) {
    const url = new URL(request.url)
    url.pathname = `/dashboard`
    const response = NextResponse.redirect(url)
    copyResponseCookies(supabaseResponse, response)
    return response
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|auth|_next|_vercel|.*\\..*).*)'],
}
