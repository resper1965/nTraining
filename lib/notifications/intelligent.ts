'use server'

import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/app/actions/notifications'
import type { Notification, NotificationType } from '@/lib/types/database'

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

