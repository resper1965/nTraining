import { requireSuperAdmin } from '@/lib/supabase/server'
import { getOrganizationById, getOrganizationUsers } from '@/app/actions/organizations'
import { getOrganizationCourses, assignCourseToUser } from '@/app/actions/organization-courses'
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
import { AssignCoursesToUsersForm } from '@/components/admin/assign-courses-to-users-form'

export const dynamic = 'force-dynamic'

export default async function AssignCoursesToUsersPage({
  params,
}: {
  params: { id: string }
}) {
  await requireSuperAdmin()

  let organization
  try {
    organization = await getOrganizationById(params.id)
  } catch (error) {
    notFound()
  }

  const [users, courses] = await Promise.all([
    getOrganizationUsers(params.id).catch(() => []),
    getOrganizationCourses(params.id).catch(() => []),
  ])

  async function handleAssign(formData: FormData) {
    'use server'

    const userIds = formData.get('user_ids')?.toString().split(',') || []
    const courseIds = formData.get('course_ids')?.toString().split(',') || []
    const isMandatory = formData.get('is_mandatory') === 'on'
    const deadline = formData.get('deadline') ? new Date(formData.get('deadline') as string) : null

    for (const userId of userIds) {
      for (const courseId of courseIds) {
        try {
          await assignCourseToUser(params.id, courseId, userId, {
            isMandatory,
            deadline,
          })
        } catch (error) {
          console.error(`Error assigning course ${courseId} to user ${userId}:`, error)
        }
      }
    }

    redirect(`/admin/organizations/${params.id}/users`)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/organizations/${params.id}/users`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-white">
            Atribuir Cursos a Usuários
          </h1>
          <p className="text-slate-400 mt-1">
            {organization.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <form action={handleAssign}>
        <AssignCoursesToUsersForm
          users={users}
          courses={courses}
        />
      </form>
    </div>
  )
}

