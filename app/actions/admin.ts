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
  await requireSuperAdmin()
  const supabase = createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Organizations
  const { count: totalOrgs } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })

  const { count: activeOrgs } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  const { count: newOrgsThisMonth } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())

  // Users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: activeUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: newUsersThisMonth } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())

  // Courses
  const { count: totalCourses } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })

  const { count: publishedCourses } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: newCoursesThisMonth } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())

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
  await requireSuperAdmin()
  const supabase = createClient()

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
}

