/**
 * Verifica se as variáveis de ambiente do Supabase estão configuradas
 */
export function checkSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const missing: string[] = []
  
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')

  if (missing.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Supabase environment variables missing:', missing.join(', '))
    console.warn('   Configure them in .env.local or Vercel settings')
  }

  return {
    isConfigured: missing.length === 0,
    missing,
    url: url || '',
    anonKey: anonKey || '',
    serviceRoleKey: serviceRoleKey || '',
  }
}

