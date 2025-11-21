#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel
# Uso: ./scripts/setup-vercel-env.sh

echo "🚀 Configurando variáveis de ambiente no Vercel para nTraining"
echo ""

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instale com: npm i -g vercel"
    exit 1
fi

# Verificar se está logado
if ! vercel whoami &> /dev/null; then
    echo "🔐 Fazendo login no Vercel..."
    vercel login
fi

echo "📝 Adicionando variáveis de ambiente..."
echo ""

# Adicionar variáveis
echo "1. NEXT_PUBLIC_SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development

echo ""
echo "2. NEXT_PUBLIC_SUPABASE_ANON_KEY"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development

echo ""
echo "3. SUPABASE_SERVICE_ROLE_KEY"
vercel env add SUPABASE_SERVICE_ROLE_KEY production preview development

echo ""
echo "✅ Variáveis de ambiente configuradas!"
echo ""
echo "📦 Para fazer deploy:"
echo "   vercel --prod"
echo ""
echo "🔄 Ou faça um redeploy pelo dashboard do Vercel"

