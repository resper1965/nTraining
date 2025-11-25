'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth, requireRole } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Lesson, LessonFormData } from '@/lib/types/database'

// ============================================================================
// GET LESSONS BY MODULE
// ============================================================================

export async function getLessonsByModule(moduleId: string) {
  const supabase = createClient()
  await requireAuth()

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch lessons: ${error.message}`)
  }

  return data as Lesson[]
}

// ============================================================================
// CREATE LESSON
// ============================================================================

export async function createLesson(moduleId: string, formData: LessonFormData) {
  const supabase = createClient()
  await requireRole('platform_admin')

  // Obter o maior order_index atual
  const { data: existingLessons } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrderIndex = existingLessons && existingLessons.length > 0
    ? existingLessons[0].order_index + 1
    : 0

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      module_id: moduleId,
      title: formData.title,
      content_type: formData.content_type,
      content_url: formData.content_url || null,
      content_text: formData.content_text || null,
      duration_minutes: formData.duration_minutes || null,
      order_index: nextOrderIndex,
      is_required: formData.is_required ?? true,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create lesson: ${error.message}`)
  }

  // Obter course_id para revalidar
  const { data: module } = await supabase
    .from('modules')
    .select('course_id')
    .eq('id', moduleId)
    .single()

  if (module) {
    revalidatePath(`/admin/courses/${module.course_id}/modules/${moduleId}/lessons`)
  }

  return data as Lesson
}

// ============================================================================
// UPDATE LESSON
// ============================================================================

export async function updateLesson(
  lessonId: string,
  formData: Partial<LessonFormData>
) {
  const supabase = createClient()
  await requireRole('platform_admin')

  const updateData: any = {
    title: formData.title,
    content_type: formData.content_type,
    content_url: formData.content_url || null,
    content_text: formData.content_text || null,
    duration_minutes: formData.duration_minutes || null,
    is_required: formData.is_required ?? true,
  }

  const { data, error } = await supabase
    .from('lessons')
    .update(updateData)
    .eq('id', lessonId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update lesson: ${error.message}`)
  }

  // Obter module_id e course_id para revalidar
  const { data: lesson } = await supabase
    .from('lessons')
    .select('module_id, modules!inner(course_id)')
    .eq('id', lessonId)
    .single()

  if (lesson && (lesson as any).modules) {
    const courseId = (lesson as any).modules.course_id
    const moduleId = lesson.module_id
    revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}/lessons`)
  }

  return data as Lesson
}

// ============================================================================
// DELETE LESSON
// ============================================================================

export async function deleteLesson(lessonId: string) {
  const supabase = createClient()
  await requireRole('platform_admin')

  // Obter module_id e course_id antes de deletar
  const { data: lesson } = await supabase
    .from('lessons')
    .select('module_id, modules!inner(course_id)')
    .eq('id', lessonId)
    .single()

  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)

  if (error) {
    throw new Error(`Failed to delete lesson: ${error.message}`)
  }

  if (lesson && (lesson as any).modules) {
    const courseId = (lesson as any).modules.course_id
    const moduleId = lesson.module_id
    revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}/lessons`)
  }

  return { success: true }
}

// ============================================================================
// REORDER LESSONS
// ============================================================================

export async function reorderLessons(
  moduleId: string,
  lessonIds: string[]
) {
  const supabase = createClient()
  await requireRole('platform_admin')

  // Atualizar order_index de cada aula
  const updates = lessonIds.map((lessonId, index) =>
    supabase
      .from('lessons')
      .update({ order_index: index })
      .eq('id', lessonId)
  )

  const results = await Promise.all(updates)
  const errors = results.filter((r) => r.error)

  if (errors.length > 0) {
    throw new Error(`Failed to reorder lessons: ${errors[0].error?.message}`)
  }

  // Obter course_id para revalidar
  const { data: module } = await supabase
    .from('modules')
    .select('course_id')
    .eq('id', moduleId)
    .single()

  if (module) {
    revalidatePath(`/admin/courses/${module.course_id}/modules/${moduleId}/lessons`)
  }

  return { success: true }
}

