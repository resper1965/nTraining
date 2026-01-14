'use server'

// ============================================================================
// Organization Server Actions (Refatorado)
// ============================================================================
// Esta camada apenas orquestra: Auth → Validação → Service → Response

import { revalidatePath } from 'next/cache'
import { requireSuperAdmin } from '@/lib/auth/helpers'
import {
  OrganizationService,
  OrganizationServiceError,
  type OrganizationWithCount,
} from '@/lib/services/organization.service'
import {
  validateOrganizationFilters,
  validateOrganizationUpdate,
  type OrganizationFiltersInput,
  type OrganizationUpdateInput,
} from '@/lib/validators/organization.schema'
import type { Organization } from '@/lib/types/database'
import { ZodError } from 'zod'

// ============================================================================
// GET PUBLIC ORGANIZATIONS (Public - for signup)
// ============================================================================

export async function getPublicOrganizations(): Promise<
  Array<{ id: string; name: string; slug: string }>
> {
  try {
    const service = new OrganizationService()
    return await service.getPublicOrganizations()
  } catch (error) {
    if (error instanceof OrganizationServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// GET ALL ORGANIZATIONS
// ============================================================================

export async function getAllOrganizations(
  filters?: OrganizationFiltersInput
): Promise<(Organization & { users_count: number })[]> {
  try {
    await requireSuperAdmin()

    const validation = validateOrganizationFilters(filters || {})
    if (!validation.success) {
      throw new Error('Filtros inválidos')
    }

    const service = new OrganizationService()
    return await service.getAllOrganizations(validation.data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Filtros inválidos')
    }
    if (error instanceof OrganizationServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// GET ORGANIZATION BY ID
// ============================================================================

export async function getOrganizationById(
  organizationId: string
): Promise<OrganizationWithCount> {
  try {
    await requireSuperAdmin()

    const service = new OrganizationService()
    return await service.getOrganizationById(organizationId)
  } catch (error) {
    if (error instanceof OrganizationServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// GET ORGANIZATION USERS
// ============================================================================

export async function getOrganizationUsers(organizationId: string): Promise<any[]> {
  try {
    await requireSuperAdmin()

    const service = new OrganizationService()
    return await service.getOrganizationUsers(organizationId)
  } catch (error) {
    if (error instanceof OrganizationServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// GET ORGANIZATION COURSES
// ============================================================================

export async function getOrganizationCourses(organizationId: string): Promise<any[]> {
  try {
    await requireSuperAdmin()

    const service = new OrganizationService()
    return await service.getOrganizationCourses(organizationId)
  } catch (error) {
    if (error instanceof OrganizationServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// UPDATE ORGANIZATION
// ============================================================================

export async function updateOrganization(
  organizationId: string,
  input: unknown
): Promise<Organization> {
  try {
    await requireSuperAdmin()

    const validation = validateOrganizationUpdate(input)
    if (!validation.success) {
      throw new Error('Dados inválidos')
    }

    const service = new OrganizationService()
    const organization = await service.updateOrganization(organizationId, validation.data)

    revalidatePath('/admin/organizations')
    revalidatePath(`/admin/organizations/${organizationId}`)
    return organization
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Dados inválidos')
    }
    if (error instanceof OrganizationServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// DELETE ORGANIZATION
// ============================================================================

export async function deleteOrganization(organizationId: string): Promise<{ success: true }> {
  try {
    await requireSuperAdmin()

    const service = new OrganizationService()
    await service.deleteOrganization(organizationId)

    revalidatePath('/admin/organizations')
    return { success: true }
  } catch (error) {
    if (error instanceof OrganizationServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}
