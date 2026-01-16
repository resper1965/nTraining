'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/app/actions/notifications'
import { prioritizeNotifications } from '@/lib/notifications/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { NotificationItem } from './notification-item'
import { Bell, CheckCheck } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface NotificationListProps {
  onNotificationClick?: () => void
}

function NotificationListComponent({ onNotificationClick }: NotificationListProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getUserNotifications({ limit: 20 })
      // Priorizar notificações (mais importantes primeiro)
      const prioritized = prioritizeNotifications(data)
      setNotifications(prioritized)
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      setMarkingAll(true)
      await markAllNotificationsAsRead()
      await loadNotifications()
      toast.success('Todas as notificações marcadas como lidas')
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Erro ao marcar notificações como lidas')
    } finally {
      setMarkingAll(false)
    }
  }, [loadNotifications])

  const handleNotificationClick = useCallback(async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      try {
        await markNotificationAsRead(notificationId)
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        )
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }
    if (onNotificationClick) {
      onNotificationClick()
    }
  }, [onNotificationClick])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-white" />
          <h3 className="font-display text-lg font-medium text-white">
            Notificações
          </h3>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-white">
              {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="text-xs"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Marcar todas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-slate-400">Carregando notificações...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification.id, notification.read)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-slate-800">
          <Link href="/notifications" className="w-full">
            <Button variant="outline" className="w-full" size="sm">
              Ver todas as notificações
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

// Memoizar componente para evitar re-renders desnecessários
export const NotificationList = memo(NotificationListComponent)
NotificationList.displayName = 'NotificationList'
