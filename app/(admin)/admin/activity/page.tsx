import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getActivityLogs, getActivityTypes } from '@/app/actions/activity-logs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Activity,
  User,
  BookOpen,
  Award,
  CheckCircle,
  UserPlus,
  Send,
  MapPin,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: {
    page?: string
    eventType?: string
  }
}

// Mapear tipos de evento para ícones e cores
const eventTypeConfig: Record<string, { icon: any; label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  'user.login': { icon: User, label: 'Login', variant: 'outline' },
  'user.created': { icon: UserPlus, label: 'Usuário Criado', variant: 'secondary' },
  'course.created': { icon: BookOpen, label: 'Curso Criado', variant: 'default' },
  'course.published': { icon: Send, label: 'Curso Publicado', variant: 'default' },
  'course.completed': { icon: CheckCircle, label: 'Curso Concluído', variant: 'default' },
  'quiz.completed': { icon: Activity, label: 'Quiz Concluído', variant: 'secondary' },
  'certificate.issued': { icon: Award, label: 'Certificado Emitido', variant: 'default' },
  'course.assigned': { icon: Send, label: 'Curso Atribuído', variant: 'secondary' },
  'path.completed': { icon: MapPin, label: 'Trilha Concluída', variant: 'default' },
}

export default async function AdminActivityPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || '1')
  const eventType = searchParams.eventType
  const limit = 50
  const offset = (page - 1) * limit

  // Buscar logs e tipos de evento
  const { logs, total } = await getActivityLogs({
    eventType,
    limit,
    offset,
  })
  const activityTypes = await getActivityTypes()

  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-white mb-2">
          Log de Atividades
        </h1>
        <p className="text-slate-400">
          Histórico completo de eventos e ações na plataforma
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total de Eventos</p>
                <p className="text-2xl font-bold text-white">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800">
                <Activity className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Tipos de Evento</p>
                <p className="text-2xl font-bold text-white">{activityTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Página Atual</p>
                <p className="text-2xl font-bold text-white">{page} de {totalPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-lg text-white">
            Eventos Recentes
          </CardTitle>
          <p className="text-sm text-slate-400 mt-1">
            Últimos {limit} eventos ({offset + 1} - {Math.min(offset + limit, total)} de {total})
          </p>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                Nenhuma atividade registrada ainda
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border border-slate-800 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-slate-800/50">
                      <TableHead className="text-slate-400">Data/Hora</TableHead>
                      <TableHead className="text-slate-400">Tipo de Evento</TableHead>
                      <TableHead className="text-slate-400">Usuário</TableHead>
                      <TableHead className="text-slate-400">Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => {
                      const config = eventTypeConfig[log.event_type] || {
                        icon: Activity,
                        label: log.event_type,
                        variant: 'outline' as const,
                      }
                      const Icon = config.icon

                      const timeAgo = formatDistanceToNow(new Date(log.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })

                      return (
                        <TableRow key={log.id} className="hover:bg-slate-800/50">
                          <TableCell className="text-slate-300">
                            <div className="flex flex-col">
                              <span className="text-sm">
                                {new Date(log.created_at).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(log.created_at).toLocaleTimeString('pt-BR')}
                              </span>
                              <span className="text-xs text-slate-600">{timeAgo}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                              <Icon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {log.users ? (
                              <div className="flex flex-col">
                                <span className="font-medium">{log.users.full_name || 'Sem nome'}</span>
                                <span className="text-xs text-slate-500">{log.users.email}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">Sistema</span>
                            )}
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <div className="flex flex-col">
                              <span>{log.event_data.action || log.event_type}</span>
                              {log.event_data.course_title && (
                                <span className="text-xs text-slate-500">
                                  Curso: {log.event_data.course_title}
                                </span>
                              )}
                              {log.event_data.quiz_title && (
                                <span className="text-xs text-slate-500">
                                  Quiz: {log.event_data.quiz_title} | Score: {log.event_data.score}%
                                </span>
                              )}
                              {log.event_data.path_title && (
                                <span className="text-xs text-slate-500">
                                  Trilha: {log.event_data.path_title}
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-slate-400">
                    Mostrando {offset + 1} - {Math.min(offset + limit, total)} de {total} eventos
                  </p>
                  <div className="flex gap-2">
                    {hasPrevPage && (
                      <a
                        href={`/admin/activity?page=${page - 1}${eventType ? `&eventType=${eventType}` : ''}`}
                        className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Anterior
                      </a>
                    )}
                    {hasNextPage && (
                      <a
                        href={`/admin/activity?page=${page + 1}${eventType ? `&eventType=${eventType}` : ''}`}
                        className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Próximo
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

