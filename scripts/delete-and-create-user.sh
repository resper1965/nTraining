#!/bin/bash
# Script para deletar e recriar usuário completamente

set -e

if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

EMAIL="${1:-resper@ness.com.br}"
PASSWORD="${2:-Gordinh@29}"
FULL_NAME="${3:-Resper}"
IS_SUPERADMIN="${4:-true}"

PROJECT_ID=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co.*|\1|')

echo "🗑️  Deletando usuário existente..."
echo ""

# 1. Buscar ID do usuário
USER_ID=$(curl -s -X GET "https://${PROJECT_ID}.supabase.co/auth/v1/admin/users?email=$EMAIL" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" | jq -r '.users[0].id' 2>/dev/null || echo "")

if [ -n "$USER_ID" ] && [ "$USER_ID" != "null" ]; then
  echo "📋 Usuário encontrado (ID: $USER_ID)"
  
  # Deletar do auth
  echo "🗑️  Deletando do auth.users..."
  curl -s -X DELETE "https://${PROJECT_ID}.supabase.co/auth/v1/admin/users/$USER_ID" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" > /dev/null
  
  echo "✅ Deletado do auth.users"
  
  # Aguardar um pouco para garantir que foi deletado
  sleep 1
else
  echo "ℹ️  Usuário não encontrado no auth.users"
fi

echo ""
echo "👤 Criando novo usuário..."
echo ""

# 2. Criar novo usuário
RESPONSE=$(curl -s -X POST "https://${PROJECT_ID}.supabase.co/auth/v1/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"email_confirm\": true,
    \"user_metadata\": {\"full_name\": \"$FULL_NAME\"}
  }")

# Extrair ID
NEW_USER_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"\([^"]*\)"/\1/' || echo "")

if [ -z "$NEW_USER_ID" ]; then
  if echo "$RESPONSE" | grep -q "email_exists"; then
    echo "❌ Usuário ainda existe. Aguarde alguns segundos e tente novamente."
    exit 1
  fi
  echo "❌ Erro: $RESPONSE"
  exit 1
fi

echo "✅ Usuário criado no auth (ID: $NEW_USER_ID)"

# 3. Aguardar trigger criar na tabela users, depois atualizar
sleep 2

echo "📝 Atualizando tabela users..."
UPDATE_RESPONSE=$(curl -s -X PATCH "https://${PROJECT_ID}.supabase.co/rest/v1/users?id=eq.$NEW_USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Prefer: return=representation" \
  -d "{
    \"full_name\": \"$FULL_NAME\",
    \"is_superadmin\": $IS_SUPERADMIN,
    \"role\": \"platform_admin\",
    \"is_active\": true
  }")

echo "✅ Tabela users atualizada"
echo ""
echo "============================================================"
echo "✅ USUÁRIO CRIADO COM SUCESSO!"
echo "============================================================"
echo "📧 Email: $EMAIL"
echo "👤 Nome: $FULL_NAME"
echo "🆔 ID: $NEW_USER_ID"
echo "👑 Superadmin: $IS_SUPERADMIN"
echo "✅ Status: Ativo"
echo "============================================================"
echo ""
echo "🎉 Você já pode fazer login!"
