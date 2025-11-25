import type { Notification, NotificationType } from '@/lib/types/database'

/**
 * Prioriza notificações baseado em importância
 * Esta função pode ser usada tanto no servidor quanto no cliente
 */
export function prioritizeNotifications(notifications: Notification[]): Notification[] {
  const priorityMap: Record<NotificationType, number> = {
    course_deadline_passed: 10,
    course_deadline_approaching: 8,
    course_assigned: 7,
    certificate_available: 6,
    course_completed: 5,
    quiz_available: 4,
    quiz_result: 4,
    new_content: 3,
    organization_update: 3,
    welcome: 2,
    system: 1,
  }

  return [...notifications].sort((a, b) => {
    const priorityA = priorityMap[a.type] || 0
    const priorityB = priorityMap[b.type] || 0

    // Prioridade maior primeiro
    if (priorityA !== priorityB) {
      return priorityB - priorityA
    }

    // Se mesma prioridade, mais recente primeiro
    return (
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })
}

/**
 * Agrupa notificações similares
 */
export function groupSimilarNotifications(
  notifications: Notification[]
): Notification[][] {
  const groups: Notification[][] = []
  const processed = new Set<string>()

  for (const notification of notifications) {
    if (processed.has(notification.id)) continue

    const group = [notification]
    processed.add(notification.id)

    // Encontrar notificações similares
    for (const other of notifications) {
      if (processed.has(other.id)) continue

      if (areSimilar(notification, other)) {
        group.push(other)
        processed.add(other.id)
      }
    }

    groups.push(group)
  }

  return groups
}

/**
 * Verifica se duas notificações são similares
 */
function areSimilar(n1: Notification, n2: Notification): boolean {
  // Mesmo tipo e criadas dentro de 1 hora
  if (n1.type !== n2.type) return false

  const timeDiff = Math.abs(
    new Date(n1.created_at).getTime() - new Date(n2.created_at).getTime()
  )
  const oneHour = 60 * 60 * 1000

  if (timeDiff > oneHour) return false

  // Para cursos atribuídos, verificar se é do mesmo curso
  if (n1.type === 'course_assigned' && n2.type === 'course_assigned') {
    return n1.metadata?.course_slug === n2.metadata?.course_slug
  }

  // Para certificados, verificar se é do mesmo curso
  if (n1.type === 'certificate_available' && n2.type === 'certificate_available') {
    return n1.metadata?.course_title === n2.metadata?.course_title
  }

  return true
}

