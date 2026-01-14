'use server'

import { createClient, requireSuperAdmin } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Organization } from '@/lib/types/database'

// ============================================================================
// GET ALL ORGANIZATIONS
// ============================================================================

export interface OrganizationFilters {
  search?: string
  status?: 'active' | 'inactive' | 'all'
  sortBy?: 'name' | 'created_at' | 'users_count'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// GET PUBLIC ORGANIZATIONS (Public - for signup)
// ============================================================================

export async function getPublicOrganizations() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch organizations: ${error.message}`)
  }

  return data || []
}

export async function getAllOrganizations(filters?: OrganizationFilters) {
  await requireSuperAdmin()
  const supabase = createClient()

  let query = supabase
    .from('organizations')
    .select(`
      *,
      users:users(count)
    `)

  // Apply filters
  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,razao_social.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%`
    )
  }

  if (filters?.status && filters.status !== 'all') {
    if (filters.status === 'active') {
      query = query.eq('subscription_status', 'active')
    } else {
      query = query.or('subscription_status.is.null,subscription_status.neq.active')
    }
  }

  // Sort
  const sortBy = filters?.sortBy || 'created_at'
  const sortOrder = filters?.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch organizations: ${error.message}`)
  }

  // Transform data to include users count
  const organizations = (data || []).map((org: any) => ({
    ...org,
    users_count: Array.isArray(org.users) ? org.users[0]?.count || 0 : 0,
  }))

  return organizations as (Organization & { users_count: number })[]
}

// ============================================================================
// GET ORGANIZATION BY ID
// ============================================================================

export async function getOrganizationById(organizationId: string) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      users:users(count),
      courses:organization_course_access(count)
    `)
    .eq('id', organizationId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch organization: ${error.message}`)
  }

  return {
    ...data,
    users_count: Array.isArray(data.users) ? data.users[0]?.count || 0 : 0,
    courses_count: Array.isArray(data.courses) ? data.courses[0]?.count || 0 : 0,
  } as Organization & { users_count: number; courses_count: number }
}

// ============================================================================
// GET ORGANIZATION USERS
// ============================================================================

export async function getOrganizationUsers(organizationId: string) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch organization users: ${error.message}`)
  }

  return data || []
}

// ============================================================================
// GET ORGANIZATION COURSES
// ============================================================================

export async function getOrganizationCourses(organizationId: string) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('organization_course_access')
    .select(`
      *,
      courses:courses(*)
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch organization courses: ${error.message}`)
  }

  return data || []
}

// ============================================================================
// UPDATE ORGANIZATION
// ============================================================================

export async function updateOrganization(
  organizationId: string,
  updates: Partial<Organization>
) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('organizations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', organizationId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update organization: ${error.message}`)
  }

  revalidatePath('/admin/organizations')
  revalidatePath(`/admin/organizations/${organizationId}`)
  return data as Organization
}

// ============================================================================
// DELETE ORGANIZATION
// ============================================================================

export async function deleteOrganization(organizationId: string) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', organizationId)

  if (error) {
    throw new Error(`Failed to delete organization: ${error.message}`)
  }

  revalidatePath('/admin/organizations')
  return { success: true }
}

