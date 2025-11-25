import { requireAuth } from '@/lib/supabase/server'
import { getQuizById } from '@/app/actions/quizzes'
import { getCourseBySlug } from '@/app/actions/courses'
import { getQuizAttemptById, submitQuizAttempt } from '@/app/actions/quiz-attempts'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { QuizPlayer } from '@/components/quiz/quiz-player'

export const dynamic = 'force-dynamic'

export default async function QuizAttemptPage({
  params,
}: {
  params: { slug: string; quizId: string; attemptId: string }
}) {
  await requireAuth()

  let quiz, course, attempt
  try {
    [quiz, course, attempt] = await Promise.all([
      getQuizById(params.quizId),
      getCourseBySlug(params.slug),
      getQuizAttemptById(params.attemptId),
    ])
  } catch (error) {
    notFound()
  }

  // If already completed, redirect to results
  if (attempt.completed_at) {
    redirect(`/courses/${params.slug}/quiz/${params.quizId}/result/${params.attemptId}`)
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
            <span className="text-white">Tentativa #{attempt.attempt_number}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            {quiz.title}
          </h1>
          <p className="text-slate-400">
            Tentativa #{attempt.attempt_number}
          </p>
        </div>

        {/* Quiz Player */}
        <QuizPlayer
          quiz={quiz}
          attemptId={attempt.id}
          timeLimitMinutes={quiz.time_limit_minutes || undefined}
        />
      </div>
    </div>
  )
}

