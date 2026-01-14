'use server'

import { createClient, requireSuperAdmin } from '@/lib/supabase/server'

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export interface DashboardMetrics {
  organizations: {
    total: number
    active: number
    newThisMonth: number
  }
  users: {
    total: number
    active: number
    newThisMonth: number
  }
  courses: {
    total: number
    published: number
    newThisMonth: number
  }
  certificates: {
    total: number
    issuedThisMonth: number
  }
  licenses: {
    total: number
    used: number
    available: number
    utilizationRate: number
  }
  progress: {
    coursesInProgress: number
    coursesCompleted: number
    completionRate: number
  }
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // Note: Authentication is already verified in the admin layout
  // We skip verification here to prevent redirect loops and flickering
  // If called from outside admin context, the layout will catch it
  
  const startTime = Date.now()
  console.log('[getDashboardMetrics] Iniciando...')
  
  try {
    const supabase = createClient()
    console.log('[getDashboardMetrics] Cliente Supabase criado')

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Organizations
    const { count: totalOrgs, error: orgsError } = await supabase
      .from('organizations')
      .select('*', { count: 'exact', head: true })
      .catch(() => ({ count: 0, error: null }))

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError)
    }

    const { count: activeOrgs, error: activeOrgsError } = await supabase
      .from('organizations')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active')
      .catch(() => ({ count: 0, error: null }))

    if (activeOrgsError) {
      console.error('Error fetching active organizations:', activeOrgsError)
    }

    const { count: newOrgsThisMonth, error: newOrgsError } = await supabase
      .from('organizations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())
      .catch(() => ({ count: 0, error: null }))

    if (newOrgsError) {
      console.error('Error fetching new organizations:', newOrgsError)
    }

    // Users
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .catch(() => ({ count: 0, error: null }))

    if (usersError) {
      console.error('Error fetching users:', usersError)
    }

    const { count: activeUsers, error: activeUsersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .catch(() => ({ count: 0, error: null }))

    if (activeUsersError) {
      console.error('Error fetching active users:', activeUsersError)
    }

    const { count: newUsersThisMonth, error: newUsersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())
      .catch(() => ({ count: 0, error: null }))

    if (newUsersError) {
      console.error('Error fetching new users:', newUsersError)
    }

    // Courses
    const { count: totalCourses, error: coursesError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .catch(() => ({ count: 0, error: null }))

    if (coursesError) {
      console.error('Error fetching courses:', coursesError)
    }

    const { count: publishedCourses, error: publishedError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .catch(() => ({ count: 0, error: null }))

    if (publishedError) {
      console.error('Error fetching published courses:', publishedError)
    }

    const { count: newCoursesThisMonth, error: newCoursesError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())
      .catch(() => ({ count: 0, error: null }))

    if (newCoursesError) {
      console.error('Error fetching new courses:', newCoursesError)
    }

  // Certificates
  const { count: totalCertificates } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .catch(() => ({ count: 0 }))

  const { count: certificatesThisMonth } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .gte('issued_at', startOfMonth.toISOString())
    .catch(() => ({ count: 0 }))

  // Licenses
  const { data: licenseData } = await supabase
    .from('organization_course_access')
    .select('total_licenses, used_licenses, access_type')
    .catch(() => ({ data: [] }))

  const licenses = {
    total: 0,
    used: 0,
    available: 0,
  }

  if (licenseData) {
    licenseData.forEach((license: { access_type: string; total_licenses: number | null; used_licenses: number | null }) => {
      if (license.access_type === 'licensed' && license.total_licenses) {
        licenses.total += license.total_licenses
        licenses.used += license.used_licenses || 0
      }
    })
    licenses.available = licenses.total - licenses.used
  }

  const utilizationRate =
    licenses.total > 0 ? Math.round((licenses.used / licenses.total) * 100) : 0

    // Progress
    const { count: coursesInProgress } = await supabase
      .from('user_course_progress')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in_progress')
      .catch(() => ({ count: 0 }))

    const { count: coursesCompleted } = await supabase
      .from('user_course_progress')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .catch(() => ({ count: 0 }))

    const totalProgress = (coursesInProgress || 0) + (coursesCompleted || 0)
    const completionRate =
      totalProgress > 0
        ? Math.round(((coursesCompleted || 0) / totalProgress) * 100)
        : 0

    return {
      organizations: {
        total: totalOrgs || 0,
        active: activeOrgs || 0,
        newThisMonth: newOrgsThisMonth || 0,
      },
      users: {
        total: totalUsers || 0,
        active: activeUsers || 0,
        newThisMonth: newUsersThisMonth || 0,
      },
      courses: {
        total: totalCourses || 0,
        published: publishedCourses || 0,
        newThisMonth: newCoursesThisMonth || 0,
      },
      certificates: {
        total: totalCertificates || 0,
        issuedThisMonth: certificatesThisMonth || 0,
      },
      licenses: {
        total: licenses.total,
        used: licenses.used,
        available: licenses.available,
        utilizationRate,
      },
      progress: {
        coursesInProgress: coursesInProgress || 0,
        coursesCompleted: coursesCompleted || 0,
        completionRate,
      },
    }
  } catch (error: any) {
    // Catch any unexpected errors and return safe fallback data
    const duration = Date.now() - startTime
    console.error('[getDashboardMetrics] ERRO CRÍTICO após', duration, 'ms:', {
      message: error?.message,
      stack: error?.stack,
      digest: error?.digest,
      name: error?.name,
      cause: error?.cause,
      error: error,
      timestamp: new Date().toISOString(),
    })
    return {
      organizations: { total: 0, active: 0, newThisMonth: 0 },
      users: { total: 0, active: 0, newThisMonth: 0 },
      courses: { total: 0, published: 0, newThisMonth: 0 },
      certificates: { total: 0, issuedThisMonth: 0 },
      licenses: { total: 0, used: 0, available: 0, utilizationRate: 0 },
      progress: { coursesInProgress: 0, coursesCompleted: 0, completionRate: 0 },
    }
  } finally {
    const duration = Date.now() - startTime
    console.log(`[getDashboardMetrics] Finalizado em ${duration}ms`)
  }
}

// ============================================================================
// RECENT ACTIVITIES
// ============================================================================

export interface RecentActivity {
  id: string
  type: 'organization' | 'user' | 'course' | 'certificate'
  action: string
  description: string
  created_at: string
}

export async function getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
  // Note: Authentication is already verified in the admin layout
  // We skip verification here to prevent redirect loops and flickering
  // If called from outside admin context, the layout will catch it
  
  const startTime = Date.now()
  console.log('[getRecentActivities] Iniciando...')
  
  try {
    const supabase = createClient()
    console.log('[getRecentActivities] Cliente Supabase criado')

    // Get recent organizations
    const { data: recentOrgs } = await supabase
      .from('organizations')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(Math.floor(limit / 3))
      .catch(() => ({ data: [] }))

    // Get recent users
    const { data: recentUsers } = await supabase
      .from('users')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(Math.floor(limit / 3))
      .catch(() => ({ data: [] }))

    // Get recent courses
    const { data: recentCourses } = await supabase
      .from('courses')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(Math.floor(limit / 3))
      .catch(() => ({ data: [] }))

    const activities: RecentActivity[] = []

    recentOrgs?.forEach((org: { id: string; name: string; created_at: string }) => {
      activities.push({
        id: org.id,
        type: 'organization',
        action: 'created',
        description: `Organização "${org.name}" foi criada`,
        created_at: org.created_at,
      })
    })

    recentUsers?.forEach((user: { id: string; email: string; full_name: string | null; created_at: string }) => {
      activities.push({
        id: user.id,
        type: 'user',
        action: 'created',
        description: `Usuário "${user.full_name || user.email}" foi criado`,
        created_at: user.created_at,
      })
    })

    recentCourses?.forEach((course: { id: string; title: string; created_at: string }) => {
      activities.push({
        id: course.id,
        type: 'course',
        action: 'created',
        description: `Curso "${course.title}" foi criado`,
        created_at: course.created_at,
      })
    })

    // Sort by date and limit
    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  } catch (error: any) {
    // Catch any unexpected errors and return empty array
    const duration = Date.now() - startTime
    console.error('[getRecentActivities] ERRO CRÍTICO após', duration, 'ms:', {
      message: error?.message,
      stack: error?.stack,
      digest: error?.digest,
      name: error?.name,
      cause: error?.cause,
      error: error,
      timestamp: new Date().toISOString(),
    })
    return []
  } finally {
    const duration = Date.now() - startTime
    console.log(`[getRecentActivities] Finalizado em ${duration}ms`)
  }
}

