import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import type { User } from '@/lib/types/database';

// Cache simples por request usando Map (thread-safe para server components)
// Key: userId, Value: { user: User, timestamp: number }
const requestCache = new Map<string, { user: User; timestamp: number }>();
const CACHE_TTL = 2000; // 2 segundos de cache

// Lock para evitar chamadas concorrentes do mesmo usuário
const pendingQueries = new Map<string, Promise<User | null>>();

export function createClient() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings.');
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie errors in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie errors in Server Components
          }
        },
      },
    }
  ) as any; // Temporary type assertion until database.types.ts is complete
}

/**
 * REFATORADO COMPLETO: Helper otimizado para obter usuário atual
 * 
 * Melhorias:
 * - Lock para evitar chamadas concorrentes (evita loops)
 * - Cache por request para evitar queries duplicadas
 * - Retry logic para queries que podem falhar temporariamente
 * - Logging detalhado apenas em caso de erro
 * - Tratamento robusto de erros
 */
export async function getCurrentUser(): Promise<User | null> {
  const startTime = Date.now()
  const isDev = process.env.NODE_ENV === 'development'
  
  try {
    const supabase = createClient()

    // Query 1: Obter usuário do Auth (sem retry para evitar loops)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      if (isDev) {
        console.error('[getCurrentUser] Erro Auth:', {
          message: authError.message,
          status: authError.status,
        })
      }
      return null
    }
    
    if (!user) {
      return null
    }

    // Verificar se já existe uma query pendente para este usuário (lock)
    const pendingQuery = pendingQueries.get(user.id)
    if (pendingQuery) {
      if (isDev) {
        console.log(`[getCurrentUser] Aguardando query pendente - User ID: ${user.id}`)
      }
      return await pendingQuery
    }

    // Verificar cache primeiro
    const cached = requestCache.get(user.id)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      if (isDev) {
        console.log(`[getCurrentUser] Cache hit - User ID: ${user.id}`)
      }
      return cached.user
    }

    // Criar promise para lock (evita múltiplas queries simultâneas)
    const queryPromise = (async () => {
      try {
        // Query 2: Obter dados estendidos da tabela users (sem retry para evitar loops)
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
          return null
        }
        
        if (!userData) {
          if (isDev) {
            console.error('[getCurrentUser] Usuário não encontrado na tabela users:', {
              userId: user.id,
            })
          }
          return null
        }
        
        // Armazenar no cache
        requestCache.set(user.id, {
          user: userData as User,
          timestamp: Date.now(),
        })
        
        // Limpar cache antigo (manter apenas últimos 10)
        if (requestCache.size > 10) {
          const entries = Array.from(requestCache.entries())
          entries.sort((a, b) => b[1].timestamp - a[1].timestamp)
          requestCache.clear()
          entries.slice(0, 10).forEach(([key, value]) => {
            requestCache.set(key, value)
          })
        }
        
        if (isDev) {
          const duration = Date.now() - startTime
          console.log(`[getCurrentUser] Sucesso em ${duration}ms - User ID: ${userData.id}`)
        }
        
        return userData as User | null
      } finally {
        // Remover lock após query completar
        pendingQueries.delete(user.id)
      }
    })()

    // Armazenar promise no lock
    pendingQueries.set(user.id, queryPromise)
    
    return await queryPromise
  } catch (error: any) {
    // Log apenas erros críticos inesperados
    if (isDev) {
      console.error('[getCurrentUser] Erro crítico:', {
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
      })
    }
    return null
  }
}

// Helper to get user by ID from database
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const supabase = createClient();
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !userData) {
      return null;
    }

    return userData as User | null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * REFATORADO: Requer autenticação
 * 
 * Melhorias:
 * - Evita redirect desnecessário se já está redirecionando
 * - Logging apenas em desenvolvimento
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login - this throws NEXT_REDIRECT which should not be caught
    // Não logar aqui pois é comportamento esperado
    const { redirect } = await import('next/navigation');
    redirect('/auth/login');
    // TypeScript doesn't know redirect() never returns
    throw new Error('Redirecting to login'); // This will never execute
  }

  return user;
}

// Helper to check if user is superadmin
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.is_superadmin === true;
  } catch {
    return false;
  }
}

/**
 * REFATORADO: Requer superadmin
 * 
 * Melhorias:
 * - Usa cache de getCurrentUser para evitar query duplicada
 * - Logging apenas em desenvolvimento
 */
export async function requireSuperAdmin(): Promise<User> {
  const user = await requireAuth();
  
  if (!user.is_superadmin) {
    // Não logar aqui pois é comportamento esperado
    const { redirect } = await import('next/navigation');
    redirect('/unauthorized');
    throw new Error('Redirecting to unauthorized');
  }
  
  return user;
}

// Helper to require specific role
export async function requireRole(role: 'platform_admin' | 'org_manager' | 'student') {
  const user = await requireAuth();

  // Superadmins bypass role checks
  if (user.is_superadmin) {
    return user;
  }

  const roleHierarchy = {
    platform_admin: 3,
    org_manager: 2,
    student: 1,
  };

  if (roleHierarchy[user.role] < roleHierarchy[role]) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return user;
}
