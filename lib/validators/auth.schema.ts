// ============================================================================
// Auth Validation Schemas
// ============================================================================
// Schemas Zod para validação de dados de autenticação

import { z } from 'zod'

// ============================================================================
// Enums e Constantes
// ============================================================================

export const UserRoleSchema = z.enum(['platform_admin', 'org_manager', 'student'])

// ============================================================================
// Schema de Sign In
// ============================================================================

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Senha é obrigatória'),

  redirectTo: z
    .string()
    .url('URL de redirecionamento inválida')
    .optional()
    .nullable()
    .transform((val) => val || null),
})

// ============================================================================
// Schema de Sign Up (Cadastro Público)
// ============================================================================

export const SignUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'
    ),

  fullName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .trim(),

  organizationId: z
    .string()
    .uuid('ID de organização inválido')
    .min(1, 'Organização é obrigatória'),
})

// ============================================================================
// Schema de Create User (Admin Only)
// ============================================================================

export const CreateUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'
    ),

  fullName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .trim(),

  role: UserRoleSchema.default('student'),

  organizationId: z
    .string()
    .uuid('ID de organização inválido')
    .nullable()
    .optional()
    .transform((val) => val || null),

  isSuperadmin: z
    .boolean()
    .default(false),
})

// ============================================================================
// Tipos Inferidos (exportados para uso em outras camadas)
// ============================================================================

export type SignInInput = z.infer<typeof SignInSchema>
export type SignUpInput = z.infer<typeof SignUpSchema>
export type CreateUserInput = z.infer<typeof CreateUserSchema>

// ============================================================================
// Helpers de Validação
// ============================================================================

/**
 * Valida dados de login
 * @throws {z.ZodError} Se validação falhar
 */
export function validateSignIn(data: unknown): SignInInput {
  return SignInSchema.parse(data)
}

/**
 * Valida dados de cadastro (safe parse)
 */
export function validateSignUp(
  data: unknown
): { success: true; data: SignUpInput } | { success: false; error: z.ZodError } {
  const result = SignUpSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

/**
 * Valida dados de criação de usuário (admin)
 * @throws {z.ZodError} Se validação falhar
 */
export function validateCreateUser(data: unknown): CreateUserInput {
  return CreateUserSchema.parse(data)
}
