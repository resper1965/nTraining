import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminBreadcrumbs } from '@/components/admin/breadcrumbs'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import { ErrorLogger } from '@/components/admin/error-logger'

// Use revalidate to match child pages and prevent promise resolution issues
export const revalidate = 30

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  // 1. Verificar se o usuário está autenticado
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !authUser) {
    redirect('/auth/login')
  }

  // 2. Verificar se o usuário é admin
  // Primeiro tenta verificar na tabela profiles (se existir)
  let isAdmin = false
  let userProfile: any = null

  // Tentar verificar na tabela profiles primeiro
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_platform_admin, full_name, email')
    .eq('id', authUser.id)
    .maybeSingle()

  if (!profileError && profile?.is_platform_admin) {
    isAdmin = true
    userProfile = profile
  } else {
    // Fallback: verificar is_superadmin na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_superadmin, full_name, email')
      .eq('id', authUser.id)
      .single()

    if (!userError && userData?.is_superadmin) {
      isAdmin = true
      userProfile = userData
    }
  }

  // 3. Se não for admin, redirecionar
  if (!isAdmin) {
    redirect('/unauthorized')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <ErrorLogger />
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="border-b border-slate-800 bg-slate-900">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-lg font-medium text-white">
                  Painel Administrativo
                </h1>
                <p className="text-sm text-slate-400">
                  {userProfile?.full_name || authUser.email}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <form action={signOut}>
                  <Button type="submit" variant="outline" size="sm">
                    Sair
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-950">
          <div className="p-6 min-h-full">
            <AdminBreadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
