import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  type CookieOptions = Parameters<NextResponse['cookies']['set']>[2]

  // Track cookies to ensure they persist across multiple setAll calls if Supabase splits them
  const cookiesToSetOnResponse: {
    name: string
    value: string
    options?: CookieOptions
  }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Accumulate cookies
          cookiesToSet.forEach((cookie) => {
            cookiesToSetOnResponse.push(cookie)
          })

          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

          supabaseResponse = NextResponse.next({
            request,
          })

          // Apply ALL accumulated cookies
          cookiesToSetOnResponse.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let onboardingCompleted = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .maybeSingle()

    onboardingCompleted = Boolean(profile?.onboarding_completed)
  }

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/signin') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially redirect to login page
    // const url = request.nextUrl.clone()
    // url.pathname = '/signin'
    // return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid mutating
  //    the cookies!
  // 4. Return the myNewResponse object.

  return {
    response: supabaseResponse,
    user,
    onboardingCompleted,
  }
}
