'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/server'
import { getLearningPathWithCourses } from './learning-paths'
import { getCourseProgress } from './course-progress'

export interface PathProgress {
  path_id: string
  overall_progress: number
  completed_courses: number
  total_courses: number
  next_course_id: string | null
  next_course_slug: string | null
  is_completed: boolean
}

/**
 * Calcular progresso de uma trilha para o usuário atual
 */
export async function getPathProgress(pathId: string): Promise<PathProgress> {
  const user = await requireAuth()
  const supabase = createClient()

  const pathWithCourses = await getLearningPathWithCourses(pathId)

  if (!pathWithCourses.path_courses || pathWithCourses.path_courses.length === 0) {
    return {
      path_id: pathId,
      overall_progress: 0,
      completed_courses: 0,
      total_courses: 0,
      next_course_id: null,
      next_course_slug: null,
      is_completed: false,
    }
  }

  let completedCourses = 0
  let totalProgress = 0
  let nextCourseId: string | null = null
  let nextCourseSlug: string | null = null

  for (const pathCourse of pathWithCourses.path_courses) {
    if (!pathCourse.courses) continue

    const courseProgress = await getCourseProgress(pathCourse.courses.id).catch(() => null)
    const progress = courseProgress?.completion_percentage || 0

    totalProgress += progress

    if (progress >= 100) {
      completedCourses++
    } else if (!nextCourseId) {
      // Verificar se está desbloqueado
      const currentIndex = pathWithCourses.path_courses.findIndex(
        (pc) => pc.id === pathCourse.id
      )

      let isLocked = false
      if (currentIndex > 0) {
        const previousCourse = pathWithCourses.path_courses[currentIndex - 1]
        if (previousCourse.courses) {
          const prevProgress = await getCourseProgress(previousCourse.courses.id).catch(() => null)
          if ((prevProgress?.completion_percentage || 0) < 100) {
            isLocked = true
          }
        }
      }

      if (!isLocked) {
        nextCourseId = pathCourse.courses.id
        nextCourseSlug = pathCourse.courses.slug
      }
    }
  }

  const overallProgress =
    pathWithCourses.path_courses.length > 0
      ? totalProgress / pathWithCourses.path_courses.length
      : 0

  return {
    path_id: pathId,
    overall_progress: overallProgress,
    completed_courses: completedCourses,
    total_courses: pathWithCourses.path_courses.length,
    next_course_id: nextCourseId,
    next_course_slug: nextCourseSlug,
    is_completed: completedCourses === pathWithCourses.path_courses.length,
  }
}

/**
 * Obter todas as trilhas com progresso do usuário
 */
export async function getUserPathsWithProgress() {
  const user = await requireAuth()
  const supabase = createClient()

  // Buscar trilhas atribuídas ao usuário ou globais
  const { data: assignments } = await supabase
    .from('user_path_assignments')
    .select('path_id, status, started_at, completed_at')
    .eq('user_id', user.id)

  const assignedPathIds = assignments?.map((a: any) => a.path_id) || []

  // Buscar trilhas globais ou da organização do usuário
  let query = supabase
    .from('learning_paths')
    .select('*')
    .or(`organization_id.is.null,organization_id.eq.${user.organization_id || 'null'}`)

  if (assignedPathIds.length > 0) {
    query = query.or(`id.in.(${assignedPathIds.join(',')})`)
  }

  const { data: paths, error } = await query

  if (error) {
    throw new Error(`Failed to fetch paths: ${error.message}`)
  }

  // Calcular progresso para cada trilha
  const pathsWithProgress = await Promise.all(
    (paths || []).map(async (path: any) => {
      const progress = await getPathProgress(path.id).catch(() => ({
        overall_progress: 0,
        completed_courses: 0,
        total_courses: 0,
        next_course_id: null,
        next_course_slug: null,
        is_completed: false,
      }))

      const assignment = assignments?.find((a) => a.path_id === path.id)

      return {
        ...path,
        progress: progress.overall_progress,
        completed_courses: progress.completed_courses,
        total_courses: progress.total_courses,
        next_course_slug: progress.next_course_slug,
        is_completed: progress.is_completed,
        assignment_status: assignment?.status || null,
        started_at: assignment?.started_at || null,
        completed_at: assignment?.completed_at || null,
      }
    })
  )

  return pathsWithProgress
}

