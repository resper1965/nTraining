import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * REFATORADO: Middleware simplificado
 * 
 * Responsabilidades:
 * - Apenas verifica autenticação básica (supabase.auth.getUser)
 * - Redireciona para login se não autenticado em rotas protegidas
 * - NÃO faz queries na tabela users (deixado para layouts)
 * - NÃO verifica is_active ou is_superadmin (deixado para layouts)
 * 
 * Benefícios:
 * - Muito mais simples e rápido
 * - Evita loops de redirect
 * - Evita queries duplicadas
 * - Lógica de autorização centralizada nos layouts
 */
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

    // Protected routes - requerem autenticação
    const protectedPaths = [
      '/dashboard',
      '/courses',
      '/admin',
      '/profile',
      '/search',
      '/certificates',
      '/notifications',
      '/auth/waiting-room', // waiting-room também requer auth
    ]
    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )

    // Auth routes (login, signup) - não requerem autenticação
    const authPaths = ['/auth/login', '/auth/signup']
    const isAuthPath = authPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )

    // Redirect to login if accessing protected route without auth
    if (isProtectedPath && !user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Se está em rota de auth e já autenticado, redirecionar para dashboard
    // Os layouts vão fazer verificações mais específicas (is_superadmin, is_active)
    // Não fazer queries aqui para evitar loops e problemas de performance
    if (isAuthPath && user) {
      // Redirecionar para dashboard - os layouts vão decidir o destino final
      // Isso evita queries desnecessárias no middleware
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Não fazer queries no middleware - deixar que as páginas e layouts decidam
    // A página waiting-room vai verificar is_superadmin e redirecionar se necessário

    // Para todas as outras rotas, deixar passar
    // Layouts vão fazer verificações mais específicas (is_active, is_superadmin, etc)
    return response
  } catch (error) {
    // Allow request to continue on error
    if (process.env.NODE_ENV === 'development') {
      console.error('[middleware] Erro:', error)
    }
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
