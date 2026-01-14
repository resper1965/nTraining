import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

export { resend }

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || 'n.training <noreply@ntraining.com.br>',
  replyTo: process.env.RESEND_REPLY_TO || 'support@ntraining.com.br',
}
