import { requireSuperAdmin } from '@/lib/supabase/server'
import { getCourseById, updateCourse } from '@/app/actions/courses'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { ClientEditForm } from './client-form'

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

      const courseData: any = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        objectives: (formData.get('objectives') as string) || '',
        level: formData.get('level') as 'beginner' | 'intermediate' | 'advanced',
        area: (formData.get('area') as string) || '',
        duration_hours: durationHours || null,
        status: formData.get('status') as 'draft' | 'published' | 'archived',
        is_public: formData.get('is_public') === 'true',
        thumbnail_url: (formData.get('thumbnail_url') as string) || null,
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
      <ClientEditForm course={course} action={handleUpdateCourse} courseId={params.id} />
    </div>
  )
}
