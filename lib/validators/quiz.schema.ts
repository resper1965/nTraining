// ============================================================================
// Quiz Validation Schemas
// ============================================================================
// Schemas Zod para validação de quizzes e questões

import { z } from 'zod'

// ============================================================================
// Enums e Constantes
// ============================================================================

export const QuestionTypeSchema = z.enum(['multiple_choice', 'true_false', 'scenario'], {
  errorMap: () => ({ message: 'Tipo de questão inválido' }),
})

// ============================================================================
// Quiz Schemas
// ============================================================================

export const QuizCreateSchema = z.object({
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

  course_id: z
    .string()
    .uuid('ID de curso inválido')
    .min(1, 'ID de curso é obrigatório'),

  passing_score: z
    .number()
    .int()
    .min(0, 'Pontuação mínima deve ser 0')
    .max(100, 'Pontuação mínima deve ser no máximo 100')
    .default(70),

  max_attempts: z
    .number()
    .int()
    .positive('Número máximo de tentativas deve ser positivo')
    .max(100, 'Número máximo de tentativas é 100')
    .nullable()
    .optional()
    .transform((val) => val ?? null),

  time_limit_minutes: z
    .number()
    .int()
    .positive('Limite de tempo deve ser positivo')
    .max(1440, 'Limite de tempo não pode exceder 1440 minutos (24 horas)')
    .nullable()
    .optional()
    .transform((val) => val ?? null),

  show_correct_answers: z.boolean().default(true),
})

export const QuizUpdateSchema = QuizCreateSchema.partial().extend({
  course_id: z.string().uuid().optional(), // course_id não pode ser alterado
})

// ============================================================================
// Question Option Schema
// ============================================================================

export const QuestionOptionSchema = z.object({
  option_text: z
    .string()
    .min(1, 'Texto da opção é obrigatório')
    .max(1000, 'Texto da opção deve ter no máximo 1000 caracteres')
    .trim(),

  is_correct: z.boolean(),

  explanation: z
    .string()
    .max(2000, 'Explicação deve ter no máximo 2000 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),
})

// ============================================================================
// Question Schemas
// ============================================================================

export const QuestionCreateSchema = z.object({
  quiz_id: z
    .string()
    .uuid('ID de quiz inválido')
    .min(1, 'ID de quiz é obrigatório'),

  question_text: z
    .string()
    .min(3, 'Texto da questão deve ter pelo menos 3 caracteres')
    .max(5000, 'Texto da questão deve ter no máximo 5000 caracteres')
    .trim(),

  question_type: QuestionTypeSchema,

  points: z
    .number()
    .int()
    .positive('Pontos devem ser um número positivo')
    .max(100, 'Pontos não podem exceder 100')
    .default(1),

  explanation: z
    .string()
    .max(2000, 'Explicação deve ter no máximo 2000 caracteres')
    .nullable()
    .optional()
    .transform((val) => val || null),

  options: z
    .array(QuestionOptionSchema)
    .min(2, 'Deve haver pelo menos 2 opções')
    .max(10, 'Máximo de 10 opções')
    .refine(
      (options) => options.some((opt) => opt.is_correct),
      'Pelo menos uma opção deve estar correta'
    ),
})

export const QuestionUpdateSchema = QuestionCreateSchema.partial().extend({
  quiz_id: z.string().uuid().optional(), // quiz_id não pode ser alterado
  options: z
    .array(QuestionOptionSchema.extend({ id: z.string().uuid().optional() }))
    .min(2)
    .max(10)
    .refine(
      (options) => options.some((opt) => opt.is_correct),
      'Pelo menos uma opção deve estar correta'
    )
    .optional(),
})

export const ReorderQuestionsSchema = z.object({
  question_ids: z
    .array(z.string().uuid('ID de questão inválido'))
    .min(1, 'Deve haver pelo menos uma questão'),
})

// ============================================================================
// Tipos Inferidos
// ============================================================================

export type QuizCreateInput = z.infer<typeof QuizCreateSchema>
export type QuizUpdateInput = z.infer<typeof QuizUpdateSchema>
export type QuestionCreateInput = z.infer<typeof QuestionCreateSchema>
export type QuestionUpdateInput = z.infer<typeof QuestionUpdateSchema>
export type ReorderQuestionsInput = z.infer<typeof ReorderQuestionsSchema>

// ============================================================================
// Helpers de Validação
// ============================================================================

export function validateQuizCreate(data: unknown): QuizCreateInput {
  return QuizCreateSchema.parse(data)
}

export function validateQuizUpdate(
  data: unknown
): { success: true; data: QuizUpdateInput } | { success: false; error: z.ZodError } {
  const result = QuizUpdateSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

export function validateQuestionCreate(data: unknown): QuestionCreateInput {
  return QuestionCreateSchema.parse(data)
}

export function validateQuestionUpdate(
  data: unknown
): { success: true; data: QuestionUpdateInput } | { success: false; error: z.ZodError } {
  const result = QuestionUpdateSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

export function validateReorderQuestions(data: unknown): ReorderQuestionsInput {
  return ReorderQuestionsSchema.parse(data)
}
