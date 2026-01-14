// ============================================================================
// Course Service Layer
// ============================================================================
// Lógica de negócio e acesso ao banco de dados para cursos
// REGRAS:
// - NUNCA recebe FormData, apenas objetos tipados (DTOs)
// - NUNCA usa redirect() ou revalidatePath()
// - Retorna dados puros ou lança erros tipados
// - Queries seguras (sem SQL Injection)

import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Course,
  CourseWithModules,
  CourseWithProgress,
  CourseFilters,
} from '@/lib/types/database'
import type {
  CourseCreateInput,
  CourseUpdateInput,
  CourseFiltersInput,
} from '@/lib/validators/course.schema'

// ============================================================================
// Types
// ============================================================================

export interface CourseServiceOptions {
  supabase?: SupabaseClient
  userId: string
  organizationId: string | null
  isSuperadmin: boolean
}

export class CourseServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'CourseServiceError'
  }
}

// ============================================================================
// Course Service Class
// ============================================================================

export class CourseService {
  private supabase: SupabaseClient
  private userId: string
  private organizationId: string | null
  private isSuperadmin: boolean

  constructor(options: CourseServiceOptions) {
    this.supabase = options.supabase || createClient()
    this.userId = options.userId
    this.organizationId = options.organizationId
    this.isSuperadmin = options.isSuperadmin
  }

  // ============================================================================
  // GET COURSES
  // ============================================================================

  /**
   * Busca cursos com filtros
   * Superadmins veem todos os cursos, usuários normais veem apenas da sua organização
   */
  async getCourses(filters?: CourseFiltersInput): Promise<Course[]> {
    try {
      if (this.isSuperadmin) {
        return await this.getCoursesForSuperadmin(filters)
      }

      // Usuários normais: buscar via organization_course_access
      if (!this.organizationId) {
        return [] // Sem organização, sem cursos
      }

      return await this.getCoursesForOrganization(filters)
    } catch (error) {
      throw new CourseServiceError(
        'Falha ao buscar cursos',
        'GET_COURSES_ERROR',
        error
      )
    }
  }

  /**
   * Busca cursos para superadmin (todos os cursos)
   */
  private async getCoursesForSuperadmin(
    filters?: CourseFiltersInput
  ): Promise<Course[]> {
    let query = this.supabase
      .from('courses')
      .select(
        'id, title, slug, description, thumbnail_url, level, area, duration_hours, status, is_public, created_at, organization_id'
      )
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (filters?.area) {
      query = query.eq('area', filters.area)
    }

    if (filters?.level) {
      query = query.eq('level', filters.level)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    } else {
      query = query.eq('status', 'published')
    }

    if (filters?.is_public !== undefined) {
      query = query.eq('is_public', filters.is_public)
    }

    const { data, error } = await query

    // CORREÇÃO DE SEGURANÇA: Busca segura em memória (sem SQL Injection)
    // Filtra resultados após buscar do banco, evitando interpolação de string em queries
    let filteredData = data || []
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredData = filteredData.filter(
        (course: any) =>
          course.title?.toLowerCase().includes(searchLower) ||
          course.description?.toLowerCase().includes(searchLower)
      )
    }

    if (error) {
      throw new CourseServiceError(
        `Erro ao buscar cursos: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return filteredData as Course[]
  }

  /**
   * Busca cursos para organização (via organization_course_access)
   */
  private async getCoursesForOrganization(
    filters?: CourseFiltersInput
  ): Promise<Course[]> {
    if (!this.organizationId) {
      return []
    }

    // Buscar cursos disponíveis para a organização
    let accessQuery = this.supabase
      .from('organization_course_access')
      .select(
        `
        *,
        courses (
          id, title, slug, description, thumbnail_url, level, area, duration_hours, status, is_public, created_at, organization_id
        )
      `
      )
      .eq('organization_id', this.organizationId)
      .or('valid_until.is.null,valid_until.gt.now()') // Apenas cursos válidos

    // Aplicar filtro de status no curso
    if (filters?.status) {
      accessQuery = accessQuery.eq('courses.status', filters.status)
    } else {
      accessQuery = accessQuery.eq('courses.status', 'published')
    }

    const { data: accessData, error: accessError } = await accessQuery

    if (accessError) {
      throw new CourseServiceError(
        `Erro ao buscar cursos da organização: ${accessError.message}`,
        'SUPABASE_ERROR',
        accessError
      )
    }

    // Extrair cursos e aplicar filtros adicionais
    let courses = (accessData || [])
      .map((access: any) => access.courses)
      .filter((course: any) => course !== null) as Course[]

    // Aplicar filtros restantes (client-side para evitar queries complexas)
    if (filters?.area) {
      courses = courses.filter((c) => c.area === filters.area)
    }

    if (filters?.level) {
      courses = courses.filter((c) => c.level === filters.level)
    }

    if (filters?.is_public !== undefined) {
      courses = courses.filter((c) => c.is_public === filters.is_public)
    }

    // Busca segura (já sanitizada no schema)
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      courses = courses.filter(
        (c) =>
          c.title?.toLowerCase().includes(searchLower) ||
          c.description?.toLowerCase().includes(searchLower)
      )
    }

    return courses
  }

  // ============================================================================
  // GET COURSE BY ID
  // ============================================================================

  async getCourseById(courseId: string): Promise<CourseWithModules> {
    const { data, error } = await this.supabase
      .from('courses')
      .select(
        `
        *,
        modules (
          *,
          lessons (
            *
          )
        )
      `
      )
      .eq('id', courseId)
      .single()

    if (error) {
      throw new CourseServiceError(
        `Erro ao buscar curso: ${error.message}`,
        'COURSE_NOT_FOUND',
        error
      )
    }

    if (!data) {
      throw new CourseServiceError('Curso não encontrado', 'COURSE_NOT_FOUND')
    }

    return data as CourseWithModules
  }

  // ============================================================================
  // GET COURSE BY SLUG
  // ============================================================================

  async getCourseBySlug(slug: string): Promise<CourseWithModules> {
    const { data, error } = await this.supabase
      .from('courses')
      .select(
        `
        *,
        modules (
          *,
          lessons (
            *
          )
        )
      `
      )
      .eq('slug', slug)
      .single()

    if (error) {
      throw new CourseServiceError(
        `Erro ao buscar curso: ${error.message}`,
        'COURSE_NOT_FOUND',
        error
      )
    }

    if (!data) {
      throw new CourseServiceError('Curso não encontrado', 'COURSE_NOT_FOUND')
    }

    return data as CourseWithModules
  }

  // ============================================================================
  // GET COURSES WITH PROGRESS
  // ============================================================================

  async getCoursesWithProgress(
    filters?: CourseFiltersInput
  ): Promise<CourseWithProgress[]> {
    const courses = await this.getCourses(filters)

    if (courses.length === 0) {
      return []
    }

    // Buscar progresso para todos os cursos
    const { data: progressData, error: progressError } = await this.supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', this.userId)
      .in(
        'course_id',
        courses.map((c) => c.id)
      )

    if (progressError) {
      throw new CourseServiceError(
        `Erro ao buscar progresso: ${progressError.message}`,
        'SUPABASE_ERROR',
        progressError
      )
    }

    // Buscar informações de acesso da organização (para personalizações)
    let accessData: any[] = []
    if (this.organizationId) {
      const { data, error: accessError } = await this.supabase
        .from('organization_course_access')
        .select('*')
        .eq('organization_id', this.organizationId)
        .in(
          'course_id',
          courses.map((c) => c.id)
        )

      if (accessError) {
        // Não falhar se não conseguir buscar acesso, apenas logar
        console.error('Erro ao buscar acesso de organização:', accessError)
      } else {
        accessData = data || []
      }
    }

    // Merge progress com courses e aplicar personalizações
    const coursesWithProgress = courses.map((course) => {
      const progress = progressData?.find((p: any) => p.course_id === course.id)
      const access = accessData.find((a: any) => a.course_id === course.id)

      // Aplicar personalizações se houver
      const displayTitle = access?.custom_title || course.title
      const displayDescription = access?.custom_description || course.description
      const displayThumbnail = access?.custom_thumbnail_url || course.thumbnail_url

      return {
        ...course,
        title: displayTitle,
        description: displayDescription,
        thumbnail_url: displayThumbnail,
        progress: progress || undefined,
        access: access || undefined,
      }
    }) as CourseWithProgress[]

    return coursesWithProgress
  }

  // ============================================================================
  // CREATE COURSE
  // ============================================================================

  async createCourse(input: CourseCreateInput): Promise<Course> {
    // Verificar se slug já existe
    const { data: existing } = await this.supabase
      .from('courses')
      .select('id')
      .eq('slug', input.slug)
      .single()

    if (existing) {
      throw new CourseServiceError(
        'Já existe um curso com este slug',
        'SLUG_ALREADY_EXISTS'
      )
    }

    // Preparar dados para inserção
    const insertData = {
      title: input.title,
      slug: input.slug,
      description: input.description,
      objectives: input.objectives,
      thumbnail_url: input.thumbnail_url,
      level: input.level,
      area: input.area,
      duration_hours: input.duration_hours,
      status: input.status,
      is_public: input.is_public,
      created_by: this.userId,
      organization_id: this.organizationId,
    }

    const { data, error } = await this.supabase
      .from('courses')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      throw new CourseServiceError(
        `Erro ao criar curso: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data as Course
  }

  // ============================================================================
  // UPDATE COURSE
  // ============================================================================

  async updateCourse(
    courseId: string,
    input: CourseUpdateInput
  ): Promise<Course> {
    // Verificar se curso existe
    const { data: existing, error: fetchError } = await this.supabase
      .from('courses')
      .select('id, slug')
      .eq('id', courseId)
      .single()

    if (fetchError || !existing) {
      throw new CourseServiceError(
        'Curso não encontrado',
        'COURSE_NOT_FOUND',
        fetchError
      )
    }

    // Se slug está sendo atualizado, verificar se já existe
    if (input.slug && input.slug !== existing.slug) {
      const { data: slugExists } = await this.supabase
        .from('courses')
        .select('id')
        .eq('slug', input.slug)
        .single()

      if (slugExists) {
        throw new CourseServiceError(
          'Já existe um curso com este slug',
          'SLUG_ALREADY_EXISTS'
        )
      }
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: Record<string, any> = {}

    if (input.title !== undefined) updateData.title = input.title
    if (input.slug !== undefined) updateData.slug = input.slug
    if (input.description !== undefined) updateData.description = input.description
    if (input.objectives !== undefined) updateData.objectives = input.objectives
    if (input.thumbnail_url !== undefined) updateData.thumbnail_url = input.thumbnail_url
    if (input.level !== undefined) updateData.level = input.level
    if (input.area !== undefined) updateData.area = input.area
    if (input.duration_hours !== undefined) updateData.duration_hours = input.duration_hours
    if (input.status !== undefined) updateData.status = input.status
    if (input.is_public !== undefined) updateData.is_public = input.is_public

    const { data, error } = await this.supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId)
      .select()
      .single()

    if (error) {
      throw new CourseServiceError(
        `Erro ao atualizar curso: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data as Course
  }

  // ============================================================================
  // PUBLISH COURSE
  // ============================================================================

  async publishCourse(courseId: string): Promise<Course> {
    const { data, error } = await this.supabase
      .from('courses')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', courseId)
      .select()
      .single()

    if (error) {
      throw new CourseServiceError(
        `Erro ao publicar curso: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    if (!data) {
      throw new CourseServiceError('Curso não encontrado', 'COURSE_NOT_FOUND')
    }

    return data as Course
  }

  // ============================================================================
  // DELETE COURSE
  // ============================================================================

  async deleteCourse(courseId: string): Promise<void> {
    const { error } = await this.supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (error) {
      throw new CourseServiceError(
        `Erro ao deletar curso: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }
  }

  // ============================================================================
  // ENROLL IN COURSE
  // ============================================================================

  async enrollInCourse(courseId: string): Promise<any> {
    // Verificar se curso está disponível para a organização do usuário
    if (this.organizationId) {
      const { data: access, error: accessError } = await this.supabase
        .from('organization_course_access')
        .select('*')
        .eq('organization_id', this.organizationId)
        .eq('course_id', courseId)
        .single()

      if (accessError || !access) {
        throw new CourseServiceError(
          'Curso não disponível para sua organização',
          'COURSE_NOT_AVAILABLE',
          accessError
        )
      }

      // Verificar validade
      if (access.valid_until && new Date(access.valid_until) < new Date()) {
        throw new CourseServiceError('Acesso ao curso expirado', 'COURSE_EXPIRED')
      }

      // Verificar licenças disponíveis (se não for ilimitado)
      if (access.access_type === 'licensed' && access.total_licenses !== null) {
        if (access.used_licenses >= access.total_licenses) {
          throw new CourseServiceError(
            'Sem licenças disponíveis. Entre em contato com o administrador.',
            'NO_LICENSES_AVAILABLE'
          )
        }
      }
    }

    // Verificar se já está inscrito
    const { data: existing } = await this.supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', this.userId)
      .eq('course_id', courseId)
      .single()

    if (existing) {
      return existing
    }

    // Criar registro de progresso
    const { data, error } = await this.supabase
      .from('user_course_progress')
      .insert({
        user_id: this.userId,
        course_id: courseId,
        status: 'not_started',
        completion_percentage: 0,
      })
      .select()
      .single()

    if (error) {
      throw new CourseServiceError(
        `Erro ao inscrever no curso: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    // Criar atribuição se não existir
    if (this.organizationId) {
      await this.supabase.from('organization_course_assignments').upsert(
        {
          organization_id: this.organizationId,
          course_id: courseId,
          user_id: this.userId,
          assignment_type: 'manual',
          is_mandatory: false,
        },
        { onConflict: 'organization_id,course_id,user_id' }
      )
    }

    return data
  }

  // ============================================================================
  // GET COURSE AREAS
  // ============================================================================

  async getCourseAreas(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('area')
      .not('area', 'is', null)
      .eq('status', 'published')

    if (error) {
      throw new CourseServiceError(
        `Erro ao buscar áreas: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    // Obter áreas únicas
    const uniqueAreas = [
      ...new Set(data.map((c: any) => c.area).filter(Boolean)),
    ]
    return uniqueAreas as string[]
  }
}
