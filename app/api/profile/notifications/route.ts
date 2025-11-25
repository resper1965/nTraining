import { updateNotificationPreferences } from '@/app/actions/notifications'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const preferences = await updateNotificationPreferences({
      email_enabled: body.email_enabled ?? true,
      in_app_enabled: body.in_app_enabled ?? true,
      push_enabled: body.push_enabled ?? false,
      frequency: body.frequency || 'immediate',
      quiet_hours_start: body.quiet_hours_start || null,
      quiet_hours_end: body.quiet_hours_end || null,
    })

    return NextResponse.json({ success: true, preferences })
  } catch (error: any) {
    console.error('Error updating notification preferences:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar preferências' },
      { status: 500 }
    )
  }
}

