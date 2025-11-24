import { signUp } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            nTraining
          </h1>
          <p className="text-slate-400">
            Create your account to get started
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-white">
              Sign Up
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchParams.error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-800 rounded-md text-sm text-red-300">
                {searchParams.error}
              </div>
            )}
            {searchParams.message && (
              <div className="mb-4 p-3 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-300">
                {searchParams.message}
              </div>
            )}
            <form action={signUp} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

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
                  minLength={8}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-500">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="organizationSlug"
                  className="text-sm font-medium text-slate-300"
                >
                  Organization Slug (Optional)
                </label>
                <input
                  id="organizationSlug"
                  name="organizationSlug"
                  type="text"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="my-company"
                />
                <p className="text-xs text-slate-500">
                  If you have an organization code, enter it here
                </p>
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary/80">
                Sign in
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

