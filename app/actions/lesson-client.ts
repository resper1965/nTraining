'use server'

import { updateLessonProgress } from './progress'

export async function updateLessonProgressClient(
  lessonId: string,
  data: {
    watched_duration_seconds?: number
    last_position_seconds?: number
    is_completed?: boolean
  }
) {
  return updateLessonProgress(lessonId, data)
}

