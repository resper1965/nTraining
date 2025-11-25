import { requireSuperAdmin } from '@/lib/supabase/server'
import { getOrganizationById, getOrganizationUsers, getOrganizationCourses } from '@/app/actions/organizations'
import { getCoursesWithProgress } from '@/app/actions/courses'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Eye, Users, BookOpen, Building2 } from 'lucide-react'
import { formatCNPJ } from '@/lib/utils/cnpj'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const dynamic = 'force-dynamic'

export default async function OrganizationViewPage({
  params,
}: {
  params: { id: string }
}) {
  await requireSuperAdmin()

  const [organization, users, courses] = await Promise.all([
    getOrganizationById(params.id),
    getOrganizationUsers(params.id),
    getOrganizationCourses(params.id),
  ])

  // Buscar cursos disponíveis para a organização
  const availableCourses = courses.map((access: any) => access.courses).filter(Boolean)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header da Organização */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/organizations">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Admin
                </Button>
              </Link>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <h1 className="font-display text-xl font-medium text-white">
                  {organization.name}
                </h1>
                {organization.razao_social && (
                  <p className="text-sm text-slate-400">{organization.razao_social}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">
                Modo Visualização
              </span>
              <Link href={`/admin/organizations/${params.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Informações da Organização */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white">
                Informações da Organização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organization.cnpj && (
                  <div>
                    <label className="text-sm text-slate-400">CNPJ</label>
                    <p className="text-white font-medium">{formatCNPJ(organization.cnpj)}</p>
                  </div>
                )}
                {organization.industry && (
                  <div>
                    <label className="text-sm text-slate-400">Indústria</label>
                    <p className="text-white font-medium">{organization.industry}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-slate-400">Status</label>
                  <p className="text-white font-medium capitalize">
                    {organization.subscription_status || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Máximo de Usuários</label>
                  <p className="text-white font-medium">{organization.max_users}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList className="bg-slate-900 border-slate-800">
              <TabsTrigger value="courses" className="data-[state=active]:bg-slate-800">
                Cursos ({availableCourses.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-slate-800">
                Usuários ({users.length})
              </TabsTrigger>
            </TabsList>

            {/* Cursos Tab */}
            <TabsContent value="courses" className="space-y-4">
              {availableCourses.length === 0 ? (
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">Nenhum curso disponível</p>
                      <Link href={`/admin/organizations/${params.id}`}>
                        <Button variant="outline">Gerenciar Cursos</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableCourses.map((course: any) => (
                    <Card
                      key={course.id}
                      className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-colors"
                    >
                      <CardHeader>
                        <CardTitle className="font-display text-lg text-white line-clamp-2">
                          {course.title}
                        </CardTitle>
                        <p className="text-sm text-slate-400 line-clamp-2 mt-2">
                          {course.description}
                        </p>
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
                          <Button className="w-full" variant="outline">
                            Ver Curso
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Usuários Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-white">
                    Usuários da Organização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">Nenhum usuário encontrado</p>
                      <Link href={`/admin/organizations/${params.id}`}>
                        <Button variant="outline">Gerenciar Usuários</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {users.map((user: any) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.full_name?.[0] || user.email[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {user.full_name || 'Sem nome'}
                              </p>
                              <p className="text-sm text-slate-400">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 capitalize">
                              {user.role}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                user.is_active
                                  ? 'bg-green-950/50 text-green-400'
                                  : 'bg-red-950/50 text-red-400'
                              }`}
                            >
                              {user.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

