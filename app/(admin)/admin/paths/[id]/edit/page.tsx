import { requireSuperAdmin } from '@/lib/supabase/server'
import { getLearningPathWithCourses, updateLearningPath } from '@/app/actions/learning-paths'
import { getCourses } from '@/app/actions/courses'
import { redirect } from 'next/navigation'
import { LearningPathForm } from '@/components/admin/learning-path-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function EditLearningPathPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { error?: string }
}) {
  await requireSuperAdmin()

  const [path, coursesResult] = await Promise.all([
    getLearningPathWithCourses(params.id).catch(() => null),
    getCourses(),
  ])

  const courses = 'message' in coursesResult ? [] : coursesResult

  if (!path) {
    redirect('/admin/paths')
  }

  async function handleUpdate(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const estimatedDurationHours = formData.get('estimated_duration_hours')
      ? parseFloat(formData.get('estimated_duration_hours') as string)
      : null
    const isMandatory = formData.get('is_mandatory') === 'on'
    const courseIds = formData.getAll('course_ids') as string[]

    try {
      await updateLearningPath(params.id, {
        title,
        slug,
        description: description || undefined,
        estimated_duration_hours: estimatedDurationHours || undefined,
        is_mandatory: isMandatory,
        course_ids: courseIds.filter((id) => id),
      })

      redirect(`/admin/paths/${params.id}`)
    } catch (error: any) {
      redirect(
        `/admin/paths/${params.id}/edit?error=${encodeURIComponent(error.message)}`
      )
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/paths/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-white mb-2">
            Editar Trilha de Aprendizado
          </h1>
          <p className="text-slate-400">
            Atualize as informações da trilha e reordene os cursos
          </p>
        </div>
      </div>

      {searchParams.error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800">
          <AlertDescription className="text-red-400">
            {searchParams.error}
          </AlertDescription>
        </Alert>
      )}

      <form action={handleUpdate}>
        <LearningPathForm
          courses={courses}
          initialData={{
            title: path.title,
            slug: path.slug,
            description: path.description || undefined,
            estimated_duration_hours: path.estimated_duration_hours,
            is_mandatory: path.is_mandatory,
            course_ids: path.path_courses?.map((pc) => pc.course_id) || [],
          }}
        />
      </form>
    </div>
  )
}

