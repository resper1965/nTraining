import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string; redirect?: string }
}) {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            nTraining
          </h1>
          <p className="text-slate-400">
            Sign in to your account
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-white">
              Sign In
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access your account
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

            <form action={signIn} className="space-y-4">
              <input type="hidden" name="redirect" value={searchParams.redirect || ''} />
              
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:text-primary/80">
                Sign up
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

