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
import { Plus, Loader2 } from 'lucide-react'
import { createLesson } from '@/app/actions/lessons'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { FileUpload } from '@/components/admin/file-upload'

interface CreateLessonDialogProps {
  moduleId: string
  courseId: string
}

export function CreateLessonDialog({ moduleId, courseId }: CreateLessonDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contentType, setContentType] = useState<'video' | 'text' | 'pdf' | 'quiz' | 'embed'>('video')
  const [fileUrl, setFileUrl] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const lessonData = {
      title: formData.get('title') as string,
      content_type: contentType,
      content_url: fileUrl || (formData.get('content_url_external') as string) || undefined,
      content_text: (formData.get('content_text') as string) || undefined,
      duration_minutes: formData.get('duration_minutes')
        ? parseInt(formData.get('duration_minutes') as string)
        : undefined,
      is_required: formData.get('is_required') === 'true',
      order_index: 0, // Será calculado no server
    }

    try {
      await createLesson(moduleId, lessonData)
      setOpen(false)
      router.refresh()
      router.push(`/admin/courses/${courseId}/modules/${moduleId}/lessons?message=Aula criada com sucesso`)
    } catch (error) {
      console.error('Error creating lesson:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar aula')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Aula
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white">
            Criar Nova Aula
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Adicione uma nova aula ao módulo
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
              <FileUpload
                label="Vídeo da Aula"
                currentFileUrl={fileUrl}
                onFileUploaded={(url) => {
                  setFileUrl(url)
                }}
                bucket="lesson-materials"
                folder={`course-${courseId}/module-${moduleId}`}
                maxSizeMB={500}
                fileType="video"
              />
              <input type="hidden" name="content_url" value={fileUrl} />
              <div className="text-xs text-slate-500 mt-2">
                Ou forneça uma URL externa:
              </div>
              <Input
                id="content_url_external"
                name="content_url_external"
                type="url"
                placeholder="https://..."
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
                onChange={(e) => {
                  if (e.target.value) {
                    setFileUrl(e.target.value)
                  }
                }}
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
                placeholder="Conteúdo da aula em texto..."
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary resize-none"
              />
            </div>
          )}

          {contentType === 'pdf' && (
            <div className="space-y-2">
              <FileUpload
                label="PDF da Aula"
                currentFileUrl={fileUrl}
                onFileUploaded={(url) => {
                  setFileUrl(url)
                }}
                bucket="lesson-materials"
                folder={`course-${courseId}/module-${moduleId}`}
                maxSizeMB={50}
                fileType="pdf"
              />
              <input type="hidden" name="content_url" value={fileUrl} />
              <div className="text-xs text-slate-500 mt-2">
                Ou forneça uma URL externa:
              </div>
              <Input
                id="content_url_external"
                name="content_url_external"
                type="url"
                placeholder="https://..."
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
                onChange={(e) => {
                  if (e.target.value) {
                    setFileUrl(e.target.value)
                  }
                }}
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
                placeholder="https://www.youtube.com/embed/..."
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary"
              />
              <p className="text-xs text-slate-500">
                URL de embed (YouTube, Vimeo, etc.)
              </p>
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
                  defaultChecked={true}
                />
                <Label htmlFor="is_required" className="text-slate-400 cursor-pointer">
                  {true ? 'Sim' : 'Não'}
                </Label>
              </div>
              <input type="hidden" name="is_required" value="true" />
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
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Aula
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

