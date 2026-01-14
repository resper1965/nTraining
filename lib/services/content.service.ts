// ============================================================================
// Content Service Layer (Modules & Lessons)
// ============================================================================
// Lógica de negócio e acesso ao banco de dados para módulos e aulas
// REGRAS:
// - NUNCA recebe FormData, apenas objetos tipados (DTOs)
// - NUNCA usa redirect() ou revalidatePath()
// - Retorna dados puros ou lança erros tipados
// - Reordenação via transações seguras

import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Module, Lesson } from '@/lib/types/database'
import type {
  ModuleCreateInput,
  ModuleUpdateInput,
  ReorderModulesInput,
  LessonCreateInput,
  LessonUpdateInput,
  ReorderLessonsInput,
} from '@/lib/validators/content.schema'

// ============================================================================
// Types
// ============================================================================

export class ContentServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'ContentServiceError'
  }
}

// ============================================================================
// Content Service Class
// ============================================================================

export class ContentService {
  private supabase: SupabaseClient

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || createClient()
  }

  // ============================================================================
  // MODULES
  // ============================================================================

  async getModulesByCourse(courseId: string): Promise<Module[]> {
    const { data, error } = await this.supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })

    if (error) {
      throw new ContentServiceError(
        `Erro ao buscar módulos: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return (data || []) as Module[]
  }

  async createModule(input: ModuleCreateInput): Promise<Module> {
    // Obter o maior order_index atual
    const { data: existingModules } = await this.supabase
      .from('modules')
      .select('order_index')
      .eq('course_id', input.course_id)
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrderIndex =
      existingModules && existingModules.length > 0
        ? existingModules[0].order_index + 1
        : 0

    const { data, error } = await this.supabase
      .from('modules')
      .insert({
        course_id: input.course_id,
        title: input.title,
        description: input.description,
        order_index: nextOrderIndex,
      })
      .select()
      .single()

    if (error) {
      throw new ContentServiceError(
        `Erro ao criar módulo: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data as Module
  }

  async updateModule(moduleId: string, input: ModuleUpdateInput): Promise<Module> {
    // Verificar se módulo existe
    const { data: existing } = await this.supabase
      .from('modules')
      .select('id')
      .eq('id', moduleId)
      .single()

    if (!existing) {
      throw new ContentServiceError('Módulo não encontrado', 'MODULE_NOT_FOUND')
    }

    const updateData: Record<string, any> = {}
    if (input.title !== undefined) updateData.title = input.title
    if (input.description !== undefined) updateData.description = input.description

    const { data, error } = await this.supabase
      .from('modules')
      .update(updateData)
      .eq('id', moduleId)
      .select()
      .single()

    if (error) {
      throw new ContentServiceError(
        `Erro ao atualizar módulo: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data as Module
  }

  async deleteModule(moduleId: string): Promise<{ courseId: string }> {
    // Obter course_id antes de deletar
    const { data: module, error: fetchError } = await this.supabase
      .from('modules')
      .select('course_id')
      .eq('id', moduleId)
      .single()

    if (fetchError || !module) {
      throw new ContentServiceError(
        'Módulo não encontrado',
        'MODULE_NOT_FOUND',
        fetchError
      )
    }

    const { error } = await this.supabase.from('modules').delete().eq('id', moduleId)

    if (error) {
      throw new ContentServiceError(
        `Erro ao deletar módulo: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return { courseId: module.course_id }
  }

  async reorderModules(input: ReorderModulesInput): Promise<void> {
    // Atualizar order_index de cada módulo (transação simulada com Promise.all)
    const updates = input.module_ids.map((moduleId, index) =>
      this.supabase
        .from('modules')
        .update({ order_index: index })
        .eq('id', moduleId)
        .eq('course_id', input.course_id) // Garantir que módulo pertence ao curso
    )

    const results = await Promise.all(updates)
    const errors = results.filter((r) => r.error)

    if (errors.length > 0) {
      throw new ContentServiceError(
        `Erro ao reordenar módulos: ${errors[0].error?.message}`,
        'SUPABASE_ERROR',
        errors[0].error
      )
    }
  }

  // ============================================================================
  // LESSONS
  // ============================================================================

  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    const { data, error } = await this.supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true })

    if (error) {
      throw new ContentServiceError(
        `Erro ao buscar aulas: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return (data || []) as Lesson[]
  }

  async createLesson(input: LessonCreateInput): Promise<Lesson & { courseId: string }> {
    // Obter o maior order_index atual
    const { data: existingLessons } = await this.supabase
      .from('lessons')
      .select('order_index')
      .eq('module_id', input.module_id)
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrderIndex =
      existingLessons && existingLessons.length > 0
        ? existingLessons[0].order_index + 1
        : 0

    // Obter course_id do módulo
    const { data: module } = await this.supabase
      .from('modules')
      .select('course_id')
      .eq('id', input.module_id)
      .single()

    if (!module) {
      throw new ContentServiceError('Módulo não encontrado', 'MODULE_NOT_FOUND')
    }

    const { data, error } = await this.supabase
      .from('lessons')
      .insert({
        module_id: input.module_id,
        title: input.title,
        content_type: input.content_type,
        content_url: input.content_url,
        content_text: input.content_text,
        duration_minutes: input.duration_minutes,
        order_index: nextOrderIndex,
        is_required: input.is_required,
      })
      .select()
      .single()

    if (error) {
      throw new ContentServiceError(
        `Erro ao criar aula: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return { ...(data as Lesson), courseId: module.course_id }
  }

  async updateLesson(lessonId: string, input: LessonUpdateInput): Promise<Lesson & { courseId: string; moduleId: string }> {
    // Verificar se aula existe e obter course_id
    const { data: existing } = await this.supabase
      .from('lessons')
      .select('module_id, modules!inner(course_id)')
      .eq('id', lessonId)
      .single()

    if (!existing) {
      throw new ContentServiceError('Aula não encontrada', 'LESSON_NOT_FOUND')
    }

    const updateData: Record<string, any> = {}
    if (input.title !== undefined) updateData.title = input.title
    if (input.content_type !== undefined) updateData.content_type = input.content_type
    if (input.content_url !== undefined) updateData.content_url = input.content_url
    if (input.content_text !== undefined) updateData.content_text = input.content_text
    if (input.duration_minutes !== undefined) updateData.duration_minutes = input.duration_minutes
    if (input.is_required !== undefined) updateData.is_required = input.is_required

    const { data, error } = await this.supabase
      .from('lessons')
      .update(updateData)
      .eq('id', lessonId)
      .select()
      .single()

    if (error) {
      throw new ContentServiceError(
        `Erro ao atualizar aula: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    const courseId = (existing as any).modules.course_id
    return { ...(data as Lesson), courseId, moduleId: existing.module_id }
  }

  async deleteLesson(lessonId: string): Promise<{ courseId: string; moduleId: string }> {
    // Obter module_id e course_id antes de deletar
    const { data: lesson, error: fetchError } = await this.supabase
      .from('lessons')
      .select('module_id, modules!inner(course_id)')
      .eq('id', lessonId)
      .single()

    if (fetchError || !lesson) {
      throw new ContentServiceError(
        'Aula não encontrada',
        'LESSON_NOT_FOUND',
        fetchError
      )
    }

    const { error } = await this.supabase.from('lessons').delete().eq('id', lessonId)

    if (error) {
      throw new ContentServiceError(
        `Erro ao deletar aula: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    const courseId = (lesson as any).modules.course_id
    return { courseId, moduleId: lesson.module_id }
  }

  async reorderLessons(input: ReorderLessonsInput): Promise<{ courseId: string }> {
    // Obter course_id do módulo
    const { data: module } = await this.supabase
      .from('modules')
      .select('course_id')
      .eq('id', input.module_id)
      .single()

    if (!module) {
      throw new ContentServiceError('Módulo não encontrado', 'MODULE_NOT_FOUND')
    }

    // Atualizar order_index de cada aula
    const updates = input.lesson_ids.map((lessonId, index) =>
      this.supabase
        .from('lessons')
        .update({ order_index: index })
        .eq('id', lessonId)
        .eq('module_id', input.module_id) // Garantir que aula pertence ao módulo
    )

    const results = await Promise.all(updates)
    const errors = results.filter((r) => r.error)

    if (errors.length > 0) {
      throw new ContentServiceError(
        `Erro ao reordenar aulas: ${errors[0].error?.message}`,
        'SUPABASE_ERROR',
        errors[0].error
      )
    }

    return { courseId: module.course_id }
  }
}
