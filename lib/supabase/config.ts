export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// Validate required environment variables (only in runtime, not during build)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
  if (!supabaseConfig.url) {
    console.error('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!supabaseConfig.anonKey) {
    console.error('⚠️ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
}

export const appConfig = {
  name: 'nTraining',
  description: 'Professional training platform powered by ness.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

export const authConfig = {
  redirectAfterLogin: '/dashboard',
  redirectAfterLogout: '/',
  redirectAfterSignup: '/onboarding',
};
