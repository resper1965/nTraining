import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/auth/login')
    return
  }

  // If authenticated, let middleware handle the redirect
  // This prevents double redirects and loops
  // Middleware will redirect superadmin to /admin and others to /dashboard
  try {
    const { data: userData } = await supabase
      .from('users')
      .select('is_superadmin')
      .eq('id', user.id)
      .single()
    
    if (userData?.is_superadmin === true) {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  } catch (error) {
    // If error, default to dashboard (middleware will handle further redirects)
    redirect('/dashboard')
  }
}
