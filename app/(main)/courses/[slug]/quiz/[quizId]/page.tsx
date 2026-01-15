import { requireAuth } from '@/lib/supabase/server'
import { getQuizById } from '@/app/actions/quizzes'
import { getCourseBySlug } from '@/app/actions/courses'
import { getUserQuizAttempts, startQuizAttempt } from '@/app/actions/quiz-attempts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, Clock, Target, AlertCircle, Play } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { QuizPlayer } from '@/components/quiz/quiz-player'

export const dynamic = 'force-dynamic'

export default async function QuizPage({
  params,
}: {
  params: { slug: string; quizId: string }
}) {
  await requireAuth()

  const [quizResult, courseResult] = await Promise.all([
    getQuizById(params.quizId),
    getCourseBySlug(params.slug),
  ])
  
  if ('message' in quizResult || 'message' in courseResult) {
    notFound()
  }
  
  const quiz = quizResult
  const course = courseResult

  // Get user attempts
  const attempts = await getUserQuizAttempts(params.quizId)
  const lastAttempt = attempts && attempts.length > 0 ? attempts[0] : null

  // Check if user can start a new attempt
  const canStartNewAttempt = !quiz.max_attempts || !lastAttempt || lastAttempt.attempt_number < quiz.max_attempts

  async function handleStartQuiz() {
    'use server'
    try {
      const attempt = await startQuizAttempt(params.quizId)
      redirect(`/courses/${params.slug}/quiz/${params.quizId}/attempt/${attempt.id}`)
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
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
            <span className="text-white">Quiz</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="text-slate-400 text-lg">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Quiz Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-400">Nota Mínima</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {quiz.passing_score}%
              </div>
            </CardContent>
          </Card>

          {quiz.time_limit_minutes && (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-400">Tempo Limite</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {quiz.time_limit_minutes}min
                </div>
              </CardContent>
            </Card>
          )}

          {quiz.max_attempts && (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-400">Máx. Tentativas</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {quiz.max_attempts}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-400">Questões</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {quiz.quiz_questions?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Previous Attempts */}
        {lastAttempt && (
          <Card className="bg-slate-900 border-slate-800 mb-8">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white">
                Última Tentativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400 mb-1">
                    Tentativa #{lastAttempt.attempt_number}
                  </div>
                  {lastAttempt.completed_at ? (
                    <>
                      <div className="text-lg font-medium text-white">
                        {lastAttempt.percentage}% ({lastAttempt.score}/{lastAttempt.max_score})
                      </div>
                      <div className={`text-sm mt-1 ${lastAttempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {lastAttempt.passed ? '✓ Aprovado' : '✗ Reprovado'}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-slate-400">
                      Em andamento
                    </div>
                  )}
                </div>
                {lastAttempt.completed_at && (
                  <Link href={`/courses/${params.slug}/quiz/${params.quizId}/result/${lastAttempt.id}`}>
                    <Button variant="outline">
                      Ver Resultado
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Quiz */}
        {canStartNewAttempt ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <form action={handleStartQuiz}>
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-6">
                    {lastAttempt
                      ? `Você tem ${quiz.max_attempts ? quiz.max_attempts - lastAttempt.attempt_number : 'ilimitadas'} tentativa(s) restante(s)`
                      : 'Clique no botão abaixo para iniciar o quiz'}
                  </p>
                  <Button type="submit" size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    {lastAttempt ? 'Nova Tentativa' : 'Iniciar Quiz'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">
                  Você atingiu o limite máximo de tentativas
                </p>
                {lastAttempt && (
                  <Link href={`/courses/${params.slug}/quiz/${params.quizId}/result/${lastAttempt.id}`}>
                    <Button variant="outline">
                      Ver Último Resultado
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
