import { requireSuperAdmin } from '@/lib/supabase/server'
import { getCourses } from '@/app/actions/courses'
import { createQuiz } from '@/app/actions/quizzes'
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
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewQuizPage() {
  await requireSuperAdmin()

  const coursesResult = await getCourses()
  const courses = 'message' in coursesResult ? [] : coursesResult

  async function handleCreateQuiz(formData: FormData) {
    'use server'

    const courseId = formData.get('course_id') as string
    if (!courseId) {
      throw new Error('Curso é obrigatório')
    }

    await createQuiz({
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      course_id: courseId,
      passing_score: formData.get('passing_score') ? parseInt(formData.get('passing_score') as string) : undefined,
      max_attempts: formData.get('max_attempts') ? parseInt(formData.get('max_attempts') as string) : undefined,
      time_limit_minutes: formData.get('time_limit_minutes') ? parseInt(formData.get('time_limit_minutes') as string) : undefined,
      is_required: formData.get('is_required') === 'on',
    })

    redirect('/admin/quizzes')
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/quizzes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-white">
            Novo Quiz
          </h1>
          <p className="text-slate-400 mt-1">
            Crie um novo quiz para avaliar o conhecimento dos alunos
          </p>
        </div>
      </div>

      {/* Form */}
      <form action={handleCreateQuiz}>
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
                className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione um curso</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>
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
                  defaultValue="70"
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
                  placeholder="Sem limite"
                />
              </div>
            </div>

            {/* Is Required */}
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="is_required">Quiz Obrigatório</Label>
                <p className="text-sm text-slate-400">
                  O aluno deve completar este quiz para concluir o curso
                </p>
              </div>
              <Switch id="is_required" name="is_required" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
              <Link href="/admin/quizzes" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="flex-1">
                Criar Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

