import { requireAuth } from '@/lib/supabase/server'
import { getCertificateById } from '@/app/actions/certificates'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Download, Award, Calendar, Clock, Building2 } from 'lucide-react'
import { ShareCertificateButton } from '@/components/certificates/share-button'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CertificateViewer } from '@/components/certificates/certificate-viewer'

export const dynamic = 'force-dynamic'

export default async function CertificateDetailPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAuth()

  let certificate
  try {
    certificate = await getCertificateById(params.id)
  } catch (error) {
    notFound()
  }

  const course = certificate.courses
  const issuedDate = new Date(certificate.issued_at)

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/certificates">
            <Button variant="ghost" size="sm" className="mb-4">
              ← Voltar para Certificados
            </Button>
          </Link>
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Certificado de Conclusão
          </h1>
          <p className="text-slate-400">
            {course?.title || 'Curso'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="font-display text-xl text-white flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Certificado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CertificateViewer certificate={certificate} />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-6">
              <Link href={`/certificates/${params.id}/download`} className="flex-1">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </Link>
              <ShareCertificateButton verificationCode={certificate.verification_code} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Course Info */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">
                  Informações do Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course?.thumbnail_url && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="text-sm text-slate-400 mb-1">Curso</div>
                  <div className="text-lg font-medium text-white">
                    {course?.title || 'Curso'}
                  </div>
                </div>
                {course?.area && (
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Área</div>
                    <div className="text-lg font-medium text-white">
                      {course.area}
                    </div>
                  </div>
                )}
                {course?.duration_hours && (
                  <div>
                    <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Carga Horária
                    </div>
                    <div className="text-lg font-medium text-white">
                      {course.duration_hours} horas
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certificate Details */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">
                  Detalhes do Certificado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data de Emissão
                  </div>
                  <div className="text-lg font-medium text-white">
                    {format(issuedDate, "d 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                </div>
                {certificate.verification_code && (
                  <div>
                    <div className="text-sm text-slate-400 mb-1">
                      Código de Verificação
                    </div>
                    <div className="text-sm font-mono text-primary bg-slate-800 p-2 rounded">
                      {certificate.verification_code}
                    </div>
                    <Link
                      href={`/certificates/verify/${certificate.verification_code}`}
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      Verificar certificado publicamente
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

