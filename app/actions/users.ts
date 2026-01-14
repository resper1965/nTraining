'use server'

import { createClient } from '@/lib/supabase/server'
import { requireSuperAdmin } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ============================================================================
// APPROVE USER
// ============================================================================

export async function approveUser(userId: string) {
  await requireSuperAdmin()
  const supabase = createClient()

  const { error } = await supabase
    .from('users')
    .update({ is_active: true })
    .eq('id', userId)

  if (error) {
    throw new Error(`Erro ao aprovar usuário: ${error.message}`)
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin/users/pending')
  return { success: true }
}

// ============================================================================
// REJECT USER
// ============================================================================

export async function rejectUser(userId: string) {
  await requireSuperAdmin()
  const supabase = createClient()

  // Buscar email do usuário antes de deletar
  const { data: userData } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single()

  // Deletar da tabela users (cascade deleta do auth.users também devido ao ON DELETE CASCADE)
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) {
    throw new Error(`Erro ao rejeitar usuário: ${error.message}`)
  }

  // Se necessário, deletar também do auth.users usando service role
  if (userData?.email) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (supabaseUrl && serviceRoleKey) {
        const { createClient: createServiceClient } = await import('@supabase/supabase-js')
        const supabaseAdmin = createServiceClient(supabaseUrl, serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })

        // Buscar usuário no auth pelo email
        const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
        const authUser = authUsers?.users.find(u => u.email === userData.email)

        if (authUser) {
          await supabaseAdmin.auth.admin.deleteUser(authUser.id)
        }
      }
    } catch (error) {
      console.error('Error deleting user from auth:', error)
      // Não falhar se não conseguir deletar do auth, já que o cascade deve ter funcionado
    }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin/users/pending')
  return { success: true }
}

// ============================================================================
// GET PENDING USERS
// ============================================================================

export async function getPendingUsers() {
  await requireSuperAdmin()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, role, created_at, organization_id')
    .eq('is_active', false)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erro ao buscar usuários pendentes: ${error.message}`)
  }

  return data || []
}
