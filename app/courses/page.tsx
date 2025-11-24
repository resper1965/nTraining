import { getCoursesWithProgress, getCourseAreas } from '@/app/actions/courses'
import { CourseCard } from '@/components/course-card'
import { CourseFilters } from '@/components/course-filters'
import type { CourseLevel } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { level?: string; area?: string; search?: string }
}) {
  try {

    const filters = {
      level: searchParams.level as CourseLevel | undefined,
      area: searchParams.area || undefined,
      search: searchParams.search || undefined,
      status: 'published' as const,
    }

    const [courses, areas] = await Promise.all([
      getCoursesWithProgress(filters),
      getCourseAreas(),
    ])

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
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg mb-4">
                  No courses found
                </p>
                <p className="text-slate-500 text-sm">
                  Try adjusting your filters or check back later
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
          </div>
        </div>
      </div>
    </main>
  )
  } catch (error) {
    console.error('Courses page error:', error)
    return (
      <main className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="font-display text-2xl font-medium text-white mb-4">
              Error loading courses
            </h1>
            <p className="text-slate-400">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      </main>
    )
  }
}

