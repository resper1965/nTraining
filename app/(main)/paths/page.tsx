import { requireAuth } from '@/lib/supabase/server'
import { getUserPathsWithProgress } from '@/app/actions/path-progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { GitBranch, Clock, CheckCircle2, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PathsPage() {
  await requireAuth()

  const paths = await getUserPathsWithProgress().catch(() => [])

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Trilhas de Aprendizado
          </h1>
          <p className="text-slate-400">
            Explore trilhas de cursos organizados para guiar seu aprendizado
          </p>
        </div>

        {/* Paths Grid */}
        {paths.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <GitBranch className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">
                  Nenhuma trilha disponível
                </p>
                <p className="text-slate-500 text-sm">
                  As trilhas serão atribuídas pela sua organização
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paths.map((path: any) => (
              <Card
                key={path.id}
                className={`bg-slate-900 border-slate-800 hover:border-primary/50 transition-colors ${
                  path.is_completed ? 'border-green-500/50' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-xl flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-primary" />
                      {path.title}
                    </CardTitle>
                    {path.is_completed && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completa
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {path.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Progresso</span>
                      <span className="text-sm font-medium text-white">
                        {Math.round(path.progress || 0)}%
                      </span>
                    </div>
                    <Progress value={path.progress || 0} className="h-2" />
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>
                        {path.completed_courses || 0} de {path.total_courses || 0} cursos
                      </span>
                      {path.estimated_duration_hours && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {path.estimated_duration_hours}h
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <Link href={`/paths/${path.slug}`}>
                    <Button className="w-full" variant={path.is_completed ? 'outline' : 'default'}>
                      {path.is_completed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Ver Trilha
                        </>
                      ) : path.next_course_slug ? (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Continuar Trilha
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Começar Trilha
                        </>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

