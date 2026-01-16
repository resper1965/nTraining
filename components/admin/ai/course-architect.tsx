'use client'

// ============================================================================
// Course Architect Wizard Component
// ============================================================================
// Multi-step wizard para criação de cursos assistida por IA
// Design minimalista seguindo branding "ness."
// ============================================================================

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Textarea } from '@/components/ui/textarea'
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
  Loader2,
  X,
  CheckCircle2,
  Wand2,
} from 'lucide-react'
import { generateCourseStructure, getKnowledgeSources } from '@/app/actions/ai-admin'
import type { KnowledgeSource } from '@/lib/types/database'
import type { GeneratedCourseStructure } from '@/lib/types/ai'

// ============================================================================
// Schemas de Validação
// ============================================================================

const Step1Schema = z.object({
  topic: z.string().min(3, 'Tópico deve ter pelo menos 3 caracteres'),
})

type Step1FormData = z.infer<typeof Step1Schema>

// ============================================================================
// Component
// ============================================================================

export function CourseArchitect() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([])
  const [isLoadingSources, setIsLoadingSources] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedStructure, setGeneratedStructure] = useState<GeneratedCourseStructure | null>(null)
  const [thinkingMessages, setThinkingMessages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step1FormData>({
    resolver: zodResolver(Step1Schema),
    mode: 'onChange',
  })

  const topicValue = watch('topic')

  // Carregar knowledge sources quando entrar no passo 2
  useEffect(() => {
    if (currentStep === 2) {
      loadKnowledgeSources()
    }
  }, [currentStep])

  // Mensagens rotativas durante geração
  useEffect(() => {
    if (isGenerating) {
      const messages = [
        'Lendo documentos da Base de Conhecimento...',
        'Analisando normas e regulamentações...',
        'Estruturando módulos didáticos...',
        'Criando objetivos de aprendizado...',
        'Definindo sequência pedagógica...',
        'Criando avaliações e quizzes...',
        'Finalizando estrutura do curso...',
      ]

      let currentIndex = 0
      setThinkingMessages([messages[0]])

      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % messages.length
        setThinkingMessages((prev) => [...prev, messages[currentIndex]])
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isGenerating])

  const loadKnowledgeSources = async () => {
    setIsLoadingSources(true)
    try {
      const result = await getKnowledgeSources()
      if (result.success) {
        setKnowledgeSources(result.data)
      } else {
        toast.error(result.error.message)
      }
    } catch (error) {
      toast.error('Erro ao carregar Base de Conhecimento')
    } finally {
      setIsLoadingSources(false)
    }
  }

  const onStep1Submit = (data: Step1FormData) => {
    setCurrentStep(2)
  }

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const handleGenerate = async (topic: string) => {
    setIsGenerating(true)
    setCurrentStep(3)
    setGeneratedStructure(null)

    try {
      const result = await generateCourseStructure({
        topic,
        sourceIds: selectedSources.length > 0 ? selectedSources : undefined,
      })

      if (result.success) {
        setGeneratedStructure(result.data)
        setCurrentStep(4)
        toast.success('Estrutura de curso gerada com sucesso!')
      } else {
        toast.error(result.error.message)
        setCurrentStep(2) // Voltar para passo 2
      }
    } catch (error) {
      toast.error('Erro ao gerar estrutura do curso')
      setCurrentStep(2)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditField = (
    type: 'course' | 'module',
    field: string,
    value: string,
    moduleIndex?: number
  ) => {
    if (!generatedStructure) return

    if (type === 'course') {
      setGeneratedStructure({
        ...generatedStructure,
        [field]: value,
      })
    } else if (type === 'module' && moduleIndex !== undefined) {
      const updatedModules = [...generatedStructure.modules]
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        [field]: value,
      }
      setGeneratedStructure({
        ...generatedStructure,
        modules: updatedModules,
      })
    }
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSelectedSources([])
    setGeneratedStructure(null)
    setThinkingMessages([])
  }

  // ============================================================================
  // Render: Step 1 - Intenção
  // ============================================================================

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
    >
      <div className="w-full max-w-2xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 mb-4"
          >
            <Sparkles className="h-10 w-10 text-violet-400" />
          </motion.div>
          <h1 className="font-display text-4xl font-medium text-white">
            Course Architect
          </h1>
          <p className="text-lg text-zinc-400">
            Crie estruturas de cursos profissionais com o poder da IA
          </p>
        </div>

        {/* Input Gigante */}
        <form onSubmit={handleSubmit(onStep1Submit)} className="space-y-6">
          <div className="relative">
            <Input
              {...register('topic')}
              placeholder="Sobre o que vamos treinar a equipe hoje?"
              className="h-16 text-xl text-center bg-zinc-900/50 border-0 border-b-2 border-zinc-700 focus:border-violet-500 rounded-none focus:ring-0 placeholder:text-zinc-600"
            />
            {errors.topic && (
              <p className="mt-2 text-sm text-red-400 text-center">
                {errors.topic.message}
              </p>
            )}
          </div>

          {/* Botão Continuar (apenas quando válido) */}
          <AnimatePresence>
            {isValid && topicValue && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-center"
              >
                <Button
                  type="submit"
                  size="lg"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 h-14 px-8 text-lg"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  )

  // ============================================================================
  // Render: Step 2 - Contexto
  // ============================================================================

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-medium text-white">
          Selecionar Base de Conhecimento
        </h2>
        <p className="text-zinc-400">
          Opcional: Selecione documentos técnicos como referência para o curso
        </p>
      </div>

      {isLoadingSources ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : knowledgeSources.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-2">
              <FileText className="h-12 w-12 text-zinc-600 mx-auto" />
              <p className="text-zinc-400">
                Nenhum documento na Base de Conhecimento ainda
              </p>
              <p className="text-sm text-zinc-500">
                Você pode adicionar documentos na aba &quot;Knowledge Vault&quot;
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeSources.map((source) => {
            const isSelected = selectedSources.includes(source.id)
            return (
              <motion.div
                key={source.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-violet-500/10 border-violet-500/50 shadow-lg shadow-violet-500/20'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  } backdrop-blur-md`}
                  onClick={() => toggleSourceSelection(source.id)}
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-800">
                          <FileText className="h-5 w-5 text-zinc-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">
                            {source.title}
                          </h3>
                          <p className="text-xs text-zinc-500 truncate">
                            {source.filename}
                          </p>
                        </div>
                      </div>
                      <Checkbox
                        checked={isSelected}
                        className="flex-shrink-0"
                        disabled
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`px-2 py-1 rounded ${
                          source.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : source.status === 'processing'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {source.status === 'completed'
                          ? 'Pronto'
                          : source.status === 'processing'
                          ? 'Indexando'
                          : 'Erro'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(1)}
          className="text-zinc-400 hover:text-white"
        >
          Voltar
        </Button>
        <Button
          onClick={() => handleGenerate(topicValue || '')}
          disabled={!topicValue || isGenerating}
          size="lg"
          className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          Arquitetar Curso
        </Button>
      </div>
    </motion.div>
  )

  // ============================================================================
  // Render: Step 3 - Loading (Thinking UI)
  // ============================================================================

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
          <Sparkles className="h-12 w-12 text-violet-400" />
        </div>
      </motion.div>

      <div className="space-y-4 text-center max-w-md">
        <h2 className="font-display text-2xl font-medium text-white">
          Arquitetando seu curso...
        </h2>
        <AnimatePresence mode="wait">
          {thinkingMessages.length > 0 && (
            <motion.p
              key={thinkingMessages[thinkingMessages.length - 1]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-zinc-400 text-lg"
            >
              {thinkingMessages[thinkingMessages.length - 1]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md space-y-2">
        {thinkingMessages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.5, x: 0 }}
            className="flex items-center gap-3 text-sm text-zinc-600"
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{msg}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  // ============================================================================
  // Render: Step 4 - Preview/Rascunho
  // ============================================================================

  const renderStep4 = () => {
    if (!generatedStructure) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-medium text-white">
            Estrutura Gerada
          </h2>
          <p className="text-zinc-400">
            Revise e edite a estrutura antes de criar o curso
          </p>
        </div>

        {/* Edição do Título do Curso */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Título do Curso
              </label>
              <Input
                value={generatedStructure.title}
                onChange={(e) => handleEditField('course', 'title', e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Descrição
              </label>
              <Textarea
                value={generatedStructure.description}
                onChange={(e) =>
                  handleEditField('course', 'description', e.target.value)
                }
                rows={4}
                className="bg-zinc-800/50 border-zinc-700 text-white resize-none"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{generatedStructure.modules.length} módulos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="capitalize">{generatedStructure.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{generatedStructure.estimatedDurationHours}h estimadas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accordion de Módulos */}
        <Accordion type="single" collapsible className="space-y-4">
          {generatedStructure.modules.map((module, moduleIndex) => (
            <AccordionItem
              key={moduleIndex}
              value={`module-${moduleIndex}`}
              className="border-zinc-800"
            >
              <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md">
                <CardContent className="pt-0">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-medium">
                        {moduleIndex + 1}
                      </div>
                      <Input
                        value={module.title}
                        onChange={(e) =>
                          handleEditField(
                            'module',
                            'title',
                            e.target.value,
                            moduleIndex
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-transparent border-0 focus:border-b focus:border-violet-500 rounded-none text-white font-medium"
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        Descrição do Módulo
                      </label>
                      <Textarea
                        value={module.description}
                        onChange={(e) =>
                          handleEditField(
                            'module',
                            'description',
                            e.target.value,
                            moduleIndex
                          )
                        }
                        rows={2}
                        className="bg-zinc-800/50 border-zinc-700 text-white resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-zinc-300">
                        Aulas ({module.lessons.length})
                      </p>
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                              {lessonIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-zinc-500 truncate">
                                {lesson.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-zinc-500">
                              <span className="capitalize">{lesson.contentType}</span>
                              <span>{lesson.estimatedMinutes}min</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </CardContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Botões de Ação (Glass effect) */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800">
          <div className="max-w-4xl mx-auto flex items-center justify-end gap-4">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-zinc-400 hover:text-white"
            >
              <X className="mr-2 h-4 w-4" />
              Descartar
            </Button>
            <Button
              size="lg"
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Criar Curso Real
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  // ============================================================================
  // Render Principal
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1">{renderStep1()}</motion.div>
          )}
          {currentStep === 2 && (
            <motion.div key="step2">{renderStep2()}</motion.div>
          )}
          {currentStep === 3 && (
            <motion.div key="step3">{renderStep3()}</motion.div>
          )}
          {currentStep === 4 && (
            <motion.div key="step4" className="pb-24">
              {renderStep4()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
