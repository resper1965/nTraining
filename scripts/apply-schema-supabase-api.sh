#!/bin/bash

# Script para aplicar schema completo via API REST do Supabase
# Usa a service role key para executar SQL

set -e

# Carregar variáveis de ambiente
if [ -f .env.local ]; then
  export $(cat .env.local | grep -E '^(NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY)=' | xargs)
fi

SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ Variáveis de ambiente não configuradas!"
  echo "NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL:-'NÃO DEFINIDO'}"
  echo "SUPABASE_SERVICE_ROLE_KEY: ${SERVICE_ROLE_KEY:-'NÃO DEFINIDO'}"
  exit 1
fi

echo "🚀 Aplicando schema completo no Supabase..."
echo "📍 URL: $SUPABASE_URL"
echo ""

# Ler o arquivo SQL
SQL_FILE="lib/supabase/migrations/000_setup_completo_novo_projeto.sql"

if [ ! -f "$SQL_FILE" ]; then
  echo "❌ Arquivo SQL não encontrado: $SQL_FILE"
  exit 1
fi

SQL_CONTENT=$(cat "$SQL_FILE")

echo "📝 Lendo arquivo SQL ($(wc -l < "$SQL_FILE" | tr -d ' ') linhas)..."
echo ""

# A API REST do Supabase não executa SQL diretamente
# Vamos usar o endpoint RPC ou criar um script Node.js com @supabase/supabase-js
echo "⚠️  A API REST do Supabase não executa SQL DDL diretamente."
echo "   Vou criar um script Node.js para executar via cliente Supabase..."
echo ""

# Criar script Node.js temporário
cat > /tmp/apply_schema.js << 'EOFJS'
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applySchema() {
  const sqlFile = path.join(process.cwd(), 'lib/supabase/migrations/000_setup_completo_novo_projeto.sql');
  const sql = fs.readFileSync(sqlFile, 'utf-8');
  
  console.log('📝 Executando SQL...');
  
  // Dividir SQL em comandos individuais (aproximação)
  // Na prática, vamos usar o endpoint rpc se disponível
  // Ou executar via SQL Editor manualmente
  
  // Por enquanto, vamos apenas verificar conexão
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      console.error('❌ Erro ao executar SQL:', error);
      console.log('');
      console.log('⚠️  O Supabase não tem um endpoint RPC para executar SQL diretamente.');
      console.log('   Você precisa aplicar o SQL manualmente via SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/sql/new');
      console.log('');
      console.log('   Ou usar a ferramenta de migrações do Supabase CLI.');
      process.exit(1);
    }
    console.log('✅ Schema aplicado com sucesso!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.log('');
    console.log('⚠️  Não é possível executar SQL via API REST.');
    console.log('   Aplicação manual necessária via SQL Editor do Supabase.');
    process.exit(1);
  }
}

applySchema();
EOFJS

echo "❌ Não é possível executar SQL DDL via API REST do Supabase."
echo ""
echo "📋 SOLUÇÃO: Você precisa aplicar o schema manualmente:"
echo ""
echo "   1. Acesse o SQL Editor:"
echo "      https://supabase.com/dashboard/project/srrbomtdkghjxdhpeyel/sql/new"
echo ""
echo "   2. Copie o conteúdo do arquivo:"
echo "      lib/supabase/migrations/000_setup_completo_novo_projeto.sql"
echo ""
echo "   3. Cole no SQL Editor e execute (Run)"
echo ""
echo "   4. Após aplicar, me avise para criar os usuários via script"
echo ""
