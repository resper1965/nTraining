'use client'

import { Award, Calendar, Clock, Building2, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Certificate } from '@/lib/types/database'

interface CertificateViewerProps {
  certificate: Certificate & {
    courses?: {
      title: string
      area?: string
      duration_hours?: number
    }
    users?: {
      full_name: string
      email: string
    }
    organizations?: {
      name: string
      razao_social?: string
    }
  }
}

export function CertificateViewer({ certificate }: CertificateViewerProps) {
  const userName = certificate.users?.full_name || 'Estudante'
  const courseName = certificate.courses?.title || 'Curso'
  const courseArea = certificate.courses?.area
  const courseDuration = certificate.courses?.duration_hours
  const organizationName =
    certificate.organizations?.razao_social ||
    certificate.organizations?.name ||
    'n.training'
  const issuedDate = new Date(certificate.issued_at)

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-primary/20 rounded-lg p-12 shadow-2xl">
      {/* Decorative Border */}
      <div className="absolute inset-4 border-2 border-primary/30 rounded-lg" />
      <div className="absolute inset-8 border border-primary/20 rounded-lg" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/20 rounded-full">
              <Award className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h2 className="font-display text-4xl font-medium text-white">
            CERTIFICADO
          </h2>
          <p className="text-xl text-slate-400">
            de Conclusão de Curso
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6 py-8">
          <p className="text-lg text-slate-300 leading-relaxed">
            Certificamos que
          </p>
          <h3 className="font-display text-3xl font-medium text-primary">
            {userName}
          </h3>
          <p className="text-lg text-slate-300 leading-relaxed">
            concluiu com sucesso o curso
          </p>
          <h4 className="font-display text-2xl font-medium text-white">
            {courseName}
          </h4>
          {courseArea && (
            <p className="text-lg text-slate-300">
              na área de <span className="text-white font-medium">{courseArea}</span>
            </p>
          )}
          {courseDuration && (
            <p className="text-lg text-slate-300">
              com carga horária de{' '}
              <span className="text-white font-medium">{courseDuration} horas</span>
            </p>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-700">
          <div className="flex items-center gap-3 text-left">
            <Building2 className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 mb-1">Emitido por</div>
              <div className="text-sm font-medium text-white">
                {organizationName}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <Calendar className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 mb-1">Data de Emissão</div>
              <div className="text-sm font-medium text-white">
                {format(issuedDate, "d 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </div>
            </div>
          </div>
          {courseDuration && (
            <div className="flex items-center gap-3 text-left">
              <Clock className="h-5 w-5 text-slate-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-500 mb-1">Carga Horária</div>
                <div className="text-sm font-medium text-white">
                  {courseDuration} horas
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 text-left">
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 mb-1">Status</div>
              <div className="text-sm font-medium text-green-400">
                Válido e Verificado
              </div>
            </div>
          </div>
        </div>

        {/* Verification Code */}
        {certificate.verification_code && (
          <div className="pt-8 border-t border-slate-700">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-xs text-slate-500 mb-2">
                Código de Verificação
              </div>
              <div className="text-lg font-mono text-primary font-bold">
                {certificate.verification_code}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

