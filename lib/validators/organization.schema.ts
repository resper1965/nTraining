// ============================================================================
// Organization Validation Schemas
// ============================================================================
// Schemas Zod para validação de organizações

import { z } from 'zod'

// ============================================================================
// Enums e Constantes
// ============================================================================

export const OrganizationStatusSchema = z.enum(['active', 'inactive', 'all'])

export const OrganizationSortBySchema = z.enum(['name', 'created_at', 'users_count'])

// ============================================================================
// Organization Filters Schema
// ============================================================================

export const OrganizationFiltersSchema = z.object({
  search: z
    .string()
    .max(255, 'Termo de busca deve ter no máximo 255 caracteres')
    .optional()
    .transform((val) => {
      // Sanitizar input de busca: remover caracteres especiais perigosos
      if (!val) return undefined
      return val.replace(/[%_\\]/g, '').trim() || undefined
    }),

  status: OrganizationStatusSchema.optional(),

  sortBy: OrganizationSortBySchema.optional(),

  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// ============================================================================
// Organization Update Schema
// ============================================================================

export const OrganizationUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .trim()
    .optional(),

  slug: z
    .string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .max(100, 'Slug deve ter no máximo 100 caracteres')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido')
    .optional(),

  cnpj: z
    .string()
    .max(20, 'CNPJ deve ter no máximo 20 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),

  razao_social: z
    .string()
    .max(255, 'Razão social deve ter no máximo 255 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),

  industry: z
    .string()
    .max(100, 'Indústria deve ter no máximo 100 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),

  employee_count: z
    .number()
    .int()
    .positive('Número de funcionários deve ser positivo')
    .max(10000000, 'Número de funcionários muito alto')
    .nullable()
    .optional()
    .transform((val) => val ?? null),

  logo_url: z
    .string()
    .url('URL do logo inválida')
    .nullable()
    .optional()
    .transform((val) => val || null),

  max_users: z
    .number()
    .int()
    .positive('Número máximo de usuários deve ser positivo')
    .max(100000, 'Número máximo de usuários muito alto')
    .optional(),

  settings: z.record(z.string(), z.any()).optional(),
})

// ============================================================================
// Tipos Inferidos
// ============================================================================

export type OrganizationFiltersInput = z.infer<typeof OrganizationFiltersSchema>
export type OrganizationUpdateInput = z.infer<typeof OrganizationUpdateSchema>

// ============================================================================
// Helpers de Validação
// ============================================================================

export function validateOrganizationFilters(
  data: unknown
): { success: true; data: OrganizationFiltersInput } | { success: false; error: z.ZodError } {
  const result = OrganizationFiltersSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

export function validateOrganizationUpdate(
  data: unknown
): { success: true; data: OrganizationUpdateInput } | { success: false; error: z.ZodError } {
  const result = OrganizationUpdateSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}
