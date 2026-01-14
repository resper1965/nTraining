import { requireAuth } from '@/lib/supabase/server'
import { getCertificateById } from '@/app/actions/certificates'
import { notFound, redirect } from 'next/navigation'
import { generateCertificatePDFFile } from '@/lib/certificates/pdf-generator'

export const dynamic = 'force-dynamic'

export default async function DownloadCertificatePage({
  params,
}: {
  params: { id: string }
}) {
  const user = await requireAuth()

  let certificate
  try {
    certificate = await getCertificateById(params.id)
  } catch (error) {
    notFound()
  }

  // Verify certificate belongs to user (or user is admin)
  if (certificate.user_id !== user.id && user.role !== 'platform_admin') {
    notFound()
  }

  // Generate PDF and upload to storage
  const pdfUrl = await generateCertificatePDFFile(certificate)

  // Redirect to the PDF URL for download
  redirect(pdfUrl)
}

