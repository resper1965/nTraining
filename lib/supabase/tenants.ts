'use server'

import { createClient, requireAuth, requireSuperAdmin, isSuperAdmin } from './server'
import type { Organization } from '@/lib/types/database'

// ============================================================================
// TENANT MANAGEMENT
// ============================================================================

export interface TenantFormData {
  name: string
  slug: string
  industry?: string
  employee_count?: number
  max_users?: number
}

/**
 * Get all tenants (superadmin only) or user's tenants
 */
export async function getTenants() {
  const supabase = createClient()
  const user = await requireAuth()

  // Superadmins see all tenants
  if (user.is_superadmin) {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch tenants: ${error.message}`)
    }

    return data as Organization[]
  }

  // Regular users see only their tenants
  const { data, error } = await supabase
    .from('tenant_users')
    .select('tenant_id, organizations(*)')
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Failed to fetch user tenants: ${error.message}`)
  }

  return (data || []).map((item: any) => item.organizations) as Organization[]
}

/**
 * Get tenant by ID
 */
export async function getTenantById(tenantId: string) {
  const supabase = createClient()
  const user = await requireAuth()
  const isSuper = await isSuperAdmin()

  let query = supabase
    .from('organizations')
    .select('*')
    .eq('id', tenantId)
    .maybeSingle()

  // If not superadmin, verify user belongs to tenant
  if (!isSuper) {
    const { data: membership } = await supabase
      .from('tenant_users')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!membership) {
      throw new Error('Unauthorized: You do not have access to this tenant')
    }
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch tenant: ${error.message}`)
  }

  if (!data) {
    throw new Error('Tenant not found')
  }

  return data as Organization
}

/**
 * Create a new tenant (superadmin only)
 */
export async function createTenant(data: TenantFormData) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data: tenant, error } = await supabase
    .from('organizations')
    .insert({
      name: data.name,
      slug: data.slug,
      industry: data.industry,
      employee_count: data.employee_count,
      max_users: data.max_users || 50,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create tenant: ${error.message}`)
  }

  return tenant as Organization
}

/**
 * Update tenant (superadmin only)
 */
export async function updateTenant(tenantId: string, data: Partial<TenantFormData>) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data: tenant, error } = await supabase
    .from('organizations')
    .update({
      name: data.name,
      slug: data.slug,
      industry: data.industry,
      employee_count: data.employee_count,
      max_users: data.max_users,
    })
    .eq('id', tenantId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update tenant: ${error.message}`)
  }

  return tenant as Organization
}

/**
 * Add user to tenant (superadmin only)
 */
export async function addUserToTenant(tenantId: string, userId: string, role: string = 'member') {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('tenant_users')
    .insert({
      tenant_id: tenantId,
      user_id: userId,
      role,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to add user to tenant: ${error.message}`)
  }

  return data
}

/**
 * Remove user from tenant (superadmin only)
 */
export async function removeUserFromTenant(tenantId: string, userId: string) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { error } = await supabase
    .from('tenant_users')
    .delete()
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to remove user from tenant: ${error.message}`)
  }
}

/**
 * Get users in a tenant
 */
export async function getTenantUsers(tenantId: string) {
  const supabase = createClient()
  const user = await requireAuth()
  const isSuper = await isSuperAdmin()

  // Verify access
  if (!isSuper) {
    const { data: membership } = await supabase
      .from('tenant_users')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!membership) {
      throw new Error('Unauthorized: You do not have access to this tenant')
    }
  }

  const { data, error } = await supabase
    .from('tenant_users')
    .select('*, users(*)')
    .eq('tenant_id', tenantId)

  if (error) {
    throw new Error(`Failed to fetch tenant users: ${error.message}`)
  }

  return data
}

