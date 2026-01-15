// ============================================================================
// Course Test Fixtures
// ============================================================================
// Dados de teste reutilizáveis para cursos
// ============================================================================

import type { Course } from '@/lib/types/database'

export const mockCourse: Course = {
  id: 'course-123',
  title: 'Test Course',
  slug: 'test-course',
  description: 'This is a test course',
  objectives: null,
  level: 'beginner',
  status: 'draft',
  area: 'Security',
  duration_hours: 10,
  organization_id: null,
  thumbnail_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  published_at: null,
  created_by: 'user-123',
  min_completion_percentage: undefined,
  requires_quiz: false,
  is_public: false,
  is_certifiable: false,
}

export const mockCourses: Course[] = [
  mockCourse,
  {
    ...mockCourse,
    id: 'course-456',
    title: 'HR Basics',
    slug: 'hr-basics',
    area: 'HR',
  },
]
