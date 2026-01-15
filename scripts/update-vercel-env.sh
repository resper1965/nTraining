#!/bin/bash

# Script para atualizar variáveis de ambiente no Vercel
# Usa as variáveis do .env.local

set -e

echo "🔄 Atualizando variáveis de ambiente no Vercel..."

# Carregar variáveis do .env.local
if [ ! -f .env.local ]; then
  echo "❌ Arquivo .env.local não encontrado!"
  exit 1
fi

export $(cat .env.local | grep -E '^(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)=' | xargs)

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Variáveis não encontradas no .env.local!"
  exit 1
fi

echo "📝 Variáveis encontradas:"
echo "   NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:0:40}..."
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:40}..."
echo "   SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:0:40}..."

# Função para atualizar variável
update_env_var() {
  local var_name=$1
  local var_value=$2
  local env=$3
  
  echo ""
  echo "🔄 Atualizando $var_name em $env..."
  
  # Tentar remover (pode falhar se não existir, mas não importa)
  vercel env rm "$var_name" "$env" --yes 2>/dev/null || true
  
  # Adicionar nova
  echo "$var_value" | vercel env add "$var_name" "$env"
}

# Atualizar para cada ambiente
for env in production preview development; do
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📍 Ambiente: $env"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  update_env_var "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL" "$env"
  update_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY" "$env"
  update_env_var "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY" "$env"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Variáveis atualizadas com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  Importante: Faça um redeploy para aplicar as mudanças:"
echo "   vercel --prod"
echo ""
