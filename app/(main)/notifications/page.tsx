import { requireAuth } from '@/lib/supabase/server'
import { getUserNotifications } from '@/app/actions/notifications'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NotificationItem } from '@/components/notifications/notification-item'
import { markAllNotificationsAsRead } from '@/app/actions/notifications'
import { Button } from '@/components/ui/button'
import { CheckCheck, Bell } from 'lucide-react'
import { MarkAllReadButton } from '@/components/notifications/mark-all-read-button'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  await requireAuth()

  const notifications = await getUserNotifications().catch(() => [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-white mb-2">
            Notificações
          </h1>
          <p className="text-slate-400">
            {unreadCount > 0
              ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}`
              : 'Todas as notificações foram lidas'}
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Nenhuma notificação</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`bg-slate-900 border-slate-800 ${
                !notification.read ? 'bg-slate-800/30' : ''
              }`}
            >
              <CardContent className="p-0">
                <NotificationItem notification={notification} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

