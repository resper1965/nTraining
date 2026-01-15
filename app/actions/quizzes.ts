'use server'

// ============================================================================
// Quiz Server Actions (Refatorado)
// ============================================================================
// Esta camada apenas orquestra: Auth → Validação → Service → Response

import { revalidatePath } from 'next/cache'
import { requireAuth, requireRole } from '@/lib/auth/helpers'
import { QuizService, QuizServiceError } from '@/lib/services/quiz.service'
import {
  validateQuizCreate,
  validateQuizUpdate,
  validateQuestionCreate,
  validateQuestionUpdate,
  validateReorderQuestions,
  type QuizCreateInput,
  type QuizUpdateInput,
  type QuestionCreateInput,
  type QuestionUpdateInput,
  type ReorderQuestionsInput,
} from '@/lib/validators/quiz.schema'
import type { Quiz, QuizQuestion } from '@/lib/types/database'
import type { QuizWithQuestions } from '@/lib/services/quiz.service'
import { ZodError } from 'zod'

// ============================================================================
// Error Types
// ============================================================================

export interface ActionError {
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

// ============================================================================
// GET QUIZZES
// ============================================================================

export async function getQuizzes(courseId?: string): Promise<any[]> {
  try {
    await requireAuth()

    const service = new QuizService()
    return await service.getQuizzes(courseId)
  } catch (error) {
    if (error instanceof QuizServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// GET QUIZ BY ID
// ============================================================================

export async function getQuizById(
  quizId: string
): Promise<QuizWithQuestions | ActionError> {
  try {
    await requireAuth()

    const service = new QuizService()
    const quiz = await service.getQuizById(quizId)
    return quiz
  } catch (error) {
    if (error instanceof QuizServiceError) {
      return {
        message: error.message,
        code: error.code,
      }
    }
    return {
      message: 'Erro ao buscar quiz',
      code: 'UNKNOWN_ERROR',
    }
  }
}

// ============================================================================
// CREATE QUIZ
// ============================================================================

export async function createQuiz(input: unknown): Promise<Quiz> {
  try {
    await requireRole('platform_admin')

    const validatedInput = validateQuizCreate(input)

    const service = new QuizService()
    const quiz = await service.createQuiz(validatedInput)

    revalidatePath('/admin/quizzes')
    revalidatePath(`/admin/courses/${validatedInput.course_id}`)
    return quiz
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Dados inválidos')
    }
    if (error instanceof QuizServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// UPDATE QUIZ
// ============================================================================

export async function updateQuiz(quizId: string, input: unknown): Promise<Quiz> {
  try {
    await requireRole('platform_admin')

    const validation = validateQuizUpdate(input)
    if (!validation.success) {
      throw new Error('Dados inválidos')
    }

    const service = new QuizService()
    const quiz = await service.updateQuiz(quizId, validation.data)

    revalidatePath('/admin/quizzes')
    revalidatePath(`/admin/quizzes/${quizId}`)
    revalidatePath(`/admin/quizzes/${quizId}/edit`)
    return quiz
  } catch (error) {
    if (error instanceof QuizServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// DELETE QUIZ
// ============================================================================

export async function deleteQuiz(quizId: string): Promise<void> {
  try {
    await requireRole('platform_admin')

    const service = new QuizService()
    await service.deleteQuiz(quizId)

    revalidatePath('/admin/quizzes')
  } catch (error) {
    if (error instanceof QuizServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// CREATE QUESTION
// ============================================================================

export async function createQuestion(
  quizId: string,
  input: unknown
): Promise<QuizQuestion> {
  try {
    await requireRole('platform_admin')

    const validatedInput = validateQuestionCreate({ ...(input as any), quiz_id: quizId })

    const service = new QuizService()
    const question = await service.createQuestion(validatedInput)

    revalidatePath(`/admin/quizzes/${quizId}`)
    return question
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Dados inválidos')
    }
    if (error instanceof QuizServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// UPDATE QUESTION
// ============================================================================

export async function updateQuestion(
  questionId: string,
  input: unknown
): Promise<void> {
  try {
    await requireRole('platform_admin')

    const validation = validateQuestionUpdate(input)
    if (!validation.success) {
      throw new Error('Dados inválidos')
    }

    const service = new QuizService()
    const { quizId } = await service.updateQuestion(questionId, validation.data)

    revalidatePath(`/admin/quizzes/${quizId}`)
  } catch (error) {
    if (error instanceof QuizServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// DELETE QUESTION
// ============================================================================

export async function deleteQuestion(questionId: string): Promise<void> {
  try {
    await requireRole('platform_admin')

    const service = new QuizService()
    const { quizId } = await service.deleteQuestion(questionId)

    revalidatePath(`/admin/quizzes/${quizId}`)
  } catch (error) {
    if (error instanceof QuizServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}

// ============================================================================
// REORDER QUESTIONS
// ============================================================================

export async function reorderQuestions(questionIds: string[]): Promise<void> {
  try {
    await requireRole('platform_admin')

    const validatedInput = validateReorderQuestions({ question_ids: questionIds })

    const service = new QuizService()
    await service.reorderQuestions(validatedInput)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Dados inválidos')
    }
    if (error instanceof QuizServiceError) {
      throw new Error(error.message)
    }
    throw error
  }
}
