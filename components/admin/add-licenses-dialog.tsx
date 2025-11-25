'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { addLicenses } from '@/app/actions/license-management'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface AddLicensesDialogProps {
  organizationId: string
  courseId: string
  currentTotal: number
  trigger?: React.ReactNode
}

export function AddLicensesDialog({
  organizationId,
  courseId,
  currentTotal,
  trigger,
}: AddLicensesDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [additionalLicenses, setAdditionalLicenses] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addLicenses(organizationId, courseId, parseInt(additionalLicenses))
      toast.success(`${additionalLicenses} licença(s) adicionada(s) com sucesso!`)
      setOpen(false)
      setAdditionalLicenses('')
      router.refresh()
    } catch (error: any) {
      console.error('Error adding licenses:', error)
      toast.error(error.message || 'Erro ao adicionar licenças. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Licenças
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white">
            Adicionar Licenças
          </DialogTitle>
          <DialogDescription>
            Licenças atuais: {currentTotal}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="additional_licenses">Quantidade de Licenças *</Label>
            <Input
              id="additional_licenses"
              type="number"
              min="1"
              value={additionalLicenses}
              onChange={(e) => setAdditionalLicenses(e.target.value)}
              placeholder="Ex: 10"
              required
            />
            <p className="text-xs text-slate-400">
              Total após adição: {currentTotal + (parseInt(additionalLicenses) || 0)}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Adicionando...' : 'Adicionar Licenças'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

