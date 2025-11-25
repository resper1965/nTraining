'use server'

import { createClient, requireAuth, requireSuperAdmin, requireRole } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  OrganizationCourseAccess,
  CourseCustomization,
  OrganizationCourseAssignment,
  CourseAccessType,
  AssignmentType
} from '@/lib/types/database'

// ============================================================================
// ASSIGN COURSE TO ORGANIZATION (Disponibilizar curso)
// ============================================================================

export interface AssignCourseConfig {
  accessType: CourseAccessType
  totalLicenses?: number | null
  validUntil?: Date | null
  isMandatory?: boolean
  autoEnroll?: boolean
  allowCertificate?: boolean
  customTitle?: string | null
  customDescription?: string | null
  customThumbnailUrl?: string | null
}

export async function assignCourseToOrganization(
  organizationId: string,
  courseId: string,
  config: AssignCourseConfig
) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('organization_course_access')
    .insert({
      organization_id: organizationId,
      course_id: courseId,
      access_type: config.accessType,
      total_licenses: config.totalLicenses ?? null,
      valid_until: config.validUntil?.toISOString() ?? null,
      is_mandatory: config.isMandatory ?? false,
      auto_enroll: config.autoEnroll ?? false,
      allow_certificate: config.allowCertificate ?? true,
      custom_title: config.customTitle ?? null,
      custom_description: config.customDescription ?? null,
      custom_thumbnail_url: config.customThumbnailUrl ?? null,
      assigned_by: (await requireAuth()).id,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to assign course to organization: ${error.message}`)
  }

  // Se for obrigatório e auto-enroll, atribuir a todos os usuários ativos
  if (config.isMandatory && config.autoEnroll) {
    await assignMandatoryCourseToAllUsers(organizationId, courseId)
  }

  revalidatePath('/admin/tenants')
  revalidatePath(`/admin/tenants/${organizationId}/edit`)
  return data as OrganizationCourseAccess
}

// ============================================================================
// GET ORGANIZATION COURSES (Cursos disponíveis para organização)
// ============================================================================

export async function getOrganizationCourses(
  organizationId: string,
  filters?: {
    mandatoryOnly?: boolean
    availableOnly?: boolean
  }
) {
  const supabase = createClient()
  const user = await requireAuth()

  // Verificar se usuário tem acesso à organização
  if (!user.is_superadmin && user.organization_id !== organizationId) {
    throw new Error('Unauthorized: You do not have access to this organization')
  }

  let query = supabase
    .from('organization_course_access')
    .select(`
      *,
      courses (
        *,
        modules (
          *,
          lessons (*)
        )
      )
    `)
    .eq('organization_id', organizationId)

  if (filters?.mandatoryOnly) {
    query = query.eq('is_mandatory', true)
  }

  if (filters?.availableOnly) {
    query = query.or('valid_until.is.null,valid_until.gt.now()')
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch organization courses: ${error.message}`)
  }

  return data as (OrganizationCourseAccess & {
    courses: any
  })[]
}

// ============================================================================
// GET USER MANDATORY COURSES (Cursos obrigatórios do usuário)
// ============================================================================

export async function getUserMandatoryCourses(userId?: string) {
  const supabase = createClient()
  const currentUser = await requireAuth()
  const targetUserId = userId || currentUser.id

  // Verificar se pode ver cursos de outro usuário
  if (targetUserId !== currentUser.id && !currentUser.is_superadmin) {
    throw new Error('Unauthorized')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', targetUserId)
    .single()

  if (!userData?.organization_id) {
    return []
  }

  const { data, error } = await supabase
    .from('organization_course_assignments')
    .select(`
      *,
      courses (
        *,
        modules (
          *,
          lessons (*)
        )
      )
    `)
    .eq('user_id', targetUserId)
    .eq('is_mandatory', true)

  if (error) {
    throw new Error(`Failed to fetch mandatory courses: ${error.message}`)
  }

  return data as (OrganizationCourseAssignment & {
    courses: any
  })[]
}

// ============================================================================
// CHECK LICENSE AVAILABILITY (Verificar disponibilidade de licenças)
// ============================================================================

export async function checkLicenseAvailability(
  organizationId: string,
  courseId: string
) {
  const supabase = createClient()
  await requireAuth()

  const { data, error } = await supabase
    .from('organization_course_access')
    .select('total_licenses, used_licenses, access_type, valid_until')
    .eq('organization_id', organizationId)
    .eq('course_id', courseId)
    .single()

  if (error || !data) {
    return {
      available: false,
      totalLicenses: null,
      usedLicenses: 0,
      availableLicenses: 0,
      message: 'Course not available for this organization'
    }
  }

  // Verificar validade
  if (data.valid_until && new Date(data.valid_until) < new Date()) {
    return {
      available: false,
      totalLicenses: data.total_licenses,
      usedLicenses: data.used_licenses,
      availableLicenses: 0,
      message: 'Course access has expired'
    }
  }

  // Ilimitado
  if (data.access_type === 'unlimited' || data.total_licenses === null) {
    return {
      available: true,
      totalLicenses: null,
      usedLicenses: data.used_licenses,
      availableLicenses: null,
      message: 'Unlimited licenses'
    }
  }

  // Licenciado
  const available = (data.total_licenses - data.used_licenses) > 0
  const availableLicenses = Math.max(0, data.total_licenses - data.used_licenses)

  return {
    available,
    totalLicenses: data.total_licenses,
    usedLicenses: data.used_licenses,
    availableLicenses,
    message: available
      ? `${availableLicenses} licenses available`
      : 'No licenses available'
  }
}

// ============================================================================
// CUSTOMIZE COURSE (Personalizar curso)
// ============================================================================

export interface CourseCustomizationData {
  customModules?: any
  customLessons?: any
  customBranding?: Record<string, any>
  completionRequirements?: Record<string, any>
  certificateTemplateId?: string | null
}

export async function customizeCourse(
  organizationId: string,
  courseId: string,
  customizations: CourseCustomizationData
) {
  const user = await requireAuth()

  // Verificar permissões
  if (!user.is_superadmin && user.organization_id !== organizationId) {
    throw new Error('Unauthorized: You do not have access to customize courses for this organization')
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from('course_customizations')
    .upsert(
      {
        organization_id: organizationId,
        course_id: courseId,
        custom_modules: customizations.customModules ?? null,
        custom_lessons: customizations.customLessons ?? null,
        custom_branding: customizations.customBranding ?? {},
        completion_requirements: customizations.completionRequirements ?? {},
        certificate_template_id: customizations.certificateTemplateId ?? null,
        is_active: true,
      },
      { onConflict: 'organization_id,course_id' }
    )
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to customize course: ${error.message}`)
  }

  revalidatePath('/admin/tenants')
  revalidatePath(`/admin/tenants/${organizationId}/edit`)
  return data as CourseCustomization
}

// ============================================================================
// ASSIGN COURSE TO USER (Atribuir curso a usuário específico)
// ============================================================================

export async function assignCourseToUser(
  organizationId: string,
  courseId: string,
  userId: string,
  config?: {
    isMandatory?: boolean
    deadline?: Date | null
  }
) {
  const user = await requireAuth()

  // Verificar permissões
  const isSuperAdmin = user.is_superadmin
  const isOrgManager = user.role === 'org_manager' && user.organization_id === organizationId

  if (!isSuperAdmin && !isOrgManager) {
    throw new Error('Unauthorized: Insufficient permissions')
  }

  const supabase = createClient()

  // Verificar se curso está disponível para organização
  const { data: access } = await supabase
    .from('organization_course_access')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('course_id', courseId)
    .single()

  if (!access) {
    throw new Error('Course is not available for this organization')
  }

  // Verificar licenças disponíveis
  const licenseCheck = await checkLicenseAvailability(organizationId, courseId)
  if (!licenseCheck.available && licenseCheck.availableLicenses !== null) {
    throw new Error(licenseCheck.message)
  }

  const { data, error } = await supabase
    .from('organization_course_assignments')
    .upsert(
      {
        organization_id: organizationId,
        course_id: courseId,
        user_id: userId,
        assignment_type: config?.isMandatory ? 'mandatory' : 'manual',
        is_mandatory: config?.isMandatory ?? false,
        deadline: config?.deadline?.toISOString() ?? null,
        assigned_by: user.id,
      },
      { onConflict: 'organization_id,course_id,user_id' }
    )
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to assign course to user: ${error.message}`)
  }

  // Criar notificação para o usuário
  try {
    const { notifyCourseAssigned } = await import('@/lib/notifications/triggers')
    const { data: course } = await supabase
      .from('courses')
      .select('title, slug')
      .eq('id', courseId)
      .single()

    if (course) {
      await notifyCourseAssigned(
        userId,
        course.title,
        course.slug,
        config?.isMandatory || false,
        config?.deadline || undefined
      )
    }
  } catch (notifError) {
    // Não falhar a atribuição se a notificação falhar
    console.error('Error creating notification:', notifError)
  }

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)
  return data as OrganizationCourseAssignment
}

// ============================================================================
// ASSIGN MANDATORY COURSE TO ALL USERS (Atribuir curso obrigatório a todos)
// ============================================================================

async function assignMandatoryCourseToAllUsers(
  organizationId: string,
  courseId: string
) {
  const supabase = createClient()
  const user = await requireAuth()

  // Buscar todos os usuários ativos da organização
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id')
    .eq('organization_id', organizationId)
    .eq('is_active', true)

  if (usersError || !users) {
    throw new Error(`Failed to fetch organization users: ${usersError?.message}`)
  }

  // Criar atribuições em lote
  const assignments = users.map((u: { id: string }) => ({
    organization_id: organizationId,
    course_id: courseId,
    user_id: u.id,
    assignment_type: 'mandatory' as AssignmentType,
    is_mandatory: true,
    assigned_by: user.id,
  }))

  const { error } = await supabase
    .from('organization_course_assignments')
    .upsert(assignments, { onConflict: 'organization_id,course_id,user_id' })

  if (error) {
    throw new Error(`Failed to assign course to all users: ${error.message}`)
  }

  return { assigned: assignments.length }
}

// ============================================================================
// UPDATE ORGANIZATION COURSE ACCESS (Atualizar acesso)
// ============================================================================

export async function updateOrganizationCourseAccess(
  accessId: string,
  updates: Partial<AssignCourseConfig>
) {
  await requireSuperAdmin()
  const supabase = createClient()

  const updateData: any = {}
  if (updates.accessType) updateData.access_type = updates.accessType
  if (updates.totalLicenses !== undefined) updateData.total_licenses = updates.totalLicenses
  if (updates.validUntil !== undefined) updateData.valid_until = updates.validUntil?.toISOString() ?? null
  if (updates.isMandatory !== undefined) updateData.is_mandatory = updates.isMandatory
  if (updates.autoEnroll !== undefined) updateData.auto_enroll = updates.autoEnroll
  if (updates.allowCertificate !== undefined) updateData.allow_certificate = updates.allowCertificate

  const { data, error } = await supabase
    .from('organization_course_access')
    .update(updateData)
    .eq('id', accessId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update course access: ${error.message}`)
  }

  revalidatePath('/admin/tenants')
  return data as OrganizationCourseAccess
}

// ============================================================================
// REMOVE COURSE FROM ORGANIZATION (Remover curso da organização)
// ============================================================================

export async function removeCourseFromOrganization(
  organizationId: string,
  courseId: string
) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { error } = await supabase
    .from('organization_course_access')
    .delete()
    .eq('organization_id', organizationId)
    .eq('course_id', courseId)

  if (error) {
    throw new Error(`Failed to remove course from organization: ${error.message}`)
  }

  revalidatePath('/admin/tenants')
  revalidatePath(`/admin/tenants/${organizationId}/edit`)
  return { success: true }
}

