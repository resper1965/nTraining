import { requireSuperAdmin } from '@/lib/supabase/server'
import { getLearningPathById } from '@/app/actions/learning-paths'
import { getOrganizationUsers } from '@/app/actions/organizations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AssignPathForm } from '@/components/admin/assign-path-form'

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

  // Buscar usuários da organização
  let users: any[] = []
  if (path.organization_id) {
    try {
      users = await getOrganizationUsers(path.organization_id)
    } catch (error) {
      console.error('Error fetching organization users:', error)
      users = []
    }
  }

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
            <AssignPathForm pathId={params.id} users={users} />
            <div className="mt-4">
              <Link href={`/admin/paths/${params.id}`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
