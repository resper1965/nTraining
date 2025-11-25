import { requireAuth } from '@/lib/supabase/server'
import { getNotificationPreferences, updateNotificationPreferences } from '@/app/actions/notifications'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NotificationPreferencesForm } from '@/components/profile/notification-preferences-form'

export const dynamic = 'force-dynamic'

export default async function NotificationPreferencesPage() {
  await requireAuth()

  const preferences = await getNotificationPreferences().catch(() => null)

  async function handleUpdate(formData: FormData) {
    'use server'

    const emailEnabled = formData.get('email_enabled') === 'on'
    const inAppEnabled = formData.get('in_app_enabled') === 'on'
    const pushEnabled = formData.get('push_enabled') === 'on'
    const frequency = formData.get('frequency') as 'immediate' | 'daily' | 'weekly' | 'never'
    const quietHoursStart = formData.get('quiet_hours_start') as string || null
    const quietHoursEnd = formData.get('quiet_hours_end') as string || null

    await updateNotificationPreferences({
      email_enabled: emailEnabled,
      in_app_enabled: inAppEnabled,
      push_enabled: pushEnabled,
      frequency: frequency,
      quiet_hours_start: quietHoursStart,
      quiet_hours_end: quietHoursEnd,
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-white mb-2">
            Preferências de Notificação
          </h1>
          <p className="text-slate-400">
            Configure como e quando você deseja receber notificações
          </p>
        </div>
      </div>

      <NotificationPreferencesForm initialPreferences={preferences} />
    </div>
  )
}

