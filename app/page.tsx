import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to dashboard if logged in
  if (user) {
    // Check if user is superadmin
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('is_superadmin')
        .eq('id', user.id)
        .single()
      
      if (userData?.is_superadmin) {
        redirect('/admin')
        return
      }
    } catch (error) {
      console.error('Error checking superadmin status:', error)
    }
    
    redirect('/dashboard')
    return
  }

  // Redirect to login if not authenticated
  redirect('/auth/login')
}
