import { requireSuperAdmin } from '@/lib/supabase/server'
import { getLearningPathWithCourses, deleteLearningPath } from '@/app/actions/learning-paths'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, BookOpen, ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DeletePathButton } from '@/components/admin/delete-path-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseCard } from '@/components/courses/course-card'

export const dynamic = 'force-dynamic'

export default async function LearningPathDetailPage({
  params,
}: {
  params: { id: string }
}) {
  await requireSuperAdmin()

  const path = await getLearningPathWithCourses(params.id).catch(() => null)

  if (!path) {
    return (
      <div className="p-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-center">Trilha não encontrada</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/paths">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-white mb-2">
              {path.title}
            </h1>
            <p className="text-slate-400">{path.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/paths/${path.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <DeletePathButton pathId={path.id} pathTitle={path.title} />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm text-slate-400">Cursos</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {path.path_courses?.length || 0}
            </p>
          </CardContent>
        </Card>

        {path.estimated_duration_hours && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-slate-400">Duração</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {path.estimated_duration_hours}h
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-slate-400">Status</span>
            </div>
            {path.is_mandatory ? (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                Obrigatória
              </Badge>
            ) : (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                Opcional
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Courses */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="bg-slate-900 border-slate-800">
          <TabsTrigger value="courses">Cursos ({path.path_courses?.length || 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="mt-6">
          {path.path_courses && path.path_courses.length > 0 ? (
            <div className="space-y-4">
              {path.path_courses.map((pathCourse, index) => (
                <Card
                  key={pathCourse.id}
                  className="bg-slate-900 border-slate-800"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        {pathCourse.courses && (
                          <CourseCard
                            course={pathCourse.courses as any}
                            showProgress={false}
                          />
                        )}
                      </div>
                      {pathCourse.is_required && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          Obrigatório
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-slate-400 text-center py-8">
                  Nenhum curso adicionado a esta trilha
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

