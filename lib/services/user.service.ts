// ============================================================================
// User Service Layer
// ============================================================================
// Lógica de negócio e acesso ao banco de dados para usuários
// REGRAS:
// - NUNCA recebe FormData, apenas objetos tipados (DTOs)
// - NUNCA usa redirect() ou revalidatePath()
// - Retorna dados puros ou lança erros tipados
// - Paginação segura implementada

import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@/lib/types/database'
import type { UserFiltersInput, UserIdInput } from '@/lib/validators/user.schema'

// ============================================================================
// Types
// ============================================================================

export interface GetUsersResult {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PendingUser {
  id: string
  full_name: string | null
  email: string
  role: 'platform_admin' | 'org_manager' | 'student'
  created_at: string
  organization_id: string | null
}

export class UserServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'UserServiceError'
  }
}

// ============================================================================
// User Service Class
// ============================================================================

export class UserService {
  private supabase: SupabaseClient

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || createClient()
  }

  // ============================================================================
  // GET USERS (com filtros e paginação)
  // ============================================================================

  /**
   * Busca usuários com filtros e paginação
   * Apenas superadmins podem ver todos os usuários
   */
  async getUsers(filters?: UserFiltersInput): Promise<GetUsersResult> {
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const offset = (page - 1) * limit

    let query = this.supabase
      .from('users')
      .select('*', { count: 'exact' })

    // Aplicar filtros
    if (filters?.organization_id) {
      query = query.eq('organization_id', filters.organization_id)
    }

    if (filters?.role) {
      query = query.eq('role', filters.role)
    }

    if (filters?.department) {
      query = query.eq('department', filters.department)
    }

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    // CORREÇÃO DE SEGURANÇA: Busca segura em memória (sem SQL Injection)
    // Aplicar busca após buscar dados do banco
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new UserServiceError(
        `Erro ao buscar usuários: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    let filteredData = data || []

    // Busca segura em memória (já sanitizada no schema)
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredData = filteredData.filter(
        (user: any) =>
          user.email?.toLowerCase().includes(searchLower) ||
          user.full_name?.toLowerCase().includes(searchLower)
      )
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      users: filteredData as User[],
      total,
      page,
      limit,
      totalPages,
    }
  }

  // ============================================================================
  // GET PENDING USERS
  // ============================================================================

  /**
   * Busca usuários pendentes de aprovação (is_active = false)
   */
  async getPendingUsers(): Promise<PendingUser[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, full_name, email, role, created_at, organization_id')
      .eq('is_active', false)
      .order('created_at', { ascending: false })

    if (error) {
      throw new UserServiceError(
        `Erro ao buscar usuários pendentes: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return (data || []) as PendingUser[]
  }

  // ============================================================================
  // APPROVE USER
  // ============================================================================

  /**
   * Aprova um usuário pendente (define is_active = true)
   */
  async approveUser(userId: UserIdInput): Promise<void> {
    // Verificar se usuário existe
    const { data: existing, error: fetchError } = await this.supabase
      .from('users')
      .select('id, is_active')
      .eq('id', userId)
      .single()

    if (fetchError || !existing) {
      throw new UserServiceError(
        'Usuário não encontrado',
        'USER_NOT_FOUND',
        fetchError
      )
    }

    // Se já está ativo, não fazer nada
    if (existing.is_active) {
      return
    }

    // Atualizar is_active
    const { error } = await this.supabase
      .from('users')
      .update({ is_active: true })
      .eq('id', userId)

    if (error) {
      throw new UserServiceError(
        `Erro ao aprovar usuário: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    // TODO: Criar notificação de aprovação quando tipo 'user_approved' for adicionado
    // Por enquanto, apenas logamos (opcional, não bloqueia)
    if (process.env.NODE_ENV === 'development') {
      console.log(`User ${userId} approved`)
    }
  }

  // ============================================================================
  // REJECT USER
  // ============================================================================

  /**
   * Rejeita e deleta um usuário pendente
   * Remove da tabela users e do auth.users (via service role)
   */
  async rejectUser(userId: UserIdInput): Promise<void> {
    // 1. Buscar email do usuário antes de deletar
    const { data: userData, error: fetchError } = await this.supabase
      .from('users')
      .select('email, is_active')
      .eq('id', userId)
      .single()

    if (fetchError || !userData) {
      throw new UserServiceError(
        'Usuário não encontrado',
        'USER_NOT_FOUND',
        fetchError
      )
    }

    // 2. Deletar da tabela users (cascade deleta do auth.users também devido ao ON DELETE CASCADE)
    const { error: deleteError } = await this.supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      throw new UserServiceError(
        `Erro ao rejeitar usuário: ${deleteError.message}`,
        'SUPABASE_ERROR',
        deleteError
      )
    }

    // 3. Se necessário, deletar também do auth.users usando service role
    // (garantir limpeza completa mesmo se cascade falhar)
    if (userData.email) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (supabaseUrl && serviceRoleKey) {
          const { createClient: createServiceClient } = await import('@supabase/supabase-js')
          const supabaseAdmin = createServiceClient(supabaseUrl, serviceRoleKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          })

          // Buscar usuário no auth pelo email
          const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
          const authUser = authUsers?.users.find((u) => u.email === userData.email)

          if (authUser) {
            await supabaseAdmin.auth.admin.deleteUser(authUser.id)
          }
        }
      } catch (error) {
        console.error('Error deleting user from auth:', error)
        // Não falhar se não conseguir deletar do auth, já que o cascade deve ter funcionado
        // Mas logamos o erro para debug
      }
    }
  }
}
