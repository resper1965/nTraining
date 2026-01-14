import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    const protectedPaths = ['/dashboard', '/courses', '/admin', '/profile', '/search', '/certificates', '/notifications']
    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )

    // Auth routes (login, signup, waiting-room)
    const authPaths = ['/auth/login', '/auth/signup', '/auth/waiting-room']
    const isAuthPath = authPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )

    // Redirect to login if accessing protected route without auth
    if (isProtectedPath && !user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Fetch user data only when needed for redirect logic
    let userData: { is_superadmin: boolean; is_active: boolean } | null = null
    if (user && (isAuthPath || isProtectedPath)) {
      const { data, error: userError } = await supabase
        .from('users')
        .select('is_superadmin, is_active')
        .eq('id', user.id)
        .single()

      if (!userError && data) {
        userData = data
      }
    }

    // Check if user is pending approval (is_active = false)
    if (user && isProtectedPath && userData && !userData.is_active) {
      // User is pending approval, redirect to waiting room
      if (!request.nextUrl.pathname.startsWith('/auth/waiting-room')) {
        return NextResponse.redirect(new URL('/auth/waiting-room', request.url))
      }
    }

    // Redirect to appropriate dashboard if accessing auth pages while logged in
    if (isAuthPath && user) {
      if (userData?.is_superadmin === true) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect superadmin from regular dashboard to admin
    if (request.nextUrl.pathname === '/dashboard' && user && userData?.is_superadmin === true) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
  } catch (error) {
    // Allow request to continue on error
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

