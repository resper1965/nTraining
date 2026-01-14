import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/admin/stats-card'
import { ExportButton } from '@/components/admin/export-button'
import {
  getOverallStats,
  getCourseCompletionStats,
  getCoursePopularityStats,
  exportCourseCompletionData,
  exportCoursePopularityData,
} from '@/app/actions/reports'
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  // Buscar todas as estatísticas
  const overallStats = await getOverallStats()
  const courseCompletionStats = await getCourseCompletionStats()
  const coursePopularityStats = await getCoursePopularityStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-white mb-2">
          Relatórios
        </h1>
        <p className="text-slate-400">
          Métricas e analytics da plataforma
        </p>
      </div>

      {/* Overall Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Usuários"
          value={overallStats.totalUsers}
          description={`${overallStats.activeUsers} ativos (${overallStats.activePercentage}%)`}
          icon={Users}
        />
        <StatsCard
          title="Cursos Publicados"
          value={overallStats.publishedCourses}
          description={`${overallStats.totalCourses} cursos no total`}
          icon={BookOpen}
        />
        <StatsCard
          title="Certificados Emitidos"
          value={overallStats.totalCertificates}
          icon={Award}
        />
        <StatsCard
          title="Taxa Média de Conclusão"
          value={`${overallStats.averageCompletionRate}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Course Completion Statistics */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display text-lg text-white">
                Taxa de Conclusão por Curso
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Progresso e conclusão de todos os cursos publicados
              </p>
            </div>
            <ExportButton
              onExport={exportCourseCompletionData}
              filename={`conclusao_cursos_${new Date().toISOString().split('T')[0]}.csv`}
            />
          </div>
        </CardHeader>
        <CardContent>
          {courseCompletionStats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">
                Nenhum curso com inscrições ainda
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-800/50">
                    <TableHead className="text-slate-400">Curso</TableHead>
                    <TableHead className="text-slate-400 text-right">Inscritos</TableHead>
                    <TableHead className="text-slate-400 text-right">Completaram</TableHead>
                    <TableHead className="text-slate-400 text-right">Taxa de Conclusão</TableHead>
                    <TableHead className="text-slate-400 text-right">Tempo Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseCompletionStats.map((stat) => {
                    let badgeVariant: 'default' | 'secondary' | 'outline' = 'default'
                    if (stat.completionRate >= 70) badgeVariant = 'default'
                    else if (stat.completionRate >= 40) badgeVariant = 'secondary'
                    else badgeVariant = 'outline'

                    return (
                      <TableRow key={stat.courseId} className="hover:bg-slate-800/50">
                        <TableCell className="font-medium text-white">
                          {stat.courseTitle}
                        </TableCell>
                        <TableCell className="text-slate-300 text-right">
                          {stat.totalEnrolled}
                        </TableCell>
                        <TableCell className="text-slate-300 text-right">
                          {stat.totalCompleted}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={badgeVariant}>
                            {stat.completionRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300 text-right">
                          {stat.averageTimeToComplete ? (
                            <span className="flex items-center justify-end gap-1">
                              <Clock className="h-3 w-3" />
                              {stat.averageTimeToComplete}h
                            </span>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Popularity Statistics */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display text-lg text-white">
                Cursos Mais Populares
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Cursos com maior número de inscrições
              </p>
            </div>
            <ExportButton
              onExport={exportCoursePopularityData}
              filename={`popularidade_cursos_${new Date().toISOString().split('T')[0]}.csv`}
            />
          </div>
        </CardHeader>
        <CardContent>
          {coursePopularityStats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">
                Nenhum curso com inscrições ainda
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-800/50">
                    <TableHead className="text-slate-400">Curso</TableHead>
                    <TableHead className="text-slate-400 text-right">Total de Inscrições</TableHead>
                    <TableHead className="text-slate-400 text-right">Total de Visualizações</TableHead>
                    <TableHead className="text-slate-400 text-right">Taxa de Engajamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coursePopularityStats.slice(0, 10).map((stat) => {
                    const engagementRate = stat.totalEnrollments > 0
                      ? Math.round((stat.totalViews / stat.totalEnrollments) * 100)
                      : 0

                    return (
                      <TableRow key={stat.courseId} className="hover:bg-slate-800/50">
                        <TableCell className="font-medium text-white">
                          {stat.courseTitle}
                        </TableCell>
                        <TableCell className="text-slate-300 text-right">
                          {stat.totalEnrollments}
                        </TableCell>
                        <TableCell className="text-slate-300 text-right">
                          {stat.totalViews}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={engagementRate >= 70 ? 'default' : 'secondary'}>
                            {engagementRate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

