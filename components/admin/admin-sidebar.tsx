'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  Ticket,
  FileText,
  Settings,
  Activity,
  GitBranch,
  Sparkles,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: typeof LayoutDashboard
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Organizações',
    href: '/admin/organizations',
    icon: Building2,
  },
  {
    title: 'Cursos',
    href: '/admin/courses',
    icon: BookOpen,
  },
  {
    title: 'Trilhas',
    href: '/admin/paths',
    icon: GitBranch,
  },
  {
    title: 'Usuários',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Licenças',
    href: '/admin/licenses',
    icon: Ticket,
  },
  {
    title: 'Relatórios',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    title: 'AI Architect',
    href: '/admin/ai',
    icon: Sparkles,
  },
  {
    title: 'Atividades',
    href: '/admin/activity',
    icon: Activity,
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-display text-lg font-medium text-white">
            Admin<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Voltar ao Dashboard</span>
        </Link>
      </div>
    </aside>
  )
}

