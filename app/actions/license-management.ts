'use server'

import { createClient } from '@/lib/supabase/server'
import { requireSuperAdmin } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Add licenses to organization course access
 */
export async function addLicenses(
  organizationId: string,
  courseId: string,
  additionalLicenses: number
) {
  await requireSuperAdmin()
  const supabase = createClient()

  // Get current access
  const { data: currentAccess } = await supabase
    .from('organization_course_access')
    .select('total_licenses')
    .eq('organization_id', organizationId)
    .eq('course_id', courseId)
    .single()

  if (!currentAccess) {
    throw new Error('Course access not found')
  }

  const newTotal = (currentAccess.total_licenses || 0) + additionalLicenses

  const { data, error } = await supabase
    .from('organization_course_access')
    .update({
      total_licenses: newTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('organization_id', organizationId)
    .eq('course_id', courseId)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao adicionar licenças: ${error.message}`)
  }

  revalidatePath('/admin/licenses')
  revalidatePath(`/admin/organizations/${organizationId}/courses`)

  return data
}

/**
 * Renew course access (extend validity)
 */
export async function renewCourseAccess(
  organizationId: string,
  courseId: string,
  newValidUntil: Date
) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('organization_course_access')
    .update({
      valid_until: newValidUntil.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('organization_id', organizationId)
    .eq('course_id', courseId)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao renovar acesso: ${error.message}`)
  }

  revalidatePath('/admin/licenses')
  revalidatePath(`/admin/organizations/${organizationId}/courses`)

  return data
}

/**
 * Get license history/usage report
 */
export async function getLicenseHistory(
  organizationId: string,
  courseId?: string
) {
  await requireSuperAdmin()
  const supabase = createClient()

  let query = supabase
    .from('organization_course_access')
    .select(`
      *,
      courses (title),
      organizations (name)
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (courseId) {
    query = query.eq('course_id', courseId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Erro ao buscar histórico: ${error.message}`)
  }

  return data
}

