import { requireSuperAdmin } from '@/lib/supabase/server'
import { createCourse } from '@/app/actions/courses'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { ClientCourseForm } from './client-form'

export const dynamic = 'force-dynamic'

export default async function NewCoursePage() {
  await requireSuperAdmin()

  async function handleCreateCourse(formData: FormData) {
    'use server'
    
    try {
      const durationHours = formData.get('duration_hours')
        ? parseFloat(formData.get('duration_hours') as string)
        : 0

      const courseData: any = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        objectives: (formData.get('objectives') as string) || '',
        level: formData.get('level') as 'beginner' | 'intermediate' | 'advanced',
        area: (formData.get('area') as string) || '',
        duration_hours: durationHours || null,
        status: formData.get('status') as 'draft' | 'published' | 'archived',
        is_public: formData.get('is_public') === 'true',
        thumbnail_url: (formData.get('thumbnail_url') as string) || null,
      }

      await createCourse(courseData)
      redirect('/admin/courses?message=Curso criado com sucesso')
    } catch (error) {
      redirect(
        `/admin/courses/new?error=${encodeURIComponent(
          error instanceof Error ? error.message : 'Erro ao criar curso'
        )}`
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-white mb-2">
              Criar Novo Curso
            </h1>
            <p className="text-slate-400">
              Preencha as informações básicas do curso
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <ClientCourseForm action={handleCreateCourse} />
    </div>
  )
}
