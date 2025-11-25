'use server'

import { sendEmail } from './resend'
import {
  getWelcomeEmailTemplate,
  getCourseAssignedEmailTemplate,
  getDeadlineApproachingEmailTemplate,
  getCourseCompletedEmailTemplate,
  getCertificateAvailableEmailTemplate,
} from './resend'
import { createClient } from '@/lib/supabase/server'

// ============================================================================
// HELPER: Check if user wants email notifications
// ============================================================================

async function shouldSendEmail(userId: string): Promise<boolean> {
  try {
    // Buscar preferências do usuário específico diretamente do banco
    const supabase = createClient()
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('email_enabled')
      .eq('user_id', userId)
      .single()

    // Se não existir preferência, assume que deve enviar (padrão)
    return preferences?.email_enabled ?? true
  } catch (error) {
    // Se não conseguir buscar preferências, assume que deve enviar
    return true
  }
}

// ============================================================================
// SEND WELCOME EMAIL
// ============================================================================

export async function sendWelcomeEmail(userId: string, userEmail: string, userName: string) {
  if (!(await shouldSendEmail(userId))) {
    return { success: false, skipped: true }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const loginUrl = `${baseUrl}/auth/login`

  const html = getWelcomeEmailTemplate(userName, loginUrl)

  return await sendEmail({
    to: userEmail,
    subject: 'Bem-vindo ao n.training!',
    html,
  })
}

// ============================================================================
// SEND COURSE ASSIGNED EMAIL
// ============================================================================

export async function sendCourseAssignedEmail(
  userId: string,
  userEmail: string,
  userName: string,
  courseTitle: string,
  courseSlug: string,
  isMandatory: boolean = false,
  deadline?: Date
) {
  if (!(await shouldSendEmail(userId))) {
    return { success: false, skipped: true }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const courseUrl = `${baseUrl}/courses/${courseSlug}`
  const deadlineStr = deadline ? deadline.toLocaleDateString('pt-BR') : undefined

  const html = getCourseAssignedEmailTemplate(
    userName,
    courseTitle,
    courseUrl,
    isMandatory,
    deadlineStr
  )

  return await sendEmail({
    to: userEmail,
    subject: isMandatory
      ? `Curso Obrigatório Atribuído: ${courseTitle}`
      : `Novo Curso Disponível: ${courseTitle}`,
    html,
  })
}

// ============================================================================
// SEND DEADLINE APPROACHING EMAIL
// ============================================================================

export async function sendDeadlineApproachingEmail(
  userId: string,
  userEmail: string,
  userName: string,
  courseTitle: string,
  courseSlug: string,
  daysRemaining: number
) {
  if (!(await shouldSendEmail(userId))) {
    return { success: false, skipped: true }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const courseUrl = `${baseUrl}/courses/${courseSlug}`

  const html = getDeadlineApproachingEmailTemplate(
    userName,
    courseTitle,
    courseUrl,
    daysRemaining
  )

  return await sendEmail({
    to: userEmail,
    subject: `Prazo Próximo: ${courseTitle}`,
    html,
  })
}

// ============================================================================
// SEND COURSE COMPLETED EMAIL
// ============================================================================

export async function sendCourseCompletedEmail(
  userId: string,
  userEmail: string,
  userName: string,
  courseTitle: string,
  courseSlug: string
) {
  if (!(await shouldSendEmail(userId))) {
    return { success: false, skipped: true }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const courseUrl = `${baseUrl}/courses/${courseSlug}`

  const html = getCourseCompletedEmailTemplate(userName, courseTitle, courseUrl)

  return await sendEmail({
    to: userEmail,
    subject: `Parabéns! Curso Concluído: ${courseTitle}`,
    html,
  })
}

// ============================================================================
// SEND CERTIFICATE AVAILABLE EMAIL
// ============================================================================

export async function sendCertificateAvailableEmail(
  userId: string,
  userEmail: string,
  userName: string,
  courseTitle: string,
  certificateId: string,
  verificationCode: string
) {
  if (!(await shouldSendEmail(userId))) {
    return { success: false, skipped: true }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const certificateUrl = `${baseUrl}/certificates/${certificateId}`

  const html = getCertificateAvailableEmailTemplate(
    userName,
    courseTitle,
    certificateUrl,
    verificationCode
  )

  return await sendEmail({
    to: userEmail,
    subject: `Certificado Disponível: ${courseTitle}`,
    html,
  })
}

