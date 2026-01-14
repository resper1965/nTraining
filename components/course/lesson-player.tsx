'use client'

// ============================================================================
// Lesson Player Component
// ============================================================================
// Visualização final para o aluno com sidebar colapsável e barra de progresso
// Design minimalista seguindo branding "ness."
// ============================================================================

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  CheckCircle2,
  Circle,
  PlayCircle,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LessonEditor } from '@/components/editor/lesson-editor'

// ============================================================================
// Types
// ============================================================================

export interface Lesson {
  id: string
  title: string
  description?: string
  content?: string // HTML content
  contentType: 'video' | 'text' | 'pdf' | 'quiz' | 'embed'
  contentUrl?: string
  orderIndex: number
  isCompleted?: boolean
  estimatedMinutes?: number
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
  orderIndex: number
}

export interface LessonPlayerProps {
  courseTitle: string
  modules: Module[]
  currentLessonId: string
  onLessonChange: (lessonId: string) => void
  onLessonComplete?: (lessonId: string) => void
  className?: string
}

// ============================================================================
// Progress Bar Component
// ============================================================================

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  )
}

// ============================================================================
// Sidebar Navigation Component
// ============================================================================

function SidebarNavigation({
  modules,
  currentLessonId,
  onLessonChange,
  isOpen,
  onClose,
}: {
  modules: Module[]
  currentLessonId: string
  onLessonChange: (lessonId: string) => void
  isOpen: boolean
  onClose: () => void
}) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const completedLessons = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.isCompleted).length,
    0
  )
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <>
      {/* Overlay (mobile) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-zinc-900 border-r border-zinc-800 z-50 overflow-y-auto lg:relative lg:z-auto"
            >
              {/* Sidebar Header */}
              <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-display font-medium text-white">
                    Índice
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Summary */}
              <div className="p-4 border-b border-zinc-800">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-400">Progresso do Curso</span>
                  <span className="text-white font-medium">
                    {completedLessons}/{totalLessons}
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Modules & Lessons */}
              <div className="p-4 space-y-6">
                {modules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <h3 className="font-display text-sm font-medium text-zinc-300 uppercase tracking-wider">
                      {module.title}
                    </h3>
                    <ul className="space-y-1">
                      {module.lessons.map((lesson) => {
                        const isActive = lesson.id === currentLessonId
                        return (
                          <li key={lesson.id}>
                            <button
                              onClick={() => {
                                onLessonChange(lesson.id)
                                onClose()
                              }}
                              className={cn(
                                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                                isActive
                                  ? 'bg-primary/20 text-white border border-primary/30'
                                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                              )}
                            >
                              <span className="flex-shrink-0">
                                {lesson.isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Circle
                                    className={cn(
                                      'h-4 w-4',
                                      isActive ? 'text-primary' : 'text-zinc-600'
                                    )}
                                  />
                                )}
                              </span>
                              <span className="flex-1 truncate">{lesson.title}</span>
                              {lesson.estimatedMinutes && (
                                <span className="text-xs text-zinc-500 flex-shrink-0">
                                  {lesson.estimatedMinutes}min
                                </span>
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ============================================================================
// Lesson Player Component
// ============================================================================

export function LessonPlayer({
  courseTitle,
  modules,
  currentLessonId,
  onLessonChange,
  onLessonComplete,
  className,
}: LessonPlayerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null)
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null)

  // Flatten lessons for navigation
  const allLessons = modules.flatMap((m) => m.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)

  // Calculate overall progress
  const totalLessons = allLessons.length
  const completedLessons = allLessons.filter((l) => l.isCompleted).length
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // Update current/next/prev lesson
  useEffect(() => {
    const current = allLessons.find((l) => l.id === currentLessonId)
    setCurrentLesson(current || null)
    setNextLesson(currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null)
    setPrevLesson(currentIndex > 0 ? allLessons[currentIndex - 1] : null)
  }, [currentLessonId, allLessons, currentIndex])

  const handleNext = () => {
    if (nextLesson) {
      onLessonChange(nextLesson.id)
    }
  }

  const handlePrev = () => {
    if (prevLesson) {
      onLessonChange(prevLesson.id)
    }
  }

  const handleComplete = () => {
    if (currentLesson && !currentLesson.isCompleted && onLessonComplete) {
      onLessonComplete(currentLesson.id)
    }
  }

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-400">Aula não encontrada</p>
      </div>
    )
  }

  return (
    <div className={cn('flex h-screen bg-zinc-950 overflow-hidden', className)}>
      {/* Progress Bar (Top) */}
      <ProgressBar progress={overallProgress} />

      {/* Sidebar Navigation */}
      <SidebarNavigation
        modules={modules}
        currentLessonId={currentLessonId}
        onLessonChange={onLessonChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-1 z-30 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="font-display text-lg font-medium text-white truncate">
                {courseTitle}
              </h1>
              <p className="text-sm text-zinc-400 truncate">{currentLesson.title}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={!prevLesson}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={!nextLesson}
              className="gap-2"
            >
              <span className="hidden sm:inline">Próxima</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Lesson Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
            {/* Lesson Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4">
                {currentLesson.isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0" />
                ) : (
                  <PlayCircle className="h-6 w-6 text-primary flex-shrink-0" />
                )}
                <h2 className="font-display text-3xl font-bold text-white">
                  {currentLesson.title}
                </h2>
              </div>
              {currentLesson.description && (
                <p className="text-zinc-400 text-lg">{currentLesson.description}</p>
              )}
            </div>

            {/* Lesson Content */}
            <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
              {currentLesson.contentType === 'text' && currentLesson.content && (
                <LessonEditor
                  content={currentLesson.content}
                  editable={false}
                  className="min-h-[400px]"
                />
              )}
              {currentLesson.contentType === 'video' && currentLesson.contentUrl && (
                <div className="rounded-lg overflow-hidden bg-zinc-900 aspect-video mb-8">
                  <video
                    src={currentLesson.contentUrl}
                    controls
                    className="w-full h-full"
                  />
                </div>
              )}
              {currentLesson.contentType === 'embed' && currentLesson.contentUrl && (
                <div className="rounded-lg overflow-hidden bg-zinc-900 aspect-video mb-8">
                  <iframe
                    src={currentLesson.contentUrl}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
              {currentLesson.contentType === 'pdf' && currentLesson.contentUrl && (
                <div className="rounded-lg overflow-hidden bg-zinc-900 mb-8">
                  <iframe
                    src={currentLesson.contentUrl}
                    className="w-full h-screen min-h-[600px]"
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer Actions */}
        <footer className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={!prevLesson}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Aula Anterior
            </Button>

            {!currentLesson.isCompleted && (
              <Button
                onClick={handleComplete}
                className="bg-primary hover:bg-primary/90 text-white gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Marcar como Concluída
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={!nextLesson}
              className="gap-2"
            >
              Próxima Aula
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
