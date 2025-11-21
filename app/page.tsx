import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-6xl font-medium text-white mb-4 leading-tight">
            nTraining
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Professional training platform powered by{" "}
            <span className="text-white font-medium">
              ness<span className="text-primary">.</span>
            </span>
          </p>
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
              <Button className="w-full">Explore Courses</Button>
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
              <Button variant="outline" className="w-full">
                View Progress
              </Button>
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
              <Button variant="outline" className="w-full">
                My Certificates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
