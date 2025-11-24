import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-white mb-2">
          Relatórios
        </h1>
        <p className="text-slate-400">
          Relatórios e analytics da plataforma
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-lg text-white">
            Relatórios Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-slate-400">
              Em breve: Sistema completo de relatórios
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

