'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Notification } from '@/lib/types/database'
import {
  BookOpen,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  FileText,
  MessageSquare,
  Bell,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
}

const iconMap: Record<string, any> = {
  course_assigned: BookOpen,
  course_deadline_approaching: Clock,
  course_deadline_passed: AlertCircle,
  course_completed: CheckCircle2,
  certificate_available: Award,
  new_content: FileText,
  quiz_available: MessageSquare,
  quiz_result: MessageSquare,
  welcome: Bell,
  system: Bell,
  organization_update: Building2,
}

const colorMap: Record<string, string> = {
  course_assigned: 'text-blue-400',
  course_deadline_approaching: 'text-yellow-400',
  course_deadline_passed: 'text-red-400',
  course_completed: 'text-green-400',
  certificate_available: 'text-purple-400',
  new_content: 'text-cyan-400',
  quiz_available: 'text-indigo-400',
  quiz_result: 'text-indigo-400',
  welcome: 'text-primary',
  system: 'text-slate-400',
  organization_update: 'text-orange-400',
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = iconMap[notification.type] || Bell
  const iconColor = colorMap[notification.type] || 'text-slate-400'

  const content = (
    <div
      className={cn(
        'p-4 hover:bg-slate-800/50 transition-colors cursor-pointer',
        !notification.read && 'bg-slate-800/30'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg bg-slate-800', iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-white text-sm line-clamp-1">
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
            {notification.action_url && notification.action_label && (
              <span className="text-xs text-primary font-medium">
                {notification.action_label} →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (notification.action_url) {
    return (
      <Link href={notification.action_url} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return content
}

