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

// Helper to get current user on server
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Get extended user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return null;
    }

    return userData as User | null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Helper to require authentication
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    // Redirect to login instead of throwing error
    // redirect() throws internally and never returns
    const { redirect } = await import('next/navigation');
    redirect('/auth/login');
  }

  // TypeScript doesn't know redirect() never returns, so we assert here
  return user as User;
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
