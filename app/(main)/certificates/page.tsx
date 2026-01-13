import { requireAuth } from '@/lib/supabase/server'
import { getUserCertificates } from '@/app/actions/certificates'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Award, Download, ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function CertificatesPage() {
  await requireAuth()

  const certificates = await getUserCertificates()

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Meus Certificados
          </h1>
          <p className="text-slate-400">
            Visualize e baixe seus certificados de conclusão de curso
          </p>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="font-display text-xl font-medium text-white mb-2">
                  Nenhum certificado encontrado
                </h3>
                <p className="text-slate-400 mb-6">
                  Complete cursos para receber certificados de conclusão
                </p>
                <Link href="/courses">
                  <Button>Explorar Cursos</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert: any) => {
              const course = cert.courses
              const issuedDate = new Date(cert.issued_at)

              return (
                <Card
                  key={cert.id}
                  className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <CardHeader>
                    {course?.thumbnail_url && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <Award className="h-8 w-8 text-primary flex-shrink-0" />
                      <span className="text-xs px-2 py-1 bg-green-950/50 text-green-400 rounded">
                        Emitido
                      </span>
                    </div>
                    <CardTitle className="font-display text-lg text-white line-clamp-2">
                      {course?.title || 'Curso'}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {course?.area || 'Área não especificada'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Emitido em{' '}
                          {format(issuedDate, "d 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      {course?.duration_hours && (
                        <div className="text-slate-400">
                          Carga horária: {course.duration_hours}h
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                      <Link
                        href={`/certificates/${cert.id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Certificado
                        </Button>
                      </Link>
                      <Link
                        href={`/certificates/${cert.id}/download`}
                        className="flex-1"
                      >
                        <Button className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </Link>
                    </div>

                    {cert.verification_code && (
                      <div className="pt-2 border-t border-slate-800">
                        <p className="text-xs text-slate-500 mb-1">
                          Código de Verificação
                        </p>
                        <p className="text-xs font-mono text-slate-400">
                          {cert.verification_code}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

