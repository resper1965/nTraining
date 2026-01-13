import { requireSuperAdmin } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminBreadcrumbs } from '@/components/admin/breadcrumbs'
import { getCurrentUser } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import { ErrorBoundary } from '@/components/error-boundary'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user
  try {
    user = await requireSuperAdmin()
  } catch (error) {
    console.error('Error in AdminLayout requireSuperAdmin:', error)
    // Se não for superadmin, redirect já foi feito pelo requireSuperAdmin
    // Mas vamos renderizar uma mensagem de erro para debug
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/20 border border-red-700 rounded-lg">
          <h1 className="text-red-300 text-2xl mb-2 font-bold">Erro ao carregar layout admin</h1>
          <p className="text-red-400 text-sm">Verifique os logs do servidor</p>
          <p className="text-red-500 text-xs mt-2">{String(error)}</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    user = await getCurrentUser()
  }
  
  if (!user) {
    console.error('No user found in AdminLayout')
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <h1 className="text-yellow-300 text-2xl mb-2 font-bold">Usuário não encontrado</h1>
          <p className="text-yellow-400 text-sm">Faça login novamente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
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
                  {user?.full_name || user?.email}
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
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}

