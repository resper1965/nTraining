import { getCurrentUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'

/**
 * Página raiz: Redireciona usuários autenticados ou mostra landing page
 * 
 * - Usuários não autenticados: redireciona para /landing
 * - Usuários autenticados: redireciona baseado no status
 */
export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/landing')
  }

  // IMPORTANTE: Superadmin SEMPRE vai para /admin, mesmo se is_active = false
  // Verificar PRIMEIRO antes de qualquer outra verificação
  if (user.is_superadmin === true) {
    redirect('/admin')
  }

  // Se não é superadmin e não está ativo, vai para waiting room
  if (!user.is_active) {
    redirect('/auth/waiting-room')
  }

  // Usuário normal e ativo vai para dashboard
  redirect('/dashboard')
}
