import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/app/actions/notifications'
import type { Notification, NotificationType } from '@/lib/types/database'

// ============================================================================
// NOTIFICATION GROUPING & INTELLIGENCE
// ============================================================================

/**
 * Agrupa notificações similares
 */
export async function groupSimilarNotifications(
  notifications: Notification[]
): Promise<Notification[][]> {
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

/**
 * Prioriza notificações baseado em importância
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
 * Rate limiting: Evita spam de notificações
 */
export async function checkRateLimit(
  userId: string,
  type: NotificationType,
  timeWindowMinutes: number = 60
): Promise<boolean> {
  const supabase = createClient()

  const timeWindow = new Date()
  timeWindow.setMinutes(timeWindow.getMinutes() - timeWindowMinutes)

  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('type', type)
    .gte('created_at', timeWindow.toISOString())

  // Limite: máximo 5 notificações do mesmo tipo por hora
  return (count || 0) < 5
}

/**
 * Cria notificação inteligente (com rate limiting e agrupamento)
 */
export async function createIntelligentNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Record<string, any>,
  actionUrl?: string,
  actionLabel?: string
): Promise<Notification | null> {
  'use server'
  // Verificar rate limit
  const canSend = await checkRateLimit(userId, type)
  if (!canSend) {
    console.log(`Rate limit exceeded for notification type ${type} for user ${userId}`)
    return null
  }

  // Verificar se já existe notificação similar recente
  const supabase = createClient()
  const oneHourAgo = new Date()
  oneHourAgo.setHours(oneHourAgo.getHours() - 1)

  const { data: recentSimilar } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('created_at', oneHourAgo.toISOString())
    .limit(1)

  // Se existe notificação similar recente e não lida, não criar duplicata
  if (recentSimilar && recentSimilar.length > 0) {
    const similar = recentSimilar[0]
    if (!similar.read) {
      // Atualizar a notificação existente ao invés de criar nova
      await supabase
        .from('notifications')
        .update({
          message,
          metadata: { ...similar.metadata, ...metadata },
          updated_at: new Date().toISOString(),
        })
        .eq('id', similar.id)

      return similar as Notification
    }
  }

  // Criar nova notificação
  return await createNotification({
    user_id: userId,
    type,
    title,
    message,
    metadata: metadata || {},
    action_url: actionUrl || null,
    action_label: actionLabel || null,
  })
}

/**
 * Aprende com comportamento do usuário (simplificado)
 * Em uma versão mais avançada, isso poderia usar ML
 */
export async function learnFromUserBehavior(userId: string): Promise<void> {
  'use server'
  const supabase = createClient()

  // Buscar estatísticas de notificações do usuário
  const { data: notifications } = await supabase
    .from('notifications')
    .select('type, read, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (!notifications || notifications.length === 0) return

  // Calcular taxa de leitura por tipo
  const typeStats: Record<string, { total: number; read: number }> = {}

  for (const notif of notifications) {
    if (!typeStats[notif.type]) {
      typeStats[notif.type] = { total: 0, read: 0 }
    }
    typeStats[notif.type].total++
    if (notif.read) {
      typeStats[notif.type].read++
    }
  }

  // Atualizar preferências baseado no comportamento
  // Se usuário não lê certos tipos, podemos sugerir desabilitar
  for (const [type, stats] of Object.entries(typeStats)) {
    const readRate = stats.read / stats.total
    if (readRate < 0.2 && stats.total >= 5) {
      // Taxa de leitura muito baixa - usuário provavelmente não quer essas notificações
      console.log(`User ${userId} has low engagement with ${type} notifications (${(readRate * 100).toFixed(1)}% read rate)`)
      // Em uma versão mais avançada, poderíamos atualizar automaticamente as preferências
    }
  }
}

