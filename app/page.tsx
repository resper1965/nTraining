import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Simplificado: apenas verificar auth básico, deixar middleware/layout fazer o resto
  // Isso evita loops de redirect
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/auth/login')
    return
  }

  // Se autenticado, usar getCurrentUser que tem cache e lock
  // Isso evita múltiplas queries e loops
  try {
    const { getCurrentUser } = await import('@/lib/supabase/server')
    const userData = await getCurrentUser()
    
    if (userData?.is_superadmin === true) {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  } catch (error) {
    // Se erro, deixar middleware/layout lidar
    // Não fazer redirect aqui para evitar loops
    redirect('/dashboard')
  }
}
