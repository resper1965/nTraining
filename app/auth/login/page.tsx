import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GoogleSignInButton } from '@/components/auth/google-signin-button'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string; redirect?: string }
}) {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/landing">
            <h1 className="font-display text-4xl font-medium text-white mb-2">
              n<span className="text-primary">.</span>training
            </h1>
          </Link>
          <p className="text-slate-300">
            Entre com suas credenciais ou continue com Google
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-2xl font-medium text-white">
              Entrar
            </CardTitle>
            <CardDescription className="text-slate-300">
              Acesse sua conta para continuar aprendendo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error/Message Alerts */}
            {searchParams.error && (
              <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-md flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-300 mb-1">Erro ao entrar</p>
                  <p className="text-sm text-red-400">{searchParams.error}</p>
                </div>
              </div>
            )}
            {searchParams.message && (
              <div className="p-4 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
                {searchParams.message}
              </div>
            )}

            {/* Google Sign In - Primary Option */}
            <div className="space-y-2">
              <GoogleSignInButton redirectTo={searchParams.redirect || '/dashboard'} />
              <p className="text-xs text-slate-400 text-center">
                Autenticação rápida e segura com sua conta Google
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-3 text-slate-500">ou</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form action={signIn} className="space-y-4">
              <input type="hidden" name="redirect" value={searchParams.redirect || ''} />
              
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
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
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
                  autoComplete="current-password"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-[#0099cc] text-white"
              >
                Entrar
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="pt-4 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                Não tem uma conta?{' '}
                <Link 
                  href={`/auth/signup${searchParams.redirect ? `?redirect=${encodeURIComponent(searchParams.redirect)}` : ''}`} 
                  className="text-primary hover:underline font-medium"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
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

