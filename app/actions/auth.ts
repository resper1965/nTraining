'use server'

// ============================================================================
// Auth Server Actions (Refatorado)
// ============================================================================
// Esta camada apenas orquestra: Auth → Validação → Service → Response
// Toda lógica de negócio está em AuthService
// Toda validação está em auth.schema.ts

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireSuperAdmin, getCurrentUser } from '@/lib/auth/helpers'
import { AuthService, AuthServiceError } from '@/lib/services/auth.service'
import {
  validateSignIn,
  validateSignUp,
  validateCreateUser,
  type SignInInput,
  type SignUpInput,
  type CreateUserInput,
} from '@/lib/validators/auth.schema'
import { ZodError } from 'zod'

// ============================================================================
// Error Types
// ============================================================================

export interface AuthActionError {
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

// ============================================================================
// SIGN IN
// ============================================================================

export async function signIn(formData: FormData) {
  try {
    // 1. Extrair dados do FormData
    const rawInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirectTo: formData.get('redirect') as string | null,
    }

    // 2. Validação
    let validatedInput: SignInInput
    try {
      validatedInput = validateSignIn(rawInput)
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        const firstErrorArray = Object.values(fieldErrors)[0]
        const firstError = (Array.isArray(firstErrorArray) ? firstErrorArray[0] : undefined) || 'Dados inválidos'
        redirect(`/auth/login?error=${encodeURIComponent(firstError)}&redirect=${encodeURIComponent(rawInput.redirectTo || '')}`)
      }
      throw error
    }

    // 3. Service Call
    const service = new AuthService()
    const result = await service.signIn(validatedInput)

    // 4. Response/Effect
    revalidatePath('/')
    redirect(result.redirectPath)
  } catch (error) {
    if (error instanceof AuthServiceError) {
      const redirectTo = formData.get('redirect') as string | null
      redirect(
        `/auth/login?error=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectTo || '')}`
      )
      return
    }

    // Erro desconhecido
    const redirectTo = formData.get('redirect') as string | null
    redirect(
      `/auth/login?error=${encodeURIComponent('Erro ao fazer login. Tente novamente.')}&redirect=${encodeURIComponent(redirectTo || '')}`
    )
  }
}

// ============================================================================
// SIGN OUT
// ============================================================================

export async function signOut() {
  try {
    // 1. Service Call (sem validação adicional)
    const service = new AuthService()
    await service.signOut()

    // 2. Response/Effect
    revalidatePath('/')
    redirect('/')
  } catch (error) {
    // Mesmo se signOut falhar, redirecionar para home
    // (pode ser que a sessão já tenha expirado)
    revalidatePath('/')
    redirect('/')
  }
}

// ============================================================================
// SIGN UP (Public - creates user with pending approval)
// ============================================================================

export async function signUp(formData: FormData) {
  try {
    // 1. Extrair dados do FormData
    const rawInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
      organizationId: formData.get('organizationId') as string | null,
    }

    // 2. Validação
    const validation = validateSignUp(rawInput)
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      const firstErrorArray = Object.values(fieldErrors)[0]
      const firstError = (Array.isArray(firstErrorArray) ? firstErrorArray[0] : undefined) || 'Dados inválidos'
      redirect(`/auth/signup?error=${encodeURIComponent(firstError)}`)
    }

    // 3. Service Call
    const service = new AuthService()
    await service.signUp(validation.data)

    // 4. Response/Effect
    redirect('/auth/waiting-room')
  } catch (error) {
    if (error instanceof AuthServiceError) {
      redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
      return
    }

    // Erro desconhecido
    redirect('/auth/signup?error=Erro ao criar conta. Tente novamente.')
  }
}

// ============================================================================
// CREATE USER (Admin only - creates user directly in database)
// ============================================================================

export async function createUser(formData: FormData) {
  try {
    // 1. Auth Check
    await requireSuperAdmin()

    // 2. Extrair dados do FormData
    const rawInput = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
      role: (formData.get('role') as string) || 'student',
      organizationId: formData.get('organizationId') as string | null,
      isSuperadmin: formData.get('isSuperadmin') === 'true',
    }

    // 3. Validação
    let validatedInput: CreateUserInput
    try {
      validatedInput = validateCreateUser(rawInput)
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        const firstErrorArray = Object.values(fieldErrors)[0]
        const firstError = (Array.isArray(firstErrorArray) ? firstErrorArray[0] : undefined) || 'Dados inválidos'
        throw new Error(firstError)
      }
      throw error
    }

    // 4. Service Call
    const service = new AuthService()
    const result = await service.createUser(validatedInput)

    // 5. Log de atividade (opcional, não bloqueia)
    try {
      const { logUserCreated } = await import('@/app/actions/activity-logs')
      const currentUser = await getCurrentUser()
      if (currentUser) {
        await logUserCreated(
          currentUser.id,
          result.userId,
          result.email,
          validatedInput.organizationId
        )
      }
    } catch (logError) {
      console.error('Error logging user creation:', logError)
      // Não falhar a criação se log falhar
    }

    // 6. Response/Effect
    revalidatePath('/admin/users')
    return { success: true, userId: result.userId }
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw new Error(error.message)
    }

    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors
      const firstErrorArray = Object.values(fieldErrors)[0]
      const firstError = (Array.isArray(firstErrorArray) ? firstErrorArray[0] : undefined) || 'Dados inválidos'
      throw new Error(firstError)
    }

    // Re-throw outros erros
    throw error
  }
}
