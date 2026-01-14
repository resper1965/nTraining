import { getCourseBySlug } from '@/app/actions/courses'
import { getLessonProgress } from '@/app/actions/progress'
import { getCourseLessonsProgress, getCourseCompletionPercentage } from '@/app/actions/course-progress'
import { requireAuth } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/progress-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LessonPlayer } from '@/components/lesson-player'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Play, BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LessonPage({
  params,
}: {
  params: { slug: string; moduleId: string; lessonId: string }
}) {
  const user = await requireAuth()

  const courseResult = await getCourseBySlug(params.slug)
  
  if ('message' in courseResult) {
    notFound()
  }
  
  const course = courseResult

  // Find the lesson
  const courseModule = course.modules?.find((m) => m.id === params.moduleId)
  const lesson = courseModule?.lessons?.find((l) => l.id === params.lessonId)

  if (!lesson) {
    notFound()
  }

  const [progress, lessonsProgress, courseCompletion] = await Promise.all([
    getLessonProgress(lesson.id),
    getCourseLessonsProgress(course.id),
    getCourseCompletionPercentage(course.id),
  ])

  const moduleIndex = course.modules?.findIndex((m) => m.id === params.moduleId) ?? 0
  const lessonIndex = courseModule?.lessons?.findIndex((l) => l.id === params.lessonId) ?? 0

  // Get previous and next lessons
  const allLessons = course.modules?.flatMap((mod, mIdx) =>
    mod.lessons?.map((l, lIdx) => ({
      ...l,
      moduleId: mod.id,
      moduleIndex: mIdx,
      lessonIndex: lIdx,
      moduleTitle: mod.title,
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
            <Link href="/courses" className="hover:text-white transition-colors">
              Cursos
            </Link>
            <span>/</span>
            <Link href={`/courses/${params.slug}`} className="hover:text-white transition-colors">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-white font-medium">
              Módulo {moduleIndex + 1} - Aula {lessonIndex + 1}
            </span>
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
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
              {previousLesson ? (
                <Link href={`/courses/${params.slug}/${previousLesson.moduleId}/${previousLesson.id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Aula Anterior
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link href={`/courses/${params.slug}/${nextLesson.moduleId}/${nextLesson.id}`}>
                  <Button className="flex items-center gap-2">
                    Próxima Aula
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/courses/${params.slug}`}>
                  <Button className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Voltar ao Curso
                  </Button>
                </Link>
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
                    Progresso do Curso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Geral</span>
                      <span className="text-sm font-medium text-white">
                        {courseCompletion}%
                      </span>
                    </div>
                    <ProgressBar
                      value={courseCompletion}
                      max={100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Esta Aula</span>
                      <span className="text-sm font-medium text-white">
                        {lesson.duration_minutes && progress
                          ? Math.round(
                              ((progress.watched_duration_seconds || 0) /
                                (lesson.duration_minutes * 60)) *
                                100
                            )
                          : progress?.is_completed
                          ? 100
                          : 0}
                        %
                      </span>
                    </div>
                    <ProgressBar
                      value={progress?.watched_duration_seconds || 0}
                      max={lesson.duration_minutes ? lesson.duration_minutes * 60 : 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Course Modules */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Conteúdo do Curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {course.modules?.map((mod, mIdx) => (
                      <div key={mod.id}>
                        <h3 className="text-sm font-medium text-slate-300 mb-2">
                          Módulo {mIdx + 1}: {mod.title}
                        </h3>
                        <div className="space-y-1">
                          {mod.lessons?.map((l, lIdx) => {
                            const lessonProgress = lessonsProgress[l.id]
                            const isCompleted = lessonProgress?.is_completed || false
                            const isCurrent = l.id === lesson.id

                            return (
                              <Link
                                key={l.id}
                                href={`/courses/${params.slug}/${mod.id}/${l.id}`}
                                className={`flex items-center gap-2 text-sm py-2 px-2 rounded transition-colors ${
                                  isCurrent
                                    ? 'bg-primary/20 text-primary font-medium'
                                    : isCompleted
                                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                                ) : (
                                  <Circle className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                )}
                                <span className="text-xs text-slate-500 font-mono">
                                  {mIdx + 1}.{lIdx + 1}
                                </span>
                                <span className="flex-1 truncate">{l.title}</span>
                                {isCurrent && (
                                  <Play className="h-3 w-3 text-primary flex-shrink-0" />
                                )}
                              </Link>
                            )
                          })}
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

