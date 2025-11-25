'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { submitQuizAttempt } from '@/app/actions/quiz-attempts'
import type { Quiz, QuizQuestion, QuestionOption } from '@/lib/types/database'

interface QuizPlayerProps {
  quiz: Quiz & {
    quiz_questions: (QuizQuestion & { question_options: QuestionOption[] })[]
  }
  attemptId: string
  timeLimitMinutes?: number
}

export function QuizPlayer({ quiz, attemptId, timeLimitMinutes }: QuizPlayerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    timeLimitMinutes ? timeLimitMinutes * 60 : null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const startTimeRef = useRef<number>(Date.now())

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Time's up - auto submit
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  const currentQuestion = quiz.quiz_questions[currentQuestionIndex]
  const totalQuestions = quiz.quiz_questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    // Check if all questions are answered
    const unansweredQuestions = quiz.quiz_questions.filter(
      (q) => !answers[q.id]
    )

    if (unansweredQuestions.length > 0) {
      const confirmSubmit = confirm(
        `Você não respondeu ${unansweredQuestions.length} questão(ões). Deseja finalizar mesmo assim?`
      )
      if (!confirmSubmit) return
    }

    setIsSubmitting(true)

    try {
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const answersArray = quiz.quiz_questions.map((q) => ({
        question_id: q.id,
        selected_option_id: answers[q.id] || null,
      }))

      const result = await submitQuizAttempt(attemptId, answersArray, timeTaken)

      // Extract course slug from pathname
      const pathParts = pathname.split('/')
      const courseSlug = pathParts[2]
      
      // Redirect to results page
      router.push(`/courses/${courseSlug}/quiz/${quiz.id}/result/${attemptId}`)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Erro ao finalizar quiz. Tente novamente.')
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Timer and Progress */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {timeRemaining !== null && (
                <div className="flex items-center gap-2">
                  <Clock className={`h-5 w-5 ${timeRemaining < 60 ? 'text-red-400' : 'text-slate-400'}`} />
                  <span className={`text-lg font-mono ${timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              <div className="text-sm text-slate-400">
                Questão {currentQuestionIndex + 1} de {totalQuestions}
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-xl text-white">
            {currentQuestion.question_text}
          </CardTitle>
          <CardDescription>
            {currentQuestion.points} ponto(s) • {currentQuestion.question_type === 'multiple_choice' ? 'Múltipla Escolha' : currentQuestion.question_type === 'true_false' ? 'Verdadeiro/Falso' : 'Cenário'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            <div className="space-y-3">
              {currentQuestion.question_options.map((option, index) => (
                <div
                  key={option.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                    answers[currentQuestion.id] === option.id
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer text-white"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-slate-400 mt-0.5">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option.option_text}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Anterior
        </Button>

        <div className="flex items-center gap-2">
          {quiz.quiz_questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded text-sm transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-primary text-white'
                  : answers[q.id]
                  ? 'bg-green-950/50 text-green-400 border border-green-800'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button onClick={handleNext}>
            Próxima →
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Finalizando...' : 'Finalizar Quiz'}
          </Button>
        )}
      </div>

      {/* Warning if not all answered */}
      {Object.keys(answers).length < totalQuestions && (
        <Card className="bg-yellow-950/20 border-yellow-800/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">
                {totalQuestions - Object.keys(answers).length} questão(ões) sem resposta
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

