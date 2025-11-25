'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth, requireRole } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Module, ModuleFormData } from '@/lib/types/database'

// ============================================================================
// GET MODULES BY COURSE
// ============================================================================

export async function getModulesByCourse(courseId: string) {
  const supabase = createClient()
  await requireAuth()

  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch modules: ${error.message}`)
  }

  return data as Module[]
}

// ============================================================================
// CREATE MODULE
// ============================================================================

export async function createModule(courseId: string, formData: ModuleFormData) {
  const supabase = createClient()
  await requireRole('platform_admin')

  // Obter o maior order_index atual
  const { data: existingModules } = await supabase
    .from('modules')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrderIndex = existingModules && existingModules.length > 0
    ? existingModules[0].order_index + 1
    : 0

  const { data, error } = await supabase
    .from('modules')
    .insert({
      course_id: courseId,
      title: formData.title,
      description: formData.description || null,
      order_index: nextOrderIndex,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create module: ${error.message}`)
  }

  revalidatePath(`/admin/courses/${courseId}/modules`)
  return data as Module
}

// ============================================================================
// UPDATE MODULE
// ============================================================================

export async function updateModule(
  moduleId: string,
  formData: Partial<ModuleFormData>
) {
  const supabase = createClient()
  await requireRole('platform_admin')

  const { data, error } = await supabase
    .from('modules')
    .update({
      title: formData.title,
      description: formData.description || null,
    })
    .eq('id', moduleId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update module: ${error.message}`)
  }

  // Revalidar páginas relacionadas
  const { data: module } = await supabase
    .from('modules')
    .select('course_id')
    .eq('id', moduleId)
    .single()

  if (module) {
    revalidatePath(`/admin/courses/${module.course_id}/modules`)
  }

  return data as Module
}

// ============================================================================
// DELETE MODULE
// ============================================================================

export async function deleteModule(moduleId: string) {
  const supabase = createClient()
  await requireRole('platform_admin')

  // Obter course_id antes de deletar
  const { data: module } = await supabase
    .from('modules')
    .select('course_id')
    .eq('id', moduleId)
    .single()

  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', moduleId)

  if (error) {
    throw new Error(`Failed to delete module: ${error.message}`)
  }

  if (module) {
    revalidatePath(`/admin/courses/${module.course_id}/modules`)
  }

  return { success: true }
}

// ============================================================================
// REORDER MODULES
// ============================================================================

export async function reorderModules(
  courseId: string,
  moduleIds: string[]
) {
  const supabase = createClient()
  await requireRole('platform_admin')

  // Atualizar order_index de cada módulo
  const updates = moduleIds.map((moduleId, index) =>
    supabase
      .from('modules')
      .update({ order_index: index })
      .eq('id', moduleId)
  )

  const results = await Promise.all(updates)
  const errors = results.filter((r) => r.error)

  if (errors.length > 0) {
    throw new Error(`Failed to reorder modules: ${errors[0].error?.message}`)
  }

  revalidatePath(`/admin/courses/${courseId}/modules`)
  return { success: true }
}

