'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { NotificationPreferences } from '@/lib/types/database'

interface NotificationPreferencesFormProps {
  initialPreferences: NotificationPreferences | null
}

export function NotificationPreferencesForm({
  initialPreferences,
}: NotificationPreferencesFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email_enabled: initialPreferences?.email_enabled ?? true,
    in_app_enabled: initialPreferences?.in_app_enabled ?? true,
    push_enabled: initialPreferences?.push_enabled ?? false,
    frequency: initialPreferences?.frequency || 'immediate',
    quiet_hours_start: initialPreferences?.quiet_hours_start || '',
    quiet_hours_end: initialPreferences?.quiet_hours_end || '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Criar um objeto com os dados do formulário
      const data = {
        email_enabled: formData.get('email_enabled') === 'on',
        in_app_enabled: formData.get('in_app_enabled') === 'on',
        push_enabled: formData.get('push_enabled') === 'on',
        frequency: formData.get('frequency'),
        quiet_hours_start: formData.get('quiet_hours_start') || null,
        quiet_hours_end: formData.get('quiet_hours_end') || null,
      }

      const response = await fetch('/api/profile/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Preferências atualizadas com sucesso!')
        router.refresh()
      } else {
        throw new Error('Erro ao atualizar preferências')
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Erro ao atualizar preferências. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notification Types */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-xl text-white">
            Tipos de Notificação
          </CardTitle>
          <CardDescription>
            Escolha como você deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="email_enabled">Email</Label>
              <p className="text-sm text-slate-400">
                Receba notificações por email
              </p>
            </div>
            <Switch
              id="email_enabled"
              name="email_enabled"
              checked={formData.email_enabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, email_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="in_app_enabled">Notificações In-App</Label>
              <p className="text-sm text-slate-400">
                Receba notificações dentro da plataforma
              </p>
            </div>
            <Switch
              id="in_app_enabled"
              name="in_app_enabled"
              checked={formData.in_app_enabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, in_app_enabled: checked })
              }
            />
            <input
              type="hidden"
              name="in_app_enabled"
              value={formData.in_app_enabled ? 'on' : 'off'}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="push_enabled">Notificações Push</Label>
              <p className="text-sm text-slate-400">
                Receba notificações push no navegador (em breve)
              </p>
            </div>
            <Switch
              id="push_enabled"
              name="push_enabled"
              checked={formData.push_enabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, push_enabled: checked })
              }
              disabled
            />
            <input
              type="hidden"
              name="push_enabled"
              value={formData.push_enabled ? 'on' : 'off'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Frequency */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-xl text-white">
            Frequência
          </CardTitle>
          <CardDescription>
            Com que frequência você deseja receber notificações por email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequência de Email</Label>
            <Select
              name="frequency"
              value={formData.frequency}
              onValueChange={(value: any) =>
                setFormData({ ...formData, frequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Imediato</SelectItem>
                <SelectItem value="daily">Resumo Diário</SelectItem>
                <SelectItem value="weekly">Resumo Semanal</SelectItem>
                <SelectItem value="never">Nunca</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-xl text-white">
            Horários de Silêncio
          </CardTitle>
          <CardDescription>
            Configure horários em que você não deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiet_hours_start">Início</Label>
              <Input
                id="quiet_hours_start"
                name="quiet_hours_start"
                type="time"
                value={formData.quiet_hours_start}
                onChange={(e) =>
                  setFormData({ ...formData, quiet_hours_start: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiet_hours_end">Fim</Label>
              <Input
                id="quiet_hours_end"
                name="quiet_hours_end"
                type="time"
                value={formData.quiet_hours_end}
                onChange={(e) =>
                  setFormData({ ...formData, quiet_hours_end: e.target.value })
                }
              />
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Deixe em branco para receber notificações a qualquer hora
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Preferências'}
        </Button>
      </div>
    </form>
  )
}

