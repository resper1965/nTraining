'use client'

import { useEffect, useState } from 'react'
import { updateLessonProgressClient } from '@/app/actions/lesson-client'
import type { Lesson, UserLessonProgress } from '@/lib/types/database'

interface LessonPlayerProps {
  lesson: Lesson
  progress: UserLessonProgress | null
}

export function LessonPlayer({ lesson, progress }: LessonPlayerProps) {
  const [currentTime, setCurrentTime] = useState(progress?.last_position_seconds || 0)
  const [isCompleted, setIsCompleted] = useState(progress?.is_completed || false)

  useEffect(() => {
    // Auto-save progress every 10 seconds
    const interval = setInterval(() => {
      if (currentTime > 0 && !isCompleted) {
        updateLessonProgressClient(lesson.id, {
          last_position_seconds: currentTime,
          watched_duration_seconds: currentTime,
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [currentTime, lesson.id, isCompleted])

  const handleComplete = async () => {
    await updateLessonProgressClient(lesson.id, {
      is_completed: true,
      last_position_seconds: currentTime,
      watched_duration_seconds: currentTime,
    })
    setIsCompleted(true)
  }

  const renderContent = () => {
    switch (lesson.content_type) {
      case 'video':
        return (
          <div className="relative w-full aspect-video bg-slate-800 rounded-lg overflow-hidden">
            {lesson.content_url ? (
              <video
                controls
                src={lesson.content_url}
                className="w-full h-full"
                onTimeUpdate={(e) => {
                  const video = e.currentTarget
                  setCurrentTime(Math.floor(video.currentTime))
                }}
                onEnded={handleComplete}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Video URL not available
              </div>
            )}
          </div>
        )

      case 'text':
        return (
          <div className="prose prose-invert max-w-none">
            <div className="text-slate-300 whitespace-pre-line">
              {lesson.content_text || 'No content available'}
            </div>
          </div>
        )

      case 'pdf':
        return (
          <div className="w-full h-[600px]">
            {lesson.content_url ? (
              <iframe
                src={lesson.content_url}
                className="w-full h-full rounded-lg"
                title={lesson.title}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                PDF URL not available
              </div>
            )}
          </div>
        )

      case 'embed':
        return (
          <div className="relative w-full aspect-video bg-slate-800 rounded-lg overflow-hidden">
            {lesson.content_url ? (
              <iframe
                src={lesson.content_url}
                className="w-full h-full"
                allowFullScreen
                title={lesson.title}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Embed URL not available
              </div>
            )}
          </div>
        )

      case 'quiz':
        return (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">Quiz functionality coming soon</p>
            <p className="text-slate-500 text-sm">
              This lesson contains a quiz that will be available in a future update
            </p>
          </div>
        )

      default:
        return (
          <div className="text-center py-12 text-slate-500">
            Unknown content type
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {renderContent()}

      {lesson.content_type !== 'quiz' && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-sm text-slate-400">
            {lesson.duration_minutes && (
              <span>
                Duration: {lesson.duration_minutes} minutes
              </span>
            )}
          </div>
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Mark as Complete
            </button>
          )}
          {isCompleted && (
            <span className="px-4 py-2 bg-green-950/50 text-green-400 rounded-md text-sm font-medium">
              ✓ Completed
            </span>
          )}
        </div>
      )}
    </div>
  )
}

