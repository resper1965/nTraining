'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
import { Plus, Trash2 } from 'lucide-react'

interface QuestionFormProps {
  quizId: string
  question?: {
    question_text: string
    question_type: 'multiple_choice' | 'true_false' | 'scenario'
    points: number
    explanation?: string
    question_options: Array<{
      option_text: string
      is_correct: boolean
      explanation?: string
    }>
  }
}

export function QuestionForm({ quizId, question }: QuestionFormProps) {
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'true_false' | 'scenario'>(
    question?.question_type || 'multiple_choice'
  )
  const [options, setOptions] = useState<Array<{ text: string; is_correct: boolean; explanation: string }>>(
    question?.question_options.map(opt => ({
      text: opt.option_text,
      is_correct: opt.is_correct,
      explanation: opt.explanation || '',
    })) || [
      { text: '', is_correct: false, explanation: '' },
      { text: '', is_correct: false, explanation: '' },
    ]
  )

  const addOption = () => {
    setOptions([...options, { text: '', is_correct: false, explanation: '' }])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, field: 'text' | 'is_correct' | 'explanation', value: string | boolean) => {
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
    }
    setOptions(newOptions)
  }

  // For true/false, ensure exactly 2 options
  useEffect(() => {
    if (questionType === 'true_false' && options.length !== 2) {
      setOptions([
        { text: 'Verdadeiro', is_correct: false, explanation: '' },
        { text: 'Falso', is_correct: false, explanation: '' },
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType])

  return (
    <>
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-xl text-white">
            Informações da Questão
          </CardTitle>
          <CardDescription>
            Configure a questão e suas opções de resposta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question_text">Texto da Questão *</Label>
            <Textarea
              id="question_text"
              name="question_text"
              defaultValue={question?.question_text || ''}
              placeholder="Digite a pergunta..."
              rows={4}
              required
            />
          </div>

          {/* Question Type */}
          <div className="space-y-2">
            <Label htmlFor="question_type">Tipo de Questão *</Label>
            <select
              id="question_type"
              name="question_type"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as any)}
              required
              className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="multiple_choice">Múltipla Escolha</option>
              <option value="true_false">Verdadeiro/Falso</option>
              <option value="scenario">Cenário</option>
            </select>
          </div>

          {/* Points */}
          <div className="space-y-2">
            <Label htmlFor="points">Pontos *</Label>
            <Input
              id="points"
              name="points"
              type="number"
              min="1"
              defaultValue={question?.points || 1}
              required
            />
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explicação (Opcional)</Label>
            <Textarea
              id="explanation"
              name="explanation"
              defaultValue={question?.explanation || ''}
              placeholder="Explicação que será mostrada após a resposta..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display text-xl text-white">
                Opções de Resposta
              </CardTitle>
              <CardDescription>
                Adicione as opções e marque qual(is) está(ão) correta(s)
              </CardDescription>
            </div>
            {questionType !== 'true_false' && (
              <Button type="button" onClick={addOption} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Opção
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <input type="hidden" name="option_count" value={options.length} />
          {options.map((option, index) => (
            <div
              key={index}
              className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`option_${index}_correct`}
                      name={`option_${index}_correct`}
                      checked={option.is_correct}
                      onChange={(e) => updateOption(index, 'is_correct', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`option_${index}_correct`} className="text-sm text-slate-300">
                      Resposta Correta
                    </Label>
                  </div>
                  <Input
                    name={`option_${index}_text`}
                    placeholder={`Opção ${index + 1}`}
                    defaultValue={option.text}
                    required
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                  />
                  <Textarea
                    name={`option_${index}_explanation`}
                    placeholder="Explicação desta opção (opcional)"
                    defaultValue={option.explanation}
                    rows={2}
                    onChange={(e) => updateOption(index, 'explanation', e.target.value)}
                  />
                </div>
                {questionType !== 'true_false' && options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/quizzes/${quizId}/questions`} className="flex-1">
          <Button type="button" variant="outline" className="w-full">
            Cancelar
          </Button>
        </Link>
        <Button type="submit" className="flex-1">
          {question ? 'Salvar Alterações' : 'Criar Questão'}
        </Button>
      </div>
    </>
  )
}

