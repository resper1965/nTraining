'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ============================================================================
// SIGN IN
// ============================================================================

export async function signIn(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string | null

  if (!email || !password) {
    redirect('/auth/login?error=Email and password are required')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectTo || '')}`)
  }

  // Update last login and check if superadmin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Buscar dados completos do usuário antes de atualizar
    const { data: userData } = await supabase
      .from('users')
      .select('last_login_at, full_name, email, is_superadmin')
      .eq('id', user.id)
      .single()

    // Atualizar last_login_at
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    // Criar notificação de boas-vindas se for primeiro login
    if (userData && !userData.last_login_at) {
      try {
        const { notifyWelcome } = await import('@/lib/notifications/triggers')
        await notifyWelcome(user.id, userData.full_name || userData.email)
      } catch (notifError) {
        console.error('Error creating welcome notification:', notifError)
      }
    }

    // Redirect superadmin to admin panel, unless redirectTo is specified
    if (userData?.is_superadmin && !redirectTo) {
      revalidatePath('/')
      redirect('/admin')
      return
    }
  }

  revalidatePath('/')
  redirect(redirectTo || '/dashboard')
}

// ============================================================================
// SIGN OUT
// ============================================================================

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/')
}

// ============================================================================
// CREATE USER (Admin only - creates user directly in database)
// ============================================================================

export async function createUser(formData: FormData) {
  'use server'
  
  // Usar service role key para criar usuário via admin API
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configuração do servidor incompleta. Verifique SUPABASE_SERVICE_ROLE_KEY.')
  }

  // Criar cliente com service role para operações admin
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createServiceClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const role = formData.get('role') as string || 'student'
  const organizationId = formData.get('organizationId') as string | null

  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios')
  }

  if (password.length < 8) {
    throw new Error('Senha deve ter pelo menos 8 caracteres')
  }

  // Criar usuário no Supabase Auth usando admin API
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirmar email
    user_metadata: {
      full_name: fullName,
    },
  })

  if (authError || !authData.user) {
    throw new Error(`Erro ao criar usuário: ${authError?.message || 'Erro desconhecido'}`)
  }

  // Criar registro na tabela users
  const { error: userError } = await supabaseAdmin.from('users').insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    role: role as 'platform_admin' | 'org_manager' | 'student',
    organization_id: organizationId || null,
    is_active: true,
  })

  if (userError) {
    // Se falhar ao criar na tabela users, tenta deletar do auth
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    throw new Error(`Erro ao criar perfil do usuário: ${userError.message}`)
  }

  revalidatePath('/admin/users')
  return { success: true, userId: authData.user.id }
}

