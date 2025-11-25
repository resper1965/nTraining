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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, Edit, Trash2, CheckCircle2, XCircle, Users, Calendar } from 'lucide-react'
import { updateOrganizationCourseAccess, removeCourseFromOrganization } from '@/app/actions/organization-courses'
import { toast } from 'sonner'
import { EditCourseAccessDialog } from './edit-course-access-dialog'
import { AddLicensesDialog } from './add-licenses-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface CourseAccessCardProps {
  organizationId: string
  organizationCourseAccess: any
}

export function CourseAccessCard({
  organizationId,
  organizationCourseAccess,
}: CourseAccessCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const course = organizationCourseAccess.courses
  const accessTypeLabels: Record<string, string> = {
    licensed: 'Licenciado',
    unlimited: 'Ilimitado',
    trial: 'Trial',
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await removeCourseFromOrganization(organizationId, organizationCourseAccess.course_id)
      toast.success('Curso removido da organização')
      router.refresh()
    } catch (error: any) {
      console.error('Error removing course:', error)
      toast.error(error.message || 'Erro ao remover curso')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-display text-lg text-white mb-2">
              {course?.title || 'Curso não encontrado'}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={organizationCourseAccess.access_type === 'unlimited' ? 'default' : 'secondary'}>
                {accessTypeLabels[organizationCourseAccess.access_type] || organizationCourseAccess.access_type}
              </Badge>
              {organizationCourseAccess.is_mandatory && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                  Obrigatório
                </Badge>
              )}
              {organizationCourseAccess.auto_enroll && (
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Auto-matrícula
                </Badge>
              )}
              {organizationCourseAccess.allow_certificate && (
                <Badge variant="outline" className="border-blue-500 text-blue-500">
                  Com Certificado
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EditCourseAccessDialog
              organizationId={organizationId}
              organizationCourseAccess={organizationCourseAccess}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover Curso?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação removerá o acesso deste curso da organização. Os usuários que já estão matriculados não serão afetados, mas novos usuários não poderão mais acessar este curso.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Removendo...' : 'Remover'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {organizationCourseAccess.access_type === 'licensed' && (
            <div>
              <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Licenças
              </div>
              <div className="text-lg font-medium text-white mb-2">
                {organizationCourseAccess.used_licenses || 0} / {organizationCourseAccess.total_licenses || 0}
              </div>
              <AddLicensesDialog
                organizationId={organizationId}
                courseId={organizationCourseAccess.course_id}
                currentTotal={organizationCourseAccess.total_licenses || 0}
              />
            </div>
          )}
          {organizationCourseAccess.valid_from && (
            <div>
              <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Válido de
              </div>
              <div className="text-sm text-white">
                {new Date(organizationCourseAccess.valid_from).toLocaleDateString('pt-BR')}
              </div>
            </div>
          )}
          {organizationCourseAccess.valid_until && (
            <div>
              <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Válido até
              </div>
              <div className="text-sm text-white">
                {new Date(organizationCourseAccess.valid_until).toLocaleDateString('pt-BR')}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

