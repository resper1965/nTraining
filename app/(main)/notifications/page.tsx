import { requireAuth } from '@/lib/supabase/server'
import { getUserNotifications, markAllNotificationsAsRead } from '@/app/actions/notifications'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell, Check } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  await requireAuth()

  const notifications = await getUserNotifications({ limit: 50 })

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-medium text-white mb-2">
              Notificações
            </h1>
            <p className="text-slate-400">
              {notifications.length} notificação(ões) no total
            </p>
          </div>
          {notifications.some(n => !n.read) && (
            <form action={markAllNotificationsAsRead}>
              <Button type="submit" variant="outline" size="sm">
                <Check className="h-4 w-4 mr-2" />
                Marcar todas como lidas
              </Button>
            </form>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 p-12">
            <div className="text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-medium text-white mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-slate-400 mb-6">
                Você não tem notificações no momento
              </p>
              <Link href="/dashboard">
                <Button>Ir para Dashboard</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-slate-900 border-slate-800 p-6 transition-all ${
                  !notification.read ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-slate-400 mb-3">
                          {notification.message}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(notification.created_at).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                      )}
                    </div>
                    {notification.action_url && notification.action_label && (
                      <div className="mt-4">
                        <Link href={notification.action_url}>
                          <Button size="sm" variant="outline">
                            {notification.action_label}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
