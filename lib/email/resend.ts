import { Resend } from 'resend'

// Inicializar cliente Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// ============================================================================
// TYPES
// ============================================================================

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
}

// ============================================================================
// SEND EMAIL
// ============================================================================

export async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY || !resend) {
      console.warn('RESEND_API_KEY não configurada. Email não será enviado.')
      return { success: false, error: 'RESEND_API_KEY não configurada' }
    }

    const { data, error } = await resend.emails.send({
      from: options.from || process.env.RESEND_FROM_EMAIL || 'n.training <noreply@ntraining.com>',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      reply_to: options.replyTo,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

export function getWelcomeEmailTemplate(userName: string, loginUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao n.training</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a;">
      <div style="background-color: #1e293b; border-radius: 8px; padding: 30px; margin: 20px 0;">
        <h1 style="color: #00ade8; margin-top: 0;">Bem-vindo ao n.training!</h1>
        <p style="color: #e2e8f0;">Olá ${userName},</p>
        <p style="color: #e2e8f0;">Estamos felizes em tê-lo aqui! Sua conta foi criada com sucesso.</p>
        <p style="color: #e2e8f0;">Agora você pode acessar nossa plataforma e começar sua jornada de aprendizado.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${loginUrl}" style="display: inline-block; background-color: #00ade8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Acessar Plataforma</a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">Se você não criou esta conta, pode ignorar este email.</p>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px;">© ${new Date().getFullYear()} n.training - Todos os direitos reservados</p>
    </body>
    </html>
  `
}

export function getCourseAssignedEmailTemplate(
  userName: string,
  courseTitle: string,
  courseUrl: string,
  isMandatory: boolean = false,
  deadline?: string
) {
  const deadlineText = deadline
    ? `<p style="color: #fbbf24; font-weight: 600;">⚠️ Prazo para conclusão: ${deadline}</p>`
    : ''

  const mandatoryText = isMandatory
    ? '<p style="color: #fbbf24; font-weight: 600;">📌 Este curso é obrigatório.</p>'
    : ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Novo Curso Disponível</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a;">
      <div style="background-color: #1e293b; border-radius: 8px; padding: 30px; margin: 20px 0;">
        <h1 style="color: #00ade8; margin-top: 0;">Novo Curso Disponível</h1>
        <p style="color: #e2e8f0;">Olá ${userName},</p>
        <p style="color: #e2e8f0;">Um novo curso foi atribuído a você:</p>
        <div style="background-color: #0f172a; border-left: 4px solid #00ade8; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h2 style="color: #00ade8; margin-top: 0;">${courseTitle}</h2>
          ${mandatoryText}
          ${deadlineText}
        </div>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${courseUrl}" style="display: inline-block; background-color: #00ade8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver Curso</a>
        </div>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px;">© ${new Date().getFullYear()} n.training - Todos os direitos reservados</p>
    </body>
    </html>
  `
}

export function getDeadlineApproachingEmailTemplate(
  userName: string,
  courseTitle: string,
  courseUrl: string,
  daysRemaining: number
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Prazo Próximo</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a;">
      <div style="background-color: #1e293b; border-radius: 8px; padding: 30px; margin: 20px 0;">
        <h1 style="color: #fbbf24; margin-top: 0;">⚠️ Prazo Próximo</h1>
        <p style="color: #e2e8f0;">Olá ${userName},</p>
        <p style="color: #e2e8f0;">Faltam apenas <strong style="color: #fbbf24;">${daysRemaining} dia${daysRemaining > 1 ? 's' : ''}</strong> para o prazo de conclusão do curso:</p>
        <div style="background-color: #0f172a; border-left: 4px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h2 style="color: #fbbf24; margin-top: 0;">${courseTitle}</h2>
        </div>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${courseUrl}" style="display: inline-block; background-color: #fbbf24; color: #0f172a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Continuar Curso</a>
        </div>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px;">© ${new Date().getFullYear()} n.training - Todos os direitos reservados</p>
    </body>
    </html>
  `
}

export function getCourseCompletedEmailTemplate(
  userName: string,
  courseTitle: string,
  courseUrl: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Curso Concluído</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a;">
      <div style="background-color: #1e293b; border-radius: 8px; padding: 30px; margin: 20px 0;">
        <h1 style="color: #10b981; margin-top: 0;">🎉 Parabéns!</h1>
        <p style="color: #e2e8f0;">Olá ${userName},</p>
        <p style="color: #e2e8f0;">Você completou com sucesso o curso:</p>
        <div style="background-color: #0f172a; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h2 style="color: #10b981; margin-top: 0;">${courseTitle}</h2>
        </div>
        <p style="color: #e2e8f0;">Continue aprendendo e desenvolvendo suas habilidades!</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${courseUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver Certificado</a>
        </div>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px;">© ${new Date().getFullYear()} n.training - Todos os direitos reservados</p>
    </body>
    </html>
  `
}

export function getCertificateAvailableEmailTemplate(
  userName: string,
  courseTitle: string,
  certificateUrl: string,
  verificationCode: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificado Disponível</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a;">
      <div style="background-color: #1e293b; border-radius: 8px; padding: 30px; margin: 20px 0;">
        <h1 style="color: #8b5cf6; margin-top: 0;">🏆 Certificado Disponível</h1>
        <p style="color: #e2e8f0;">Olá ${userName},</p>
        <p style="color: #e2e8f0;">Seu certificado do curso está pronto para download:</p>
        <div style="background-color: #0f172a; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h2 style="color: #8b5cf6; margin-top: 0;">${courseTitle}</h2>
          <p style="color: #94a3b8; font-size: 14px; margin: 10px 0;">Código de verificação: <code style="background-color: #1e293b; padding: 4px 8px; border-radius: 4px; color: #00ade8;">${verificationCode}</code></p>
        </div>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${certificateUrl}" style="display: inline-block; background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Ver Certificado</a>
        </div>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px;">© ${new Date().getFullYear()} n.training - Todos os direitos reservados</p>
    </body>
    </html>
  `
}

