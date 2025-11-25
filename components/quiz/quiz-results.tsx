'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle2, XCircle, Info } from 'lucide-react'
import type { Quiz, QuizQuestion, QuestionOption } from '@/lib/types/database'

interface QuizResultsProps {
  quiz: Quiz & {
    quiz_questions: (QuizQuestion & { question_options: QuestionOption[] })[]
  }
  attempt: {
    user_answers: Array<{
      question_id: string
      selected_option_id: string | null
      is_correct: boolean
      points_earned: number
      question_options?: QuestionOption
      quiz_questions?: QuizQuestion & { question_options: QuestionOption[] }
    }>
  }
  showCorrectAnswers: boolean
}

export function QuizResults({ quiz, attempt, showCorrectAnswers }: QuizResultsProps) {
  const questions = quiz.quiz_questions

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-medium text-white mb-4">
        Respostas Detalhadas
      </h2>

      {questions.map((question, index) => {
        const userAnswer = attempt.user_answers.find(
          (a) => a.question_id === question.id
        )
        const selectedOption = userAnswer
          ? question.question_options.find(
              (opt) => opt.id === userAnswer.selected_option_id
            )
          : null
        const isCorrect = userAnswer?.is_correct || false

        return (
          <Card
            key={question.id}
            className={`bg-slate-900 border-slate-800 ${
              isCorrect ? 'border-green-800/50' : 'border-red-800/50'
            }`}
          >
            <CardHeader>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <CardTitle className="font-display text-lg text-white mb-2">
                    Questão {index + 1}: {question.question_text}
                  </CardTitle>
                  <div className="text-sm text-slate-400">
                    {question.points} ponto(s) • Você ganhou {userAnswer?.points_earned || 0} ponto(s)
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Options */}
              <div className="space-y-2">
                {question.question_options.map((option, optIndex) => {
                  const isSelected = selectedOption?.id === option.id
                  const isCorrectOption = option.is_correct

                  return (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border ${
                        isCorrectOption && showCorrectAnswers
                          ? 'bg-green-950/30 border-green-800/50'
                          : isSelected && !isCorrectOption
                          ? 'bg-red-950/30 border-red-800/50'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrectOption && showCorrectAnswers && (
                          <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        )}
                        {isSelected && !isCorrectOption && (
                          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm font-medium text-slate-400 mr-2">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span
                          className={`text-sm ${
                            isCorrectOption && showCorrectAnswers
                              ? 'text-green-300'
                              : isSelected && !isCorrectOption
                              ? 'text-red-300'
                              : 'text-slate-300'
                          }`}
                        >
                          {option.option_text}
                        </span>
                        {isSelected && (
                          <span className="ml-auto text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                            Sua resposta
                          </span>
                        )}
                        {isCorrectOption && showCorrectAnswers && !isSelected && (
                          <span className="ml-auto text-xs px-2 py-1 bg-green-950/50 text-green-400 rounded">
                            Correta
                          </span>
                        )}
                      </div>
                      {option.explanation && showCorrectAnswers && (
                        <div className="mt-2 ml-6 text-xs text-slate-400">
                          {option.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Question Explanation */}
              {question.explanation && showCorrectAnswers && (
                <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Explicação</div>
                      <div className="text-sm text-slate-300">{question.explanation}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

