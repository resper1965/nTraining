import { createClient } from '@/lib/supabase/server'
import { getAuthContext, setAuthContext } from './context'
import type { User } from '@/lib/types/database'

/**
 * REFATORADO: Obtém o usuário atual com cache request-scoped
 * 
 * Melhorias:
 * - Usa AsyncLocalStorage para cache por request
 * - Garante apenas 1 query por request
 * - Todas as chamadas subsequentes no mesmo request usam cache
 * - Remove necessidade de locks e caches globais
 */
export async function getCurrentUser(): Promise<User | null> {
  const startTime = Date.now()
  const isDev = process.env.NODE_ENV === 'development'

  // Verificar cache do contexto primeiro
  const context = getAuthContext()
  if (context?.user) {
    if (isDev) {
      console.log(`[getCurrentUser] Cache hit - User ID: ${context.user.id}`)
    }
    return context.user
  }

  try {
    const supabase = createClient()

    // Query 1: Obter usuário do Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      if (isDev) {
        console.error('[getCurrentUser] Erro Auth:', {
          message: authError.message,
          status: authError.status,
        })
      }
      setAuthContext({ user: null, timestamp: Date.now() })
      return null
    }

    if (!user) {
      setAuthContext({ user: null, timestamp: Date.now() })
      return null
    }

    // Query 2: Obter dados estendidos da tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError) {
      // Log detalhado apenas em desenvolvimento ou para erros críticos
      if (isDev || userError.code !== 'PGRST116') {
        console.error('[getCurrentUser] Erro ao buscar usuário:', {
          message: userError.message,
          code: userError.code,
          userId: user.id,
        })
      }
      setAuthContext({ user: null, timestamp: Date.now() })
      return null
    }

    if (!userData) {
      if (isDev) {
        console.error('[getCurrentUser] Usuário não encontrado na tabela users:', {
          userId: user.id,
        })
      }
      setAuthContext({ user: null, timestamp: Date.now() })
      return null
    }

    const fullUser = userData as User

    // Armazenar no cache do contexto
    setAuthContext({ user: fullUser, timestamp: Date.now() })

    if (isDev) {
      const duration = Date.now() - startTime
      console.log(`[getCurrentUser] Sucesso em ${duration}ms - User ID: ${fullUser.id}`, {
        email: fullUser.email,
        is_superadmin: fullUser.is_superadmin,
        is_active: fullUser.is_active,
      })
    }

    return fullUser
  } catch (error: any) {
    // Log apenas erros críticos inesperados
    if (isDev) {
      console.error('[getCurrentUser] Erro crítico:', {
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
      })
    }
    setAuthContext({ user: null, timestamp: Date.now() })
    return null
  }
}

/**
 * Requer autenticação
 * 
 * Redireciona para /auth/login se não autenticado
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    // Redirect to login - this throws NEXT_REDIRECT which should not be caught
    const { redirect } = await import('next/navigation')
    redirect('/auth/login')
    // TypeScript doesn't know redirect() never returns
    throw new Error('Redirecting to login') // This will never execute
  }

  return user
}

/**
 * Verifica se o usuário atual é superadmin
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return user?.is_superadmin === true
  } catch {
    return false
  }
}

/**
 * Requer superadmin
 * 
 * Redireciona para /unauthorized se não for superadmin
 */
export async function requireSuperAdmin(): Promise<User> {
  const user = await requireAuth()

  if (!user.is_superadmin) {
    const { redirect } = await import('next/navigation')
    redirect('/unauthorized')
    throw new Error('Redirecting to unauthorized')
  }

  return user
}

/**
 * Requer role específica
 * 
 * Superadmins bypass role checks
 */
export async function requireRole(role: 'platform_admin' | 'org_manager' | 'student'): Promise<User> {
  const user = await requireAuth()

  // Superadmins bypass role checks
  if (user.is_superadmin) {
    return user
  }

  const roleHierarchy = {
    platform_admin: 3,
    org_manager: 2,
    student: 1,
  }

  if (roleHierarchy[user.role] < roleHierarchy[role]) {
    throw new Error('Forbidden: Insufficient permissions')
  }

  return user
}
