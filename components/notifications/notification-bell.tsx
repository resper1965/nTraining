'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { NotificationList } from './notification-list'
import { getUnreadNotificationCount } from '@/app/actions/notifications'
import { useRouter } from 'next/navigation'

export function NotificationBell() {
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Fetch unread count on mount
    getUnreadNotificationCount()
      .then(setUnreadCount)
      .catch(console.error)

    // Refresh count when popover opens
    if (open) {
      getUnreadNotificationCount()
        .then(setUnreadCount)
        .catch(console.error)
    }

    // Refresh count periodically
    const interval = setInterval(() => {
      getUnreadNotificationCount()
        .then(setUnreadCount)
        .catch(console.error)
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => router.refresh()}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 border-red-600"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0 bg-slate-900 border-slate-800" align="end">
        <NotificationList onNotificationClick={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}

