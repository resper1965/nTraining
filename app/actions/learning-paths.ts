'use server'

import { createClient } from '@/lib/supabase/server'
import { requireSuperAdmin, requireAuth } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  LearningPath,
  LearningPathFormData,
  PathCourse,
  Course,
} from '@/lib/types/database'

// ============================================================================
// GET ALL LEARNING PATHS
// ============================================================================

export async function getAllLearningPaths(organizationId?: string) {
  const supabase = createClient()
  await requireSuperAdmin()

  let query = supabase
    .from('learning_paths')
    .select('*')
    .order('created_at', { ascending: false })

  if (organizationId) {
    query = query.eq('organization_id', organizationId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch learning paths: ${error.message}`)
  }

  return data as LearningPath[]
}

// ============================================================================
// GET LEARNING PATH BY ID
// ============================================================================

export async function getLearningPathById(pathId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  const { data, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('id', pathId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch learning path: ${error.message}`)
  }

  // Verificar acesso (superadmin ou organização)
  if (!user.is_superadmin && data.organization_id !== user.organization_id) {
    throw new Error('Unauthorized: You do not have access to this learning path')
  }

  return data as LearningPath
}

// ============================================================================
// GET LEARNING PATH WITH COURSES
// ============================================================================

export async function getLearningPathWithCourses(pathId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  const { data: path, error: pathError } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('id', pathId)
    .single()

  if (pathError) {
    throw new Error(`Failed to fetch learning path: ${pathError.message}`)
  }

  // Verificar acesso
  if (!user.is_superadmin && path.organization_id !== user.organization_id) {
    throw new Error('Unauthorized')
  }

  const { data: pathCourses, error: coursesError } = await supabase
    .from('path_courses')
    .select(
      `
      *,
      courses (
        id,
        title,
        slug,
        description,
        thumbnail_url,
        duration_hours,
        level
      )
    `
    )
    .eq('path_id', pathId)
    .order('order_index', { ascending: true })

  if (coursesError) {
    throw new Error(`Failed to fetch path courses: ${coursesError.message}`)
  }

  return {
    ...path,
    path_courses: pathCourses as (PathCourse & { courses: Course })[],
  } as LearningPath & { path_courses: (PathCourse & { courses: Course })[] }
}

// ============================================================================
// CREATE LEARNING PATH
// ============================================================================

export async function createLearningPath(formData: LearningPathFormData) {
  const supabase = createClient()
  const user = await requireSuperAdmin()

  const { data, error } = await supabase
    .from('learning_paths')
    .insert({
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      estimated_duration_hours: formData.estimated_duration_hours || null,
      is_mandatory: formData.is_mandatory || false,
      created_by: user.id,
      organization_id: null, // Global por padrão
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create learning path: ${error.message}`)
  }

  // Adicionar cursos à trilha
  if (formData.course_ids && formData.course_ids.length > 0) {
    const pathCourses = formData.course_ids.map((courseId, index) => ({
      path_id: data.id,
      course_id: courseId,
      order_index: index + 1,
      is_required: true,
    }))

    const { error: coursesError } = await supabase
      .from('path_courses')
      .insert(pathCourses)

    if (coursesError) {
      // Não falhar a criação da trilha se adicionar cursos falhar
      console.error('Error adding courses to path:', coursesError)
    }
  }

  revalidatePath('/admin/paths')
  return data as LearningPath
}

// ============================================================================
// UPDATE LEARNING PATH
// ============================================================================

export async function updateLearningPath(
  pathId: string,
  formData: Partial<LearningPathFormData>
) {
  const supabase = createClient()
  await requireSuperAdmin()

  const { data, error } = await supabase
    .from('learning_paths')
    .update({
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      estimated_duration_hours: formData.estimated_duration_hours,
      is_mandatory: formData.is_mandatory,
    })
    .eq('id', pathId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update learning path: ${error.message}`)
  }

  // Atualizar cursos se fornecido
  if (formData.course_ids) {
    // Deletar cursos existentes
    await supabase.from('path_courses').delete().eq('path_id', pathId)

    // Adicionar novos cursos
    if (formData.course_ids.length > 0) {
      const pathCourses = formData.course_ids.map((courseId, index) => ({
        path_id: pathId,
        course_id: courseId,
        order_index: index + 1,
        is_required: true,
      }))

      await supabase.from('path_courses').insert(pathCourses)
    }
  }

  revalidatePath('/admin/paths')
  revalidatePath(`/admin/paths/${pathId}`)
  return data as LearningPath
}

// ============================================================================
// DELETE LEARNING PATH
// ============================================================================

export async function deleteLearningPath(pathId: string) {
  const supabase = createClient()
  await requireSuperAdmin()

  const { error } = await supabase.from('learning_paths').delete().eq('id', pathId)

  if (error) {
    throw new Error(`Failed to delete learning path: ${error.message}`)
  }

  revalidatePath('/admin/paths')
  return { success: true }
}

// ============================================================================
// ADD COURSE TO PATH
// ============================================================================

export async function addCourseToPath(
  pathId: string,
  courseId: string,
  orderIndex?: number,
  isRequired: boolean = true
) {
  const supabase = createClient()
  await requireSuperAdmin()

  // Se orderIndex não fornecido, adicionar ao final
  if (orderIndex === undefined) {
    const { data: existing } = await supabase
      .from('path_courses')
      .select('order_index')
      .eq('path_id', pathId)
      .order('order_index', { ascending: false })
      .limit(1)

    orderIndex = existing && existing.length > 0 ? existing[0].order_index + 1 : 1
  }

  const { data, error } = await supabase
    .from('path_courses')
    .insert({
      path_id: pathId,
      course_id: courseId,
      order_index: orderIndex,
      is_required: isRequired,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to add course to path: ${error.message}`)
  }

  revalidatePath(`/admin/paths/${pathId}`)
  return data as PathCourse
}

// ============================================================================
// REMOVE COURSE FROM PATH
// ============================================================================

export async function removeCourseFromPath(pathId: string, courseId: string) {
  const supabase = createClient()
  await requireSuperAdmin()

  const { error } = await supabase
    .from('path_courses')
    .delete()
    .eq('path_id', pathId)
    .eq('course_id', courseId)

  if (error) {
    throw new Error(`Failed to remove course from path: ${error.message}`)
  }

  revalidatePath(`/admin/paths/${pathId}`)
  return { success: true }
}

// ============================================================================
// REORDER PATH COURSES
// ============================================================================

export async function reorderPathCourses(pathId: string, courseIds: string[]) {
  const supabase = createClient()
  await requireSuperAdmin()

  // Atualizar order_index para cada curso
  const updates = courseIds.map((courseId, index) =>
    supabase
      .from('path_courses')
      .update({ order_index: index + 1 })
      .eq('path_id', pathId)
      .eq('course_id', courseId)
  )

  await Promise.all(updates)

  revalidatePath(`/admin/paths/${pathId}`)
  return { success: true }
}

