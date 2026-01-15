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
// assignCourseToOrganization will be imported dynamically
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface AssignCourseDialogProps {
  organizationId: string
  availableCourses: Array<{ id: string; title: string }>
  trigger?: React.ReactNode
}

export function AssignCourseDialog({
  organizationId,
  availableCourses,
  trigger,
}: AssignCourseDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    course_id: '',
    access_type: 'licensed' as 'licensed' | 'unlimited' | 'trial',
    total_licenses: '',
    is_mandatory: false,
    auto_enroll: false,
    allow_certificate: true,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { assignCourseToOrganization } = await import('@/app/actions/organization-courses')
      await assignCourseToOrganization(
        organizationId,
        formData.course_id,
        {
          accessType: formData.access_type,
          totalLicenses: formData.access_type === 'licensed' ? parseInt(formData.total_licenses) : null,
          isMandatory: formData.is_mandatory,
          autoEnroll: formData.auto_enroll,
          allowCertificate: formData.allow_certificate,
        }
      )

      toast.success('Curso atribuído com sucesso!')
      setOpen(false)
      setFormData({
        course_id: '',
        access_type: 'licensed',
        total_licenses: '',
        is_mandatory: false,
        auto_enroll: false,
        allow_certificate: true,
      })
      router.refresh()
    } catch (error: any) {
      console.error('Error assigning course:', error)
      toast.error(error.message || 'Erro ao atribuir curso. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Atribuir Curso
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-white">
            Atribuir Curso à Organização
          </DialogTitle>
          <DialogDescription>
            Configure o acesso e as licenças para este curso
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Selection */}
          <div className="space-y-2">
            <Label htmlFor="course_id">Curso *</Label>
            <Select
              value={formData.course_id}
              onValueChange={(value) => setFormData({ ...formData, course_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses
                  .filter((course) => {
                    return !!(
                      course &&
                      course.id &&
                      typeof course.id === 'string' &&
                      course.id.trim().length > 0
                    )
                  })
                  .map((course) => {
                    const courseId = course.id.trim()
                    if (!courseId || courseId.length === 0) {
                      return null
                    }
                    return (
                      <SelectItem key={courseId} value={courseId}>
                        {course.title || 'Sem título'}
                      </SelectItem>
                    )
                  })
                  .filter((item): item is JSX.Element => item !== null)}
              </SelectContent>
            </Select>
          </div>

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
              {isSubmitting ? 'Atribuindo...' : 'Atribuir Curso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

