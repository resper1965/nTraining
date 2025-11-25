'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit, Loader2 } from 'lucide-react'
import { updateLesson } from '@/app/actions/lessons'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import type { Lesson } from '@/lib/types/database'

interface EditLessonDialogProps {
  lesson: Lesson
  moduleId: string
  courseId: string
}

export function EditLessonDialog({ lesson, moduleId, courseId }: EditLessonDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contentType, setContentType] = useState<Lesson['content_type']>(lesson.content_type)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const lessonData = {
      title: formData.get('title') as string,
      content_type: contentType,
      content_url: (formData.get('content_url') as string) || undefined,
      content_text: (formData.get('content_text') as string) || undefined,
      duration_minutes: formData.get('duration_minutes')
        ? parseInt(formData.get('duration_minutes') as string)
        : undefined,
      is_required: formData.get('is_required') === 'true',
    }

    try {
      await updateLesson(lesson.id, lessonData)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating lesson:', error)
      alert(error instanceof Error ? error.message : 'Erro ao atualizar aula')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white">
            Editar Aula
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Atualize as informações da aula
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Título da Aula *
            </Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={lesson.title}
              placeholder="Ex: Introdução à LGPD"
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content_type" className="text-slate-300">
              Tipo de Conteúdo *
            </Label>
            <Select
              value={contentType}
              onValueChange={(value: any) => setContentType(value)}
              required
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Vídeo</SelectItem>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="embed">Embed (YouTube, etc.)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {contentType === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="content_url" className="text-slate-300">
                URL do Vídeo
              </Label>
              <Input
                id="content_url"
                name="content_url"
                type="url"
                defaultValue={lesson.content_url || ''}
                placeholder="https://..."
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
              />
            </div>
          )}

          {contentType === 'text' && (
            <div className="space-y-2">
              <Label htmlFor="content_text" className="text-slate-300">
                Conteúdo em Texto
              </Label>
              <Textarea
                id="content_text"
                name="content_text"
                rows={8}
                defaultValue={lesson.content_text || ''}
                placeholder="Conteúdo da aula em texto..."
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary resize-none"
              />
            </div>
          )}

          {contentType === 'pdf' && (
            <div className="space-y-2">
              <Label htmlFor="content_url" className="text-slate-300">
                URL do PDF
              </Label>
              <Input
                id="content_url"
                name="content_url"
                type="url"
                defaultValue={lesson.content_url || ''}
                placeholder="https://..."
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
              />
            </div>
          )}

          {contentType === 'embed' && (
            <div className="space-y-2">
              <Label htmlFor="content_url" className="text-slate-300">
                URL do Embed
              </Label>
              <Input
                id="content_url"
                name="content_url"
                type="url"
                defaultValue={lesson.content_url || ''}
                placeholder="https://www.youtube.com/embed/..."
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_minutes" className="text-slate-300">
                Duração (minutos)
              </Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                min="0"
                defaultValue={lesson.duration_minutes || ''}
                placeholder="Ex: 15"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_required" className="text-slate-300">
                Aula Obrigatória
              </Label>
              <div className="flex items-center gap-2 pt-2">
                <Switch
                  id="is_required"
                  name="is_required"
                  defaultChecked={lesson.is_required}
                />
                <Label htmlFor="is_required" className="text-slate-400 cursor-pointer">
                  {lesson.is_required ? 'Sim' : 'Não'}
                </Label>
              </div>
              <input
                type="hidden"
                name="is_required"
                value={lesson.is_required ? 'true' : 'false'}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

