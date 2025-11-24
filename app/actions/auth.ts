'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ============================================================================
// SIGN UP
// ============================================================================

export async function signUp(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const organizationSlug = formData.get('organizationSlug') as string | null

  // Validate input
  if (!email || !password) {
    redirect('/auth/signup?error=Email and password are required')
  }

  if (password.length < 8) {
    redirect('/auth/signup?error=Password must be at least 8 characters')
  }

  // Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (authError) {
    redirect(`/auth/signup?error=${encodeURIComponent(authError.message)}`)
  }

  if (!authData.user) {
    redirect('/auth/signup?error=Failed to create user')
  }

  // Get or create organization if slug provided
  let organizationId: string | null = null
  if (organizationSlug) {
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', organizationSlug)
      .single()

    if (org) {
      organizationId = org.id
    }
  }

  // Create user record in users table
  const { error: userError } = await supabase.from('users').insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    role: 'student',
    organization_id: organizationId,
    is_active: true,
  })

  if (userError) {
    redirect(`/auth/signup?error=${encodeURIComponent(`Failed to create user profile: ${userError.message}`)}`)
  }

  revalidatePath('/')
  redirect('/auth/login?message=Check your email to verify your account')
}

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

  // Update last login
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)
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
  redirect('/auth/login')
}

// ============================================================================
// RESET PASSWORD
// ============================================================================

export async function resetPassword(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string

  if (!email) {
    redirect('/auth/forgot-password?error=Email is required')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/auth/login?message=Check your email for password reset instructions')
}

