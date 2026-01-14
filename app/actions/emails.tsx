'use server'

import { resend, EMAIL_CONFIG } from '@/lib/email/client'
import {
  WelcomeEmail,
  CourseAssignedEmail,
  CertificateIssuedEmail,
  PasswordResetEmail,
  CourseReminderEmail,
} from '@/lib/email/templates'
import { renderToStaticMarkup } from 'react-dom/server'

// Helper to render React component to HTML string
async function renderEmail(component: React.ReactElement): Promise<string> {
  return renderToStaticMarkup(component)
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(email: string, userName: string) {
  try {
    const html = await renderEmail(<WelcomeEmail userName={userName} />)

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: 'Bem-vindo ao n.training!',
      html,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}

/**
 * Send course assigned notification
 */
export async function sendCourseAssignedEmail(
  email: string,
  userName: string,
  courseName: string,
  courseId: string
) {
  try {
    const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`
    const html = await renderEmail(
      <CourseAssignedEmail userName={userName} courseName={courseName} courseUrl={courseUrl} />
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: `Novo curso: ${courseName}`,
      html,
    })

    if (error) {
      console.error('Error sending course assigned email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send course assigned email:', error)
    return { success: false, error }
  }
}

/**
 * Send certificate issued notification
 */
export async function sendCertificateEmail(
  email: string,
  userName: string,
  courseName: string,
  certificateId: string,
  verificationCode: string
) {
  try {
    const certificateUrl = `${process.env.NEXT_PUBLIC_APP_URL}/certificates/${certificateId}`
    const html = await renderEmail(
      <CertificateIssuedEmail
        userName={userName}
        courseName={courseName}
        certificateUrl={certificateUrl}
        verificationCode={verificationCode}
      />
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: `🎓 Certificado emitido - ${courseName}`,
      html,
    })

    if (error) {
      console.error('Error sending certificate email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send certificate email:', error)
    return { success: false, error }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  userName: string,
  resetToken: string
) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
    const html = await renderEmail(
      <PasswordResetEmail userName={userName} resetUrl={resetUrl} />
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: 'Redefinir senha - n.training',
      html,
    })

    if (error) {
      console.error('Error sending password reset email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return { success: false, error }
  }
}

/**
 * Send course reminder email
 */
export async function sendCourseReminderEmail(
  email: string,
  userName: string,
  courseName: string,
  courseId: string,
  progress: number
) {
  try {
    const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`
    const html = await renderEmail(
      <CourseReminderEmail
        userName={userName}
        courseName={courseName}
        courseUrl={courseUrl}
        progress={progress}
      />
    )

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: `Continue seu curso: ${courseName}`,
      html,
    })

    if (error) {
      console.error('Error sending course reminder email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send course reminder email:', error)
    return { success: false, error }
  }
}
