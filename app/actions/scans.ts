'use server'

import { createClient, requireAuth } from '@/lib/supabase/server'

interface Asset {
  id: string
  org_id: string
  // Adicione outras propriedades do asset conforme necessário
  [key: string]: any
}

interface Profile {
  id: string
  org_id: string
  // Adicione outras propriedades do profile conforme necessário
  [key: string]: any
}

/**
 * Example function that checks asset organization
 * Adjust the function name and logic based on your actual use case
 */
export async function checkAssetOrganization(assetId: string) {
  const supabase = createClient()
  const user = await requireAuth()

  // Fetch user profile
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profileData) {
    return { success: false, error: 'Erro ao buscar perfil do usuário' }
  }

  const profile = profileData as { organization_id: string | null }

  if (!profile.organization_id) {
    return { success: false, error: 'Usuário não está associado a uma organização' }
  }

  // Fetch asset - adjust table name and fields based on your schema
  const { data: assetData, error: assetError } = await supabase
    .from('assets') // Adjust table name if different
    .select('org_id') // Adjust field name if it's 'organization_id' instead
    .eq('id', assetId)
    .single()

  if (assetError) {
    return { success: false, error: `Erro ao buscar asset: ${assetError.message}` }
  }

  // Verify asset exists and has correct type
  if (!assetData) {
    return { success: false, error: 'Asset não encontrado' }
  }

  // Type assertion - ensure asset has org_id property
  const asset = assetData as { org_id: string } | null

  if (!asset || !asset.org_id) {
    return { success: false, error: 'Asset não encontrado ou sem organização' }
  }

  // Check if asset belongs to user's organization
  // Adjust field name if your schema uses 'organization_id' instead of 'org_id'
  if (asset.org_id !== profile.organization_id) {
    return { success: false, error: 'Asset não pertence à sua organização' }
  }

  return { success: true }
}
