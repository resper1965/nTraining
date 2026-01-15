'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  Quiz,
  QuizQuestion,
  QuestionOption,
  UserQuizAttemptWithAnswers,
} from '@/lib/types/database'

// ============================================================================
// Error Types
// ============================================================================

export interface ActionError {
  message: string
  code?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Get user's quiz attempts
 */
export async function getUserQuizAttempts(quizId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  const { data, error } = await supabase
    .from('user_quiz_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('quiz_id', quizId)
    .order('attempt_number', { ascending: false })

  if (error) {
    throw new Error(`Erro ao buscar tentativas: ${error.message}`)
  }

  return data
}

/**
 * Get quiz attempt by ID
 */
export async function getQuizAttemptById(
  attemptId: string
): Promise<UserQuizAttemptWithAnswers | ActionError> {
  try {
    const supabase = createClient()
    const user = await requireAuth()

    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .select(`
        *,
        user_answers (
          *,
          question_options (
            *
          ),
          quiz_questions (
            *
          )
        )
      `)
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      return {
        message: `Erro ao buscar tentativa: ${error.message}`,
        code: 'ATTEMPT_NOT_FOUND',
      }
    }

    if (!data) {
      return {
        message: 'Tentativa não encontrada',
        code: 'ATTEMPT_NOT_FOUND',
      }
    }

    return data as UserQuizAttemptWithAnswers
  } catch (error) {
    return {
      message: 'Erro ao buscar tentativa',
      code: 'UNKNOWN_ERROR',
    }
  }
}

/**
 * Start a new quiz attempt
 */
export async function startQuizAttempt(quizId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  // Get quiz details
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single()

  if (!quiz) {
    throw new Error('Quiz não encontrado')
  }

  // Check max attempts
  if (quiz.max_attempts) {
    const { data: attempts } = await supabase
      .from('user_quiz_attempts')
      .select('attempt_number')
      .eq('user_id', user.id)
      .eq('quiz_id', quizId)
      .order('attempt_number', { ascending: false })
      .limit(1)

    if (attempts && attempts.length > 0) {
      const lastAttempt = attempts[0]
      if (lastAttempt.attempt_number >= quiz.max_attempts) {
        throw new Error(`Você atingiu o limite máximo de ${quiz.max_attempts} tentativa(s)`)
      }
    }
  }

  // Get next attempt number
  const { data: existingAttempts } = await supabase
    .from('user_quiz_attempts')
    .select('attempt_number')
    .eq('user_id', user.id)
    .eq('quiz_id', quizId)
    .order('attempt_number', { ascending: false })
    .limit(1)

  const nextAttemptNumber = existingAttempts && existingAttempts.length > 0
    ? existingAttempts[0].attempt_number + 1
    : 1

  // Create new attempt
  const { data: attempt, error } = await supabase
    .from('user_quiz_attempts')
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      attempt_number: nextAttemptNumber,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao iniciar tentativa: ${error.message}`)
  }

  revalidatePath(`/courses/*/quiz/${quizId}`)

  return attempt
}

/**
 * Submit quiz answers and calculate score
 */
export async function submitQuizAttempt(
  attemptId: string,
  answers: Array<{
    question_id: string
    selected_option_id: string | null
  }>,
  timeTakenSeconds: number
) {
  const supabase = createClient()
  const user = await requireAuth()

  // Get attempt
  const { data: attempt } = await supabase
    .from('user_quiz_attempts')
    .select('*')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .single()

  if (!attempt) {
    throw new Error('Tentativa não encontrada')
  }

  if (attempt.completed_at) {
    throw new Error('Esta tentativa já foi finalizada')
  }

  // Get quiz and questions
  const { data: quiz } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_questions (
        *,
        question_options (
          *
        )
      )
    `)
    .eq('id', attempt.quiz_id)
    .single()

  if (!quiz) {
    throw new Error('Quiz não encontrado')
  }

  const questions = quiz.quiz_questions as (QuizQuestion & { question_options: QuestionOption[] })[]

  // Calculate score
  let totalScore = 0
  let maxScore = 0
  const userAnswers: Array<{
    attempt_id: string
    question_id: string
    selected_option_id: string | null
    is_correct: boolean
    points_earned: number
  }> = []

  questions.forEach((question) => {
    maxScore += question.points

    const answer = answers.find((a) => a.question_id === question.id)
    const selectedOption = answer
      ? question.question_options.find((opt) => opt.id === answer.selected_option_id)
      : null

    const isCorrect = selectedOption?.is_correct || false
    const pointsEarned = isCorrect ? question.points : 0
    totalScore += pointsEarned

    userAnswers.push({
      attempt_id: attemptId,
      question_id: question.id,
      selected_option_id: answer?.selected_option_id || null,
      is_correct: isCorrect,
      points_earned: pointsEarned,
    })
  })

  const percentage = Math.round((totalScore / maxScore) * 100)
  const passed = percentage >= quiz.passing_score

  // Update attempt
  const { error: updateError } = await supabase
    .from('user_quiz_attempts')
    .update({
      score: totalScore,
      max_score: maxScore,
      percentage,
      passed,
      completed_at: new Date().toISOString(),
      time_taken_seconds: timeTakenSeconds,
    })
    .eq('id', attemptId)

  if (updateError) {
    throw new Error(`Erro ao atualizar tentativa: ${updateError.message}`)
  }

  // Insert answers
  if (userAnswers.length > 0) {
    const { error: answersError } = await supabase
      .from('user_answers')
      .insert(userAnswers)

    if (answersError) {
      throw new Error(`Erro ao salvar respostas: ${answersError.message}`)
    }
  }

  revalidatePath(`/courses`)

  return {
    attemptId,
    score: totalScore,
    maxScore,
    percentage,
    passed,
  }
}
