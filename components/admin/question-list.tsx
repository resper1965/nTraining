'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Edit, Trash2, GripVertical, CheckCircle2, XCircle } from 'lucide-react'
import { deleteQuestion, reorderQuestions } from '@/app/actions/quizzes'
import { useRouter } from 'next/navigation'
import type { QuizQuestion, QuestionOption } from '@/lib/types/database'

interface QuestionListProps {
  quizId: string
  questions: (QuizQuestion & { question_options: QuestionOption[] })[]
}

export function QuestionList({ quizId, questions }: QuestionListProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (questionId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta questão?')) {
      return
    }

    setIsDeleting(questionId)
    try {
      await deleteQuestion(questionId)
      router.refresh()
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Erro ao deletar questão. Tente novamente.')
    } finally {
      setIsDeleting(null)
    }
  }

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      multiple_choice: 'Múltipla Escolha',
      true_false: 'Verdadeiro/Falso',
      scenario: 'Cenário',
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const correctOptions = question.question_options.filter(opt => opt.is_correct)
        
        return (
          <Card
            key={question.id}
            className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center gap-2 text-slate-500 mt-1">
                    <GripVertical className="h-5 w-5" />
                    <span className="text-sm font-mono">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="font-display text-lg text-white mb-2">
                      {question.question_text}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>{getQuestionTypeLabel(question.question_type)}</span>
                      <span>•</span>
                      <span>{question.points} ponto(s)</span>
                      {question.explanation && (
                        <>
                          <span>•</span>
                          <span>Com explicação</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/quizzes/${quizId}/questions/${question.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(question.id)}
                    disabled={isDeleting === question.id}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Options */}
              <div className="space-y-2">
                {question.question_options.map((option, optIndex) => (
                  <div
                    key={option.id}
                    className={`flex items-center gap-2 p-2 rounded ${
                      option.is_correct
                        ? 'bg-green-950/30 border border-green-800/50'
                        : 'bg-slate-800'
                    }`}
                  >
                    {option.is_correct ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        option.is_correct ? 'text-green-300' : 'text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option.option_text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

