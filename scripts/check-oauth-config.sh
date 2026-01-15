#!/bin/bash

# Script para verificar configuração OAuth via Google Cloud API
# Requer: gcloud CLI configurado e autenticado

PROJECT_ID="ntraining-484414"

echo "🔍 Verificando configuração OAuth para projeto: $PROJECT_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar projeto
echo "📋 1. Verificando projeto..."
gcloud projects describe $PROJECT_ID --format="value(projectId,name)" 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Erro: Projeto não encontrado ou sem permissões"
    exit 1
fi
echo "✅ Projeto encontrado"
echo ""

# Verificar OAuth API habilitada
echo "📋 2. Verificando se OAuth2 API está habilitada..."
OAUTH_ENABLED=$(gcloud services list --enabled --filter="name:oauth2.googleapis.com" --format="value(name)" 2>&1)
if [ -z "$OAUTH_ENABLED" ]; then
    echo "⚠️  OAuth2 API pode não estar habilitada"
    echo "   Execute: gcloud services enable oauth2.googleapis.com"
else
    echo "✅ OAuth2 API habilitada"
fi
echo ""

# Tentar listar OAuth clients (requer permissões específicas)
echo "📋 3. Verificando OAuth Clients..."
echo "   (Isso pode falhar se não tiver permissões de IAP)"
gcloud alpha iap oauth-clients list --format="table(name,displayName)" 2>&1 | head -20
echo ""

# Verificar configuração via API REST (requer access token)
echo "📋 4. Verificando configuração via API REST..."
ACCESS_TOKEN=$(gcloud auth print-access-token 2>&1)

if [ -z "$ACCESS_TOKEN" ] || [[ "$ACCESS_TOKEN" == *"ERROR"* ]]; then
    echo "⚠️  Não foi possível obter access token"
    echo "   Execute: gcloud auth login"
else
    echo "✅ Access token obtido"
    
    # Tentar listar OAuth clients via API REST
    echo "   Tentando listar OAuth clients..."
    RESPONSE=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
        "https://www.googleapis.com/oauth2/v1/clientinfo?project=$PROJECT_ID" 2>&1)
    
    if [[ "$RESPONSE" == *"error"* ]] || [[ "$RESPONSE" == *"Error"* ]]; then
        echo "⚠️  Erro ao acessar API OAuth:"
        echo "$RESPONSE" | head -5
    else
        echo "$RESPONSE" | head -20
    fi
fi
echo ""

# Informações importantes
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 INFORMAÇÕES IMPORTANTES:"
echo ""
echo "1. OAuth Consent Screen:"
echo "   https://console.cloud.google.com/apis/credentials/consent?project=$PROJECT_ID"
echo ""
echo "2. OAuth Client IDs:"
echo "   https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
echo "3. Erro 'acesso bloqueado' geralmente indica:"
echo "   - OAuth Consent Screen em modo 'Testing' sem você na lista de test users"
echo "   - Domínios não autorizados na tela de consentimento"
echo "   - URLs de redirect não correspondem exatamente"
echo ""
echo "4. Solução rápida:"
echo "   a) Acesse a OAuth Consent Screen via link acima"
echo "   b) Se estiver em 'Testing', adicione seu email aos 'Test users'"
echo "   c) Ou publique o app para permitir acesso a todos"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
