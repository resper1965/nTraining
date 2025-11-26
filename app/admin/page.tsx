import { requireSuperAdmin } from '@/lib/supabase/server'
import { getDashboardMetrics, getRecentActivities } from '@/app/actions/admin'
import { StatsCard } from '@/components/admin/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Building2,
  Users,
  BookOpen,
  Award,
  Ticket,
  TrendingUp,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  let user
  try {
    user = await requireSuperAdmin()
  } catch (error) {
    console.error('[AdminDashboardPage] Error in requireSuperAdmin:', error)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-red-300 text-2xl mb-4 font-bold">Erro ao carregar dashboard</h1>
          <p className="text-red-400 text-sm mb-2">Não foi possível verificar permissões de superadmin</p>
          <p className="text-red-500 text-xs">{String(error)}</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-yellow-300 text-2xl mb-4 font-bold">Usuário não encontrado</h1>
          <p className="text-yellow-400 text-sm">Faça login novamente</p>
        </div>
      </div>
    )
  }
  
  let metrics: Awaited<ReturnType<typeof getDashboardMetrics>>
  let activities: Awaited<ReturnType<typeof getRecentActivities>>
  
  try {
    [metrics, activities] = await Promise.all([
      getDashboardMetrics().catch((error) => {
        console.error('Error in getDashboardMetrics:', error)
        return {
          organizations: { total: 0, active: 0, newThisMonth: 0 },
          users: { total: 0, active: 0, newThisMonth: 0 },
          courses: { total: 0, published: 0, newThisMonth: 0 },
          certificates: { total: 0, issuedThisMonth: 0 },
          licenses: { total: 0, used: 0, available: 0, utilizationRate: 0 },
          progress: { coursesInProgress: 0, coursesCompleted: 0, completionRate: 0 },
        }
      }),
      getRecentActivities(5).catch((error) => {
        console.error('Error in getRecentActivities:', error)
        return []
      }),
    ])
  } catch (error) {
    console.error('Error loading dashboard metrics:', error)
    // Return default values if there's an error
    metrics = {
      organizations: { total: 0, active: 0, newThisMonth: 0 },
      users: { total: 0, active: 0, newThisMonth: 0 },
      courses: { total: 0, published: 0, newThisMonth: 0 },
      certificates: { total: 0, issuedThisMonth: 0 },
      licenses: { total: 0, used: 0, available: 0, utilizationRate: 0 },
      progress: { coursesInProgress: 0, coursesCompleted: 0, completionRate: 0 },
    }
    activities = []
  }

  return (
    <div className="space-y-6 min-h-full bg-slate-950">
      {/* Debug Info - remover depois */}
      <div className="p-4 bg-green-900/20 border border-green-700 rounded-md">
        <p className="text-green-300 text-sm font-bold">✓ Dashboard carregado com sucesso!</p>
        <p className="text-green-400 text-xs mt-1">Usuário: {user?.email || 'N/A'}</p>
        <p className="text-green-400 text-xs">Superadmin: {user?.is_superadmin ? 'Sim' : 'Não'}</p>
        <p className="text-green-400 text-xs">User ID: {user?.id || 'N/A'}</p>
      </div>
      
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-white mb-2">
          Dashboard Administrativo
        </h1>
        <p className="text-slate-400">
          Visão geral da plataforma n.training
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Logado como: {user?.full_name || user?.email} (Superadmin)
        </p>
      </div>
      
      {/* Test Content - garantir que algo seja renderizado */}
      <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-md">
        <p className="text-blue-300 text-sm">Teste: Se você está vendo isso, o componente está renderizando</p>
        <p className="text-blue-400 text-xs mt-1">Métricas carregadas: {metrics ? 'Sim' : 'Não'}</p>
        <p className="text-blue-400 text-xs">Atividades: {activities?.length || 0}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Organizações"
          value={metrics.organizations.total}
          description={`${metrics.organizations.active} ativas`}
          icon={Building2}
          trend={
            metrics.organizations.newThisMonth > 0
              ? {
                  value: Math.round(
                    (metrics.organizations.newThisMonth / Math.max(metrics.organizations.total, 1)) * 100
                  ),
                  isPositive: true,
                }
              : undefined
          }
          href="/admin/organizations"
        />

        <StatsCard
          title="Usuários"
          value={metrics.users.total}
          description={`${metrics.users.active} ativos`}
          icon={Users}
          trend={
            metrics.users.newThisMonth > 0
              ? {
                  value: Math.round(
                    (metrics.users.newThisMonth / Math.max(metrics.users.total, 1)) * 100
                  ),
                  isPositive: true,
                }
              : undefined
          }
          href="/admin/users"
        />

        <StatsCard
          title="Cursos"
          value={metrics.courses.total}
          description={`${metrics.courses.published} publicados`}
          icon={BookOpen}
          trend={
            metrics.courses.newThisMonth > 0
              ? {
                  value: Math.round(
                    (metrics.courses.newThisMonth / Math.max(metrics.courses.total, 1)) * 100
                  ),
                  isPositive: true,
                }
              : undefined
          }
          href="/admin/courses"
        />

        <StatsCard
          title="Certificados"
          value={metrics.certificates.total}
          description={`${metrics.certificates.issuedThisMonth} este mês`}
          icon={Award}
          href="/admin/reports/certificates"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Licenças Utilizadas"
          value={`${metrics.licenses.used} / ${metrics.licenses.total}`}
          description={`${metrics.licenses.utilizationRate}% de utilização`}
          icon={Ticket}
          href="/admin/licenses"
        />

        <StatsCard
          title="Cursos em Progresso"
          value={metrics.progress.coursesInProgress}
          description={`${metrics.progress.completionRate}% taxa de conclusão`}
          icon={TrendingUp}
          href="/admin/reports"
        />

        <StatsCard
          title="Novos Este Mês"
          value={
            metrics.organizations.newThisMonth +
            metrics.users.newThisMonth +
            metrics.courses.newThisMonth
          }
          description="Total de novos recursos"
          icon={Activity}
        />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg text-white">
                Atividades Recentes
              </CardTitle>
              <Link href="/admin/activity">
                <Button variant="ghost" size="sm" className="text-slate-400">
                  Ver todas
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(activity.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">Nenhuma atividade recente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-lg text-white">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/organizations/new">
                <Button variant="outline" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  Nova Organização
                </Button>
              </Link>
              <Link href="/admin/courses/new">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Novo Curso
                </Button>
              </Link>
              <Link href="/admin/users/new">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Ver Relatórios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
