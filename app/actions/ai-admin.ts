'use server'

// ============================================================================
// AI Admin Server Actions (Control Layer)
// ============================================================================
// Server Actions para gerenciamento de Base de Conhecimento e geração de cursos com IA
// 
// REGRA DE OURO: Todas as actions verificam autorização primeiro
// Apenas platform_admin e org_manager podem usar essas funcionalidades
// ============================================================================

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/helpers'
import {
  KnowledgeService,
  KnowledgeServiceError,
} from '@/lib/services/knowledge.service'
import {
  AICourseService,
  AICourseServiceError,
} from '@/lib/services/ai-course.service'
import type { KnowledgeSource } from '@/lib/types/database'
import type { GeneratedCourseStructure } from '@/lib/types/ai'
import { ZodError } from 'zod'

// ============================================================================
// Error Types
// ============================================================================

export interface ActionError {
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

// ============================================================================
// HELPER: Verificar Autorização
// ============================================================================

/**
 * Verifica se o usuário tem permissão para usar funcionalidades de IA
 * Apenas platform_admin e org_manager podem usar
 */
async function requireAIAdmin(): Promise<{ id: string; role: string; organization_id: string | null }> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  if (!['platform_admin', 'org_manager'].includes(user.role)) {
    throw new Error('Acesso negado. Apenas administradores podem usar funcionalidades de IA.')
  }

  return {
    id: user.id,
    role: user.role,
    organization_id: user.organization_id,
  }
}

// ============================================================================
// KNOWLEDGE SOURCES: Upload e Processamento
// ============================================================================

/**
 * Upload e processamento de documento PDF para Base de Conhecimento
 */
export async function uploadKnowledgeSource(
  formData: FormData
): Promise<{ success: true; data: KnowledgeSource } | { success: false; error: ActionError }> {
  try {
    // 1. Auth Check
    const user = await requireAIAdmin()

    // 2. Extrair dados do FormData
    const file = formData.get('file') as File
    const title = formData.get('title') as string

    if (!file) {
      return {
        success: false,
        error: {
          message: 'Arquivo não fornecido',
          code: 'MISSING_FILE',
        },
      }
    }

    if (!title || title.trim().length === 0) {
      return {
        success: false,
        error: {
          message: 'Título é obrigatório',
          code: 'MISSING_TITLE',
        },
      }
    }

    // 3. Service Call
    const service = new KnowledgeService()
    const source = await service.processAndEmbedDocument({
      file,
      title: title.trim(),
      organizationId: user.organization_id,
      userId: user.id,
    })

    // 4. Response/Effect
    revalidatePath('/admin/ai/knowledge')
    return {
      success: true,
      data: source,
    }
  } catch (error) {
    if (error instanceof KnowledgeServiceError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    console.error('Error in uploadKnowledgeSource:', error)
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro ao fazer upload do documento',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

/**
 * Lista knowledge sources disponíveis
 */
export async function getKnowledgeSources(): Promise<
  { success: true; data: KnowledgeSource[] } | { success: false; error: ActionError }
> {
  try {
    // 1. Auth Check
    const user = await requireAIAdmin()

    // 2. Service Call
    const service = new KnowledgeService()
    const sources = await service.getKnowledgeSources(
      user.organization_id,
      user.role === 'platform_admin' // isSuperadmin
    )

    // 3. Response
    return {
      success: true,
      data: sources,
    }
  } catch (error) {
    console.error('Error in getKnowledgeSources:', error)
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro ao buscar documentos',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

/**
 * Deleta um knowledge source
 */
export async function deleteKnowledgeSource(
  sourceId: string
): Promise<{ success: true } | { success: false; error: ActionError }> {
  try {
    // 1. Auth Check
    await requireAIAdmin()

    // 2. Validação básica
    if (!sourceId || typeof sourceId !== 'string') {
      return {
        success: false,
        error: {
          message: 'ID do documento inválido',
          code: 'VALIDATION_ERROR',
        },
      }
    }

    // 3. Service Call
    const service = new KnowledgeService()
    await service.deleteKnowledgeSource(sourceId)

    // 4. Response/Effect
    revalidatePath('/admin/ai/knowledge')
    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof KnowledgeServiceError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    console.error('Error in deleteKnowledgeSource:', error)
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro ao deletar documento',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}

// ============================================================================
// AI COURSE GENERATION
// ============================================================================

/**
 * Gera estrutura de curso usando IA
 */
export async function generateCourseStructure(
  input: {
    topic: string
    sourceIds?: string[]
  }
): Promise<
  | { success: true; data: GeneratedCourseStructure }
  | { success: false; error: ActionError }
> {
  try {
    // 1. Auth Check
    const user = await requireAIAdmin()

    // 2. Validação básica
    if (!input.topic || input.topic.trim().length < 3) {
      return {
        success: false,
        error: {
          message: 'Tópico deve ter pelo menos 3 caracteres',
          code: 'VALIDATION_ERROR',
        },
      }
    }

    // 3. Service Call
    const service = new AICourseService()
    const structure = await service.generateCourseStructure({
      topic: input.topic.trim(),
      sourceIds: input.sourceIds,
      organizationId: user.organization_id,
    })

    // 4. Response
    return {
      success: true,
      data: structure,
    }
  } catch (error) {
    if (error instanceof AICourseServiceError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      }
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        error: {
          message: 'Estrutura gerada inválida',
          code: 'VALIDATION_ERROR',
          fieldErrors: error.flatten().fieldErrors,
        },
      }
    }

    console.error('Error in generateCourseStructure:', error)
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Erro ao gerar estrutura de curso',
        code: 'UNKNOWN_ERROR',
      },
    }
  }
}
