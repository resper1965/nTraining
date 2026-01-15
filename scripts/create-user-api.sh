#!/bin/bash
# Script para criar usuário via API REST do Supabase
# 
# Uso: ./scripts/create-user-api.sh resper@ness.com.br "Gordinh@29" "Resper" true

set -e

# Carregar variáveis de ambiente
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Parâmetros
EMAIL="${1:-resper@ness.com.br}"
PASSWORD="${2:-Gordinh@29}"
FULL_NAME="${3:-Resper}"
IS_SUPERADMIN="${4:-true}"

# Verificar variáveis
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Variáveis de ambiente não configuradas!"
  echo "NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:+✅}${NEXT_PUBLIC_SUPABASE_URL:-❌}"
  echo "SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY:+✅}${SUPABASE_SERVICE_ROLE_KEY:-❌}"
  exit 1
fi

# Extrair project ID da URL
PROJECT_ID=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co.*|\1|')

echo "🔧 Criando usuário via API REST do Supabase..."
echo "📧 Email: $EMAIL"
echo "👤 Nome: $FULL_NAME"
echo "🔐 Superadmin: $IS_SUPERADMIN"
echo ""

# 0. Verificar e deletar usuário existente se necessário
echo "🔍 Verificando se usuário já existe..."
LIST_RESPONSE=$(curl -s -X GET "https://${PROJECT_ID}.supabase.co/auth/v1/admin/users?email=$EMAIL" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY")

EXISTING_USER_ID=$(echo "$LIST_RESPONSE" | jq -r '.users[0].id' 2>/dev/null || echo "")

if [ -n "$EXISTING_USER_ID" ] && [ "$EXISTING_USER_ID" != "null" ]; then
  echo "⚠️  Usuário já existe (ID: $EXISTING_USER_ID). Deletando..."
  
  # Deletar do auth
  DELETE_RESPONSE=$(curl -s -X DELETE "https://${PROJECT_ID}.supabase.co/auth/v1/admin/users/$EXISTING_USER_ID" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY")
  
  # Deletar da tabela users
  curl -s -X DELETE "https://${PROJECT_ID}.supabase.co/rest/v1/users?id=eq.$EXISTING_USER_ID" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Prefer: return=representation" > /dev/null
  
  echo "✅ Usuário deletado"
  echo ""
fi

# 1. Criar usuário no auth.users via API REST
echo "👤 Criando usuário no Supabase Auth..."
RESPONSE=$(curl -s -X POST "https://${PROJECT_ID}.supabase.co/auth/v1/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"email_confirm\": true,
    \"user_metadata\": {
      \"full_name\": \"$FULL_NAME\"
    }
  }")

# Verificar se houve erro
if echo "$RESPONSE" | grep -q '"code"'; then
  ERROR_CODE=$(echo "$RESPONSE" | jq -r '.code' 2>/dev/null || echo "")
  if [ "$ERROR_CODE" != "null" ] && [ -n "$ERROR_CODE" ]; then
    echo "❌ Erro ao criar usuário:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    exit 1
  fi
fi

# Extrair user ID (tentar jq primeiro, depois grep como fallback)
USER_ID=$(echo "$RESPONSE" | jq -r '.id' 2>/dev/null || echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$USER_ID" ] || [ "$USER_ID" = "null" ]; then
  echo "❌ Não foi possível obter o ID do usuário criado"
  echo "Resposta: $RESPONSE"
  exit 1
fi

echo "✅ Usuário criado no auth.users (ID: $USER_ID)"

# 2. Criar registro na tabela users
echo "📝 Criando registro na tabela users..."

# Determinar role baseado em is_superadmin
ROLE="platform_admin"

INSERT_RESPONSE=$(curl -s -X POST "https://${PROJECT_ID}.supabase.co/rest/v1/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Prefer: return=representation" \
  -d "{
    \"id\": \"$USER_ID\",
    \"email\": \"$EMAIL\",
    \"full_name\": \"$FULL_NAME\",
    \"role\": \"$ROLE\",
    \"organization_id\": null,
    \"is_active\": true,
    \"is_superadmin\": $IS_SUPERADMIN
  }")

if echo "$INSERT_RESPONSE" | grep -q '"error"'; then
  echo "❌ Erro ao criar registro na tabela users:"
  echo "$INSERT_RESPONSE" | jq '.' 2>/dev/null || echo "$INSERT_RESPONSE"
  
  # Tentar deletar do auth
  echo "🗑️  Tentando reverter criação no auth..."
  curl -s -X DELETE "https://${PROJECT_ID}.supabase.co/auth/v1/admin/users/$USER_ID" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" > /dev/null
  
  exit 1
fi

echo "✅ Registro criado na tabela users"

# 3. Resumo
echo ""
echo "============================================================"
echo "✅ USUÁRIO CRIADO COM SUCESSO!"
echo "============================================================"
echo "📧 Email: $EMAIL"
echo "👤 Nome: $FULL_NAME"
echo "🆔 ID: $USER_ID"
echo "👑 Superadmin: $IS_SUPERADMIN"
echo "✅ Status: Ativo"
echo "🔐 Email confirmado: Sim"
echo "============================================================"
echo ""
echo "🎉 Você já pode fazer login com este usuário!"
