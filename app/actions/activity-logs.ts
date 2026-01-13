'use server'

import { createServerClient, requireAuth, requireSuperAdmin } from '@/lib/supabase/server'

// ============================================================================
// TYPES
// ============================================================================

export interface ActivityLog {
  id: string
  user_id: string | null
  organization_id: string | null
  event_type: string
  event_data: Record<string, any>
  ip_address: string | null
  user_agent: string | null
  created_at: string
  users?: {
    full_name: string | null
    email: string
  } | null
}

export interface ActivityLogFilters {
  eventType?: string
  userId?: string
  organizationId?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

// ============================================================================
// GET ACTIVITY LOGS
// ============================================================================

export async function getActivityLogs(
  filters: ActivityLogFilters = {}
): Promise<{ logs: ActivityLog[]; total: number }> {
  await requireSuperAdmin()
  const supabase = await createServerClient()

  try {
    const {
      eventType,
      userId,
      organizationId,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
    } = filters

    // Construir query
    let query = supabase
      .from('activity_logs')
      .select(`
        *,
        users (
          full_name,
          email
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    if (startDate) {
      query = query.gte('created_at', startDate)
    }

    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      logs: data || [],
      total: count || 0,
    }
  } catch (error) {
    console.error('Error getting activity logs:', error)
    throw new Error('Erro ao buscar logs de atividade')
  }
}

// ============================================================================
// GET ACTIVITY TYPES
// ============================================================================

export async function getActivityTypes(): Promise<string[]> {
  await requireSuperAdmin()
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('event_type')
      .order('event_type')

    if (error) throw error

    // Obter tipos únicos
    const uniqueTypes = [...new Set((data || []).map(log => log.event_type))]
    return uniqueTypes.sort()
  } catch (error) {
    console.error('Error getting activity types:', error)
    return []
  }
}

// ============================================================================
// CREATE ACTIVITY LOG
// ============================================================================

export interface CreateActivityLogParams {
  userId?: string | null
  organizationId?: string | null
  eventType: string
  eventData?: Record<string, any>
  ipAddress?: string | null
  userAgent?: string | null
}

export async function createActivityLog(params: CreateActivityLogParams): Promise<void> {
  const supabase = await createServerClient()

  try {
    const {
      userId = null,
      organizationId = null,
      eventType,
      eventData = {},
      ipAddress = null,
      userAgent = null,
    } = params

    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        organization_id: organizationId,
        event_type: eventType,
        event_data: eventData,
        ip_address: ipAddress,
        user_agent: userAgent,
      })

    if (error) throw error
  } catch (error) {
    console.error('Error creating activity log:', error)
    // Não lançar erro para não quebrar fluxo principal
  }
}

// ============================================================================
// LOG HELPERS (Funções convenientes para eventos comuns)
// ============================================================================

export async function logUserLogin(userId: string, organizationId: string | null) {
  await createActivityLog({
    userId,
    organizationId,
    eventType: 'user.login',
    eventData: { action: 'Usuário fez login' },
  })
}

export async function logUserCreated(
  createdByUserId: string,
  newUserId: string,
  userEmail: string,
  organizationId: string | null
) {
  await createActivityLog({
    userId: createdByUserId,
    organizationId,
    eventType: 'user.created',
    eventData: {
      action: 'Usuário criado',
      new_user_id: newUserId,
      new_user_email: userEmail,
    },
  })
}

export async function logCourseCreated(
  userId: string,
  courseId: string,
  courseTitle: string,
  organizationId: string | null
) {
  await createActivityLog({
    userId,
    organizationId,
    eventType: 'course.created',
    eventData: {
      action: 'Curso criado',
      course_id: courseId,
      course_title: courseTitle,
    },
  })
}

export async function logCoursePublished(
  userId: string,
  courseId: string,
  courseTitle: string,
  organizationId: string | null
) {
  await createActivityLog({
    userId,
    organizationId,
    eventType: 'course.published',
    eventData: {
      action: 'Curso publicado',
      course_id: courseId,
      course_title: courseTitle,
    },
  })
}

export async function logCourseCompleted(
  userId: string,
  courseId: string,
  courseTitle: string,
  organizationId: string | null
) {
  await createActivityLog({
    userId,
    organizationId,
    eventType: 'course.completed',
    eventData: {
      action: 'Curso completado',
      course_id: courseId,
      course_title: courseTitle,
    },
  })
}

export async function logQuizCompleted(
  userId: string,
  quizId: string,
  quizTitle: string,
  score: number,
  passed: boolean,
  organizationId: string | null
) {
  await createActivityLog({
    userId,
    organizationId,
    eventType: 'quiz.completed',
    eventData: {
      action: 'Quiz completado',
      quiz_id: quizId,
      quiz_title: quizTitle,
      score,
      passed,
    },
  })
}

export async function logCertificateIssued(
  userId: string,
  certificateId: string,
  courseTitle: string,
  organizationId: string | null
) {
  await createActivityLog({
    userId,
    organizationId,
    eventType: 'certificate.issued',
    eventData: {
      action: 'Certificado emitido',
      certificate_id: certificateId,
      course_title: courseTitle,
    },
  })
}

export async function logCourseAssigned(
  assignedByUserId: string,
  userId: string,
  courseId: string,
  courseTitle: string,
  organizationId: string | null
) {
  await createActivityLog({
    userId: assignedByUserId,
    organizationId,
    eventType: 'course.assigned',
    eventData: {
      action: 'Curso atribuído',
      assigned_to_user_id: userId,
      course_id: courseId,
      course_title: courseTitle,
    },
  })
}

export async function logPathCompleted(
  userId: string,
  pathId: string,
  pathTitle: string,
  organizationId: string | null
) {
  await createActivityLog({
    userId,
    organizationId,
    eventType: 'path.completed',
    eventData: {
      action: 'Trilha completada',
      path_id: pathId,
      path_title: pathTitle,
    },
  })
}

// ============================================================================
// GET RECENT ACTIVITY (for dashboard)
// ============================================================================

export async function getRecentActivity(limit: number = 10): Promise<ActivityLog[]> {
  await requireSuperAdmin()
  const supabase = await createServerClient()

  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        users (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error getting recent activity:', error)
    return []
  }
}
