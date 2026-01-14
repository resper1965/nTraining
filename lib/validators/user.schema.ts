// ============================================================================
// User Validation Schemas
// ============================================================================
// Schemas Zod para validação de dados de usuários

import { z } from 'zod'

// ============================================================================
// Enums e Constantes
// ============================================================================

export const UserRoleSchema = z.enum(['platform_admin', 'org_manager', 'student'], {
  errorMap: () => ({ message: 'Role deve ser: platform_admin, org_manager ou student' }),
})

// ============================================================================
// Schema de Filtros de Usuários
// ============================================================================

export const UserFiltersSchema = z.object({
  organization_id: z
    .string()
    .uuid('ID de organização inválido')
    .optional()
    .nullable()
    .transform((val) => val || undefined),

  role: UserRoleSchema.optional(),

  department: z
    .string()
    .max(100, 'Departamento deve ter no máximo 100 caracteres')
    .optional()
    .nullable()
    .transform((val) => val || undefined),

  is_active: z
    .boolean()
    .optional()
    .nullable()
    .transform((val) => val ?? undefined),

  search: z
    .string()
    .max(255, 'Termo de busca deve ter no máximo 255 caracteres')
    .optional()
    .transform((val) => {
      // Sanitizar input de busca: remover caracteres especiais perigosos
      if (!val) return undefined
      return val.replace(/[%_\\]/g, '').trim() || undefined
    }),

  // Paginação
  page: z
    .number()
    .int()
    .positive()
    .default(1)
    .optional(),

  limit: z
    .number()
    .int()
    .positive()
    .max(100, 'Limite máximo é 100')
    .default(20)
    .optional(),
})

// ============================================================================
// Schema de Aprovação/Rejeição
// ============================================================================

export const UserIdSchema = z
  .string()
  .uuid('ID de usuário inválido')
  .min(1, 'ID de usuário é obrigatório')

// ============================================================================
// Tipos Inferidos (exportados para uso em outras camadas)
// ============================================================================

export type UserFiltersInput = z.infer<typeof UserFiltersSchema>
export type UserIdInput = z.infer<typeof UserIdSchema>

// ============================================================================
// Helpers de Validação
// ============================================================================

/**
 * Valida filtros de busca de usuários (safe parse)
 */
export function validateUserFilters(
  data: unknown
): { success: true; data: UserFiltersInput } | { success: false; error: z.ZodError } {
  const result = UserFiltersSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

/**
 * Valida ID de usuário
 * @throws {z.ZodError} Se validação falhar
 */
export function validateUserId(data: unknown): UserIdInput {
  return UserIdSchema.parse(data)
}
