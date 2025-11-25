import { requireSuperAdmin } from '@/lib/supabase/server'
import { getQuizzes } from '@/app/actions/quizzes'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus, FileText, Clock, Target, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function QuizzesPage() {
  await requireSuperAdmin()

  const quizzes = await getQuizzes()

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium text-white">
              Quizzes
            </h1>
            <p className="text-slate-400 mt-1">
              Gerencie quizzes e questões dos cursos
            </p>
          </div>
          <Link href="/admin/quizzes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Quiz
            </Button>
          </Link>
        </div>

        {/* Quizzes List */}
        {quizzes.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="font-display text-xl font-medium text-white mb-2">
                  Nenhum quiz encontrado
                </h3>
                <p className="text-slate-400 mb-6">
                  Crie seu primeiro quiz para avaliar o conhecimento dos alunos
                </p>
                <Link href="/admin/quizzes/new">
                  <Button>Criar Primeiro Quiz</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz: any) => (
              <Card
                key={quiz.id}
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="font-display text-lg text-white line-clamp-2">
                      {quiz.title}
                    </CardTitle>
                    {quiz.is_required && (
                      <span className="text-xs px-2 py-1 bg-yellow-950/50 text-yellow-400 rounded flex-shrink-0 ml-2">
                        Obrigatório
                      </span>
                    )}
                  </div>
                  {quiz.courses && (
                    <CardDescription className="text-slate-400">
                      {quiz.courses.title}
                    </CardDescription>
                  )}
                  {quiz.description && (
                    <CardDescription className="text-slate-500 text-sm mt-2 line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quiz Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Target className="h-4 w-4" />
                      <span>Nota mínima: {quiz.passing_score}%</span>
                    </div>
                    {quiz.time_limit_minutes && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span>Tempo limite: {quiz.time_limit_minutes}min</span>
                      </div>
                    )}
                    {quiz.max_attempts && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <AlertCircle className="h-4 w-4" />
                        <span>Máx. tentativas: {quiz.max_attempts}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                    <Link href={`/admin/quizzes/${quiz.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Gerenciar
                      </Button>
                    </Link>
                    <Link href={`/admin/quizzes/${quiz.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        Editar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  )
}

