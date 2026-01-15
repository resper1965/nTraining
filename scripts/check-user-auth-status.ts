import { createClient } from '@supabase/supabase-js'

// Carregar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✅' : '❌')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function checkUserAuthStatus(email: string) {
  console.log(`\n🔍 Verificando status de autenticação para: ${email}\n`)

  // 1. Verificar na tabela public.users
  console.log('1️⃣ Verificando na tabela public.users...')
  const { data: publicUser, error: publicError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (publicError) {
    console.error(`❌ Erro ao buscar em public.users: ${publicError.message}`)
    return
  }

  if (!publicUser) {
    console.log('❌ Usuário NÃO encontrado em public.users')
    return
  }

  console.log('✅ Usuário encontrado em public.users:')
  console.log(`   ID: ${publicUser.id}`)
  console.log(`   Email: ${publicUser.email}`)
  console.log(`   Nome: ${publicUser.full_name}`)
  console.log(`   Ativo: ${publicUser.is_active}`)
  console.log(`   Superadmin: ${publicUser.is_superadmin}`)
  console.log(`   Último login: ${publicUser.last_login_at || 'Nunca'}`)

  // 2. Verificar no auth.users
  console.log('\n2️⃣ Verificando no auth.users...')
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(publicUser.id)

  if (authError) {
    console.error(`❌ Erro ao buscar em auth.users: ${authError.message}`)
    console.log('\n⚠️ PROBLEMA IDENTIFICADO: Usuário existe em public.users mas NÃO em auth.users!')
    console.log('   Isso causa falha na autenticação.')
    return
  }

  if (!authUser || !authUser.user) {
    console.log('❌ Usuário NÃO encontrado em auth.users')
    console.log('\n⚠️ PROBLEMA IDENTIFICADO: Usuário existe em public.users mas NÃO em auth.users!')
    console.log('   Isso causa falha na autenticação.')
    return
  }

  console.log('✅ Usuário encontrado em auth.users:')
  console.log(`   ID: ${authUser.user.id}`)
  console.log(`   Email: ${authUser.user.email}`)
  console.log(`   Email confirmado: ${authUser.user.email_confirmed_at ? 'Sim' : 'Não'}`)
  console.log(`   Criado em: ${authUser.user.created_at}`)
  console.log(`   Último login: ${authUser.user.last_sign_in_at || 'Nunca'}`)

  // 3. Verificar se os IDs coincidem
  console.log('\n3️⃣ Verificando consistência...')
  if (publicUser.id !== authUser.user.id) {
    console.error('❌ IDs não coincidem!')
    console.error(`   public.users.id: ${publicUser.id}`)
    console.error(`   auth.users.id: ${authUser.user.id}`)
    return
  }

  console.log('✅ IDs coincidem')

  // 4. Verificar se email confirmado
  if (!authUser.user.email_confirmed_at) {
    console.log('\n⚠️ ATENÇÃO: Email não confirmado!')
    console.log('   Isso pode impedir o login dependendo das configurações do Supabase.')
  }

  // 5. Testar autenticação (sem senha, apenas verificar estrutura)
  console.log('\n4️⃣ Resumo:')
  console.log('✅ Usuário existe em ambos os lugares')
  console.log('✅ IDs coincidem')
  if (authUser.user.email_confirmed_at) {
    console.log('✅ Email confirmado')
  } else {
    console.log('⚠️ Email NÃO confirmado (pode causar problemas)')
  }

  console.log('\n💡 Se ainda não consegue fazer login, verifique:')
  console.log('   1. A senha está correta?')
  console.log('   2. O email está confirmado? (se necessário)')
  console.log('   3. Há políticas RLS bloqueando o acesso?')
  console.log('   4. As variáveis de ambiente estão corretas na Vercel?')
}

const email = process.argv[2]

if (!email) {
  console.error('Uso: tsx scripts/check-user-auth-status.ts <email>')
  process.exit(1)
}

checkUserAuthStatus(email).catch(console.error)
