import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminOrganizationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-white mb-2">
            Organizações
          </h1>
          <p className="text-slate-400">
            Gerencie todas as organizações da plataforma
          </p>
        </div>
        <Link href="/admin/organizations/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Organização
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-lg text-white">
            Lista de Organizações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-slate-400">
              Em breve: Lista completa de organizações com filtros e ações em massa
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

