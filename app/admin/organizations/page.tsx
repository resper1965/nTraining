import { requireSuperAdmin } from '@/lib/supabase/server'
import { getAllOrganizations } from '@/app/actions/organizations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Plus, Search, Building2, Eye } from 'lucide-react'
import { formatCNPJ } from '@/lib/utils/cnpj'

export const dynamic = 'force-dynamic'

export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string }
}) {
  await requireSuperAdmin()

  const organizations = await getAllOrganizations({
    search: searchParams.search,
    status: (searchParams.status as 'active' | 'inactive' | 'all') || 'all',
  })

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <form method="get" className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                name="search"
                placeholder="Buscar por nome, razão social ou CNPJ..."
                defaultValue={searchParams.search}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <select
              name="status"
              defaultValue={searchParams.status || 'all'}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white text-sm"
            >
              <option value="all">Todas</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>
            <Button type="submit">Filtrar</Button>
          </form>
        </CardContent>
      </Card>

      {/* Organizations List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-lg text-white">
            {organizations.length} {organizations.length === 1 ? 'Organização' : 'Organizações'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {organizations.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Nenhuma organização encontrada</p>
              <Link href="/admin/organizations/new">
                <Button variant="outline">Criar primeira organização</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-lg font-medium text-white">
                          {org.name}
                        </h3>
                        {org.subscription_status === 'active' && (
                          <span className="text-xs px-2 py-1 rounded bg-green-950/50 text-green-400">
                            Ativa
                          </span>
                        )}
                      </div>
                      {org.razao_social && (
                        <p className="text-sm text-slate-400 mb-1">
                          {org.razao_social}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        {org.cnpj && (
                          <span>CNPJ: {formatCNPJ(org.cnpj)}</span>
                        )}
                        <span>
                          {(org as any).users_count || 0} usuários
                        </span>
                        <span>
                          Criada em {new Date(org.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/organizations/${org.id}/view`}>
                        <Button variant="ghost" size="sm" className="text-slate-400">
                          <Eye className="h-4 w-4 mr-1" />
                          Visitar
                        </Button>
                      </Link>
                      <Link href={`/admin/organizations/${org.id}`}>
                        <Button variant="ghost" size="sm" className="text-slate-400">
                          Detalhes →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
