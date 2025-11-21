import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import type { User } from '@/lib/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
}) as any; // Temporary type assertion until database.types.ts is complete

// Helper to get current user
export async function getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    // Get extended user data from users table
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    return userData as User | null;
}

// Helper to check user role
export async function checkUserRole(requiredRole: 'platform_admin' | 'org_manager' | 'student') {
    const user = await getCurrentUser();

    if (!user) {
        return false;
    }

    const roleHierarchy: Record<string, number> = {
        platform_admin: 3,
        org_manager: 2,
        student: 1,
    };

    return (roleHierarchy[user.role as string] || 0) >= roleHierarchy[requiredRole];
}

// Helper to get user's organization
export async function getUserOrganization() {
    const user = await getCurrentUser();

    if (!user || !user.organization_id) {
        return null;
    }

    const { data: organization } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', user.organization_id)
        .single();

    return organization;
}
