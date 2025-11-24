import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AdminLicensesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-white mb-2">
          Licenças
        </h1>
        <p className="text-slate-400">
          Gerencie licenças e acesso a cursos
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-lg text-white">
            Gestão de Licenças
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-slate-400">
              Em breve: Dashboard completo de licenças
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

