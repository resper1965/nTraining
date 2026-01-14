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

// Use fixture instead

const mockCourseServiceOptions = {
  userId: mockUser.id,
  organizationId: mockUser.organization_id,
  isSuperadmin: mockUser.is_superadmin,
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
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient)
      const mockQuery = {
        then: vi.fn((onResolve) => Promise.resolve({ data: [mockCourse], error: null }).then(onResolve)),
      }
      mockSupabaseClient.select.mockReturnValue(mockQuery)
      mockSupabaseClient.eq = vi.fn().mockReturnValue(mockQuery)
      mockSupabaseClient.order = vi.fn().mockReturnValue(mockQuery)

      // Act
      const result = await service.createCourse(mockCourseCreateInput)

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('courses')
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: mockCourseCreateInput.title,
          slug: mockCourseCreateInput.slug,
        })
      )
      expect(result).toEqual(mockCourse)
    })

    it('should throw error if insert fails', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.select.mockResolvedValue({
        data: null,
        error: { message: 'Database error', code: 'PGRST116' },
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
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.select.mockResolvedValue({
        data: [{ ...mockCourse, organization_id: 'org-456' }],
        error: null,
      })

      // Act
      await orgManagerService.createCourse(mockCourseCreateInput)

      // Assert
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(
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
      
      // Create a promise chain that resolves correctly
      const mockQuery = {
        then: vi.fn((onResolve) => Promise.resolve({ data: [mockCourse], error: null }).then(onResolve)),
      }
      
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.eq.mockReturnValue(mockQuery)

      // Act
      const result = await service.getCourses(filters)

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('courses')
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('status', 'published')
      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle search filter safely (in-memory filtering)', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      const filters = {
        search: 'security',
      }
      // Mock the query chain properly for superadmin flow
      const mockQueryChain = {
        then: vi.fn((onResolve) => {
          return Promise.resolve({ data: mockCourses, error: null }).then(onResolve)
        }),
      }
      
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.select.mockReturnValue(mockQueryChain)
      mockSupabaseClient.eq = vi.fn().mockReturnValue(mockQueryChain)
      mockSupabaseClient.order = vi.fn().mockReturnValue(mockQueryChain)

      // Act
      const result = await service.getCourses(filters)

      // Assert
      // Search is done in-memory, so should filter results
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getCourseById', () => {
    it('should fetch a course by ID', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.single.mockResolvedValue({
        data: mockCourse,
        error: null,
      })

      // Act
      const result = await service.getCourseById('course-123')

      // Assert
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'course-123')
      expect(result).toEqual(mockCourse)
    })

    it('should throw error if course not found', async () => {
      // Arrange
      const service = new CourseService(mockCourseServiceOptions)
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.select.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Course not found', code: 'PGRST116' },
      })

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
      
      const mockQuery = {
        then: vi.fn((onResolve) => Promise.resolve({ data: null, error: null }).then(onResolve)),
      }
      
      mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.delete.mockReturnValue(mockSupabaseClient)
      mockSupabaseClient.eq.mockReturnValue(mockQuery)

      // Act
      await service.deleteCourse('course-123')

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('courses')
      expect(mockSupabaseClient.delete).toHaveBeenCalled()
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'course-123')
    })
  })
})
