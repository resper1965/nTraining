import { createClient } from '@supabase/supabase-js'
import { checkSupabaseConfig } from './config'

const config = checkSupabaseConfig()

// Use placeholder values if not configured (prevents build errors)
const supabaseUrl = config.url || 'https://placeholder.supabase.co'
const supabaseServiceRoleKey = config.serviceRoleKey || 'placeholder-key'

// Server-side client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

