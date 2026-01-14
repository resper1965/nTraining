// ============================================================================
// Quiz Service Layer
// ============================================================================
// Lógica de negócio e acesso ao banco de dados para quizzes
// REGRAS:
// - NUNCA recebe FormData, apenas objetos tipados (DTOs)
// - NUNCA usa redirect() ou revalidatePath()
// - Retorna dados puros ou lança erros tipados
// - Encapsula lógica de cálculo de nota e tentativas

import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Quiz, QuizQuestion, QuestionOption } from '@/lib/types/database'
import type {
  QuizCreateInput,
  QuizUpdateInput,
  QuestionCreateInput,
  QuestionUpdateInput,
  ReorderQuestionsInput,
} from '@/lib/validators/quiz.schema'

// ============================================================================
// Types
// ============================================================================

export interface QuizWithQuestions extends Quiz {
  courses: any
  quiz_questions: (QuizQuestion & { question_options: QuestionOption[] })[]
}

export class QuizServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'QuizServiceError'
  }
}

// ============================================================================
// Quiz Service Class
// ============================================================================

export class QuizService {
  private supabase: SupabaseClient

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || createClient()
  }

  // ============================================================================
  // QUIZZES
  // ============================================================================

  async getQuizzes(courseId?: string): Promise<any[]> {
    let query = this.supabase
      .from('quizzes')
      .select(
        `
        *,
        courses (
          id,
          title,
          slug
        )
      `
      )
      .order('created_at', { ascending: false })

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data, error } = await query

    if (error) {
      throw new QuizServiceError(
        `Erro ao buscar quizzes: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data || []
  }

  async getQuizById(quizId: string): Promise<QuizWithQuestions> {
    const { data, error } = await this.supabase
      .from('quizzes')
      .select(
        `
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
      `
      )
      .eq('id', quizId)
      .single()

    if (error) {
      throw new QuizServiceError(
        `Erro ao buscar quiz: ${error.message}`,
        'QUIZ_NOT_FOUND',
        error
      )
    }

    if (!data) {
      throw new QuizServiceError('Quiz não encontrado', 'QUIZ_NOT_FOUND')
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

    return data as QuizWithQuestions
  }

  async createQuiz(input: QuizCreateInput): Promise<Quiz> {
    const { data, error } = await this.supabase
      .from('quizzes')
      .insert({
        title: input.title,
        description: input.description,
        course_id: input.course_id,
        passing_score: input.passing_score,
        max_attempts: input.max_attempts,
        time_limit_minutes: input.time_limit_minutes,
        show_correct_answers: input.show_correct_answers,
      })
      .select()
      .single()

    if (error) {
      throw new QuizServiceError(
        `Erro ao criar quiz: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data as Quiz
  }

  async updateQuiz(quizId: string, input: QuizUpdateInput): Promise<Quiz> {
    // Verificar se quiz existe
    const { data: existing } = await this.supabase
      .from('quizzes')
      .select('id')
      .eq('id', quizId)
      .single()

    if (!existing) {
      throw new QuizServiceError('Quiz não encontrado', 'QUIZ_NOT_FOUND')
    }

    const updateData: Record<string, any> = {}
    if (input.title !== undefined) updateData.title = input.title
    if (input.description !== undefined) updateData.description = input.description
    if (input.passing_score !== undefined) updateData.passing_score = input.passing_score
    if (input.max_attempts !== undefined) updateData.max_attempts = input.max_attempts
    if (input.time_limit_minutes !== undefined)
      updateData.time_limit_minutes = input.time_limit_minutes
    if (input.show_correct_answers !== undefined)
      updateData.show_correct_answers = input.show_correct_answers

    const { data, error } = await this.supabase
      .from('quizzes')
      .update(updateData)
      .eq('id', quizId)
      .select()
      .single()

    if (error) {
      throw new QuizServiceError(
        `Erro ao atualizar quiz: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return data as Quiz
  }

  async deleteQuiz(quizId: string): Promise<void> {
    const { error } = await this.supabase.from('quizzes').delete().eq('id', quizId)

    if (error) {
      throw new QuizServiceError(
        `Erro ao deletar quiz: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }
  }

  // ============================================================================
  // QUESTIONS
  // ============================================================================

  async createQuestion(input: QuestionCreateInput): Promise<QuizQuestion> {
    // Get current max order_index
    const { data: existingQuestions } = await this.supabase
      .from('quiz_questions')
      .select('order_index')
      .eq('quiz_id', input.quiz_id)
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrderIndex =
      existingQuestions && existingQuestions.length > 0
        ? existingQuestions[0].order_index + 1
        : 0

    // Create question
    const { data: question, error: questionError } = await this.supabase
      .from('quiz_questions')
      .insert({
        quiz_id: input.quiz_id,
        question_text: input.question_text,
        question_type: input.question_type,
        points: input.points,
        explanation: input.explanation,
        order_index: nextOrderIndex,
      })
      .select()
      .single()

    if (questionError) {
      throw new QuizServiceError(
        `Erro ao criar questão: ${questionError.message}`,
        'SUPABASE_ERROR',
        questionError
      )
    }

    // Create options
    const optionsToInsert = input.options.map((opt, index) => ({
      question_id: question.id,
      option_text: opt.option_text,
      is_correct: opt.is_correct,
      explanation: opt.explanation,
      order_index: index,
    }))

    const { error: optionsError } = await this.supabase
      .from('question_options')
      .insert(optionsToInsert)

    if (optionsError) {
      // Rollback: delete question if options fail
      await this.supabase.from('quiz_questions').delete().eq('id', question.id)
      throw new QuizServiceError(
        `Erro ao criar opções: ${optionsError.message}`,
        'SUPABASE_ERROR',
        optionsError
      )
    }

    return question as QuizQuestion
  }

  async updateQuestion(questionId: string, input: QuestionUpdateInput): Promise<{ quizId: string }> {
    // Verificar se questão existe
    const { data: existing } = await this.supabase
      .from('quiz_questions')
      .select('quiz_id')
      .eq('id', questionId)
      .single()

    if (!existing) {
      throw new QuizServiceError('Questão não encontrada', 'QUESTION_NOT_FOUND')
    }

    // Update question
    const questionUpdate: Record<string, any> = {}
    if (input.question_text !== undefined) questionUpdate.question_text = input.question_text
    if (input.question_type !== undefined) questionUpdate.question_type = input.question_type
    if (input.points !== undefined) questionUpdate.points = input.points
    if (input.explanation !== undefined) questionUpdate.explanation = input.explanation

    if (Object.keys(questionUpdate).length > 0) {
      const { error } = await this.supabase
        .from('quiz_questions')
        .update(questionUpdate)
        .eq('id', questionId)

      if (error) {
        throw new QuizServiceError(
          `Erro ao atualizar questão: ${error.message}`,
          'SUPABASE_ERROR',
          error
        )
      }
    }

    // Update options if provided
    if (input.options) {
      // Delete existing options
      const { error: deleteError } = await this.supabase
        .from('question_options')
        .delete()
        .eq('question_id', questionId)

      if (deleteError) {
        throw new QuizServiceError(
          `Erro ao deletar opções antigas: ${deleteError.message}`,
          'SUPABASE_ERROR',
          deleteError
        )
      }

      // Insert new options
      const optionsToInsert = input.options.map((opt, index) => ({
        question_id: questionId,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
        explanation: opt.explanation,
        order_index: index,
      }))

      const { error: optionsError } = await this.supabase
        .from('question_options')
        .insert(optionsToInsert)

      if (optionsError) {
        throw new QuizServiceError(
          `Erro ao atualizar opções: ${optionsError.message}`,
          'SUPABASE_ERROR',
          optionsError
        )
      }
    }

    return { quizId: existing.quiz_id }
  }

  async deleteQuestion(questionId: string): Promise<{ quizId: string }> {
    // Get quiz_id before deleting
    const { data: question, error: fetchError } = await this.supabase
      .from('quiz_questions')
      .select('quiz_id')
      .eq('id', questionId)
      .single()

    if (fetchError || !question) {
      throw new QuizServiceError(
        'Questão não encontrada',
        'QUESTION_NOT_FOUND',
        fetchError
      )
    }

    const { error } = await this.supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId)

    if (error) {
      throw new QuizServiceError(
        `Erro ao deletar questão: ${error.message}`,
        'SUPABASE_ERROR',
        error
      )
    }

    return { quizId: question.quiz_id }
  }

  async reorderQuestions(input: ReorderQuestionsInput): Promise<void> {
    // Atualizar order_index de cada questão
    const updates = input.question_ids.map((id, index) =>
      this.supabase
        .from('quiz_questions')
        .update({ order_index: index })
        .eq('id', id)
    )

    const results = await Promise.all(updates)
    const errors = results.filter((r) => r.error)

    if (errors.length > 0) {
      throw new QuizServiceError(
        `Erro ao reordenar questões: ${errors[0].error?.message}`,
        'SUPABASE_ERROR',
        errors[0].error
      )
    }
  }
}
