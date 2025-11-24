import { getTenantById, updateTenant } from '@/lib/supabase/tenants'
import { requireSuperAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CNPJInput } from '@/components/cnpj-input'
import type { Organization } from '@/lib/types/database'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditTenantPage({
  params,
}: {
  params: { id: string }
}) {
  await requireSuperAdmin()

  let tenant: Organization
  try {
    tenant = await getTenantById(params.id)
  } catch (error) {
    console.error('Error fetching tenant:', error)
    notFound()
  }

  if (!tenant) {
    notFound()
  }

  async function updateTenantAction(formData: FormData) {
    'use server'
    
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const cnpj = formData.get('cnpj') as string
    const razao_social = formData.get('razao_social') as string
    const industry = formData.get('industry') as string
    const max_users = formData.get('max_users') ? parseInt(formData.get('max_users') as string) : undefined

    try {
      await updateTenant(tenant.id, {
        name,
        slug,
        cnpj: cnpj || undefined,
        razao_social: razao_social || undefined,
        industry: industry || undefined,
        max_users,
      })
      redirect('/admin/tenants?success=updated')
    } catch (error) {
      redirect(`/admin/tenants/${tenant.id}/edit?error=${encodeURIComponent(error instanceof Error ? error.message : 'Failed to update tenant')}`)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Edit Tenant: {tenant.name}
          </h1>
          <p className="text-slate-400">
            Update tenant information
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              Tenant Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Update tenant details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateTenantAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={tenant.name}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={tenant.slug}
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-sm text-slate-500">
                  URL-friendly identifier (lowercase, no spaces)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <CNPJInput
                  name="cnpj"
                  value={tenant.cnpj || ''}
                  placeholder="00.000.000/0000-00"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-sm text-slate-500">
                  CNPJ format: 99.999.999/9999-99
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="razao_social">Razão Social</Label>
                <Input
                  id="razao_social"
                  name="razao_social"
                  defaultValue={tenant.razao_social || ''}
                  placeholder="Empresa Ltda"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  defaultValue={tenant.industry || ''}
                  placeholder="Tecnologia"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_users">Max Users</Label>
                <Input
                  id="max_users"
                  name="max_users"
                  type="number"
                  defaultValue={tenant.max_users}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Link href="/admin/tenants">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

