'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  Notification,
  NotificationType,
  NotificationFrequency,
  CreateNotificationData,
  NotificationPreferences,
} from '@/lib/types/database'

// ============================================================================
// CREATE NOTIFICATION
// ============================================================================

export async function createNotification(data: CreateNotificationData) {
  const supabase = createClient()

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata || {},
      action_url: data.action_url || null,
      action_label: data.action_label || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    throw new Error(`Failed to create notification: ${error.message}`)
  }

  return notification as Notification
}

// ============================================================================
// CREATE NOTIFICATION FOR MULTIPLE USERS
// ============================================================================

export async function createNotificationForUsers(
  userIds: string[],
  data: Omit<CreateNotificationData, 'user_id'>
) {
  const supabase = createClient()

  const notifications = userIds.map((userId) => ({
    user_id: userId,
    type: data.type,
    title: data.title,
    message: data.message,
    metadata: data.metadata || {},
    action_url: data.action_url || null,
    action_label: data.action_label || null,
  }))

  const { data: createdNotifications, error } = await supabase
    .from('notifications')
    .insert(notifications)
    .select()

  if (error) {
    console.error('Error creating notifications:', error)
    throw new Error(`Failed to create notifications: ${error.message}`)
  }

  return createdNotifications as Notification[]
}

// ============================================================================
// GET USER NOTIFICATIONS
// ============================================================================

export async function getUserNotifications(options?: {
  limit?: number
  unreadOnly?: boolean
  type?: NotificationType
}) {
  const supabase = createClient()
  const user = await requireAuth()

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (options?.unreadOnly) {
    query = query.eq('read', false)
  }

  if (options?.type) {
    query = query.eq('type', options.type)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`)
  }

  return data as Notification[]
}

// ============================================================================
// GET UNREAD COUNT
// ============================================================================

export async function getUnreadNotificationCount() {
  const supabase = createClient()
  const user = await requireAuth()

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) {
    throw new Error(`Failed to fetch unread count: ${error.message}`)
  }

  return count || 0
}

// ============================================================================
// MARK NOTIFICATION AS READ
// ============================================================================

export async function markNotificationAsRead(notificationId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`)
  }

  revalidatePath('/')
  return data as Notification
}

// ============================================================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================================================

export async function markAllNotificationsAsRead() {
  const supabase = createClient()
  const user = await requireAuth()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`)
  }

  revalidatePath('/notifications')
  revalidatePath('/')
}

// ============================================================================
// DELETE NOTIFICATION
// ============================================================================

export async function deleteNotification(notificationId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Failed to delete notification: ${error.message}`)
  }

  revalidatePath('/')
  return { success: true }
}

// ============================================================================
// GET NOTIFICATION PREFERENCES
// ============================================================================

export async function getNotificationPreferences() {
  const supabase = createClient()
  const user = await requireAuth()

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found, which is ok (will create default)
    throw new Error(`Failed to fetch notification preferences: ${error.message}`)
  }

  // Se não existir, retornar preferências padrão
  if (!data) {
    return {
      id: '',
      user_id: user.id,
      email_enabled: true,
      in_app_enabled: true,
      push_enabled: false,
      frequency: 'immediate' as NotificationFrequency,
      quiet_hours_start: null,
      quiet_hours_end: null,
      preferences: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as NotificationPreferences
  }

  return data as NotificationPreferences
}

// ============================================================================
// UPDATE NOTIFICATION PREFERENCES
// ============================================================================

export async function updateNotificationPreferences(
  preferences: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()
  const user = await requireAuth()

  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert(
      {
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update notification preferences: ${error.message}`)
  }

  revalidatePath('/profile')
  return data as NotificationPreferences
}

