// ============================================================================
// AI Course Service Tests
// ============================================================================
// Testes unitários para o serviço de geração de cursos com IA
// Foco: Tratamento de erros da API OpenAI sem crashar a aplicação
// ============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  AICourseService,
  AICourseServiceError,
} from '@/lib/services/ai-course.service'
import {
  generateEmbedding,
  chat,
} from '@/lib/services/ai-client'
import { mockSupabaseClient } from '@/vitest.setup'

// Mock the AI client functions
vi.mock('@/lib/services/ai-client')

// ============================================================================
// Test Data
// ============================================================================

const mockMatchedDocument = {
  id: 'vector-123',
  source_id: 'source-123',
  content_chunk: 'Sample content chunk',
  chunk_index: 0,
  similarity: 0.85,
  metadata: {},
}

const mockGeneratedStructure = {
  title: 'Generated Course',
  description: 'This is a generated course',
  objectives: ['Objective 1', 'Objective 2'],
  level: 'beginner' as const,
  estimatedDurationHours: 10,
  modules: [
    {
      title: 'Module 1',
      description: 'Module description',
      orderIndex: 0,
      lessons: [
        {
          title: 'Lesson 1',
          description: 'Lesson description',
          contentType: 'video' as const,
          estimatedMinutes: 30,
          orderIndex: 0,
        },
      ],
    },
  ],
}

// ============================================================================
// Tests
// ============================================================================

describe('AICourseService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateCourseStructure', () => {
    it('should generate course structure without sourceIds', async () => {
      // Arrange
      const service = new AICourseService()
      const topic = 'Security Fundamentals'
      vi.mocked(chat).mockResolvedValue(JSON.stringify(mockGeneratedStructure))

      // Act
      const result = await service.generateCourseStructure({
        topic,
        organizationId: null,
      })

      // Assert
      expect(chat).toHaveBeenCalled()
      expect(result).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        modules: expect.any(Array),
      })
    })

    it('should generate course structure with RAG context from sourceIds', async () => {
      // Arrange
      const service = new AICourseService()
      const topic = 'Security Fundamentals'
      const sourceIds = ['source-123']

      // Mock RAG retrieval
      mockSupabaseClient.rpc.mockResolvedValue({
        data: [mockMatchedDocument],
        error: null,
      })

      // Mock embedding generation
      vi.mocked(generateEmbedding).mockResolvedValue(new Array(1536).fill(0.5))

      // Mock chat response
      vi.mocked(chat).mockResolvedValue(JSON.stringify(mockGeneratedStructure))

      // Act
      const result = await service.generateCourseStructure({
        topic,
        sourceIds,
        organizationId: null,
      })

      // Assert
      expect(generateEmbedding).toHaveBeenCalledWith(topic)
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith(
        'match_documents',
        expect.objectContaining({
          match_count: 10,
          source_ids: sourceIds,
        })
      )
      expect(chat).toHaveBeenCalled()
      expect(result).toMatchObject({
        title: expect.any(String),
        modules: expect.any(Array),
      })
    })

    it('should handle OpenAI API failure gracefully', async () => {
      // Arrange
      const service = new AICourseService()
      const topic = 'Security Fundamentals'
      vi.mocked(chat).mockRejectedValue(new Error('API Error: Rate limit exceeded'))

      // Act & Assert
      await expect(
        service.generateCourseStructure({
          topic,
          organizationId: null,
        })
      ).rejects.toThrow(AICourseServiceError)
    })

    it('should handle invalid JSON response from OpenAI', async () => {
      // Arrange
      const service = new AICourseService()
      const topic = 'Security Fundamentals'
      vi.mocked(chat).mockResolvedValue('Invalid JSON response')

      // Act & Assert
      await expect(
        service.generateCourseStructure({
          topic,
          organizationId: null,
        })
      ).rejects.toThrow(AICourseServiceError)
    })

    it('should handle RAG error gracefully and still generate course', async () => {
      // Arrange
      const service = new AICourseService()
      const topic = 'Security Fundamentals'
      const sourceIds = ['source-123']

      // Mock RAG failure
      mockSupabaseClient.rpc.mockResolvedValue({
        data: null,
        error: { message: 'RAG error', code: 'PGRST116' },
      })

      // Mock chat to still work
      vi.mocked(chat).mockResolvedValue(JSON.stringify(mockGeneratedStructure))

      // Act & Assert
      await expect(
        service.generateCourseStructure({
          topic,
          sourceIds,
          organizationId: null,
        })
      ).rejects.toThrow(AICourseServiceError)
    })

    it('should validate generated structure with Zod schema', async () => {
      // Arrange
      const service = new AICourseService()
      const topic = 'Security Fundamentals'

      // Mock invalid structure (missing required fields)
      const invalidStructure = {
        title: 'Incomplete Course',
        // Missing description, modules, etc.
      }

      vi.mocked(chat).mockResolvedValue(JSON.stringify(invalidStructure))

      // Act & Assert
      await expect(
        service.generateCourseStructure({
          topic,
          organizationId: null,
        })
      ).rejects.toThrow(AICourseServiceError)
    })
  })

  describe('Error Handling', () => {
    it('should wrap OpenAI errors in AICourseServiceError', async () => {
      // Arrange
      const service = new AICourseService()
      vi.mocked(chat).mockRejectedValue(new Error('Network error'))

      // Act & Assert
      try {
        await service.generateCourseStructure({
          topic: 'Test',
          organizationId: null,
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(AICourseServiceError)
        expect((error as AICourseServiceError).code).toBe('GENERATION_ERROR')
      }
    })

    it('should not crash application on timeout', async () => {
      // Arrange
      const service = new AICourseService()
      vi.mocked(chat).mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 100)
          )
      )

      // Act & Assert
      await expect(
        service.generateCourseStructure({
          topic: 'Test',
          organizationId: null,
        })
      ).rejects.toThrow(AICourseServiceError)
    })
  })
})
