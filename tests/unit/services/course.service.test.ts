// ============================================================================
// Course Service Tests
// ============================================================================
// Testes unitários para a lógica de negócio do Course Service
// Padrão AAA: Arrange, Act, Assert
// ============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CourseService, CourseServiceError } from '@/lib/services/course.service'
import { mockSupabaseClient } from '@/vitest.setup'
import type { CourseCreateInput } from '@/lib/validators/course.schema'
import { mockCourse, mockCourses } from '@/tests/fixtures/courses'

// ============================================================================
// Test Data (Fixtures)
// ============================================================================

const mockUser = {
  id: 'user-123',
  role: 'platform_admin' as const,
  organization_id: 'org-123',
  is_superadmin: true,
}

const mockCourseCreateInput: CourseCreateInput = {
  title: 'Test Course',
  slug: 'test-course',
  description: 'This is a test course',
  level: 'beginner',
  status: 'draft',
  area: 'Security',
  duration_hours: 10,
  is_public: false,
  is_certifiable: false,
}

const mockCourseServiceOptions = {
  userId: mockUser.id,
  organizationId: mockUser.organization_id,
  isSuperadmin: mockUser.is_superadmin,
}

// ============================================================================
// Helper: Create QueryBuilder Mock
// ============================================================================

function createQueryBuilderMock(data: any = null, error: any = null) {
  const mockBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    then: vi.fn((onResolve) => Promise.resolve({ data, error }).then(onResolve)),
  }
  return mockBuilder
}

// ============================================================================
// Tests
// ============================================================================

describe('CourseService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createCourse', () => {
    it('should create a course with valid data', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      
      // Mock para verificar se slug existe (retorna null - slug não existe)
      const checkSlugBuilder = createQueryBuilderMock(null, null)
      
      // Mock para inserir o curso (retorna o curso criado)
      const insertBuilder = createQueryBuilderMock(mockCourse, null)
      
      // Configurar .from() para retornar builders diferentes baseado na ordem de chamadas
      let callCount = 0
      mockSupabaseClient.from.mockImplementation(() => {
        callCount++
        // Primeira chamada: verificar slug
        if (callCount === 1) return checkSlugBuilder as any
        // Segunda chamada: inserir curso
        return insertBuilder as any
      })

      // Act
      const result = await service.createCourse(mockCourseCreateInput)

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('courses')
      expect(checkSlugBuilder.select).toHaveBeenCalledWith('id')
      expect(checkSlugBuilder.eq).toHaveBeenCalledWith('slug', mockCourseCreateInput.slug)
      expect(checkSlugBuilder.single).toHaveBeenCalled()
      expect(insertBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: mockCourseCreateInput.title,
          slug: mockCourseCreateInput.slug,
        })
      )
      expect(insertBuilder.select).toHaveBeenCalled()
      expect(insertBuilder.single).toHaveBeenCalled()
      expect(result).toEqual(mockCourse)
    })

    it('should throw error if insert fails', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      
      // Mock para verificar slug (retorna null - slug não existe)
      const checkSlugBuilder = createQueryBuilderMock(null, null)
      
      // Mock para inserir (retorna erro)
      const insertBuilder = createQueryBuilderMock(null, {
        message: 'Database error',
        code: 'PGRST116',
      })
      
      let callCount = 0
      mockSupabaseClient.from.mockImplementation(() => {
        callCount++
        if (callCount === 1) return checkSlugBuilder as any
        return insertBuilder as any
      })

      // Act & Assert
      await expect(service.createCourse(mockCourseCreateInput)).rejects.toThrow(
        CourseServiceError
      )
    })

    it('should include organization_id for non-superadmin users', async () => {
      // Arrange
      const orgManagerService = new CourseService({
        userId: 'user-456',
        organizationId: 'org-456',
        isSuperadmin: false,
      })
      
      const checkSlugBuilder = createQueryBuilderMock(null, null)
      const insertBuilder = createQueryBuilderMock(
        { ...mockCourse, organization_id: 'org-456' },
        null
      )
      
      let callCount = 0
      mockSupabaseClient.from.mockImplementation(() => {
        callCount++
        if (callCount === 1) return checkSlugBuilder as any
        return insertBuilder as any
      })

      // Act
      await orgManagerService.createCourse(mockCourseCreateInput)

      // Assert
      expect(insertBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          organization_id: 'org-456',
        })
      )
    })
  })

  describe('getCourses', () => {
    it('should fetch courses with filters', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      const filters = {
        status: 'published' as const,
        level: 'beginner' as const,
      }
      
      const mockBuilder = createQueryBuilderMock([mockCourse], null)
      mockSupabaseClient.from.mockReturnValue(mockBuilder as any)

      // Act
      const result = await service.getCourses(filters)

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('courses')
      expect(mockBuilder.select).toHaveBeenCalled()
      expect(mockBuilder.order).toHaveBeenCalled()
      expect(mockBuilder.eq).toHaveBeenCalledWith('status', 'published')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle search filter safely (in-memory filtering)', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      const filters = {
        search: 'security',
      }
      
      const mockBuilder = createQueryBuilderMock(mockCourses, null)
      mockSupabaseClient.from.mockReturnValue(mockBuilder as any)

      // Act
      const result = await service.getCourses(filters)

      // Assert
      // Search is done in-memory, so should filter results
      expect(Array.isArray(result)).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('courses')
    })
  })

  describe('getCourseById', () => {
    it('should fetch a course by ID', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      const mockBuilder = createQueryBuilderMock(mockCourse, null)
      mockSupabaseClient.from.mockReturnValue(mockBuilder as any)

      // Act
      const result = await service.getCourseById('course-123')

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('courses')
      expect(mockBuilder.select).toHaveBeenCalled()
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'course-123')
      expect(mockBuilder.single).toHaveBeenCalled()
      expect(result).toEqual(mockCourse)
    })

    it('should throw error if course not found', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      const mockBuilder = createQueryBuilderMock(null, {
        message: 'Course not found',
        code: 'PGRST116',
      })
      mockSupabaseClient.from.mockReturnValue(mockBuilder as any)

      // Act & Assert
      await expect(service.getCourseById('invalid-id')).rejects.toThrow(
        CourseServiceError
      )
    })
  })

  describe('deleteCourse', () => {
    it('should delete a course', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      const mockBuilder = createQueryBuilderMock(null, null)
      mockSupabaseClient.from.mockReturnValue(mockBuilder as any)

      // Act
      await service.deleteCourse('course-123')

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('courses')
      expect(mockBuilder.delete).toHaveBeenCalled()
      expect(mockBuilder.eq).toHaveBeenCalledWith('id', 'course-123')
    })
  })
})
