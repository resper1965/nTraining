import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import type { User } from '@/lib/types/database';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

// Helper to get current user on server
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get extended user data
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return userData as User | null;
}

// Helper to require authentication
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

// Helper to require specific role
export async function requireRole(role: 'platform_admin' | 'org_manager' | 'student') {
  const user = await requireAuth();

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
