#!/bin/bash
# Script para configurar OAuth do Google via GCP CLI
# Projeto: nTraining (ntraining-484414)

set -e

PROJECT_ID="ntraining-484414"
PROJECT_NAME="nTraining"
SUPABASE_URL="https://dcigykpfdehqbtbaxzak.supabase.co"
APP_URL="https://n-training.vercel.app"

echo "🔧 Configurando OAuth do Google para $PROJECT_NAME"
echo "=================================================="
echo ""

# 1. Verificar se está logado
echo "1️⃣ Verificando autenticação..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Você não está autenticado no GCP"
    echo "   Execute: gcloud auth login"
    exit 1
fi
echo "✅ Autenticado"
echo ""

# 2. Configurar projeto
echo "2️⃣ Configurando projeto..."
gcloud config set project $PROJECT_ID
echo "✅ Projeto configurado: $PROJECT_ID"
echo ""

# 3. Habilitar APIs necessárias
echo "3️⃣ Habilitando APIs necessárias..."
gcloud services enable oauth2.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudresourcemanager.googleapis.com --project=$PROJECT_ID
gcloud services enable iamcredentials.googleapis.com --project=$PROJECT_ID
echo "✅ APIs habilitadas"
echo ""

# 4. Criar OAuth Consent Screen (se necessário)
echo "4️⃣ Verificando OAuth Consent Screen..."
CONSENT_SCREEN=$(gcloud alpha iap oauth-brands list --project=$PROJECT_ID 2>/dev/null | grep -c "name:" || echo "0")

if [ "$CONSENT_SCREEN" -eq "0" ]; then
    echo "⚠️  OAuth Consent Screen não encontrado"
    echo "   Você precisa criar manualmente no Console:"
    echo "   https://console.cloud.google.com/apis/credentials/consent?project=$PROJECT_ID"
    echo ""
    echo "   Configurações recomendadas:"
    echo "   - User Type: External"
    echo "   - App name: n.training"
    echo "   - User support email: seu@email.com"
    echo "   - Developer contact: seu@email.com"
    echo "   - Scopes: email, profile, openid"
    echo ""
    read -p "Pressione Enter após criar o Consent Screen..."
else
    echo "✅ OAuth Consent Screen encontrado"
fi
echo ""

# 5. Criar credenciais OAuth 2.0
echo "5️⃣ Criando credenciais OAuth 2.0..."
echo ""

# Obter OAuth Client ID (se já existir)
EXISTING_CLIENT=$(gcloud alpha iap oauth-clients list --project=$PROJECT_ID 2>/dev/null | grep -o "name: [^ ]*" | head -1 | cut -d' ' -f2 || echo "")

if [ -z "$EXISTING_CLIENT" ]; then
    echo "⚠️  Não foi possível criar via CLI automaticamente"
    echo "   Você precisa criar manualmente no Console:"
    echo "   https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
    echo ""
    echo "   Passos:"
    echo "   1. Clique em 'Create Credentials' → 'OAuth client ID'"
    echo "   2. Application type: Web application"
    echo "   3. Name: n.training Web Client"
    echo "   4. Authorized redirect URIs:"
    echo "      - $SUPABASE_URL/auth/v1/callback"
    echo "      - $APP_URL/auth/callback (se necessário)"
    echo "   5. Clique em 'Create'"
    echo ""
    read -p "Pressione Enter após criar as credenciais..."
else
    echo "✅ Credenciais encontradas: $EXISTING_CLIENT"
fi
echo ""

# 6. Obter Client ID e Secret
echo "6️⃣ Obtendo Client ID e Secret..."
echo ""
echo "⚠️  Você precisa obter manualmente do Console:"
echo "   https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
echo "   Procure por 'OAuth 2.0 Client IDs' e copie:"
echo "   - Client ID"
echo "   - Client Secret"
echo ""

# 7. Instruções para Supabase
echo "7️⃣ Configuração no Supabase"
echo "============================"
echo ""
echo "Após obter as credenciais, configure no Supabase:"
echo ""
echo "1. Acesse: https://supabase.com/dashboard/project/dcigykpfdehqbtbaxzak/auth/providers"
echo ""
echo "2. Clique em 'Google'"
echo ""
echo "3. Preencha:"
echo "   - Enable Google provider: ON"
echo "   - Client ID (from Google): [cole aqui]"
echo "   - Client Secret (from Google): [cole aqui]"
echo ""
echo "4. Clique em 'Save'"
echo ""
echo "✅ Configuração concluída!"
echo ""
