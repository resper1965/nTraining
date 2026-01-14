import { requireSuperAdmin } from '@/lib/supabase/server'
import { createLearningPath } from '@/app/actions/learning-paths'
import { getCourses } from '@/app/actions/courses'
import { redirect } from 'next/navigation'
import { LearningPathForm } from '@/components/admin/learning-path-form'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const dynamic = 'force-dynamic'

export default async function NewLearningPathPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  await requireSuperAdmin()

  const courses = await getCourses().catch(() => [])

  async function handleCreate(formData: FormData) {
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
      const path = await createLearningPath({
        title,
        slug,
        description: description || undefined,
        estimated_duration_hours: estimatedDurationHours || undefined,
        is_mandatory: isMandatory,
        course_ids: courseIds.filter((id) => id),
      })

      redirect(`/admin/paths/${path.id}`)
    } catch (error: any) {
      redirect(`/admin/paths/new?error=${encodeURIComponent(error.message)}`)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-white mb-2">
          Nova Trilha de Aprendizado
        </h1>
        <p className="text-slate-400">
          Crie uma nova trilha de aprendizado com sequência de cursos
        </p>
      </div>

      {searchParams.error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-800">
          <AlertDescription className="text-red-400">
            {searchParams.error}
          </AlertDescription>
        </Alert>
      )}

      <form action={handleCreate}>
        <LearningPathForm courses={courses} />
      </form>
    </div>
  )
}

