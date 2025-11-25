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
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_superadmin')
        .eq('id', user.id)
        .single()
      
      if (userError) {
        console.error('Error fetching user in home page:', userError)
      }
      
      // Use strict equality check
      const isSuperAdmin = userData?.is_superadmin === true || userData?.is_superadmin === 'true'
      if (isSuperAdmin) {
        console.log('Home page: Redirecting superadmin to /admin', {
          email: user.email,
          is_superadmin: userData?.is_superadmin
        })
        redirect('/admin')
        return
      }
    } catch (error) {
      console.error('Error checking superadmin status in home page:', error)
    }
    
    redirect('/dashboard')
    return
  }

  // Redirect to login if not authenticated
  redirect('/auth/login')
}
