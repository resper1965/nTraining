// ============================================================================
// Auth Service Layer
// ============================================================================
// Lógica de negócio e acesso ao banco de dados para autenticação
// REGRAS:
// - NUNCA recebe FormData, apenas objetos tipados (DTOs)
// - NUNCA usa redirect() ou revalidatePath()
// - Retorna dados puros ou lança erros tipados
// - Centraliza criação de profile após signup

import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@/lib/types/database'
import type {
  SignInInput,
  SignUpInput,
  CreateUserInput,
} from '@/lib/validators/auth.schema'

// ============================================================================
// Types
// ============================================================================

export interface SignInResult {
  user: User
  redirectPath: string
  isFirstLogin: boolean
}

export interface SignUpResult {
  userId: string
  email: string
}

export interface CreateUserResult {
  userId: string
  email: string
}

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'AuthServiceError'
  }
}

// ============================================================================
// Auth Service Class
// ============================================================================

export class AuthService {
  private supabase: SupabaseClient

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || createClient()
  }

  // ============================================================================
  // SIGN IN
  // ============================================================================

  /**
   * Autentica usuário e retorna informações para redirecionamento
   * Atualiza last_login_at e cria notificação de boas-vindas se primeiro login
   */
  async signIn(input: SignInInput): Promise<SignInResult> {
    // 1. Autenticar no Supabase Auth
    const { data: authData, error: authError } =
      await this.supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      })

    if (authError) {
      // Mensagens de erro mais específicas
      let errorMessage = authError.message
      
      if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.'
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.'
      } else if (authError.message.includes('User not found')) {
        errorMessage = 'Usuário não encontrado. Verifique se o email está correto.'
      }
      
      throw new AuthServiceError(
        errorMessage,
        'AUTH_ERROR',
        authError
      )
    }

    if (!authData.user) {
      throw new AuthServiceError('Falha na autenticação', 'AUTH_FAILED')
    }

    // 2. Buscar dados completos do usuário
    const { data: userData, error: userDataError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (userDataError || !userData) {
      // Log detalhado para debug (apenas em desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        console.error('User profile not found:', {
          authUserId: authData.user.id,
          email: input.email,
          error: userDataError,
        })
      }
      
      // Se usuário não existe na tabela users, é um estado inválido
      throw new AuthServiceError(
        'Perfil de usuário não encontrado. Entre em contato com o suporte.',
        'USER_PROFILE_NOT_FOUND',
        userDataError
      )
    }

    const user = userData as User
    const isFirstLogin = !user.last_login_at

    // 3. Atualizar last_login_at
    await this.supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    // 4. Criar notificação de boas-vindas se for primeiro login
    if (isFirstLogin) {
      try {
        const { notifyWelcome } = await import('@/lib/notifications/triggers')
        await notifyWelcome(user.id, user.full_name || user.email)
      } catch (notifError) {
        // Não falhar o login se notificação falhar
        console.error('Error creating welcome notification:', notifError)
      }
    }

    // 5. Determinar caminho de redirecionamento
    const redirectPath = this.getRedirectPath(user, input.redirectTo)

    return {
      user,
      redirectPath,
      isFirstLogin,
    }
  }

  /**
   * Determina o caminho de redirecionamento baseado no status do usuário
   * REGRA: Superadmins SEMPRE vão para /admin, mesmo se is_active = false
   */
  private getRedirectPath(user: User, customRedirect?: string | null): string {
    // Se há redirect customizado e usuário está ativo, usar ele
    if (customRedirect && user.is_active) {
      return customRedirect
    }

    // Superadmins SEMPRE vão para /admin
    if (user.is_superadmin) {
      return '/admin'
    }

    // Usuários pendentes vão para waiting room
    if (!user.is_active) {
      return '/auth/waiting-room'
    }

    // Usuários ativos vão para dashboard
    return '/dashboard'
  }

  // ============================================================================
  // SIGN UP (Cadastro Público)
  // ============================================================================

  /**
   * Cria usuário no Supabase Auth e na tabela users
   * Usuário criado com is_active = false (pendente de aprovação)
   */
  async signUp(input: SignUpInput): Promise<SignUpResult> {
    // 1. Verificar se organização existe
    const { data: org, error: orgError } = await this.supabase
      .from('organizations')
      .select('id')
      .eq('id', input.organizationId)
      .single()

    if (orgError || !org) {
      throw new AuthServiceError(
        'Organização inválida',
        'ORGANIZATION_NOT_FOUND',
        orgError
      )
    }

    // 2. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          full_name: input.fullName,
        },
      },
    })

    if (authError) {
      throw new AuthServiceError(
        authError.message,
        'AUTH_ERROR',
        authError
      )
    }

    if (!authData.user) {
      throw new AuthServiceError(
        'Erro ao criar conta. Tente novamente.',
        'USER_CREATION_FAILED'
      )
    }

    // 3. Criar registro na tabela users com is_active = false (pendente)
    const { error: userError } = await this.supabase.from('users').insert({
      id: authData.user.id,
      email: input.email,
      full_name: input.fullName,
      role: 'student',
      organization_id: input.organizationId,
      is_active: false, // Pendente de aprovação
    })

    if (userError) {
      // Se falhar ao criar na tabela users, tentar limpar o usuário do Auth
      // Nota: Não podemos deletar sem service role, mas logamos o erro
      console.error('Error creating user profile:', userError)
      throw new AuthServiceError(
        'Erro ao criar perfil. Entre em contato com o suporte.',
        'PROFILE_CREATION_FAILED',
        userError
      )
    }

    return {
      userId: authData.user.id,
      email: input.email,
    }
  }

  // ============================================================================
  // CREATE USER (Admin Only - via Service Role)
  // ============================================================================

  /**
   * Cria usuário via Admin API (service role)
   * Usuário criado com is_active = true (já aprovado)
   */
  async createUser(input: CreateUserInput): Promise<CreateUserResult> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      throw new AuthServiceError(
        'Configuração do servidor incompleta. Verifique SUPABASE_SERVICE_ROLE_KEY.',
        'CONFIG_ERROR'
      )
    }

    // Criar cliente com service role para operações admin
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createServiceClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // 1. Criar usuário no Supabase Auth usando admin API
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true, // Auto-confirmar email
        user_metadata: {
          full_name: input.fullName,
        },
      })

    if (authError || !authData.user) {
      throw new AuthServiceError(
        `Erro ao criar usuário: ${authError?.message || 'Erro desconhecido'}`,
        'AUTH_ERROR',
        authError
      )
    }

    // 2. Criar registro na tabela users
    const { error: userError } = await supabaseAdmin.from('users').insert({
      id: authData.user.id,
      email: input.email,
      full_name: input.fullName,
      role: input.role,
      organization_id: input.organizationId,
      is_active: true, // Admin cria usuário já ativo
      is_superadmin: input.isSuperadmin,
    })

    if (userError) {
      // Se falhar ao criar na tabela users, tentar deletar do auth
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      } catch (deleteError) {
        console.error('Error deleting user from auth after profile creation failure:', deleteError)
      }

      throw new AuthServiceError(
        `Erro ao criar perfil do usuário: ${userError.message}`,
        'PROFILE_CREATION_FAILED',
        userError
      )
    }

    return {
      userId: authData.user.id,
      email: input.email,
    }
  }

  // ============================================================================
  // SIGN OUT
  // ============================================================================

  /**
   * Faz logout do usuário
   */
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut()

    if (error) {
      throw new AuthServiceError(
        `Erro ao fazer logout: ${error.message}`,
        'SIGNOUT_ERROR',
        error
      )
    }
  }
}
