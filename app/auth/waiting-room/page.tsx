import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

// Usar revalidate em vez de force-dynamic para evitar loops
export const revalidate = 0

export default async function WaitingRoomPage() {
  // Verificar autenticação básica sem requireAuth (evita loops)
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se não autenticado, redirecionar para login
  if (!user) {
    redirect('/auth/login')
  }

  // Buscar status do usuário
  const { data: userData, error } = await supabase
    .from('users')
    .select('is_active, full_name, email, created_at')
    .eq('id', user.id)
    .single()

  if (error || !userData) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <Card className="bg-slate-900 border-slate-800 max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-red-400 text-center">Erro ao carregar dados do usuário</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  // Se usuário já foi aprovado, redirecionar para dashboard
  if (userData.is_active) {
    // Verificar se é superadmin para redirecionar corretamente
    const { getCurrentUser } = await import('@/lib/supabase/server')
    const currentUser = await getCurrentUser()
    if (currentUser?.is_superadmin === true) {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            n<span className="text-[#00ade8]">.</span>training
          </h1>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-950/50 border border-yellow-800 flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
            <CardTitle className="font-display text-2xl text-white">
              Aguardando Aprovação
            </CardTitle>
            <CardDescription className="text-slate-400">
              Sua conta está aguardando aprovação do administrador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-slate-300">
                Olá, <strong className="text-white">{userData.full_name || userData.email}</strong>!
              </p>
              <p className="text-sm text-slate-400">
                Sua solicitação de acesso foi enviada em{' '}
                {new Date(userData.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-md p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-300 font-medium">O que acontece agora?</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Um administrador revisará sua solicitação e ativará sua conta em breve.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-300 font-medium">Você será notificado</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Quando sua conta for aprovada, você receberá um e-mail e poderá acessar a plataforma.
                  </p>
                </div>
              </div>
            </div>

            <form action={signOut}>
              <Button type="submit" variant="outline" className="w-full">
                Sair
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-500">
          Powered by{' '}
          <span className="text-white font-medium">
            ness<span className="text-primary">.</span>
          </span>
        </div>
      </div>
    </main>
  )
}
