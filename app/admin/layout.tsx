import { requireSuperAdmin } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { getCurrentUser } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSuperAdmin()
  const user = await getCurrentUser()

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
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

