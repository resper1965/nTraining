'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/server'

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(formData: FormData): Promise<string> {
  await requireAuth()
  const supabase = createClient()

  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string
  const folder = (formData.get('folder') as string) || ''

  if (!file) {
    throw new Error('Nenhum arquivo fornecido')
  }

  // Gerar nome único para o arquivo
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = folder ? `${folder}/${fileName}` : fileName

  // Upload para Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Erro ao fazer upload: ${error.message}`)
  }

  // Obter URL pública
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return publicUrl
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(bucket: string, filePath: string): Promise<void> {
  await requireAuth()
  const supabase = createClient()

  const { error } = await supabase.storage.from(bucket).remove([filePath])

  if (error) {
    throw new Error(`Erro ao deletar imagem: ${error.message}`)
  }
}

