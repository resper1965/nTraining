import { getCourseBySlug, enrollInCourse } from '@/app/actions/courses'
import { requireAuth } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/progress-bar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CourseWithModules } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const user = await requireAuth()

  let course: CourseWithModules
  try {
    course = await getCourseBySlug(params.slug)
  } catch (error) {
    notFound()
  }

  const progress = course.modules?.[0]?.lessons?.[0] 
    ? null // Will be fetched separately if needed
    : null

  const totalLessons = course.modules?.reduce(
    (acc, mod) => acc + (mod.lessons?.length || 0),
    0
  ) || 0

  const totalDuration = course.modules?.reduce(
    (acc, mod) =>
      acc +
      (mod.lessons?.reduce(
        (sum, lesson) => sum + (lesson.duration_minutes || 0),
        0
      ) || 0),
    0
  ) || 0

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          {course.thumbnail_url && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            </div>
          )}

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-slate-500 uppercase">
                  {course.level}
                </span>
                {course.area && (
                  <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                    {course.area}
                  </span>
                )}
                {course.duration_hours && (
                  <span className="text-sm text-slate-400">
                    {course.duration_hours}h
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl font-medium text-white mb-3">
                {course.title}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

          {course.objectives && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
              <h2 className="font-display text-xl font-medium text-white mb-3">
                Learning Objectives
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 whitespace-pre-line">
                  {course.objectives}
                </p>
              </div>
            </div>
          )}

          <form action={enrollInCourse.bind(null, course.id)}>
            <Button size="lg" className="w-full md:w-auto">
              Start Course
            </Button>
          </form>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Modules List */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-medium text-white mb-6">
              Course Content
            </h2>
            <div className="space-y-4">
              {course.modules?.map((mod, moduleIndex) => (
                <Card
                  key={mod.id}
                  className="bg-slate-900 border-slate-800"
                >
                  <CardHeader>
                    <CardTitle className="font-display text-lg text-white">
                      Module {moduleIndex + 1}: {mod.title}
                    </CardTitle>
                    {mod.description && (
                      <CardDescription className="text-slate-400">
                        {mod.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mod.lessons?.map((lesson, lessonIndex) => (
                        <Link
                          key={lesson.id}
                          href={`/courses/${params.slug}/${mod.id}/${lesson.id}`}
                          className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-sm text-slate-500 font-mono">
                                {moduleIndex + 1}.{lessonIndex + 1}
                              </span>
                              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {lesson.duration_minutes && (
                                <span className="text-xs text-slate-500">
                                  {lesson.duration_minutes}min
                                </span>
                              )}
                              <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-400">
                                {lesson.content_type}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-white">
                    Course Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">
                      Total Lessons
                    </div>
                    <div className="text-lg font-medium text-white">
                      {totalLessons}
                    </div>
                  </div>
                  {totalDuration > 0 && (
                    <div>
                      <div className="text-sm text-slate-400 mb-1">
                        Total Duration
                      </div>
                      <div className="text-lg font-medium text-white">
                        {Math.round(totalDuration / 60)}h {totalDuration % 60}min
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Level</div>
                    <div className="text-lg font-medium text-white capitalize">
                      {course.level}
                    </div>
                  </div>
                  {course.area && (
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Area</div>
                      <div className="text-lg font-medium text-white">
                        {course.area}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

