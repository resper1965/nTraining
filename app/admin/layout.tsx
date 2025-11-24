import { requireRole } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole('platform_admin')

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
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}

