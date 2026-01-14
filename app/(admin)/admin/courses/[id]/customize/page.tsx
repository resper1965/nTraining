import { requireSuperAdmin } from '@/lib/supabase/server'
import { getCourseById, type ActionError } from '@/app/actions/courses'
import { getAllOrganizations } from '@/app/actions/organizations'
import { customizeCourse } from '@/app/actions/organization-courses'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CustomizeCourseForm } from '@/components/admin/customize-course-form'
import type { CourseWithModules } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

// Type guard helper
function isActionError(result: CourseWithModules | ActionError): result is ActionError {
  return 'code' in result || 'message' in result
}

export default async function CustomizeCoursePage({
  params,
}: {
  params: { id: string }
}) {
  await requireSuperAdmin()

  const courseResult = await getCourseById(params.id)
  
  // Type guard: verificar se é ActionError
  if (!courseResult || isActionError(courseResult)) {
    notFound()
  }
  
  // Agora TypeScript sabe que courseResult é CourseWithModules
  const course = courseResult as CourseWithModules

  const organizations = await getAllOrganizations().catch(() => [])

  async function handleCustomize(formData: FormData) {
    'use server'

    const organizationId = formData.get('organization_id') as string
    const customTitle = formData.get('custom_title') as string || undefined
    const customDescription = formData.get('custom_description') as string || undefined
    const customThumbnailUrl = formData.get('custom_thumbnail_url') as string || undefined

    await customizeCourse(organizationId, params.id, {
      customBranding: {
        title: customTitle,
        description: customDescription,
        thumbnail_url: customThumbnailUrl,
      },
    })

    redirect(`/admin/organizations/${organizationId}/courses`)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/courses/${params.id}/edit`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-white">
            Personalizar Curso
          </h1>
          <p className="text-slate-400 mt-1">
            {course.title}
          </p>
        </div>
      </div>

      {/* Form */}
      <form action={handleCustomize}>
        <CustomizeCourseForm
          course={course}
          organizations={organizations}
        />
      </form>
    </div>
  )
}

