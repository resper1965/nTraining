// ============================================================================
// AI Course Service Layer
// ============================================================================
// Serviço para geração de estruturas de cursos usando IA
// 
// FUNCIONALIDADES:
// - Busca por similaridade na Base de Conhecimento (RAG)
// - Geração de estrutura de curso usando GPT-4o
// - Structured output com Zod para garantir formato JSON válido
// ============================================================================

import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { generateEmbedding, chat } from './ai-client'
import { z } from 'zod'
import type { MatchedDocument } from '@/lib/types/database'
import type {
  GeneratedCourseStructure,
  GeneratedModule,
  GeneratedLesson,
} from '@/lib/types/ai'

// ============================================================================
// Types
// ============================================================================

export interface GenerateCourseStructureInput {
  topic: string
  sourceIds?: string[] // IDs dos knowledge sources para usar como contexto
  organizationId?: string | null
}

export class AICourseServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'AICourseServiceError'
  }
}

// ============================================================================
// Zod Schema para Structured Output
// ============================================================================

const GeneratedLessonSchema = z.object({
  title: z.string().min(3, 'Título da aula deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  contentType: z.enum(['video', 'text', 'pdf', 'quiz', 'embed']),
  estimatedMinutes: z.number().int().positive().max(180),
  orderIndex: z.number().int().nonnegative(),
})

const GeneratedModuleSchema = z.object({
  title: z.string().min(3, 'Título do módulo deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  orderIndex: z.number().int().nonnegative(),
  lessons: z.array(GeneratedLessonSchema).min(1, 'Módulo deve ter pelo menos 1 aula'),
})

const GeneratedCourseStructureSchema = z.object({
  title: z.string().min(3, 'Título do curso deve ter pelo menos 3 caracteres'),
  description: z.string().min(50, 'Descrição deve ter pelo menos 50 caracteres'),
  objectives: z.array(z.string().min(10)).min(3, 'Curso deve ter pelo menos 3 objetivos'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedDurationHours: z.number().positive().max(500),
  modules: z.array(GeneratedModuleSchema).min(1, 'Curso deve ter pelo menos 1 módulo'),
})


// ============================================================================
// AI Course Service Class
// ============================================================================

export class AICourseService {
  private supabase: SupabaseClient

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || createClient()
  }

  // ============================================================================
  // GENERATE COURSE STRUCTURE
  // ============================================================================

  /**
   * Gera estrutura completa de curso usando IA
   * Se sourceIds for fornecido, usa RAG para buscar contexto relevante
   */
  async generateCourseStructure(
    input: GenerateCourseStructureInput
  ): Promise<GeneratedCourseStructure> {
    const { topic, sourceIds, organizationId } = input

    try {
      // 1. Se houver sourceIds, buscar contexto via RAG
      let context = ''
      if (sourceIds && sourceIds.length > 0) {
        context = await this.retrieveRelevantContext(topic, sourceIds)
      }

      // 2. Montar prompt
      const systemPrompt = this.buildSystemPrompt(context)
      const userPrompt = this.buildUserPrompt(topic)

      // 3. Gerar estrutura usando GPT-4o
      // Usar chat normal com instrução para retornar JSON válido
      const userPromptWithSchema = `${userPrompt}\n\nRetorne APENAS um JSON válido no seguinte formato:\n${JSON.stringify({
        title: "string",
        description: "string",
        objectives: ["string"],
        level: "beginner | intermediate | advanced",
        estimatedDurationHours: "number",
        modules: [{
          title: "string",
          description: "string",
          orderIndex: "number",
          lessons: [{
            title: "string",
            description: "string",
            contentType: "video | text | pdf | quiz | embed",
            estimatedMinutes: "number",
            orderIndex: "number"
          }]
        }]
      }, null, 2)}`
      
      const jsonResponse = await chat(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPromptWithSchema },
        ],
        { temperature: 0.7 }
      )
      
      // Parse JSON
      let structure: GeneratedCourseStructure
      try {
        // Tentar extrair JSON do texto (pode ter markdown code blocks)
        const jsonMatch = jsonResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || [null, jsonResponse]
        structure = JSON.parse(jsonMatch[1] || jsonResponse) as GeneratedCourseStructure
      } catch (parseError) {
        throw new AICourseServiceError(
          `Erro ao parsear resposta JSON: ${parseError instanceof Error ? parseError.message : 'JSON inválido'}`,
          'PARSE_ERROR',
          parseError
        )
      }

      // 4. Validar estrutura gerada
      const validated = GeneratedCourseStructureSchema.parse(structure)

      return validated
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AICourseServiceError(
          `Estrutura gerada inválida: ${error.issues.map((e) => e.message).join(', ')}`,
          'VALIDATION_ERROR',
          error
        )
      }

      if (error instanceof AICourseServiceError) {
        throw error
      }

      throw new AICourseServiceError(
        `Erro ao gerar estrutura de curso: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        'GENERATION_ERROR',
        error
      )
    }
  }

  // ============================================================================
  // RAG: RETRIEVE RELEVANT CONTEXT
  // ============================================================================

  /**
   * Busca contexto relevante na Base de Conhecimento usando RAG
   */
  private async retrieveRelevantContext(
    topic: string,
    sourceIds: string[]
  ): Promise<string> {
    try {
      // 1. Gerar embedding do tópico
      const queryEmbedding = await generateEmbedding(topic)

      // 2. Chamar função RPC match_documents
      const { data: matchedDocs, error } = await this.supabase.rpc(
        'match_documents',
        {
          query_embedding: queryEmbedding,
          match_threshold: 0.7, // Similaridade mínima
          match_count: 10, // Top 10 chunks mais relevantes
          source_ids: sourceIds.length > 0 ? sourceIds : null,
        }
      )

      if (error) {
        throw new AICourseServiceError(
          `Erro ao buscar contexto: ${error.message}`,
          'RAG_ERROR',
          error
        )
      }

      if (!matchedDocs || matchedDocs.length === 0) {
        return '' // Sem contexto relevante
      }

      // 3. Montar contexto concatenando chunks
      const contextParts = (matchedDocs as MatchedDocument[]).map(
        (doc, index) => {
          return `[Documento ${index + 1} - Similaridade: ${(doc.similarity * 100).toFixed(1)}%]\n${doc.content_chunk}`
        }
      )

      return contextParts.join('\n\n---\n\n')
    } catch (error) {
      if (error instanceof AICourseServiceError) {
        throw error
      }

      throw new AICourseServiceError(
        `Erro ao recuperar contexto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        'RAG_ERROR',
        error
      )
    }
  }

  // ============================================================================
  // PROMPT BUILDING
  // ============================================================================

  /**
   * Constrói o prompt do sistema
   */
  private buildSystemPrompt(context: string): string {
    const basePrompt = `Você é um Designer Instrucional experiente da empresa "ness.", especializada em treinamentos de Segurança da Informação.

Sua missão é criar estruturas completas e profissionais de cursos de EAD (Ensino a Distância) que sejam:
- Didáticas e progressivas (do básico ao avançado)
- Práticas e aplicáveis ao mundo real
- Alinhadas com as melhores práticas de Design Instrucional
- Formatadas para plataforma de EAD moderna

FORMATO DE RESPOSTA:
Você deve retornar um JSON estrito com a seguinte estrutura:
{
  "title": "Título do Curso",
  "description": "Descrição completa e atrativa do curso (mínimo 50 caracteres)",
  "objectives": ["Objetivo 1", "Objetivo 2", "Objetivo 3..."],
  "level": "beginner" | "intermediate" | "advanced",
  "estimatedDurationHours": número,
  "modules": [
    {
      "title": "Título do Módulo",
      "description": "Descrição do módulo",
      "orderIndex": 0,
      "lessons": [
        {
          "title": "Título da Aula",
          "description": "Descrição da aula",
          "contentType": "video" | "text" | "pdf" | "quiz" | "embed",
          "estimatedMinutes": número,
          "orderIndex": 0
        }
      ]
    }
  ]
}

REGRAS IMPORTANTES:
1. Cada módulo deve ter entre 3-8 aulas
2. Cada curso deve ter entre 3-10 módulos
3. Use "video" para conteúdo principal, "text" para leituras, "quiz" para avaliações
4. Duração total deve ser realista (soma das aulas)
5. Ordem lógica: conceitos básicos → intermediários → avançados
6. Inclua quizzes estratégicos para reforçar aprendizado`

    if (context) {
      return `${basePrompt}

CONTEXTO DE REFERÊNCIA (Base de Conhecimento):
Use o contexto abaixo como referência técnica para criar o curso. Baseie-se nas informações fornecidas, mas adapte para o formato de curso EAD.

${context}

IMPORTANTE: Use o contexto como base, mas estruture o conteúdo de forma didática e progressiva, não apenas copie informações.`
    }

    return basePrompt
  }

  /**
   * Constrói o prompt do usuário
   */
  private buildUserPrompt(topic: string): string {
    return `Crie uma estrutura completa de curso sobre: "${topic}"

O curso deve ser profissional, didático e seguir as melhores práticas de Design Instrucional.
Retorne APENAS o JSON no formato especificado, sem texto adicional.`
  }
}
