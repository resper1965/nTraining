import { signUp } from '@/app/actions/auth'
import { getPublicOrganizations } from '@/app/actions/organizations'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string }
}) {
  // Buscar organizações disponíveis
  let organizations: Array<{ id: string; name: string; slug: string }> = []
  try {
    organizations = await getPublicOrganizations()
  } catch (error) {
    console.error('Error fetching organizations:', error)
  }
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            n<span className="text-[#00ade8]">.</span>training
          </h1>
          <p className="text-slate-400">
            Crie sua conta e aguarde aprovação
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-white">
              Criar Conta
            </CardTitle>
            <CardDescription className="text-slate-400">
              Preencha os dados abaixo. Sua conta será ativada após aprovação do administrador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchParams.message && (
              <div className="mb-4 p-3 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
                {searchParams.message}
              </div>
            )}
            {searchParams.error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-800 rounded-md text-sm text-red-300">
                {searchParams.error}
              </div>
            )}

            <form action={signUp} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-slate-300"
                >
                  Nome Completo
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-300"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-300"
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-500">
                  Mínimo de 8 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="organizationId"
                  className="text-sm font-medium text-slate-300"
                >
                  Organização *
                </label>
                <Select name="organizationId" required>
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Selecione uma organização" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.length === 0 ? (
                      <SelectItem value="" disabled>
                        Nenhuma organização disponível
                      </SelectItem>
                    ) : (
                      organizations.map((org: { id: string; name: string }) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Selecione a organização à qual deseja se vincular
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={organizations.length === 0}>
                Criar Conta
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Já tem uma conta?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </div>
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
