#!/bin/bash

# Script para criar usuários no novo projeto Supabase

set -e

# Carregar variáveis de ambiente
if [ -f .env.local ]; then
  export $(cat .env.local | grep -E '^(NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY)=' | xargs)
fi

SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ Variáveis de ambiente não configuradas!"
  exit 1
fi

echo "👤 Criando usuários no novo projeto Supabase..."
echo "📍 URL: $SUPABASE_URL"
echo ""

# Usar o script create-user-api.sh que já existe
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Criando resper@ness.com.br (Superadmin)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
"$SCRIPT_DIR/create-user-api.sh" \
  "resper@ness.com.br" \
  "Gordinh@29" \
  "Ricardo Esper" \
  "true" \
  "platform_admin" \
  "null" \
  "5511983397196"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Criando myoshida@ness.com.br"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
"$SCRIPT_DIR/create-user-api.sh" \
  "myoshida@ness.com.br" \
  "Pip0c@64" \
  "Monica Yoshida" \
  "false" \
  "platform_admin" \
  "null" \
  "null"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Usuários criados com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
