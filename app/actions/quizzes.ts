'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth, requireRole } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Quiz, QuizQuestion, QuestionOption } from '@/lib/types/database'

/**
 * Get all quizzes (admin) or quizzes for a course
 */
export async function getQuizzes(courseId?: string) {
  const supabase = createClient()
  await requireAuth()

  let query = supabase
    .from('quizzes')
    .select(`
      *,
      courses (
        id,
        title,
        slug
      )
    `)
    .order('created_at', { ascending: false })

  if (courseId) {
    query = query.eq('course_id', courseId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Erro ao buscar quizzes: ${error.message}`)
  }

  return data
}

/**
 * Get quiz by ID with questions and options
 */
export async function getQuizById(quizId: string) {
  const supabase = createClient()
  await requireAuth()

  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      courses (
        id,
        title,
        slug
      ),
      quiz_questions (
        *,
        question_options (
          *
        )
      )
    `)
    .eq('id', quizId)
    .single()

  if (error) {
    throw new Error(`Erro ao buscar quiz: ${error.message}`)
  }

  // Sort questions by order_index
  if (data.quiz_questions) {
    data.quiz_questions.sort((a: any, b: any) => a.order_index - b.order_index)
    // Sort options by order_index
    data.quiz_questions.forEach((q: any) => {
      if (q.question_options) {
        q.question_options.sort((a: any, b: any) => a.order_index - b.order_index)
      }
    })
  }

  return data as Quiz & {
    courses: any
    quiz_questions: (QuizQuestion & { question_options: QuestionOption[] })[]
  }
}

/**
 * Create a new quiz
 */
export async function createQuiz(formData: {
  title: string
  description?: string
  course_id: string
  passing_score?: number
  max_attempts?: number
  time_limit_minutes?: number
  is_required?: boolean
}) {
  const supabase = createClient()
  await requireRole('platform_admin')

  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      title: formData.title,
      description: formData.description || null,
      course_id: formData.course_id,
      passing_score: formData.passing_score || 70,
      max_attempts: formData.max_attempts || null,
      time_limit_minutes: formData.time_limit_minutes || null,
      is_required: formData.is_required || false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar quiz: ${error.message}`)
  }

  revalidatePath('/admin/quizzes')
  revalidatePath(`/admin/courses/${formData.course_id}`)

  return data as Quiz
}

/**
 * Update quiz
 */
export async function updateQuiz(
  quizId: string,
  formData: Partial<{
    title: string
    description: string
    course_id: string
    passing_score: number
    max_attempts: number
    time_limit_minutes: number
    is_required: boolean
  }>
) {
  const supabase = createClient()
  await requireRole('platform_admin')

  const { data, error } = await supabase
    .from('quizzes')
    .update(formData)
    .eq('id', quizId)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar quiz: ${error.message}`)
  }

  revalidatePath('/admin/quizzes')
  revalidatePath(`/admin/quizzes/${quizId}`)

  return data as Quiz
}

/**
 * Delete quiz
 */
export async function deleteQuiz(quizId: string) {
  const supabase = createClient()
  await requireRole('platform_admin')

  const { error } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', quizId)

  if (error) {
    throw new Error(`Erro ao deletar quiz: ${error.message}`)
  }

  revalidatePath('/admin/quizzes')
}

/**
 * Create a question for a quiz
 */
export async function createQuestion(
  quizId: string,
  formData: {
    question_text: string
    question_type: 'multiple_choice' | 'true_false' | 'scenario'
    points: number
    explanation?: string
    options: Array<{
      option_text: string
      is_correct: boolean
      explanation?: string
    }>
  }
) {
  const supabase = createClient()
  await requireRole('platform_admin')

  // Get current max order_index
  const { data: existingQuestions } = await supabase
    .from('quiz_questions')
    .select('order_index')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrderIndex = existingQuestions && existingQuestions.length > 0
    ? existingQuestions[0].order_index + 1
    : 0

  // Create question
  const { data: question, error: questionError } = await supabase
    .from('quiz_questions')
    .insert({
      quiz_id: quizId,
      question_text: formData.question_text,
      question_type: formData.question_type,
      points: formData.points,
      explanation: formData.explanation || null,
      order_index: nextOrderIndex,
    })
    .select()
    .single()

  if (questionError) {
    throw new Error(`Erro ao criar questão: ${questionError.message}`)
  }

  // Create options
  const optionsToInsert = formData.options.map((opt, index) => ({
    question_id: question.id,
    option_text: opt.option_text,
    is_correct: opt.is_correct,
    explanation: opt.explanation || null,
    order_index: index,
  }))

  const { error: optionsError } = await supabase
    .from('question_options')
    .insert(optionsToInsert)

  if (optionsError) {
    // Rollback: delete question if options fail
    await supabase.from('quiz_questions').delete().eq('id', question.id)
    throw new Error(`Erro ao criar opções: ${optionsError.message}`)
  }

  revalidatePath(`/admin/quizzes/${quizId}`)

  return question as QuizQuestion
}

/**
 * Update question
 */
export async function updateQuestion(
  questionId: string,
  formData: Partial<{
    question_text: string
    question_type: 'multiple_choice' | 'true_false' | 'scenario'
    points: number
    explanation: string
    options: Array<{
      id?: string
      option_text: string
      is_correct: boolean
      explanation?: string
    }>
  }>
) {
  const supabase = createClient()
  await requireRole('platform_admin')

  // Update question
  const questionUpdate: any = {}
  if (formData.question_text !== undefined) questionUpdate.question_text = formData.question_text
  if (formData.question_type !== undefined) questionUpdate.question_type = formData.question_type
  if (formData.points !== undefined) questionUpdate.points = formData.points
  if (formData.explanation !== undefined) questionUpdate.explanation = formData.explanation

  if (Object.keys(questionUpdate).length > 0) {
    const { error } = await supabase
      .from('quiz_questions')
      .update(questionUpdate)
      .eq('id', questionId)

    if (error) {
      throw new Error(`Erro ao atualizar questão: ${error.message}`)
    }
  }

  // Update options if provided
  if (formData.options) {
    // Delete existing options
    await supabase
      .from('question_options')
      .delete()
      .eq('question_id', questionId)

    // Insert new options
    const optionsToInsert = formData.options.map((opt, index) => ({
      question_id: questionId,
      option_text: opt.option_text,
      is_correct: opt.is_correct,
      explanation: opt.explanation || null,
      order_index: index,
    }))

    const { error: optionsError } = await supabase
      .from('question_options')
      .insert(optionsToInsert)

    if (optionsError) {
      throw new Error(`Erro ao atualizar opções: ${optionsError.message}`)
    }
  }

  // Get quiz_id for revalidation
  const { data: question } = await supabase
    .from('quiz_questions')
    .select('quiz_id')
    .eq('id', questionId)
    .single()

  if (question) {
    revalidatePath(`/admin/quizzes/${question.quiz_id}`)
  }
}

/**
 * Delete question
 */
export async function deleteQuestion(questionId: string) {
  const supabase = createClient()
  await requireRole('platform_admin')

  // Get quiz_id before deleting
  const { data: question } = await supabase
    .from('quiz_questions')
    .select('quiz_id')
    .eq('id', questionId)
    .single()

  const { error } = await supabase
    .from('quiz_questions')
    .delete()
    .eq('id', questionId)

  if (error) {
    throw new Error(`Erro ao deletar questão: ${error.message}`)
  }

  if (question) {
    revalidatePath(`/admin/quizzes/${question.quiz_id}`)
  }
}

/**
 * Reorder questions
 */
export async function reorderQuestions(questionIds: string[]) {
  const supabase = createClient()
  await requireRole('platform_admin')

  const updates = questionIds.map((id, index) => ({
    id,
    order_index: index,
  }))

  for (const update of updates) {
    const { error } = await supabase
      .from('quiz_questions')
      .update({ order_index: update.order_index })
      .eq('id', update.id)

    if (error) {
      throw new Error(`Erro ao reordenar questões: ${error.message}`)
    }
  }
}

