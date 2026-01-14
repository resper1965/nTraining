// ============================================================================
// Knowledge Service Layer
// ============================================================================
// Serviço para processamento e embedding de documentos PDFs
// 
// FUNCIONALIDADES:
// - Upload de PDFs para Supabase Storage
// - Extração de texto de PDFs
// - Chunking de texto (~1000 tokens com overlap)
// - Geração de embeddings via OpenAI
// - Armazenamento em knowledge_vectors
// ============================================================================

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import pdfParse from 'pdf-parse/lib/pdf-parse.js'
import { generateEmbeddingsBatch } from './ai-client'
import type {
  KnowledgeSource,
  KnowledgeSourceStatus,
} from '@/lib/types/database'

// ============================================================================
// Types
// ============================================================================

export interface ProcessDocumentInput {
  file: File
  title: string
  organizationId: string | null
  userId: string
}

export interface DocumentChunk {
  content: string
  chunkIndex: number
  tokenCount: number
}

export class KnowledgeServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'KnowledgeServiceError'
  }
}

// ============================================================================
// Constants
// ============================================================================

const CHUNK_SIZE_TOKENS = 1000 // Tamanho do chunk em tokens
const CHUNK_OVERLAP_TOKENS = 200 // Overlap entre chunks
const STORAGE_BUCKET = 'knowledge-sources' // Bucket do Supabase Storage

// ============================================================================
// Knowledge Service Class
// ============================================================================

export class KnowledgeService {
  private supabase: SupabaseClient
  private adminSupabase: SupabaseClient

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || createClient()
    
    // Admin client para operações privilegiadas (Storage)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY não configurada. Necessária para upload de arquivos.'
      )
    }

    this.adminSupabase = createAdminClient(supabaseUrl, supabaseServiceKey)
  }

  // ============================================================================
  // PROCESS DOCUMENT
  // ============================================================================

  /**
   * Processa um documento PDF completo:
   * 1. Upload para Supabase Storage
   * 2. Extração de texto
   * 3. Chunking
   * 4. Geração de embeddings
   * 5. Armazenamento em knowledge_vectors
   */
  async processAndEmbedDocument(
    input: ProcessDocumentInput
  ): Promise<KnowledgeSource> {
    const { file, title, organizationId, userId } = input

    // 1. Validar arquivo
    if (file.type !== 'application/pdf') {
      throw new KnowledgeServiceError(
        'Apenas arquivos PDF são suportados',
        'INVALID_FILE_TYPE'
      )
    }

    if (file.size > 50 * 1024 * 1024) {
      // 50MB max
      throw new KnowledgeServiceError(
        'Arquivo muito grande. Tamanho máximo: 50MB',
        'FILE_TOO_LARGE'
      )
    }

    // 2. Criar registro inicial em knowledge_sources
    const { data: source, error: sourceError } = await this.supabase
      .from('knowledge_sources')
      .insert({
        title,
        filename: file.name,
        file_url: '', // Será atualizado após upload
        file_size: file.size,
        mime_type: file.type,
        status: 'processing' as KnowledgeSourceStatus,
        organization_id: organizationId,
        created_by: userId,
      })
      .select()
      .single()

    if (sourceError || !source) {
      throw new KnowledgeServiceError(
        `Erro ao criar registro de source: ${sourceError?.message}`,
        'CREATE_SOURCE_ERROR',
        sourceError
      )
    }

    try {
      // 3. Upload para Supabase Storage
      const filePath = `${organizationId || 'global'}/${source.id}/${file.name}`
      const fileBuffer = Buffer.from(await file.arrayBuffer())

      const { data: uploadData, error: uploadError } =
        await this.adminSupabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, fileBuffer, {
            contentType: file.type,
            upsert: false,
          })

      if (uploadError) {
        throw new KnowledgeServiceError(
          `Erro ao fazer upload: ${uploadError.message}`,
          'UPLOAD_ERROR',
          uploadError
        )
      }

      // 4. Obter URL pública
      const {
        data: { publicUrl },
      } = this.adminSupabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath)

      // 5. Atualizar source com URL
      await this.supabase
        .from('knowledge_sources')
        .update({ file_url: publicUrl })
        .eq('id', source.id)

      // 6. Extrair texto do PDF
      const pdfData = await pdfParse(fileBuffer)
      const text = pdfData.text

      if (!text || text.trim().length === 0) {
        throw new KnowledgeServiceError(
          'PDF não contém texto extraível',
          'NO_TEXT_EXTRACTED'
        )
      }

      // 7. Chunking de texto
      const chunks = this.chunkText(text)

      // 8. Gerar embeddings em batch
      const chunkTexts = chunks.map((chunk) => chunk.content)
      const embeddings = await generateEmbeddingsBatch(chunkTexts)

      // 9. Salvar chunks e embeddings em knowledge_vectors
      const vectorsToInsert = chunks.map((chunk, index) => ({
        source_id: source.id,
        content_chunk: chunk.content,
        chunk_index: chunk.chunkIndex,
        token_count: chunk.tokenCount,
        embedding: embeddings[index],
        metadata: {
          page: Math.floor(chunk.chunkIndex / 10) + 1, // Aproximação
        },
      }))

      const { error: vectorsError } = await this.supabase
        .from('knowledge_vectors')
        .insert(vectorsToInsert)

      if (vectorsError) {
        throw new KnowledgeServiceError(
          `Erro ao salvar embeddings: ${vectorsError.message}`,
          'SAVE_EMBEDDINGS_ERROR',
          vectorsError
        )
      }

      // 10. Atualizar status para completed
      const { data: updatedSource, error: updateError } = await this.supabase
        .from('knowledge_sources')
        .update({
          status: 'completed' as KnowledgeSourceStatus,
        })
        .eq('id', source.id)
        .select()
        .single()

      if (updateError || !updatedSource) {
        throw new KnowledgeServiceError(
          `Erro ao atualizar status: ${updateError?.message}`,
          'UPDATE_STATUS_ERROR',
          updateError
        )
      }

      return updatedSource as KnowledgeSource
    } catch (error) {
      // Em caso de erro, atualizar status para failed
      await this.supabase
        .from('knowledge_sources')
        .update({
          status: 'failed' as KnowledgeSourceStatus,
          error_message:
            error instanceof Error ? error.message : 'Erro desconhecido',
        })
        .eq('id', source.id)

      if (error instanceof KnowledgeServiceError) {
        throw error
      }

      throw new KnowledgeServiceError(
        `Erro ao processar documento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        'PROCESSING_ERROR',
        error
      )
    }
  }

  // ============================================================================
  // CHUNKING
  // ============================================================================

  /**
   * Divide texto em chunks de ~1000 tokens com overlap
   * Usa aproximação: 1 token ≈ 4 caracteres
   */
  private chunkText(text: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = []
    const chunkSizeChars = CHUNK_SIZE_TOKENS * 4 // Aproximação
    const overlapChars = CHUNK_OVERLAP_TOKENS * 4

    let start = 0
    let chunkIndex = 0

    while (start < text.length) {
      let end = start + chunkSizeChars

      // Tentar quebrar em quebra de linha ou ponto final próximo
      if (end < text.length) {
        const nextNewline = text.indexOf('\n', end - overlapChars)
        const nextPeriod = text.indexOf('. ', end - overlapChars)

        if (nextNewline > end - overlapChars && nextNewline < end + overlapChars) {
          end = nextNewline + 1
        } else if (
          nextPeriod > end - overlapChars &&
          nextPeriod < end + overlapChars
        ) {
          end = nextPeriod + 2
        }
      }

      const chunkContent = text.slice(start, end).trim()

      if (chunkContent.length > 0) {
        chunks.push({
          content: chunkContent,
          chunkIndex,
          tokenCount: Math.ceil(chunkContent.length / 4), // Aproximação
        })
        chunkIndex++
      }

      // Próximo chunk com overlap
      start = end - overlapChars
      if (start < 0) start = 0
    }

    return chunks
  }

  // ============================================================================
  // GET KNOWLEDGE SOURCES
  // ============================================================================

  /**
   * Lista knowledge sources de uma organização
   */
  async getKnowledgeSources(
    organizationId: string | null,
    isSuperadmin: boolean
  ): Promise<KnowledgeSource[]> {
    let query = this.supabase.from('knowledge_sources').select('*')

    if (!isSuperadmin && organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new KnowledgeServiceError(
        `Erro ao buscar sources: ${error.message}`,
        'GET_SOURCES_ERROR',
        error
      )
    }

    return (data || []) as KnowledgeSource[]
  }

  // ============================================================================
  // DELETE KNOWLEDGE SOURCE
  // ============================================================================

  /**
   * Deleta um knowledge source e todos os seus vectors
   */
  async deleteKnowledgeSource(sourceId: string): Promise<void> {
    // Deletar vectors primeiro (CASCADE)
    const { error: vectorsError } = await this.supabase
      .from('knowledge_vectors')
      .delete()
      .eq('source_id', sourceId)

    if (vectorsError) {
      throw new KnowledgeServiceError(
        `Erro ao deletar vectors: ${vectorsError.message}`,
        'DELETE_VECTORS_ERROR',
        vectorsError
      )
    }

    // Deletar source
    const { error: sourceError } = await this.supabase
      .from('knowledge_sources')
      .delete()
      .eq('id', sourceId)

    if (sourceError) {
      throw new KnowledgeServiceError(
        `Erro ao deletar source: ${sourceError.message}`,
        'DELETE_SOURCE_ERROR',
        sourceError
      )
    }
  }
}
