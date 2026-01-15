import { requireSuperAdmin } from '@/lib/supabase/server'
import { getQuizById } from '@/app/actions/quizzes'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { QuestionList } from '@/components/admin/question-list'

export const dynamic = 'force-dynamic'

export default async function QuizQuestionsPage({
  params,
}: {
  params: { id: string }
}) {
  await requireSuperAdmin()

  const quizResult = await getQuizById(params.id)
  
  if ('message' in quizResult) {
    notFound()
  }
  
  const quiz = quizResult

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/quizzes/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-white">
              Questões do Quiz
            </h1>
            <p className="text-slate-400 mt-1">
              {quiz.title}
            </p>
          </div>
        </div>
        <Link href={`/admin/quizzes/${params.id}/questions/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Questão
          </Button>
        </Link>
      </div>

      {/* Questions List */}
      {quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
        <QuestionList
          quizId={params.id}
          questions={quiz.quiz_questions}
        />
      ) : (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-slate-400 mb-6">
                Nenhuma questão cadastrada ainda
              </p>
              <Link href={`/admin/quizzes/${params.id}/questions/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Questão
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

