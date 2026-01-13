/**
 * Validation Schemas usando Zod
 *
 * Centraliza todas as validações de formulários da aplicação.
 * Mensagens de erro em português brasileiro.
 */

import { z } from 'zod'

// ============================================================================
// MENSAGENS DE ERRO PERSONALIZADAS
// ============================================================================

const requiredFieldMsg = 'Este campo é obrigatório'
const invalidEmailMsg = 'Email inválido'
const minLengthMsg = (min: number) => `Mínimo de ${min} caracteres`
const maxLengthMsg = (max: number) => `Máximo de ${max} caracteres`
const urlInvalidMsg = 'URL inválida'
const slugInvalidMsg = 'Slug inválido. Use apenas letras minúsculas, números e hífens'

// ============================================================================
// VALIDATORS REUTILIZÁVEIS
// ============================================================================

export const emailValidator = z.string().email(invalidEmailMsg)

export const slugValidator = z
  .string()
  .min(1, requiredFieldMsg)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, slugInvalidMsg)

export const urlValidator = z.string().url(urlInvalidMsg).optional().or(z.literal(''))

export const passwordValidator = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número')

// ============================================================================
// COURSE SCHEMAS
// ============================================================================

export const courseFormSchema = z.object({
  title: z.string().min(3, minLengthMsg(3)).max(200, maxLengthMsg(200)),
  slug: slugValidator,
  description: z.string().min(10, minLengthMsg(10)).max(2000, maxLengthMsg(2000)),
  objectives: z.string().optional(),
  thumbnail_url: urlValidator,
  level: z.enum(['iniciante', 'intermediario', 'avancado'], {
    message: 'Selecione um nível',
  }),
  area: z.string().min(1, requiredFieldMsg).max(100, maxLengthMsg(100)),
  duration_hours: z.coerce
    .number()
    .min(0.5, 'Duração mínima: 0.5 horas')
    .max(1000, 'Duração máxima: 1000 horas')
    .optional(),
  status: z.enum(['draft', 'published', 'archived'], {
    message: 'Selecione um status',
  }),
  is_public: z.boolean().default(false),
})

export type CourseFormValues = z.infer<typeof courseFormSchema>

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const userCreateSchema = z.object({
  email: emailValidator,
  full_name: z.string().min(3, minLengthMsg(3)).max(100, maxLengthMsg(100)),
  password: passwordValidator,
  role: z.enum(['student', 'org_manager', 'platform_admin', 'superadmin'], {
    message: 'Selecione uma função',
  }),
  organization_id: z.string().uuid('Organização inválida').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
})

export type UserCreateValues = z.infer<typeof userCreateSchema>

export const userUpdateSchema = z.object({
  full_name: z.string().min(3, minLengthMsg(3)).max(100, maxLengthMsg(100)),
  email: emailValidator,
  role: z.enum(['student', 'org_manager', 'platform_admin', 'superadmin'], {
    message: 'Selecione uma função',
  }),
  organization_id: z.string().uuid('Organização inválida').optional().or(z.literal('')),
  is_active: z.boolean(),
})

export type UserUpdateValues = z.infer<typeof userUpdateSchema>

// ============================================================================
// PASSWORD SCHEMAS
// ============================================================================

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: passwordValidator,
    confirmPassword: z.string().min(1, 'Confirmação é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>

// ============================================================================
// PROFILE SCHEMAS
// ============================================================================

export const profileUpdateSchema = z.object({
  full_name: z.string().min(3, minLengthMsg(3)).max(100, maxLengthMsg(100)),
  bio: z.string().max(500, maxLengthMsg(500)).optional().or(z.literal('')),
  avatar_url: urlValidator,
})

export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>

// ============================================================================
// LEARNING PATH SCHEMAS
// ============================================================================

export const learningPathFormSchema = z.object({
  title: z.string().min(3, minLengthMsg(3)).max(200, maxLengthMsg(200)),
  slug: slugValidator,
  description: z.string().min(10, minLengthMsg(10)).max(2000, maxLengthMsg(2000)),
  estimated_duration_hours: z.coerce
    .number()
    .min(0.5, 'Duração mínima: 0.5 horas')
    .max(2000, 'Duração máxima: 2000 horas')
    .optional(),
  is_mandatory: z.boolean().default(false),
  course_ids: z.array(z.string().uuid()).min(1, 'Selecione pelo menos um curso'),
})

export type LearningPathFormValues = z.infer<typeof learningPathFormSchema>

// ============================================================================
// MODULE SCHEMAS
// ============================================================================

export const moduleFormSchema = z.object({
  title: z.string().min(3, minLengthMsg(3)).max(200, maxLengthMsg(200)),
  description: z.string().max(1000, maxLengthMsg(1000)).optional().or(z.literal('')),
  order_index: z.coerce.number().min(1, 'Ordem deve ser maior que 0'),
})

export type ModuleFormValues = z.infer<typeof moduleFormSchema>

// ============================================================================
// LESSON SCHEMAS
// ============================================================================

export const lessonFormSchema = z.object({
  title: z.string().min(3, minLengthMsg(3)).max(200, maxLengthMsg(200)),
  content: z.string().min(10, minLengthMsg(10)),
  type: z.enum(['video', 'text', 'quiz'], {
    message: 'Selecione um tipo',
  }),
  video_url: urlValidator,
  duration_minutes: z.coerce
    .number()
    .min(1, 'Duração mínima: 1 minuto')
    .max(480, 'Duração máxima: 480 minutos')
    .optional(),
  is_required: z.boolean().default(true),
  order_index: z.coerce.number().min(1, 'Ordem deve ser maior que 0'),
})

export type LessonFormValues = z.infer<typeof lessonFormSchema>

// ============================================================================
// ORGANIZATION SCHEMAS
// ============================================================================

export const organizationFormSchema = z.object({
  name: z.string().min(3, minLengthMsg(3)).max(200, maxLengthMsg(200)),
  domain: z
    .string()
    .min(3, minLengthMsg(3))
    .max(100, maxLengthMsg(100))
    .regex(/^[a-z0-9.-]+$/, 'Domínio inválido. Use apenas letras minúsculas, números, pontos e hífens'),
  is_active: z.boolean().default(true),
})

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>

// ============================================================================
// QUIZ SCHEMAS
// ============================================================================

export const quizFormSchema = z.object({
  title: z.string().min(3, minLengthMsg(3)).max(200, maxLengthMsg(200)),
  description: z.string().max(1000, maxLengthMsg(1000)).optional().or(z.literal('')),
  passing_score: z.coerce
    .number()
    .min(0, 'Nota mínima: 0')
    .max(100, 'Nota máxima: 100')
    .default(70),
  time_limit_minutes: z.coerce
    .number()
    .min(5, 'Tempo mínimo: 5 minutos')
    .max(180, 'Tempo máximo: 180 minutos')
    .optional(),
  max_attempts: z.coerce
    .number()
    .min(1, 'Mínimo: 1 tentativa')
    .max(10, 'Máximo: 10 tentativas')
    .optional(),
})

export type QuizFormValues = z.infer<typeof quizFormSchema>

// ============================================================================
// QUESTION SCHEMAS
// ============================================================================

export const questionFormSchema = z.object({
  question_text: z.string().min(10, minLengthMsg(10)).max(1000, maxLengthMsg(1000)),
  question_type: z.enum(['multiple_choice', 'true_false'], {
    message: 'Selecione um tipo',
  }),
  options: z
    .array(z.string().min(1, 'Opção não pode estar vazia'))
    .min(2, 'Mínimo de 2 opções')
    .max(6, 'Máximo de 6 opções'),
  correct_answer: z.string().min(1, 'Selecione a resposta correta'),
  explanation: z.string().max(500, maxLengthMsg(500)).optional().or(z.literal('')),
  points: z.coerce.number().min(1, 'Mínimo: 1 ponto').max(100, 'Máximo: 100 pontos').default(1),
  order_index: z.coerce.number().min(1, 'Ordem deve ser maior que 0'),
})

export type QuestionFormValues = z.infer<typeof questionFormSchema>

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Formata erros do Zod para exibição amigável
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}
  error.issues.forEach((err) => {
    const path = err.path.join('.')
    formatted[path] = err.message
  })
  return formatted
}

/**
 * Valida dados com schema Zod e retorna resultado tipado
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return {
    success: false,
    errors: formatZodErrors(result.error),
  }
}
