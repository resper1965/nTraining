import { createClient } from '@supabase/supabase-js'

// Carregar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin(email: string, password: string) {
  console.log(`\n🔐 Testando login para: ${email}\n`)

  // 1. Tentar fazer login
  console.log('1️⃣ Fazendo login...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    console.error('❌ Erro no login:', authError.message)
    console.error('   Código:', authError.status)
    return
  }

  if (!authData.user || !authData.session) {
    console.error('❌ Login retornou sem usuário ou sessão')
    return
  }

  console.log('✅ Login bem-sucedido!')
  console.log(`   User ID: ${authData.user.id}`)
  console.log(`   Email: ${authData.user.email}`)
  console.log(`   Session exists: ${!!authData.session}`)

  // 2. Definir a sessão
  console.log('\n2️⃣ Definindo sessão...')
  const { error: setSessionError } = await supabase.auth.setSession({
    access_token: authData.session.access_token,
    refresh_token: authData.session.refresh_token,
  })

  if (setSessionError) {
    console.error('❌ Erro ao definir sessão:', setSessionError.message)
    return
  }

  console.log('✅ Sessão definida')

  // 3. Verificar usuário atual
  console.log('\n3️⃣ Verificando usuário atual...')
  const { data: { user: currentUser }, error: getUserError } = await supabase.auth.getUser()

  if (getUserError) {
    console.error('❌ Erro ao obter usuário:', getUserError.message)
    return
  }

  if (!currentUser) {
    console.error('❌ Nenhum usuário encontrado após definir sessão')
    return
  }

  console.log('✅ Usuário atual obtido:')
  console.log(`   ID: ${currentUser.id}`)
  console.log(`   Email: ${currentUser.email}`)

  // 4. Buscar dados do usuário na tabela users
  console.log('\n4️⃣ Buscando dados do usuário na tabela users...')
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (userDataError) {
    console.error('❌ Erro ao buscar usuário na tabela users:')
    console.error('   Código:', userDataError.code)
    console.error('   Mensagem:', userDataError.message)
    console.error('   Detalhes:', userDataError.details)
    console.error('   Hint:', userDataError.hint)
    
    if (userDataError.code === 'PGRST301' || userDataError.message?.includes('permission denied')) {
      console.error('\n⚠️ PROBLEMA IDENTIFICADO: Erro de permissão (RLS)!')
      console.error('   A política RLS está bloqueando o acesso à tabela users.')
      console.error('   Isso pode acontecer se auth.uid() não estiver disponível após o login.')
    }
    return
  }

  if (!userData) {
    console.error('❌ Nenhum dado encontrado na tabela users')
    return
  }

  console.log('✅ Dados do usuário encontrados:')
  console.log(`   ID: ${userData.id}`)
  console.log(`   Email: ${userData.email}`)
  console.log(`   Nome: ${userData.full_name}`)
  console.log(`   Ativo: ${userData.is_active}`)
  console.log(`   Superadmin: ${userData.is_superadmin}`)

  console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!')
}

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Uso: tsx scripts/test-login.ts <email> <senha>')
  process.exit(1)
}

testLogin(email, password).catch(console.error)
