#!/usr/bin/env tsx
/**
 * Script para criar usuário via API Admin do Supabase
 * 
 * Uso:
 *   tsx scripts/create-user-admin.ts resper@ness.com.br "Gordinh@29" "Resper" true
 * 
 * Ou configure as variáveis no código abaixo
 */

import { createClient } from '@supabase/supabase-js'

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}`)
  console.error(`SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? '✅' : '❌'}`)
  process.exit(1)
}

// ============================================================================
// PARÂMETROS (via argumentos ou configure aqui)
// ============================================================================

const email = process.argv[2] || 'resper@ness.com.br'
const password = process.argv[3] || 'Gordinh@29'
const fullName = process.argv[4] || 'Resper'
const isSuperadmin = process.argv[5] === 'true' || true // Default: true

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

async function createUser() {
  console.log('🔧 Criando usuário via API Admin do Supabase...\n')
  console.log(`📧 Email: ${email}`)
  console.log(`👤 Nome: ${fullName}`)
  console.log(`🔐 Superadmin: ${isSuperadmin ? 'Sim' : 'Não'}\n`)

  // Criar cliente com service role
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    // 1. Verificar se usuário já existe
    console.log('🔍 Verificando se usuário já existe...')
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser?.users?.find((u) => u.email === email)

    if (userExists) {
      console.log(`⚠️  Usuário já existe no auth.users (ID: ${userExists.id})`)
      console.log('🗑️  Deletando usuário existente...')

      // Deletar do auth.users
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(
        userExists.id
      )

      if (deleteAuthError) {
        console.error('❌ Erro ao deletar do auth.users:', deleteAuthError.message)
        throw deleteAuthError
      }

      // Deletar da tabela users
      const { error: deleteUserError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', userExists.id)

      if (deleteUserError) {
        console.log('⚠️  Usuário não encontrado na tabela users (pode não existir)')
      } else {
        console.log('✅ Usuário deletado da tabela users')
      }

      console.log('✅ Usuário deletado com sucesso\n')
    }

    // 2. Criar usuário no Supabase Auth
    console.log('👤 Criando usuário no Supabase Auth...')
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Auto-confirmar email
        user_metadata: {
          full_name: fullName,
        },
      })

    if (authError || !authData.user) {
      console.error('❌ Erro ao criar usuário no auth:', authError?.message)
      throw authError || new Error('Erro desconhecido ao criar usuário')
    }

    console.log(`✅ Usuário criado no auth.users (ID: ${authData.user.id})`)

    // 3. Criar registro na tabela users
    console.log('📝 Criando registro na tabela users...')
    const { error: userError } = await supabaseAdmin.from('users').insert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      role: 'platform_admin', // Role padrão
      organization_id: null,
      is_active: true, // Usuário já ativo
      is_superadmin: isSuperadmin,
    })

    if (userError) {
      console.error('❌ Erro ao criar registro na tabela users:', userError.message)
      
      // Tentar deletar do auth se falhar
      console.log('🗑️  Tentando reverter criação no auth...')
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      throw userError
    }

    console.log('✅ Registro criado na tabela users')

    // 4. Resumo
    console.log('\n' + '='.repeat(60))
    console.log('✅ USUÁRIO CRIADO COM SUCESSO!')
    console.log('='.repeat(60))
    console.log(`📧 Email: ${email}`)
    console.log(`👤 Nome: ${fullName}`)
    console.log(`🆔 ID: ${authData.user.id}`)
    console.log(`👑 Superadmin: ${isSuperadmin ? 'Sim' : 'Não'}`)
    console.log(`✅ Status: Ativo`)
    console.log(`🔐 Email confirmado: Sim`)
    console.log('='.repeat(60))
    console.log('\n🎉 Você já pode fazer login com este usuário!')
    console.log(`   URL: ${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/auth/login\n`)

  } catch (error) {
    console.error('\n❌ ERRO ao criar usuário:')
    console.error(error)
    process.exit(1)
  }
}

// ============================================================================
// EXECUTAR
// ============================================================================

createUser()
