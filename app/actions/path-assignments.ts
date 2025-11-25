'use server'

import { createClient } from '@/lib/supabase/server'
import { requireSuperAdmin, requireAuth } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { enrollInCourse } from './courses'
import { notifyCourseAssigned } from '@/lib/notifications/triggers'

/**
 * Atribuir trilha a um usuário
 */
export async function assignPathToUser(
  userId: string,
  pathId: string,
  options?: {
    deadline?: Date
    isMandatory?: boolean
    autoEnrollFirstCourse?: boolean
  }
) {
  const supabase = createClient()
  await requireSuperAdmin()

  // Verificar se já existe atribuição
  const { data: existing } = await supabase
    .from('user_path_assignments')
    .select('*')
    .eq('user_id', userId)
    .eq('path_id', pathId)
    .single()

  if (existing) {
    // Atualizar atribuição existente
    const { data, error } = await supabase
      .from('user_path_assignments')
      .update({
        deadline: options?.deadline?.toISOString() || null,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update path assignment: ${error.message}`)
    }

    return data
  }

  // Criar nova atribuição
  const { data: assignment, error } = await supabase
    .from('user_path_assignments')
    .insert({
      user_id: userId,
      path_id: pathId,
      deadline: options?.deadline?.toISOString() || null,
      status: 'assigned',
      assigned_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to assign path: ${error.message}`)
  }

  // Auto-enroll no primeiro curso se solicitado
  if (options?.autoEnrollFirstCourse) {
    const { getLearningPathWithCourses } = await import('./learning-paths')
    const pathWithCourses = await getLearningPathWithCourses(pathId).catch(() => null)

    if (pathWithCourses?.path_courses && pathWithCourses.path_courses.length > 0) {
      const firstCourse = pathWithCourses.path_courses[0]
      if (firstCourse.courses) {
        try {
          await enrollInCourse(firstCourse.courses.id)
          
          // Criar notificação
          await notifyCourseAssigned(
            userId,
            firstCourse.courses.title,
            firstCourse.courses.slug,
            options?.isMandatory || false,
            options?.deadline
          )
        } catch (enrollError) {
          console.error('Error auto-enrolling in first course:', enrollError)
        }
      }
    }
  }

  revalidatePath('/admin/paths')
  revalidatePath('/paths')
  revalidatePath('/dashboard')

  return assignment
}

/**
 * Atribuir trilha a múltiplos usuários
 */
export async function assignPathToUsers(
  userIds: string[],
  pathId: string,
  options?: {
    deadline?: Date
    isMandatory?: boolean
    autoEnrollFirstCourse?: boolean
  }
) {
  const results = await Promise.allSettled(
    userIds.map((userId) =>
      assignPathToUser(userId, pathId, options).catch((error) => {
        console.error(`Error assigning path to user ${userId}:`, error)
        return { error: error.message, userId }
      })
    )
  )

  const successful = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  return {
    successful,
    failed,
    total: userIds.length,
  }
}

/**
 * Verificar e desbloquear próximo curso da trilha
 */
export async function unlockNextCourseInPath(pathId: string, userId: string) {
  const user = await requireAuth()
  if (user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const supabase = createClient()
  const { getLearningPathWithCourses } = await import('./learning-paths')
  const { getCourseProgress } = await import('./course-progress')

  const pathWithCourses = await getLearningPathWithCourses(pathId).catch(() => null)
  if (!pathWithCourses?.path_courses) return

  // Encontrar o próximo curso bloqueado
  for (let i = 0; i < pathWithCourses.path_courses.length; i++) {
    const pathCourse = pathWithCourses.path_courses[i]
    if (!pathCourse.courses) continue

    const courseProgress = await getCourseProgress(pathCourse.courses.id).catch(() => null)
    const progress = courseProgress?.completion_percentage || 0

    // Se este curso não está completo, verificar se está bloqueado
    if (progress < 100 && i > 0) {
      const previousCourse = pathWithCourses.path_courses[i - 1]
      if (previousCourse.courses) {
        const prevProgress = await getCourseProgress(previousCourse.courses.id).catch(() => null)
        
        // Se curso anterior foi completado, desbloquear este
        if ((prevProgress?.completion_percentage || 0) >= 100) {
          // Auto-enroll no próximo curso
          try {
            const { enrollInCourse } = await import('./courses')
            await enrollInCourse(pathCourse.courses.id)
            
            // Criar notificação
            await notifyCourseAssigned(
              userId,
              pathCourse.courses.title,
              pathCourse.courses.slug,
              pathCourse.is_required,
              undefined
            )
          } catch (error) {
            console.error('Error auto-enrolling in next course:', error)
          }
        }
      }
    }
  }

  revalidatePath(`/paths/${pathWithCourses.slug}`)
  revalidatePath('/dashboard')
}

/**
 * Verificar conclusão da trilha e gerar certificado se aplicável
 */
export async function checkPathCompletion(pathId: string, userId: string) {
  const user = await requireAuth()
  if (user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const supabase = createClient()
  const { getLearningPathWithCourses } = await import('./learning-paths')
  const { getPathProgress } = await import('./path-progress')

  const progress = await getPathProgress(pathId)

  if (progress.is_completed) {
    // Atualizar status da atribuição
    const { data: assignment } = await supabase
      .from('user_path_assignments')
      .select('*')
      .eq('user_id', userId)
      .eq('path_id', pathId)
      .single()

    if (assignment && assignment.status !== 'completed') {
      await supabase
        .from('user_path_assignments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', assignment.id)

      // Criar notificação de conclusão
      const path = await getLearningPathWithCourses(pathId).catch(() => null)
      if (path) {
        const { createNotification } = await import('./notifications')
        await createNotification({
          user_id: userId,
          type: 'course_completed',
          title: `Trilha Completa: ${path.title}`,
          message: `Parabéns! Você completou a trilha ${path.title}.`,
          metadata: {
            path_id: pathId,
            path_slug: path.slug,
          },
          action_url: `/paths/${path.slug}`,
          action_label: 'Ver Trilha',
        })
      }
    }
  }

  revalidatePath(`/paths/${pathId}`)
  revalidatePath('/dashboard')
}

