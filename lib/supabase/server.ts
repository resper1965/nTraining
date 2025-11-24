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

// Helper to get current user from context (cookie or query param)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return null;
    }

    return await getUserById(userId);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Helper to require user (returns null if not found, doesn't redirect)
export async function requireUser(userId?: string): Promise<User | null> {
  if (userId) {
    return await getUserById(userId);
  }
  return await getCurrentUser();
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

// Helper to require superadmin (returns null if not superadmin)
export async function requireSuperAdmin(userId?: string): Promise<User | null> {
  const user = await requireUser(userId);
  
  if (!user || !user.is_superadmin) {
    return null;
  }
  
  return user;
}

// Helper to require specific role (returns null if doesn't have role)
export async function requireRole(role: 'platform_admin' | 'org_manager' | 'student', userId?: string): Promise<User | null> {
  const user = await requireUser(userId);

  if (!user) {
    return null;
  }

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
    return null;
  }

  return user;
}
