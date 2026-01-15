#!/usr/bin/env tsx
/**
 * Script de diagnóstico: Verificar autenticação de usuário
 * 
 * Uso: tsx scripts/check-user-auth.ts <user-id>
 * 
 * Verifica se um usuário existe tanto em auth.users quanto na tabela users
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function checkUser(userId: string) {
  console.log(`\n🔍 Verificando usuário: ${userId}\n`)

  // 1. Verificar na tabela users
  console.log('1️⃣ Verificando na tabela `users`...')
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError) {
    console.error('❌ Erro ao buscar na tabela users:', userError.message)
    return
  }

  if (!userData) {
    console.error('❌ Usuário NÃO encontrado na tabela `users`')
    return
  }

  console.log('✅ Usuário encontrado na tabela `users`:')
  console.log('   - ID:', userData.id)
  console.log('   - Email:', userData.email)
  console.log('   - Nome:', userData.full_name)
  console.log('   - Ativo:', userData.is_active)
  console.log('   - Superadmin:', userData.is_superadmin)
  console.log('   - Role:', userData.role)

  // 2. Verificar em auth.users
  console.log('\n2️⃣ Verificando em `auth.users`...')
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error('❌ Erro ao buscar em auth.users:', authError.message)
    return
  }

  const authUser = authUsers.users.find((u) => u.id === userId)

  if (!authUser) {
    console.error('❌ Usuário NÃO encontrado em `auth.users`')
    console.log('\n⚠️  PROBLEMA: Usuário existe na tabela `users` mas não em `auth.users`')
    console.log('   Isso significa que o usuário não pode fazer login porque não tem credenciais de autenticação.')
    console.log('\n💡 SOLUÇÃO:')
    console.log('   1. Verifique se o usuário foi criado corretamente')
    console.log('   2. Se necessário, crie o usuário em auth.users usando o Supabase Dashboard')
    console.log('   3. Ou use o script de criação de usuário para sincronizar')
    return
  }

  console.log('✅ Usuário encontrado em `auth.users`:')
  console.log('   - ID:', authUser.id)
  console.log('   - Email:', authUser.email)
  console.log('   - Email confirmado:', authUser.email_confirmed_at ? 'Sim' : 'Não')
  console.log('   - Criado em:', authUser.created_at)

  // 3. Verificar correspondência
  console.log('\n3️⃣ Verificando correspondência...')
  if (userData.id !== authUser.id) {
    console.error('❌ IDs não correspondem!')
    return
  }

  if (userData.email !== authUser.email) {
    console.warn('⚠️  Emails não correspondem!')
    console.warn('   Tabela users:', userData.email)
    console.warn('   Auth.users:', authUser.email)
  } else {
    console.log('✅ IDs e emails correspondem')
  }

  // 4. Status geral
  console.log('\n📊 Status Geral:')
  console.log('   ✅ Usuário existe em ambos os lugares')
  console.log('   ✅ Pode fazer login:', authUser.email_confirmed_at ? 'Sim' : 'Não (email não confirmado)')
  console.log('   ✅ Conta ativa:', userData.is_active ? 'Sim' : 'Não')
}

// Executar
const userId = process.argv[2]

if (!userId) {
  console.error('❌ Uso: tsx scripts/check-user-auth.ts <user-id>')
  console.error('   Exemplo: tsx scripts/check-user-auth.ts d53930be-453c-425c-b11b-a295451e9d78')
  process.exit(1)
}

checkUser(userId)
  .then(() => {
    console.log('\n✅ Verificação concluída\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro:', error)
    process.exit(1)
  })
