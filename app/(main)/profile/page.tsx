import { requireAuth } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Building, Shield, Camera } from 'lucide-react'
import { ProfileForm } from '@/components/profile/profile-form'
import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { AvatarUpload } from '@/components/profile/avatar-upload'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  await requireAuth()
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-medium text-white mb-2">
              Meu Perfil
            </h1>
            <p className="text-slate-400">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>
          <Link href="/profile/notifications">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Preferências de Notificação
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-xl text-white flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Foto de Perfil
              </CardTitle>
              <CardDescription>
                Sua foto será exibida em seu perfil e certificados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarUpload currentAvatarUrl={user.avatar_url || undefined} />
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-xl text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                initialData={{
                  full_name: user.full_name || '',
                  email: user.email || '',
                }}
              />
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-xl text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-400">Email</div>
                  <div className="text-white">{user.email}</div>
                </div>
              </div>
              {user.organization_id && (
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <Building className="h-5 w-5 text-slate-400" />
                  <div>
                    <div className="text-sm text-slate-400">Organização</div>
                    <div className="text-white">{user.organization_id}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                <Shield className="h-5 w-5 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-400">Função</div>
                  <div className="text-white capitalize">
                    {user.role || 'student'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="font-display text-xl text-white">
                Alterar Senha
              </CardTitle>
              <CardDescription>
                Use uma senha forte e única
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

