import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Usar revalidate em vez de force-dynamic para evitar loops
export const revalidate = 0

export default async function Home() {
  // Verificar autenticação básica
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se não autenticado, redirecionar para login
  if (!user) {
    redirect('/auth/login')
  }

  // Se autenticado, buscar dados do usuário para decidir redirect
  // Usar getCurrentUser que tem cache e lock para evitar múltiplas queries
  try {
    const { getCurrentUser } = await import('@/lib/supabase/server')
    const userData = await getCurrentUser()
    
    // Redirecionar baseado no status do usuário
    if (userData?.is_superadmin === true) {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  } catch (error) {
    // Se erro, redirecionar para dashboard como fallback
    // O middleware vai interceptar e corrigir se necessário
    redirect('/dashboard')
  }
  
  // Este código nunca será executado, mas TypeScript precisa de um retorno
  // redirect() lança uma exceção especial do Next.js que interrompe a execução
  return null
}
