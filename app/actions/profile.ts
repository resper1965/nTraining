'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadImage } from './storage'

/**
 * Update user profile
 */
export async function updateProfile(data: {
  full_name: string
}) {
  const supabase = createClient()
  const user = await requireAuth()

  const { error } = await supabase
    .from('users')
    .update({
      full_name: data.full_name,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    throw new Error(`Erro ao atualizar perfil: ${error.message}`)
  }

  revalidatePath('/profile')
  return { success: true }
}

/**
 * Upload avatar
 */
export async function uploadAvatar(formData: FormData) {
  const supabase = createClient()
  const user = await requireAuth()

  const file = formData.get('avatar') as File
  if (!file) {
    throw new Error('Nenhum arquivo fornecido')
  }

  // Upload to Supabase Storage
  const avatarUrl = await uploadImage(formData, 'avatars', 'avatars')

  // Update user record
  const { error } = await supabase
    .from('users')
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    throw new Error(`Erro ao atualizar avatar: ${error.message}`)
  }

  revalidatePath('/profile')
  return avatarUrl
}

/**
 * Change password
 */
export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  const supabase = createClient()
  const user = await requireAuth()

  // Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: data.currentPassword,
  })

  if (signInError) {
    throw new Error('Senha atual incorreta')
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: data.newPassword,
  })

  if (updateError) {
    throw new Error(`Erro ao alterar senha: ${updateError.message}`)
  }

  revalidatePath('/profile')
  return { success: true }
}

