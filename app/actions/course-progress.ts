'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/server'
import type { UserLessonProgress } from '@/lib/types/database'

/**
 * Get progress for all lessons in a course
 */
export async function getCourseProgress(courseId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  const { data: progress, error } = await supabase
    .from('user_course_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch course progress: ${error.message}`)
  }

  return progress || {
    course_id: courseId,
    user_id: user.id,
    completion_percentage: 0,
    last_accessed_at: null,
    completed_at: null,
  }
}

export async function getCourseLessonsProgress(courseId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  // Get all lessons in the course
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, module_id, modules!inner(course_id)')
    .eq('modules.course_id', courseId)

  if (!lessons || lessons.length === 0) {
    return {}
  }

  const lessonIds = lessons.map((l: any) => l.id)

  // Get progress for all lessons
  const { data: progress } = await supabase
    .from('user_lesson_progress')
    .select('*')
    .eq('user_id', user.id)
    .in('lesson_id', lessonIds)

  // Create a map of lesson_id -> progress
  const progressMap: Record<string, UserLessonProgress> = {}
  progress?.forEach((p: any) => {
    progressMap[p.lesson_id] = p as UserLessonProgress
  })

  return progressMap
}

/**
 * Get course completion percentage
 */
export async function getCourseCompletionPercentage(courseId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  // Get all required lessons in the course
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, module_id, modules!inner(course_id)')
    .eq('modules.course_id', courseId)
    .eq('is_required', true)

  if (!allLessons || allLessons.length === 0) {
    return 0
  }

  const lessonIds = allLessons.map((l: any) => l.id)

  // Get completed lessons
  const { data: completedLessons } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('is_completed', true)
    .in('lesson_id', lessonIds)

  const totalLessons = allLessons.length
  const completedCount = completedLessons?.length || 0

  return Math.round((completedCount / totalLessons) * 100)
}

