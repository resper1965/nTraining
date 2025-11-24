import { getCurrentUser, requireRole, getUserById } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode
  searchParams?: { userId?: string }
}) {
  const user = await getCurrentUser() || (searchParams?.userId ? await getUserById(searchParams.userId) : null)
  const hasAdminAccess = user ? await requireRole('platform_admin', user.id) : null
  
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium text-white mb-4">
            Acesso negado
          </h1>
          <p className="text-slate-400">
            Você não tem permissão para acessar esta área
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Admin Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-display text-xl font-medium text-white">
                Admin<span className="text-primary">.</span>
              </Link>
                  <nav className="flex items-center gap-4">
                    <Link
                      href="/admin/tenants"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Tenants
                    </Link>
                    <Link
                      href="/admin/courses"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Courses
                    </Link>
                    <Link
                      href="/admin/users"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Users
                    </Link>
                  </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}

