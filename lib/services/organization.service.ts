// ============================================================================
// Organization Service Layer
// ============================================================================
// Lógica de negócio e acesso ao banco de dados para organizações
// REGRAS:
// - NUNCA recebe FormData, apenas objetos tipados (DTOs)
// - NUNCA usa redirect() ou revalidatePath()
// - Retorna dados puros ou lança erros tipados
// - Garante isolamento RLS nas queries

import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Organization } from '@/lib/types/database'
import type {
  OrganizationFiltersInput,
  OrganizationUpdateInput,
} from '@/lib/validators/organization.schema'

// ============================================================================
// Types
// ============================================================================

export interface OrganizationWithCount extends Organization {
  users_count: number
  courses_count?: number
}

export class OrganizationServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'OrganizationServiceError'
  }
}

// ============================================================================
// Organization Service Class
// ============================================================================

export class OrganizationService {
  private supabase: SupabaseClient

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || createClient()
  }

  // ============================================================================
  // GET ORGANIZATIONS
  // ============================================================================

  /**
   * Busca organizações públicas (para signup)
   * Não requer autenticação
   */
  async getPublicOrganizations(): Promise<Array<{ id: string; name: string; slug: string }>> {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('id, name, slug')
      .order('name', { ascending: true })

    if (error) {
      throw new OrganizationServiceError(
        `Erro ao buscar organizações: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return (data || []) as Array<{ id: string; name: string; slug: string }>
  }

  /**
   * Busca todas as organizações com filtros (superadmin only)
   * CORREÇÃO DE SEGURANÇA: Busca segura sem SQL Injection
   */
  async getAllOrganizations(
    filters?: OrganizationFiltersInput
  ): Promise<OrganizationWithCount[]> {
    let query = this.supabase
      .from('organizations')
      .select(
        `
        *,
        users:users(count)
      `
      )

    // Aplicar filtros
    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'active') {
        query = query.eq('subscription_status', 'active')
      } else {
        query = query.or('subscription_status.is.null,subscription_status.neq.active')
      }
    }

    // Sort
    const sortBy = filters?.sortBy || 'created_at'
    const sortOrder = filters?.sortOrder || 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    const { data, error } = await query

    if (error) {
      throw new OrganizationServiceError(
        `Erro ao buscar organizações: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    // CORREÇÃO DE SEGURANÇA: Busca segura em memória (sem SQL Injection)
    let filteredData = data || []

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredData = filteredData.filter(
        (org: any) =>
          org.name?.toLowerCase().includes(searchLower) ||
          org.razao_social?.toLowerCase().includes(searchLower) ||
          org.cnpj?.toLowerCase().includes(searchLower)
      )
    }

    // Transform data to include users count
    const organizations = filteredData.map((org: any) => ({
      ...org,
      users_count: Array.isArray(org.users) ? org.users[0]?.count || 0 : 0,
    }))

    return organizations as OrganizationWithCount[]
  }

  async getOrganizationById(organizationId: string): Promise<OrganizationWithCount> {
    const { data, error } = await this.supabase
      .from('organizations')
      .select(
        `
        *,
        users:users(count),
        courses:organization_course_access(count)
      `
      )
      .eq('id', organizationId)
      .single()

    if (error) {
      throw new OrganizationServiceError(
        `Erro ao buscar organização: ${error.message}`,
        'ORGANIZATION_NOT_FOUND',
        error
      )
    }

    if (!data) {
      throw new OrganizationServiceError('Organização não encontrada', 'ORGANIZATION_NOT_FOUND')
    }

    return {
      ...data,
      users_count: Array.isArray(data.users) ? data.users[0]?.count || 0 : 0,
      courses_count: Array.isArray(data.courses) ? data.courses[0]?.count || 0 : 0,
    } as OrganizationWithCount
  }

  async getOrganizationUsers(organizationId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new OrganizationServiceError(
        `Erro ao buscar usuários da organização: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data || []
  }

  async getOrganizationCourses(organizationId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('organization_course_access')
      .select(
        `
        *,
        courses:courses(*)
      `
      )
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new OrganizationServiceError(
        `Erro ao buscar cursos da organização: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data || []
  }

  async updateOrganization(
    organizationId: string,
    input: OrganizationUpdateInput
  ): Promise<Organization> {
    // Verificar se organização existe
    const { data: existing } = await this.supabase
      .from('organizations')
      .select('id')
      .eq('id', organizationId)
      .single()

    if (!existing) {
      throw new OrganizationServiceError(
        'Organização não encontrada',
        'ORGANIZATION_NOT_FOUND'
      )
    }

    // Preparar dados para atualização
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (input.name !== undefined) updateData.name = input.name
    if (input.slug !== undefined) updateData.slug = input.slug
    if (input.cnpj !== undefined) updateData.cnpj = input.cnpj
    if (input.razao_social !== undefined) updateData.razao_social = input.razao_social
    if (input.industry !== undefined) updateData.industry = input.industry
    if (input.employee_count !== undefined) updateData.employee_count = input.employee_count
    if (input.logo_url !== undefined) updateData.logo_url = input.logo_url
    if (input.max_users !== undefined) updateData.max_users = input.max_users
    if (input.settings !== undefined) updateData.settings = input.settings

    const { data, error } = await this.supabase
      .from('organizations')
      .update(updateData)
      .eq('id', organizationId)
      .select()
      .single()

    if (error) {
      throw new OrganizationServiceError(
        `Erro ao atualizar organização: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data as Organization
  }

  async deleteOrganization(organizationId: string): Promise<void> {
    // Verificar se organização existe
    const { data: existing } = await this.supabase
      .from('organizations')
      .select('id')
      .eq('id', organizationId)
      .single()

    if (!existing) {
      throw new OrganizationServiceError(
        'Organização não encontrada',
        'ORGANIZATION_NOT_FOUND'
      )
    }

    const { error } = await this.supabase
      .from('organizations')
      .delete()
      .eq('id', organizationId)

    if (error) {
      throw new OrganizationServiceError(
        `Erro ao deletar organização: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }
  }
}
