#!/usr/bin/env tsx
/**
 * Script para verificar se um usuário é superadmin
 * 
 * Uso: tsx scripts/check-superadmin.ts <email>
 * Exemplo: tsx scripts/check-superadmin.ts resper@ness.com.br
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅' : '❌'}`)
  console.error(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceRoleKey ? '✅' : '❌'}`)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function checkSuperadmin(email: string) {
  console.log(`\n🔍 Verificando se "${email}" é superadmin...\n`)

  // Buscar usuário na tabela users
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, full_name, role, is_superadmin, is_active, created_at')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      console.error(`❌ Usuário com email "${email}" não encontrado no banco de dados.`)
      console.error('\n💡 O usuário precisa ser criado primeiro via:')
      console.error('   - Painel admin: /admin/users/new')
      console.error('   - Ou criar diretamente no Supabase Auth\n')
      process.exit(1)
    } else {
      console.error('❌ Erro ao buscar usuário:', error.message)
      process.exit(1)
    }
  }

  if (!user) {
    console.error(`❌ Usuário não encontrado`)
    process.exit(1)
  }

  // Exibir informações do usuário
  console.log('📋 Informações do usuário:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Email:        ${user.email}`)
  console.log(`Nome:         ${user.full_name || 'N/A'}`)
  console.log(`ID:           ${user.id}`)
  console.log(`Role:         ${user.role}`)
  console.log(`Ativo:        ${user.is_active ? '✅ SIM' : '❌ NÃO'}`)
  console.log(`Superadmin:   ${user.is_superadmin ? '✅ SIM' : '❌ NÃO'}`)
  console.log(`Criado em:    ${new Date(user.created_at).toLocaleString('pt-BR')}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (user.is_superadmin) {
    console.log('✅ O usuário É superadmin e tem acesso total ao sistema.')
  } else {
    console.log('❌ O usuário NÃO é superadmin.')
    console.log('\n💡 Para tornar este usuário superadmin, execute:')
    console.log(`   tsx scripts/set-superadmin.ts ${email}\n`)
  }

  // Verificar também em auth.users
  console.log('\n🔍 Verificando em auth.users...')
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error('⚠️  Erro ao buscar em auth.users:', authError.message)
    return
  }

  const authUser = authUsers.users.find((u) => u.email === email.toLowerCase().trim())

  if (authUser) {
    console.log('✅ Usuário encontrado em auth.users')
    console.log(`   - ID: ${authUser.id}`)
    console.log(`   - Email confirmado: ${authUser.email_confirmed_at ? '✅ SIM' : '❌ NÃO'}`)
  } else {
    console.log('⚠️  Usuário NÃO encontrado em auth.users')
    console.log('   Isso pode indicar que o usuário não pode fazer login.')
  }
}

const email = process.argv[2]

if (!email) {
  console.error('❌ Uso: tsx scripts/check-superadmin.ts <email>')
  console.error('   Exemplo: tsx scripts/check-superadmin.ts resper@ness.com.br')
  process.exit(1)
}

checkSuperadmin(email)
  .then(() => {
    console.log('\n✅ Verificação concluída!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro:', error)
    process.exit(1)
  })
