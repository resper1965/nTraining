import { requireAuth } from '@/lib/supabase/server'
import { getUserProgress } from '@/app/actions/progress'
import { getCoursesWithProgress } from '@/app/actions/courses'
import { getUserMandatoryCourses } from '@/app/actions/organization-courses'
import { getUserPathsWithProgress } from '@/app/actions/path-progress'
import { getUserCertificates } from '@/app/actions/certificates'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { GitBranch, Award, Clock, CheckCircle2, PlayCircle } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // requireAuth() will redirect if not authenticated (throws NEXT_REDIRECT)
  // This should NOT be wrapped in try/catch as redirect() throws a special error
  const user = await requireAuth()

  // Redirect superadmin to admin panel
  if (user.is_superadmin) {
    const { redirect } = await import('next/navigation')
    redirect('/admin')
  }

  // Add error logging to understand what's failing
  const [progress, courses, mandatoryCourses, certificates, paths] = await Promise.all([
    getUserProgress().catch((err) => {
      console.error('getUserProgress error:', err)
      return []
    }),
    getCoursesWithProgress({ status: 'published' }).catch((err) => {
      console.error('getCoursesWithProgress error:', err)
      return []
    }),
    getUserMandatoryCourses().catch((err) => {
      console.error('getUserMandatoryCourses error:', err)
      return []
    }),
    getUserCertificates().catch((err) => {
      console.error('getUserCertificates error:', err)
      return []
    }),
    getUserPathsWithProgress().catch((err) => {
      console.error('getUserPathsWithProgress error:', err)
      return []
    }),
  ])

  console.log('Dashboard data:', {
    userId: user.id,
    userEmail: user.email,
    organizationId: user.organization_id,
    isSuperadmin: user.is_superadmin,
    progressCount: progress?.length || 0,
    coursesCount: courses?.length || 0,
    mandatoryCount: mandatoryCourses?.length || 0,
    certificatesCount: certificates?.length || 0,
    pathsCount: paths?.length || 0,
  })

    const inProgressCourses = progress?.filter(
      (p: any) => p.status === 'in_progress'
    ) || []
    const completedCourses = progress?.filter(
      (p: any) => p.status === 'completed'
    ) || []

    return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-medium text-white mb-2">
              Welcome back, {user.full_name || user.email}!
            </h1>
            <p className="text-slate-400">
              Continue your learning journey
            </p>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Sair
            </Button>
          </form>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white">
                Courses in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {inProgressCourses.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white">
                Completed Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {completedCourses.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white">
                Available Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {courses.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mandatory Courses */}
        {mandatoryCourses && mandatoryCourses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display text-2xl font-medium text-white">
                Cursos Obrigatórios
              </h2>
              <span className="text-xs bg-yellow-950/50 text-yellow-400 px-2 py-1 rounded">
                {mandatoryCourses.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mandatoryCourses.slice(0, 3).map((assignment: any) => (
                <Card
                  key={assignment.id}
                  className="bg-slate-900 border-yellow-800/50 hover:border-yellow-700/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="font-display text-lg text-white line-clamp-2">
                      {assignment.courses?.title || 'Course'}
                    </CardTitle>
                    <CardDescription className="text-yellow-400">
                      ⚠️ Obrigatório
                      {assignment.deadline && (
                        <span className="block mt-1 text-xs">
                          Prazo: {new Date(assignment.deadline).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/courses/${assignment.courses?.slug || '#'}`}>
                      <Button className="w-full">Iniciar Curso</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Courses in Progress */}
        {inProgressCourses.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-2xl font-medium text-white mb-4">
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.slice(0, 3).map((item: any) => (
                <Card
                  key={item.id}
                  className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="font-display text-lg text-white line-clamp-2">
                      {item.courses?.title || 'Course'}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {item.completion_percentage}% complete
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${item.completion_percentage}%` }}
                      />
                    </div>
                    <Link href={`/courses/${item.courses?.slug || '#'}`}>
                      <Button variant="outline" className="w-full">
                        Continue
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses */}
        {courses.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-medium text-white">
                Available Courses
              </h2>
              <Link href="/courses">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course: any) => (
                <Card
                  key={course.id}
                  className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="font-display text-lg text-white line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400 line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-slate-500 uppercase">
                        {course.level}
                      </span>
                      {course.duration_hours && (
                        <span className="text-xs text-slate-500">
                          {course.duration_hours}h
                        </span>
                      )}
                    </div>
                    <Link href={`/courses/${course.slug}`}>
                      <Button className="w-full">
                        {course.progress ? 'Continue' : 'Start Course'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="font-display text-xl font-medium text-white mb-2">
                  Nenhum curso disponível
                </h3>
                <p className="text-slate-400 mb-6">
                  {user.is_superadmin ? (
                    <>
                      Crie cursos na{' '}
                      <Link href="/admin/courses" className="text-primary hover:underline">
                        área administrativa
                      </Link>
                      {' '}ou disponibilize cursos para organizações.
                    </>
                  ) : (
                    <>
                      Entre em contato com o administrador para ter acesso aos cursos
                      ou aguarde a disponibilização de novos cursos.
                    </>
                  )}
                </p>
                {user.is_superadmin && (
                  <div className="flex gap-4 justify-center">
                    <Link href="/admin/courses/new">
                      <Button>Criar Novo Curso</Button>
                    </Link>
                    <Link href="/admin/tenants">
                      <Button variant="outline">Gerenciar Organizações</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

