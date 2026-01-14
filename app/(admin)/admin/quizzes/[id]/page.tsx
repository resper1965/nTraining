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
import { ArrowLeft, Edit, Plus, FileText } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function QuizDetailPage({
  params,
}: {
  params: { id: string }
}) {
  await requireSuperAdmin()

  let quiz
  try {
    quiz = await getQuizById(params.id)
  } catch (error) {
    notFound()
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/quizzes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-white">
              {quiz.title}
            </h1>
            {quiz.courses && (
              <p className="text-slate-400 mt-1">
                {quiz.courses.title}
              </p>
            )}
          </div>
        </div>
        <Link href={`/admin/quizzes/${params.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Quiz Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-lg text-white">
              Informações do Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.description && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Descrição</div>
                <div className="text-white">{quiz.description}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-slate-400 mb-1">Nota Mínima</div>
              <div className="text-lg font-medium text-white">{quiz.passing_score}%</div>
            </div>
            {quiz.time_limit_minutes && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Tempo Limite</div>
                <div className="text-lg font-medium text-white">{quiz.time_limit_minutes} minutos</div>
              </div>
            )}
            {quiz.max_attempts && (
              <div>
                <div className="text-sm text-slate-400 mb-1">Máx. Tentativas</div>
                <div className="text-lg font-medium text-white">{quiz.max_attempts}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-slate-400 mb-1">Mostrar Respostas</div>
              <div className="text-lg font-medium text-white">
                {quiz.show_correct_answers ? 'Sim' : 'Não'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg text-white">
                Questões
              </CardTitle>
              <Link href={`/admin/quizzes/${params.id}/questions`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
              <div className="space-y-3">
                {quiz.quiz_questions.map((question: any, index: number) => (
                  <div
                    key={question.id}
                    className="p-3 bg-slate-800 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-slate-400 mb-1">
                          Questão {index + 1}
                        </div>
                        <div className="text-white font-medium line-clamp-2">
                          {question.question_text}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {question.question_type} • {question.points} ponto(s)
                        </div>
                      </div>
                      <Link href={`/admin/quizzes/${params.id}/questions/${question.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">
                  Nenhuma questão cadastrada
                </p>
                <Link href={`/admin/quizzes/${params.id}/questions`}>
                  <Button variant="outline">
                    Adicionar Primeira Questão
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

