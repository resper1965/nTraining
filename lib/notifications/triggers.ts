'use server'

import { createNotification, createNotificationForUsers } from '@/app/actions/notifications'
import { getOrganizationUsers } from '@/app/actions/organizations'
import type { NotificationType } from '@/lib/types/database'
import {
  sendWelcomeEmail,
  sendCourseAssignedEmail,
  sendDeadlineApproachingEmail,
  sendCourseCompletedEmail,
  sendCertificateAvailableEmail,
} from '@/lib/email/sender'
import { createClient } from '@/lib/supabase/server'

/**
 * Criar notificação quando curso é atribuído a usuário
 */
export async function notifyCourseAssigned(
  userId: string,
  courseTitle: string,
  courseSlug: string,
  isMandatory: boolean = false,
  deadline?: Date
) {
  const title = isMandatory
    ? `Curso Obrigatório Atribuído: ${courseTitle}`
    : `Novo Curso Disponível: ${courseTitle}`

  let message = `Você tem um novo curso disponível: ${courseTitle}`
  if (isMandatory) {
    message += '. Este curso é obrigatório.'
  }
  if (deadline) {
    const deadlineStr = deadline.toLocaleDateString('pt-BR')
    message += ` Prazo para conclusão: ${deadlineStr}`
  }

  // Criar notificação in-app (com inteligência)
  await createIntelligentNotification(
    userId,
    'course_assigned',
    title,
    message,
    {
      course_slug: courseSlug,
      is_mandatory: isMandatory,
      deadline: deadline?.toISOString(),
    },
    `/courses/${courseSlug}`,
    'Ver Curso'
  )

  // Enviar email (se habilitado)
  try {
    const supabase = createClient()
    const { data: user } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (user?.email) {
      await sendCourseAssignedEmail(
        userId,
        user.email,
        user.full_name || user.email,
        courseTitle,
        courseSlug,
        isMandatory,
        deadline
      )
    }
  } catch (emailError) {
    // Não falhar se o email falhar
    console.error('Error sending course assigned email:', emailError)
  }
}

/**
 * Criar notificação quando deadline está próximo (7 dias)
 */
export async function notifyDeadlineApproaching(
  userId: string,
  courseTitle: string,
  courseSlug: string,
  daysRemaining: number
) {
  // Criar notificação in-app (com inteligência)
  await createIntelligentNotification(
    userId,
    'course_deadline_approaching',
    `Prazo Próximo: ${courseTitle}`,
    `Faltam ${daysRemaining} dia${daysRemaining > 1 ? 's' : ''} para o prazo de conclusão do curso ${courseTitle}`,
    {
      course_slug: courseSlug,
      days_remaining: daysRemaining,
    },
    `/courses/${courseSlug}`,
    'Continuar Curso'
  )

  // Enviar email (se habilitado)
  try {
    const supabase = createClient()
    const { data: user } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (user?.email) {
      await sendDeadlineApproachingEmail(
        userId,
        user.email,
        user.full_name || user.email,
        courseTitle,
        courseSlug,
        daysRemaining
      )
    }
  } catch (emailError) {
    console.error('Error sending deadline approaching email:', emailError)
  }
}

/**
 * Criar notificação quando deadline passou
 */
export async function notifyDeadlinePassed(
  userId: string,
  courseTitle: string,
  courseSlug: string
) {
  await createNotification({
    user_id: userId,
    type: 'course_deadline_passed',
    title: `Prazo Expirado: ${courseTitle}`,
    message: `O prazo para conclusão do curso ${courseTitle} expirou. Entre em contato com seu administrador.`,
    metadata: {
      course_slug: courseSlug,
    },
    action_url: `/courses/${courseSlug}`,
    action_label: 'Ver Curso',
  })
}

/**
 * Criar notificação quando curso é completado
 */
export async function notifyCourseCompleted(
  userId: string,
  courseTitle: string,
  courseSlug: string
) {
  // Criar notificação in-app (com inteligência)
  await createIntelligentNotification(
    userId,
    'course_completed',
    `Parabéns! Curso Concluído: ${courseTitle}`,
    `Você completou o curso ${courseTitle}. Continue aprendendo!`,
    {
      course_slug: courseSlug,
    },
    `/courses/${courseSlug}`,
    'Ver Certificado'
  )

  // Enviar email (se habilitado)
  try {
    const supabase = createClient()
    const { data: user } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (user?.email) {
      await sendCourseCompletedEmail(
        userId,
        user.email,
        user.full_name || user.email,
        courseTitle,
        courseSlug
      )
    }
  } catch (emailError) {
    console.error('Error sending course completed email:', emailError)
  }
}

/**
 * Criar notificação quando certificado está disponível
 */
export async function notifyCertificateAvailable(
  userId: string,
  courseTitle: string,
  certificateId: string,
  verificationCode?: string
) {
  // Criar notificação in-app (com inteligência)
  await createIntelligentNotification(
    userId,
    'certificate_available',
    `Certificado Disponível: ${courseTitle}`,
    `Seu certificado do curso ${courseTitle} está pronto para download!`,
    {
      certificate_id: certificateId,
      course_title: courseTitle,
      verification_code: verificationCode,
    },
    `/certificates/${certificateId}`,
    'Ver Certificado'
  )

  // Enviar email (se habilitado)
  try {
    const supabase = createClient()
    const { data: user } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (user?.email && verificationCode) {
      await sendCertificateAvailableEmail(
        userId,
        user.email,
        user.full_name || user.email,
        courseTitle,
        certificateId,
        verificationCode
      )
    }
  } catch (emailError) {
    console.error('Error sending certificate available email:', emailError)
  }
}

/**
 * Criar notificação de boas-vindas
 */
export async function notifyWelcome(userId: string, userName: string) {
  // Criar notificação in-app
  await createNotification({
    user_id: userId,
    type: 'welcome',
    title: 'Bem-vindo ao n.training!',
    message: `Olá ${userName}! Estamos felizes em tê-lo aqui. Explore nossos cursos e comece sua jornada de aprendizado.`,
    action_url: '/courses',
    action_label: 'Explorar Cursos',
  })

  // Enviar email (se habilitado)
  try {
    const supabase = createClient()
    const { data: user } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (user?.email) {
      await sendWelcomeEmail(
        userId,
        user.email,
        user.full_name || user.email
      )
    }
  } catch (emailError) {
    console.error('Error sending welcome email:', emailError)
  }
}

/**
 * Criar notificação quando novo conteúdo é adicionado
 */
export async function notifyNewContent(
  organizationId: string,
  courseTitle: string,
  courseSlug: string
) {
  try {
    const users = await getOrganizationUsers(organizationId)
    const userIds = users.map((u: any) => u.id)

    if (userIds.length > 0) {
      await createNotificationForUsers(userIds, {
        type: 'new_content',
        title: `Novo Conteúdo: ${courseTitle}`,
        message: `Novo conteúdo foi adicionado ao curso ${courseTitle}. Confira agora!`,
        metadata: {
          course_slug: courseSlug,
        },
        action_url: `/courses/${courseSlug}`,
        action_label: 'Ver Curso',
      })
    }
  } catch (error) {
    console.error('Error notifying new content:', error)
  }
}

