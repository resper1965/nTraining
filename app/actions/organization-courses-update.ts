'use server'

import { createClient } from '@/lib/supabase/server'
import { requireSuperAdmin } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Update organization course access settings
 */
export async function updateOrganizationCourseAccess(
  organizationId: string,
  courseId: string,
  updates: {
    access_type?: 'licensed' | 'unlimited' | 'trial'
    total_licenses?: number | null
    is_mandatory?: boolean
    auto_enroll?: boolean
    allow_certificate?: boolean
    valid_from?: Date | null
    valid_until?: Date | null
  }
) {
  await requireSuperAdmin()
  const supabase = createClient()

  const updateData: any = {}
  
  if (updates.access_type !== undefined) {
    updateData.access_type = updates.access_type
  }
  if (updates.total_licenses !== undefined) {
    updateData.total_licenses = updates.total_licenses
  }
  if (updates.is_mandatory !== undefined) {
    updateData.is_mandatory = updates.is_mandatory
  }
  if (updates.auto_enroll !== undefined) {
    updateData.auto_enroll = updates.auto_enroll
  }
  if (updates.allow_certificate !== undefined) {
    updateData.allow_certificate = updates.allow_certificate
  }
  if (updates.valid_from !== undefined) {
    updateData.valid_from = updates.valid_from?.toISOString() || null
  }
  if (updates.valid_until !== undefined) {
    updateData.valid_until = updates.valid_until?.toISOString() || null
  }

  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('organization_course_access')
    .update(updateData)
    .eq('organization_id', organizationId)
    .eq('course_id', courseId)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar acesso ao curso: ${error.message}`)
  }

  revalidatePath(`/admin/organizations/${organizationId}/courses`)
  revalidatePath(`/admin/organizations/${organizationId}`)

  return data
}

