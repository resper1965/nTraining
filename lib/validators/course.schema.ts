// ============================================================================
// Course Validation Schemas
// ============================================================================
// Schemas Zod para validação de dados de cursos
// Tipos inferidos são exportados para uso em Server Actions e Services

import { z } from 'zod'

// ============================================================================
// Enums e Constantes
// ============================================================================

export const CourseLevelSchema = z.enum(['beginner', 'intermediate', 'advanced'])

export const CourseStatusSchema = z.enum(['draft', 'published', 'archived'])

// ============================================================================
// Schema de Slug (validação customizada)
// ============================================================================

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const SlugSchema = z
  .string()
  .min(3, 'Slug deve ter pelo menos 3 caracteres')
  .max(255, 'Slug deve ter no máximo 255 caracteres')
  .regex(slugRegex, 'Slug deve conter apenas letras minúsculas, números e hífens')
  .refine((slug) => !slug.startsWith('-') && !slug.endsWith('-'), {
    message: 'Slug não pode começar ou terminar com hífen',
  })

// ============================================================================
// Schema de Criação/Atualização de Curso
// ============================================================================

export const CourseUpsertSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .trim(),

  slug: SlugSchema,

  description: z
    .string()
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),

  objectives: z
    .string()
    .max(5000, 'Objetivos devem ter no máximo 5000 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),

  thumbnail_url: z
    .string()
    .url('URL da thumbnail inválida')
    .nullable()
    .optional()
    .transform((val) => val || null),

  duration_hours: z
    .number()
    .positive('Duração deve ser um número positivo')
    .max(1000, 'Duração não pode exceder 1000 horas')
    .nullable()
    .optional()
    .transform((val) => val ?? null),

  level: CourseLevelSchema,

  area: z
    .string()
    .max(100, 'Área deve ter no máximo 100 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),

  status: CourseStatusSchema,

  is_public: z.boolean().default(false),
})

// Schema para criação (todos os campos obrigatórios)
export const CourseCreateSchema = CourseUpsertSchema

// Schema para atualização (todos os campos opcionais)
export const CourseUpdateSchema = CourseUpsertSchema.partial().extend({
  slug: SlugSchema.optional(), // Slug pode ser opcional na atualização
})

// ============================================================================
// Schema de Filtros
// ============================================================================

export const CourseFiltersSchema = z.object({
  area: z.string().max(100).optional(),
  level: CourseLevelSchema.optional(),
  status: CourseStatusSchema.optional(),
  search: z
    .string()
    .max(255, 'Termo de busca deve ter no máximo 255 caracteres')
    .optional()
    .transform((val) => {
      // Sanitizar input de busca: remover caracteres especiais perigosos
      if (!val) return undefined
      // Remove caracteres que podem causar problemas em queries SQL
      return val.replace(/[%_\\]/g, '').trim() || undefined
    })
    .or(z.undefined()),
  is_public: z.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
}).partial()

// ============================================================================
// Tipos Inferidos (exportados para uso em outras camadas)
// ============================================================================

export type CourseUpsertInput = z.infer<typeof CourseUpsertSchema>
export type CourseCreateInput = z.infer<typeof CourseCreateSchema>
export type CourseUpdateInput = z.infer<typeof CourseUpdateSchema>
export type CourseFiltersInput = z.infer<typeof CourseFiltersSchema>

// ============================================================================
// Helpers de Validação
// ============================================================================

/**
 * Valida dados de criação de curso
 * @throws {z.ZodError} Se validação falhar
 */
export function validateCourseCreate(data: unknown): CourseCreateInput {
  return CourseCreateSchema.parse(data)
}

/**
 * Valida dados de atualização de curso (safe parse)
 * Retorna objeto com success/error
 */
export function validateCourseUpdate(
  data: unknown
): { success: true; data: CourseUpdateInput } | { success: false; error: z.ZodError } {
  const result = CourseUpdateSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

/**
 * Valida filtros de busca (safe parse)
 */
export function validateCourseFilters(
  data: unknown
): { success: true; data: CourseFiltersInput } | { success: false; error: z.ZodError } {
  const result = CourseFiltersSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}
