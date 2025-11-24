import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-6xl font-medium text-white mb-4 leading-tight">
            n<span className="text-[#00ade8]">.</span>training
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Professional training platform powered by{' '}
            <span className="text-white font-medium">
              ness<span className="text-primary">.</span>
            </span>
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">Dashboard</Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg">
                Courses
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-xl text-white">
                Courses
              </CardTitle>
              <CardDescription className="text-slate-400">
                Browse available training courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/courses">
                <Button className="w-full">Explore Courses</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-xl text-white">
                Progress
              </CardTitle>
              <CardDescription className="text-slate-400">
                Track your learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  View Progress
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-xl text-white">
                Certificates
              </CardTitle>
              <CardDescription className="text-slate-400">
                Access your certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  My Certificates
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
