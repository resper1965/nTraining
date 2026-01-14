import { requireSuperAdmin } from '@/lib/supabase/server'
import { getQuizById, updateQuiz, deleteQuiz } from '@/app/actions/quizzes'
import { getCourses } from '@/app/actions/courses'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { DeleteQuizButton } from '@/components/admin/delete-quiz-button'

export const dynamic = 'force-dynamic'

export default async function EditQuizPage({
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

  const coursesResult = await getCourses()
  const courses = 'message' in coursesResult ? [] : coursesResult

  async function handleUpdateQuiz(formData: FormData) {
    'use server'

    const courseId = formData.get('course_id') as string
    if (!courseId) {
      throw new Error('Curso é obrigatório')
    }

    await updateQuiz(params.id, {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      course_id: courseId,
      passing_score: formData.get('passing_score') ? parseInt(formData.get('passing_score') as string) : undefined,
      max_attempts: formData.get('max_attempts') ? (formData.get('max_attempts') ? parseInt(formData.get('max_attempts') as string) : null) : undefined,
      time_limit_minutes: formData.get('time_limit_minutes') ? (formData.get('time_limit_minutes') ? parseInt(formData.get('time_limit_minutes') as string) : null) : undefined,
      show_correct_answers: formData.get('show_correct_answers') === 'on',
    })

    redirect('/admin/quizzes')
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
              Editar Quiz
            </h1>
            <p className="text-slate-400 mt-1">
              {quiz.title}
            </p>
          </div>
        </div>
        <DeleteQuizButton quizId={params.id} />
      </div>

      {/* Form */}
      <form action={handleUpdateQuiz}>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Configure as informações principais do quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course */}
            <div className="space-y-2">
              <Label htmlFor="course_id">Curso *</Label>
              <select
                name="course_id"
                required
                defaultValue={quiz.course_id || ''}
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione um curso</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id} selected={course.id === quiz.course_id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={quiz.title}
                placeholder="Ex: Quiz de Avaliação Final"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={quiz.description || ''}
                placeholder="Descreva o objetivo e conteúdo do quiz"
                rows={3}
              />
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Passing Score */}
              <div className="space-y-2">
                <Label htmlFor="passing_score">Nota Mínima (%)</Label>
                <Input
                  id="passing_score"
                  name="passing_score"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={quiz.passing_score}
                  placeholder="70"
                />
              </div>

              {/* Max Attempts */}
              <div className="space-y-2">
                <Label htmlFor="max_attempts">Máx. Tentativas</Label>
                <Input
                  id="max_attempts"
                  name="max_attempts"
                  type="number"
                  min="1"
                  defaultValue={quiz.max_attempts || ''}
                  placeholder="Ilimitado"
                />
              </div>

              {/* Time Limit */}
              <div className="space-y-2">
                <Label htmlFor="time_limit_minutes">Tempo Limite (min)</Label>
                <Input
                  id="time_limit_minutes"
                  name="time_limit_minutes"
                  type="number"
                  min="1"
                  defaultValue={quiz.time_limit_minutes || ''}
                  placeholder="Sem limite"
                />
              </div>
            </div>

            {/* Show Correct Answers */}
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="show_correct_answers">Mostrar Respostas Corretas</Label>
                <p className="text-sm text-slate-400">
                  Exibir respostas corretas após a conclusão do quiz
                </p>
              </div>
              <Switch id="show_correct_answers" name="show_correct_answers" defaultChecked={quiz.show_correct_answers} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
              <Link href="/admin/quizzes" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1">
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Questions Section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display text-xl text-white">
                Questões
              </CardTitle>
              <CardDescription>
                Gerencie as questões deste quiz
              </CardDescription>
            </div>
            <Link href={`/admin/quizzes/${params.id}/questions`}>
              <Button>
                Gerenciar Questões
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-400">
                {quiz.quiz_questions.length} questão(ões) cadastrada(s)
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">
                Nenhuma questão cadastrada ainda
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
  )
}

