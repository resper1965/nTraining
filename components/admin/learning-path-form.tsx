'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Course } from '@/lib/types/database'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { toast } from 'sonner'

interface LearningPathFormProps {
  courses: Course[]
  initialData?: {
    title?: string
    slug?: string
    description?: string
    estimated_duration_hours?: number | null
    is_mandatory?: boolean
    course_ids?: string[]
  }
}

interface SortableCourseItemProps {
  course: Course
  onRemove: () => void
}

function SortableCourseItem({ course, onRemove }: SortableCourseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-slate-400" />
      </div>
      <div className="flex-1">
        <p className="text-white font-medium">{course.title}</p>
        <p className="text-sm text-slate-400">
          {course.duration_hours}h • {course.level}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function LearningPathForm({ courses, initialData }: LearningPathFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(
    initialData?.course_ids || []
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSelectedCourseIds((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const toggleCourse = (courseId: string) => {
    let newSelected: string[]
    if (selectedCourseIds.includes(courseId)) {
      newSelected = selectedCourseIds.filter((id) => id !== courseId)
    } else {
      newSelected = [...selectedCourseIds, courseId]
    }
    setSelectedCourseIds(newSelected)
    
    // Atualizar hidden inputs
    const form = document.querySelector('form')
    if (form) {
      const hiddenInputs = form.querySelectorAll('input[name="course_ids"]')
      hiddenInputs.forEach((input) => input.remove())
      
      newSelected.forEach((id) => {
        const hiddenInput = document.createElement('input')
        hiddenInput.type = 'hidden'
        hiddenInput.name = 'course_ids'
        hiddenInput.value = id
        form.appendChild(hiddenInput)
      })
    }
  }

  const removeCourse = (courseId: string) => {
    const newSelected = selectedCourseIds.filter((id) => id !== courseId)
    setSelectedCourseIds(newSelected)
    
    // Atualizar hidden inputs
    const form = document.querySelector('form')
    if (form) {
      const hiddenInputs = form.querySelectorAll('input[name="course_ids"]')
      hiddenInputs.forEach((input) => input.remove())
      
      newSelected.forEach((id) => {
        const hiddenInput = document.createElement('input')
        hiddenInput.type = 'hidden'
        hiddenInput.name = 'course_ids'
        hiddenInput.value = id
        form.appendChild(hiddenInput)
      })
    }
  }

  const selectedCourses = courses.filter((c) => selectedCourseIds.includes(c.id))
  const availableCourses = courses.filter((c) => !selectedCourseIds.includes(c.id))

  return (
    <div className="space-y-6">
      {/* Hidden inputs para course_ids */}
      {selectedCourseIds.map((courseId) => (
        <input key={courseId} type="hidden" name="course_ids" value={courseId} />
      ))}
      {/* Basic Info */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-xl text-white">
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Configure o título, slug e descrição da trilha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={initialData?.slug}
              required
              pattern="[a-z0-9-]+"
              className="bg-slate-800 border-slate-700 text-white"
            />
            <p className="text-xs text-slate-400">
              Apenas letras minúsculas, números e hífens
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description}
              rows={4}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_duration_hours">
              Duração Estimada (horas)
            </Label>
            <Input
              id="estimated_duration_hours"
              name="estimated_duration_hours"
              type="number"
              step="0.5"
              min="0"
              defaultValue={initialData?.estimated_duration_hours || ''}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_mandatory">Trilha Obrigatória</Label>
              <p className="text-sm text-slate-400">
                Marque se esta trilha é obrigatória para os usuários
              </p>
            </div>
            <Switch
              id="is_mandatory"
              name="is_mandatory"
              defaultChecked={initialData?.is_mandatory}
            />
            <input
              type="hidden"
              name="is_mandatory"
              value={initialData?.is_mandatory ? 'on' : 'off'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Courses */}
      {selectedCourseIds.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              Cursos na Trilha ({selectedCourseIds.length})
            </CardTitle>
            <CardDescription>
              Reordene os cursos arrastando e soltando
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedCourseIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {selectedCourses.map((course) => (
                    <SortableCourseItem
                      key={course.id}
                      course={course}
                      onRemove={() => removeCourse(course.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      )}

      {/* Available Courses */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-xl text-white">
            Adicionar Cursos
          </CardTitle>
          <CardDescription>
            Selecione os cursos que farão parte desta trilha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableCourses.length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              Todos os cursos já foram adicionados
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Checkbox
                    id={`course-${course.id}`}
                    checked={selectedCourseIds.includes(course.id)}
                    onCheckedChange={() => toggleCourse(course.id)}
                  />
                  <label
                    htmlFor={`course-${course.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="text-white font-medium">{course.title}</p>
                    <p className="text-sm text-slate-400">
                      {course.duration_hours}h • {course.level}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Trilha'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
}

