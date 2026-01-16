import { Suspense } from 'react'
import { getCoursesWithProgress, getCourseAreas } from '@/app/actions/courses'
import { requireAuth } from '@/lib/supabase/server'
import { CourseCard } from '@/components/course-card'
import { CourseFilters } from '@/components/course-filters'
import { CourseCardSkeleton } from '@/components/ui/course-card-skeleton'
import type { CourseLevel } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { level?: string; area?: string; search?: string }
}) {
  await requireAuth()

  const filters = {
    level: searchParams.level as CourseLevel | undefined,
    area: searchParams.area || undefined,
    search: searchParams.search || undefined,
    status: 'published' as const,
  }

  const [coursesResult, areasResult] = await Promise.all([
    getCoursesWithProgress(filters),
    getCourseAreas(),
  ])
  
  const courses = 'message' in coursesResult ? [] : coursesResult
  const areas = 'message' in areasResult ? [] : areasResult

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Courses
          </h1>
          <p className="text-slate-400">
            Explore our training courses and start your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <CourseFilters areas={areas} />
            </div>
          </aside>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            }>
              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-lg mb-4">
                    Nenhum curso encontrado
                  </p>
                  <p className="text-slate-500 text-sm">
                    Tente ajustar seus filtros ou volte mais tarde
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      showProgress={true}
                    />
                  ))}
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

