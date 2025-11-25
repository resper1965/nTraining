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
  await requireAuth()

  let certificate
  try {
    certificate = await getCertificateById(params.id)
  } catch (error) {
    notFound()
  }

  // Generate PDF URL (for now, redirect to view page)
  // TODO: Implement actual PDF download when PDF generation is complete
  const pdfUrl = await generateCertificatePDFFile(certificate)

  // For now, redirect to certificate view
  // In production, this would download the PDF file
  redirect(`/certificates/${params.id}`)
}

