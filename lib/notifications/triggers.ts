'use server'

import { createNotification, createNotificationForUsers } from '@/app/actions/notifications'
import { getOrganizationUsers } from '@/app/actions/organizations'
import type { NotificationType } from '@/lib/types/database'

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

  await createNotification({
    user_id: userId,
    type: 'course_assigned',
    title,
    message,
    metadata: {
      course_slug: courseSlug,
      is_mandatory: isMandatory,
      deadline: deadline?.toISOString(),
    },
    action_url: `/courses/${courseSlug}`,
    action_label: 'Ver Curso',
  })
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
  await createNotification({
    user_id: userId,
    type: 'course_deadline_approaching',
    title: `Prazo Próximo: ${courseTitle}`,
    message: `Faltam ${daysRemaining} dia${daysRemaining > 1 ? 's' : ''} para o prazo de conclusão do curso ${courseTitle}`,
    metadata: {
      course_slug: courseSlug,
      days_remaining: daysRemaining,
    },
    action_url: `/courses/${courseSlug}`,
    action_label: 'Continuar Curso',
  })
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
  await createNotification({
    user_id: userId,
    type: 'course_completed',
    title: `Parabéns! Curso Concluído: ${courseTitle}`,
    message: `Você completou o curso ${courseTitle}. Continue aprendendo!`,
    metadata: {
      course_slug: courseSlug,
    },
    action_url: `/courses/${courseSlug}`,
    action_label: 'Ver Certificado',
  })
}

/**
 * Criar notificação quando certificado está disponível
 */
export async function notifyCertificateAvailable(
  userId: string,
  courseTitle: string,
  certificateId: string
) {
  await createNotification({
    user_id: userId,
    type: 'certificate_available',
    title: `Certificado Disponível: ${courseTitle}`,
    message: `Seu certificado do curso ${courseTitle} está pronto para download!`,
    metadata: {
      certificate_id: certificateId,
      course_title: courseTitle,
    },
    action_url: `/certificates/${certificateId}`,
    action_label: 'Ver Certificado',
  })
}

/**
 * Criar notificação de boas-vindas
 */
export async function notifyWelcome(userId: string, userName: string) {
  await createNotification({
    user_id: userId,
    type: 'welcome',
    title: 'Bem-vindo ao n.training!',
    message: `Olá ${userName}! Estamos felizes em tê-lo aqui. Explore nossos cursos e comece sua jornada de aprendizado.`,
    action_url: '/courses',
    action_label: 'Explorar Cursos',
  })
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

