import { createClient } from '@supabase/supabase-js'
import { checkSupabaseConfig } from './config'

const config = checkSupabaseConfig()

// Use placeholder values if not configured (prevents build errors)
const supabaseUrl = config.url || 'https://placeholder.supabase.co'
const supabaseAnonKey = config.anonKey || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

