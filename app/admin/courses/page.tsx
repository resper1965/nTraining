import { getCourses } from '@/app/actions/courses'
import { requireSuperAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit, BookOpen, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string }
}) {
  await requireSuperAdmin()

  const courses = await getCourses({ status: undefined }) // Get all courses

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-white mb-2">
            Gestão de Cursos
          </h1>
          <p className="text-slate-400">
            Gerencie todos os cursos da plataforma
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Curso
          </Button>
        </Link>
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

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="font-display text-xl font-medium text-white mb-2">
                Nenhum curso encontrado
              </h3>
              <p className="text-slate-400 mb-6">
                Comece criando seu primeiro curso na plataforma
              </p>
              <Link href="/admin/courses/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Curso
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link key={course.id} href={`/admin/courses/${course.id}/edit`}>
              <Card className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-display text-lg text-white line-clamp-2 flex-1">
                      {course.title}
                    </CardTitle>
                    <span
                      className={`ml-2 text-xs px-2 py-1 rounded flex-shrink-0 ${
                        course.status === 'published'
                          ? 'bg-green-950/50 text-green-400'
                          : course.status === 'draft'
                          ? 'bg-yellow-950/50 text-yellow-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {course.status === 'published'
                        ? 'Publicado'
                        : course.status === 'draft'
                        ? 'Rascunho'
                        : 'Arquivado'}
                    </span>
                  </div>
                  <CardDescription className="text-slate-400 line-clamp-2">
                    {course.description || 'Sem descrição'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span className="uppercase">{course.level}</span>
                    {course.duration_hours && (
                      <span>{course.duration_hours}h</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/courses/${course.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    {course.status === 'published' && (
                      <Link
                        href={`/courses/${course.slug}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                  {course.created_at && (
                    <p className="text-xs text-slate-500 mt-4">
                      Criado{' '}
                      {formatDistanceToNow(new Date(course.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

