// ============================================================================
// Content Validation Schemas (Modules & Lessons)
// ============================================================================
// Schemas Zod para validação de módulos e aulas

import { z } from 'zod'

// ============================================================================
// Enums e Constantes
// ============================================================================

export const ContentTypeSchema = z.enum(['video', 'text', 'pdf', 'quiz', 'embed'], {
  errorMap: () => ({ message: 'Tipo de conteúdo inválido' }),
})

// ============================================================================
// Module Schemas
// ============================================================================

export const ModuleCreateSchema = z.object({
  course_id: z
    .string()
    .uuid('ID de curso inválido')
    .min(1, 'ID de curso é obrigatório'),

  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .trim(),

  description: z
    .string()
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),
})

export const ModuleUpdateSchema = ModuleCreateSchema.partial().extend({
  course_id: z.string().uuid().optional(), // course_id não pode ser alterado
})

export const ReorderModulesSchema = z.object({
  course_id: z.string().uuid('ID de curso inválido'),
  module_ids: z
    .array(z.string().uuid('ID de módulo inválido'))
    .min(1, 'Deve haver pelo menos um módulo'),
})

// ============================================================================
// Lesson Schemas
// ============================================================================

export const LessonCreateSchema = z.object({
  module_id: z
    .string()
    .uuid('ID de módulo inválido')
    .min(1, 'ID de módulo é obrigatório'),

  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .trim(),

  content_type: ContentTypeSchema,

  content_url: z
    .string()
    .url('URL inválida')
    .nullable()
    .optional()
    .transform((val) => val || null),

  content_text: z
    .string()
    .max(100000, 'Texto deve ter no máximo 100000 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),

  duration_minutes: z
    .number()
    .int()
    .positive('Duração deve ser um número positivo')
    .max(1440, 'Duração não pode exceder 1440 minutos (24 horas)')
    .nullable()
    .optional()
    .transform((val) => val ?? null),

  is_required: z.boolean().default(true),
})

export const LessonUpdateSchema = LessonCreateSchema.partial().extend({
  module_id: z.string().uuid().optional(), // module_id não pode ser alterado
})

export const ReorderLessonsSchema = z.object({
  module_id: z.string().uuid('ID de módulo inválido'),
  lesson_ids: z
    .array(z.string().uuid('ID de aula inválido'))
    .min(1, 'Deve haver pelo menos uma aula'),
})

// ============================================================================
// Tipos Inferidos
// ============================================================================

export type ModuleCreateInput = z.infer<typeof ModuleCreateSchema>
export type ModuleUpdateInput = z.infer<typeof ModuleUpdateSchema>
export type ReorderModulesInput = z.infer<typeof ReorderModulesSchema>
export type LessonCreateInput = z.infer<typeof LessonCreateSchema>
export type LessonUpdateInput = z.infer<typeof LessonUpdateSchema>
export type ReorderLessonsInput = z.infer<typeof ReorderLessonsSchema>

// ============================================================================
// Helpers de Validação
// ============================================================================

export function validateModuleCreate(data: unknown): ModuleCreateInput {
  return ModuleCreateSchema.parse(data)
}

export function validateModuleUpdate(
  data: unknown
): { success: true; data: ModuleUpdateInput } | { success: false; error: z.ZodError } {
  const result = ModuleUpdateSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

export function validateReorderModules(data: unknown): ReorderModulesInput {
  return ReorderModulesSchema.parse(data)
}

export function validateLessonCreate(data: unknown): LessonCreateInput {
  return LessonCreateSchema.parse(data)
}

export function validateLessonUpdate(
  data: unknown
): { success: true; data: LessonUpdateInput } | { success: false; error: z.ZodError } {
  const result = LessonUpdateSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

export function validateReorderLessons(data: unknown): ReorderLessonsInput {
  return ReorderLessonsSchema.parse(data)
}
