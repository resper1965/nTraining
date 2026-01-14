import { createTenant } from '@/lib/supabase/tenants'
import { requireSuperAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CNPJInput } from '@/components/cnpj-input'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewTenantPage() {
  await requireSuperAdmin()

  async function createTenantAction(formData: FormData) {
    'use server'
    
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const cnpj = formData.get('cnpj') as string
    const razao_social = formData.get('razao_social') as string
    const industry = formData.get('industry') as string
    const max_users = formData.get('max_users') ? parseInt(formData.get('max_users') as string) : undefined

    try {
      await createTenant({
        name,
        slug,
        cnpj: cnpj || undefined,
        razao_social: razao_social || undefined,
        industry: industry || undefined,
        max_users,
      })
      redirect('/admin/tenants?success=created')
    } catch (error) {
      redirect(`/admin/tenants/new?error=${encodeURIComponent(error instanceof Error ? error.message : 'Failed to create tenant')}`)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Create New Tenant
          </h1>
          <p className="text-slate-400">
            Add a new organization/tenant to the platform
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              Tenant Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Basic information about the tenant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createTenantAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="ness"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="ness"
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
                  placeholder="Empresa Ltda"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
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
                  placeholder="50"
                  defaultValue="50"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Link href="/admin/tenants">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit">Create Tenant</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

