'use server'

// ============================================================================
// Course Server Actions (Refatorado)
// ============================================================================
// Esta camada apenas orquestra: Auth → Validação → Service → Response
// Toda lógica de negócio está em CourseService
// Toda validação está em course.schema.ts

import { revalidatePath } from 'next/cache'
import { getCurrentUser, requireAuth, requireRole } from '@/lib/auth/helpers'
import { CourseService, CourseServiceError } from '@/lib/services/course.service'
import {
  validateCourseCreate,
  validateCourseUpdate,
  validateCourseFilters,
  type CourseCreateInput,
  type CourseUpdateInput,
  type CourseFiltersInput,
} from '@/lib/validators/course.schema'
import type {
  Course,
  CourseWithModules,
  CourseWithProgress,
} from '@/lib/types/database'
import { ZodError } from 'zod'

// ============================================================================
// Error Types
// ============================================================================

export interface ActionError {
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

// ============================================================================
// GET COURSES
// ============================================================================

export async function getCourses(
  filters?: CourseFiltersInput
): Promise<Course[] | ActionError> {
  try {
    const user = await requireAuth()

    // Validar filtros
    const validation = validateCourseFilters(filters || {})
    if (!validation.success) {
      return {
        message: 'Filtros inválidos',
        code: 'VALIDATION_ERROR',
        fieldErrors: validation.error.flatten().fieldErrors,
      }
    }

    // Criar serviço e buscar cursos
    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    const courses = await service.getCourses(validation.data)
    return courses
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        message: error.message,
        code: error.code,
      }
    }
    return {
      message: 'Erro ao buscar cursos',
      code: 'UNKNOWN_ERROR',
    }
  }
}

// ============================================================================
// GET COURSE BY ID
// ============================================================================

export async function getCourseById(
  courseId: string
): Promise<CourseWithModules | ActionError> {
  try {
    await requireAuth()

    const user = await getCurrentUser()
    if (!user) {
      return {
        message: 'Usuário não autenticado',
        code: 'UNAUTHORIZED',
      }
    }

    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    const course = await service.getCourseById(courseId)
    return course
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        message: error.message,
        code: error.code,
      }
    }
    return {
      message: 'Erro ao buscar curso',
      code: 'UNKNOWN_ERROR',
    }
  }
}

// ============================================================================
// GET COURSE BY SLUG
// ============================================================================

export async function getCourseBySlug(
  slug: string
): Promise<CourseWithModules | ActionError> {
  try {
    await requireAuth()

    const user = await getCurrentUser()
    if (!user) {
      return {
        message: 'Usuário não autenticado',
        code: 'UNAUTHORIZED',
      }
    }

    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    const course = await service.getCourseBySlug(slug)
    return course
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        message: error.message,
        code: error.code,
      }
    }
    return {
      message: 'Erro ao buscar curso',
      code: 'UNKNOWN_ERROR',
    }
  }
}

// ============================================================================
// GET COURSES WITH PROGRESS
// ============================================================================

export async function getCoursesWithProgress(
  filters?: CourseFiltersInput
): Promise<CourseWithProgress[] | ActionError> {
  try {
    const user = await requireAuth()

    // Validar filtros
    const validation = validateCourseFilters(filters || {})
    if (!validation.success) {
      return {
        message: 'Filtros inválidos',
        code: 'VALIDATION_ERROR',
        fieldErrors: validation.error.flatten().fieldErrors,
      }
    }

    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    const courses = await service.getCoursesWithProgress(validation.data)
    return courses
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        message: error.message,
        code: error.code,
      }
    }
    return {
      message: 'Erro ao buscar cursos com progresso',
      code: 'UNKNOWN_ERROR',
    }
  }
}

// ============================================================================
// CREATE COURSE (Admin only)
// ============================================================================

export async function createCourse(
  input: unknown
): Promise<{ success: true; data: Course } | { success: false; error: ActionError }> {
  try {
    // 1. Auth Check
    const user = await requireRole('platform_admin')

    // 2. Validação
    let validatedInput: CourseCreateInput
    try {
      validatedInput = validateCourseCreate(input)
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          error: {
            message: 'Dados inválidos',
            code: 'VALIDATION_ERROR',
            fieldErrors: error.flatten().fieldErrors,
          },
        }
      }
      throw error
    }

    // 3. Service Call
    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    const course = await service.createCourse(validatedInput)

    // 4. Response/Effect
    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return {
      success: true,
      data: course,
    }
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    return {
      success: false,
      error: {
        message: 'Erro ao criar curso',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

// ============================================================================
// UPDATE COURSE (Admin only)
// ============================================================================

export async function updateCourse(
  courseId: string,
  input: unknown
): Promise<{ success: true; data: Course } | { success: false; error: ActionError }> {
  try {
    // 1. Auth Check
    await requireRole('platform_admin')

    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: {
          message: 'Usuário não autenticado',
          code: 'UNAUTHORIZED',
        },
      }
    }

    // 2. Validação
    const validation = validateCourseUpdate(input)
    if (!validation.success) {
      return {
        success: false,
        error: {
          message: 'Dados inválidos',
          code: 'VALIDATION_ERROR',
          fieldErrors: validation.error.flatten().fieldErrors,
        },
      }
    }

    // 3. Service Call
    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    const course = await service.updateCourse(courseId, validation.data)

    // 4. Response/Effect
    revalidatePath('/admin/courses')
    revalidatePath(`/courses/${course.slug}`)
    revalidatePath(`/admin/courses/${courseId}`)

    return {
      success: true,
      data: course,
    }
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    return {
      success: false,
      error: {
        message: 'Erro ao atualizar curso',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

// ============================================================================
// PUBLISH COURSE (Admin only)
// ============================================================================

export async function publishCourse(
  courseId: string
): Promise<{ success: true; data: Course } | { success: false; error: ActionError }> {
  try {
    // 1. Auth Check
    await requireRole('platform_admin')

    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: {
          message: 'Usuário não autenticado',
          code: 'UNAUTHORIZED',
        },
      }
    }

    // 2. Service Call (sem validação adicional, apenas ID)
    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    const course = await service.publishCourse(courseId)

    // 3. Response/Effect
    revalidatePath('/admin/courses')
    revalidatePath(`/courses/${course.slug}`)

    return {
      success: true,
      data: course,
    }
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    return {
      success: false,
      error: {
        message: 'Erro ao publicar curso',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

// ============================================================================
// DELETE COURSE (Admin only)
// ============================================================================

export async function deleteCourse(
  courseId: string
): Promise<{ success: true } | { success: false; error: ActionError }> {
  try {
    // 1. Auth Check
    await requireRole('platform_admin')

    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: {
          message: 'Usuário não autenticado',
          code: 'UNAUTHORIZED',
        },
      }
    }

    // 2. Service Call
    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    await service.deleteCourse(courseId)

    // 3. Response/Effect
    revalidatePath('/admin/courses')
    revalidatePath('/courses')

    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    return {
      success: false,
      error: {
        message: 'Erro ao deletar curso',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

// ============================================================================
// ENROLL IN COURSE
// ============================================================================

export async function enrollInCourse(
  courseId: string
): Promise<{ success: true; data: any } | { success: false; error: ActionError }> {
  try {
    // 1. Auth Check
    const user = await requireAuth()

    // 2. Validação básica (apenas ID)
    if (!courseId || typeof courseId !== 'string') {
      return {
        success: false,
        error: {
          message: 'ID do curso inválido',
          code: 'VALIDATION_ERROR',
        },
      }
    }

    // 3. Service Call
    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    const enrollment = await service.enrollInCourse(courseId)

    // 4. Response/Effect
    revalidatePath('/courses')
    revalidatePath(`/courses/${courseId}`)

    return {
      success: true,
      data: enrollment,
    }
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    return {
      success: false,
      error: {
        message: 'Erro ao inscrever no curso',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

// ============================================================================
// GET COURSE AREAS (for filters)
// ============================================================================

export async function getCourseAreas(): Promise<string[] | ActionError> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        message: 'Usuário não autenticado',
        code: 'UNAUTHORIZED',
      }
    }

    const service = new CourseService({
      userId: user.id,
      organizationId: user.organization_id,
      isSuperadmin: user.is_superadmin,
    })

    const areas = await service.getCourseAreas()
    return areas
  } catch (error) {
    if (error instanceof CourseServiceError) {
      return {
        message: error.message,
        code: error.code,
      }
    }
    return {
      message: 'Erro ao buscar áreas',
      code: 'UNKNOWN_ERROR',
    }
  }
}
