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
import { Plus, Loader2 } from 'lucide-react'
import { createModule } from '@/app/actions/modules'
import { useRouter } from 'next/navigation'

interface CreateModuleDialogProps {
  courseId: string
}

export function CreateModuleDialog({ courseId }: CreateModuleDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const moduleData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || '',
      order_index: 0, // Será calculado no server
    }

    try {
      await createModule(courseId, moduleData)
      setOpen(false)
      router.refresh()
      router.push(`/admin/courses/${courseId}/modules?message=Módulo criado com sucesso`)
    } catch (error) {
      console.error('Error creating module:', error)
      alert(error instanceof Error ? error.message : 'Erro ao criar módulo')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Módulo
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white">
            Criar Novo Módulo
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Adicione um novo módulo ao curso
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Título do Módulo *
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
            <Label htmlFor="description" className="text-slate-300">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Descreva o conteúdo deste módulo..."
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary resize-none"
            />
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
                  Criar Módulo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

