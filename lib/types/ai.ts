// ============================================================================
// AI Types
// ============================================================================
// Tipos compartilhados para funcionalidades de IA (Course Architect)
// ============================================================================

export interface GeneratedCourseStructure {
  title: string
  description: string
  objectives: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  estimatedDurationHours: number
  modules: GeneratedModule[]
}

export interface GeneratedModule {
  title: string
  description: string
  orderIndex: number
  lessons: GeneratedLesson[]
}

export interface GeneratedLesson {
  title: string
  description: string
  contentType: 'video' | 'text' | 'pdf' | 'quiz' | 'embed'
  estimatedMinutes: number
  orderIndex: number
}
