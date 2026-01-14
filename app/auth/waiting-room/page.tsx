import { getCurrentUser } from '@/lib/auth/helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

// Usar revalidate em vez de force-dynamic para evitar loops
export const revalidate = 0

export default async function WaitingRoomPage() {
  // Usar getCurrentUser com cache request-scoped
  const user = await getCurrentUser()

  // Se não autenticado, redirecionar para login
  if (!user) {
    redirect('/auth/login')
  }

  // IMPORTANTE: Superadmins NUNCA devem estar na waiting room
  // Redirecionar imediatamente para /admin (mesmo se is_active = false)
  // Verificar explicitamente com === true para garantir
  if (user.is_superadmin === true) {
    redirect('/admin')
  }

  // Se usuário já foi aprovado, redirecionar para dashboard
  if (user.is_active === true) {
    redirect('/dashboard')
  }

  // Se chegou aqui e é superadmin (verificação dupla), redirecionar
  // Isso é uma proteção extra caso a verificação acima falhe
  if (user.is_superadmin) {
    redirect('/admin')
  }

  // Se chegou aqui, usuário está pendente de aprovação
  const userData = user

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
