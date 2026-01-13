'use server'

import { createServerClient, requireAuth, requireSuperAdmin } from '@/lib/supabase/server'

// ============================================================================
// OVERALL STATISTICS
// ============================================================================

export interface OverallStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  activePercentage: number
  totalCourses: number
  publishedCourses: number
  totalCertificates: number
  averageCompletionRate: number
}

export async function getOverallStats(): Promise<OverallStats> {
  await requireSuperAdmin()
  const supabase = await createServerClient()

  try {
    // Total de usuários
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Usuários ativos (fizeram login nos últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', thirtyDaysAgo.toISOString())

    const inactiveUsers = (totalUsers || 0) - (activeUsers || 0)
    const activePercentage = totalUsers ? Math.round((activeUsers! / totalUsers) * 100) : 0

    // Total de cursos
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    // Cursos publicados
    const { count: publishedCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    // Total de certificados
    const { count: totalCertificates } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })

    // Taxa média de conclusão
    const { data: progressData } = await supabase
      .from('user_course_progress')
      .select('completion_percentage')

    let averageCompletionRate = 0
    if (progressData && progressData.length > 0) {
      const sum = progressData.reduce((acc, curr) => acc + (curr.completion_percentage || 0), 0)
      averageCompletionRate = Math.round(sum / progressData.length)
    }

    return {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      inactiveUsers,
      activePercentage,
      totalCourses: totalCourses || 0,
      publishedCourses: publishedCourses || 0,
      totalCertificates: totalCertificates || 0,
      averageCompletionRate,
    }
  } catch (error) {
    console.error('Error getting overall stats:', error)
    throw new Error('Erro ao buscar estatísticas gerais')
  }
}

// ============================================================================
// COURSE COMPLETION STATISTICS
// ============================================================================

export interface CourseCompletionStat {
  courseId: string
  courseTitle: string
  courseSlug: string
  totalEnrolled: number
  totalCompleted: number
  completionRate: number
  averageTimeToComplete: number | null
}

export async function getCourseCompletionStats(): Promise<CourseCompletionStat[]> {
  await requireSuperAdmin()
  const supabase = await createServerClient()

  try {
    // Buscar todos os cursos publicados com progresso agregado
    // Otimizado: usa JOIN + GROUP BY para evitar N+1 queries
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('status', 'published')
      .order('title')

    if (coursesError) throw coursesError

    if (!courses || courses.length === 0) {
      return []
    }

    // Buscar todos os progressos em uma única query
    const { data: allProgress } = await supabase
      .from('user_course_progress')
      .select('course_id, completion_percentage, enrolled_at, completed_at')
      .in('course_id', courses.map(c => c.id))

    // Agregar dados por curso (client-side group by)
    const stats = courses.map((course) => {
      const courseProgress = allProgress?.filter(p => p.course_id === course.id) || []

      const totalEnrolled = courseProgress.length
      const totalCompleted = courseProgress.filter(p => (p.completion_percentage || 0) >= 100).length

      const completionRate = totalEnrolled > 0
        ? Math.round((totalCompleted / totalEnrolled) * 100)
        : 0

      // Calcular tempo médio de conclusão
      let averageTimeToComplete = null
      const completedProgress = courseProgress.filter(
        p => p.enrolled_at && p.completed_at && (p.completion_percentage || 0) >= 100
      )

      if (completedProgress.length > 0) {
        const times = completedProgress.map(p => {
          const start = new Date(p.enrolled_at!).getTime()
          const end = new Date(p.completed_at!).getTime()
          return (end - start) / (1000 * 60 * 60) // Horas
        })

        const sum = times.reduce((acc, curr) => acc + curr, 0)
        averageTimeToComplete = Math.round(sum / times.length)
      }

      return {
        courseId: course.id,
        courseTitle: course.title,
        courseSlug: course.slug,
        totalEnrolled,
        totalCompleted,
        completionRate,
        averageTimeToComplete,
      }
    })

    // Ordenar por taxa de conclusão (maior primeiro)
    return stats.sort((a, b) => b.completionRate - a.completionRate)
  } catch (error) {
    console.error('Error getting course completion stats:', error)
    throw new Error('Erro ao buscar estatísticas de conclusão de cursos')
  }
}

// ============================================================================
// COURSE POPULARITY STATISTICS
// ============================================================================

export interface CoursePopularityStat {
  courseId: string
  courseTitle: string
  courseSlug: string
  totalEnrollments: number
  totalViews: number
}

export async function getCoursePopularityStats(): Promise<CoursePopularityStat[]> {
  await requireSuperAdmin()
  const supabase = await createServerClient()

  try {
    // Buscar todos os cursos publicados
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('status', 'published')
      .order('title')

    if (coursesError) throw coursesError

    if (!courses || courses.length === 0) {
      return []
    }

    // Buscar todos os progressos em uma única query (otimizado)
    const { data: allProgress } = await supabase
      .from('user_course_progress')
      .select('course_id, completion_percentage')
      .in('course_id', courses.map(c => c.id))

    // Agregar dados por curso (client-side group by)
    const stats = courses.map((course) => {
      const courseProgress = allProgress?.filter(p => p.course_id === course.id) || []

      const totalEnrollments = courseProgress.length
      const totalViews = courseProgress.filter(p => (p.completion_percentage || 0) > 0).length

      return {
        courseId: course.id,
        courseTitle: course.title,
        courseSlug: course.slug,
        totalEnrollments,
        totalViews,
      }
    })

    // Ordenar por total de inscrições (maior primeiro)
    return stats.sort((a, b) => b.totalEnrollments - a.totalEnrollments)
  } catch (error) {
    console.error('Error getting course popularity stats:', error)
    throw new Error('Erro ao buscar estatísticas de popularidade de cursos')
  }
}

// ============================================================================
// USER ACTIVITY STATISTICS
// ============================================================================

export interface UserActivityStats {
  period: string
  activeUsers: number
  coursesCompleted: number
  certificatesIssued: number
  quizzesCompleted: number
}

export async function getUserActivityStats(days: number = 30): Promise<UserActivityStats> {
  await requireSuperAdmin()
  const supabase = await createServerClient()

  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Usuários ativos no período
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in_at', startDate.toISOString())

    // Cursos completados no período
    const { count: coursesCompleted } = await supabase
      .from('user_course_progress')
      .select('*', { count: 'exact', head: true })
      .gte('completed_at', startDate.toISOString())
      .not('completed_at', 'is', null)

    // Certificados emitidos no período
    const { count: certificatesIssued } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .gte('issued_at', startDate.toISOString())

    // Quizzes completados no período
    const { count: quizzesCompleted } = await supabase
      .from('user_quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .gte('completed_at', startDate.toISOString())
      .not('completed_at', 'is', null)

    let period = `Últimos ${days} dias`
    if (days === 7) period = 'Últimos 7 dias'
    if (days === 30) period = 'Últimos 30 dias'
    if (days === 90) period = 'Últimos 90 dias'
    if (days === 365) period = 'Último ano'

    return {
      period,
      activeUsers: activeUsers || 0,
      coursesCompleted: coursesCompleted || 0,
      certificatesIssued: certificatesIssued || 0,
      quizzesCompleted: quizzesCompleted || 0,
    }
  } catch (error) {
    console.error('Error getting user activity stats:', error)
    throw new Error('Erro ao buscar estatísticas de atividade de usuários')
  }
}

// ============================================================================
// EXPORT DATA TO CSV
// ============================================================================

export interface ExportDataRow {
  [key: string]: string | number | null
}

export function convertToCSV(data: ExportDataRow[]): string {
  if (data.length === 0) return ''

  // Cabeçalhos
  const headers = Object.keys(data[0])
  const headerRow = headers.join(',')

  // Linhas de dados
  const rows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      // Escapar valores com vírgula ou aspas
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  })

  return [headerRow, ...rows].join('\n')
}

export async function exportCourseCompletionData(): Promise<string> {
  const stats = await getCourseCompletionStats()

  const data: ExportDataRow[] = stats.map(stat => ({
    'Curso': stat.courseTitle,
    'Total Inscritos': stat.totalEnrolled,
    'Total Completaram': stat.totalCompleted,
    'Taxa de Conclusão (%)': stat.completionRate,
    'Tempo Médio (horas)': stat.averageTimeToComplete || 'N/A',
  }))

  return convertToCSV(data)
}

export async function exportCoursePopularityData(): Promise<string> {
  const stats = await getCoursePopularityStats()

  const data: ExportDataRow[] = stats.map(stat => ({
    'Curso': stat.courseTitle,
    'Total Inscrições': stat.totalEnrollments,
    'Total Visualizações': stat.totalViews,
  }))

  return convertToCSV(data)
}
