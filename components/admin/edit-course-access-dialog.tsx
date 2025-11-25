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
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateOrganizationCourseAccess } from '@/app/actions/organization-courses-update'
import { toast } from 'sonner'
import { Settings } from 'lucide-react'

interface EditCourseAccessDialogProps {
  organizationId: string
  organizationCourseAccess: any
}

export function EditCourseAccessDialog({
  organizationId,
  organizationCourseAccess,
}: EditCourseAccessDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    access_type: organizationCourseAccess.access_type || 'licensed',
    total_licenses: organizationCourseAccess.total_licenses?.toString() || '',
    is_mandatory: organizationCourseAccess.is_mandatory || false,
    auto_enroll: organizationCourseAccess.auto_enroll || false,
    allow_certificate: organizationCourseAccess.allow_certificate ?? true,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { updateOrganizationCourseAccess } = await import('@/app/actions/organization-courses')
      await updateOrganizationCourseAccess(
        organizationCourseAccess.id,
        {
          accessType: formData.access_type as any,
          totalLicenses: formData.access_type === 'licensed' ? parseInt(formData.total_licenses) : null,
          isMandatory: formData.is_mandatory,
          autoEnroll: formData.auto_enroll,
          allowCertificate: formData.allow_certificate,
        }
      )

      toast.success('Configurações atualizadas com sucesso!')
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      console.error('Error updating course access:', error)
      toast.error(error.message || 'Erro ao atualizar configurações. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white">
            Editar Configurações do Curso
          </DialogTitle>
          <DialogDescription>
            {organizationCourseAccess.courses?.title || 'Curso'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Access Type */}
          <div className="space-y-2">
            <Label htmlFor="access_type">Tipo de Acesso *</Label>
            <Select
              value={formData.access_type}
              onValueChange={(value: any) => setFormData({ ...formData, access_type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="licensed">Licenciado (com limite)</SelectItem>
                <SelectItem value="unlimited">Ilimitado</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total Licenses (only for licensed) */}
          {formData.access_type === 'licensed' && (
            <div className="space-y-2">
              <Label htmlFor="total_licenses">Total de Licenças *</Label>
              <Input
                id="total_licenses"
                type="number"
                min="1"
                value={formData.total_licenses}
                onChange={(e) => setFormData({ ...formData, total_licenses: e.target.value })}
                placeholder="Ex: 50"
                required
              />
            </div>
          )}

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="is_mandatory">Curso Obrigatório</Label>
                <p className="text-sm text-slate-400">
                  Todos os usuários devem completar este curso
                </p>
              </div>
              <Switch
                id="is_mandatory"
                checked={formData.is_mandatory}
                onCheckedChange={(checked) => setFormData({ ...formData, is_mandatory: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="auto_enroll">Matrícula Automática</Label>
                <p className="text-sm text-slate-400">
                  Usuários são automaticamente matriculados neste curso
                </p>
              </div>
              <Switch
                id="auto_enroll"
                checked={formData.auto_enroll}
                onCheckedChange={(checked) => setFormData({ ...formData, auto_enroll: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="allow_certificate">Permitir Certificado</Label>
                <p className="text-sm text-slate-400">
                  Usuários podem receber certificado ao completar o curso
                </p>
              </div>
              <Switch
                id="allow_certificate"
                checked={formData.allow_certificate}
                onCheckedChange={(checked) => setFormData({ ...formData, allow_certificate: checked })}
              />
            </div>
          </div>

          {/* Actions */}
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
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

