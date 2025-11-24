import { getCourseBySlug } from '@/app/actions/courses'
import { getLessonProgress } from '@/app/actions/progress'
import { requireAuth } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/progress-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LessonPlayer } from '@/components/lesson-player'
import { markLessonComplete } from '@/app/actions/progress'

export default async function LessonPage({
  params,
}: {
  params: { slug: string; moduleId: string; lessonId: string }
}) {
  const user = await requireAuth()

  let course
  try {
    course = await getCourseBySlug(params.slug)
  } catch (error) {
    notFound()
  }

  // Find the lesson
  const courseModule = course.modules?.find((m) => m.id === params.moduleId)
  const lesson = courseModule?.lessons?.find((l) => l.id === params.lessonId)

  if (!lesson) {
    notFound()
  }

  const progress = await getLessonProgress(lesson.id)
  const moduleIndex = course.modules?.findIndex((m) => m.id === params.moduleId) ?? 0
  const lessonIndex = courseModule?.lessons?.findIndex((l) => l.id === params.lessonId) ?? 0

  // Get previous and next lessons
  const allLessons = course.modules?.flatMap((mod, mIdx) =>
    mod.lessons?.map((l, lIdx) => ({
      ...l,
      moduleId: mod.id,
      moduleIndex: mIdx,
      lessonIndex: lIdx,
    })) || []
  ) || []

  const currentLessonIndex = allLessons.findIndex(
    (l) => l.id === params.lessonId
  )
  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null
  const nextLesson =
    currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/courses" className="hover:text-white">
              Courses
            </Link>
            <span>/</span>
            <Link href={`/courses/${params.slug}`} className="hover:text-white">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-white">Lesson {moduleIndex + 1}.{lessonIndex + 1}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson Content */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-white">
                  {lesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LessonPlayer lesson={lesson} progress={progress} />
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              {previousLesson ? (
                <Link href={`/courses/${params.slug}/${previousLesson.moduleId}/${previousLesson.id}`}>
                  <Button variant="outline">
                    ← Previous Lesson
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link href={`/courses/${params.slug}/${nextLesson.moduleId}/${nextLesson.id}`}>
                  <Button>
                    Next Lesson →
                  </Button>
                </Link>
              ) : (
                <form action={async () => {
                  'use server'
                  const { markLessonComplete } = await import('@/app/actions/progress')
                  await markLessonComplete(lesson.id)
                }}>
                  <Button type="submit">
                    Complete Course
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Course Progress */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-white">
                    Course Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressBar value={progress?.watched_duration_seconds || 0} max={lesson.duration_minutes ? lesson.duration_minutes * 60 : 100} />
                </CardContent>
              </Card>

              {/* Course Modules */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-white">
                    Course Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules?.map((mod, mIdx) => (
                      <div key={mod.id}>
                        <h3 className="text-sm font-medium text-slate-300 mb-2">
                          Module {mIdx + 1}: {mod.title}
                        </h3>
                        <div className="space-y-1">
                          {mod.lessons?.map((l, lIdx) => (
                            <Link
                              key={l.id}
                              href={`/courses/${params.slug}/${mod.id}/${l.id}`}
                              className={`block text-sm py-1 px-2 rounded ${
                                l.id === lesson.id
                                  ? 'bg-primary/20 text-primary'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              {mIdx + 1}.{lIdx + 1} {l.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

