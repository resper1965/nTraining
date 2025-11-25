import { updateNotificationPreferences } from '@/app/actions/notifications'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const formData = await request.formData()

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
    quiet_hours_start: quietHoursStart || null,
    quiet_hours_end: quietHoursEnd || null,
  })

  redirect('/profile/notifications?success=true')
}

