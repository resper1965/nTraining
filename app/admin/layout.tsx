import { requireSuperAdmin } from '@/lib/supabase/server'
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
  // requireSuperAdmin will redirect if user is not authenticated or not superadmin
  // We don't wrap it in try/catch because redirect() throws a special error
  const user = await requireSuperAdmin()

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
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

