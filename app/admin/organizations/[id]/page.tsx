import { requireSuperAdmin } from '@/lib/supabase/server'
import { getOrganizationById, getOrganizationUsers, getOrganizationCourses } from '@/app/actions/organizations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Edit, Users, BookOpen, Building2, Plus, Eye } from 'lucide-react'
import { formatCNPJ } from '@/lib/utils/cnpj'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const dynamic = 'force-dynamic'

export default async function OrganizationDetailPage({
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/organizations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-white mb-2">
              {organization.name}
            </h1>
            <p className="text-slate-400">
              Detalhes da organização
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/organizations/${params.id}/view`}>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Visitar Organização
            </Button>
          </Link>
          <Link href={`/admin/organizations/${params.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Usuários</p>
                <p className="text-2xl font-bold text-white">
                  {(organization as any).users_count || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Cursos</p>
                <p className="text-2xl font-bold text-white">
                  {(organization as any).courses_count || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Status</p>
                <p className="text-2xl font-bold text-white capitalize">
                  {organization.subscription_status || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-900 border-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-800">
              Usuários ({users.length})
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-slate-800">
              Cursos ({courses.length})
            </TabsTrigger>
          </TabsList>
          <Link href={`/admin/organizations/${params.id}/courses`}>
            <Button variant="outline" size="sm">
              Gerenciar Cursos
            </Button>
          </Link>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white">
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Nome</label>
                  <p className="text-white font-medium">{organization.name}</p>
                </div>
                {organization.razao_social && (
                  <div>
                    <label className="text-sm text-slate-400">Razão Social</label>
                    <p className="text-white font-medium">{organization.razao_social}</p>
                  </div>
                )}
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
                {organization.employee_count && (
                  <div>
                    <label className="text-sm text-slate-400">Número de Funcionários</label>
                    <p className="text-white font-medium">{organization.employee_count}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-slate-400">Status da Assinatura</label>
                  <p className="text-white font-medium capitalize">
                    {organization.subscription_status || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Máximo de Usuários</label>
                  <p className="text-white font-medium">{organization.max_users}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Criada em</label>
                  <p className="text-white font-medium">
                    {new Date(organization.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Atualizada em</label>
                  <p className="text-white font-medium">
                    {new Date(organization.updated_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg text-white">
                  Usuários da Organização
                </CardTitle>
                <Link href={`/admin/organizations/${params.id}/users/new`}>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">Nenhum usuário encontrado</p>
                  <Link href={`/admin/organizations/${params.id}/users/new`}>
                    <Button variant="outline">Adicionar primeiro usuário</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((user: any) => (
                    <Link
                      key={user.id}
                      href={`/admin/users/${user.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
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
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg text-white">
                  Cursos Disponíveis
                </CardTitle>
                <Link href={`/admin/organizations/${params.id}/courses/assign`}>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Curso
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">Nenhum curso disponível</p>
                  <Link href={`/admin/organizations/${params.id}/courses`}>
                    <Button variant="outline">Gerenciar Cursos</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {courses.map((access: any) => (
                    <div
                      key={access.id}
                      className="p-4 rounded-lg bg-slate-800/50 border border-slate-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1">
                            {access.courses?.title || 'Curso não encontrado'}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>Tipo: {access.access_type}</span>
                            {access.access_type === 'licensed' && (
                              <span>
                                Licenças: {access.used_licenses} / {access.total_licenses || '∞'}
                              </span>
                            )}
                            {access.is_mandatory && (
                              <span className="text-yellow-400">Obrigatório</span>
                            )}
                          </div>
                        </div>
                        <Link href={`/admin/courses/${access.course_id}`}>
                          <Button variant="ghost" size="sm">
                            Ver curso →
                          </Button>
                        </Link>
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
  )
}

