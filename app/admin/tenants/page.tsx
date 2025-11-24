import { getTenants } from '@/lib/supabase/tenants'
import { requireSuperAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CNPJDisplay } from '@/components/cnpj-display'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminTenantsPage() {
  await requireSuperAdmin()
  const tenants = await getTenants()

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-medium text-white mb-2">
              Tenant Management
            </h1>
            <p className="text-slate-400">
              Manage all organizations and tenants
            </p>
          </div>
          <Link href="/admin/tenants/new">
            <Button>New Tenant</Button>
          </Link>
        </div>

        {/* Tenants Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              All Tenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tenants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No tenants found</p>
                <p className="text-slate-500 text-sm mt-2">
                  Start by creating a new tenant
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Slug
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        CNPJ
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Razão Social
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Max Users
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map((tenant) => (
                      <tr
                        key={tenant.id}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-slate-300">
                          {tenant.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          {tenant.slug}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          <CNPJDisplay cnpj={tenant.cnpj} />
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          {tenant.razao_social || '—'}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          {tenant.max_users}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-400">
                          {new Date(tenant.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Link href={`/admin/tenants/${tenant.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

