'use server'

// ============================================================================
// Module Server Actions (Refatorado)
// ============================================================================
// Esta camada apenas orquestra: Auth → Validação → Service → Response

import { revalidatePath } from 'next/cache'
import { requireAuth, requireRole } from '@/lib/auth/helpers'
import { ContentService, ContentServiceError } from '@/lib/services/content.service'
import {
  validateModuleCreate,
  validateModuleUpdate,
  validateReorderModules,
  type ModuleCreateInput,
  type ModuleUpdateInput,
  type ReorderModulesInput,
} from '@/lib/validators/content.schema'
import type { Module } from '@/lib/types/database'
import { ZodError } from 'zod'

// ============================================================================
// GET MODULES BY COURSE
// ============================================================================

export async function getModulesByCourse(courseId: string): Promise<Module[]> {
  try {
    await requireAuth()

    const service = new ContentService()
    return await service.getModulesByCourse(courseId)
  } catch (error) {
    if (error instanceof ContentServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// CREATE MODULE
// ============================================================================

export async function createModule(
  courseId: string,
  input: unknown
): Promise<Module> {
  try {
    await requireRole('platform_admin')

    const validatedInput = validateModuleCreate({ ...(input as any), course_id: courseId })

    const service = new ContentService()
    const module = await service.createModule(validatedInput)

    revalidatePath(`/admin/courses/${courseId}/modules`)
    return module
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Dados inválidos')
    }
    if (error instanceof ContentServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// UPDATE MODULE
// ============================================================================

export async function updateModule(
  moduleId: string,
  input: unknown
): Promise<Module> {
  try {
    await requireRole('platform_admin')

    const validation = validateModuleUpdate(input)
    if (!validation.success) {
      throw new Error('Dados inválidos')
    }

    const service = new ContentService()
    const module = await service.updateModule(moduleId, validation.data)

    // Obter course_id para revalidar
    const modules = await service.getModulesByCourse(module.course_id)
    const updatedModule = modules.find((m) => m.id === moduleId)
    if (updatedModule) {
      revalidatePath(`/admin/courses/${updatedModule.course_id}/modules`)
    }

    return module
  } catch (error) {
    if (error instanceof ContentServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// DELETE MODULE
// ============================================================================

export async function deleteModule(moduleId: string): Promise<{ success: true }> {
  try {
    await requireRole('platform_admin')

    const service = new ContentService()
    const { courseId } = await service.deleteModule(moduleId)

    revalidatePath(`/admin/courses/${courseId}/modules`)
    return { success: true }
  } catch (error) {
    if (error instanceof ContentServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// REORDER MODULES
// ============================================================================

export async function reorderModules(
  courseId: string,
  moduleIds: string[]
): Promise<{ success: true }> {
  try {
    await requireRole('platform_admin')

    const validatedInput = validateReorderModules({ course_id: courseId, module_ids: moduleIds })

    const service = new ContentService()
    await service.reorderModules(validatedInput)

    revalidatePath(`/admin/courses/${courseId}/modules`)
    return { success: true }
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Dados inválidos')
    }
    if (error instanceof ContentServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}
