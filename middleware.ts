import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
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
      error,
    } = await supabase.auth.getUser()

    // If there's an auth error, log it but don't crash
    if (error) {
      console.error('Auth error in middleware:', error.message)
    }

    // Protected routes
    const protectedPaths = ['/dashboard', '/courses', '/admin', '/profile', '/search', '/certificates', '/notifications']
    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )

    // Auth routes (login only)
    const authPaths = ['/auth/login']
    const isAuthPath = authPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )

    // Public routes
    const publicPaths = ['/']
    const isPublicPath = publicPaths.some((path) =>
      request.nextUrl.pathname === path
    )

    // Redirect to login if accessing protected route without auth
    if (isProtectedPath && !user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect to dashboard if accessing auth pages while logged in
    if (isAuthPath && user) {
      // Check if user is superadmin and redirect accordingly
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_superadmin')
          .eq('id', user.id)
          .single()
        
        if (userError) {
          console.error('Error fetching user in middleware:', userError)
        }
        
        if (userData?.is_superadmin === true) {
          console.log('Middleware: Redirecting superadmin from auth to /admin')
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      } catch (error) {
        console.error('Error checking superadmin status in middleware:', error)
      }
      
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // Redirect superadmin from dashboard to admin
    if (request.nextUrl.pathname === '/dashboard' && user) {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_superadmin')
          .eq('id', user.id)
          .single()
        
        if (userError) {
          console.error('Error fetching user in middleware (dashboard):', userError)
        }
        
        // Use strict equality check
        const isSuperAdmin = userData?.is_superadmin === true || userData?.is_superadmin === 'true'
        if (isSuperAdmin) {
          console.log('Middleware: Redirecting superadmin from /dashboard to /admin', {
            email: user.email,
            is_superadmin: userData?.is_superadmin
          })
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      } catch (error) {
        console.error('Error checking superadmin status in middleware (dashboard):', error)
      }
    }

    return response
  } catch (error) {
    // Log error but don't crash - allow request to continue
    console.error('Middleware error:', error)
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

