'use server'

// ============================================================================
// User Server Actions (Refatorado)
// ============================================================================
// Esta camada apenas orquestra: Auth → Validação → Service → Response
// Toda lógica de negócio está em UserService
// Toda validação está em user.schema.ts

import { revalidatePath } from 'next/cache'
import { requireSuperAdmin } from '@/lib/auth/helpers'
import { UserService, UserServiceError } from '@/lib/services/user.service'
import {
  validateUserFilters,
  validateUserId,
  type UserFiltersInput,
  type UserIdInput,
} from '@/lib/validators/user.schema'
import { ZodError } from 'zod'
import type { User } from '@/lib/types/database'

// ============================================================================
// Error Types
// ============================================================================

export interface ActionError {
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

// ============================================================================
// GET USERS (com filtros e paginação)
// ============================================================================

export async function getUsers(
  filters?: UserFiltersInput
): Promise<
  | {
      success: true
      data: {
        users: User[]
        total: number
        page: number
        limit: number
        totalPages: number
      }
    }
  | { success: false; error: ActionError }
> {
  try {
    // 1. Auth Check
    await requireSuperAdmin()

    // 2. Validação
    const validation = validateUserFilters(filters || {})
    if (!validation.success) {
      return {
        success: false,
        error: {
          message: 'Filtros inválidos',
          code: 'VALIDATION_ERROR',
          fieldErrors: validation.error.flatten().fieldErrors,
        },
      }
    }

    // 3. Service Call
    const service = new UserService()
    const result = await service.getUsers(validation.data)

    // 4. Response
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    if (error instanceof UserServiceError) {
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
        message: 'Erro ao buscar usuários',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

// ============================================================================
// GET PENDING USERS
// ============================================================================

export async function getPendingUsers(): Promise<
  | {
      success: true
      data: Array<{
        id: string
        full_name: string | null
        email: string
        role: 'platform_admin' | 'org_manager' | 'student'
        created_at: string
        organization_id: string | null
      }>
    }
  | { success: false; error: ActionError }
> {
  try {
    // 1. Auth Check
    await requireSuperAdmin()

    // 2. Service Call (sem validação adicional)
    const service = new UserService()
    const users = await service.getPendingUsers()

    // 3. Response
    return {
      success: true,
      data: users,
    }
  } catch (error) {
    if (error instanceof UserServiceError) {
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
        message: 'Erro ao buscar usuários pendentes',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

// ============================================================================
// APPROVE USER
// ============================================================================

export async function approveUser(userId: string): Promise<{ success: true }> {
  // 1. Auth Check
  await requireSuperAdmin()

  // 2. Validação
  let validatedUserId: UserIdInput
  try {
    validatedUserId = validateUserId(userId)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('ID de usuário inválido')
    }
    throw error
  }

  // 3. Service Call
  const service = new UserService()
  await service.approveUser(validatedUserId)

  // 4. Response/Effect
  revalidatePath('/admin/users')
  revalidatePath('/admin/users/pending')

  return { success: true }
}

// ============================================================================
// REJECT USER
// ============================================================================

export async function rejectUser(userId: string): Promise<{ success: true }> {
  // 1. Auth Check
  await requireSuperAdmin()

  // 2. Validação
  let validatedUserId: UserIdInput
  try {
    validatedUserId = validateUserId(userId)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('ID de usuário inválido')
    }
    throw error
  }

  // 3. Service Call
  const service = new UserService()
  await service.rejectUser(validatedUserId)

  // 4. Response/Effect
  revalidatePath('/admin/users')
  revalidatePath('/admin/users/pending')

  return { success: true }
}
