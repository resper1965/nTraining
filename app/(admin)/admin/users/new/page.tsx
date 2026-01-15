import { createUser } from '@/app/actions/auth'
import { requireSuperAdmin } from '@/lib/supabase/server'
import { getTenants } from '@/lib/supabase/tenants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewUserPage() {
  await requireSuperAdmin()
  const tenants = await getTenants()

  async function createUserAction(formData: FormData) {
    'use server'
    
    // Converter "none" para string vazia (que será tratada como null no backend)
    const organizationId = formData.get('organizationId') as string | null
    if (organizationId === 'none') {
      formData.delete('organizationId')
    }

    try {
      await createUser(formData)
      redirect('/admin/users?success=created')
    } catch (error) {
      redirect(`/admin/users/new?error=${encodeURIComponent(error instanceof Error ? error.message : 'Failed to create user')}`)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            Criar Novo Usuário
          </h1>
          <p className="text-slate-400">
            Crie um novo usuário diretamente no sistema
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              Informações do Usuário
            </CardTitle>
            <CardDescription className="text-slate-400">
              Dados básicos do novo usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createUserAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="João Silva"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao@example.com"
                  required
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-sm text-slate-500">
                  Mínimo de 8 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Papel</Label>
                <Select name="role" defaultValue="student">
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Selecione o papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudante</SelectItem>
                    <SelectItem value="org_manager">Gerente de Organização</SelectItem>
                    <SelectItem value="platform_admin">Administrador da Plataforma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationId">Organização (Opcional)</Label>
                <Select name="organizationId">
                  <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Selecione uma organização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {tenants
                      .filter((tenant) => {
                        return !!(
                          tenant &&
                          tenant.id &&
                          typeof tenant.id === 'string' &&
                          tenant.id.trim().length > 0 &&
                          tenant.id !== 'none'
                        )
                      })
                      .map((tenant) => {
                        const tenantId = tenant.id.trim()
                        if (!tenantId || tenantId.length === 0 || tenantId === 'none') {
                          return null
                        }
                        return (
                          <SelectItem key={tenantId} value={tenantId}>
                            {tenant.name || 'Sem nome'}
                          </SelectItem>
                        )
                      })
                      .filter((item): item is JSX.Element => item !== null)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Link href="/admin/users">
                  <Button variant="outline" type="button">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit">Criar Usuário</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

