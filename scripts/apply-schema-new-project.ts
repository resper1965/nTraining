import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

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

async function applySchema() {
  console.log('\n🚀 Aplicando schema base no novo projeto Supabase...\n')

  try {
    // Ler o schema.sql
    const schemaPath = join(process.cwd(), 'lib/supabase/schema.sql')
    const schemaSQL = readFileSync(schemaPath, 'utf-8')

    // Dividir em comandos individuais (aproximação)
    // Na prática, vamos executar o SQL completo
    console.log('📝 Executando schema.sql...')
    
    // Executar via REST API (rpc não funciona para DDL)
    // Vamos usar execute_sql via MCP ou criar um script alternativo
    
    // Por enquanto, vamos apenas verificar a conexão
    const { data, error } = await supabaseAdmin.from('organizations').select('count').limit(1)
    
    if (error && error.code === '42P01') {
      console.log('✅ Projeto conectado (tabela organizations ainda não existe - esperado)')
      console.log('\n⚠️  Para aplicar o schema, você precisa:')
      console.log('   1. Acessar o Supabase SQL Editor')
      console.log('   2. Copiar o conteúdo de lib/supabase/schema.sql')
      console.log('   3. Executar no SQL Editor')
      console.log('\n   Ou me informe se quer que eu crie um script alternativo.')
    } else if (error) {
      console.error('❌ Erro ao conectar:', error.message)
    } else {
      console.log('✅ Conexão estabelecida com sucesso!')
    }

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

applySchema().catch(console.error)
