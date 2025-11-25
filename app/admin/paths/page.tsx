import { requireSuperAdmin } from '@/lib/supabase/server'
import { getAllLearningPaths } from '@/app/actions/learning-paths'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function LearningPathsPage() {
  await requireSuperAdmin()

  const paths = await getAllLearningPaths().catch(() => [])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-white mb-2">
            Trilhas de Aprendizado
          </h1>
          <p className="text-slate-400">
            Gerencie trilhas de aprendizado e sequências de cursos
          </p>
        </div>
        <Link href="/admin/paths/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Trilha
          </Button>
        </Link>
      </div>

      {/* Paths List */}
      {paths.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">Nenhuma trilha criada ainda</p>
              <Link href="/admin/paths/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Trilha
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <Card
              key={path.id}
              className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="font-display text-xl text-white">
                    {path.title}
                  </CardTitle>
                  {path.is_mandatory && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      Obrigatória
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {path.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  {path.estimated_duration_hours && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {path.estimated_duration_hours}h
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/paths/${path.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Link href={`/admin/paths/${path.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      Editar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

