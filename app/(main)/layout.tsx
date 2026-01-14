import { getCurrentUser } from '@/lib/auth/helpers'
import { Header } from '@/components/layout/header'
import { ErrorBoundary } from '@/components/error-boundary'
import { redirect } from 'next/navigation'

/**
 * REFATORADO: Layout main com verificação de auth
 * 
 * Responsabilidades:
 * - Verifica autenticação (middleware já fez verificação básica)
 * - Verifica is_active (redireciona para waiting-room se false)
 * - Verifica is_superadmin (redireciona para /admin se true)
 * - Renderiza header e conteúdo para usuários autenticados e ativos
 */
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Se não autenticado, middleware já redirecionou, mas garantir aqui também
  if (!user) {
    redirect('/auth/login')
  }

  // IMPORTANTE: Superadmin SEMPRE vai para /admin, mesmo se is_active = false
  // Verificar PRIMEIRO antes de qualquer outra verificação
  if (user.is_superadmin === true) {
    redirect('/admin')
  }

  // Se não é superadmin e não está ativo, deve estar na waiting room
  if (!user.is_active) {
    redirect('/auth/waiting-room')
  }

  // Usuário autenticado e ativo - renderizar layout
  return (
    <>
      <Header />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </>
  )
}

