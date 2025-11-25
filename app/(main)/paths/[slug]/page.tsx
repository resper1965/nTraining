import { requireAuth } from '@/lib/supabase/server'
import { getLearningPathBySlug, getLearningPathWithCourses } from '@/app/actions/learning-paths'
import { getCourseProgress } from '@/app/actions/course-progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  BookOpen,
  Award,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function LearningPathPage({
  params,
}: {
  params: { slug: string }
}) {
  await requireAuth()

  const path = await getLearningPathBySlug(params.slug).catch(() => null)

  if (!path) {
    notFound()
  }

  const pathWithCourses = await getLearningPathWithCourses(path.id).catch(() => null)

  if (!pathWithCourses || !pathWithCourses.path_courses) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center">Trilha não encontrada ou sem cursos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Calcular progresso da trilha
  let completedCourses = 0
  let totalProgress = 0

  const coursesWithStatus = await Promise.all(
    pathWithCourses.path_courses.map(async (pathCourse) => {
      if (!pathCourse.courses) return null

      const courseProgress = await getCourseProgress(pathCourse.courses.id).catch(() => ({ completion_percentage: 0 }))
      const progress = courseProgress.completion_percentage || 0
      
      if (progress >= 100) {
        completedCourses++
      }
      totalProgress += progress

      // Determinar status do curso
      let status: 'completed' | 'in_progress' | 'locked' | 'available' = 'available'
      let isLocked = false

      // Verificar se cursos anteriores foram completados
      const currentIndex = pathWithCourses.path_courses.findIndex(
        (pc) => pc.id === pathCourse.id
      )
      
      if (currentIndex > 0) {
        // Verificar se curso anterior foi completado
        const previousCourse = pathWithCourses.path_courses[currentIndex - 1]
        if (previousCourse.courses) {
        const prevProgress = await getCourseProgress(previousCourse.courses.id).catch(() => ({ completion_percentage: 0 }))
        if ((prevProgress.completion_percentage || 0) < 100) {
            isLocked = true
            status = 'locked'
          }
        }
      }

      if (progress >= 100) {
        status = 'completed'
      } else if (progress > 0) {
        status = 'in_progress'
      } else if (isLocked) {
        status = 'locked'
      }

      return {
        ...pathCourse,
        progress,
        status,
        isLocked,
      }
    })
  )

  const overallProgress = coursesWithStatus.length > 0
    ? totalProgress / coursesWithStatus.length
    : 0

  const nextCourse = coursesWithStatus.find(
    (c) => c && (c.status === 'available' || c.status === 'in_progress')
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            {path.title}
          </h1>
          {path.description && (
            <p className="text-slate-400 text-lg mb-4">{path.description}</p>
          )}
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progresso da Trilha</span>
              <span className="text-sm font-medium text-white">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
              <span>{completedCourses} de {coursesWithStatus.length} cursos completados</span>
              {path.estimated_duration_hours && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {path.estimated_duration_hours}h estimadas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Next Course Highlight */}
        {nextCourse && nextCourse.courses && (
          <Card className="bg-primary/10 border-primary/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                Próximo Curso Disponível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium text-lg mb-1">
                    {nextCourse.courses.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {nextCourse.courses.description}
                  </p>
                </div>
                <Link href={`/courses/${nextCourse.courses.slug}`}>
                  <Button>
                    {nextCourse.status === 'in_progress' ? 'Continuar' : 'Começar'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Courses Timeline */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-medium text-white mb-4">
            Cursos da Trilha
          </h2>
          
          {coursesWithStatus.map((pathCourse, index) => {
            if (!pathCourse || !pathCourse.courses) return null

            const course = pathCourse.courses
            const { status, progress, isLocked } = pathCourse

            return (
              <Card
                key={pathCourse.id}
                className={`bg-slate-900 border-slate-800 ${
                  status === 'completed'
                    ? 'border-green-500/50'
                    : status === 'in_progress'
                    ? 'border-primary/50'
                    : status === 'locked'
                    ? 'opacity-60'
                    : ''
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : status === 'in_progress'
                          ? 'bg-primary/20 text-primary'
                          : status === 'locked'
                          ? 'bg-slate-700 text-slate-500'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : status === 'locked' ? (
                        <Lock className="h-6 w-6" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-medium text-lg mb-1">
                            {course.title}
                          </h3>
                          {course.description && (
                            <p className="text-slate-400 text-sm mb-3">
                              {course.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {status === 'completed' && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completo
                            </Badge>
                          )}
                          {status === 'in_progress' && (
                            <Badge className="bg-primary/20 text-primary border-primary/50">
                              <Clock className="h-3 w-3 mr-1" />
                              Em Progresso
                            </Badge>
                          )}
                          {status === 'locked' && (
                            <Badge className="bg-slate-700 text-slate-400 border-slate-600">
                              <Lock className="h-3 w-3 mr-1" />
                              Bloqueado
                            </Badge>
                          )}
                          {pathCourse.is_required && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                              Obrigatório
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Progress */}
                      {status === 'in_progress' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400">Progresso</span>
                            <span className="text-xs text-slate-400">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      )}

                      {/* Course Meta */}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {course.duration_hours && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration_hours}h
                          </span>
                        )}
                        <span className="capitalize">{course.level}</span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4">
                        {status === 'locked' ? (
                          <p className="text-sm text-slate-500">
                            Complete o curso anterior para desbloquear
                          </p>
                        ) : (
                          <Link href={`/courses/${course.slug}`}>
                            <Button
                              variant={status === 'completed' ? 'outline' : 'default'}
                              size="sm"
                            >
                              {status === 'completed' ? (
                                <>
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Revisar
                                </>
                              ) : status === 'in_progress' ? (
                                <>
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Continuar
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Começar Curso
                                </>
                              )}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Completion Badge */}
        {completedCourses === coursesWithStatus.length && coursesWithStatus.length > 0 && (
          <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/50 mt-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Award className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-lg mb-1">
                    🎉 Parabéns! Você completou a trilha!
                  </h3>
                  <p className="text-slate-400">
                    Todos os cursos desta trilha foram concluídos com sucesso.
                  </p>
                </div>
                <Link href="/certificates">
                  <Button>
                    <Award className="h-4 w-4 mr-2" />
                    Ver Certificados
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

