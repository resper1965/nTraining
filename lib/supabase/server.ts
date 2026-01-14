import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import type { User } from '@/lib/types/database';

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

// Helper to get current user on server (via Supabase Auth)
// ⚠️ ROTINA CENTRAL - Esta função é chamada em múltiplos lugares e pode causar loops
export async function getCurrentUser(): Promise<User | null> {
  const startTime = Date.now()
  console.log('[getCurrentUser] Iniciando...')
  
  try {
    const supabase = createClient();
    console.log('[getCurrentUser] Cliente Supabase criado')

    // Query 1: Obter usuário do Auth
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[getCurrentUser] ERRO ao obter usuário do Auth:', {
        message: error.message,
        status: error.status,
        error: error
      })
      return null
    }
    
    if (!user) {
      console.log('[getCurrentUser] Nenhum usuário autenticado')
      return null
    }
    
    console.log('[getCurrentUser] Usuário Auth encontrado:', user.id)

    // Query 2: Obter dados estendidos da tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('[getCurrentUser] ERRO ao obter dados do usuário da tabela users:', {
        message: userError.message,
        code: userError.code,
        details: userError.details,
        hint: userError.hint,
        userId: user.id,
        error: userError
      })
      return null
    }
    
    if (!userData) {
      console.error('[getCurrentUser] Usuário não encontrado na tabela users:', {
        userId: user.id,
        message: 'Usuário existe no Auth mas não na tabela users'
      })
      return null
    }
    
    const duration = Date.now() - startTime
    console.log(`[getCurrentUser] Sucesso em ${duration}ms - User ID: ${userData.id}`)
    
    return userData as User | null
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('[getCurrentUser] ERRO CRÍTICO após', duration, 'ms:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      error: error
    })
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

// Helper to require authentication
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login - this throws NEXT_REDIRECT which should not be caught
    const { redirect } = await import('next/navigation');
    redirect('/auth/login');
    // TypeScript doesn't know redirect() never returns, so we need to assert
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

// Helper to require superadmin
export async function requireSuperAdmin(): Promise<User> {
  const user = await requireAuth();
  
  if (!user.is_superadmin) {
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
