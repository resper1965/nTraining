import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { Plus, Search, Building2, Eye } from 'lucide-react'
import { formatCNPJ } from '@/lib/utils/cnpj'
import type { Organization } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

interface OrganizationWithCount extends Organization {
  users_count: number
}

export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string }
}) {
  // Layout já verifica autenticação e permissões de admin
  const supabase = createClient()

  // Buscar organizações diretamente do Supabase (sem usar fetch/API routes)
  let query = supabase
    .from('organizations')
    .select(`
      *,
      users:users(count)
    `)

  // Aplicar filtros
  if (searchParams.search) {
    query = query.or(
      `name.ilike.%${searchParams.search}%,razao_social.ilike.%${searchParams.search}%,cnpj.ilike.%${searchParams.search}%`
    )
  }

  if (searchParams.status && searchParams.status !== 'all') {
    if (searchParams.status === 'active') {
      query = query.eq('subscription_status', 'active')
    } else {
      query = query.or('subscription_status.is.null,subscription_status.neq.active')
    }
  }

  // Ordenar por data de criação (mais recentes primeiro)
  query = query.order('created_at', { ascending: false })

  const { data: organizationsData, error: orgsError } = await query

  if (orgsError) {
    throw new Error(`Failed to fetch organizations: ${orgsError.message}`)
  }

  // Transformar dados para incluir contagem de usuários
  const organizations: OrganizationWithCount[] = (organizationsData || []).map(
    (org: any) => ({
      ...org,
      users_count: Array.isArray(org.users) ? org.users[0]?.count || 0 : 0,
    })
  )

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

      {/* Organizations Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="font-display text-lg text-white">
            {organizations.length}{' '}
            {organizations.length === 1 ? 'Organização' : 'Organizações'}
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
            <div className="rounded-md border border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-800/50 border-slate-800">
                    <TableHead className="text-slate-400">Nome</TableHead>
                    <TableHead className="text-slate-400">Razão Social</TableHead>
                    <TableHead className="text-slate-400">CNPJ</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Usuários</TableHead>
                    <TableHead className="text-slate-400">Criada em</TableHead>
                    <TableHead className="text-slate-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow
                      key={org.id}
                      className="border-slate-800 hover:bg-slate-800/50"
                    >
                      <TableCell className="font-medium text-white">
                        {org.name}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {org.razao_social || '-'}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {org.cnpj ? formatCNPJ(org.cnpj) : '-'}
                      </TableCell>
                      <TableCell>
                        {org.subscription_status === 'active' ? (
                          <span className="text-xs px-2 py-1 rounded bg-green-950/50 text-green-400">
                            Ativa
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">
                            Inativa
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {org.users_count || 0}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(org.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
