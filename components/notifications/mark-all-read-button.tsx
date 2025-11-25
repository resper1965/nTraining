'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { markAllNotificationsAsRead } from '@/app/actions/notifications'
import { Button } from '@/components/ui/button'
import { CheckCheck } from 'lucide-react'
import { toast } from 'sonner'

export function MarkAllReadButton() {
  const router = useRouter()
  const [isMarking, setIsMarking] = useState(false)

  const handleMarkAll = async () => {
    try {
      setIsMarking(true)
      await markAllNotificationsAsRead()
      toast.success('Todas as notificações marcadas como lidas')
      router.refresh()
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Erro ao marcar notificações como lidas')
    } finally {
      setIsMarking(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleMarkAll}
      disabled={isMarking}
    >
      <CheckCheck className="h-4 w-4 mr-2" />
      {isMarking ? 'Marcando...' : 'Marcar todas como lidas'}
    </Button>
  )
}

