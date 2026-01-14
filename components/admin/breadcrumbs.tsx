'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href: string
}

export function AdminBreadcrumbs() {
  const pathname = usePathname()

  // Skip breadcrumbs on main admin page
  if (pathname === '/admin') {
    return null
  }

  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
  ]

  // Build breadcrumbs from path segments
  let currentPath = ''
  segments.slice(1).forEach((segment, index) => {
    currentPath += `/${segment}`

    // Skip numeric IDs (like organization IDs)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        href: `/admin${currentPath}`,
      })
    } else {
      // For IDs, try to get a meaningful label from the previous segment
      const actualIndex = index + 1 // Adjust for slice(1)
      const prevSegment = segments[actualIndex - 1]
      if (prevSegment) {
        breadcrumbs.push({
          label: prevSegment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          href: `/admin${currentPath}`,
        })
      }
    }
  })

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={crumb.href} className="flex items-center gap-2">
            {index === 0 ? (
              <Link
                href={crumb.href}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <ChevronRight className="h-4 w-4" />
                {isLast ? (
                  <span className="text-white font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}

