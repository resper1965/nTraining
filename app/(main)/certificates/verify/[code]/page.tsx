import { getCertificateByVerificationCode } from '@/app/actions/certificates'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, CheckCircle2, XCircle, Calendar, Clock, Building2, User } from 'lucide-react'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CertificateViewer } from '@/components/certificates/certificate-viewer'

export const dynamic = 'force-dynamic'

export default async function VerifyCertificatePage({
  params,
}: {
  params: { code: string }
}) {
  const certificate = await getCertificateByVerificationCode(params.code)

  if (!certificate) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900 border-slate-800 max-w-md">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-medium text-white mb-2">
                Certificado Não Encontrado
              </h2>
              <p className="text-slate-400">
                O código de verificação fornecido não corresponde a nenhum certificado válido.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const course = certificate.courses as any
  const user = certificate.users as any
  const organization = certificate.organizations as any
  const issuedDate = new Date(certificate.issued_at)

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-950/50 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Certificado Verificado
          </h1>
          <p className="text-slate-400">
            Este certificado é válido e foi emitido pela plataforma n.training
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Certificate Display */}
          <Card className="bg-slate-900 border-slate-800 mb-8">
            <CardHeader>
              <CardTitle className="font-display text-xl text-white text-center">
                Certificado de Conclusão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CertificateViewer
                certificate={{
                  ...certificate,
                  courses: course,
                  users: user,
                  organizations: organization,
                }}
              />
            </CardContent>
          </Card>

          {/* Verification Details */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Informações de Verificação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Certificado para
                  </div>
                  <div className="text-lg font-medium text-white">
                    {user?.full_name || 'Estudante'}
                  </div>
                  {user?.email && (
                    <div className="text-sm text-slate-400 mt-1">
                      {user.email}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Curso
                  </div>
                  <div className="text-lg font-medium text-white">
                    {course?.title || 'Curso'}
                  </div>
                  {course?.area && (
                    <div className="text-sm text-slate-400 mt-1">
                      {course.area}
                    </div>
                  )}
                </div>

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

                <div>
                  <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Status
                  </div>
                  <div className="text-lg font-medium text-green-400">
                    Válido e Verificado
                  </div>
                </div>
              </div>

              {certificate.verification_code && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="text-sm text-slate-400 mb-2">
                    Código de Verificação
                  </div>
                  <div className="text-lg font-mono text-primary bg-slate-800 p-3 rounded">
                    {certificate.verification_code}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

