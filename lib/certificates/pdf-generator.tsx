import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from '@react-pdf/renderer'
import type { Certificate } from '@/lib/types/database'

interface CertificatePDFProps {
  certificate: Certificate & {
    users?: { full_name: string; email: string }
    courses?: { title: string; area?: string; duration_hours?: number }
    organizations?: { name: string; razao_social?: string }
  }
}

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 60,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  certificateText: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 1.8,
    marginBottom: 20,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ade8',
    marginVertical: 20,
    textAlign: 'center',
  },
  courseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginVertical: 10,
    textAlign: 'center',
  },
  details: {
    marginTop: 40,
    paddingTop: 30,
    borderTop: '2px solid #e2e8f0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 12,
    color: '#64748b',
  },
  verification: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  verificationLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 5,
  },
  verificationCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Courier',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1px solid #e2e8f0',
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
  },
})

export function CertificatePDF({ certificate }: CertificatePDFProps) {
  const userName =
    certificate.users?.full_name || 'Estudante'
  const courseName = certificate.courses?.title || 'Curso'
  const courseArea = certificate.courses?.area
  const courseDuration = certificate.courses?.duration_hours
  const organizationName =
    certificate.organizations?.razao_social ||
    certificate.organizations?.name ||
    'n.training Platform'
  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CERTIFICADO</Text>
          <Text style={styles.subtitle}>de Conclusão de Curso</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.certificateText}>
            Certificamos que
          </Text>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.certificateText}>
            concluiu com sucesso o curso
          </Text>
          <Text style={styles.courseName}>{courseName}</Text>
          {courseArea && (
            <Text style={styles.certificateText}>
              na área de {courseArea}
            </Text>
          )}
          {courseDuration && (
            <Text style={styles.certificateText}>
              com carga horária de {courseDuration} horas
            </Text>
          )}
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text>Emitido por:</Text>
            <Text>{organizationName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text>Data de Emissão:</Text>
            <Text>{issuedDate}</Text>
          </View>
          {courseDuration && (
            <View style={styles.detailRow}>
              <Text>Carga Horária:</Text>
              <Text>{courseDuration} horas</Text>
            </View>
          )}
        </View>

        {/* Verification Code */}
        <View style={styles.verification}>
          <Text style={styles.verificationLabel}>
            Código de Verificação
          </Text>
          <Text style={styles.verificationCode}>
            {certificate.verification_code}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Este certificado pode ser verificado em{' '}
            {process.env.NEXT_PUBLIC_APP_URL || 'https://ntraining.com.br'}/certificates/verify
          </Text>
        </View>
      </Page>
    </Document>
  )
}

/**
 * Generate PDF and upload to Supabase Storage
 */
export async function generateCertificatePDFFile(
  certificate: Certificate & {
    users?: { full_name: string; email: string }
    courses?: { title: string; area?: string; duration_hours?: number }
    organizations?: { name: string; razao_social?: string }
  }
): Promise<string> {
  const { renderToBuffer } = await import('@react-pdf/renderer')
  const { createClient } = await import('@/lib/supabase/server')

  try {
    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(<CertificatePDF certificate={certificate} />)

    // Create Supabase client
    const supabase = createClient()

    // Generate filename
    const fileName = `certificate-${certificate.id}.pdf`
    const filePath = `certificates/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true, // Overwrite if exists
      })

    if (uploadError) {
      console.error('Error uploading certificate:', uploadError)
      throw new Error('Failed to upload certificate')
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error generating certificate PDF:', error)
    throw error
  }
}

