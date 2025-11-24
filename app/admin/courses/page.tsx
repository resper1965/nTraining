import { getCourses } from '@/app/actions/courses'
import { requireRole } from '@/lib/supabase/server'
import { CourseCard } from '@/components/course-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminCoursesPage() {
  await requireRole('platform_admin')

  const courses = await getCourses({ status: undefined }) // Get all courses

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-medium text-white mb-2">
              Course Management
            </h1>
            <p className="text-slate-400">
              Manage all courses in the platform
            </p>
          </div>
          <Link href="/admin/courses/new">
            <Button>Create New Course</Button>
          </Link>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">
              No courses found
            </p>
            <Link href="/admin/courses/new">
              <Button>Create Your First Course</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="relative group">
                <CourseCard course={course} />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    course.status === 'published' 
                      ? 'bg-green-950/50 text-green-400' 
                      : course.status === 'draft'
                      ? 'bg-yellow-950/50 text-yellow-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {course.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

