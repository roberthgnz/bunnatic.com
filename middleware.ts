import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { env } from 'cloudflare:workers'
import { isPlatformHost } from '@/lib/domains/config'
import { normalizeHostname } from '@/lib/domains/hostname'

function securityHeaders(response: NextResponse) {
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const secure = (response: NextResponse) => {
    if (
      /^\/(api|auth|signin|signup|dashboard|onboarding|checkout|forgot-password|reset-password|verify-email)(?:\/|$)/.test(
        pathname
      )
    ) {
      response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    }
    return securityHeaders(response)
  }
  const host = normalizeHostname(
    (request.headers.get('host') || '').replace(/:\d+$/, '')
  )
  if (host && !isPlatformHost(host)) {
    // Customer domains never host platform authentication or billing endpoints.
    if (
      /^\/(api|auth|signin|signup|dashboard|onboarding|checkout)(?:\/|$)/.test(
        pathname
      )
    )
      return secure(new NextResponse('Not found', { status: 404 }))
    if (!/^\/w\/domain\/[^/]+\/?$/.test(pathname)) {
      const url = new URL(request.url)
      url.pathname = `/w/domain/${host}`
      return secure(NextResponse.rewrite(url))
    }
  }
  if (
    !/^\/(dashboard|signin|signup|onboarding|checkout)(?:\/|$)/.test(pathname)
  )
    return secure(NextResponse.next())
  const user = await getCurrentUser()
  if (!user && /^\/dashboard(?:\/|$)/.test(pathname)) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('next', `${pathname}${request.nextUrl.search}`)
    return secure(NextResponse.redirect(url))
  }
  if (user && /^\/(signin|signup|onboarding|checkout)(?:\/|$)/.test(pathname)) {
    const profile = await env.DB.prepare(
      'SELECT onboarding_completed FROM profiles WHERE id = ?'
    )
      .bind(user.id)
      .first<{ onboarding_completed: number }>()
    if (
      profile?.onboarding_completed ||
      /^\/(signin|signup)(?:\/|$)/.test(pathname)
    )
      return secure(
        NextResponse.redirect(
          new URL(
            profile?.onboarding_completed
              ? '/dashboard'
              : '/onboarding?step=checkout',
            request.url
          )
        )
      )
  }
  return secure(NextResponse.next())
}
export const config = { matcher: ['/((?!_next|.*\\..*).*)'] }
