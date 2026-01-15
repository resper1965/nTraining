# 🔍 Diagnóstico Google OAuth - Erro "client deleted"

## ⚠️ Problema Persistente
Mesmo após recriar o cliente OAuth, o erro `Error 401: deleted_client` continua aparecendo.

## 🔍 Checklist de Verificação

### 1. Verificar se o Cliente OAuth Existe no Google Cloud Console

1. Acesse: https://console.cloud.google.com/apis/credentials?project=ntraining-484414
2. Procure na lista de "OAuth 2.0 Client IDs"
3. Verifique se existe um cliente chamado "n.training Web Client"
4. **Se não existir**: Crie um novo (veja Passo 2)
5. **Se existir**: Clique nele e verifique:
   - Status: Deve estar **"Enabled"** ou **"Ativo"**
   - Se estiver deletado ou desabilitado, crie um novo

### 2. Verificar URLs no Cliente OAuth

**Authorized JavaScript origins** (deve ter exatamente estas 3):
```
https://qaekhnagfzpwprvaxqwt.supabase.co
https://n-training.vercel.app
http://localhost:3000
```

**Authorized redirect URIs** (deve ter exatamente estas 3):
```
https://qaekhnagfzpwprvaxqwt.supabase.co/auth/v1/callback
https://n-training.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

⚠️ **IMPORTANTE**: 
- Verifique se não há espaços extras
- Verifique se não há barras no final
- Verifique se está usando `https://` (não `http://`) para produção

### 3. Verificar OAuth Consent Screen

1. Acesse: https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
2. Verifique:
   - **User Type**: Deve ser **"External"**
   - **App status**: Deve estar **"In production"** ou **"Testing"**
   - Se estiver em "Testing", adicione seu email como test user

### 4. Verificar Credenciais no Supabase

1. Acesse: https://supabase.com/dashboard/project/qaekhnagfzpwprvaxqwt/auth/providers
2. Clique em **"Google"**
3. Verifique:
   - **Enable Google provider**: Deve estar **ATIVO** (toggle ON)
   - **Client ID**: Deve ser o mesmo do Google Cloud Console
   - **Client Secret**: Deve ser o mesmo do Google Cloud Console
4. **Se estiver diferente**: 
   - Copie o Client ID e Client Secret do Google Cloud Console
   - Cole no Supabase
   - Clique em **"Save"**
   - Aguarde alguns segundos

### 5. Limpar Cache e Testar

1. **Limpar cache do navegador:**
   - Chrome/Edge: `Ctrl+Shift+Delete` → Limpar cache e cookies
   - Ou use modo anônimo/privado

2. **Aguardar propagação:**
   - Mudanças no Google Cloud podem levar 5-10 minutos
   - Mudanças no Supabase são instantâneas

3. **Testar novamente:**
   - Acesse: https://n-training.vercel.app/auth/login
   - Clique em "Continuar com Google"
   - Verifique se funciona

### 6. Verificar se o Cliente OAuth Foi Deletado Novamente

Se o erro persistir, pode ser que:
- O cliente foi deletado novamente (verifique no Google Cloud Console)
- Há múltiplos clientes OAuth e está usando o ID errado
- O projeto Google Cloud está incorreto

**Solução:**
1. Liste todos os OAuth Client IDs no Google Cloud Console
2. Delete todos os clientes antigos/deletados
3. Crie um NOVO cliente OAuth com um nome diferente (ex: `n.training Web Client v2`)
4. Copie as novas credenciais
5. Atualize no Supabase

## 🚨 Problemas Comuns

### Problema 1: Cliente OAuth foi deletado novamente
**Causa**: Pode ter sido deletado acidentalmente ou por política de segurança
**Solução**: Criar novo cliente e atualizar no Supabase

### Problema 2: Client ID/Secret incorretos no Supabase
**Causa**: Credenciais não foram atualizadas corretamente
**Solução**: Verificar e atualizar manualmente no Supabase

### Problema 3: URLs de redirect incorretas
**Causa**: URLs não correspondem exatamente
**Solução**: Verificar e corrigir URLs no Google Cloud Console

### Problema 4: OAuth Consent Screen não configurado
**Causa**: Tela de consentimento não está configurada
**Solução**: Configurar OAuth Consent Screen como "External"

## 📝 Passos para Recriar do Zero

1. **No Google Cloud Console:**
   - Delete todos os clientes OAuth antigos
   - Crie um novo cliente OAuth
   - Copie Client ID e Client Secret

2. **No Supabase:**
   - Desative o Google provider (toggle OFF)
   - Salve
   - Ative novamente (toggle ON)
   - Cole o novo Client ID
   - Cole o novo Client Secret
   - Salve

3. **Aguardar e testar:**
   - Aguarde 5-10 minutos
   - Limpe cache do navegador
   - Teste o login

## 🔗 Links Úteis

- **Google Cloud Console Credentials**: https://console.cloud.google.com/apis/credentials?project=ntraining-484414
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent?project=ntraining-484414
- **Supabase Auth Providers**: https://supabase.com/dashboard/project/qaekhnagfzpwprvaxqwt/auth/providers

---

**Se o problema persistir após seguir todos os passos, verifique:**
1. Se você tem permissões para gerenciar OAuth no Google Cloud Console
2. Se o projeto `ntraining-484414` está correto
3. Se há algum bloqueio de segurança no Google Cloud Console
