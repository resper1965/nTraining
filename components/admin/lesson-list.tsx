'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GripVertical, Edit, Trash2, Video, FileText, FileQuestion, Link as LinkIcon } from 'lucide-react'
import { EditLessonDialog } from './edit-lesson-dialog'
import { DeleteLessonDialog } from './delete-lesson-dialog'
import { reorderLessons } from '@/app/actions/lessons'
import { useRouter } from 'next/navigation'
import type { Lesson } from '@/lib/types/database'

interface LessonListProps {
  courseId: string
  moduleId: string
  lessons: Lesson[]
}

const contentTypeIcons = {
  video: Video,
  text: FileText,
  pdf: FileText,
  quiz: FileQuestion,
  embed: LinkIcon,
}

export function LessonList({ courseId, moduleId, lessons }: LessonListProps) {
  const router = useRouter()
  const [isReordering, setIsReordering] = useState(false)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'))
    
    if (dragIndex === dropIndex) return

    setIsReordering(true)
    const newLessons = [...lessons]
    const [removed] = newLessons.splice(dragIndex, 1)
    newLessons.splice(dropIndex, 0, removed)

    // Atualizar order_index no banco
    const lessonIds = newLessons.map((l) => l.id)
    try {
      await reorderLessons(moduleId, lessonIds)
      router.refresh()
    } catch (error) {
      console.error('Error reordering lessons:', error)
      alert('Erro ao reordenar aulas')
    } finally {
      setIsReordering(false)
    }
  }

  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => {
        const Icon = contentTypeIcons[lesson.content_type] || FileText
        
        return (
          <Card
            key={lesson.id}
            className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors"
            draggable={!isReordering}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1 cursor-move text-slate-600 hover:text-slate-400 transition-colors">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <Icon className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="font-display text-lg text-white">
                          {lesson.title}
                        </CardTitle>
                        {lesson.is_required && (
                          <span className="text-xs text-yellow-400 bg-yellow-950/50 px-2 py-1 rounded">
                            Obrigatória
                          </span>
                        )}
                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded capitalize">
                          {lesson.content_type}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                          Aula {index + 1}
                        </span>
                      </div>
                      {lesson.duration_minutes && (
                        <CardDescription className="text-slate-400">
                          Duração: {lesson.duration_minutes} minutos
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <EditLessonDialog lesson={lesson} moduleId={moduleId} courseId={courseId} />
                  <DeleteLessonDialog lessonId={lesson.id} moduleId={moduleId} courseId={courseId} />
                </div>
              </div>
            </CardHeader>
          </Card>
        )
      })}
      <div className="text-sm text-slate-500 text-center pt-4">
        💡 Arraste as aulas para reordená-las
      </div>
    </div>
  )
}

