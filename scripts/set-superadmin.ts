#!/usr/bin/env tsx
/**
 * Script para definir um usuário como superadmin
 *
 * Uso:
 *   npx tsx scripts/set-superadmin.ts resper@ness.com.br
 */

import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const email = process.argv[2] || 'resper@ness.com.br'

async function setSuperadmin() {
  try {
    console.log(`\n🔍 Buscando usuário: ${email}...`)

    // Buscar usuário
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email, full_name, is_superadmin, role')
      .eq('email', email)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        console.error(`\n❌ Usuário com email "${email}" não encontrado no banco de dados.`)
        console.error('\n💡 O usuário precisa ser criado primeiro via:')
        console.error('   - Painel admin: /admin/users/new')
        console.error('   - Ou criar diretamente no Supabase Auth\n')
        process.exit(1)
      } else {
        console.error('❌ Erro ao buscar usuário:', fetchError.message)
        console.error('💡 Verifique se a coluna is_superadmin existe na tabela users')
        process.exit(1)
      }
    }

    if (!user) {
      console.error(`❌ Usuário não encontrado`)
      process.exit(1)
    }

    // Verificar se já é superadmin
    if (user.is_superadmin) {
      console.log('\n✅ Usuário já é superadmin!')
      console.log('\n📋 Informações do usuário:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`Email:      ${user.email}`)
      console.log(`Nome:       ${user.full_name || 'N/A'}`)
      console.log(`ID:         ${user.id}`)
      console.log(`Role:       ${user.role}`)
      console.log(`Superadmin: ✅ SIM`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      return
    }

    // Verificar se a coluna is_superadmin existe
    // Tentar atualizar diretamente
    console.log(`\n🔧 Atualizando usuário para superadmin...`)

    const { error: updateError } = await supabase
      .from('users')
      .update({ is_superadmin: true })
      .eq('id', user.id)

    if (updateError) {
      // Se falhar, pode ser que a coluna não existe
      if (updateError.message.includes('column') || updateError.code === '42703') {
        console.error('\n❌ Erro: A coluna "is_superadmin" não existe na tabela users.')
        console.error('\n💡 Execute este SQL no Supabase SQL Editor:')
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.error('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT FALSE;')
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        process.exit(1)
      } else {
        console.error('❌ Erro ao atualizar usuário:', updateError.message)
        process.exit(1)
      }
    }

    // Buscar novamente para confirmar
    const { data: updatedUser } = await supabase
      .from('users')
      .select('id, email, full_name, is_superadmin, role')
      .eq('id', user.id)
      .single()

    console.log('\n✅ Usuário atualizado com sucesso!')
    console.log('\n📋 Informações do usuário:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Email:      ${updatedUser?.email}`)
    console.log(`Nome:       ${updatedUser?.full_name || 'N/A'}`)
    console.log(`ID:         ${updatedUser?.id}`)
    console.log(`Role:       ${updatedUser?.role}`)
    console.log(`Superadmin: ✅ SIM`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

setSuperadmin()
