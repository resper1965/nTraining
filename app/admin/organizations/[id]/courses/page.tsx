import { requireSuperAdmin } from '@/lib/supabase/server'
import { getOrganizationById } from '@/app/actions/organizations'
import { getOrganizationCourses } from '@/app/actions/organization-courses'
import { getCourses } from '@/app/actions/courses'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, Plus, Settings, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AssignCourseDialog } from '@/components/admin/assign-course-dialog'
import { CourseAccessCard } from '@/components/admin/course-access-card'

export const dynamic = 'force-dynamic'

export default async function OrganizationCoursesPage({
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

  const [organizationCourses, allCourses] = await Promise.all([
    getOrganizationCourses(params.id).catch(() => []),
    getCourses().catch(() => []),
  ])

  // Get courses not yet assigned
  const assignedCourseIds = new Set(organizationCourses.map((oc: any) => oc.course_id))
  const availableCourses = allCourses.filter((course: any) => !assignedCourseIds.has(course.id))

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/organizations/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-white">
              Cursos da Organização
            </h1>
            <p className="text-slate-400 mt-1">
              {organization.name}
            </p>
          </div>
        </div>
        <AssignCourseDialog
          organizationId={params.id}
          availableCourses={availableCourses}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-400 mb-1">Total de Cursos</div>
            <div className="text-2xl font-bold text-white">
              {organizationCourses.length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-400 mb-1">Cursos Obrigatórios</div>
            <div className="text-2xl font-bold text-white">
              {organizationCourses.filter((oc: any) => oc.is_mandatory).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-400 mb-1">Com Licenças</div>
            <div className="text-2xl font-bold text-white">
              {organizationCourses.filter((oc: any) => oc.access_type === 'licensed').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-400 mb-1">Ilimitados</div>
            <div className="text-2xl font-bold text-white">
              {organizationCourses.filter((oc: any) => oc.access_type === 'unlimited').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      {organizationCourses.length > 0 ? (
        <div className="space-y-4">
          {organizationCourses.map((orgCourse: any) => (
            <CourseAccessCard
              key={orgCourse.id}
              organizationId={params.id}
              organizationCourseAccess={orgCourse}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-slate-400 mb-6">
                Nenhum curso atribuído a esta organização ainda
              </p>
              <AssignCourseDialog
                organizationId={params.id}
                availableCourses={availableCourses}
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Atribuir Primeiro Curso
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

