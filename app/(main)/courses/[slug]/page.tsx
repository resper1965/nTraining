import { getCourseBySlug, enrollInCourseAction } from '@/app/actions/courses'
import { requireAuth } from '@/lib/supabase/server'
import { getCourseLessonsProgress, getCourseCompletionPercentage } from '@/app/actions/course-progress'
import { getQuizzes } from '@/app/actions/quizzes'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/progress-bar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Circle, Play, BookOpen, Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import type { CourseWithModules } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { error?: string; success?: string }
}) {
  const user = await requireAuth()

  const courseResult = await getCourseBySlug(params.slug)
  
  if ('message' in courseResult) {
    notFound()
  }
  
  const course = courseResult

  // Get course progress and quizzes
  const [lessonsProgress, completionPercentage, quizzes] = await Promise.all([
    getCourseLessonsProgress(course.id),
    getCourseCompletionPercentage(course.id),
    getQuizzes(course.id).catch(() => []), // Don't fail if quizzes fail
  ])

  const totalLessons = course.modules?.reduce(
    (acc, mod) => acc + (mod.lessons?.length || 0),
    0
  ) || 0

  const completedLessons = Object.values(lessonsProgress).filter(
    (p) => p.is_completed
  ).length

  const totalDuration = course.modules?.reduce(
    (acc, mod) =>
      acc +
      (mod.lessons?.reduce(
        (sum, lesson) => sum + (lesson.duration_minutes || 0),
        0
      ) || 0),
    0
  ) || 0

  // Find first incomplete lesson or last lesson
  const allLessons = course.modules?.flatMap((mod) =>
    mod.lessons?.map((lesson) => ({
      ...lesson,
      moduleId: mod.id,
      moduleTitle: mod.title,
    })) || []
  ) || []

  const firstIncompleteLesson = allLessons.find(
    (lesson) => !lessonsProgress[lesson.id]?.is_completed
  ) || allLessons[0]

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {searchParams.success && (
          <div className="mb-6 p-4 bg-green-950/50 border border-green-800 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-300">Sucesso!</p>
              <p className="text-sm text-green-400 mt-1">{searchParams.success}</p>
            </div>
          </div>
        )}
        {/* Error Message */}
        {searchParams.error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-300">Erro ao inscrever no curso</p>
              <p className="text-sm text-red-400 mt-1">{searchParams.error}</p>
            </div>
          </div>
        )}
        {/* Course Header */}
        <div className="mb-8">
          {course.thumbnail_url && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
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

          {/* Progress Bar */}
          {completionPercentage > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Progresso do Curso</span>
                <span className="text-sm font-medium text-white">
                  {completionPercentage}%
                </span>
              </div>
              <ProgressBar
                value={completionPercentage}
                max={100}
                className="h-2"
              />
              <p className="text-xs text-slate-500 mt-2">
                {completedLessons} de {totalLessons} aulas concluídas
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center gap-4">
            {firstIncompleteLesson ? (
              <Link
                href={`/courses/${params.slug}/${firstIncompleteLesson.moduleId}/${firstIncompleteLesson.id}`}
              >
                <Button size="lg" className="w-full md:w-auto">
                  {completionPercentage > 0 ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Continuar Curso
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar Curso
                    </>
                  )}
                </Button>
              </Link>
            ) : (
              <form action={enrollInCourseAction.bind(null, course.id, course.slug)}>
                <Button size="lg" className="w-full md:w-auto">
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Curso
                </Button>
              </form>
            )}
          </div>
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
                      {mod.lessons?.map((lesson, lessonIndex) => {
                        const lessonProgress = lessonsProgress[lesson.id]
                        const isCompleted = lessonProgress?.is_completed || false
                        const isCurrent = lesson.id === firstIncompleteLesson?.id

                        return (
                          <Link
                            key={lesson.id}
                            href={`/courses/${params.slug}/${mod.id}/${lesson.id}`}
                            className={`block p-3 rounded-md transition-colors group ${
                              isCurrent
                                ? 'bg-primary/20 border border-primary/50'
                                : isCompleted
                                ? 'bg-slate-800/50 hover:bg-slate-700'
                                : 'bg-slate-800 hover:bg-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                                ) : (
                                  <Circle className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                )}
                                <span className="text-sm text-slate-500 font-mono">
                                  {moduleIndex + 1}.{lessonIndex + 1}
                                </span>
                                <span
                                  className={`text-sm transition-colors ${
                                    isCurrent
                                      ? 'text-primary font-medium'
                                      : isCompleted
                                      ? 'text-slate-300 group-hover:text-white'
                                      : 'text-slate-300 group-hover:text-white'
                                  }`}
                                >
                                  {lesson.title}
                                </span>
                                {isCurrent && (
                                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                                    Continuar
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                {lesson.duration_minutes && (
                                  <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {lesson.duration_minutes}min
                                  </span>
                                )}
                                <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-400 capitalize">
                                  {lesson.content_type}
                                </span>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
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
                  {completionPercentage > 0 && (
                    <div>
                      <div className="text-sm text-slate-400 mb-2">
                        Progresso
                      </div>
                      <ProgressBar
                        value={completionPercentage}
                        max={100}
                        className="h-3 mb-1"
                      />
                      <div className="text-lg font-medium text-white">
                        {completionPercentage}%
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Total de Aulas
                    </div>
                    <div className="text-lg font-medium text-white">
                      {totalLessons}
                    </div>
                    {completedLessons > 0 && (
                      <div className="text-xs text-slate-500 mt-1">
                        {completedLessons} concluídas
                      </div>
                    )}
                  </div>
                  {totalDuration > 0 && (
                    <div>
                      <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Duração Total
                      </div>
                      <div className="text-lg font-medium text-white">
                        {Math.round(totalDuration / 60)}h {totalDuration % 60}min
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Nível</div>
                    <div className="text-lg font-medium text-white capitalize">
                      {course.level === 'beginner' ? 'Iniciante' : course.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </div>
                  </div>
                  {course.area && (
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Área</div>
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
