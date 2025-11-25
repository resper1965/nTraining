'use client'

import { useState } from 'react'
import { VideoPlayer } from './lesson-player/video-player'
import { PDFViewer } from './lesson-player/pdf-viewer'
import { TextViewer } from './lesson-player/text-viewer'
import type { Lesson, UserLessonProgress } from '@/lib/types/database'

interface LessonPlayerProps {
  lesson: Lesson
  progress: UserLessonProgress | null
}

export function LessonPlayer({ lesson, progress }: LessonPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(progress?.is_completed || false)

  const handleComplete = () => {
    setIsCompleted(true)
  }

  const renderContent = () => {
    switch (lesson.content_type) {
      case 'video':
        if (!lesson.content_url) {
          return (
            <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg text-slate-500">
              URL do vídeo não disponível
            </div>
          )
        }
        return (
          <VideoPlayer
            src={lesson.content_url}
            lessonId={lesson.id}
            durationMinutes={lesson.duration_minutes || undefined}
            initialProgress={progress?.last_position_seconds || 0}
            onComplete={handleComplete}
          />
        )

      case 'text':
        if (!lesson.content_text) {
          return (
            <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg text-slate-500">
              Conteúdo não disponível
            </div>
          )
        }
        return (
          <TextViewer
            content={lesson.content_text}
            lessonId={lesson.id}
            onComplete={handleComplete}
          />
        )

      case 'pdf':
        if (!lesson.content_url) {
          return (
            <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg text-slate-500">
              URL do PDF não disponível
            </div>
          )
        }
        return (
          <PDFViewer
            src={lesson.content_url}
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            onComplete={handleComplete}
          />
        )

      case 'embed':
        if (!lesson.content_url) {
          return (
            <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg text-slate-500">
              URL do embed não disponível
            </div>
          )
        }
        return (
          <div className="relative w-full aspect-video bg-slate-800 rounded-lg overflow-hidden">
            <iframe
              src={lesson.content_url}
              className="w-full h-full"
              allowFullScreen
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )

      case 'quiz':
        return (
          <div className="text-center py-12 bg-slate-900 rounded-lg border border-slate-800">
            <p className="text-slate-400 mb-4">Funcionalidade de Quiz em breve</p>
            <p className="text-slate-500 text-sm">
              Esta aula contém um quiz que estará disponível em uma atualização futura
            </p>
          </div>
        )

      default:
        return (
          <div className="text-center py-12 bg-slate-900 rounded-lg border border-slate-800 text-slate-500">
            Tipo de conteúdo desconhecido
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {renderContent()}

      {isCompleted && (
        <div className="flex items-center justify-center p-4 bg-green-950/50 border border-green-800 rounded-lg">
          <span className="text-green-400 font-medium">
            ✓ Aula concluída
          </span>
        </div>
      )}
    </div>
  )
}

