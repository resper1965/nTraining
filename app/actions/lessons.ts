'use server'

// ============================================================================
// Lesson Server Actions (Refatorado)
// ============================================================================
// Esta camada apenas orquestra: Auth → Validação → Service → Response

import { revalidatePath } from 'next/cache'
import { requireAuth, requireRole } from '@/lib/auth/helpers'
import { ContentService, ContentServiceError } from '@/lib/services/content.service'
import {
  validateLessonCreate,
  validateLessonUpdate,
  validateReorderLessons,
  type LessonCreateInput,
  type LessonUpdateInput,
  type ReorderLessonsInput,
} from '@/lib/validators/content.schema'
import type { Lesson } from '@/lib/types/database'
import { ZodError } from 'zod'

// ============================================================================
// GET LESSONS BY MODULE
// ============================================================================

export async function getLessonsByModule(moduleId: string): Promise<Lesson[]> {
  try {
    await requireAuth()

    const service = new ContentService()
    return await service.getLessonsByModule(moduleId)
  } catch (error) {
    if (error instanceof ContentServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// CREATE LESSON
// ============================================================================

export async function createLesson(
  moduleId: string,
  input: unknown
): Promise<Lesson> {
  try {
    await requireRole('platform_admin')

    const validatedInput = validateLessonCreate({ ...(input as any), module_id: moduleId })

    const service = new ContentService()
    const result = await service.createLesson(validatedInput)

    revalidatePath(
      `/admin/courses/${result.courseId}/modules/${moduleId}/lessons`
    )
    return result
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
// UPDATE LESSON
// ============================================================================

export async function updateLesson(
  lessonId: string,
  input: unknown
): Promise<Lesson> {
  try {
    await requireRole('platform_admin')

    const validation = validateLessonUpdate(input)
    if (!validation.success) {
      throw new Error('Dados inválidos')
    }

    const service = new ContentService()
    const result = await service.updateLesson(lessonId, validation.data)

    revalidatePath(
      `/admin/courses/${result.courseId}/modules/${result.moduleId}/lessons`
    )
    return result
  } catch (error) {
    if (error instanceof ContentServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// DELETE LESSON
// ============================================================================

export async function deleteLesson(lessonId: string): Promise<{ success: true }> {
  try {
    await requireRole('platform_admin')

    const service = new ContentService()
    const { courseId, moduleId } = await service.deleteLesson(lessonId)

    revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}/lessons`)
    return { success: true }
  } catch (error) {
    if (error instanceof ContentServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// REORDER LESSONS
// ============================================================================

export async function reorderLessons(
  moduleId: string,
  lessonIds: string[]
): Promise<{ success: true }> {
  try {
    await requireRole('platform_admin')

    const validatedInput = validateReorderLessons({ module_id: moduleId, lesson_ids: lessonIds })

    const service = new ContentService()
    const { courseId } = await service.reorderLessons(validatedInput)

    revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}/lessons`)
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
