import { requireSuperAdmin } from '@/lib/supabase/server'
import { getCourseById, updateCourse } from '@/app/actions/courses'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { ArrowLeft, Save, X } from 'lucide-react'
import { redirect } from 'next/navigation'
import { DeleteCourseButton } from '@/components/admin/delete-course-button'

export const dynamic = 'force-dynamic'

export default async function EditCoursePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { message?: string; error?: string }
}) {
  await requireSuperAdmin()

  const course = await getCourseById(params.id)

  async function handleUpdateCourse(formData: FormData) {
    'use server'
    
    try {
      const durationHours = formData.get('duration_hours')
        ? parseFloat(formData.get('duration_hours') as string)
        : 0

      const courseData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        objectives: (formData.get('objectives') as string) || '',
        level: formData.get('level') as 'beginner' | 'intermediate' | 'advanced',
        area: (formData.get('area') as string) || '',
        duration_hours: durationHours,
        status: formData.get('status') as 'draft' | 'published' | 'archived',
        is_public: formData.get('is_public') === 'true',
      }

      await updateCourse(params.id, courseData)
      redirect(`/admin/courses/${params.id}/edit?message=Curso atualizado com sucesso`)
    } catch (error) {
      redirect(
        `/admin/courses/${params.id}/edit?error=${encodeURIComponent(
          error instanceof Error ? error.message : 'Erro ao atualizar curso'
        )}`
      )
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-white mb-2">
              Editar Curso
            </h1>
            <p className="text-slate-400">
              {course.title}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {searchParams.message && (
        <div className="p-4 bg-green-950/50 border border-green-800 rounded-lg text-sm text-green-300">
          {searchParams.message}
        </div>
      )}
      {searchParams.error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg text-sm text-red-300">
          {searchParams.error}
        </div>
      )}

      {/* Form */}
      <form action={handleUpdateCourse} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="font-display text-xl text-white">
                  Informações Básicas
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Título, descrição e objetivos do curso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">
                    Título do Curso *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    defaultValue={course.title}
                    placeholder="Ex: LGPD Básico para Empresas"
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
                  />
                  <p className="text-xs text-slate-500">
                    Nome completo e descritivo do curso
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-slate-300">
                    Slug (URL) *
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    required
                    defaultValue={course.slug}
                    placeholder="lgpd-basico-empresas"
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
                  />
                  <p className="text-xs text-slate-500">
                    URL amigável (ex: lgpd-basico-empresas)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">
                    Descrição *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    defaultValue={course.description || ''}
                    placeholder="Descreva o conteúdo e o que os alunos aprenderão neste curso..."
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary resize-none"
                  />
                  <p className="text-xs text-slate-500">
                    Descrição completa do curso (máximo 1000 caracteres)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives" className="text-slate-300">
                    Objetivos de Aprendizado
                  </Label>
                  <Textarea
                    id="objectives"
                    name="objectives"
                    rows={4}
                    defaultValue={course.objectives || ''}
                    placeholder="Ao final deste curso, o aluno será capaz de..."
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary resize-none"
                  />
                  <p className="text-xs text-slate-500">
                    Liste os objetivos principais do curso
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Configurações */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-300">
                    Status *
                  </Label>
                  <Select name="status" defaultValue={course.status} required>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Cursos em rascunho não são visíveis para estudantes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level" className="text-slate-300">
                    Nível *
                  </Label>
                  <Select name="level" defaultValue={course.level} required>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area" className="text-slate-300">
                    Área
                  </Label>
                  <Input
                    id="area"
                    name="area"
                    defaultValue={course.area || ''}
                    placeholder="Ex: Segurança da Informação"
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
                  />
                  <p className="text-xs text-slate-500">
                    Categoria ou área do conhecimento
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_hours" className="text-slate-300">
                    Duração (horas)
                  </Label>
                  <Input
                    id="duration_hours"
                    name="duration_hours"
                    type="number"
                    step="0.5"
                    min="0"
                    defaultValue={course.duration_hours || ''}
                    placeholder="Ex: 8.5"
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
                  />
                  <p className="text-xs text-slate-500">
                    Duração estimada do curso em horas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="is_public" className="text-slate-300">
                    Visibilidade
                  </Label>
                  <Select name="is_public" defaultValue={course.is_public ? 'true' : 'false'}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Privado (apenas organizações)</SelectItem>
                      <SelectItem value="true">Público (todos podem ver)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Cursos públicos são visíveis para todos
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  <Link href="/admin/courses">
                    <Button type="button" variant="outline" className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </Link>
                  <DeleteCourseButton courseId={params.id} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
