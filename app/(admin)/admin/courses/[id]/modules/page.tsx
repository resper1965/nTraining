import { requireSuperAdmin } from '@/lib/supabase/server'
import { getCourseById, type ActionError } from '@/app/actions/courses'
import { getModulesByCourse } from '@/app/actions/modules'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Plus, GripVertical, Edit, Trash2, BookOpen } from 'lucide-react'
import { ModuleList } from '@/components/admin/module-list'
import { CreateModuleDialog } from '@/components/admin/create-module-dialog'
import { notFound } from 'next/navigation'
import type { CourseWithModules } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

// Type guard helper
function isActionError(result: CourseWithModules | ActionError): result is ActionError {
  return 'code' in result || 'message' in result
}

export default async function CourseModulesPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { message?: string; error?: string }
}) {
  await requireSuperAdmin()

  const [courseResult, modules] = await Promise.all([
    getCourseById(params.id),
    getModulesByCourse(params.id),
  ])
  
  if (!courseResult || isActionError(courseResult)) {
    notFound()
  }
  
  const course = courseResult as CourseWithModules

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/courses/${params.id}/edit`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-white mb-2">
              Módulos do Curso
            </h1>
            <p className="text-slate-400">
              {course.title}
            </p>
          </div>
        </div>
        <CreateModuleDialog courseId={params.id} />
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

      {/* Modules List */}
      {modules.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-display text-xl font-medium text-white mb-2">
                Nenhum módulo criado
              </h3>
              <p className="text-slate-400 mb-6">
                Comece adicionando módulos para organizar o conteúdo do curso
              </p>
              <CreateModuleDialog courseId={params.id} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <ModuleList courseId={params.id} modules={modules} />
      )}
    </div>
  )
}

