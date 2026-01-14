import { createClient } from '@/lib/supabase/server'
import { requireSuperAdmin } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyStateInline } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Users, CheckCircle, XCircle } from 'lucide-react'
import { approveUser, rejectUser } from '@/app/actions/users'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { User } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

async function approveUserAction(userId: string) {
  'use server'
  try {
    await approveUser(userId)
    revalidatePath('/admin/users/pending')
    redirect('/admin/users/pending?success=approved')
  } catch (error) {
    redirect(`/admin/users/pending?error=${encodeURIComponent(error instanceof Error ? error.message : 'Erro ao aprovar usuário')}`)
  }
}

async function rejectUserAction(userId: string) {
  'use server'
  try {
    await rejectUser(userId)
    revalidatePath('/admin/users/pending')
    redirect('/admin/users/pending?success=rejected')
  } catch (error) {
    redirect(`/admin/users/pending?error=${encodeURIComponent(error instanceof Error ? error.message : 'Erro ao rejeitar usuário')}`)
  }
}

export default async function PendingUsersPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string }
}) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data: pendingUsers, error } = await supabase
    .from('users')
    .select('id, full_name, email, role, created_at, organization_id')
    .eq('is_active', false)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-400">Error loading pending users: {error.message}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Usuários Pendentes
          </h1>
          <p className="text-slate-400">
            Aprove ou rejeite solicitações de acesso à plataforma
          </p>
        </div>

        {/* Messages */}
        {searchParams.success && (
          <div className="mb-4 p-3 bg-green-950/50 border border-green-800 rounded-md text-sm text-green-300">
            {searchParams.success === 'approved' && 'Usuário aprovado com sucesso!'}
            {searchParams.success === 'rejected' && 'Usuário rejeitado com sucesso!'}
          </div>
        )}
        {searchParams.error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800 rounded-md text-sm text-red-300">
            {searchParams.error}
          </div>
        )}

        {/* Pending Users */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              Solicitações Pendentes ({pendingUsers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingUsers && pendingUsers.length === 0 ? (
              <EmptyStateInline
                icon={Users}
                title="Nenhum usuário pendente"
                description="Não há solicitações de acesso aguardando aprovação"
              />
            ) : (
              <div className="space-y-4">
                {pendingUsers?.map((user: User) => (
                  <div
                    key={user.id}
                    className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">
                          {user.full_name || 'Sem nome'}
                        </h3>
                        <p className="text-sm text-slate-400 mb-2">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="capitalize">{user.role}</span>
                          <span>•</span>
                          <span>
                            Solicitado em{' '}
                            {new Date(user.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <form action={approveUserAction.bind(null, user.id)}>
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-green-950/50 hover:bg-green-900/50 text-green-400 border border-green-800"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aprovar
                          </Button>
                        </form>
                        <form action={rejectUserAction.bind(null, user.id)}>
                          <Button
                            type="submit"
                            size="sm"
                            variant="outline"
                            className="bg-red-950/50 hover:bg-red-900/50 text-red-400 border border-red-800"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejeitar
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
