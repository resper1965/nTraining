import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Prevent redirect loops - check if we've already processed this request
  const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0', 10)
  if (redirectCount > 3) {
    // Too many redirects, allow request to continue to prevent infinite loop
    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.warn('[middleware] Muitos redirects detectados, permitindo requisição:', {
        path: request.nextUrl.pathname,
        count: redirectCount,
      })
    }
    return NextResponse.next()
  }

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
      headers: new Headers(request.headers),
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
              headers: new Headers(request.headers),
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
              headers: new Headers(request.headers),
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

    // Auth routes (login, signup)
    // IMPORTANTE: waiting-room NÃO é uma auth route normal - permite acesso mesmo com is_active = false
    const authPaths = ['/auth/login', '/auth/signup']
    const isAuthPath = authPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )
    
    // Waiting room é uma rota especial - permite acesso mesmo com is_active = false
    const isWaitingRoom = request.nextUrl.pathname.startsWith('/auth/waiting-room')

    // Redirect to login if accessing protected route without auth
    if (isProtectedPath && !user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      const redirectResponse = NextResponse.redirect(redirectUrl)
      redirectResponse.headers.set('x-redirect-count', String(redirectCount + 1))
      return redirectResponse
    }

    // REFATORADO: Fetch user data only when needed for redirect logic
    // Otimização: Skip query se já está em /admin (layout verifica)
    let userData: { is_superadmin: boolean; is_active: boolean } | null = null
    if (user && (isAuthPath || isProtectedPath || isWaitingRoom)) {
      // Se já está em /admin, não precisa verificar aqui - layout faz isso
      // Isso evita query duplicada e race conditions
      if (request.nextUrl.pathname.startsWith('/admin') && !isAuthPath) {
        // Permitir acesso - layout vai verificar superadmin
        // Não fazer query aqui para evitar loops
        return response
      }
      
      // Query otimizada: busca apenas campos necessários
      // Timeout de 2 segundos para evitar loops
      try {
        const queryPromise = supabase
          .from('users')
          .select('is_superadmin, is_active')
          .eq('id', user.id)
          .single()

        // Timeout de 2 segundos
        const timeoutPromise = new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 2000)
        })

        const { data, error: userError } = await Promise.race([
          queryPromise,
          timeoutPromise.then(() => ({ data: null, error: { message: 'Timeout' } as any })),
        ]) as { data: any; error: any }

        if (!userError && data) {
          userData = data
          
          // IMPORTANTE: Se for superadmin e estiver tentando acessar waiting-room, redirecionar imediatamente
          if (data.is_superadmin === true && isWaitingRoom) {
            const redirectResponse = NextResponse.redirect(new URL('/admin', request.url))
            redirectResponse.headers.set('x-redirect-count', String(redirectCount + 1))
            return redirectResponse
          }
        } else if (userError && process.env.NODE_ENV === 'development') {
          // Log apenas em desenvolvimento
          console.error('[middleware] Erro ao buscar userData:', {
            message: userError.message,
            code: userError.code,
            userId: user.id,
          })
        }
      } catch (error) {
        // Em caso de erro, continuar sem userData (layout vai verificar)
        if (process.env.NODE_ENV === 'development') {
          console.error('[middleware] Erro ao buscar userData (catch):', error)
        }
      }
    }

    // Check if user is pending approval (is_active = false)
    // IMPORTANTE: Superadmins NUNCA devem ser redirecionados para waiting-room
    // IMPORTANTE: Permitir acesso à waiting-room mesmo com is_active = false
    if (user && isProtectedPath && userData && !userData.is_active && !userData.is_superadmin) {
      // User is pending approval, redirect to waiting room
      // Mas permitir acesso se já está na waiting room
      // Superadmins nunca devem ser redirecionados para waiting-room
      if (!request.nextUrl.pathname.startsWith('/auth/waiting-room')) {
        const redirectResponse = NextResponse.redirect(new URL('/auth/waiting-room', request.url))
        redirectResponse.headers.set('x-redirect-count', String(redirectCount + 1))
        return redirectResponse
      }
    }
    
    // Permitir acesso à waiting-room mesmo se is_active = false
    // MAS: Se temos userData e é superadmin, já redirecionamos acima
    // Se não temos userData ainda, permitir acesso (página vai verificar)
    if (isWaitingRoom && user && !userData) {
      return response
    }
    
    // Se temos userData e é superadmin, não deve estar na waiting-room
    if (isWaitingRoom && user && userData?.is_superadmin === true) {
      const redirectResponse = NextResponse.redirect(new URL('/admin', request.url))
      redirectResponse.headers.set('x-redirect-count', String(redirectCount + 1))
      return redirectResponse
    }
    
    // Redirect to appropriate dashboard if accessing auth pages while logged in
    if (isAuthPath && user) {
      // Se não temos userData, buscar agora (necessário para decidir redirect)
      if (!userData) {
        try {
          const { data, error: userError } = await supabase
            .from('users')
            .select('is_superadmin, is_active')
            .eq('id', user.id)
            .single()
          
          if (!userError && data) {
            userData = data
          }
        } catch (error) {
          // Se erro, deixar passar e layout vai verificar
          return response
        }
      }
      
      // Se ainda não temos userData, deixar layout verificar
      if (!userData) {
        return response
      }
      
      const targetUrl = userData.is_superadmin === true ? '/admin' : '/dashboard'
      // Evitar redirect se já está na página correta
      if (request.nextUrl.pathname !== targetUrl && request.nextUrl.pathname !== '/') {
        const redirectResponse = NextResponse.redirect(new URL(targetUrl, request.url))
        redirectResponse.headers.set('x-redirect-count', String(redirectCount + 1))
        return redirectResponse
      }
    }

    // Redirect superadmin from regular dashboard to admin
    if (request.nextUrl.pathname === '/dashboard' && user && userData?.is_superadmin === true) {
      const redirectResponse = NextResponse.redirect(new URL('/admin', request.url))
      redirectResponse.headers.set('x-redirect-count', String(redirectCount + 1))
      return redirectResponse
    }
    
    // Redirect root path based on user status
    if (request.nextUrl.pathname === '/' && user) {
      // Se não temos userData, buscar agora (necessário para decidir redirect)
      if (!userData) {
        try {
          const { data, error: userError } = await supabase
            .from('users')
            .select('is_superadmin, is_active')
            .eq('id', user.id)
            .single()
          
          if (!userError && data) {
            userData = data
          }
        } catch (error) {
          // Se erro, redirecionar para dashboard como fallback
          const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
          redirectResponse.headers.set('x-redirect-count', String(redirectCount + 1))
          return redirectResponse
        }
      }
      
      // Se ainda não temos userData, redirecionar para dashboard como fallback
      if (!userData) {
        const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url))
        redirectResponse.headers.set('x-redirect-count', String(redirectCount + 1))
        return redirectResponse
      }
      
      const targetUrl = userData.is_superadmin === true ? '/admin' : '/dashboard'
      const redirectResponse = NextResponse.redirect(new URL(targetUrl, request.url))
      redirectResponse.headers.set('x-redirect-count', String(redirectCount + 1))
      return redirectResponse
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
