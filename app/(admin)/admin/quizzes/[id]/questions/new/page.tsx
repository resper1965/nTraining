import { requireSuperAdmin } from '@/lib/supabase/server'
import { getQuizById, createQuestion } from '@/app/actions/quizzes'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { QuestionForm } from '@/components/admin/question-form'

export const dynamic = 'force-dynamic'

export default async function NewQuestionPage({
  params,
}: {
  params: { id: string }
}) {
  await requireSuperAdmin()

  const quizResult = await getQuizById(params.id)
  
  if ('message' in quizResult) {
    notFound()
  }
  
  const quiz = quizResult

  async function handleCreateQuestion(formData: FormData) {
    'use server'

    const questionText = formData.get('question_text') as string
    const questionType = formData.get('question_type') as 'multiple_choice' | 'true_false' | 'scenario'
    const points = parseInt(formData.get('points') as string) || 1
    const explanation = formData.get('explanation') as string || undefined

    // Get options
    const options: Array<{ option_text: string; is_correct: boolean; explanation?: string }> = []
    const optionCount = parseInt(formData.get('option_count') as string) || 0

    for (let i = 0; i < optionCount; i++) {
      const optionText = formData.get(`option_${i}_text`) as string
      const isCorrect = formData.get(`option_${i}_correct`) === 'on'
      const optionExplanation = formData.get(`option_${i}_explanation`) as string || undefined

      if (optionText) {
        options.push({
          option_text: optionText,
          is_correct: isCorrect,
          explanation: optionExplanation,
        })
      }
    }

    if (options.length === 0) {
      throw new Error('Adicione pelo menos uma opção de resposta')
    }

    // For true/false, ensure exactly 2 options
    if (questionType === 'true_false' && options.length !== 2) {
      throw new Error('Questões Verdadeiro/Falso devem ter exatamente 2 opções')
    }

    await createQuestion(params.id, {
      question_text: questionText,
      question_type: questionType,
      points,
      explanation,
      options,
    })

    redirect(`/admin/quizzes/${params.id}/questions`)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/quizzes/${params.id}/questions`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-white">
            Nova Questão
          </h1>
          <p className="text-slate-400 mt-1">
            {quiz.title}
          </p>
        </div>
      </div>

      {/* Form */}
      <form action={handleCreateQuestion}>
        <QuestionForm quizId={params.id} />
      </form>
    </div>
  )
}

