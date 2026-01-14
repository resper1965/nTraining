import { getCurrentUser } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'

/**
 * REFATORADO: Página raiz simplificada
 * 
 * Usa getCurrentUser() com cache request-scoped para decidir redirect
 * Middleware já verificou auth básica, então aqui apenas verificamos
 * is_superadmin e is_active para decidir destino final
 */
export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
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
