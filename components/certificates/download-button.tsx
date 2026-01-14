'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CertificatePDF } from '@/lib/certificates/pdf-generator'
import type { Certificate } from '@/lib/types/database'

interface DownloadButtonProps {
  certificate: Certificate & {
    users?: { full_name: string; email: string }
    courses?: { title: string; area?: string; duration_hours?: number }
    organizations?: { name: string; razao_social?: string }
  }
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function CertificateDownloadButton({
  certificate,
  variant = 'default',
  size = 'default',
}: DownloadButtonProps) {
  const [isClient, setIsClient] = useState(false)

  // Only render PDF component on client
  useState(() => {
    setIsClient(true)
  })

  const fileName = `certificado-${certificate.verification_code}.pdf`

  if (!isClient) {
    return (
      <Button variant={variant} size={size} disabled>
        <Download className="h-4 w-4 mr-2" />
        Preparando Download...
      </Button>
    )
  }

  return (
    <PDFDownloadLink
      document={<CertificatePDF certificate={certificate} />}
      fileName={fileName}
      className="inline-flex"
    >
      {({ loading }) => (
        <Button variant={variant} size={size} disabled={loading}>
          <Download className="h-4 w-4 mr-2" />
          {loading ? 'Gerando PDF...' : 'Baixar Certificado'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
