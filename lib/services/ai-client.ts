// ============================================================================
// AI Client Service
// ============================================================================
// Cliente OpenAI configurado com Helicone para observabilidade e cache
// 
// CONFIGURAÇÃO:
// - Base URL: Helicone Proxy (https://oai.hconeai.com/v1)
// - Headers obrigatórios: Helicone-Auth, Helicone-Cache-Enabled
// - Modelos: gpt-4o (chat), text-embedding-3-small (embeddings)
// ============================================================================

import OpenAI from 'openai'

// ============================================================================
// Configuração
// ============================================================================

const HELICONE_API_KEY = process.env.HELICONE_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const HELICONE_BASE_URL = 'https://oai.hconeai.com/v1'

if (!OPENAI_API_KEY && process.env.NODE_ENV !== 'test') {
  throw new Error(
    'OPENAI_API_KEY não configurada. Configure a variável de ambiente OPENAI_API_KEY.'
  )
}

if (!HELICONE_API_KEY) {
  console.warn(
    '⚠️  HELICONE_API_KEY não configurada. Observabilidade e cache desabilitados.'
  )
}

// ============================================================================
// Cliente OpenAI com Helicone
// ============================================================================

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: HELICONE_BASE_URL,
  defaultHeaders: {
    ...(HELICONE_API_KEY && {
      'Helicone-Auth': HELICONE_API_KEY,
      'Helicone-Cache-Enabled': 'true',
    }),
  },
})

// ============================================================================
// Modelos
// ============================================================================

export const MODELS = {
  CHAT: 'gpt-4o' as const,
  EMBEDDING: 'text-embedding-3-small' as const,
} as const

// ============================================================================
// Tipos
// ============================================================================

export interface EmbeddingResponse {
  embedding: number[]
  model: string
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}

// ============================================================================
// Funções Utilitárias
// ============================================================================

/**
 * Gera embedding para um texto usando OpenAI via Helicone
 * @param text Texto para gerar embedding
 * @returns Embedding vetorial (1536 dimensões)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: MODELS.EMBEDDING,
      input: text,
    })

    if (!response.data[0]?.embedding) {
      throw new Error('Resposta de embedding vazia')
    }

    return response.data[0].embedding
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao gerar embedding: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao gerar embedding')
  }
}

/**
 * Gera embeddings em batch (múltiplos textos de uma vez)
 * @param texts Array de textos para gerar embeddings
 * @returns Array de embeddings
 */
export async function generateEmbeddingsBatch(
  texts: string[]
): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: MODELS.EMBEDDING,
      input: texts,
    })

    return response.data.map((item) => item.embedding)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao gerar embeddings em batch: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao gerar embeddings em batch')
  }
}

/**
 * Chama o modelo de chat (GPT-4o) com structured output usando JSON Schema
 * @param messages Mensagens do chat
 * @param schema JSON Schema para structured output
 * @returns Resposta parseada conforme schema
 */
export async function chatWithStructuredOutput<T>(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  schema: any // JSON Schema object
): Promise<T> {
  try {
    // Adicionar instrução ao prompt para retornar JSON válido
    const systemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: `Você deve retornar APENAS um JSON válido conforme o schema fornecido. Não inclua texto adicional, apenas o JSON puro.`,
    }

    const response = await openai.chat.completions.create({
      model: MODELS.CHAT,
      messages: [systemMessage, ...messages],
      response_format: {
        type: 'json_object',
      },
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('Resposta do chat vazia')
    }

    // Parse JSON manualmente
    try {
      const parsed = JSON.parse(content)
      return parsed as T
    } catch (parseError) {
      throw new Error(`Erro ao parsear JSON: ${parseError instanceof Error ? parseError.message : 'JSON inválido'}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao chamar chat com structured output: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao chamar chat')
  }
}

/**
 * Chama o modelo de chat (GPT-4o) sem structured output
 * @param messages Mensagens do chat
 * @param options Opções adicionais (temperature, max_tokens, etc.)
 * @returns Resposta do chat
 */
export async function chat(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: {
    temperature?: number
    max_tokens?: number
  }
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: MODELS.CHAT,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('Resposta do chat vazia')
    }

    return content
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao chamar chat: ${error.message}`)
    }
    throw new Error('Erro desconhecido ao chamar chat')
  }
}
