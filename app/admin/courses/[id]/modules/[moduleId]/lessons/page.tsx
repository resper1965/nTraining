import { requireSuperAdmin } from '@/lib/supabase/server'
import { getCourseById } from '@/app/actions/courses'
import { getModulesByCourse } from '@/app/actions/modules'
import { getLessonsByModule } from '@/app/actions/lessons'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Video, FileText, FileQuestion } from 'lucide-react'
import { LessonList } from '@/components/admin/lesson-list'
import { CreateLessonDialog } from '@/components/admin/create-lesson-dialog'

export const dynamic = 'force-dynamic'

export default async function ModuleLessonsPage({
  params,
  searchParams,
}: {
  params: { id: string; moduleId: string }
  searchParams: { message?: string; error?: string }
}) {
  await requireSuperAdmin()

  const [course, modules, lessons] = await Promise.all([
    getCourseById(params.id),
    getModulesByCourse(params.id),
    getLessonsByModule(params.moduleId),
  ])

  const currentModule = modules.find((m) => m.id === params.moduleId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/courses/${params.id}/modules`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-white mb-2">
              Aulas do Módulo
            </h1>
            <p className="text-slate-400">
              {currentModule?.title || 'Módulo'} - {course.title}
            </p>
          </div>
        </div>
        <CreateLessonDialog moduleId={params.moduleId} courseId={params.id} />
      </div>

      {/* Messages */}
      {searchParams.message && (
        <div className="p-4 bg-green-950/50 border border-green-800 rounded-lg text-sm text-green-300">
          {searchParams.message}
        </div>
      )}
      {searchParams.error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg text-sm text-red-300">
          {searchParams.error}
        </div>
      )}

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-display text-xl font-medium text-white mb-2">
                Nenhuma aula criada
              </h3>
              <p className="text-slate-400 mb-6">
                Comece adicionando aulas a este módulo
              </p>
              <CreateLessonDialog moduleId={params.moduleId} courseId={params.id} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <LessonList
          courseId={params.id}
          moduleId={params.moduleId}
          lessons={lessons}
        />
      )}
    </div>
  )
}

