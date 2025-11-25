'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateLessonProgress } from '@/app/actions/progress'
import { useDebouncedCallback } from 'use-debounce'

interface TextViewerProps {
  content: string
  lessonId: string
  onComplete?: () => void
}

export function TextViewer({
  content,
  lessonId,
  onComplete,
}: TextViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  // Debounced save progress
  const debouncedSaveProgress = useDebouncedCallback(
    async (progress: number) => {
      try {
        // Calculate watched duration based on scroll progress
        const watchedSeconds = Math.floor(progress * 60) // Assume 1 minute reading time
        
        await updateLessonProgress(lessonId, {
          watched_duration_seconds: watchedSeconds,
        })

        // Mark as complete when scrolled 90%
        if (progress >= 0.9 && !isCompleted) {
          await updateLessonProgress(lessonId, {
            is_completed: true,
            watched_duration_seconds: 60,
          })
          setIsCompleted(true)
          onComplete?.()
        }
      } catch (error) {
        console.error('Error saving progress:', error)
      }
    },
    2000 // 2 seconds debounce
  )

  useEffect(() => {
    const element = contentRef.current
    if (!element) return

    const handleScroll = () => {
      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
      
      setScrollProgress(progress)
      debouncedSaveProgress(progress)
    }

    element.addEventListener('scroll', handleScroll)
    return () => element.removeEventListener('scroll', handleScroll)
  }, [debouncedSaveProgress, isCompleted])

  const handleMarkComplete = async () => {
    try {
      await updateLessonProgress(lessonId, {
        is_completed: true,
        watched_duration_seconds: 60,
      })
      setIsCompleted(true)
      onComplete?.()
    } catch (error) {
      console.error('Error marking lesson complete:', error)
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm text-green-400 font-medium">
                Concluída
              </span>
            </>
          ) : (
            <>
              <Circle className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-400">
                Em progresso
              </span>
            </>
          )}
        </div>
        <div className="flex-1 mx-4">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-slate-500 min-w-[3rem] text-right">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="prose prose-invert prose-slate max-w-none bg-slate-900 rounded-lg p-8 overflow-y-auto"
        style={{ maxHeight: '600px' }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Action Button */}
      {!isCompleted && (
        <div className="flex justify-end">
          <Button onClick={handleMarkComplete}>
            Marcar como Concluída
          </Button>
        </div>
      )}
    </div>
  )
}

