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
    redirect('/(main)/dashboard')
  }

  // Redirect to login if not authenticated
  redirect('/auth/login')
}
