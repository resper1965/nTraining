import { requireAuth } from '@/lib/supabase/server'
import { getCourses } from '@/app/actions/courses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  await requireAuth()

  const query = searchParams.q || ''
  const coursesResult = query ? await getCourses({ search: query }) : null
  const courses = coursesResult && 'message' in coursesResult ? [] : (coursesResult || [])

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Buscar Cursos
          </h1>
          {query && (
            <p className="text-slate-400">
              Resultados para &quot;{query}&quot;
            </p>
          )}
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <form action="/search" method="get" className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Buscar cursos por título ou descrição..."
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Results */}
        {query ? (
          courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-colors cursor-pointer h-full">
                    {course.thumbnail_url && (
                      <div className="relative w-full h-48 bg-slate-800 rounded-t-lg overflow-hidden">
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-display text-lg text-white line-clamp-2">
                        {course.title}
                      </CardTitle>
                      {course.description && (
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span className="capitalize">{course.level}</span>
                        {course.duration_hours && (
                          <span>{course.duration_hours}h</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-medium text-white mb-2">
                Nenhum resultado encontrado
              </h2>
              <p className="text-slate-400 mb-6">
                Não encontramos cursos correspondentes a &quot;{query}&quot;
              </p>
              <Link href="/courses">
                <Button variant="outline">
                  Ver Todos os Cursos
                </Button>
              </Link>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-medium text-white mb-2">
              Busque por cursos
            </h2>
            <p className="text-slate-400">
              Digite um termo de busca acima para encontrar cursos
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

