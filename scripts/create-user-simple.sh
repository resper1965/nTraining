#!/bin/bash
# Script simplificado para criar usuário via API REST do Supabase
# Primeiro deleta se existir, depois cria

set -e

# Carregar variáveis
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

EMAIL="${1:-resper@ness.com.br}"
PASSWORD="${2:-Gordinh@29}"
FULL_NAME="${3:-Resper}"
IS_SUPERADMIN="${4:-true}"

PROJECT_ID=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co.*|\1|')

echo "🔧 Criando usuário: $EMAIL"
echo ""

# 1. Buscar e deletar usuário existente via SQL (mais confiável)
echo "🔍 Verificando usuário existente..."
USER_DATA=$(psql "$DATABASE_URL" -t -c "SELECT id FROM users WHERE email = '$EMAIL' LIMIT 1;" 2>/dev/null || echo "")

if [ -n "$USER_DATA" ]; then
  USER_ID=$(echo "$USER_DATA" | xargs)
  echo "⚠️  Usuário encontrado (ID: $USER_ID). Deletando..."
  
  # Deletar via API
  curl -s -X DELETE "https://${PROJECT_ID}.supabase.co/auth/v1/admin/users/$USER_ID" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" > /dev/null
  
  echo "✅ Deletado"
  echo ""
fi

# 2. Criar novo usuário
echo "👤 Criando usuário..."
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

# Extrair ID (tentar múltiplas formas)
USER_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | sed 's/"id":"\([^"]*\)"/\1/' || echo "")

if [ -z "$USER_ID" ]; then
  if echo "$RESPONSE" | grep -q "email_exists"; then
    echo "❌ Usuário já existe. Tente deletar manualmente primeiro."
    echo "   Ou use: DELETE FROM users WHERE email = '$EMAIL';"
    exit 1
  fi
  echo "❌ Erro ao criar: $RESPONSE"
  exit 1
fi

echo "✅ Usuário criado no auth (ID: $USER_ID)"

# 3. Atualizar na tabela users (o trigger já criou, mas vamos garantir)
echo "📝 Atualizando tabela users..."
curl -s -X PATCH "https://${PROJECT_ID}.supabase.co/rest/v1/users?id=eq.$USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Prefer: return=representation" \
  -d "{
    \"full_name\": \"$FULL_NAME\",
    \"is_superadmin\": $IS_SUPERADMIN,
    \"role\": \"platform_admin\",
    \"is_active\": true
  }" > /dev/null

echo "✅ Tabela users atualizada"
echo ""
echo "============================================================"
echo "✅ USUÁRIO CRIADO COM SUCESSO!"
echo "============================================================"
echo "📧 Email: $EMAIL"
echo "🆔 ID: $USER_ID"
echo "👑 Superadmin: $IS_SUPERADMIN"
echo "============================================================"
