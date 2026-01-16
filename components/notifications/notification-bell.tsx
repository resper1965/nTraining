'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useEffect, useState, useRef } from 'react'
import { getUserNotifications, getUnreadNotificationCount, markNotificationAsRead } from '@/app/actions/notifications'
import type { Notification } from '@/lib/types/database'
import Link from 'next/link'

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    
    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [])

  async function loadNotifications() {
    // Verificar se ainda está montado antes de fazer a requisição
    if (!isMountedRef.current) return
    
    try {
      const [count, notifs] = await Promise.all([
        getUnreadNotificationCount(),
        getUserNotifications({ limit: 5 }),
      ])
      
      // Verificar novamente antes de atualizar estado
      if (!isMountedRef.current) return
      
      setUnreadCount(count ?? 0)
      setNotifications(notifs ?? [])
    } catch (error) {
      // Verificar novamente antes de atualizar estado
      if (!isMountedRef.current) return
      
      // Silently fail - set defaults
      setUnreadCount(0)
      setNotifications([])
    }
  }

  async function handleMarkAsRead(notificationId: string) {
    try {
      await markNotificationAsRead(notificationId)
      await loadNotifications()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative"
          aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ''}`}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          {unreadCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              aria-label={`${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}`}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" role="dialog" aria-label="Notificações">
        <div className="bg-slate-900 border-slate-800">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-semibold text-white" id="notifications-heading">Notificações</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-slate-800/30' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${notification.title}. ${notification.message}. ${!notification.read ? 'Não lida' : 'Lida'}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleMarkAsRead(notification.id)
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(notification.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-2 border-t border-slate-800">
              <Link href="/notifications" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full text-sm">
                  Ver todas as notificações
                </Button>
              </Link>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
