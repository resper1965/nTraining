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

/**
 * @deprecated Use `getCurrentUser` from `@/lib/auth/helpers` instead.
 * This is a compatibility wrapper that will be removed in a future version.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { getCurrentUser: getCurrentUserFromHelpers } = await import('@/lib/auth/helpers');
  return getCurrentUserFromHelpers();
}

/**
 * Helper to get user by ID from database.
 * This function is still used and not deprecated.
 */
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
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting user:', error);
    }
    return null;
  }
}

/**
 * @deprecated Use `requireAuth` from `@/lib/auth/helpers` instead.
 * This is a compatibility wrapper that will be removed in a future version.
 */
export async function requireAuth(): Promise<User> {
  const { requireAuth: requireAuthFromHelpers } = await import('@/lib/auth/helpers');
  return requireAuthFromHelpers();
}

/**
 * @deprecated Use `isSuperAdmin` from `@/lib/auth/helpers` instead.
 * This is a compatibility wrapper that will be removed in a future version.
 */
export async function isSuperAdmin(): Promise<boolean> {
  const { isSuperAdmin: isSuperAdminFromHelpers } = await import('@/lib/auth/helpers');
  return isSuperAdminFromHelpers();
}

/**
 * @deprecated Use `requireSuperAdmin` from `@/lib/auth/helpers` instead.
 * This is a compatibility wrapper that will be removed in a future version.
 */
export async function requireSuperAdmin(): Promise<User> {
  const { requireSuperAdmin: requireSuperAdminFromHelpers } = await import('@/lib/auth/helpers');
  return requireSuperAdminFromHelpers();
}

/**
 * @deprecated Use `requireRole` from `@/lib/auth/helpers` instead.
 * This is a compatibility wrapper that will be removed in a future version.
 */
export async function requireRole(role: 'platform_admin' | 'org_manager' | 'student'): Promise<User> {
  const { requireRole: requireRoleFromHelpers } = await import('@/lib/auth/helpers');
  return requireRoleFromHelpers(role);
}
