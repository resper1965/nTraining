'use client'

import { useState, useCallback, memo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GripVertical, Edit, Trash2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { EditModuleDialog } from './edit-module-dialog'
import { DeleteModuleDialog } from './delete-module-dialog'
import { reorderModules } from '@/app/actions/modules'
import { useRouter } from 'next/navigation'
import type { Module } from '@/lib/types/database'

interface ModuleListProps {
  courseId: string
  modules: Module[]
}

function ModuleListComponent({ courseId, modules }: ModuleListProps) {
  const router = useRouter()
  const [isReordering, setIsReordering] = useState(false)

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', index.toString())
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'))
    
    if (dragIndex === dropIndex) return

    setIsReordering(true)
    const newModules = [...modules]
    const [removed] = newModules.splice(dragIndex, 1)
    newModules.splice(dropIndex, 0, removed)

    // Atualizar order_index no banco
    const moduleIds = newModules.map((m) => m.id)
    try {
      await reorderModules(courseId, moduleIds)
      router.refresh()
    } catch (error) {
      console.error('Error reordering modules:', error)
      alert('Erro ao reordenar módulos')
    } finally {
      setIsReordering(false)
    }
  }, [modules, courseId, router])

  return (
    <div className="space-y-3">
      {modules.map((module, index) => (
        <Card
          key={module.id}
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
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="font-display text-lg text-white">
                      {module.title}
                    </CardTitle>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                      Módulo {index + 1}
                    </span>
                  </div>
                  {module.description && (
                    <CardDescription className="text-slate-400">
                      {module.description}
                    </CardDescription>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/courses/${courseId}/modules/${module.id}/lessons`}>
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Aulas
                  </Button>
                </Link>
                <EditModuleDialog module={module} courseId={courseId} />
                <DeleteModuleDialog moduleId={module.id} courseId={courseId} />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
      <div className="text-sm text-slate-500 text-center pt-4">
        💡 Arraste os módulos para reordená-los
      </div>
    </div>
  )
}

// Memoizar componente para evitar re-renders desnecessários
export const ModuleList = memo(ModuleListComponent, (prevProps, nextProps) => {
  return (
    prevProps.courseId === nextProps.courseId &&
    prevProps.modules.length === nextProps.modules.length &&
    prevProps.modules.every((module, index) => 
      module.id === nextProps.modules[index]?.id &&
      module.order_index === nextProps.modules[index]?.order_index
    )
  )
})
ModuleList.displayName = 'ModuleList'
