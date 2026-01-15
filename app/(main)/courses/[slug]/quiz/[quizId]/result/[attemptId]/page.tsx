import { requireAuth } from '@/lib/supabase/server'
import { getQuizById } from '@/app/actions/quizzes'
import { getCourseBySlug } from '@/app/actions/courses'
import { getQuizAttemptById } from '@/app/actions/quiz-attempts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle2, XCircle, Clock, Target, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { QuizResults } from '@/components/quiz/quiz-results'

export const dynamic = 'force-dynamic'

export default async function QuizResultPage({
  params,
}: {
  params: { slug: string; quizId: string; attemptId: string }
}) {
  await requireAuth()

  const [quizResult, courseResult, attemptResult] = await Promise.all([
    getQuizById(params.quizId),
    getCourseBySlug(params.slug),
    getQuizAttemptById(params.attemptId),
  ])

  // Type guards: verificar cada resultado separadamente para type narrowing adequado
  if ('message' in quizResult) {
    notFound()
  }
  
  if ('message' in courseResult) {
    notFound()
  }
  
  if ('message' in attemptResult) {
    notFound()
  }
  
  // Após as verificações, TypeScript entende que não são ActionError
  const quiz = quizResult
  const course = courseResult
  const attempt = attemptResult

  if (!attempt.completed_at) {
    // Redirect to attempt page if not completed
    redirect(`/courses/${params.slug}/quiz/${params.quizId}/attempt/${params.attemptId}`)
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
            <Link href={`/courses/${params.slug}/quiz/${params.quizId}`} className="hover:text-white transition-colors">
              Quiz
            </Link>
            <span>/</span>
            <span className="text-white">Resultado</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            {attempt.passed ? (
              <div className="p-4 bg-green-950/50 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-green-400" />
              </div>
            ) : (
              <div className="p-4 bg-red-950/50 rounded-full">
                <XCircle className="h-16 w-16 text-red-400" />
              </div>
            )}
          </div>
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            {attempt.passed ? 'Parabéns! Você passou!' : 'Você não atingiu a nota mínima'}
          </h1>
          <p className="text-slate-400">
            {quiz.title} - Tentativa #{attempt.attempt_number}
          </p>
        </div>

        {/* Score Card */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-sm text-slate-400 mb-2">Pontuação</div>
                <div className="text-3xl font-bold text-white">
                  {attempt.score}/{attempt.max_score}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">Percentual</div>
                <div className={`text-3xl font-bold ${attempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {attempt.percentage}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">Nota Mínima</div>
                <div className="text-3xl font-bold text-white">
                  {quiz.passing_score}%
                </div>
              </div>
              {attempt.time_taken_seconds && (
                <div>
                  <div className="text-sm text-slate-400 mb-2 flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    Tempo
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {Math.floor(attempt.time_taken_seconds / 60)}:{(attempt.time_taken_seconds % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <QuizResults
          quiz={quiz}
          attempt={attempt}
          showCorrectAnswers={quiz.show_correct_answers}
        />

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link href={`/courses/${params.slug}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Curso
            </Button>
          </Link>
          {quiz.max_attempts && attempt.attempt_number < quiz.max_attempts && (
            <Link href={`/courses/${params.slug}/quiz/${params.quizId}`}>
              <Button>
                Nova Tentativa
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
