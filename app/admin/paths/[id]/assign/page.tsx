import { requireSuperAdmin } from '@/lib/supabase/server'
import { getLearningPathById } from '@/app/actions/learning-paths'
import { getOrganizationUsers } from '@/app/actions/organizations'
import { assignPathToUsers } from '@/app/actions/path-assignments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AssignPathPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { success?: string; error?: string }
}) {
  await requireSuperAdmin()

  const path = await getLearningPathById(params.id).catch(() => null)
  if (!path) {
    redirect('/admin/paths')
  }

  const users = await getOrganizationUsers(path.organization_id || '').catch(() => [])

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/admin/paths/${params.id}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Atribuir Trilha: {path.title}
          </h1>
          <p className="text-slate-400">
            Selecione os usuários que receberão esta trilha
          </p>
        </div>

        {/* Messages */}
        {searchParams.success && (
          <Card className="bg-green-500/10 border-green-500/50 mb-6">
            <CardContent className="pt-6">
              <p className="text-green-400">{searchParams.success}</p>
            </CardContent>
          </Card>
        )}
        {searchParams.error && (
          <Card className="bg-red-500/10 border-red-500/50 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-400">{searchParams.error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Selecionar Usuários
            </CardTitle>
            <CardDescription>
              {users.length} usuário(s) disponível(is)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (formData: FormData) => {
              'use server'
              const selectedUserIds = formData.getAll('user_ids') as string[]
              const isMandatory = formData.get('is_mandatory') === 'on'
              const autoEnroll = formData.get('auto_enroll') === 'on'
              const deadlineStr = formData.get('deadline') as string
              const deadline = deadlineStr ? new Date(deadlineStr) : undefined

              if (selectedUserIds.length === 0) {
                redirect(`/admin/paths/${params.id}/assign?error=Nenhum usuário selecionado`)
              }

              try {
                const result = await assignPathToUsers(selectedUserIds, params.id, {
                  isMandatory,
                  autoEnrollFirstCourse: autoEnroll,
                  deadline,
                })

                redirect(
                  `/admin/paths/${params.id}/assign?success=${result.successful} usuário(s) atribuído(s) com sucesso`
                )
              } catch (error: any) {
                redirect(`/admin/paths/${params.id}/assign?error=${error.message}`)
              }
            }}>
              {/* Options */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Switch id="is_mandatory" name="is_mandatory" />
                  <Label htmlFor="is_mandatory" className="text-white">
                    Trilha obrigatória
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto_enroll" name="auto_enroll" defaultChecked />
                  <Label htmlFor="auto_enroll" className="text-white">
                    Auto-inscrever no primeiro curso
                  </Label>
                </div>
                <div>
                  <Label htmlFor="deadline" className="text-white mb-2 block">
                    Prazo (opcional)
                  </Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              </div>

              {/* User List */}
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">
                    Nenhum usuário disponível
                  </p>
                ) : (
                  users.map((user: any) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                    >
                      <Checkbox
                        id={`user-${user.id}`}
                        name="user_ids"
                        value={user.id}
                      />
                      <Label
                        htmlFor={`user-${user.id}`}
                        className="flex-1 text-white cursor-pointer"
                      >
                        <div className="font-medium">{user.full_name || user.email}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </Label>
                    </div>
                  ))
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="submit" disabled={users.length === 0}>
                  Atribuir Trilha
                </Button>
                <Link href={`/admin/paths/${params.id}`}>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

